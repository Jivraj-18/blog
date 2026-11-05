// Client-side fuzzy search + tag filter. No server: loads search.json once and searches in the browser.
import Fuse from './fuse.min.mjs';

const $ = s => document.querySelector(s);
const list = $('#posts'), input = $('#q'), status = $('#status'), chips = $('#chips');
const base = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
const original = list.innerHTML;
let index, fuse;

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
async function load() {
  if (index) return;
  index = await (await fetch(base + '/search.json')).json();
  fuse = new Fuse(index, {
    keys: [{ name: 'title', weight: 3 }, { name: 'tags', weight: 2 }, { name: 'description', weight: 1.5 }, { name: 'text', weight: 1 }],
    threshold: 0.38, ignoreLocation: true, minMatchCharLength: 2,
    useExtendedSearch: true   // each word is matched fuzzily on its own, and all words must match
  });
}

// Show a short excerpt around the first place a query word appears in the text.
function snippet(p, q) {
  const words = q.toLowerCase().split(/\s+/).filter(w => w.length > 1);
  const t = p.text, lower = t.toLowerCase();
  let at = -1; for (const w of words) { at = lower.indexOf(w); if (at >= 0) break; }
  if (at < 0) return esc(p.description);
  const start = Math.max(0, at - 70), raw = (start ? '…' : '') + t.slice(start, at + 130) + '…';
  let out = esc(raw);
  for (const w of words) out = out.replace(new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<mark>$1</mark>');
  return out;
}

const card = (p, q) => `<li>
  <span class="date">${esc(p.dateLabel)}</span>
  <a class="title" href="${p.url}">${esc(p.title)}</a>
  <p>${q ? snippet(p, q) : esc(p.description)}</p>
  <p class="tags">${p.tags.map(t => `<a class="tag" href="${base}/?tag=${encodeURIComponent(t)}">#${esc(t)}</a>`).join(' ')}</p>
</li>`;

async function render() {
  const params = new URLSearchParams(location.search);
  const q = (params.get('q') || '').trim(), tag = params.get('tag') || '';
  if (input.value !== q && document.activeElement !== input) input.value = q;
  chips.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c.dataset.tag === tag));
  if (!q && !tag) { list.innerHTML = original; status.textContent = ''; return; }
  await load();
  // Strip Fuse's extended-search operators so typed punctuation is treated as plain text.
  const terms = q.replace(/[=^!'$|"]/g, ' ').trim();
  let results = terms ? fuse.search(terms).map(r => r.item) : index.slice();
  if (tag) results = results.filter(p => p.tags.includes(tag));
  list.innerHTML = results.map(p => card(p, q)).join('') || '';
  const what = [q && `“${q}”`, tag && `#${tag}`].filter(Boolean).join(' in ');
  status.innerHTML = `${results.length} post${results.length === 1 ? '' : 's'} for ${esc(what)} · <a href="${base}/">clear</a>`;
}

function setParam(k, v) {
  const params = new URLSearchParams(location.search);
  v ? params.set(k, v) : params.delete(k);
  history.replaceState(null, '', (params.toString() ? '?' + params : location.pathname) + (location.hash || ''));
  render();
}

let t;
input.addEventListener('focus', load, { once: true });
input.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => setParam('q', input.value.trim()), 120); });
chips.addEventListener('click', e => {
  const c = e.target.closest('.chip'); if (!c) return;
  e.preventDefault();
  setParam('tag', c.classList.contains('on') ? '' : c.dataset.tag);
});
document.addEventListener('keydown', e => { if (e.key === '/' && document.activeElement !== input) { e.preventDefault(); input.focus(); } });
render();
