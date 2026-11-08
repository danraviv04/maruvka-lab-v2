# Deployment Guide

## Overview

This Next.js application can be deployed to any platform that supports Node.js, including Vercel, Netlify, AWS, or your own server.

## Publications

The publications page reads the lab's record from OpenAlex, a free API that
needs no key and answers from any host. There is nothing to configure.

This page used to scrape Google Scholar, which returns `403` to datacenter IP
addresses — so it worked locally and failed on every deployment. If you see
advice anywhere about caching harder or rotating user agents to keep Scholar
happy, it is out of date; see [PUBLICATIONS.md](PUBLICATIONS.md).

## Recommended Deployment Platforms

### 1. Vercel (Recommended)

Vercel is the easiest option for Next.js apps:

```bash
npm install -g vercel
vercel
```

**Pros:**
- Zero configuration
- Automatic deployments from Git
- Built-in caching and CDN
- Free tier available

**Cons:**
- Serverless filesystem is read-only, so news needs a Blob store (see below)

### 2. Netlify

Similar to Vercel:

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### 3. Self-Hosted (Docker)

If you would rather run it on lab hardware:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Environment Variables

See [.env.example](../.env.example) for the full annotated list. Three matter
for a working production deploy:

```bash
# Required: unlocks /admin/news. Without it the news editor is disabled.
NEWS_ADMIN_PASSWORD=...

# Required: unlocks /lab-tools. NOT NEXT_PUBLIC_LAB_PASSWORD - nothing reads that.
LAB_TOOLS_PASSWORD=...

# Strongly recommended: injected by connecting a Vercel Blob store.
# Without it, posting news FAILS on Vercel - the deployed filesystem is read-only.
BLOB_READ_WRITE_TOKEN=...
```

Optional tuning, already wired up in
[app/api/publications/route.ts](../app/api/publications/route.ts):

```bash
# Whose publications to list (OpenAlex author ID)
OPENALEX_AUTHOR_ID=A5086771704

# Only used for the "View on Google Scholar" link, not for the data
SCHOLAR_ID=q8BKwrYAAAAJ

# Cache duration for a successful response, in seconds (default 3600)
REVALIDATE_SECONDS=7200

# Absolute base URL for canonical links and social previews
NEXT_PUBLIC_BASE_URL=https://www.maruvkalab.com
```

Environment variables only apply to **new** deployments, so redeploy after
adding or changing any of them.

## Testing Before Deployment

1. Build the production version locally:
```bash
npm run build
npm start
```

2. Test the API endpoint:
```bash
curl http://localhost:3000/api/publications
```

3. Check for build errors or warnings

## Post-Deployment Monitoring

### Check if Publications are Loading

Visit `https://your-domain.com/api/publications` and verify:
- `"success": true`
- Publications array is populated
- No error messages

### If the publication list is missing or stale

The route answers `200` even when the live call fails, serving the stored copy
in `content/publications.ts` instead. Check the `source` field in
`/api/publications` to see which you got:

- `"source": "openalex"` — the live list, working normally
- `"source": "stored"` — OpenAlex was unreachable; the server log says why

If it is stuck on `stored`, query OpenAlex directly to see whether the problem
is upstream:

```bash
curl -s 'https://api.openalex.org/works?filter=author.id:A5086771704,type:article&per-page=3'
```

`content/publications.ts` is generated from that same query. Never hand-write
entries into it — see [PUBLICATIONS.md](PUBLICATIONS.md) for why that file is
treated carefully.

## Deployment Checklist

- [ ] Test build locally (`npm run build`)
- [ ] Test production server (`npm start`)
- [ ] Verify API endpoint works
- [ ] Check publications page loads
- [ ] Test filters and interactions
- [ ] Set up error alerting (optional)
- [ ] Document maintenance process

## Troubleshooting

### Publications not loading in production

1. Check browser console for errors
2. Visit `/api/publications` directly and read the `source` field
3. Check server logs — the route logs the reason before falling back

### Builds failing

- Ensure all dependencies are in `package.json`
- Check Node.js version compatibility (18+)
- Clear `.next` folder and rebuild

## Support

For deployment issues specific to:
- **Vercel**: https://vercel.com/docs
- **Netlify**: https://docs.netlify.com
- **Next.js**: https://nextjs.org/docs/deployment
