(function () {
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const dark = () => matchMedia('(prefers-color-scheme: dark)').matches && document.documentElement.dataset.theme !== 'light' || document.documentElement.dataset.theme === 'dark';
  const fmt = m => { let h = Math.floor(m / 60) % 24, mm = Math.round(m % 60); if (mm === 60) { h = (h + 1) % 24; mm = 0; } const ap = h >= 12 ? 'pm' : 'am'; const hh = h % 12 || 12; return hh + ':' + String(mm).padStart(2, '0') + ' ' + ap; };
  const toMin = s => { let [h, m] = s.split(':').map(Number); if (h < 12) h += 24; return h * 60 + m; };

  fetch('track.json').then(r => r.json()).then(track => {
    drawMap(track);
    drawHome(track);
    drawSpeed(track);
    let t; addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => { drawHome(track); drawSpeed(track); }, 150); });
  });

  /* ---------- map ---------- */
  function drawMap(track) {
    const map = L.map('map', { scrollWheelZoom: false, attributionControl: true });
    // OpenStreetMap's own tiles: free, no API key. Darkened with a CSS filter in dark mode.
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    if (dark()) document.getElementById('map').classList.add('map-dark');
    const group = ph => ph === 'push' || ph === 'legpush' || ph === 'pump' ? 'human' : ph === 'experiment' ? 'loop' : ph === 'restaurant' ? null : 'engine';
    const color = { engine: css('--engine'), human: css('--human'), loop: css('--loop') };
    const segs = []; let cur = null;
    for (const p of track) {
      const g = group(p.ph);
      if (p.lat == null || g == null) { cur = null; continue; }
      if (!cur || cur.g !== g) { const prev = cur && cur.pts[cur.pts.length - 1]; cur = { g, pts: prev ? [prev] : [] }; segs.push(cur); }
      cur.pts.push([p.lat, p.lng]);
    }
    const all = [];
    segs.forEach(s => { all.push(...s.pts); L.polyline(s.pts, { color: color[s.g], weight: s.g === 'engine' ? 3 : 4, opacity: .9, lineJoin: 'round' }).addTo(map); });
    const stops = [
      [17.4424, 78.3627, '7 Sisters, Prism Mall', '10:09 – 10:57 pm · one sushi, two noodles, no avocado'],
      [17.4156, 78.4747, 'Buddha statue, Hussain Sagar', '~11:30 pm – 12:06 am · fireworks, and boxes in the lake'],
      [17.4250, 78.4331, 'The bike dies', '~12:17 am · restart, 100–200 m, dead, repeat'],
      [17.4193, 78.4293, 'Delivery rider starts pushing', '12:42 am · ~4.1 km in 12 minutes'],
      [17.4077, 78.4015, 'Petrol pumps + ChatGPT', '12:54 – 1:04 am · blow into the tank'],
      [17.4216, 78.3385, 'Anxiety U-turn', '1:23 am · ~1.6 km from home']
    ];
    stops.forEach(([la, ln, title, sub]) => {
      L.circleMarker([la, ln], { radius: 6, color: css('--surface'), weight: 2, fillColor: css('--ink'), fillOpacity: 1 })
        .bindTooltip('<b>' + title + '</b><br>' + sub, { className: 'stop' }).addTo(map);
    });
    const fit = () => { map.invalidateSize(); map.fitBounds(L.latLngBounds(all).pad(0.06)); };
    fit();
    addEventListener('load', fit);
    new ResizeObserver(fit).observe(document.getElementById('map'));
  }

  /* ---------- shared chart helpers ---------- */
  const NS = 'http://www.w3.org/2000/svg';
  const el = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
  function frame(id, H) {
    const host = document.getElementById(id); host.innerHTML = '';
    const W = Math.max(320, host.clientWidth);
    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img' }, host);
    const tip = document.createElement('div'); tip.className = 'tip'; host.appendChild(tip);
    return { host, svg, tip, W, H };
  }
  function hover(f, pts, x, y, m, html) {
    const cross = el('line', { class: 'cross', y1: m.t, y2: f.H - m.b, opacity: 0 }, f.svg);
    const dot = el('circle', { class: 'dot', r: 5, fill: css('--engine'), opacity: 0 }, f.svg);
    const hit = el('rect', { x: m.l, y: m.t, width: f.W - m.l - m.r, height: f.H - m.t - m.b, fill: 'transparent' }, f.svg);
    const move = ev => {
      const r = f.svg.getBoundingClientRect(); const sx = (ev.clientX - r.left) * f.W / r.width;
      let best = pts[0]; for (const p of pts) if (Math.abs(x(p) - sx) < Math.abs(x(best) - sx)) best = p;
      const px = x(best), py = y(best);
      cross.setAttribute('x1', px); cross.setAttribute('x2', px); cross.setAttribute('opacity', 1);
      dot.setAttribute('cx', px); dot.setAttribute('cy', py); dot.setAttribute('opacity', 1);
      f.tip.innerHTML = html(best); f.tip.style.opacity = 1;
      const tx = px * r.width / f.W, ty = py * r.height / f.H;
      f.tip.style.left = Math.min(Math.max(0, tx - f.tip.offsetWidth / 2), r.width - f.tip.offsetWidth) + 'px';
      f.tip.style.top = Math.max(0, ty - f.tip.offsetHeight - 14) + 'px';
    };
    const out = () => { cross.setAttribute('opacity', 0); dot.setAttribute('opacity', 0); f.tip.style.opacity = 0; };
    hit.addEventListener('pointermove', move); hit.addEventListener('pointerdown', move); hit.addEventListener('pointerleave', out);
  }
  const phaseName = { ride: 'Riding', restaurant: 'At 7 Sisters', push: 'Pushing / restarting', legpush: 'Delivery rider pushing', pump: 'Petrol pumps', revived: 'Riding again', experiment: 'Anxiety experiment' };

  /* ---------- distance from home ---------- */
  function drawHome(track) {
    const small = document.getElementById('home-chart').clientWidth < 560;
    const m = { t: 30, r: 14, b: 30, l: 46 };
    const f = frame('home-chart', small ? 300 : 340);
    const pts = track.filter(p => p.home != null);
    const x0 = toMin('21:50'), x1 = toMin('01:45'), yMax = 16;
    const x = p => m.l + ((p.m ?? p) - x0) / (x1 - x0) * (f.W - m.l - m.r);
    const y = p => m.t + (1 - (p.home ?? p) / yMax) * (f.H - m.t - m.b);
    // human-powered band
    const bx0 = x(toMin('00:17')), bx1 = x(toMin('01:04'));
    el('rect', { class: 'band', x: bx0, y: m.t, width: bx1 - bx0, height: f.H - m.t - m.b }, f.svg);
    el('text', { class: 'band-label', x: (bx0 + bx1) / 2, y: m.t - 8, 'text-anchor': 'middle' }, f.svg).textContent = small ? 'No engine' : 'No engine: pushed, then pulled';
    for (let v = 0; v <= yMax; v += 4) {
      el('line', { class: 'grid', x1: m.l, x2: f.W - m.r, y1: y(v), y2: y(v) }, f.svg);
      el('text', { class: 'axis-label', x: m.l - 8, y: y(v) + 4, 'text-anchor': 'end' }, f.svg).textContent = v + (v === yMax ? ' km' : '');
    }
    const ticks = small ? ['22:00', '23:00', '00:00', '01:00'] : ['22:00', '22:30', '23:00', '23:30', '00:00', '00:30', '01:00', '01:30'];
    ticks.forEach(t => el('text', { class: 'axis-label', x: x(toMin(t)), y: f.H - 10, 'text-anchor': 'middle' }, f.svg).textContent = fmt(toMin(t)).replace(':00', ''));
    el('path', { class: 'line', d: pts.map((p, i) => (i ? 'L' : 'M') + x(p).toFixed(1) + ',' + y(p).toFixed(1)).join('') }, f.svg);
    const ann = [
      ['22:33', '7 Sisters', 'up'],
      ['23:59', 'Far side of the lake', 'up'],
      ['00:17', 'Bike dies', 'down'],
      ['01:23', 'U-turn', 'up']
    ];
    ann.forEach(([t, label, dir]) => {
      const mm = toMin(t); let p = pts.reduce((a, b) => Math.abs(b.m - mm) < Math.abs(a.m - mm) ? b : a);
      const px = x(p), py = y(p);
      if (dir === 'down') { el('line', { class: 'ann-line', x1: px, x2: px, y1: py + 6, y2: py + 30 }, f.svg); el('text', { class: 'ann', x: px - 6, y: py + 44, 'text-anchor': 'end' }, f.svg).textContent = label; return; }
      const ly = Math.max(m.t + 12, py - 26);
      if (small && label === 'Far side of the lake') label = 'Lake';
      el('line', { class: 'ann-line', x1: px, x2: px, y1: py - 6, y2: ly + 4 }, f.svg);
      const anchor = px > f.W - 60 ? 'end' : px < m.l + 40 ? 'start' : 'middle';
      el('text', { class: 'ann', x: px, y: ly, 'text-anchor': anchor }, f.svg).textContent = label;
    });
    hover(f, pts, x, y, m, p => `<b>${fmt(p.m)}</b><br>${p.home.toFixed(1)} km from home<br><span style="color:var(--ink-2)">${phaseName[p.ph]}</span>`);
  }

  /* ---------- speed ---------- */
  function drawSpeed(track) {
    const small = document.getElementById('speed-chart').clientWidth < 560;
    const m = { t: 34, r: 14, b: 30, l: 34 };
    const f = frame('speed-chart', small ? 280 : 320);
    const x0 = toMin('00:15'), x1 = toMin('01:30'), yMax = 50;
    const pts = track.filter(p => p.gps && p.spd != null && p.m >= x0 && p.m <= x1);
    const x = p => m.l + ((p.m ?? p) - x0) / (x1 - x0) * (f.W - m.l - m.r);
    const y = p => m.t + (1 - (p.spd ?? p) / yMax) * (f.H - m.t - m.b);
    const bands = [
      ['00:15', '00:41:45', small ? 'Push' : 'Pushing', true],
      ['00:41:45', '00:54', small ? 'Leg' : 'Stranger’s leg', false],
      ['00:54', '01:04:30', small ? 'Pump' : 'Pumps', true],
      ['01:04:30', '01:19:20', small ? 'Ride' : 'Riding home', false],
      ['01:19:20', '01:26', small ? 'Loop' : 'Loop', true]
    ];
    const tm = s => { const [h, mi, se] = s.split(':').map(Number); return toMin(h + ':' + mi) + (se || 0) / 60; };
    bands.forEach(([a, b, label, shade]) => {
      const bx0 = x(tm(a)), bx1 = x(tm(b));
      if (shade) el('rect', { class: 'band', x: bx0, y: m.t, width: bx1 - bx0, height: f.H - m.t - m.b }, f.svg);
      el('text', { class: 'band-label', x: (bx0 + bx1) / 2, y: m.t - 10, 'text-anchor': 'middle' }, f.svg).textContent = label;
    });
    for (let v = 0; v <= yMax; v += 10) {
      el('line', { class: 'grid', x1: m.l, x2: f.W - m.r, y1: y(v), y2: y(v) }, f.svg);
      el('text', { class: 'axis-label', x: m.l - 8, y: y(v) + 4, 'text-anchor': 'end' }, f.svg).textContent = v;
    }
    el('text', { class: 'axis-label', x: m.l - 8, y: m.t - 10, 'text-anchor': 'end' }, f.svg).textContent = 'km/h';
    (small ? ['00:30', '01:00', '01:30'] : ['00:15', '00:30', '00:45', '01:00', '01:15', '01:30']).forEach(t => el('text', { class: 'axis-label', x: x(toMin(t)), y: f.H - 10, 'text-anchor': 'middle' }, f.svg).textContent = fmt(toMin(t)));
    // break line where GPS gaps exceed 3 min
    let d = '', prev = null;
    pts.forEach(p => { d += (prev && p.m - prev.m < 3 ? 'L' : 'M') + x(p).toFixed(1) + ',' + y(p).toFixed(1); prev = p; });
    el('path', { class: 'line', d }, f.svg);
    // walking pace reference
    el('line', { class: 'ann-line', x1: m.l, x2: f.W - m.r, y1: y(4.5), y2: y(4.5) }, f.svg);
    el('text', { class: 'ann muted', x: f.W - m.r, y: y(4.5) - 5, 'text-anchor': 'end' }, f.svg).textContent = 'walking pace';
    hover(f, pts, x, y, m, p => `<b>${fmt(p.m)}</b><br>${p.spd.toFixed(1)} km/h<br><span style="color:var(--ink-2)">${phaseName[p.ph]}</span>`);
  }
})();
