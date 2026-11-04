import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedNewsAdmin, isNewsAdminConfigured } from '@/lib/news-admin-auth';
import { isBlobStorageConfigured } from '@/lib/news-blob';
import { getNewsStorage } from '@/lib/news-store';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    authenticated: isAuthorizedNewsAdmin(request),
    configured: isNewsAdminConfigured(),
    uploadsEnabled: isBlobStorageConfigured(),
    storage: safeStorage(),
  });
}

/** getNewsStorage throws on a half-configured GitHub backend; the UI only needs a label. */
function safeStorage(): string {
  try {
    return getNewsStorage();
  } catch {
    return 'unknown';
  }
}
