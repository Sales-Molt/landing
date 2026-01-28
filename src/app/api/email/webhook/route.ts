import { NextRequest, NextResponse } from "next/server";

// Resend Email Webhook Handler
// Receives incoming emails and forwards to Telegram

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    console.log("📧 Email webhook received:", JSON.stringify(payload, null, 2));

    // Check if it's a Resend inbound email event
    if (payload.type !== "email.received") {
      console.log("Ignoring non-email.received event:", payload.type);
      return NextResponse.json({ received: true, ignored: true });
    }

    // Resend inbound email structure - data is nested
    const { email_id, from, to, subject } = payload.data || {};
    const toAddresses = Array.isArray(to) ? to.join(", ") : to;

    // Fetch the email content from Resend API
    let emailContent = "(unable to fetch content)";
    if (email_id && RESEND_API_KEY) {
      try {
        const contentResponse = await fetch(`https://api.resend.com/emails/${email_id}`, {
          headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
        });
        if (contentResponse.ok) {
          const emailData = await contentResponse.json();
          emailContent = emailData.text || emailData.html?.replace(/<[^>]*>/g, '') || "(no content)";
        }
      } catch (e) {
        console.error("Failed to fetch email content:", e);
      }
    }

    // Truncate content for Telegram
    const preview = emailContent.substring(0, 500);
    const truncated = emailContent.length > 500;

    // Forward to Telegram if configured
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const telegramMessage = `📧 *Email reçu*\n\n*De:* ${from || "unknown"}\n*À:* ${toAddresses || "unknown"}\n*Sujet:* ${subject || "(no subject)"}\n\n${preview}${truncated ? "..." : ""}`;
      
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: telegramMessage,
          parse_mode: "Markdown",
        }),
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Email webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "Email webhook active" });
}
