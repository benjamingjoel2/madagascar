// `npm run check`: WCAG AA contrast for every colour pair the site uses,
// data sanity checks, and a broken internal link scan of ./dist.
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";
import config from "../site.config.js";
import regions from "../src/data/regions.js";
import wildlife from "../src/data/wildlife.js";
import { places, legs } from "../src/data/routes.js";
import journeys from "../src/data/journeys.js";
import stays from "../src/data/stays.js";
import photos from "../src/data/photos.js";

let failed = 0;
const fail = (msg) => { failed++; console.error("✗ " + msg); };
const p = config.palette;

// ── contrast ──
function lum(hex) {
  const [r, g, b] = hex.replace("#", "").match(/../g).map((h) => {
    const c = parseInt(h, 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

// [foreground, background, minimum, where it is used]
const pairs = [
  ["bark", "cream", 4.5, "body text"],
  ["ink", "cream", 4.5, "headings"],
  ["laterite", "cream", 4.5, "links"],
  ["laterite", "white", 4.5, "links on cards"],
  ["lateriteDark", "cream", 4.5, "kickers, link hover"],
  ["lateriteDark", "barkLight", 4.5, "kickers on bark sections"],
  ["lateriteDark", "white", 4.5, "kickers on cards"],
  ["white", "laterite", 4.5, "buttons, CTA band, closed cells"],
  ["white", "lateriteDark", 4.5, "button hover"],
  ["white", "rainforest", 4.5, "header, page heads"],
  ["gold", "rainforest", 4.5, "kickers on green"],
  ["goldLight", "rainforest", 4.5, "links on green"],
  ["ink", "gold", 4.5, "gold buttons, flight labels"],
  ["ink", "goldLight", 4.5, "callouts"],
  ["bark", "goldLight", 3, "'possible' cell symbol (non-text)"],
  ["rainforest", "rainforestLight", 4.5, "'open' badges"],
  ["ink", "barkLight", 4.5, "chips"],
  ["bark", "white", 4.5, "text on cards"],
  ["barkLight", "ink", 4.5, "footer text"],
  ["goldLight", "ink", 4.5, "footer links"],
  ["ink", "sea", 4.5, "map labels"],
  ["rainforest", "cream", 3, "'good' cells (non-text)"],
  ["laterite", "cream", 3, "'closed' cells (non-text)"],
  ["gold", "ink", 3, "focus ring"],
];
for (const [fg, bg, min, use] of pairs) {
  const r = ratio(p[fg], p[bg]);
  if (r < min) fail(`Contrast ${fg} on ${bg} is ${r.toFixed(2)}:1, needs ${min}:1 (${use})`);
  else console.log(`✓ ${fg} on ${bg}: ${r.toFixed(2)}:1 (${use})`);
}

// ── data ──
const slugs = new Set(regions.map((r) => r.slug));
for (const w of wildlife) {
  if (!slugs.has(w.region)) fail(`wildlife ${w.id}: unknown region ${w.region}`);
  if (!/^[ODC]{12}$/.test(w.access)) fail(`wildlife ${w.id}: access needs 12 of O/D/C`);
  for (const s of w.species) if (!/^[GP-]{12}$/.test(s.months)) fail(`wildlife ${w.id} / ${s.name}: months needs 12 of G/P/-`);
}
for (const l of legs) if (!places[l.from] || !places[l.to]) fail(`leg ${l.from}→${l.to}: unknown place`);
for (const [k, pl] of Object.entries(places)) if (!slugs.has(pl.region)) fail(`place ${k}: unknown region`);
for (const j of journeys) for (const r of j.regions) if (!slugs.has(r)) fail(`journey ${j.slug}: unknown region ${r}`);
for (const s of stays) {
  if (!slugs.has(s.region)) fail(`stay ${s.name}: unknown region`);
  if (!s.name.startsWith("[Placeholder]")) console.warn(`! stay "${s.name}" is not marked as a placeholder: make sure it is real and confirmed`);
}
for (const [k, ph] of Object.entries(photos)) {
  for (const f of ["src", "photographer", "photographerUrl", "unsplashUrl", "location", "evidence", "alt", "width", "height"])
    if (!ph[f]) fail(`photo ${k}: missing ${f}`);
  if (k !== "hero" && !slugs.has(k)) fail(`photo ${k}: key is not a region slug`);
}

// ── links ──
const DIST = new URL("../dist/", import.meta.url).pathname;
if (!existsSync(DIST)) fail("dist/ missing: run npm run build first");
else {
  const files = [];
  const walk = (d) => readdirSync(d).forEach((f) => { const x = join(d, f); statSync(x).isDirectory() ? walk(x) : x.endsWith(".html") && files.push(x); });
  walk(DIST);
  for (const f of files) {
    const html = readFileSync(f, "utf8");
    for (const [, href] of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
      const target = join(DIST, href);
      const ok = existsSync(target) && (statSync(target).isFile() || existsSync(join(target, "index.html")));
      if (!ok) fail(`${f.replace(DIST, "")}: broken link ${href}`);
    }
  }
  console.log(`✓ scanned ${files.length} pages for internal links`);
}

if (failed) { console.error(`\n${failed} problem(s) found`); process.exit(1); }
console.log("\nAll checks passed");
