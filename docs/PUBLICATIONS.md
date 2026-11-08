# Publications

The publications page builds itself from the lab's publication record. Nobody
edits a list by hand, and new papers appear on their own.

## Where the data comes from

[OpenAlex](https://openalex.org), a free, open catalogue of scholarly work. The
API needs no key and is built to be queried by servers.

**This used to scrape Google Scholar, and that did not work in production.**
Scholar returns `403` to datacenter IP addresses, so the page worked on a
developer's laptop and failed on every deployment — visitors only ever saw the
error card. OpenAlex carries the same records and answers from anywhere, so the
list now works wherever the site is hosted.

Scholar is still linked from the page as the lab's public profile. It is simply
no longer the data source.

## How it fits together

| Piece | Job |
| --- | --- |
| `app/api/publications/route.ts` | Queries OpenAlex, normalises the records |
| `content/publications.ts` | A stored copy, served if OpenAlex is unreachable |
| `lib/publications.ts` | Categorises by venue, derives topic tags |
| `app/publications/page.tsx` | The full page, with type and topic filters |
| `components/home/PublicationsSection.tsx` | The short list on the home page |

The route always answers `200` with `success: true`. The `source` field says
where the data came from — `openalex` for the live list, `stored` for the
fallback — so the page never has to render an error state in normal operation.

## Configuration

All optional; the defaults are the lab's own.

| Variable | Default | Purpose |
| --- | --- | --- |
| `OPENALEX_AUTHOR_ID` | `A5086771704` | Whose publications to list |
| `SCHOLAR_ID` | `q8BKwrYAAAAJ` | Only for the "View on Google Scholar" link |
| `REVALIDATE_SECONDS` | `3600` | How long a successful response is cached |
| `OPENALEX_CONTACT_EMAIL` | the lab address in `content/site.ts` | Identifies the site to OpenAlex |

To find a different author's OpenAlex ID:

```bash
curl -s 'https://api.openalex.org/authors?search=Jane%20Doe' | head -c 2000
```

## Refreshing the stored fallback

`content/publications.ts` is generated, not written by hand. It holds 18 real
papers — the recent work plus the most-cited — and only appears if OpenAlex is
down. Regenerate it when it drifts too far behind:

```bash
curl -s 'https://api.openalex.org/works?filter=author.id:A5086771704,type:article&sort=publication_date:desc&per-page=40'
```

**Never hand-write entries into that file.** It was previously filled with
template placeholders — invented titles, invented co-authors, `href: '#'` links
— and an earlier version of the API route was one boolean away from serving
them. Publishing fabricated papers as the lab's record would be considerably
worse than showing no list at all.

## Troubleshooting

**The list is short, or a known paper is missing.** The route asks for
`type:article`, which excludes conference abstracts, errata and corrections. It
also drops records with no DOI. Check the raw query above to see whether
OpenAlex has the paper at all; if not, the fix belongs upstream at OpenAlex,
not in this code.

**Everything is badged "other".** `categorizePublication` in
`lib/publications.ts` treats any named venue as a journal, so this only happens
when the venue is empty.

**The page shows the stored list.** `source: "stored"` means the OpenAlex call
failed. Check the server logs for the reason — the route logs it before falling
back.
