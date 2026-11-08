# Launch checklist

Everything still standing between the current site and a real, public lab site.
Written 2026-11-08, after the first deployment.

## Where things stand

A temporary deployment is live at **https://maruvka-lab-v2-five.vercel.app**,
pushed from a laptop with `npx vercel`. It is owned by the personal Vercel
account `e2d0e`, not by the lab, and it is **not** connected to GitHub, so
pushing to the repo does not update it.

| Area | State |
| --- | --- |
| Design, nav, hero, all pages | Working |
| Team page images | Missing — initials shown instead |
| Gallery | Empty — all 12 images missing |
| Publications | Working — 59 papers, live from OpenAlex |
| News posting | Disabled — no password, no Blob store |
| Lab tools | Locked — no password set |
| Auto-deploy on push | Not connected |

---

## 1. Only Dan can do these

He owns `github.com/danraviv04/maruvka-lab-v2`, and Vercel's GitHub App has to
be installed by someone with admin rights on that account.

- [ ] Sign in to vercel.com with GitHub
- [ ] **Add New → Project**, install the Vercel GitHub App when prompted, pick
      `maruvka-lab-v2`
- [ ] Deploy (the Next.js settings are detected automatically)
- [ ] Decide who owns the project long-term — a Vercel **Team** rather than a
      personal account, so the lab keeps access when people graduate

Once this is done, every push to `main` redeploys the site on its own, and the
temporary deployment above should be deleted so there are not two live copies.

## 2. Environment variables — set in the Vercel dashboard

Settings → Environment Variables, applied to Production. No redeploy of the
code is needed after setting them, but the site must be redeployed once for
them to take effect.

- [ ] `NEWS_ADMIN_PASSWORD` — unlocks `/admin/news`. Without it that page says
      "Set NEWS_ADMIN_PASSWORD in the deployment environment to enable this page."
- [ ] `LAB_TOOLS_PASSWORD` — unlocks `/lab-tools`. Note the name: it is **not**
      `NEXT_PUBLIC_LAB_PASSWORD`, and a public-prefixed variable would expose
      the password in the browser bundle.
- [ ] `SCHOLAR_ID` — optional, defaults to the ID already in the code
- [ ] `NEXT_PUBLIC_BASE_URL` — set once a real domain exists

Pick real passwords, not the `localdev123` used for local testing.

## 3. Blob store — required for news to work at all

Without it the site falls back to writing a file on disk, and Vercel's
filesystem is read-only, so every post fails.

- [ ] Vercel dashboard → **Storage** → **Create** → **Blob**
- [ ] Connect it to the project
- [ ] Confirm `BLOB_READ_WRITE_TOKEN` appears in Environment Variables — Vercel
      adds it automatically, it is not typed by hand
- [ ] Redeploy
- [ ] Post a test news item from `/admin/news`, then open the site in a
      different browser and confirm it appears after a refresh

Once this works, news and its images are published with no redeploy and no
contact with the code. That was the point of the whole exercise.

## 4. Content still needed from the lab

These are files that exist only on people's own machines. Nothing in the code
can fix them.

- [ ] **5 team photos** → `public/team/`
      `dan_raviv.jpg`, `daniel_gurevich.jpeg`, `eden_mor.jpeg`,
      `gaia_frant.png`, `or_harnic.jpeg`
- [ ] **12 gallery images** → `public/gallery/`
      `conference-2024.jpg`, `ctdna-power.jpg`, `immune-model.jpg`,
      `journal-cover.jpg`, `lab-space.jpg`, `msi-validation.jpg`,
      `phylogeny.jpg`, `retreat-2024.jpg`, `seminar.jpg`, `servers.jpg`,
      `signatures-plot.jpg`, `team-meeting.jpg`
- [ ] **Real team text** — `content/team.ts` still has 9 placeholder markers
      (`LONG BIO`, `Some role (placeholder)`, `Alumni Name 1 (placeholder)`)
- [ ] **Optional hero video** → `public/hero/hero.mp4` plus
      `public/hero/hero-poster.jpg`. Drop them in and the video takes over the
      hero backdrop with no code change; until then the animated helix shows.

Missing images do not break anything — team members fall back to initials and
the gallery renders empty — but they are the most visible gap.

## 5. Publications — done

Fixed. The page now reads the lab's record from **OpenAlex** instead of
scraping Google Scholar, which returned `403` to every datacenter IP and so
failed on all deployments. 59 papers load live, each linking to its DOI, and a
stored copy of 18 real papers stands in if OpenAlex is ever unreachable.

Nothing to configure — it works on Dan's deployment with no environment
variables at all. See [PUBLICATIONS.md](PUBLICATIONS.md).

## 6. Housekeeping

- [ ] Remove `Shai's_Lab_Tab.zip` from the repo — 89 MB of its 91 MB, and the
      site does not use it. `.vercelignore` already keeps it out of deployments,
      but it still slows every clone
- [ ] Drop the `cheerio` dependency — it was only used by the old Google
      Scholar scraper and nothing imports it now
- [ ] Delete the 7 unused components left from the old home page: `hero.tsx`,
      `home-proof.tsx`, `home-mission.tsx`, `home-focus.tsx`, `home-news.tsx`,
      `home-featured.tsx`, `home-cta.tsx`
- [ ] Point a real domain at the site, e.g. `maruvka-lab.net.technion.ac.il`
      (Technion IT) or a `.vercel.app` subdomain with a nicer name
- [ ] Replace the leftover Next.js starter files in `public/`: `next.svg`,
      `vercel.svg`, `file.svg`, `globe.svg`, `window.svg`

## 7. What it costs

Vercel's **Hobby** plan is free and covers everything here. Blob storage on
Hobby includes 1 GB of storage, 10,000 simple operations, 2,000 advanced
operations and 10 GB of transfer per month — far beyond what a lab news feed
with a few images will ever use.

One caveat worth checking before the lab commits: Hobby is licensed for
**non-commercial use only**. An academic lab site is normally fine, but if
Vercel ever objects the plan is $20/month per seat for Pro.
