import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const SESSION_COOKIE = "salesmolt_admin_session";
const SESSION_SECRET = "eric-salesmolt-admin-2026";
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const APOLLO_API_KEY = process.env.APOLLO_API_KEY;

interface ApolloContact {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  name: string;
  organization_name: string;
  title: string;
  created_at: string;
}

interface ResendEmail {
  id: string;
  to: string[];
  subject: string;
  created_at: string;
  last_event: string;
}

// Fetch contacts from Apollo CRM
async function fetchApolloContacts(): Promise<ApolloContact[]> {
  if (!APOLLO_API_KEY) {
    console.log("No Apollo API key");
    return [];
  }

  try {
    const res = await fetch("https://api.apollo.io/api/v1/contacts/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": APOLLO_API_KEY,
      },
      body: JSON.stringify({
        label_names: ["SalesMolt Waitlist Outreach"],
        per_page: 100,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return data.contacts || [];
    }
  } catch (e) {
    console.error("Failed to fetch Apollo contacts:", e);
  }
  return [];
}

// Fetch sent emails from Resend
async function fetchResendEmails(): Promise<ResendEmail[]> {
  if (!RESEND_API_KEY) {
    console.log("No Resend API key");
    return [];
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
    });

    if (res.ok) {
      const data = await res.json();
      return data.data || [];
    }
  } catch (e) {
    console.error("Failed to fetch Resend emails:", e);
  }
  return [];
}

// Fetch individual email status
async function fetchEmailStatus(resendId: string): Promise<string> {
  if (!RESEND_API_KEY) return "unknown";

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
  return "unknown";
}

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);

  if (session?.value !== SESSION_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch data from both sources
  const [apolloContacts, resendEmails] = await Promise.all([
    fetchApolloContacts(),
    fetchResendEmails(),
  ]);

  // Create a map of email -> resend data
  const emailMap = new Map<string, ResendEmail>();
  for (const email of resendEmails) {
    if (email.to && email.to[0]) {
      emailMap.set(email.to[0].toLowerCase(), email);
    }
  }

  // Combine Apollo contacts with Resend email data
  const emails = await Promise.all(
    apolloContacts.map(async (contact) => {
      const resendEmail = emailMap.get(contact.email?.toLowerCase());
      let status = "not_sent";

      if (resendEmail) {
        status = await fetchEmailStatus(resendEmail.id);
      }

      return {
        id: contact.id,
        to: contact.email,
        name: contact.name || `${contact.first_name} ${contact.last_name}`.trim(),
        company: contact.organization_name,
        title: contact.title,
        subject: resendEmail?.subject || null,
        resendId: resendEmail?.id || null,
        sentAt: resendEmail?.created_at || null,
        status,
        addedAt: contact.created_at,
      };
    })
  );

  // Calculate stats
  const stats = {
    totalContacts: emails.length,
    sent: emails.filter((e) => e.resendId).length,
    delivered: emails.filter((e) => e.status === "delivered").length,
    opened: emails.filter((e) => e.status === "opened").length,
    clicked: emails.filter((e) => e.status === "clicked").length,
    bounced: emails.filter((e) => e.status === "bounced").length,
    notSent: emails.filter((e) => !e.resendId).length,
  };

  return NextResponse.json({
    emails,
    stats,
    sources: {
      apollo: apolloContacts.length,
      resend: resendEmails.length,
    },
    lastUpdated: new Date().toISOString(),
  });
}
