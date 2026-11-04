import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedNewsAdmin, isNewsAdminConfigured } from '@/lib/news-admin-auth';
import { NEWS_IMAGE_BLOB_PREFIX, isBlobStorageConfigured } from '@/lib/news-blob';

export const dynamic = 'force-dynamic';

export const NEWS_IMAGE_CONTENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
];

export const NEWS_IMAGE_MAX_BYTES = 10 * 1024 * 1024;

/**
 * Issues a short-lived client token so the browser uploads straight to Vercel
 * Blob. Going direct keeps large photos off the 4.5 MB serverless body limit.
 */
export async function POST(request: NextRequest) {
  if (!isBlobStorageConfigured()) {
    return NextResponse.json(
      {
        success: false,
        error: 'Image uploads need a Vercel Blob store. Set BLOB_READ_WRITE_TOKEN, or paste an image URL instead.',
      },
      { status: 503 }
    );
  }

  const body = (await request.json().catch(() => null)) as HandleUploadBody | null;

  if (!body) {
    return NextResponse.json({ success: false, error: 'Invalid upload request.' }, { status: 400 });
  }

  try {
    const result = await handleUpload({
      body,
      request,
      // Runs only for token issuance, not for Vercel's own upload-completed
      // callback, which arrives without the admin cookie.
      onBeforeGenerateToken: async (pathname: string) => {
        if (!isNewsAdminConfigured() || !isAuthorizedNewsAdmin(request)) {
          throw new Error('Not authenticated.');
        }

        if (!pathname.startsWith(NEWS_IMAGE_BLOB_PREFIX)) {
          throw new Error('News images must be uploaded under the news images folder.');
        }

        return {
          allowedContentTypes: NEWS_IMAGE_CONTENT_TYPES,
          maximumSizeInBytes: NEWS_IMAGE_MAX_BYTES,
          addRandomSuffix: true,
        };
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to authorize a news image upload.', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload the image.',
      },
      { status: 400 }
    );
  }
}
