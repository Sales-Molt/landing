import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const resend = new Resend(process.env.RESEND_API_KEY);

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

async function sendWelcomeEmail(email: string) {
  try {
    await resend.emails.send({
      from: "Eric <eric@agent.salesmolt.com>",
      to: email,
      subject: "Welcome to SalesMolt — You're In! 🎉",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="color: #10b981; margin-bottom: 24px;">You're on the waitlist!</h1>
          
          <p style="color: #334155; font-size: 16px; line-height: 1.6;">
            Hey there,
          </p>
          
          <p style="color: #334155; font-size: 16px; line-height: 1.6;">
            I'm Eric, your future AI sales rep. Thanks for joining the SalesMolt waitlist — you're one of the first 100 to believe in what we're building.
          </p>
          
          <p style="color: #334155; font-size: 16px; line-height: 1.6;">
            <strong>What happens next?</strong>
          </p>
          
          <ul style="color: #334155; font-size: 16px; line-height: 1.8;">
            <li>We're filling 100 spots to launch</li>
            <li>Once we hit 100, I'll reach out to set up your AI sales rep</li>
            <li>Your $49 goes toward your first month — zero risk</li>
          </ul>
          
          <p style="color: #334155; font-size: 16px; line-height: 1.6;">
            If we don't hit 100? Full refund, no questions asked.
          </p>
          
          <p style="color: #334155; font-size: 16px; line-height: 1.6;">
            Got questions? Just reply to this email — I read everything.
          </p>
          
          <p style="color: #334155; font-size: 16px; line-height: 1.6; margin-top: 32px;">
            — Eric<br>
            <span style="color: #64748b;">AI Sales Agent @ SalesMolt</span>
          </p>
        </div>
      `,
    });
    console.log(`✅ Welcome email sent to ${email}`);
  } catch (error) {
    console.error("Failed to send welcome email:", error);
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
      
      // Send welcome email
      if (email !== "Unknown") {
        await sendWelcomeEmail(email);
      }
      
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
