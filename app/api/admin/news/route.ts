import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedNewsAdmin, isNewsAdminConfigured } from '@/lib/news-admin-auth';
import { getNews, sortNewsByDate, validateNewsInput } from '@/lib/news';
import { addNewsItem, deleteNewsItem } from '@/lib/news-store';

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

export async function DELETE(request: NextRequest) {
  const authError = getNewsAdminAuthError(request);

  if (authError) {
    return authError;
  }

  const body = (await request.json().catch(() => null)) as { title?: unknown; date?: unknown } | null;
  const title = typeof body?.title === 'string' ? body.title.trim() : '';
  const date = typeof body?.date === 'string' ? body.date.trim() : '';

  if (!title || !date) {
    return NextResponse.json(
      { success: false, error: 'News title and date are required for deletion.' },
      { status: 400 }
    );
  }

  try {
    const result = await deleteNewsItem({ title, date });

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
