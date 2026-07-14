import nodemailer from 'nodemailer';

// REQUIRED ENVIRONMENT VARIABLES (to be configured in .env):
// - SMTP_HOST: The hostname of your SMTP provider (e.g., smtp.gmail.com)
// - SMTP_PORT: The port to connect to (e.g., 465 for secure SSL or 587 for TLS)
// - SMTP_USER: Your SMTP username (e.g., ravinit001@gmail.com)
// - SMTP_PASS: Your SMTP password or App Password (e.g., abcd efgh ijkl mnop)
// - CONTACT_EMAIL_TO: Destination address where you want to receive these emails (defaults to SMTP_USER if unset)

export interface MailPayload {
  name: string;
  email: string;
  mobile: string;
  message: string;
  utmSource: string;
}

export interface AutoReplyPayload {
  name: string;
  email: string;
  utmSource: string;
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error('SMTP credentials are not configured in environment variables.');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

// 1. Send Notification Email to Ravin
export async function sendContactEmail({
  name,
  email,
  mobile,
  message,
  utmSource,
}: MailPayload) {
  const user = process.env.SMTP_USER;
  const to = process.env.CONTACT_EMAIL_TO || user;
  const transporter = getTransporter();

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>New Contact Message</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #FAF7F2;
            color: #1E2A3A;
            margin: 0;
            padding: 24px;
            -webkit-font-smoothing: antialiased;
          }
          .container {
            max-width: 580px;
            margin: 0 auto;
            background-color: #FFFFFF;
            border: 1px solid #E6DFD3;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 8px 30px rgba(30, 42, 58, 0.04);
          }
          .header {
            border-bottom: 2px solid #96714F;
            padding-bottom: 20px;
            margin-bottom: 28px;
            text-align: center;
          }
          .logo {
            font-family: 'Georgia', serif;
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 0.5px;
            color: #1E2A3A;
            margin: 0;
          }
          .tagline {
            font-size: 11px;
            color: #7B8794;
            margin: 6px 0 0 0;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            font-weight: 600;
          }
          .title {
            font-family: 'Georgia', serif;
            font-size: 20px;
            font-weight: bold;
            color: #96714F;
            margin-top: 0;
            margin-bottom: 24px;
          }
          .meta-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 28px;
          }
          .meta-table td {
            padding: 12px 0;
            border-bottom: 1px solid #FAF7F2;
            font-size: 14px;
          }
          .meta-label {
            font-family: monospace;
            font-weight: bold;
            color: #7B8794;
            width: 130px;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 0.5px;
          }
          .meta-value {
            color: #1E2A3A;
          }
          .message-box {
            background-color: #FAF7F2;
            border: 1px solid #E6DFD3;
            border-radius: 12px;
            padding: 24px;
            font-size: 15px;
            line-height: 1.6;
            color: #1E2A3A;
            white-space: pre-wrap;
            box-shadow: inset 0 2px 4px rgba(30, 42, 58, 0.01);
          }
          .footer {
            margin-top: 40px;
            font-size: 11px;
            color: #7B8794;
            text-align: center;
            border-top: 1px solid #E6DFD3;
            padding-top: 20px;
            letter-spacing: 0.2px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">Blogs by Ravin</h1>
            <p class="tagline">Lead Generation Hub</p>
          </div>
          
          <h2 class="title">New Message Received</h2>
          
          <table class="meta-table">
            <tr>
              <td class="meta-label">Name</td>
              <td class="meta-value"><strong>${name}</strong></td>
            </tr>
            <tr>
              <td class="meta-label">Email Address</td>
              <td class="meta-value"><a href="mailto:${email}" style="color: #96714F; text-decoration: none; font-weight: 500;">${email}</a></td>
            </tr>
            <tr>
              <td class="meta-label">Mobile Number</td>
              <td class="meta-value"><strong>${mobile}</strong></td>
            </tr>
            <tr>
              <td class="meta-label">Traffic Origin</td>
              <td class="meta-value"><span style="background-color: #FAF7F2; border: 1px solid #E6DFD3; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; color: #96714F; font-family: monospace;">${utmSource}</span></td>
            </tr>
          </table>

          <div class="message-box">
            ${message.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
          </div>
          
          <div class="footer">
            Sent automatically from your portfolio lead pipeline.
          </div>
        </div>
      </body>
    </html>
  `;

  const mailOptions = {
    from: `"${name}" <${user}>`,
    replyTo: email,
    to,
    subject: `New Message from ${name} [via ${utmSource}]`,
    html: htmlTemplate,
  };

  return transporter.sendMail(mailOptions);
}

// 2. Send Auto-Reply Confirmation Email to Sender (Visitor)
export async function sendAutoReplyEmail({
  name,
  email,
  utmSource,
}: AutoReplyPayload) {
  const user = process.env.SMTP_USER;
  const transporter = getTransporter();

  // Parse origin string for user-friendly reading
  let originLabel = 'my website';
  if (utmSource === 'header') {
    originLabel = 'the navigation menu';
  } else if (utmSource.startsWith('blog:')) {
    const slug = utmSource.replace('blog:', '');
    const cleanSlug = slug.replace(/-/g, ' ');
    originLabel = `my blog post ("${cleanSlug}")`;
  } else if (utmSource !== 'direct' && utmSource !== 'unknown') {
    originLabel = `the ${utmSource} page`;
  }

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Thank You for Getting in Touch</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #FAF7F2;
            color: #1E2A3A;
            margin: 0;
            padding: 24px;
            -webkit-font-smoothing: antialiased;
          }
          .container {
            max-width: 580px;
            margin: 0 auto;
            background-color: #FFFFFF;
            border: 1px solid #E6DFD3;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 8px 30px rgba(30, 42, 58, 0.04);
          }
          .header {
            border-bottom: 2px solid #96714F;
            padding-bottom: 20px;
            margin-bottom: 28px;
            text-align: center;
          }
          .logo {
            font-family: 'Georgia', serif;
            font-size: 24px;
            font-weight: bold;
            color: #1E2A3A;
            margin: 0;
            letter-spacing: 0.5px;
          }
          .tagline {
            font-size: 11px;
            color: #7B8794;
            margin: 6px 0 0 0;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            font-weight: 600;
          }
          .content {
            font-size: 15px;
            line-height: 1.6;
            color: #1E2A3A;
          }
          .content p {
            margin-top: 0;
            margin-bottom: 18px;
          }
          .highlight-box {
            background-color: #FAF7F2;
            border: 1px solid #E6DFD3;
            border-radius: 12px;
            padding: 24px;
            margin: 28px 0;
            text-align: center;
          }
          .highlight-title {
            font-family: 'Georgia', serif;
            font-size: 16px;
            font-weight: bold;
            color: #96714F;
            margin-bottom: 16px;
          }
          .social-buttons-container {
            display: inline-block;
            margin: 0 auto;
          }
          .social-btn {
            display: inline-block;
            padding: 10px 20px;
            margin: 0 8px;
            font-size: 13px;
            font-weight: bold;
            color: #FFFFFF;
            background-color: #96714F;
            border-radius: 8px;
            text-decoration: none;
            box-shadow: 0 4px 6px rgba(150, 113, 79, 0.15);
            transition: background-color 0.2s, transform 0.2s;
          }
          .social-btn:hover {
            background-color: #805E3F;
          }
          .signature {
            margin-top: 36px;
            border-top: 1px solid #FAF7F2;
            padding-top: 20px;
          }
          .signature-name {
            font-family: 'Georgia', serif;
            font-weight: bold;
            color: #96714F;
            margin: 0;
            font-size: 16px;
          }
          .signature-title {
            font-size: 12px;
            color: #7B8794;
            margin: 4px 0 0 0;
            font-weight: 500;
          }
          .footer {
            margin-top: 40px;
            font-size: 10px;
            color: #7B8794;
            text-align: center;
            border-top: 1px solid #E6DFD3;
            padding-top: 20px;
            letter-spacing: 0.2px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">Ravin Nallasamy</h1>
            <p class="tagline">Full-Stack &amp; AI Systems</p>
          </div>
          
          <div class="content">
            <p>Hi ${name},</p>
            
            <p>Thank you for getting in touch! I received your inquiry submitted via ${originLabel} and appreciate you taking the time to write.</p>
            
            <p>I have queued your message and will read through your inquiry shortly. You can expect a response from me personally within 24 hours.</p>
            
            <div class="highlight-box">
              <div class="highlight-title">Connect with me in the meantime</div>
              <div class="social-buttons-container">
                <a href="https://www.linkedin.com/in/ravinnallasamy" target="_blank" class="social-btn">LinkedIn</a>
                <a href="https://github.com/ravinnallasamy" target="_blank" class="social-btn">GitHub</a>
              </div>
            </div>
            
            <p>Speak soon!</p>
            
            <div class="signature">
              <p class="signature-name">Ravin Nallasamy</p>
              <p class="signature-title">Software Engineer | AI &amp; Full-Stack Specialist</p>
            </div>
          </div>
          
          <div class="footer">
            This is an automated confirmation of receipt. Please do not reply directly to this message.
          </div>
        </div>
      </body>
    </html>
  `;

  const mailOptions = {
    from: `"Ravin Nallasamy" <${user}>`,
    to: email,
    subject: `Thank you for reaching out, ${name}! | Ravin Nallasamy`,
    html: htmlTemplate,
  };

  return transporter.sendMail(mailOptions);
}
