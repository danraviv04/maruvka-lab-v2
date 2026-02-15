# Deployment Guide

## Overview

This Next.js application can be deployed to any platform that supports Node.js, including Vercel, Netlify, AWS, or your own server.

## ⚠️ Important: Google Scholar Scraping

The publications page fetches data by scraping Google Scholar. This approach has some considerations for production:

### Potential Issues

1. **Rate Limiting**: Google Scholar may block or rate-limit requests from cloud servers
2. **IP Blocking**: Some hosting providers' IPs might be blocked by Google
3. **HTML Changes**: If Google changes their HTML structure, scraping will break

### Current Safeguards

✅ **1-hour caching** - Reduces requests to Scholar  
✅ **User-Agent headers** - Makes requests appear more legitimate  
✅ **Error handling** - Graceful fallbacks when scraping fails  

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
- Google Scholar may rate-limit Vercel IPs over time

### 2. Netlify

Similar to Vercel:

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### 3. Self-Hosted (Docker)

Most reliable for Scholar scraping (your own IP):

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

No environment variables are strictly required, but you can add:

```bash
# Optional: Override Scholar ID
SCHOLAR_ID=q8BKwrYAAAAJ

# Optional: Cache duration in seconds (default: 3600)
REVALIDATE_SECONDS=7200
```

Update [app/api/publications/route.ts](../app/api/publications/route.ts):

```typescript
const SCHOLAR_ID = process.env.SCHOLAR_ID || 'q8BKwrYAAAAJ';
export const revalidate = Number(process.env.REVALIDATE_SECONDS) || 3600;
```

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

### If Scholar Scraping Fails

**Option 1: Increase Cache Duration**
- Set `revalidate` to 24 hours (86400 seconds)
- Reduces requests to Google Scholar

**Option 2: Use a Scraping Service**
- Consider services like ScraperAPI or Bright Data
- They handle rate limiting and IP rotation

**Option 3: Manual Updates**
- Periodically export Scholar data manually
- Store in `/content/publications.ts`
- Modify API to read from static file

**Option 4: Scholar API Alternatives**
- Use Semantic Scholar API (free, but requires sign-up)
- Use OpenAlex API (free, open data)
- These are more reliable but may have different data

## Alternative: Static Generation

If scraping becomes unreliable, you can switch to static generation:

1. Uncomment the static publications in `/content/publications.ts`
2. Update `/app/publications/page.tsx` to import from the file
3. Manually update publications periodically

This sacrifices automation but ensures reliability.

## Deployment Checklist

- [ ] Test build locally (`npm run build`)
- [ ] Test production server (`npm start`)
- [ ] Verify API endpoint works
- [ ] Check publications page loads
- [ ] Test filters and interactions
- [ ] Monitor for Scholar rate limiting
- [ ] Set up error alerting (optional)
- [ ] Document maintenance process

## Troubleshooting

### Publications not loading in production

1. Check browser console for errors
2. Visit `/api/publications` directly
3. Check server logs for Scholar errors
4. Verify caching is working

### 503 Service Unavailable

This means Google Scholar is blocking requests:
- Increase `revalidate` time to reduce requests
- Consider adding a CDN/proxy
- Switch to alternative data source

### Builds failing

- Ensure all dependencies are in `package.json`
- Check Node.js version compatibility (18+)
- Clear `.next` folder and rebuild

## Support

For deployment issues specific to:
- **Vercel**: https://vercel.com/docs
- **Netlify**: https://docs.netlify.com
- **Next.js**: https://nextjs.org/docs/deployment
