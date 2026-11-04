# Vercel Preview Deployment

Use this flow to deploy the new site for review without replacing the current AwardSpace-hosted `www.maruvkalab.com` site.

## What Will Not Change

Deploying to Vercel creates a temporary `*.vercel.app` URL. It does not replace the existing website until AwardSpace DNS records are changed.

## Before Deploying

1. Commit and push the site to GitHub.
2. Import the GitHub repository into Vercel.
3. Create a Blob store: **Storage → Create → Blob**, and connect it to the project. This injects `BLOB_READ_WRITE_TOKEN` for you, which is what lets news publish without a redeploy.
4. Add this environment variable in the Vercel project settings:

```bash
NEWS_ADMIN_PASSWORD=your_real_password
```

5. Redeploy once so both variables are picked up.

Keep `.env.local` local only. Do not commit it.

See [NEWS_ADMIN.md](NEWS_ADMIN.md) for how the storage backends are chosen.

## Preview Tests

On the Vercel preview URL, verify:

- Home page loads.
- `/news` loads.
- `/publications` loads.
- `/admin/news` accepts the admin password.
- The admin page reports "Edits publish straight to the live site" above the form. If it says anything else, the Blob store is not connected.
- Adding, editing, and deleting a test news item works, and `/news` reflects each change on a plain page refresh — no redeploy.
- The image picker uploads a photo from your computer and shows a preview.

## Later Domain Replacement

Only when ready to replace the current AwardSpace site:

1. Add `www.maruvkalab.com` to the Vercel project.
2. In AwardSpace DNS, update the web records requested by Vercel.
3. Preserve existing MX/email records.
4. Wait for DNS propagation and verify HTTPS.
