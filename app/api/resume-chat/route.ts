import { NextRequest, NextResponse } from 'next/server';

/**
 * Placeholder for POST /api/resume-chat.
 * Swap this out for the real backend by setting NEXT_PUBLIC_RESUME_CHAT_API_URL
 * (see .env.example) — the widget will call that URL directly instead of this route.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const question = typeof body?.question === 'string' ? body.question.trim() : '';

  if (!question) {
    return NextResponse.json({ error: 'Missing question' }, { status: 400 });
  }

  return NextResponse.json({
    answer:
      "This is a placeholder response — connect NEXT_PUBLIC_RESUME_CHAT_API_URL to the real resume chat backend to get answers grounded in the actual resume.",
  });
}
