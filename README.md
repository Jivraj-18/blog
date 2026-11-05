# Jivraj's blog

Live at **https://jivraj-18.github.io/blog/**

Posts are markdown. On every push to `main`, a GitHub Action builds them into plain static pages and deploys to GitHub Pages. There's no server. Search runs in the reader's browser: the home page fetches a small `search.json` and fuzzy-matches it with [Fuse.js](https://www.fusejs.io/), so typos still find things.

## Write a new post

1. Create a folder: `content/posts/<slug>/` (the slug becomes the URL, e.g. `/blog/posts/<slug>/`).
2. Add `index.md` inside it:

   ```markdown
   ---
   title: My next post
   date: 2026-11-12
   description: One line that shows on the home page and in search results.
   tags: [hyderabad, diwali, festival]
   ---

   Write here, in markdown.
   ```

3. Push to `main`. It's live in about a minute.

### Front matter

| Field | Required | What it does |
|---|---|---|
| `title` | yes | Post title |
| `date` | yes | `YYYY-MM-DD`. The **year is added as a tag automatically** |
| `description` | no | Shown on the home page, in search results and link previews |
| `tags` | no | Any words: places, festivals, topics. Lowercased and hyphenated (`Night Ride` → `night-ride`) |
| `dek` | no | Subtitle under the headline |
| `byline` | no | Extra text after "By Jivraj Shekhawat" |
| `draft` | no | `true` keeps the post out of the build |
| `styles`, `scripts` | no | Extra CSS/JS for interactive posts (file names in the post folder, or full URLs) |

### Images and other media

Keep heavy files (photos, video) **out of this repo**. Put them in a media bucket (Cloudflare R2 is the plan), set `mediaBase` in `site.config.json` to the bucket's public URL, and reference them as:

```markdown
![Hussain Sagar at night]({{media}}/2026/hussain-sagar.webp)
```

`{{media}}` is replaced with `mediaBase` at build time, so moving buckets later is a one-line change. A reader only downloads the media used on the page they open.

Small data files that belong to one post (like `track.json` for the map) can sit in the post's folder.

## Tags and search

- Every tag links to `/blog/?tag=<tag>`, which filters the home page.
- `/blog/?q=<words>` deep-links a search. Each word is matched fuzzily, and all words must match.
- Press `/` on the home page to jump to the search box.

## Preview locally

```bash
npm install
npm run dev        # builds, then serves http://localhost:8080/blog/
```

## Layout

```
content/posts/<slug>/index.md   one post (plus any small files it needs)
src/                            site CSS and the search script
build.mjs                       markdown → dist/ (pages, search.json, feed.xml)
site.config.json                title, URLs, mediaBase
.github/workflows/pages.yml     build + deploy on push
```
