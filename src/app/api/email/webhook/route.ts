import { NextRequest, NextResponse } from "next/server";

// Resend Email Webhook Handler
// Receives incoming emails and forwards to Clawdbot

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CLAWDBOT_HOOK_URL = "https://clawdhost-linux-1769577237387.tailac8686.ts.net/hooks/agent";
const CLAWDBOT_HOOK_TOKEN = process.env.CLAWDBOT_HOOK_TOKEN || "salesmolt-webhook-2026";

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

    // Fetch the email content from Resend Receiving API
    let emailContent = "(no content)";
    if (email_id && RESEND_API_KEY) {
      try {
        const contentResponse = await fetch(`https://api.resend.com/emails/receiving/${email_id}`, {
          headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
        });
        if (contentResponse.ok) {
          const emailData = await contentResponse.json();
          emailContent = emailData.text || emailData.html?.replace(/<[^>]*>/g, '') || "(no content)";
        } else {
          console.error("Failed to fetch email content:", contentResponse.status);
        }
      } catch (e) {
        console.error("Failed to fetch email content:", e);
      }
    }

    // Forward to Clawdbot webhook
    const message = `📧 **Email reçu**

**De:** ${from || "unknown"}
**À:** ${toAddresses || "unknown"}  
**Sujet:** ${subject || "(no subject)"}

${emailContent.substring(0, 2000)}${emailContent.length > 2000 ? "..." : ""}`;

    try {
      const clawdbotResponse = await fetch(CLAWDBOT_HOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${CLAWDBOT_HOOK_TOKEN}`,
        },
        body: JSON.stringify({
          message,
          name: "Email",
          sessionKey: `hook:email:${email_id}`,
          wakeMode: "now",
          deliver: true,
          channel: "telegram",
        }),
      });
      
      console.log("Clawdbot response:", clawdbotResponse.status);
    } catch (e) {
      console.error("Failed to forward to Clawdbot:", e);
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
