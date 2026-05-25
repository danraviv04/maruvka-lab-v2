import { createHash, createHmac, timingSafeEqual } from 'crypto';
import type { NextRequest } from 'next/server';

export const LAB_TOOLS_COOKIE_NAME = 'maruvka_lab_tools';
export const LAB_TOOLS_SESSION_SECONDS = 60 * 60 * 8; // 8 hours

const TOKEN_PAYLOAD = 'maruvka-lab-tools-session:v1';

function getLabToolsPassword(): string {
  return process.env.LAB_TOOLS_PASSWORD || '';
}

export function isLabToolsConfigured(): boolean {
  return Boolean(getLabToolsPassword());
}

export function verifyLabToolsPassword(password: string): boolean {
  const expected = getLabToolsPassword();
  if (!expected) return false;
  return safeCompare(password, expected);
}

export function createLabToolsToken(): string | null {
  const password = getLabToolsPassword();
  if (!password) return null;
  return createHmac('sha256', password).update(TOKEN_PAYLOAD).digest('hex');
}

export function isAuthorizedLabTools(request: NextRequest): boolean {
  const token = request.cookies.get(LAB_TOOLS_COOKIE_NAME)?.value;
  const expected = createLabToolsToken();
  if (!token || !expected) return false;
  return safeCompare(token, expected);
}

function safeCompare(value: string, expected: string): boolean {
  const v = createHash('sha256').update(value).digest();
  const e = createHash('sha256').update(expected).digest();
  return timingSafeEqual(v, e);
}
