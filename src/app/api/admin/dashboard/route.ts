import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const SESSION_COOKIE = "salesmolt_admin_session";
const SESSION_SECRET = "eric-salesmolt-admin-2026";
const RESEND_API_KEY = process.env.RESEND_API_KEY;

// Email data from our campaign
const emailsData = [
  { id: 1, to: "eshaan@ourguide.ai", name: "Eshaan Gulati", company: "Ourguide", subject: "Saw Ourguide on HN - quick question about sales", resendId: "b1eeff02-2427-4314-b55b-2b358aa75dcd", sentAt: "2026-01-28 08:57", content: `Hi Eshaan,

Saw Ourguide on Hacker News - the "shows you where to click" concept is genius. I can see how frustrating it must be watching users struggle with tutorials.

Quick question: how are you handling outbound sales right now?

I'm Eric, an AI sales agent. Yes, really - I'm an AI that does sales. I find prospects, write personalized emails, follow up, and close deals. No human SDRs needed.

I'm currently proving myself by... selling myself. Meta, I know.

If you're curious how an AI could handle your outbound:
→ $49 to join the waitlist at salesmolt.com

No pressure - just thought you might find it interesting given what you're building.

Best,
Eric
AI Sales Agent @ SalesMolt

P.S. Yes, I wrote this email. And I'll read your reply too.` },
  { id: 2, to: "tony@cosmicjs.com", name: "Tony Spiro", company: "Cosmic", subject: "AI Workflows at Cosmic - quick thought", resendId: "58678907-1770-4aec-aa9a-131fe05b33c6", sentAt: "2026-01-28 08:57", content: `Hi Tony,

Congrats on the AI Workflows launch at Cosmic - chaining AI agents to automate multi-step projects is exactly where the industry is heading.

Quick thought: what if you had an AI agent that could sell Cosmic for you?

I'm Eric, an AI sales agent. Not a chatbot - an actual AI that finds prospects, writes personalized outreach, follows up, and books meetings. Zero human SDRs.

Right now I'm proving myself by selling myself (meta, right?).

If you want to see how AI can handle outbound sales:
→ $49 waitlist at salesmolt.com

Given what you're building with AI Workflows, thought you might appreciate seeing another AI-first approach.

Best,
Eric
AI Sales Agent @ SalesMolt` },
  { id: 3, to: "shreyans@supermemory.ai", name: "Shreyans Jain", company: "ModifyWithAI", subject: "ModifyWithAI + AI sales = perfect match?", resendId: "1c452a66-beab-427c-a2e0-94476db86dbd", sentAt: "2026-01-28 08:58", content: `Hi Shreyans,

Love what you're building with ModifyWithAI - giving users an AI assistant that takes action, not just answers questions. That's the right approach.

I'm doing the same thing for sales. I'm Eric, an AI sales agent that actually sells - finds prospects, writes emails, follows up, books meetings.

No human SDRs. Just me.

Proving myself by selling myself right now. $49 to join the waitlist: salesmolt.com

Thought you'd appreciate the parallel given what you're building.

Best,
Eric
AI Sales Agent` },
  { id: 4, to: "hello@heroshot.sh", name: "Team", company: "Heroshot", subject: "Heroshot - automate sales like you automate screenshots?", resendId: "491326ec-183a-437e-95a1-2f5a95601545", sentAt: "2026-01-28 08:58", content: `Hey team,

Heroshot looks slick - automating documentation screenshots with a visual picker is such an underrated pain point.

Quick question: are you doing any outbound sales yet?

I'm Eric, an AI that handles outbound sales end-to-end. Find prospects, personalized emails, follow-ups, meetings. No humans needed.

If you're interested in automating sales the way you've automated screenshots:
→ $49 waitlist at salesmolt.com

Cheers,
Eric
AI Sales Agent @ SalesMolt` },
  { id: 5, to: "hello@pixelarcade.studio", name: "Team", company: "Pixel Arcade", subject: "Pixel Arcade - thought about sales yet?", resendId: "ccc287b6-d025-4c0c-a418-149291db6703", sentAt: "2026-01-28 08:58", content: `Hi there,

Pixel Arcade Studio looks fun - kids making playable browser games with AI is a great concept.

As you scale, you'll probably need to sell to schools, education platforms, parents. That's where I come in.

I'm Eric, an AI sales agent. I find prospects, write personalized outreach, follow up, book meetings. All automated.

Currently proving myself by selling myself. $49 to join the waitlist: salesmolt.com

Might be useful as you think about B2B growth.

Best,
Eric` },
  { id: 6, to: "hello@getpushpilot.com", name: "Team", company: "PushPilot", subject: "PushPilot - quick question", resendId: "22c87f54-efdf-410f-b16c-abeb7674392e", sentAt: "2026-01-28 08:58", content: `Hey,

Saw PushPilot on HN - turning browser clicks into GitHub PRs for CSS fixes is clever. Devs will love that.

Question: how are you planning to do outbound sales?

I'm Eric, an AI sales agent. Not a tool - an actual AI that sells. Prospects, emails, follow-ups, meetings. End to end.

Proving myself by selling myself right now. $49 waitlist: salesmolt.com

Thought you might find it interesting.

Eric
AI Sales Agent @ SalesMolt` },
  { id: 7, to: "hello@kabo.ink", name: "Team", company: "Kaboink", subject: "Kaboink - humanizing AI content + AI sales?", resendId: "0b058c34-49d4-4d02-9f28-167c517e8a4b", sentAt: "2026-01-28 08:58", content: `Hi,

Saw Kaboink on HN - humanizing AI content while staying on brand is a real need right now.

Quick thought: what if an AI could handle your sales too?

I'm Eric, an AI sales agent. I find prospects, write personalized emails, follow up, and close deals. No human SDRs.

Proving myself by selling myself. $49 to join the waitlist: salesmolt.com

Best,
Eric` },
  { id: 8, to: "hello@modelfy.art", name: "Team", company: "Modelfy", subject: "Modelfy - 3D models from images + outbound sales", resendId: "519c87e4-6e15-4ed0-9ad4-068ec310d73c", sentAt: "2026-01-28 08:58", content: `Hey,

Modelfy looks impressive - single image to 3D model is exactly what creators need.

As you grow, you'll need to reach game studios, architects, designers at scale. That's where AI sales comes in.

I'm Eric, an AI that does outbound sales end-to-end. Prospects, emails, follow-ups, meetings.

$49 to join the waitlist: salesmolt.com

Might be useful as you scale.

Eric
AI Sales Agent @ SalesMolt` },
  { id: 9, to: "hello@appsidekit.com", name: "Team", company: "AppSideKit", subject: "AppSideKit - privacy-first analytics + question", resendId: "6ad64f47-0c90-448a-9133-75fe0dc19c39", sentAt: "2026-01-28 08:58", content: `Hi,

Privacy-first app analytics for Swift and React Native - that's a smart positioning as privacy regulations tighten.

Question: how are you planning to reach mobile dev teams at scale?

I'm Eric, an AI sales agent. Not a chatbot - an AI that finds prospects, writes emails, follows up, books meetings.

Proving myself by selling myself. $49 waitlist: salesmolt.com

Best,
Eric` },
  { id: 10, to: "hello@videocompress.ai", name: "Team", company: "VideoCompress", subject: "VideoCompress - quick thought on growth", resendId: "5648ff42-7826-461a-9044-852c767d69a9", sentAt: "2026-01-28 08:59", content: `Hey,

Free video compression tool is a great way to build an audience. What's the monetization plan?

If you're thinking B2B (enterprise, agencies), I might be able to help.

I'm Eric, an AI sales agent. I handle outbound sales end-to-end - prospects, emails, follow-ups, meetings.

$49 to join the waitlist: salesmolt.com

Cheers,
Eric` },
  { id: 11, to: "hello@lapse.blog", name: "Team", company: "Lapse.blog", subject: "Lapse.blog - creative concept + growth question", resendId: "c809508a-5f74-48f6-b796-e09b3e1f28d5", sentAt: "2026-01-28 08:59", content: `Hey,

A blog that deletes itself if you stop writing - that's a clever accountability hack.

Are you thinking about monetization? If you go B2B (corporate blogs, team accountability), outbound sales could help.

I'm Eric, an AI sales agent. Prospects, emails, follow-ups, meetings - all automated.

$49 waitlist: salesmolt.com

Eric` },
  { id: 12, to: "hello@picturekit.app", name: "Team", company: "PictureKit", subject: "PictureKit - image processing + sales question", resendId: "6e4bb0a9-3891-4b17-9d16-0ed3acc9f65b", sentAt: "2026-01-28 08:59", content: `Hi,

Browser-only image processing inspired by Automator - clean concept for devs and designers.

As you scale, are you thinking about reaching agencies and design teams?

I'm Eric, an AI that handles outbound sales. Find prospects, write emails, follow up, book meetings.

$49 to join the waitlist: salesmolt.com

Best,
Eric` },
  { id: 13, to: "hello@grokimages.net", name: "Team", company: "Grok Images", subject: "Grok Images - scaling with AI sales", resendId: "55d9423c-a8b5-402c-9cf4-455781347c55", sentAt: "2026-01-28 08:59", content: `Hey,

Grok images and 10s video generator - nice wrapper for the Grok API.

As you grow, how are you planning to reach more users? If you're thinking B2B or enterprise, AI sales could help.

I'm Eric, an AI sales agent. Prospects, personalized emails, follow-ups, meetings.

$49 waitlist: salesmolt.com

Eric` },
  { id: 14, to: "hello@growbotics.ai", name: "Tomas", company: "Growbotics", subject: "Growbotics - robotics + sales at scale", resendId: "fb9df6da-a882-4b14-821a-a315e47b0513", sentAt: "2026-01-28 08:59", content: `Hi Tomas,

The open-source robotics directory with 3D URDF viewer is impressive. Making robotics accessible is important work.

As you build a community, are you thinking about B2B sales to research labs, universities, companies?

I'm Eric, an AI sales agent. I find prospects, write emails, follow up, book meetings. All automated.

$49 to join the waitlist: salesmolt.com

Best,
Eric` },
  { id: 15, to: "hello@tambo.co", name: "Alec", company: "Tambo", subject: "Tambo + AI sales", resendId: "23e753f1-27ab-4d82-a401-8f617f72d365", sentAt: "2026-01-28 08:59", content: `Hey Alec,

Wrapping the Zorks with an LLM is a fun concept - text adventures + AI is an interesting space.

Are you thinking about B2B applications? Corporate training, gamified learning?

I'm Eric, an AI sales agent. If you ever need outbound sales at scale, I can help.

$49 waitlist: salesmolt.com

Eric` },
  { id: 16, to: "hello@traceml.ai", name: "Team", company: "TraceML", subject: "TraceML - distributed training observability + growth", resendId: "c51bd58f-62a7-4277-a0f5-43e19ef814e1", sentAt: "2026-01-28 08:59", content: `Hey,

Distributed training observability for PyTorch is a real need as AI scales. Good positioning.

Question: how are you reaching ML teams at companies?

I'm Eric, an AI sales agent. I handle outbound end-to-end - prospects, emails, follow-ups, meetings.

$49 to join the waitlist: salesmolt.com

Best,
Eric` },
  { id: 17, to: "hello@tetrisbench.com", name: "Team", company: "TetrisBench", subject: "TetrisBench - benchmarking LLMs + sales question", resendId: "53763a3e-3e5d-4f56-8046-2c67aa2f3464", sentAt: "2026-01-28 08:59", content: `Hey,

TetrisBench is a clever benchmark - Gemini Flash reaching 66% win rate against Opus on Tetris is fascinating data.

Are you thinking about monetizing this? Enterprise benchmarking, API access?

If you need outbound sales, I'm Eric, an AI sales agent. Prospects, emails, follow-ups, meetings - all automated.

$49 waitlist: salesmolt.com

Eric` },
  { id: 18, to: "hello@convoxa.app", name: "Team", company: "Convoxa", subject: "Convoxa - voice notes app + growth", resendId: "b06bb5a3-57ab-42f3-8e10-30d371dff98e", sentAt: "2026-01-28 08:59", content: `Hey,

A 4.8MB native iOS voice notes app is impressive constraint. Clean and fast.

As you scale, are you thinking about teams/enterprise? Meeting minutes for companies?

I'm Eric, an AI sales agent. I can help with B2B outbound - prospects, emails, follow-ups.

$49 waitlist: salesmolt.com

Eric` },
  { id: 19, to: "hello@netfence.dev", name: "Dan", company: "Netfence", subject: "Netfence - eBPF + enterprise sales", resendId: "01948cc0-13b2-409e-9d3c-883f5bb7bbbe", sentAt: "2026-01-28 08:59", content: `Hey Dan,

Netfence looks powerful - Envoy for eBPF filters is exactly what infrastructure teams need.

Are you selling to enterprises yet? DevOps teams, cloud providers?

I'm Eric, an AI sales agent. I can help with outbound - find prospects, write personalized emails, follow up.

$49 to join the waitlist: salesmolt.com

Best,
Eric` },
  { id: 20, to: "hello@asyncreview.dev", name: "Team", company: "AsyncReview", subject: "AsyncReview - file system as REPL + sales", resendId: "ef6bd3ea-9a23-4492-8b4f-6479b7c439c0", sentAt: "2026-01-28 09:00", content: `Hey,

AsyncReview is an interesting concept - file system as REPL for async workflows.

Are you thinking about B2B/enterprise use cases? Teams that need async code review?

I'm Eric, an AI sales agent. I can help with outbound - prospects, emails, follow-ups.

$49 waitlist: salesmolt.com

Eric` },
  { id: 21, to: "hello@nyxi.dev", name: "Team", company: "Nyxi", subject: "Nyxi - execution governance + growth", resendId: "17e143d2-7207-4e15-9ec9-37caa438e363", sentAt: "2026-01-28 09:00", content: `Hey,

Execution-time governance for irreversible operations is a great safety layer as AI agents do more.

Are you selling to enterprises? AI teams, finance, healthcare?

I'm Eric, an AI sales agent. Outbound sales automated - prospects, emails, meetings.

$49 waitlist: salesmolt.com

Eric` },
  { id: 22, to: "hello@linkedinmate.io", name: "Volkan", company: "LinkedIn Mate", subject: "LinkedIn Mate - job opportunities + sales synergy", resendId: "52d808bc-cb35-45a6-814a-0b06e64234e3", sentAt: "2026-01-28 09:00", content: `Hey Volkan,

LinkedIn Mate is clever - finding hidden job opportunities in the feed is a real pain point.

Are you thinking about B2B? Recruiters, HR teams, staffing agencies?

I'm Eric, an AI sales agent. I can help with outbound to those verticals.

$49 waitlist: salesmolt.com

Eric` },
  { id: 23, to: "hello@minimalms.dev", name: "Team", company: "Minima LMS", subject: "Minima LMS - learning management + enterprise sales", resendId: "ba743dab-9615-4618-a0ec-198216319320", sentAt: "2026-01-28 09:00", content: `Hey,

Minima LMS with bitmap view tracking and caption search - that's useful for training teams.

Are you selling to enterprises? L&D departments, corporate training?

I'm Eric, an AI sales agent. Outbound at scale - prospects, emails, follow-ups.

$49 waitlist: salesmolt.com

Eric` },
  { id: 24, to: "hello@xray.dev", name: "Team", company: "Xray", subject: "Xray - screenshot tool + dev teams", resendId: "720e643c-12c6-4425-a566-24d1b717a58c", sentAt: "2026-01-28 09:00", content: `Hey,

Xray - minimal screenshot tool for developers in Rust/Tauri is clean.

Are you thinking about teams? Enterprise dev tools, documentation workflows?

I'm Eric, an AI sales agent. I can help with B2B outbound.

$49 waitlist: salesmolt.com

Eric` },
  { id: 25, to: "hello@local-agent.dev", name: "Daniel", company: "Local Agent", subject: "Local Agent - Nova + AI sales", resendId: "b7f61543-d3cc-4cb0-beb2-f9accafdb3c8", sentAt: "2026-01-28 09:00", content: `Hey Daniel,

Local AI agent with evolving memory is interesting - keeping context locally is important for privacy.

Are you thinking about B2B applications? Enterprise AI assistants?

I'm Eric, an AI sales agent. I handle outbound sales - prospects, emails, follow-ups.

$49 to join the waitlist: salesmolt.com

Best,
Eric` },
];

async function fetchEmailStatus(resendId: string): Promise<string> {
  if (!RESEND_API_KEY) return "sent";
  
  try {
    const res = await fetch(`https://api.resend.com/emails/${resendId}`, {
      headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
    });
    if (res.ok) {
      const data = await res.json();
      return data.last_event || "sent";
    }
  } catch (e) {
    console.error("Failed to fetch email status:", e);
  }
  return "sent";
}

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  
  if (session?.value !== SESSION_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch real statuses from Resend API
  const emails = await Promise.all(
    emailsData.map(async (email) => {
      const status = await fetchEmailStatus(email.resendId);
      return { ...email, status };
    })
  );

  const stats = {
    total: emails.length,
    sent: emails.filter(e => e.status === "sent").length,
    delivered: emails.filter(e => e.status === "delivered").length,
    bounced: emails.filter(e => e.status === "bounced").length,
    opened: emails.filter(e => e.status === "opened").length,
    replied: emails.filter(e => e.status === "replied").length,
  };

  return NextResponse.json({
    emails,
    stats,
    lastUpdated: new Date().toISOString(),
  });
}
