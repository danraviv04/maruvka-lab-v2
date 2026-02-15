# Dynamic Publications System

## Overview

The publications page dynamically fetches data from Google Scholar, eliminating the need to manually update publication lists.

## How It Works

### 1. API Route (`/app/api/publications/route.ts`)

The API route:
- Fetches publications from Google Scholar profile (user ID: `q8BKwrYAAAAJ`)
- Parses HTML to extract: title, authors, venue, year, citations, and link
- Caches results for 1 hour (3600 seconds) to avoid rate limiting
- Returns JSON with all publications

### 2. Utilities (`/lib/publications.ts`)

Helper functions to:
- **categorizePublication**: Automatically categorizes publications as journal, preprint, conference, or other based on venue
- **extractTags**: Automatically tags publications based on keywords in title/venue (cfDNA, signatures, evolution, immunology, MSI, inference, detection, therapy)

### 3. Publications Page (`/app/publications/page.tsx`)

The page:
- Loads publications from the API on mount
- Displays loading state while fetching
- Provides filters by type and topic
- Groups publications by year
- Shows citation counts
- Links directly to Google Scholar pages

## Features

- ✅ **Automatic Updates**: Data refreshes every hour (configurable)
- ✅ **Smart Categorization**: Publications are automatically categorized by type
- ✅ **Topic Tagging**: Automatic tagging based on research areas
- ✅ **Citation Counts**: Shows citation metrics from Google Scholar
- ✅ **Filtering**: Filter by publication type and research topic
- ✅ **Direct Links**: Each publication links to its Google Scholar page
- ✅ **Loading States**: User-friendly loading and error handling

## Configuration

### Change Scholar ID

Edit [`/app/api/publications/route.ts`](../app/api/publications/route.ts):

```typescript
const SCHOLAR_ID = 'q8BKwrYAAAAJ'; // Change this to your Google Scholar ID
```

### Adjust Cache Duration

Modify the `revalidate` value (in seconds):

```typescript
export const revalidate = 3600; // 1 hour (default)
// Or: 7200 for 2 hours, 86400 for 24 hours, etc.
```

### Customize Tags

Edit the `tagMap` in [`/lib/publications.ts`](../lib/publications.ts):

```typescript
const tagMap: Record<string, string[]> = {
  'Your Tag': ['keyword1', 'keyword2'],
  // Add more tags and keywords
};
```

## Technical Details

### Caching Strategy

- **Server-side caching**: Next.js revalidates data every hour
- **Client-side**: Fetches fresh on page load
- **Rate limiting protection**: Reduces requests to Google Scholar

### Data Flow

```
Google Scholar → API Route → Client → UI
                  ↓
                Cache
              (1 hour)
```

## Troubleshooting

### Publications not loading

1. Check if the dev server is running
2. Test the API directly: `curl http://localhost:3000/api/publications`
3. Google Scholar might be blocking requests - increase cache duration

### Wrong publications showing

- Verify the Google Scholar ID in `/app/api/publications/route.ts`
- Check the Scholar profile URL: `https://scholar.google.com/citations?user=YOUR_ID`

### Tags not accurate

- Update the `tagMap` in `/lib/publications.ts` with more specific keywords
- Tags are extracted automatically, so adjust keywords to match your research areas

## Future Enhancements

Consider adding:
- Admin panel to manually curate publications
- Database storage for faster loading
- Background job to update periodically
- Export functionality (BibTeX, CSV)
- Search functionality
- Publication details modal with abstract
