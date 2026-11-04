# News Admin

The news editor lives at `/admin/news`. Sign in with a shared password, then add, edit, or delete items. With Vercel Blob configured, every change is live on the site immediately — no commit, no redeploy, no code.

## Setup (one time)

### 1. Admin password

```bash
NEWS_ADMIN_PASSWORD=choose-a-strong-password
```

Without this, the admin page is disabled and the write API returns `503`.

### 2. Vercel Blob store

In the Vercel dashboard: **Storage → Create → Blob**, then connect it to the project. Vercel injects `BLOB_READ_WRITE_TOKEN` automatically — you do not paste it anywhere.

Redeploy once so the new variable is picked up. After that, the site never needs another deploy to publish news.

For local development, pull the variable down with `vercel env pull .env.local`.

## How Storage Is Chosen

`lib/news-store.ts` picks the first backend that is configured:

| Backend | When it is used | Publish delay |
| --- | --- | --- |
| `blob` | `BLOB_READ_WRITE_TOKEN` is set | Immediate |
| `github` | `NEWS_GITHUB_TOKEN` + `NEWS_GITHUB_REPO` are set | After the redeploy finishes |
| `local` | Neither is set | Immediate, but only on a writable filesystem |

The admin page shows which one is active above the form.

Reads and writes always use the same backend, so the "Existing news" list matches what visitors see.

`content/news.json` stays in the repo. It seeds a brand-new Blob store and acts as the fallback if a Blob read ever fails, so the news page is never empty.

`local` writes to disk. That works in `npm run dev` and on a self-hosted server, but Vercel's filesystem is read-only, so do not rely on it in production.

## Images

With a Blob store connected, the form has a file picker. Pick a photo (up to 10 MB, JPEG/PNG/WebP/GIF/AVIF) and it uploads straight from the browser to Blob storage, bypassing the 4.5 MB serverless request limit. The address field fills in automatically.

You can still paste an address instead:

```text
/team/dan_raviv.jpg          a file committed under public/
https://example.com/pic.jpg  any public image URL
```

Local computer paths like `/Users/...` are not visible to the website and are rejected.

## Security Notes

- The session cookie is `httpOnly`, `sameSite=strict`, and signed with an expiry it carries itself, so it stops working after 4 hours even if it leaks.
- Failed sign-ins are rate-limited to 8 per 10 minutes per IP. This is held in memory, so on serverless it is per-instance — a brake on casual brute-forcing, not a hard guarantee.
- The password is shared by everyone who posts news. Rotate it when someone leaves the lab; that also invalidates every existing session.

## Public Rendering

The home page and `/news` read through `lib/news.ts`. Both are `force-dynamic`, so they re-read the store on every request and a change shows up on the next page load.
