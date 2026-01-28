import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const SESSION_COOKIE = "salesmolt_admin_session";
const SESSION_SECRET = "eric-salesmolt-admin-2026";

// Email data from our campaign
const emails = [
  { id: 1, to: "eshaan@ourguide.ai", name: "Eshaan Gulati", company: "Ourguide", subject: "Saw Ourguide on HN - quick question about sales", resendId: "b1eeff02-2427-4314-b55b-2b358aa75dcd", status: "sent", sentAt: "2026-01-28 08:57" },
  { id: 2, to: "tony@cosmicjs.com", name: "Tony Spiro", company: "Cosmic", subject: "AI Workflows at Cosmic - quick thought", resendId: "58678907-1770-4aec-aa9a-131fe05b33c6", status: "sent", sentAt: "2026-01-28 08:57" },
  { id: 3, to: "shreyans@supermemory.ai", name: "Shreyans Jain", company: "ModifyWithAI", subject: "ModifyWithAI + AI sales = perfect match?", resendId: "1c452a66-beab-427c-a2e0-94476db86dbd", status: "sent", sentAt: "2026-01-28 08:58" },
  { id: 4, to: "hello@heroshot.sh", name: "Team", company: "Heroshot", subject: "Heroshot - automate sales like you automate screenshots?", resendId: "491326ec-183a-437e-95a1-2f5a95601545", status: "sent", sentAt: "2026-01-28 08:58" },
  { id: 5, to: "hello@pixelarcade.studio", name: "Team", company: "Pixel Arcade", subject: "Pixel Arcade - thought about sales yet?", resendId: "ccc287b6-d025-4c0c-a418-149291db6703", status: "sent", sentAt: "2026-01-28 08:58" },
  { id: 6, to: "hello@getpushpilot.com", name: "Team", company: "PushPilot", subject: "PushPilot - quick question", resendId: "22c87f54-efdf-410f-b16c-abeb7674392e", status: "sent", sentAt: "2026-01-28 08:58" },
  { id: 7, to: "hello@kabo.ink", name: "Team", company: "Kaboink", subject: "Kaboink - humanizing AI content + AI sales?", resendId: "0b058c34-49d4-4d02-9f28-167c517e8a4b", status: "sent", sentAt: "2026-01-28 08:58" },
  { id: 8, to: "hello@modelfy.art", name: "Team", company: "Modelfy", subject: "Modelfy - 3D models from images + outbound sales", resendId: "519c87e4-6e15-4ed0-9ad4-068ec310d73c", status: "sent", sentAt: "2026-01-28 08:58" },
  { id: 9, to: "hello@appsidekit.com", name: "Team", company: "AppSideKit", subject: "AppSideKit - privacy-first analytics + question", resendId: "6ad64f47-0c90-448a-9133-75fe0dc19c39", status: "sent", sentAt: "2026-01-28 08:58" },
  { id: 10, to: "hello@videocompress.ai", name: "Team", company: "VideoCompress", subject: "VideoCompress - quick thought on growth", resendId: "5648ff42-7826-461a-9044-852c767d69a9", status: "sent", sentAt: "2026-01-28 08:59" },
  { id: 11, to: "hello@lapse.blog", name: "Team", company: "Lapse.blog", subject: "Lapse.blog - creative concept + growth question", resendId: "c809508a-5f74-48f6-b796-e09b3e1f28d5", status: "sent", sentAt: "2026-01-28 08:59" },
  { id: 12, to: "hello@picturekit.app", name: "Team", company: "PictureKit", subject: "PictureKit - image processing + sales question", resendId: "6e4bb0a9-3891-4b17-9d16-0ed3acc9f65b", status: "sent", sentAt: "2026-01-28 08:59" },
  { id: 13, to: "hello@grokimages.net", name: "Team", company: "Grok Images", subject: "Grok Images - scaling with AI sales", resendId: "55d9423c-a8b5-402c-9cf4-455781347c55", status: "sent", sentAt: "2026-01-28 08:59" },
  { id: 14, to: "hello@growbotics.ai", name: "Tomas", company: "Growbotics", subject: "Growbotics - robotics + sales at scale", resendId: "fb9df6da-a882-4b14-821a-a315e47b0513", status: "sent", sentAt: "2026-01-28 08:59" },
  { id: 15, to: "hello@tambo.co", name: "Alec", company: "Tambo", subject: "Tambo + AI sales", resendId: "23e753f1-27ab-4d82-a401-8f617f72d365", status: "sent", sentAt: "2026-01-28 08:59" },
  { id: 16, to: "hello@traceml.ai", name: "Team", company: "TraceML", subject: "TraceML - distributed training observability + growth", resendId: "c51bd58f-62a7-4277-a0f5-43e19ef814e1", status: "sent", sentAt: "2026-01-28 08:59" },
  { id: 17, to: "hello@tetrisbench.com", name: "Team", company: "TetrisBench", subject: "TetrisBench - benchmarking LLMs + sales question", resendId: "53763a3e-3e5d-4f56-8046-2c67aa2f3464", status: "sent", sentAt: "2026-01-28 08:59" },
  { id: 18, to: "hello@convoxa.app", name: "Team", company: "Convoxa", subject: "Convoxa - voice notes app + growth", resendId: "b06bb5a3-57ab-42f3-8e10-30d371dff98e", status: "sent", sentAt: "2026-01-28 08:59" },
  { id: 19, to: "hello@netfence.dev", name: "Dan", company: "Netfence", subject: "Netfence - eBPF + enterprise sales", resendId: "01948cc0-13b2-409e-9d3c-883f5bb7bbbe", status: "sent", sentAt: "2026-01-28 08:59" },
  { id: 20, to: "hello@asyncreview.dev", name: "Team", company: "AsyncReview", subject: "AsyncReview - file system as REPL + sales", resendId: "ef6bd3ea-9a23-4492-8b4f-6479b7c439c0", status: "sent", sentAt: "2026-01-28 09:00" },
  { id: 21, to: "hello@nyxi.dev", name: "Team", company: "Nyxi", subject: "Nyxi - execution governance + growth", resendId: "17e143d2-7207-4e15-9ec9-37caa438e363", status: "sent", sentAt: "2026-01-28 09:00" },
  { id: 22, to: "hello@linkedinmate.io", name: "Volkan", company: "LinkedIn Mate", subject: "LinkedIn Mate - job opportunities + sales synergy", resendId: "52d808bc-cb35-45a6-814a-0b06e64234e3", status: "sent", sentAt: "2026-01-28 09:00" },
  { id: 23, to: "hello@minimalms.dev", name: "Team", company: "Minima LMS", subject: "Minima LMS - learning management + enterprise sales", resendId: "ba743dab-9615-4618-a0ec-198216319320", status: "sent", sentAt: "2026-01-28 09:00" },
  { id: 24, to: "hello@xray.dev", name: "Team", company: "Xray", subject: "Xray - screenshot tool + dev teams", resendId: "720e643c-12c6-4425-a566-24d1b717a58c", status: "sent", sentAt: "2026-01-28 09:00" },
  { id: 25, to: "hello@local-agent.dev", name: "Daniel", company: "Local Agent", subject: "Local Agent - Nova + AI sales", resendId: "b7f61543-d3cc-4cb0-beb2-f9accafdb3c8", status: "sent", sentAt: "2026-01-28 09:00" },
];

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  
  if (session?.value !== SESSION_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stats = {
    total: emails.length,
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
