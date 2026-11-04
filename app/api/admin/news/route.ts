import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedNewsAdmin, isNewsAdminConfigured } from '@/lib/news-admin-auth';
import { getNews, sortNewsByDate, validateNewsInput } from '@/lib/news';
import { addNewsItem, deleteNewsItem, updateNewsItem, type NewsItemTarget } from '@/lib/news-store';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authError = getNewsAdminAuthError(request);

  if (authError) {
    return authError;
  }

  try {
    return NextResponse.json({
      success: true,
      data: sortNewsByDate(await getNews()),
    });
  } catch (error) {
    console.error('Failed to load news items.', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load news items.',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authError = getNewsAdminAuthError(request);

  if (authError) {
    return authError;
  }

  const body = await request.json().catch(() => null);
  const validation = validateNewsInput(body);

  if (!validation.ok) {
    return NextResponse.json(
      { success: false, error: 'Invalid news item.', details: validation.errors },
      { status: 400 }
    );
  }

  try {
    const result = await addNewsItem(validation.item);

    return NextResponse.json({
      success: true,
      item: result.item,
      storage: result.storage,
    });
  } catch (error) {
    console.error('Failed to add news item.', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add news item.',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const authError = getNewsAdminAuthError(request);

  if (authError) {
    return authError;
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const original = readNewsItemTarget(body?.original);

  if (!original) {
    return NextResponse.json(
      { success: false, error: 'The original news title and date are required for an edit.' },
      { status: 400 }
    );
  }

  const validation = validateNewsInput(body);

  if (!validation.ok) {
    return NextResponse.json(
      { success: false, error: 'Invalid news item.', details: validation.errors },
      { status: 400 }
    );
  }

  try {
    const result = await updateNewsItem(original, validation.item);

    return NextResponse.json({
      success: true,
      item: result.item,
      storage: result.storage,
    });
  } catch (error) {
    console.error('Failed to update news item.', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update news item.',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const authError = getNewsAdminAuthError(request);

  if (authError) {
    return authError;
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const target = readNewsItemTarget(body);

  if (!target) {
    return NextResponse.json(
      { success: false, error: 'News title and date are required for deletion.' },
      { status: 400 }
    );
  }

  try {
    const result = await deleteNewsItem(target);

    return NextResponse.json({
      success: true,
      item: result.item,
      storage: result.storage,
    });
  } catch (error) {
    console.error('Failed to delete news item.', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete news item.',
      },
      { status: 500 }
    );
  }
}

function readNewsItemTarget(value: unknown): NewsItemTarget | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const candidate = value as { title?: unknown; date?: unknown };
  const title = typeof candidate.title === 'string' ? candidate.title.trim() : '';
  const date = typeof candidate.date === 'string' ? candidate.date.trim() : '';

  return title && date ? { title, date } : null;
}

function getNewsAdminAuthError(request: NextRequest): NextResponse | null {
  if (!isNewsAdminConfigured()) {
    return NextResponse.json(
      { success: false, error: 'News admin password is not configured.' },
      { status: 503 }
    );
  }

  if (!isAuthorizedNewsAdmin(request)) {
    return NextResponse.json({ success: false, error: 'Not authenticated.' }, { status: 401 });
  }

  return null;
}
