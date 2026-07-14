'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Eye, Maximize2, MessageCircle, Minimize2, Send, X } from 'lucide-react';
import siteJson from '@/content/site.json';
import socialJson from '@/content/social.json';
import { askResumeChatStream, RESUME_CHAT_OPEN_EVENT } from '@/lib/resumeChat';

const SESSION_KEY = 'resume-chat-popup-shown';
const POPUP_DELAY_MS = 11_000;
const BLINK_INTERVAL_MS = 10_000;

// Staged loading copy: cycles through engaging phrases, then — if the Render
// free-tier backend is asleep — escalates into "waking up" messaging past 10s.
const THINKING_PHRASES = ['Thinking…', 'Reading the resume…', 'Matching this to experience…'];
const WAKE_DELAY_MS = 10_000;
const WAKE_RETRY_MS = 10_000;
const THINKING_ROTATE_MS = 2_800;

type ChatMessage = {
  id: string;
  role: 'system' | 'user' | 'assistant' | 'error';
  text: string;
};

const firstName = siteJson.name.split(' ')[0];
const RESUME_PATH = '/resume/Ravin-resume.pdf';

const WHATSAPP_MESSAGE = 'Hey! Hii, I want to enquire a new project with you.';
const whatsappHref = `https://wa.me/${socialJson.phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE,
)}`;

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden>
      <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.34.663 4.523 1.812 6.383L4 29l7.812-1.762A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.75a9.7 9.7 0 0 1-4.958-1.36l-.356-.211-4.636 1.046 1.077-4.518-.232-.371A9.71 9.71 0 0 1 6.25 15c0-5.38 4.375-9.75 9.754-9.75S25.75 9.62 25.75 15s-4.372 9.75-9.746 9.75Zm5.34-7.294c-.293-.147-1.734-.856-2.003-.953-.269-.098-.465-.147-.66.147-.196.293-.758.953-.929 1.148-.171.196-.342.22-.635.073-.293-.147-1.235-.455-2.353-1.451-.87-.776-1.457-1.735-1.628-2.028-.171-.293-.018-.452.129-.598.132-.132.293-.342.44-.513.147-.171.196-.293.293-.489.098-.196.049-.367-.024-.514-.073-.147-.66-1.59-.904-2.177-.238-.573-.48-.495-.66-.504l-.562-.01c-.196 0-.514.073-.783.367-.269.293-1.026 1.002-1.026 2.444s1.051 2.834 1.198 3.03c.147.196 2.07 3.16 5.017 4.431.701.303 1.249.483 1.676.618.704.224 1.344.192 1.85.117.564-.084 1.734-.709 1.979-1.393.244-.685.244-1.271.171-1.393-.073-.123-.269-.196-.562-.343Z" />
    </svg>
  );
}

function initialMessages(): ChatMessage[] {
  return [
    {
      id: 'system-0',
      role: 'system',
      text: `I can only answer questions based on ${siteJson.name}'s resume — ask me about experience, skills, or projects.`,
    },
  ];
}

export function ResumeChatWidget() {
  const shouldReduceMotion = useReducedMotion();
  const [showPopup, setShowPopup] = useState(false);
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(true);
  const [blink, setBlink] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [awaitingFirstToken, setAwaitingFirstToken] = useState(false);
  const [statusText, setStatusText] = useState(THINKING_PHRASES[0]);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragConstraintsRef = useRef<HTMLDivElement>(null);

  // 11s after load, show the popup once per session
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const timer = setTimeout(() => {
      setShowPopup(true);
      sessionStorage.setItem(SESSION_KEY, '1');
    }, POPUP_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  // Every 10s, nudge the closed/minimized FAB with ripple waves so it isn't forgotten
  useEffect(() => {
    if (open) {
      setBlink(false);
      return;
    }

    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 2300);
    }, BLINK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: shouldReduceMotion ? 'auto' : 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Lock page scroll while the chat is in full screen so only the panel scrolls
  useEffect(() => {
    if (!fullscreen) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [fullscreen]);

  const openChat = useCallback(() => {
    setShowPopup(false);
    setMinimized(false);
    setOpen(true);
  }, []);

  // Lets the header nav button (or any other trigger) open the chat
  useEffect(() => {
    window.addEventListener(RESUME_CHAT_OPEN_EVENT, openChat);
    return () => window.removeEventListener(RESUME_CHAT_OPEN_EVENT, openChat);
  }, [openChat]);

  const closeChat = useCallback(() => {
    setOpen(false);
    setMinimized(true);
    setFullscreen(false);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  const toggleFullscreen = useCallback(() => {
    setFullscreen((v) => !v);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  const dismissPopup = useCallback(() => {
    setShowPopup(false);
  }, []);

  const handleSend = useCallback(async () => {
    const question = input.trim();
    if (!question || loading) return;

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', text: question };
    const assistantId = `a-${Date.now()}`;
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setAwaitingFirstToken(true);
    setStatusText(THINKING_PHRASES[0]);

    let streaming = false;
    let rotateIndex = 0;
    const rotateInterval = setInterval(() => {
      rotateIndex = (rotateIndex + 1) % THINKING_PHRASES.length;
      setStatusText(THINKING_PHRASES[rotateIndex]);
    }, THINKING_ROTATE_MS);

    // Past 10s assume the free-tier backend is asleep and is spinning up.
    const wakeTimeout = setTimeout(() => {
      clearInterval(rotateInterval);
      setStatusText("Our backend went to sleep from inactivity — waking it up, give it 10 more seconds…");
    }, WAKE_DELAY_MS);
    const stillWakingTimeout = setTimeout(() => {
      setStatusText('Almost there — still waking up, just a little longer…');
    }, WAKE_DELAY_MS + WAKE_RETRY_MS);

    const clearAllTimers = () => {
      clearInterval(rotateInterval);
      clearTimeout(wakeTimeout);
      clearTimeout(stillWakingTimeout);
    };

    try {
      await askResumeChatStream(question, (deltaText) => {
        if (!streaming) {
          streaming = true;
          clearAllTimers();
          setAwaitingFirstToken(false);
          setMessages((prev) => [
            ...prev,
            { id: assistantId, role: 'assistant', text: deltaText },
          ]);
        } else {
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, text: m.text + deltaText } : m)),
          );
        }
      });
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: `e-${Date.now()}`, role: 'error', text: 'Something went wrong, try again.' },
      ]);
    } finally {
      clearAllTimers();
      setLoading(false);
      setAwaitingFirstToken(false);
    }
  }, [input, loading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Invisible full-viewport bounds so the panel can be dragged anywhere on screen */}
      <div ref={dragConstraintsRef} className="pointer-events-none fixed inset-4 z-40" />

      <div className="fixed bottom-16 right-16 z-50 flex flex-col items-end gap-12 md:bottom-24 md:right-24">
        {/* Toast popup */}
        <AnimatePresence>
          {showPopup && !open && (
            <motion.div
              role="dialog"
              aria-label="Recruiter chat invitation"
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, x: 8 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="relative max-w-[240px] rounded-3xl border border-white/40 bg-paper/95 p-12 shadow-glass backdrop-blur-glass sm:max-w-[280px] sm:p-16"
            >
              <button
                type="button"
                aria-label="Dismiss recruiter chat invitation"
                onClick={dismissPopup}
                className="absolute right-8 top-8 rounded-full p-4 text-ink-faint transition-colors hover:bg-surface-raised hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              >
                <X className="h-[12px] w-[12px] sm:h-[14px] sm:w-[14px]" />
              </button>
              <p className="pr-16 text-body text-ink">
                Are you a recruiter? Ask me anything about {firstName}&apos;s resume.
              </p>
              <button
                type="button"
                onClick={openChat}
                className="mt-12 rounded-full bg-accent px-16 py-8 text-body text-paper transition-colors hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Ask a question
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat panel */}
        <AnimatePresence>
          {open && (
            <motion.div
              role="dialog"
              aria-label="Resume chat"
              drag={!fullscreen}
              dragConstraints={dragConstraintsRef}
              dragMomentum={false}
              dragElastic={0.05}
              onDragEnd={(_, info) => {
                setDragOffset((prev) => ({ x: prev.x + info.offset.x, y: prev.y + info.offset.y }));
              }}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
              animate={
                fullscreen
                  ? { opacity: 1, x: 0, y: 0, scale: 1 }
                  : { opacity: 1, x: dragOffset.x, y: dragOffset.y, scale: 1 }
              }
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={
                fullscreen
                  ? 'fixed inset-0 z-[100] flex h-full w-full flex-col overflow-hidden rounded-none border-0 bg-paper shadow-glass'
                  : 'flex h-[75vh] max-h-[520px] w-[88vw] max-w-[360px] flex-col overflow-hidden rounded-3xl border border-white/40 bg-paper shadow-glass backdrop-blur-glass'
              }
            >
              {/* Header — drag handle */}
              <div
                className={`flex items-center justify-between border-b border-border bg-surface/70 px-12 py-8 sm:px-16 sm:py-12 ${
                  fullscreen ? '' : 'cursor-grab active:cursor-grabbing'
                }`}
              >
                <div className="flex items-center gap-8">
                  <span className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-full bg-accent-subtle text-accent sm:h-[28px] sm:w-[28px] md:h-[32px] md:w-[32px]">
                    <MessageCircle className="h-[13px] w-[13px] sm:h-[15px] sm:w-[15px]" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-ink" style={{ fontSize: '0.9rem' }}>
                      Resume Assistant
                    </p>
                    <p className="truncate text-mono-label font-mono text-ink-faint">{firstName}&apos;s AI helper</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  <button
                    type="button"
                    aria-label={fullscreen ? 'Exit full screen' : 'Expand to full screen'}
                    onClick={toggleFullscreen}
                    className="rounded-full p-[6px] text-ink-faint transition-colors hover:bg-surface-raised hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                  >
                    {fullscreen ? (
                      <Minimize2 className="h-[13px] w-[13px] sm:h-[15px] sm:w-[15px]" />
                    ) : (
                      <Maximize2 className="h-[13px] w-[13px] sm:h-[15px] sm:w-[15px]" />
                    )}
                  </button>
                  <button
                    type="button"
                    aria-label="Close chat"
                    onClick={closeChat}
                    className="rounded-full p-[6px] text-ink-faint transition-colors hover:bg-surface-raised hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                  >
                    <X className="h-[14px] w-[14px] sm:h-[16px] sm:w-[16px]" />
                  </button>
                </div>
              </div>

              {/* Resume actions */}
              <div
                className={`flex shrink-0 items-center gap-6 border-b border-border px-12 py-6 sm:gap-8 sm:px-16 sm:py-8 ${
                  fullscreen ? 'mx-auto w-full max-w-2xl' : ''
                }`}
              >
                <a
                  href={RESUME_PATH}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-4 whitespace-nowrap rounded-full border border-border bg-surface px-8 py-4 text-[11px] font-mono leading-none text-ink-muted transition-colors hover:border-border-strong hover:text-ink sm:px-10 sm:py-[6px] sm:text-mono-label"
                >
                  <Eye className="h-[11px] w-[11px] shrink-0" />
                  View resume
                </a>
              </div>

              {/* Messages */}
              <div
                ref={listRef}
                className={`flex-1 space-y-8 overflow-y-auto px-12 py-12 sm:px-16 sm:py-16 ${
                  fullscreen ? 'mx-auto w-full max-w-2xl' : ''
                }`}
                aria-live="polite"
              >
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className={
                    m.role === 'user'
                      ? 'ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-accent px-12 py-8 text-body text-paper'
                      : m.role === 'error'
                        ? 'max-w-[85%] rounded-2xl rounded-bl-sm bg-signal/10 px-12 py-8 text-body text-signal'
                        : m.role === 'system'
                          ? 'max-w-full rounded-2xl bg-surface px-12 py-8 text-body text-ink-muted'
                          : 'max-w-[85%] rounded-2xl rounded-bl-sm bg-surface-raised px-12 py-8 text-body text-ink'
                  }
                >
                  {m.text}
                </motion.div>
              ))}

              {awaitingFirstToken && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex w-fit max-w-[85%] items-center gap-8 rounded-2xl rounded-bl-sm bg-surface-raised px-12 py-8"
                  aria-live="polite"
                  aria-label="Assistant is typing"
                >
                  <span className="flex shrink-0 items-center gap-4">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-[6px] w-[6px] rounded-full bg-ink-faint"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={statusText}
                      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="text-body text-ink-muted"
                    >
                      {statusText}
                    </motion.span>
                  </AnimatePresence>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div
              className={`flex items-center gap-[6px] border-t border-border p-8 sm:gap-8 sm:p-12 ${
                fullscreen ? 'mx-auto w-full max-w-2xl' : ''
              }`}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about experience, skills…"
                aria-label="Type your question about the resume"
                disabled={loading}
                className="h-[32px] min-w-0 flex-1 rounded-full border border-border bg-paper px-12 text-body text-ink placeholder:text-ink-faint focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-60 sm:h-[36px] sm:px-[14px] md:h-[40px] md:px-16"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={loading || !input.trim()}
                aria-label="Send question"
                className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-accent text-paper transition-colors hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-40 sm:h-[36px] sm:w-[36px] md:h-[40px] md:w-[40px]"
              >
                <Send className="h-[14px] w-[14px] sm:h-[16px] sm:w-[16px]" />
              </button>
            </div>
          </motion.div>
        )}
        </AnimatePresence>

        {/* Floating action button (minimized state) — chat FAB sits on top */}
        {minimized && !open && (
          <div className="group relative flex items-center justify-center">
            {/* Hover tooltip */}
            <span
              role="tooltip"
              className="pointer-events-none absolute bottom-full right-0 mb-8 hidden w-max max-w-[calc(100vw-48px)] whitespace-normal rounded-3xl border border-white/40 bg-paper/95 px-16 py-8 text-body text-ink opacity-0 shadow-glass backdrop-blur-glass transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 sm:block sm:max-w-[240px]"
            >
              Want to hire {firstName}? Interview {firstName}&apos;s AI resume
            </span>

            {/* Periodic brown ripple waves, radiating outward from the icon */}
            {!shouldReduceMotion && blink && (
              <>
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="pointer-events-none absolute h-[24px] w-[24px] rounded-full border-2 border-accent sm:h-[30px] sm:w-[30px] md:h-[36px] md:w-[36px]"
                    initial={{ scale: 0.6, opacity: 0.6 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    transition={{ duration: 1.6, ease: 'easeOut', delay: i * 0.35 }}
                  />
                ))}
              </>
            )}

            <motion.button
              type="button"
              onClick={openChat}
              aria-label="Open resume chat — ask Ravin's AI about his resume"
              className="relative flex h-[24px] w-[24px] items-center justify-center rounded-full text-accent transition-colors hover:text-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:h-[30px] sm:w-[30px] md:h-[36px] md:w-[36px]"
              whileHover={shouldReduceMotion ? undefined : { scale: 1.08 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
            >
              <MessageCircle className="h-[19px] w-[19px] drop-shadow-sm sm:h-[23px] sm:w-[23px] md:h-[26px] md:w-[26px]" />
            </motion.button>
          </div>
        )}

        {/* WhatsApp shortcut, below the chat FAB, no hover tooltip */}
        {minimized && !open && (
          <motion.a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Message ${firstName} on WhatsApp at ${socialJson.phone}`}
            className="relative flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#25D366] text-white shadow-glass transition-colors hover:bg-[#1ebe5a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:h-[44px] sm:w-[44px] md:h-[48px] md:w-[48px]"
            whileHover={shouldReduceMotion ? undefined : { scale: 1.08 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
          >
            <WhatsAppIcon className="h-[19px] w-[19px] drop-shadow-sm sm:h-[23px] sm:w-[23px] md:h-[26px] md:w-[26px]" />
          </motion.a>
        )}
      </div>
    </>
  );
}
