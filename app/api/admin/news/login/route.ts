import { NextRequest, NextResponse } from 'next/server';
import {
  NEWS_ADMIN_COOKIE_NAME,
  NEWS_ADMIN_SESSION_SECONDS,
  createNewsAdminToken,
  isNewsAdminConfigured,
  verifyNewsAdminPassword,
} from '@/lib/news-admin-auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  if (!isNewsAdminConfigured()) {
    return NextResponse.json(
      { success: false, error: 'News admin password is not configured.' },
      { status: 503 }
    );
  }

  const body = (await request.json().catch(() => null)) as { password?: unknown } | null;
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!verifyNewsAdminPassword(password)) {
    return NextResponse.json({ success: false, error: 'Invalid password.' }, { status: 401 });
  }

  const token = createNewsAdminToken();

  if (!token) {
    return NextResponse.json(
      { success: false, error: 'News admin password is not configured.' },
      { status: 503 }
    );
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: NEWS_ADMIN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    maxAge: NEWS_ADMIN_SESSION_SECONDS,
    path: '/',
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: NEWS_ADMIN_COOKIE_NAME,
    value: '',
    httpOnly: true,
    maxAge: 0,
    path: '/',
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}
