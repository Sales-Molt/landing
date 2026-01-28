import { NextRequest, NextResponse } from "next/server";

// Resend Email Webhook Handler
// Receives incoming emails and forwards to Telegram

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    console.log("📧 Email webhook received:", JSON.stringify(payload, null, 2));

    // Resend inbound email structure
    const { from, to, subject, text, html } = payload;

    // Forward to Telegram if configured
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const preview = text?.substring(0, 500) || html?.substring(0, 500) || "(no content)";
      const telegramMessage = `📧 *Email reçu*\n\n*De:* ${from}\n*À:* ${to}\n*Sujet:* ${subject}\n\n${preview}${text?.length > 500 ? "..." : ""}`;
      
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
