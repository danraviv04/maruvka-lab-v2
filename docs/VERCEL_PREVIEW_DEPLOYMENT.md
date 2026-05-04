# Vercel Preview Deployment

Use this flow to deploy the new site for review without replacing the current AwardSpace-hosted `www.maruvkalab.com` site.

## What Will Not Change

Deploying to Vercel creates a temporary `*.vercel.app` URL. It does not replace the existing website until AwardSpace DNS records are changed.

## Before Deploying

1. Commit and push the site to GitHub.
2. Import the GitHub repository into Vercel.
3. Add these environment variables in the Vercel project settings:

```bash
NEWS_ADMIN_PASSWORD=your_real_password
NEWS_GITHUB_TOKEN=github_pat_with_contents_write_access
NEWS_GITHUB_REPO=danraviv04/maruvka-lab-v2
NEWS_GITHUB_BRANCH=main
NEWS_GITHUB_FILE_PATH=content/news.json
```

Keep `.env.local` local only. Do not commit it.

## Preview Tests

On the Vercel preview URL, verify:

- Home page loads.
- `/news` loads.
- `/publications` loads.
- `/admin/news` accepts the admin password.
- Adding and deleting a test news item works.
- News images use public paths such as `/news/example.jpg` or full `https` URLs.

## Later Domain Replacement

Only when ready to replace the current AwardSpace site:

1. Add `www.maruvkalab.com` to the Vercel project.
2. In AwardSpace DNS, update the web records requested by Vercel.
3. Preserve existing MX/email records.
4. Wait for DNS propagation and verify HTTPS.
