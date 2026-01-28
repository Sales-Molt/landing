import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Telegram notification config
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "1501657753"; // Kevin's ID

async function notifyTelegram(message: string) {
  if (!TELEGRAM_BOT_TOKEN) {
    console.log("No Telegram bot token, skipping notification:", message);
    return;
  }
  
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });
  } catch (error) {
    console.error("Failed to send Telegram notification:", error);
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const email = session.customer_email || session.metadata?.email || "Unknown";
      const amount = session.amount_total ? `$${(session.amount_total / 100).toFixed(2)}` : "$49";
      
      console.log(`✅ New waitlist signup: ${email}`);
      
      // Notify via Telegram
      await notifyTelegram(
        `🎉 <b>New Waitlist Signup!</b>\n\n` +
        `📧 Email: ${email}\n` +
        `💰 Amount: ${amount}\n` +
        `🕐 Time: ${new Date().toISOString()}`
      );
      
      break;
    }
    
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`❌ Payment failed: ${paymentIntent.id}`);
      
      await notifyTelegram(
        `❌ <b>Payment Failed</b>\n\n` +
        `ID: ${paymentIntent.id}\n` +
        `Error: ${paymentIntent.last_payment_error?.message || "Unknown"}`
      );
      
      break;
    }
    
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
