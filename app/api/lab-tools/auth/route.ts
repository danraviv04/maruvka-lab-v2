import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  verifyLabToolsPassword,
  createLabToolsToken,
  isAuthorizedLabTools,
  isLabToolsConfigured,
  LAB_TOOLS_COOKIE_NAME,
  LAB_TOOLS_SESSION_SECONDS,
} from '@/lib/lab-tools-auth';

// GET — check whether the current request carries a valid session cookie
export async function GET(request: NextRequest) {
  if (!isLabToolsConfigured()) {
    return NextResponse.json({ authorized: true, configured: false });
  }
  const authorized = isAuthorizedLabTools(request);
  return NextResponse.json({ authorized, configured: true });
}

// POST — validate password, set cookie on success
export async function POST(request: NextRequest) {
  if (!isLabToolsConfigured()) {
    return NextResponse.json({ ok: true, configured: false });
  }

  let password = '';
  try {
    const body = await request.json();
    password = String(body.password || '');
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }

  if (!verifyLabToolsPassword(password)) {
    return NextResponse.json({ ok: false, error: 'Incorrect password' }, { status: 401 });
  }

  const token = createLabToolsToken();
  if (!token) {
    return NextResponse.json({ ok: false, error: 'Server misconfiguration' }, { status: 500 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(LAB_TOOLS_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: LAB_TOOLS_SESSION_SECONDS,
  });
  return response;
}

// DELETE — logout (clear the cookie)
export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(LAB_TOOLS_COOKIE_NAME);
  return response;
}
