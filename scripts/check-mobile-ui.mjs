#!/usr/bin/env node
/**
 * Mobile UI regression guard.
 *
 * Asserts the invariants that the July 2026 mobile typography/spacing audit
 * fixed, so they cannot silently regress:
 *
 *   1. No horizontal page scroll at any mobile viewport.
 *   2. No element rendering wider than the viewport (the `p-20` = 80px class of
 *      bug, where an undeclared numeric spacing key silently falls back to
 *      Tailwind's rem scale).
 *   3. Every interactive control is >= 24x24 CSS px (WCAG 2.5.8 Level AA).
 *   4. Every text input is >= 16px (below that, iOS force-zooms on focus).
 *   5. Text survives the WCAG 1.4.12 text-spacing override without clipping.
 *
 * Usage:  node scripts/check-mobile-ui.mjs [baseUrl]
 * Requires a running server (npm run dev, or npm run start after a build)
 * and Playwright available on the module path.
 */

import { chromium } from 'playwright';

const BASE = process.argv[2] || process.env.BASE_URL || 'http://localhost:3000';

const ROUTES = [
  '/',
  '/work',
  '/work/ai-hr-system',
  '/blog',
  '/blog/rag-in-production-real-world',
  '/contact',
  '/certifications',
  '/coding',
  '/skills-services',
  '/experience-education',
];

const VIEWPORTS = [
  { label: 'XS', width: 320, height: 568 },
  { label: 'S', width: 360, height: 800 },
  { label: 'M', width: 390, height: 844 },
  { label: 'Fold', width: 280, height: 653 },
];

/** Interactive controls that WCAG 2.5.8 exempts or that we measure elsewhere. */
const TAP_EXEMPT = `
  a:where(p a, li a, blockquote a, figcaption a),
  [aria-hidden="true"], [aria-hidden="true"] *,
  svg *, .recharts-wrapper *
`;

const failures = [];
const fail = (route, vp, msg) => failures.push(`${route} @${vp}: ${msg}`);

/** Scroll the full page so IntersectionObserver reveals settle before measuring. */
async function settle(page) {
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y < h; y += 300) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 600));
  });
  await page.evaluate(() => document.fonts?.ready).catch(() => {});
}

const browser = await chromium.launch();

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  for (const route of ROUTES) {
    const page = await ctx.newPage();
    try {
      const res = await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 60000 });
      if (!res || res.status() >= 400) {
        fail(route, vp.label, `HTTP ${res ? res.status() : 'no response'}`);
        await page.close();
        continue;
      }
      await settle(page);

      const r = await page.evaluate((exempt) => {
        const vw = document.documentElement.clientWidth;
        const out = { vw, scrollW: document.documentElement.scrollWidth, wide: [], taps: [], inputs: [] };

        // (2) elements wider than the viewport, ignoring anything a scroll
        // container or `overflow: hidden` ancestor legitimately clips.
        const clipped = (el) => {
          let n = el.parentElement;
          while (n && n !== document.body) {
            const o = getComputedStyle(n).overflowX;
            if (o === 'hidden' || o === 'auto' || o === 'scroll' || o === 'clip') return true;
            n = n.parentElement;
          }
          return false;
        };
        const sel = (el) => {
          const parts = [];
          let n = el;
          while (n && n.nodeType === 1 && parts.length < 3) {
            let p = n.tagName.toLowerCase();
            if (n.classList.length) p += '.' + [...n.classList].slice(0, 2).join('.');
            parts.unshift(p);
            n = n.parentElement;
          }
          return parts.join(' > ');
        };
        const visible = (el) => {
          const s = getComputedStyle(el);
          if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return false;
          const b = el.getBoundingClientRect();
          return b.width > 0 && b.height > 0;
        };

        document.querySelectorAll('body *').forEach((el) => {
          if (!visible(el)) return;
          const b = el.getBoundingClientRect();
          if (b.right > vw + 1 && !clipped(el) && getComputedStyle(el).position !== 'fixed') {
            out.wide.push({ selector: sel(el), overflowBy: Math.round(b.right - vw), width: Math.round(b.width) });
          }
        });

        // (3) tap targets
        const q =
          'a[href],button,input:not([type=hidden]),select,textarea,summary,[role=button],[role=link],[role=tab],[role=switch]';
        const exemptSet = new Set(document.querySelectorAll(exempt));
        document.querySelectorAll(q).forEach((el) => {
          if (!visible(el) || exemptSet.has(el)) return;
          const b = el.getBoundingClientRect();
          if (b.width < 24 || b.height < 24) {
            out.taps.push({
              selector: sel(el),
              label: (el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 30),
              w: Math.round(b.width),
              h: Math.round(b.height),
            });
          }
        });

        // (4) input font-size
        document.querySelectorAll('input:not([type=hidden]),select,textarea').forEach((el) => {
          if (!visible(el)) return;
          const fs = parseFloat(getComputedStyle(el).fontSize);
          if (fs < 16) out.inputs.push({ selector: sel(el), fontSizePx: fs });
        });

        return out;
      }, TAP_EXEMPT);

      // (1) page-level horizontal scroll
      if (r.scrollW > r.vw + 1) {
        fail(route, vp.label, `horizontal page scroll: scrollWidth ${r.scrollW} > clientWidth ${r.vw}`);
      }
      for (const w of r.wide.slice(0, 5)) {
        fail(route, vp.label, `element overflows viewport by ${w.overflowBy}px (w=${w.width}) — ${w.selector}`);
      }
      for (const t of r.taps.slice(0, 8)) {
        fail(route, vp.label, `tap target ${t.w}x${t.h} < 24x24 "${t.label}" — ${t.selector}`);
      }
      for (const i of r.inputs) {
        fail(route, vp.label, `input font-size ${i.fontSizePx}px < 16px (iOS force-zoom) — ${i.selector}`);
      }

      // (5) WCAG 1.4.12 text-spacing override must not clip text
      await page.evaluate(() => {
        const st = document.createElement('style');
        st.id = '__tsOverride';
        st.textContent = `*:not(script):not(style):not(svg *){
          line-height:1.5 !important; letter-spacing:0.12em !important; word-spacing:0.16em !important; }
          p,li,blockquote,figcaption{ margin-bottom:2em !important; }`;
        document.head.appendChild(st);
      });
      await page.waitForTimeout(300);
      const clip = await page.evaluate(() => {
        const out = [];
        document.querySelectorAll('body *').forEach((el) => {
          const s = getComputedStyle(el);
          if (s.display === 'none' || s.visibility === 'hidden') return;
          const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 3);
          if (!hasText) return;
          const hidden = s.overflow === 'hidden' || s.overflowY === 'hidden' || s.overflowX === 'hidden';
          if (hidden && (el.scrollHeight > el.clientHeight + 2 || el.scrollWidth > el.clientWidth + 2)) {
            out.push((el.innerText || '').trim().slice(0, 40));
          }
        });
        return out.slice(0, 5);
      });
      for (const c of clip) {
        fail(route, vp.label, `WCAG 1.4.12: text clipped under spacing override — "${c}"`);
      }
    } catch (e) {
      fail(route, vp.label, `error: ${String(e).slice(0, 160)}`);
    }
    await page.close();
  }
  await ctx.close();
}

await browser.close();

if (failures.length) {
  console.error(`\n✗ ${failures.length} mobile UI regression(s):\n`);
  for (const f of failures) console.error('  ' + f);
  process.exit(1);
}
console.log(`✓ mobile UI checks passed (${ROUTES.length} routes × ${VIEWPORTS.length} viewports)`);
