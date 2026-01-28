import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

// Price ID for the $49 waitlist
const WAITLIST_PRICE_ID = "price_1Qj1234"; // TODO: Replace with actual price ID

export async function GET() {
  try {
    // Count successful payments for the waitlist
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      status: "complete",
    });

    // Filter for waitlist payments (you might want to filter by price or metadata)
    const waitlistCount = sessions.data.length;

    // Return count and tier
    let tier: string;
    let displayText: string;
    
    if (waitlistCount === 0) {
      tier = "early";
      displayText = "Be the first to join";
    } else if (waitlistCount < 10) {
      tier = "starting";
      displayText = "Spots filling up";
    } else if (waitlistCount < 25) {
      tier = "growing";
      displayText = `${Math.floor(waitlistCount / 5) * 5}+ founders joined`;
    } else if (waitlistCount < 50) {
      tier = "momentum";
      displayText = "25+ founders joined";
    } else if (waitlistCount < 75) {
      tier = "hot";
      displayText = "Over 50 on the list";
    } else if (waitlistCount < 100) {
      tier = "closing";
      displayText = `Final ${100 - waitlistCount} spots!`;
    } else {
      tier = "full";
      displayText = "Waitlist full!";
    }

    return NextResponse.json({
      count: waitlistCount,
      tier,
      displayText,
      percentage: Math.min(waitlistCount, 100),
      isFull: waitlistCount >= 100,
    });
  } catch (error) {
    console.error("Failed to fetch waitlist count:", error);
    // Return default values on error
    return NextResponse.json({
      count: 0,
      tier: "early",
      displayText: "Limited to 100 spots",
      percentage: 0,
      isFull: false,
    });
  }
}
