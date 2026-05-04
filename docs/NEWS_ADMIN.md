# News Admin

The news editor is available at `/admin/news`. It uses a shared password for access and writes updates to `content/news.json`.

## Required Environment Variable

```bash
NEWS_ADMIN_PASSWORD=choose-a-strong-password
```

If this variable is not set, the admin page is disabled and the write API returns `503`.

## Recommended Production Storage

For Vercel, Netlify, or other Git-backed deployments, configure GitHub writes. The admin API commits directly to `content/news.json`; the hosting platform can then redeploy from that commit.

```bash
NEWS_GITHUB_TOKEN=github_pat_with_contents_write_access
NEWS_GITHUB_REPO=owner/repo
NEWS_GITHUB_BRANCH=main
NEWS_GITHUB_FILE_PATH=content/news.json
```

`NEWS_GITHUB_BRANCH` and `NEWS_GITHUB_FILE_PATH` are optional; the defaults are `main` and `content/news.json`.

## Local Or Self-Hosted Storage

If `NEWS_GITHUB_TOKEN` and `NEWS_GITHUB_REPO` are not set, new items are written directly to the local `content/news.json` file. This is useful for development and self-hosted servers with a persistent writable filesystem.

Serverless filesystems may be read-only or ephemeral, so local writes should not be treated as durable on those platforms.

## Public Rendering

The home page and `/news` read through `lib/news.ts`, validate the JSON content, and sort items by date descending. The admin page can add and delete news items.

## Images

The image field expects a URL that the browser can load. It does not upload files from your computer.

Valid examples:

```text
/team/dan_raviv.jpg
/news/example.jpg
https://example.com/image.jpg
```

For local project images, put the image file under `public/` and reference it without `public` in the path. For example, `public/news/example.jpg` should be entered as `/news/example.jpg`.
