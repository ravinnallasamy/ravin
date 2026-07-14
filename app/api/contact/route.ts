import { NextResponse, type NextRequest } from 'next/server';
import { sendContactEmail, sendAutoReplyEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, mobile, message, utmSource } = body;

    // Validate inputs
    if (!name || !email || !mobile || !message) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields (name, email, mobile, and message are required).' },
        { status: 400 }
      );
    }

    // 1. Send the email notification to Ravin
    await sendContactEmail({
      name,
      email,
      mobile,
      message,
      utmSource: utmSource || 'direct',
    });

    // 2. Send the auto-reply email confirmation to the visitor (wrapped in try-catch to fail gracefully)
    try {
      await sendAutoReplyEmail({
        name,
        email,
        utmSource: utmSource || 'direct',
      });
    } catch (replyError) {
      console.error('Auto-reply email delivery failed (gracefully caught):', replyError);
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Contact email submission error:', error);
    return NextResponse.json(
      { ok: false, error: error.message || 'Internal Server Error: Failed to send email.' },
      { status: 500 }
    );
  }
}
