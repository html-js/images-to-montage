// Screenshot driver for the README images.
//
// 1. Paints eight fictional landscape pictures in the page's own canvas from a
//    fixed seed and saves them to docs/samples/ (the same files the README's
//    "try it" link loads on the published site).
// 2. Serves the project folder on 127.0.0.1 so the page loads those samples
//    through its ?src= parameter, exactly like a visitor would; same-origin
//    images stay exportable.
// 3. Drives the real interface in one browser, one page, shot after shot, and
//    saves one real export as docs/example-montage.jpg.
//
// Run: make shots   (or NODE_PATH=<dir containing playwright> node docs/shot.js)
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SAMPLES = path.join(__dirname, 'samples');
const out = name => path.join(__dirname, name);

const SCENES = [
  // name, width, height, palette [sky top, sky low, sun, far, mid, near], water, stars
  ['01-harbor-dawn', 1200, 800, ['#2b3a67', '#f3a683', '#ffe3b0', '#7b6d8d', '#4b4e6d', '#262a40'], true, false],
  ['02-pine-ridge', 800, 1100, ['#9cc3d5', '#e8f1f2', '#fffbe6', '#7fa38a', '#47705a', '#1f3b2d'], false, false],
  ['03-salt-flat', 1000, 1000, ['#c9d6df', '#f7f3ea', '#ffffff', '#d8cfc4', '#b8ab9c', '#8c7f70'], true, false],
  ['04-night-lake', 1600, 900, ['#05070f', '#1b2a4a', '#e8edf7', '#22304d', '#151f35', '#0a0f1c'], true, true],
  ['05-red-canyon', 900, 1200, ['#f5b971', '#fde2c0', '#fff4d6', '#d9774b', '#b0502e', '#6e2b19'], false, false],
  ['06-fog-valley', 1200, 900, ['#aab4bd', '#dfe3e6', '#f4f6f7', '#9aa5ad', '#76828b', '#4d5860'], false, false],
  ['07-dune-noon', 1500, 700, ['#4f9bd9', '#cfe8f7', '#fffdf2', '#e9c58d', '#d8a865', '#b78445'], false, false],
  ['08-glacier', 1000, 1250, ['#2e4a6b', '#a9c7e3', '#f1f7ff', '#dfeaf5', '#9db8d3', '#506d8c'], true, false],
];

function serve() {
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg' };
  const server = http.createServer((req, res) => {
    const rel = decodeURIComponent(new URL(req.url, 'http://x').pathname).replace(/^\/+/, '') || 'index.html';
    const file = path.resolve(ROOT, rel);
    if (!file.startsWith(ROOT + path.sep) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404); res.end(); return;
    }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise(r => server.listen(0, '127.0.0.1', () => r(server)));
}

(async () => {
  const server = await serve();
  const base = `http://127.0.0.1:${server.address().port}/`;
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({
      viewport: { width: 1360, height: 820 },
      deviceScaleFactor: 2,
      colorScheme: 'dark',
      locale: 'en-US',
      timezoneId: 'UTC',
      acceptDownloads: true,
    });
    const page = await context.newPage();
    await page.goto(base, { waitUntil: 'domcontentloaded' });

    // ── 1. paint the sample pictures ───────────────────────────────────────
    fs.mkdirSync(SAMPLES, { recursive: true });
    const urls = await page.evaluate(scenes => scenes.map(([name, W, H, pal, water, stars], si) => {
      let seed = 1000 + si * 97;
      const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
      const c = document.createElement('canvas'); c.width = W; c.height = H;
      const x = c.getContext('2d');
      const horizon = H * (water ? 0.62 : 0.72);
      const sky = x.createLinearGradient(0, 0, 0, horizon);
      sky.addColorStop(0, pal[0]); sky.addColorStop(1, pal[1]);
      x.fillStyle = sky; x.fillRect(0, 0, W, H);
      if (stars) for (let i = 0; i < 260; i++) {
        x.fillStyle = `rgba(255,255,255,${0.25 + rnd() * 0.6})`;
        x.fillRect(rnd() * W, rnd() * horizon * 0.85, 1 + rnd() * 1.6, 1 + rnd() * 1.6);
      }
      const sx = W * (0.25 + rnd() * 0.5), sy = horizon * (0.35 + rnd() * 0.3), sr = Math.min(W, H) * 0.07;
      const glow = x.createRadialGradient(sx, sy, sr * 0.6, sx, sy, sr * 5);
      glow.addColorStop(0, pal[2] + 'aa'); glow.addColorStop(1, pal[2] + '00');
      x.fillStyle = glow; x.fillRect(0, 0, W, H);
      x.fillStyle = pal[2]; x.beginPath(); x.arc(sx, sy, sr, 0, Math.PI * 2); x.fill();
      [[3, 0.18, 0.55], [4, 0.13, 0.8], [5, 0.09, 1.0]].forEach(([ci, amp, depth]) => {
        const y0 = horizon - H * amp * (1.2 - depth * 0.5);
        x.fillStyle = pal[ci]; x.beginPath(); x.moveTo(0, H);
        let y = y0;
        for (let px = 0; px <= W; px += W / 40) {
          y = Math.min(horizon + 2, Math.max(y0 - H * amp, y + (rnd() - 0.5) * H * amp * 0.9));
          x.lineTo(px, y);
        }
        x.lineTo(W, H); x.closePath(); x.fill();
      });
      if (water) {
        const sea = x.createLinearGradient(0, horizon, 0, H);
        sea.addColorStop(0, pal[1]); sea.addColorStop(1, pal[0]);
        x.fillStyle = sea; x.fillRect(0, horizon, W, H - horizon);
        x.fillStyle = pal[2] + '55';
        for (let i = 0; i < 26; i++) {
          const w = sr * (2.4 - i * 0.07) * (0.6 + rnd() * 0.6);
          x.fillRect(sx - w / 2, horizon + 6 + i * (H - horizon) / 28, w, 2 + rnd() * 2);
        }
      }
      for (let i = 0; i < W * H / 90; i++) {              // light film grain
        x.fillStyle = rnd() < 0.5 ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.04)';
        x.fillRect(rnd() * W, rnd() * H, 2, 2);
      }
      return [name, c.toDataURL('image/jpeg', 0.84)];
    }), SCENES);
    for (const [name, data] of urls) {
      fs.writeFileSync(path.join(SAMPLES, `sample-${name}.jpg`), Buffer.from(data.split(',')[1], 'base64'));
    }

    // ── 2. load them the way a visitor would: ?src=… relative to the page ──
    const query = SCENES.map(([name]) => 'src=' + encodeURIComponent(`docs/samples/sample-${name}.jpg`)).join('&');
    await page.goto(`${base}?${query}`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(n => document.querySelector('#chip-n b').textContent === String(n), SCENES.length);

    const settle = (ms = 1800) => page.waitForTimeout(ms);     // toasts fade, layout redraws
    const set = (id, v) => page.$eval(id, (el, v) => {
      if (el.type === 'checkbox') el.checked = v; else el.value = v;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }, v);
    const clickCanvas = async (fx, fy) => {
      const b = await page.locator('#cv').boundingBox();
      await page.mouse.click(Math.round(b.x + b.width * fx), Math.round(b.y + b.height * fy));
    };

    // shot 1: grid with numbered, named captions; one tile selected
    // manual sizes keep the preview large enough for captions to read
    await set('#c-layout', 'grid');
    await set('#c-native', false);
    await set('#c-cols', 4);
    await set('#c-cellW', 600);
    await set('#c-cellH', 420);
    await set('#c-fit', 'cover');
    await set('#c-gap', 24);
    await set('#c-pad', 32);
    await set('#c-bg', '#14171c');
    await set('#c-caption', 'both');
    await set('#c-capSize', 26);
    await settle();
    await clickCanvas(0.62, 0.3);
    await settle(400);
    await page.screenshot({ path: out('screenshot-grid.png') });

    // shot 2: justified rows on a light page with rounded corners
    await page.keyboard.press('Escape');
    await page.click('#btn-theme');
    await set('#c-layout', 'justified');
    await set('#c-cols', 0);
    await set('#c-caption', 'none');
    await set('#c-width', 2400);
    await set('#c-rowH', 420);
    await set('#c-radius', 28);
    await set('#c-gap', 20);
    await set('#c-bg', '#f6f2ea');
    await settle();
    await page.screenshot({ path: out('screenshot-justified.png') });

    // shot 3: masonry with white borders and corner badges
    await page.click('#btn-theme');
    await set('#c-layout', 'masonry');
    await set('#c-cols', 3);
    await set('#c-cellW', 560);
    await set('#c-radius', 0);
    await set('#c-bw', 8);
    await set('#c-bc', '#ffffff');
    await set('#c-bg', '#20252e');
    await set('#c-caption', 'index');
    await set('#c-capPos', 'badge');
    await set('#c-capSize', 30);
    await settle();
    await page.screenshot({ path: out('screenshot-masonry.png') });

    // shot 4: single row, same height, names on a top band, JPEG output settings visible
    await set('#c-layout', 'row');
    await set('#c-bw', 0);
    await set('#c-gap', 16);
    await set('#c-caption', 'name');
    await set('#c-capPos', 'top');
    await set('#c-rowH', 300);
    await set('#c-capSize', 20);
    await set('#c-format', 'image/jpeg');
    await set('#c-quality', 0.85);
    await settle();
    await page.screenshot({ path: out('screenshot-row.png') });

    // the README's example output: a real download from the page
    await set('#c-layout', 'grid');
    await set('#c-cols', 4);
    await set('#c-cellW', 600);
    await set('#c-cellH', 420);
    await set('#c-fit', 'cover');
    await set('#c-gap', 20);
    await set('#c-pad', 20);
    await set('#c-radius', 14);
    await set('#c-bg', '#14171c');
    await set('#c-caption', 'none');
    await set('#c-scale', 0.8);
    await set('#c-fname', 'example-montage');
    await settle(600);
    const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#btn-dl')]);
    await dl.saveAs(out(dl.suggestedFilename()));
  } finally {
    await browser.close();
    server.close();
  }
})().catch(e => { console.error(e); process.exit(1); });
