// Builds the blog from content/ into dist/.
// Every post is content/posts/<slug>/index.md; any other file in that folder is copied next to it.
// Run: npm run build   (then: npm run serve  to preview at http://localhost:8080/blog/)
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import crypto from 'node:crypto';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'site.config.json'), 'utf8'));
const OUT = path.join(ROOT, 'dist');
const BASE = cfg.baseUrl.replace(/\/$/, '');            // "/blog"
const MEDIA = (cfg.mediaBase || '').replace(/\/$/, '');  // where images/videos live (e.g. an R2 bucket URL)

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const slugify = s => String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const fmtDate = d => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const plain = html => html.replace(/<(script|style)[\s\S]*?<\/\1>/g, ' ').replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();

// ---------- read posts ----------
const postsDir = path.join(ROOT, 'content', 'posts');
const posts = fs.readdirSync(postsDir, { withFileTypes: true })
  .filter(d => d.isDirectory() && fs.existsSync(path.join(postsDir, d.name, 'index.md')))
  .map(d => {
    const dir = path.join(postsDir, d.name);
    const { data, content } = matter(fs.readFileSync(path.join(dir, 'index.md'), 'utf8'));
    if (!data.title || !data.date) throw new Error(`${d.name}: front matter needs title and date`);
    const date = new Date(data.date);
    const year = String(date.getUTCFullYear());
    // Tags: whatever the post lists, plus the year automatically.
    const tags = [...new Set([year, ...(data.tags || []).map(slugify)])];
    const md = content.replaceAll('{{media}}', MEDIA);
    const html = marked.parse(md);
    return { slug: d.name, dir, ...data, date, year, tags, html, url: `${BASE}/posts/${d.name}/` };
  })
  .filter(p => !p.draft)
  .sort((a, b) => b.date - a.date);

// ---------- layout ----------
const fonts = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&display=swap" rel="stylesheet">`;
const layout = ({ title, description, head = '', body, scripts = '' }) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<link rel="alternate" type="application/rss+xml" title="${esc(cfg.title)}" href="${BASE}/feed.xml">
${fonts}
${head}
<link rel="stylesheet" href="${BASE}/assets/style.css?v=${ver(path.join(ROOT, 'src/style.css'))}">
</head>
<body>
<header class="site-head">
  <a class="brand" href="${BASE}/">${esc(cfg.title)}</a>
  <nav><a href="${BASE}/#search">Search</a> · <a href="${BASE}/feed.xml">RSS</a></nav>
</header>
${body}
<footer class="site-foot"><span>© ${new Date().getUTCFullYear()} ${esc(cfg.author)}</span><a href="${cfg.github}">GitHub</a></footer>
${scripts}
</body>
</html>`;

const tagLinks = tags => tags.map(t => `<a class="tag" href="${BASE}/?tag=${encodeURIComponent(t)}">#${esc(t)}</a>`).join(' ');

// ---------- write ----------
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets'), { recursive: true });
for (const f of fs.readdirSync(path.join(ROOT, 'src'))) fs.copyFileSync(path.join(ROOT, 'src', f), path.join(OUT, 'assets', f));
fs.copyFileSync(path.join(ROOT, 'node_modules/fuse.js/dist/fuse.min.mjs'), path.join(OUT, 'assets/fuse.min.mjs'));
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');

// Local files get ?v=<content hash>, so browsers fetch the new version as soon as it changes.
const ver = file => crypto.createHash('sha1').update(fs.readFileSync(file)).digest('hex').slice(0, 8);
const asset = (u, slug) => /^https?:/.test(u) ? u : `${BASE}/posts/${slug}/${u}?v=${ver(path.join(postsDir, slug, u))}`;

for (const p of posts) {
  const out = path.join(OUT, 'posts', p.slug);
  fs.mkdirSync(out, { recursive: true });
  for (const f of fs.readdirSync(p.dir)) if (f !== 'index.md') fs.cpSync(path.join(p.dir, f), path.join(out, f), { recursive: true });
  const head = (p.styles || []).map(s => `<link rel="stylesheet" href="${esc(asset(s, p.slug))}">`).join('\n');
  const scripts = (p.scripts || []).map(s => `<script src="${esc(asset(s, p.slug))}"></script>`).join('\n');
  const body = `<main class="prose">
  <p class="kicker">${fmtDate(p.date)}</p>
  <h1>${esc(p.title)}</h1>
  ${p.dek ? `<p class="dek">${esc(p.dek)}</p>` : ''}
  <p class="byline">By ${esc(cfg.author)}${p.byline ? ' · ' + esc(p.byline) : ''}</p>
  <p class="tags">${tagLinks(p.tags)}</p>
  ${p.html}
</main>`;
  fs.writeFileSync(path.join(out, 'index.html'), layout({ title: `${p.title} · ${cfg.title}`, description: p.description || p.dek || '', head, body, scripts }));
}

// Home: static list (works without JS) + search box and tag chips (enhanced by search.js).
const allTags = [...posts.flatMap(p => p.tags).reduce((m, t) => m.set(t, (m.get(t) || 0) + 1), new Map())]
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
const item = p => `<li data-slug="${p.slug}">
  <span class="date">${fmtDate(p.date)}</span>
  <a class="title" href="${p.url}">${esc(p.title)}</a>
  <p>${esc(p.description || p.dek || '')}</p>
  <p class="tags">${tagLinks(p.tags)}</p>
</li>`;
const home = `<main>
  <p class="kicker">Notes &amp; experiments</p>
  <h1>${esc(cfg.title)}</h1>
  <p class="dek">${esc(cfg.description)}</p>
  <div class="search" id="search">
    <input id="q" type="search" placeholder="Search posts… (typos are fine)" autocomplete="off" aria-label="Search posts">
    <div class="chips" id="chips">${allTags.map(([t, n]) => `<a class="chip" href="?tag=${encodeURIComponent(t)}" data-tag="${esc(t)}">#${esc(t)} <span>${n}</span></a>`).join('')}</div>
    <p class="status" id="status" aria-live="polite"></p>
  </div>
  <ul class="post-list" id="posts">${posts.map(item).join('\n')}</ul>
</main>`;
fs.writeFileSync(path.join(OUT, 'index.html'), layout({
  title: cfg.title, description: cfg.description, body: home,
  scripts: `<script type="module" src="${BASE}/assets/search.js?v=${ver(path.join(ROOT, 'src/search.js'))}"></script>`
}));

// Search index: everything the browser needs to fuzzy-search without a server.
fs.writeFileSync(path.join(OUT, 'search.json'), JSON.stringify(posts.map(p => ({
  slug: p.slug, url: p.url, title: p.title, date: p.date.toISOString().slice(0, 10), dateLabel: fmtDate(p.date),
  tags: p.tags, description: p.description || p.dek || '', text: plain(p.html)
}))));

// RSS
const site = cfg.siteUrl.replace(/\/$/, '');
fs.writeFileSync(path.join(OUT, 'feed.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>${esc(cfg.title)}</title><link>${site}${BASE}/</link><description>${esc(cfg.description)}</description>
${posts.map(p => `<item><title>${esc(p.title)}</title><link>${site}${p.url}</link><guid>${site}${p.url}</guid><pubDate>${p.date.toUTCString()}</pubDate><description>${esc(p.description || '')}</description>${p.tags.map(t => `<category>${esc(t)}</category>`).join('')}</item>`).join('\n')}
</channel></rss>`);

fs.writeFileSync(path.join(OUT, '404.html'), layout({ title: `Not found · ${cfg.title}`, description: '', body: `<main><h1>Not found</h1><p>That page doesn't exist. <a href="${BASE}/">Back to all posts</a>.</p></main>` }));

console.log(`Built ${posts.length} post(s), ${allTags.length} tag(s) → dist/`);
