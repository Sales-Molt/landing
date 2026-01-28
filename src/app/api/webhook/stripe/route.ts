import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Clawdbot webhook config
const CLAWDBOT_WEBHOOK_URL = process.env.CLAWDBOT_WEBHOOK_URL || "https://clawdhost-linux-1769577237387.tailac8686.ts.net/hooks/wake";
const CLAWDBOT_WEBHOOK_TOKEN = process.env.CLAWDBOT_WEBHOOK_TOKEN || "salesmolt-webhook-2026";

async function notifyClawdbot(message: string) {
  try {
    await fetch(CLAWDBOT_WEBHOOK_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${CLAWDBOT_WEBHOOK_TOKEN}`
      },
      body: JSON.stringify({
        text: message,
        mode: "now"
      }),
    });
  } catch (error) {
    console.error("Failed to notify Clawdbot:", error);
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
      
      // Notify via Clawdbot
      await notifyClawdbot(
        `🎉 New Waitlist Signup! Email: ${email}, Amount: ${amount}`
      );
      
      break;
    }
    
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`❌ Payment failed: ${paymentIntent.id}`);
      
      await notifyClawdbot(
        `❌ Payment Failed - ID: ${paymentIntent.id}, Error: ${paymentIntent.last_payment_error?.message || "Unknown"}`
      );
      
      break;
    }
    
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
