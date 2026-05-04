import { createHash, createHmac, timingSafeEqual } from 'crypto';
import type { NextRequest } from 'next/server';

export const NEWS_ADMIN_COOKIE_NAME = 'maruvka_news_admin';
export const NEWS_ADMIN_SESSION_SECONDS = 60 * 60 * 4;

const TOKEN_PAYLOAD = 'maruvka-news-admin-session:v1';

export function isNewsAdminConfigured(): boolean {
  return Boolean(getAdminPassword());
}

export function verifyNewsAdminPassword(password: string): boolean {
  const expected = getAdminPassword();

  if (!expected) {
    return false;
  }

  return safeCompare(password, expected);
}

export function createNewsAdminToken(): string | null {
  const password = getAdminPassword();

  if (!password) {
    return null;
  }

  return createHmac('sha256', password).update(TOKEN_PAYLOAD).digest('hex');
}

export function isAuthorizedNewsAdmin(request: NextRequest): boolean {
  const token = request.cookies.get(NEWS_ADMIN_COOKIE_NAME)?.value;
  const expected = createNewsAdminToken();

  if (!token || !expected) {
    return false;
  }

  return safeCompare(token, expected);
}

function getAdminPassword(): string {
  return process.env.NEWS_ADMIN_PASSWORD || '';
}

function safeCompare(value: string, expected: string): boolean {
  const valueHash = createHash('sha256').update(value).digest();
  const expectedHash = createHash('sha256').update(expected).digest();
  return timingSafeEqual(valueHash, expectedHash);
}
