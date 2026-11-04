import { createHash, createHmac, randomBytes, timingSafeEqual } from 'crypto';
import type { NextRequest } from 'next/server';

export const NEWS_ADMIN_COOKIE_NAME = 'maruvka_news_admin';
export const NEWS_ADMIN_SESSION_SECONDS = 60 * 60 * 4;

const TOKEN_VERSION = 'v2';

const LOGIN_ATTEMPT_LIMIT = 8;
const LOGIN_ATTEMPT_WINDOW_MS = 10 * 60 * 1000;

/**
 * Best-effort brute-force brake. Serverless instances are per-region and
 * short-lived, so this slows a naive attacker rather than guaranteeing a limit.
 */
const loginAttempts = new Map<string, number[]>();

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

/**
 * Issues a single-use session token that carries its own expiry, so a leaked
 * cookie stops working on its own instead of lasting until the password changes.
 */
export function createNewsAdminToken(): string | null {
  const secret = getAdminPassword();

  if (!secret) {
    return null;
  }

  const expiresAt = Date.now() + NEWS_ADMIN_SESSION_SECONDS * 1000;
  const nonce = randomBytes(16).toString('hex');

  return `${TOKEN_VERSION}.${expiresAt}.${nonce}.${signSession(secret, expiresAt, nonce)}`;
}

export function isAuthorizedNewsAdmin(request: NextRequest): boolean {
  const token = request.cookies.get(NEWS_ADMIN_COOKIE_NAME)?.value;
  const secret = getAdminPassword();

  if (!token || !secret) {
    return false;
  }

  const [version, expiresAtRaw, nonce, signature] = token.split('.');

  if (version !== TOKEN_VERSION || !expiresAtRaw || !nonce || !signature) {
    return false;
  }

  const expiresAt = Number(expiresAtRaw);

  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) {
    return false;
  }

  return safeCompare(signature, signSession(secret, expiresAt, nonce));
}

export function getLoginRateLimitKey(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for') || '';
  return forwardedFor.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
}

export function isLoginRateLimited(key: string): boolean {
  return recentAttempts(key).length >= LOGIN_ATTEMPT_LIMIT;
}

export function registerFailedLogin(key: string): void {
  loginAttempts.set(key, [...recentAttempts(key), Date.now()]);
}

export function clearLoginAttempts(key: string): void {
  loginAttempts.delete(key);
}

function recentAttempts(key: string): number[] {
  const cutoff = Date.now() - LOGIN_ATTEMPT_WINDOW_MS;
  const attempts = (loginAttempts.get(key) || []).filter((timestamp) => timestamp > cutoff);

  if (attempts.length === 0) {
    loginAttempts.delete(key);
  } else {
    loginAttempts.set(key, attempts);
  }

  return attempts;
}

function signSession(secret: string, expiresAt: number, nonce: string): string {
  return createHmac('sha256', secret).update(`${expiresAt}.${nonce}`).digest('hex');
}

function getAdminPassword(): string {
  return process.env.NEWS_ADMIN_PASSWORD || '';
}

function safeCompare(value: string, expected: string): boolean {
  const valueHash = createHash('sha256').update(value).digest();
  const expectedHash = createHash('sha256').update(expected).digest();
  return timingSafeEqual(valueHash, expectedHash);
}
