import { NextRequest, NextResponse } from "next/server";

// Twilio SMS Webhook Handler
// Receives incoming SMS and forwards to Telegram

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID; // Kevin's chat ID

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const from = formData.get("From") as string;
    const to = formData.get("To") as string;
    const body = formData.get("Body") as string;
    const messageSid = formData.get("MessageSid") as string;

    console.log(`📱 SMS received from ${from}: ${body}`);

    // Forward to Telegram if configured
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const telegramMessage = `📱 *SMS reçu*\n\n*De:* \`${from}\`\n*Message:* ${body}`;
      
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

    // Store in a simple log (could be expanded to a database)
    // For now, just acknowledge receipt

    // Return TwiML response (empty = no auto-reply)
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response></Response>`;

    return new NextResponse(twiml, {
      status: 200,
      headers: { "Content-Type": "application/xml" },
    });
  } catch (error) {
    console.error("SMS webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}

// Also handle GET for Twilio validation
export async function GET() {
  return NextResponse.json({ status: "SMS webhook active" });
}
