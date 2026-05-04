import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedNewsAdmin, isNewsAdminConfigured } from '@/lib/news-admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    authenticated: isAuthorizedNewsAdmin(request),
    configured: isNewsAdminConfigured(),
  });
}
