import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "SalesMolt2026!";
const SESSION_COOKIE = "salesmolt_admin_session";
const SESSION_SECRET = "eric-salesmolt-admin-2026";

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  
  if (password === ADMIN_PASSWORD) {
    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE, SESSION_SECRET, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
    });
    return response;
  }
  
  return NextResponse.json({ error: "Invalid password" }, { status: 401 });
}

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  
  if (session?.value === SESSION_SECRET) {
    return NextResponse.json({ authenticated: true });
  }
  
  return NextResponse.json({ authenticated: false }, { status: 401 });
}
