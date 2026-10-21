// Static site generator. No dependencies: `node build.mjs` writes ./dist.
import { mkdirSync, writeFileSync, readFileSync, rmSync, cpSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import config from "./site.config.js";
import regions from "./src/data/regions.js";
import { places, legs, roadAlternatives } from "./src/data/routes.js";
import wildlife from "./src/data/wildlife.js";
import journeys from "./src/data/journeys.js";
import stays from "./src/data/stays.js";
import journal from "./src/data/journal.js";
import seasons from "./src/data/seasons.js";
import photos from "./src/data/photos.js";
import sources from "./src/data/sources.js";

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = join(ROOT, "dist");
const { brand, contact, palette } = config;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const regionBySlug = Object.fromEntries(regions.map((r) => [r.slug, r]));

// ── helpers ──────────────────────────────────────────────────
const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const fmtH = (h) => {
  const whole = Math.floor(h);
  const frac = Math.round((h - whole) * 4) / 4;
  const f = { 0: "", 0.25: "¼", 0.5: "½", 0.75: "¾" }[frac];
  return whole === 0 ? (f ? f : "0") : `${whole}${f}`;
};
const fmtRange = ([a, b]) => (a === b ? `${fmtH(a)} h` : `${fmtH(a)}–${fmtH(b)} h`);
const fmtDate = (iso) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const dms = (v, pos, neg) => {
  const a = Math.abs(v), d = Math.floor(a), m = Math.round((a - d) * 60);
  return `${d}°${String(m).padStart(2, "0")}′${v >= 0 ? pos : neg}`;
};
const coords = (r) => `${dms(r.lat, "N", "S")} ${dms(r.lon, "E", "W")}`;
const pad = (n) => String(n).padStart(2, "0");
const label = (n, text) => `<p class="label"><span class="label__n">(${pad(n)})</span> ${text}</p>`;
const ARROW = `<span class="arrow" aria-hidden="true">↗</span>`;

function write(path, html) {
  const file = join(OUT, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

// ── photos ───────────────────────────────────────────────────
const unsplashUrl = (p, w) => `${p.src}?auto=format&fit=crop&w=${w}&q=72`;
const utm = "utm_source=" + encodeURIComponent(brand.shortName.toLowerCase().replace(/\s+/g, "_")) + "&utm_medium=referral";
const credit = (p) =>
  `Photo: <a href="${p.photographerUrl}?${utm}">${esc(p.photographer)}</a> on <a href="${p.unsplashUrl}?${utm}">Unsplash</a> · ${esc(p.location)}`;

function img(p, { sizes = "100vw", eager = false, cls = "" } = {}) {
  const ratio = p.height / p.width;
  const srcset = [480, 800, 1200, 1800, 2400].map((w) => `${unsplashUrl(p, w)} ${w}w`).join(", ");
  return `<img class="${cls}" src="${unsplashUrl(p, 1200)}" srcset="${srcset}" sizes="${sizes}" width="1200" height="${Math.round(1200 * ratio)}" alt="${esc(p.alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" style="background:${p.color || palette.nightSoft}">`;
}

// Contour-line artwork: used where we don't yet have a photo taken in the place.
// Deterministic per slug, so each region gets its own "terrain".
function contour(seed, { cls = "" } = {}) {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const rnd = () => ((h = (h * 1664525 + 1013904223) >>> 0) / 2 ** 32);
  const cx = 300 + rnd() * 400, cy = 160 + rnd() * 200, a1 = rnd() * 6, a2 = rnd() * 6;
  const rings = [];
  for (let k = 1; k <= 22; k++) {
    const pts = [];
    for (let t = 0; t <= 64; t++) {
      const th = (t / 64) * Math.PI * 2;
      const r = k * 26 * (1 + 0.18 * Math.sin(3 * th + a1 + k * 0.15) + 0.1 * Math.sin(5 * th + a2));
      pts.push(`${(cx + r * 1.5 * Math.cos(th)).toFixed(1)},${(cy + r * Math.sin(th)).toFixed(1)}`);
    }
    rings.push(`<polyline points="${pts.join(" ")}"/>`);
  }
  return `<svg class="contour ${cls}" viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><g>${rings.join("")}</g></svg>`;
}

function figure(key, opts = {}) {
  const p = photos[key];
  const r = regionBySlug[key];
  if (p) return `<figure class="fig ${opts.cls || ""}">${img(p, opts)}<figcaption class="fig__cap">${credit(p)}</figcaption></figure>`;
  return `<figure class="fig fig--art ${opts.cls || ""}">${contour(key)}
    <figcaption class="fig__art-cap">${r ? `<span>${esc(coords(r))}</span>` : ""}<span>Photo to come. We only use photos taken here.</span></figcaption></figure>`;
}

// ── layout ───────────────────────────────────────────────────
const NAV = [
  ["/regions/", "Regions"],
  ["/map/", "Driving map"],
  ["/wildlife/", "Wildlife"],
  ["/journeys/", "Journeys"],
  ["/when-to-go/", "When to go"],
  ["/stays/", "Stays"],
  ["/journal/", "Journal"],
  ["/about/", "About"],
];

const LOGO = `<svg class="brand__mark" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
  <path d="M13 31h6l-1-14c3-1 6-3 8-6-3 1-5 1-7 0 2-2 3-4 3-7-2 2-4 3-6 3-2 0-4-1-6-3 0 3 1 5 3 7-2 1-4 1-7 0 2 3 5 5 8 6z" fill="currentColor"/>
</svg>`;

function layout({ title, description = brand.description, path, body, scripts = [], ogImage }) {
  const fullTitle = title ? `${title} · ${brand.name}` : `${brand.name}: ${brand.tagline}`;
  const nav = NAV.map(
    ([href, l], i) => `<li><a href="${href}"${path.startsWith(href) ? ' aria-current="page"' : ""}><span class="nav__n" aria-hidden="true">${pad(i + 1)}</span>${l}</a></li>`
  ).join("");
  const og = ogImage || (photos.hero ? unsplashUrl(photos.hero, 1200) : "");
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${config.siteUrl}${path}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${config.siteUrl}${path}">
${og ? `<meta property="og:image" content="${og}">` : ""}
<meta name="theme-color" content="${palette.night}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://images.unsplash.com">
<link rel="stylesheet" href="${config.fonts.href}">
<link rel="stylesheet" href="/assets/styles.css">
<script>document.documentElement.classList.add("js")</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="hdr" id="hdr">
  <div class="hdr__in">
    <a class="brand" href="/">${LOGO}<span>${esc(brand.name)}</span></a>
    <nav class="nav" id="main-nav" aria-label="Main"><ul>${nav}</ul></nav>
    <div class="hdr__end">
      <a class="pill pill--gold" href="/enquire/"${path === "/enquire/" ? ' aria-current="page"' : ""}>Enquire ${ARROW}</a>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="main-nav" hidden><span class="menu-btn__bars" aria-hidden="true"></span><span class="menu-btn__t">Menu</span></button>
    </div>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="ftr">
  <div class="wrap">
    <div class="ftr__grid">
      <div class="ftr__intro">
        ${label(0, "Madagascar, honestly")}
        <p class="ftr__lead">${esc(brand.description)}</p>
        <a class="pill pill--light" href="/enquire/">Start an enquiry ${ARROW}</a>
      </div>
      <div>
        <h2 class="ftr__h">Contact</h2>
        <ul class="plain">
          <li><a href="mailto:${contact.email}">${esc(contact.email)}</a></li>
          <li><a href="tel:${contact.phone.replace(/[^+\d]/g, "")}">${esc(contact.phone)}</a></li>
          ${contact.whatsapp ? `<li><a href="https://wa.me/${contact.whatsapp.replace(/\D/g, "")}">WhatsApp</a></li>` : ""}
          <li>${esc(contact.officeHours)}</li>
          <li>${esc(contact.address)}</li>
        </ul>
      </div>
      <div>
        <h2 class="ftr__h">Explore</h2>
        <ul class="plain">${NAV.map(([h, l]) => `<li><a href="${h}">${l}</a></li>`).join("")}</ul>
      </div>
      <div>
        <h2 class="ftr__h">Small print</h2>
        <ul class="plain"><li><a href="/sources/">Sources</a></li><li><a href="/credits/">Photo credits</a></li><li><a href="/enquire/">Enquire</a></li></ul>
      </div>
    </div>
    <p class="ftr__mark" aria-hidden="true">${esc(brand.name)}</p>
    <div class="ftr__small">
      <p>Driving times, park access and seasons are guidance, not guarantees. We check them before every booking.</p>
      <p>© ${new Date().getFullYear()} ${esc(brand.name)}</p>
    </div>
  </div>
</footer>
<script src="/assets/site.js" defer></script>
${scripts.map((s) => `<script src="${s}" defer></script>`).join("\n")}
</body>
</html>`;
}

// Dark page head used by every inner page.
const pageHead = ({ n, kicker, title, lead, art }) => `
<section class="phead">
  ${art ? contour(art, { cls: "phead__art" }) : ""}
  <div class="wrap phead__in">
    ${kicker ? label(n ?? 0, esc(kicker)) : ""}
    <h1 class="phead__t">${title}</h1>
    ${lead ? `<p class="phead__lead">${lead}</p>` : ""}
  </div>
</section>`;

const ACCESS_LABEL = { open: "Open all year", seasonal: "Seasonal access", "closed-wet": "Closed in the wet season" };
const accessTag = (a) => `<span class="tag tag--${a}">${ACCESS_LABEL[a]}</span>`;

const cta = ({ title = "Tell us your dates. <em>We'll tell you what's realistic.</em>", text = "No obligation. A real person reads every enquiry and replies with honest advice." } = {}) => `
<section class="cta">
  ${photos["morondava-baobabs"] ? img(photos["morondava-baobabs"], { cls: "cta__img" }) : contour("cta", { cls: "cta__img" })}
  <div class="wrap cta__in reveal">
    <h2 class="cta__t">${title}</h2>
    <p>${text}</p>
    <a class="pill pill--gold pill--lg" href="/enquire/">Make an enquiry ${ARROW}</a>
  </div>
</section>`;

// ── map (SVG) ────────────────────────────────────────────────
const COAST = [
  [49.26, -11.95], [49.6, -12.5], [49.95, -13.1], [50.05, -13.6], [50.17, -14.27], [50.28, -14.9],
  [50.48, -15.27], [50.45, -15.6], [50.2, -15.98], [49.95, -15.65], [49.85, -15.45], [49.74, -15.43],
  [49.68, -15.6], [49.78, -16.1], [49.58, -16.92], [49.4, -17.38], [49.4, -18.15], [48.98, -19.33],
  [48.8, -19.9], [48.53, -20.58], [48.35, -21.23], [48.02, -22.15], [47.83, -22.82], [47.6, -23.35],
  [47.32, -24.28], [46.98, -25.03], [46.2, -25.2], [45.15, -25.6], [44.4, -25.25], [43.95, -24.68],
  [43.65, -23.67], [43.67, -23.35], [43.62, -23.15], [43.5, -22.4], [43.37, -21.75], [43.6, -21.3],
  [43.98, -20.73], [44.28, -20.28], [44.25, -19.7], [44.4, -19.3], [44.03, -18.06], [44.2, -17.2],
  [44.45, -16.2], [45.3, -15.95], [46.32, -15.72], [46.9, -15.25], [47.6, -14.9], [47.75, -14.63],
  [48.0, -13.9], [48.45, -13.68], [48.6, -13.45], [48.9, -12.9], [48.95, -12.45], [49.1, -12.1],
];
const LON0 = 42.6, LAT0 = -11.3, K = 62, COSLAT = Math.cos((19 * Math.PI) / 180);
const proj = (lon, lat) => [((lon - LON0) * COSLAT * K).toFixed(1), ((LAT0 - lat) * K).toFixed(1)];
const MAP_W = Math.round((51.2 - LON0) * COSLAT * K), MAP_H = Math.round((LAT0 + 26) * K);

function mapSvg({ mini = false } = {}) {
  const coast = COAST.map(([lo, la]) => proj(lo, la).join(",")).join(" ");
  const [nbx, nby] = proj(48.27, -13.33);
  // graticule every 2 degrees
  const grid = [];
  for (let lat = -12; lat >= -26; lat -= 2) { const [, y] = proj(0, lat); grid.push(`<line x1="0" x2="${MAP_W}" y1="${y}" y2="${y}"/>`); }
  for (let lon = 44; lon <= 50; lon += 2) { const [x] = proj(lon, 0); grid.push(`<line y1="0" y2="${MAP_H}" x1="${x}" x2="${x}"/>`); }
  // flights first, so road labels sit on top of the dashed flight lines
  const order = legs.map((l, i) => [l, i]).sort((a, b) => (b[0].mode === "flight") - (a[0].mode === "flight"));
  const legSvg = order
    .map(([l, i]) => {
      const a = places[l.from], b = places[l.to];
      const [x1, y1] = proj(a.lon, a.lat).map(Number), [x2, y2] = proj(b.lon, b.lat).map(Number);
      if (l.mode === "flight") {
        // curve flights so they don't sit on top of roads
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
        const bend = l.bend ?? Math.min(60, len * 0.22);
        const cx = mx + (-dy / len) * bend, cy = my + (dx / len) * bend;
        const lx = (mx + cx) / 2 + (l.labelOffset?.[0] || 0), ly = (my + cy) / 2 + (l.labelOffset?.[1] || 0);
        return `<g class="leg leg--flight" data-leg="${i}">
          <path d="M${x1},${y1} Q${cx.toFixed(1)},${cy.toFixed(1)} ${x2},${y2}" />
          ${mini ? "" : `<g class="leg__label leg__label--flight" transform="translate(${lx.toFixed(1)},${ly.toFixed(1)})"><rect x="-32" y="-12" width="64" height="24" rx="12"/><text text-anchor="middle" y="4.5">✈ ${fmtRange(l.hours)}</text></g>`}
        </g>`;
      }
      const mx = (x1 + x2) / 2 + (l.labelOffset?.[0] || 0), my = (y1 + y2) / 2 + (l.labelOffset?.[1] || 0);
      const w = 68;
      return `<g class="leg leg--${l.mode}${l.season === "dry" ? " leg--dry" : ""}" data-leg="${i}">
        <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />
        ${mini ? "" : `<g class="leg__label" transform="translate(${mx.toFixed(1)},${my.toFixed(1)})"><rect x="${-w / 2}" y="-12" width="${w}" height="24" rx="12"/><text text-anchor="middle" y="4.5">${fmtRange(l.hours)}</text></g>`}
      </g>`;
    })
    .join("");
  // label offsets tuned so names don't collide
  const OFF = {
    tana: [-12, -10, "end"], andasibe: [12, 5, "start"], antsirabe: [10, 5, "start"], ranomafana: [10, -6, "start"],
    fianar: [-10, -6, "end"], ambalavao: [-10, 16, "end"], isalo: [10, 18, "start"], toliara: [8, 20, "start"],
    ifaty: [-10, -6, "end"], miandrivazo: [-8, 18, "end"], morondava: [-10, 18, "end"], bekopaka: [-10, -8, "end"],
    nosybe: [12, -8, "start"], maroantsetra: [-10, -6, "end"], masoala: [10, 18, "start"],
  };
  const placeSvg = Object.entries(places)
    .map(([key, p]) => {
      const [x, y] = proj(p.lon, p.lat);
      const [dx, dy, anchor] = OFF[key] || [8, 4, "start"];
      return `<g class="place${p.airport ? " place--airport" : ""}" data-place="${key}">
        <circle cx="${x}" cy="${y}" r="${p.airport ? 6.5 : 5}"/>
        ${mini ? "" : `<text x="${(+x + dx).toFixed(1)}" y="${(+y + dy).toFixed(1)}" text-anchor="${anchor}">${esc(p.name)}</text>`}
      </g>`;
    })
    .join("");
  return `<svg class="map-svg${mini ? " map-svg--mini" : ""}" viewBox="0 0 ${MAP_W} ${MAP_H}" ${mini ? 'aria-hidden="true" focusable="false"' : 'role="img" aria-labelledby="map-title map-desc"'}>
    ${mini ? "" : `<title id="map-title">Schematic driving-time map of Madagascar</title>
    <desc id="map-desc">Main overland routes and domestic flights with typical hours per leg. The same information is in the table below the map.</desc>`}
    <g class="grat">${grid.join("")}</g>
    <polygon class="land" points="${coast}"/>
    <ellipse class="land" cx="${nbx}" cy="${nby}" rx="9" ry="7"/>
    ${legSvg}
    ${placeSvg}
    ${mini ? "" : `<g class="compass" transform="translate(${MAP_W - 40},44)"><path d="M0,-18 L6,0 L0,-4 L-6,0Z"/><text y="18" text-anchor="middle">N</text></g>`}
  </svg>`;
}

function legsTable() {
  const MODE = { road: "Paved road", track: "4x4 track", boat: "Boat", flight: "Flight" };
  const rows = legs
    .map(
      (l, i) => `<tr data-leg="${i}">
      <th scope="row">${esc(places[l.from].name)} <span aria-hidden="true">→</span><span class="sr-only">to</span> ${esc(places[l.to].name)}</th>
      <td class="num"><strong>${fmtRange(l.hours)}</strong></td>
      <td class="num">${l.km ? `${l.km} km` : "—"}</td>
      <td>${MODE[l.mode]}${l.season === "dry" ? ' <span class="tag tag--closed-wet">Dry season only</span>' : ""}</td>
      <td>${l.flightSaves ? `<span class="tag tag--flight">Saves a day</span> ${esc(l.flightSaves)}` : esc(l.note || "")}</td>
    </tr>`
    )
    .join("");
  return `<div class="table-scroll" tabindex="0" role="region" aria-label="All legs, scrollable">
  <table class="dtable legs-table">
    <caption class="sr-only">Every leg on the map, both directions</caption>
    <thead><tr><th scope="col">Leg</th><th scope="col">Typical hours</th><th scope="col">Distance</th><th scope="col">Type</th><th scope="col">Notes</th></tr></thead>
    <tbody>${rows}</tbody>
  </table></div>`;
}

// ── wildlife tables ──────────────────────────────────────────
const ACCESS_CELL = { O: ["open", "Open"], D: ["difficult", "Difficult"], C: ["closed", "Closed"] };
const SIGHT_CELL = { G: ["good", "Good"], P: ["possible", "Possible"], "-": ["none", "Unlikely"] };
const monthHead = () => MONTHS.map((m, i) => `<th scope="col" data-month="${i}"><abbr title="${MONTHS_LONG[i]}">${m[0]}</abbr><span class="sr-only">${m.slice(1)}</span></th>`).join("");
const accessCells = (str) =>
  [...str].map((c, i) => `<td class="cell cell--${ACCESS_CELL[c][0]}" data-month="${i}"><span class="sr-only">${ACCESS_CELL[c][1]}</span></td>`).join("");

function parkTable(p, n) {
  const rows = p.species
    .map(
      (s) => `<tr data-type="${s.type}">
      <th scope="row"><span class="sp-name">${esc(s.name)}</span> <span class="chance chance--${s.chance}">${s.chance === "likely" ? "Likely" : s.chance === "possible" ? "Possible" : "Unlikely"}</span>
        <i class="latin">${esc(s.latin)}</i>
        ${s.note ? `<span class="sp-note">${esc(s.note)}</span>` : ""}</th>
      ${[...s.months].map((c, i) => `<td class="cell cell--${SIGHT_CELL[c][0]}" data-month="${i}"><span class="sr-only">${SIGHT_CELL[c][1]}</span></td>`).join("")}
    </tr>`
    )
    .join("");
  const r = regionBySlug[p.region];
  return `<section class="park" id="${p.id}" data-park="${p.id}" aria-labelledby="${p.id}-h">
  <div class="park__head">
    <p class="park__n">${n != null ? `(${pad(n)})` : ""} <a href="/regions/${r.slug}/">${esc(r.name)}</a></p>
    <h3 class="park__t" id="${p.id}-h">${esc(p.park)}</h3>
    <p class="park__meta">${esc(p.accessNote)}</p>
  </div>
  <div class="table-scroll" tabindex="0" role="region" aria-label="${esc(p.park)} by month, scrollable">
  <table class="dtable month-table">
    <thead><tr><th scope="col" class="month-table__label">Species</th>${monthHead()}</tr></thead>
    <tbody>
      <tr class="access-row"><th scope="row">Park access</th>${accessCells(p.access)}</tr>
      ${rows}
    </tbody>
  </table></div>
</section>`;
}

const legend = () => `
<ul class="legend" aria-label="Key">
  <li><i class="key cell--good"></i> Good chance</li>
  <li><i class="key cell--possible"></i> Possible</li>
  <li><i class="key cell--none"></i> Unlikely</li>
  <li><i class="key cell--difficult"></i> Access difficult</li>
  <li><i class="key cell--closed"></i> Usually closed</li>
</ul>`;

function accessOverview() {
  return `<div class="table-scroll" tabindex="0" role="region" aria-label="Access by month, scrollable">
  <table class="dtable month-table access-table">
    <caption class="sr-only">Park access by month</caption>
    <thead><tr><th scope="col" class="month-table__label">Park</th>${monthHead()}</tr></thead>
    <tbody>${wildlife.map((p) => `<tr><th scope="row"><a href="/wildlife/#${p.id}">${esc(p.park)}</a></th>${accessCells(p.access)}</tr>`).join("")}</tbody>
  </table></div>`;
}

// ── shared blocks ────────────────────────────────────────────
function regionRow(r, i) {
  const l = legs.find((x) => places[x.from].region === r.slug || places[x.to].region === r.slug);
  return `<li class="rrow reveal">
  <a class="rrow__a" href="/regions/${r.slug}/">
    <span class="rrow__n">${pad(i + 1)}</span>
    <span class="rrow__name">${esc(r.name)}</span>
    <span class="rrow__kicker">${esc(r.kicker)}</span>
    <span class="rrow__meta">${accessTag(r.access)}</span>
    <span class="rrow__thumb">${photos[r.slug] ? img(photos[r.slug], { sizes: "200px" }) : contour(r.slug)}</span>
    <span class="rrow__go" aria-hidden="true">↗</span>
  </a>
</li>`;
}

const meter = (n, max = 5) =>
  `<span class="meter" aria-hidden="true">${Array.from({ length: max }, (_, i) => `<i class="${i < n ? "on" : ""}"></i>`).join("")}</span>`;

function journeyCard(j, i) {
  const lead = photos[j.photo] ? j.photo : j.regions.find((s) => photos[s]) || j.regions[1];
  return `<article class="jcard reveal">
  <a class="jcard__a" href="/journeys/#${j.slug}">
    <div class="jcard__media">${photos[lead] ? img(photos[lead], { sizes: "(min-width: 60em) 45vw, 100vw" }) : contour(j.slug)}<span class="jcard__n">(${pad(i + 1)})</span></div>
    <div class="jcard__body">
      <h3 class="jcard__t">${esc(j.name)}</h3>
      <p class="jcard__sub">${j.days} days · ${esc(j.months)}</p>
      <p>${esc(j.summary)}</p>
      <dl class="stats">
        <div><dt>Hours on the road</dt><dd>${esc(j.stats.roadHours)}</dd></div>
        <div><dt>Domestic flights</dt><dd>${j.stats.flights}</dd></div>
        <div><dt>Effort</dt><dd>${meter(j.stats.effort)}<span class="sr-only">${j.stats.effort} out of 5</span></dd></div>
      </dl>
    </div>
  </a>
</article>`;
}

function stayCard(s) {
  return `<article class="stay"><p class="mono">${esc(s.style)}</p><h3 class="stay__t">${esc(s.name)}</h3><p>${esc(s.note)}</p><p class="stay__r"><a href="/regions/${s.region}/">${esc(regionBySlug[s.region].name)}</a></p></article>`;
}

const RATING = ["Difficult", "Good, with caveats", "Great"];
function seasonStrip() {
  return `<ol class="strip">${seasons
    .map((s, i) => `<li class="strip__m strip__m--${s.rating}"><span class="strip__bar"></span><span class="strip__name">${MONTHS[i]}</span><span class="sr-only">: ${RATING[s.rating - 1]}</span></li>`)
    .join("")}</ol>
  <ul class="legend legend--strip"><li><i class="key strip-key--3"></i> Great</li><li><i class="key strip-key--2"></i> Good, with caveats</li><li><i class="key strip-key--1"></i> Difficult</li></ul>`;
}

// ── pages ────────────────────────────────────────────────────
function home() {
  const tana = regionBySlug.antananarivo;
  return layout({
    path: "/",
    body: `
<section class="hero">
  ${photos.hero ? figure("hero", { eager: true, cls: "hero__fig" }) : contour("hero", { cls: "hero__fig" })}
  <div class="hero__top wrap">
    <p class="mono">Madagascar</p>
    <p class="mono">${esc(coords(tana))}</p>
  </div>
  <div class="hero__bottom wrap">
    <div class="hero__row">
      <p class="mono hero__tag">Slow overland journeys<br>for nature lovers</p>
      <div class="hero__intro">
        <p>${esc(brand.description)}</p>
        <p class="actions"><a class="pill pill--light" href="/journeys/">Explore journeys ${ARROW}</a> <a class="pill pill--ghost" href="/map/">Real driving times ${ARROW}</a></p>
      </div>
    </div>
    <h1 class="wordmark">${esc(brand.name)}<span class="sr-only">: ${esc(brand.tagline)}</span></h1>
  </div>
</section>

<section class="sec">
  <div class="wrap statement">
    ${label(1, "The honest version")}
    <p class="statement__t reveal">Antsirabe to Ranomafana is 250 km. It takes six to seven hours. <span>We tell you that before you book, and we plan every day around it, because the slow road is the way to wildlife found nowhere else on Earth.</span></p>
  </div>
  <div class="wrap">
    <dl class="figures">
      <div class="reveal"><dt>6–7 h</dt><dd>for 250 km, Antsirabe to Ranomafana</dd></div>
      <div class="reveal"><dt>2½ days</dt><dd>saved by flying back from Toliara instead of driving the RN7 again</dd></div>
      <div class="reveal"><dt>100%</dt><dd>of lemurs live nowhere else on Earth</dd></div>
      <div class="reveal"><dt>Dec–Apr</dt><dd>Tsingy de Bemaraha is usually closed</dd></div>
    </dl>
  </div>
</section>

<section class="sec sec--dark">
  <div class="wrap">
    <div class="sec__head">
      ${label(2, "Plan with real numbers")}
      <h2 class="h-xl">Two tools we wish <em>every</em> Madagascar site had.</h2>
    </div>
    <div class="tools">
      <a class="tool reveal" href="/map/">
        <div class="tool__media tool__media--map">${mapSvg({ mini: true })}</div>
        <div class="tool__body">
          <p class="mono">Signature tool 01</p>
          <h3 class="tool__t">The driving-time map</h3>
          <p>Every main leg in hours, not kilometres. See where a domestic flight saves a day, and compare the road with flying between any two places.</p>
          <span class="pill pill--light">Open the map ${ARROW}</span>
        </div>
      </a>
      <a class="tool reveal" href="/wildlife/">
        <div class="tool__media tool__media--grid">
          <table class="mini-grid" aria-hidden="true"><tbody>
            <tr><th>Indri</th>${[..."GGGGGGGGGGGG"].map((c) => `<td class="cell cell--${SIGHT_CELL[c][0]}"></td>`).join("")}</tr>
            <tr><th>Fossa</th>${[..."-----PPPPGGP"].map((c) => `<td class="cell cell--${SIGHT_CELL[c][0]}"></td>`).join("")}</tr>
            <tr><th>Red ruffed</th>${[..."PPPPPPPPGGGG"].map((c) => `<td class="cell cell--${SIGHT_CELL[c][0]}"></td>`).join("")}</tr>
            <tr><th>Tsingy access</th>${[..."CCCDDOOOOODC"].map((c) => `<td class="cell cell--${ACCESS_CELL[c][0]}"></td>`).join("")}</tr>
            <tr><td></td>${MONTHS.map((m) => `<td class="mini-grid__m">${m[0]}</td>`).join("")}</tr>
          </tbody></table>
        </div>
        <div class="tool__body">
          <p class="mono">Signature tool 02</p>
          <h3 class="tool__t">Lemurs by park and month</h3>
          <p>Which species you're likely to see where, in which months, and which parks are hard to reach or closed in the rainy season.</p>
          <span class="pill pill--light">Open the wildlife guide ${ARROW}</span>
        </div>
      </a>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec__head sec__head--split">
      <div>${label(3, "Where we go")}<h2 class="h-xl">Ten places, <em>a lot of road</em> between them.</h2></div>
      <a class="pill pill--dark" href="/regions/">All regions ${ARROW}</a>
    </div>
    <ol class="rlist">${regions.map(regionRow).join("")}</ol>
  </div>
</section>

<section class="sec sec--bark">
  <div class="wrap">
    <div class="sec__head sec__head--split">
      <div>${label(4, "Sample journeys")}<h2 class="h-xl">Built around <em>slow roads</em>.</h2></div>
      <a class="pill pill--dark" href="/journeys/">All journeys ${ARROW}</a>
    </div>
    <div class="jgrid">${journeys.map(journeyCard).join("")}</div>
  </div>
</section>

<section class="sec">
  <div class="wrap split">
    <div>
      ${label(5, "When to go")}
      <h2 class="h-xl">Two seasons, <em>and a lot of local variation</em>.</h2>
      <p class="lead">For a first trip, aim for April to November. September to November is our favourite: it's warm, lemurs have young, and every park is open.</p>
      <p><a class="pill pill--dark" href="/when-to-go/">Month by month ${ARROW}</a></p>
    </div>
    <div class="reveal">${seasonStrip()}</div>
  </div>
</section>

<section class="sec sec--line">
  <div class="wrap">
    <div class="sec__head sec__head--split">
      <div>${label(6, "Journal")}<h2 class="h-xl">Notes from <em>the slow road</em>.</h2></div>
      <a class="pill pill--dark" href="/journal/">All posts ${ARROW}</a>
    </div>
    <div class="posts">${journal.map(postCard).join("")}</div>
  </div>
</section>
${cta()}`,
  });
}

function postCard(p) {
  return `<article class="post reveal"><a href="/journal/${p.slug}/"><p class="mono"><time datetime="${p.date}">${fmtDate(p.date)}</time></p><h3 class="post__t">${esc(p.title)}</h3><p>${esc(p.excerpt)}</p><span class="post__more">Read ${ARROW}</span></a></article>`;
}

function regionsIndex() {
  return layout({
    path: "/regions/",
    title: "Regions",
    description: "Ten regions of Madagascar, from the indri forests of Andasibe to the Tsingy de Bemaraha, with honest notes on access and seasons.",
    body: `${pageHead({ n: 1, kicker: "Regions", title: "Ten places, <em>a lot of road</em> between them.", lead: "Madagascar is about the size of France and Belgium combined, and most journeys cover only two or three regions properly. Here is what each one offers, and how hard it is to reach.", art: "regions" })}
<section class="sec"><div class="wrap"><ol class="rlist">${regions.map(regionRow).join("")}</ol></div></section>
${cta()}`,
  });
}

function regionPage(r) {
  const idx = regions.indexOf(r);
  const prev = regions[(idx - 1 + regions.length) % regions.length], next = regions[(idx + 1) % regions.length];
  const parks = wildlife.filter((p) => p.region === r.slug);
  const myStays = stays.filter((s) => s.region === r.slug);
  const myJourneys = journeys.filter((j) => j.regions.includes(r.slug));
  const myLegs = legs.filter((l) => places[l.from].region === r.slug || places[l.to].region === r.slug);
  const p = photos[r.slug];
  return layout({
    path: `/regions/${r.slug}/`,
    title: r.name,
    description: r.summary,
    ogImage: p ? unsplashUrl(p, 1200) : undefined,
    body: `
<section class="rhero${p ? " rhero--photo" : ""}">
  ${p ? figure(r.slug, { eager: true, cls: "rhero__fig" }) : contour(r.slug, { cls: "rhero__fig" })}
  <div class="wrap rhero__in">
    <p class="mono rhero__crumb"><a href="/regions/">Regions</a> / ${pad(idx + 1)}</p>
    <h1 class="rhero__t">${esc(r.name)}</h1>
    <div class="rhero__meta">
      <p class="mono">${esc(r.kicker)}</p>
      <p class="mono">${esc(coords(r))}</p>
      ${p ? "" : '<p class="mono rhero__note">Photo to come. We only use photos taken here.</p>'}
    </div>
  </div>
</section>
<section class="sec"><div class="wrap region-layout">
  <div class="prose">
    <p class="lead lead--serif">${esc(r.summary)}</p>
    ${r.body.map((x) => `<p>${esc(x)}</p>`).join("")}
    <h2>Highlights</h2>
    <ul class="ticks">${r.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>
  </div>
  <aside class="glance" aria-label="Key facts">
    <p class="mono">At a glance</p>
    <dl>
      <div><dt>Getting there</dt><dd>${esc(r.gettingThere)}</dd></div>
      <div><dt>Best months</dt><dd>${esc(r.bestMonths)}</dd></div>
      <div><dt>Access</dt><dd>${accessTag(r.access)}<span class="glance__note">${esc(r.accessNote)}</span></dd></div>
    </dl>
    ${myLegs.length ? `<p class="mono glance__h">Travel times</p><ul class="plain legs-mini">${myLegs.map((l) => `<li><span>${l.mode === "flight" ? "✈ " : ""}${esc(places[l.from].name)} → ${esc(places[l.to].name)}</span><strong>${fmtRange(l.hours)}</strong></li>`).join("")}</ul><a class="pill pill--dark" href="/map/">Driving-time map ${ARROW}</a>` : ""}
  </aside>
</div></section>
${parks.length ? `<section class="sec sec--paper2"><div class="wrap"><div class="sec__head">${label(1, "Wildlife")}<h2 class="h-lg">Wildlife here, <em>month by month</em>.</h2></div>${legend()}${parks.map((pk) => parkTable(pk)).join("")}<p><a class="pill pill--dark" href="/wildlife/">Full wildlife guide ${ARROW}</a></p></div></section>` : ""}
${myStays.length ? `<section class="sec"><div class="wrap"><div class="sec__head">${label(2, "Where to stay")}<h2 class="h-lg">Close to the forest.</h2><p class="note">Placeholder names: our partner list is being finalised.</p></div><div class="sgrid">${myStays.map(stayCard).join("")}</div></div></section>` : ""}
${myJourneys.length ? `<section class="sec sec--bark"><div class="wrap"><div class="sec__head">${label(3, "Journeys")}<h2 class="h-lg">Journeys that include ${esc(r.name)}.</h2></div><div class="jgrid">${myJourneys.map((j) => journeyCard(j, journeys.indexOf(j))).join("")}</div></div></section>` : ""}
<nav class="pager wrap" aria-label="More regions">
  <a href="/regions/${prev.slug}/"><span class="mono">Previous</span><span class="pager__t">${esc(prev.name)}</span></a>
  <a href="/regions/${next.slug}/" class="pager__next"><span class="mono">Next</span><span class="pager__t">${esc(next.name)}</span></a>
</nav>
${cta({ title: `Thinking about ${esc(r.name)}? <em>Tell us your dates.</em>` })}`,
  });
}

function mapPage() {
  const graph = {
    places: Object.fromEntries(Object.entries(places).map(([k, p]) => [k, { name: p.name }])),
    legs: legs.map((l) => ({ from: l.from, to: l.to, mode: l.mode, hours: l.hours, season: l.season })),
  };
  const opts = Object.entries(places).map(([k, p]) => `<option value="${k}">${esc(p.name)}</option>`).join("");
  return layout({
    path: "/map/",
    title: "Driving-time map",
    description: "Realistic driving hours for every main leg in Madagascar, and where a domestic flight saves a day.",
    scripts: ["/assets/map.js"],
    body: `${pageHead({
      n: 1,
      kicker: "Signature tool",
      title: "The driving-time map.",
      lead: "Roads in Madagascar are slow: a 250 km leg can take seven hours. This map shows realistic hours for each leg with a private driver, and marks the places where a domestic flight saves a day.",
    })}
<section class="sec sec--dark sec--flush"><div class="wrap map-layout">
  <div class="map-wrap">
    ${mapSvg()}
    <p class="mono map-note">Schematic. Towns are placed by real coordinates; roads are drawn as straight lines.</p>
  </div>
  <div class="map-side">
    <ul class="plain map-key" aria-label="Key">
      <li><svg width="40" height="10" aria-hidden="true"><line x1="0" y1="5" x2="40" y2="5" class="key-road"/></svg> Paved road</li>
      <li><svg width="40" height="10" aria-hidden="true"><line x1="0" y1="5" x2="40" y2="5" class="key-track"/></svg> 4x4 track, dry season only</li>
      <li><svg width="40" height="10" aria-hidden="true"><line x1="0" y1="5" x2="40" y2="5" class="key-boat"/></svg> Boat</li>
      <li><svg width="40" height="10" aria-hidden="true"><line x1="0" y1="5" x2="40" y2="5" class="key-flight"/></svg> Domestic flight that saves a day</li>
    </ul>
    <form class="planner" id="planner" data-graph='${esc(JSON.stringify(graph))}'>
      <p class="mono">Route planner</p>
      <h2 class="planner__t">How long between two places?</h2>
      <div class="field-row">
        <label>From <select name="from">${opts}</select></label>
        <label>To <select name="to">${opts.replace('value="isalo"', 'value="isalo" selected')}</select></label>
      </div>
      <label class="check"><input type="checkbox" name="dry" checked> Travelling in the dry season (May–November)</label>
      <div class="planner__out" id="planner-out" aria-live="polite"><p>Choose two places to compare the road with flying.</p></div>
      <noscript><p>The planner needs JavaScript. All legs are listed in the table below.</p></noscript>
    </form>
  </div>
</div></section>
<section class="sec"><div class="wrap">
  <div class="sec__head">${label(2, "Flights")}<h2 class="h-lg">Where a flight <em>saves a day</em>.</h2></div>
  <div class="fgrid">${legs
    .filter((l) => l.flightSaves)
    .map((l) => `<article class="fcard reveal"><p class="mono">✈ About ${fmtRange(l.hours)} in the air</p><h3 class="fcard__t">${esc(places[l.from].name)} ↔ ${esc(places[l.to].name)}</h3><p>${esc(l.flightSaves)}</p></article>`)
    .join("")}</div>
  <div class="split split--top">
    <div><h3 class="h-md">The road alternatives</h3>
    <ul class="plain alt-list">${roadAlternatives.map((a) => `<li><span>${esc(a.from)} → ${esc(a.to)}</span><strong>${esc(a.hours)}</strong><span class="mono">${esc(a.days)}</span></li>`).join("")}</ul></div>
    <p class="note">Domestic schedules change often, and routes like Morondava and Maroantsetra may have only about one flight a week. Allow 2–3 hours for check-in and transfers, and keep a spare day before an international connection.</p>
  </div>
</div></section>
<section class="sec sec--paper2"><div class="wrap">
  <div class="sec__head">${label(3, "Every leg")}<h2 class="h-lg">All legs, both directions.</h2></div>
  ${legsTable()}
  <p class="note">Hours assume a private vehicle with an experienced driver, in daylight, with short stops. Taxi-brousses take longer. We do not drive after dark. <a href="/sources/">Sources</a>.</p>
</div></section>
${cta()}`,
  });
}

function wildlifePage() {
  const parkOpts = wildlife.map((p) => `<option value="${p.id}">${esc(p.park)}</option>`).join("");
  const monthOpts = MONTHS_LONG.map((m, i) => `<option value="${i}">${m}</option>`).join("");
  return layout({
    path: "/wildlife/",
    title: "Lemur and wildlife guide",
    description: "Which lemurs and other wildlife you're likely to see in each Madagascar park, month by month, and which parks close in the rainy season.",
    scripts: ["/assets/wildlife.js"],
    body: `${pageHead({
      n: 2,
      kicker: "Signature tool",
      title: "Lemurs and wildlife, <em>park by park</em>.",
      lead: "Which species you're likely to see where, and in which months. The top row of each table shows whether the park is open, hard to reach or usually closed. These are our best estimates, not promises.",
      art: "wildlife",
    })}
<section class="sec"><div class="wrap">
  <form class="filters" id="wl-filters" aria-label="Filter the wildlife guide">
    <label>Park <select name="park"><option value="">All parks</option>${parkOpts}</select></label>
    <label>Month <select name="month"><option value="">All months</option>${monthOpts}</select></label>
    <label>Show <select name="type"><option value="">All wildlife</option><option value="lemur">Lemurs only</option><option value="other">Other wildlife</option></select></label>
  </form>
  <div id="wl-summary" class="wl-summary" aria-live="polite"></div>
  ${legend()}
  ${wildlife.map((p, i) => parkTable(p, i + 1)).join("")}
</div></section>
<section class="sec sec--dark"><div class="wrap">
  <div class="sec__head">${label(10, "Rainy season")}<h2 class="h-lg">Hard to reach or <em>closed in the rains</em>.</h2>
  <p class="lead">The rainy season runs roughly from November or December to March, and the highest cyclone risk is from January to March. Most notably, the <a href="/regions/tsingy-de-bemaraha/">Tsingy de Bemaraha</a> is usually closed in the wet season, roughly December to April.</p></div>
  ${legend()}
  ${accessOverview()}
</div></section>
<section class="sec"><div class="wrap split">
  <div>${label(11, "How we use these tables")}<h2 class="h-lg">Likely, possible, <em>or luck</em>.</h2></div>
  <div class="prose">
    <ul class="ticks">
      <li><strong>Likely</strong> means most of our travellers see it on a two- or three-day visit with a good local guide.</li>
      <li><strong>Possible</strong> means some days yes, some days no.</li>
      <li><strong>Unlikely</strong> means that if you see it, enjoy your luck. We will never promise it.</li>
    </ul>
    <p>We never feed wildlife, use call playback for lemurs, or visit places that keep wild animals for photos. <a href="/sources/">Sources for these tables</a>.</p>
  </div>
</div></section>
${cta()}`,
  });
}

function journeysPage() {
  return layout({
    path: "/journeys/",
    title: "Sample journeys",
    description: "Four sample Madagascar journeys with realistic travel times, from the RN7 overland route to the Tsingy and Masoala.",
    body: `${pageHead({ n: 3, kicker: "Sample journeys", title: "Journeys built around <em>slow roads</em>.", lead: "Use these as starting points. Every trip we plan is tailor-made and shows the real driving hours. We quote prices for your dates once you've told us what you want.", art: "journeys" })}
<section class="sec"><div class="wrap jlist">
${journeys
  .map(
    (j, i) => `<article class="journey" id="${j.slug}">
  <header class="journey__head">
    <p class="mono">(${pad(i + 1)}) ${j.days} days · ${esc(j.months)}</p>
    <h2 class="journey__t">${esc(j.name)}</h2>
    <p class="lead">${esc(j.summary)}</p>
    <dl class="stats stats--wide">
      <div><dt>Days</dt><dd>${j.days}</dd></div>
      <div><dt>Hours on the road</dt><dd>${esc(j.stats.roadHours)}</dd></div>
      <div><dt>Domestic flights</dt><dd>${j.stats.flights}</dd></div>
      <div><dt>Effort</dt><dd>${meter(j.stats.effort)}<span class="sr-only">${j.stats.effort} out of 5</span></dd></div>
    </dl>
    <p class="mono journey__pace">${esc(j.pace)}</p>
  </header>
  <div class="journey__body">
    <ol class="itin">${j.days_detail.map(([d, t, n]) => `<li><span class="itin__d">Day ${esc(d)}</span><div><strong>${esc(t)}</strong>${n ? `<span>${esc(n)}</span>` : ""}</div></li>`).join("")}</ol>
    <p class="honest"><span class="mono">Honest note</span> ${esc(j.honestNote)}</p>
    <p class="journey__regions mono">${j.regions.map((s) => `<a href="/regions/${s}/">${esc(regionBySlug[s].name)}</a>`).join(" · ")}</p>
    <p><a class="pill pill--gold" href="/enquire/?journey=${j.slug}">Enquire about this journey ${ARROW}</a></p>
  </div>
</article>`
  )
  .join("")}
</div></section>
${cta()}`,
  });
}

function whenToGoPage() {
  return layout({
    path: "/when-to-go/",
    title: "When to go",
    description: "Month-by-month guide to travelling in Madagascar: dry season, rainy season, cyclones, and which parks close.",
    body: `${pageHead({ n: 4, kicker: "When to go", title: "Two seasons, <em>and a lot of local variation</em>.", lead: "Broadly, the dry season runs from about April to November and the rainy season from about November or December to March. The east is wet all year and the south-west is dry almost all year. The official cyclone season runs from mid-November to the end of April, with the highest risk from January to March.", art: "seasons" })}
<section class="sec"><div class="wrap">
  <ol class="months">${seasons
    .map((s, i) => `<li class="month month--${s.rating} reveal"><p class="mono">${pad(i + 1)}</p><h2 class="month__name">${MONTHS_LONG[i]}</h2><p class="month__rating"><i class="key strip-key--${s.rating}"></i> ${RATING[s.rating - 1]}</p><p>${esc(s.note)}</p></li>`)
    .join("")}</ol>
</div></section>
<section class="sec sec--dark"><div class="wrap">
  <div class="sec__head">${label(2, "Park access")}<h2 class="h-lg">Which parks are <em>open when</em>.</h2></div>
  ${legend()}
  ${accessOverview()}
  <p class="note">Closures change every year with the rains. We check opening dates with the park authority before we confirm a booking.</p>
</div></section>
<section class="sec"><div class="wrap split">
  <div>${label(3, "Our short answer")}<h2 class="h-lg">If you only read <em>one thing</em>.</h2></div>
  <dl class="answers">
    <div><dt>First trip, all-round</dt><dd>September to November. It's warm, lemurs have young, and every park is open.</dd></div>
    <div><dt>The Tsingy</dt><dd>June to October.</dd></div>
    <div><dt>Whales</dt><dd>July to September (into October and November off Nosy Be).</dd></div>
    <div><dt>Fossa</dt><dd>Mid-October to mid-November at Kirindy.</dd></div>
    <div><dt>Frogs and reptiles</dt><dd>November to March in the eastern rainforest, if you accept the rain.</dd></div>
  </dl>
</div></section>
${cta()}`,
  });
}

function staysPage() {
  return layout({
    path: "/stays/",
    title: "Stays",
    description: "The kind of places we stay in Madagascar: small lodges near park gates, simple eco-camps and guesthouses.",
    body: `${pageHead({ n: 5, kicker: "Stays", title: "Close to the forest, <em>not far from comfort</em>.", lead: "We choose small, locally run places as close to the wildlife as possible, because the best time to see lemurs is early in the morning.", art: "stays" })}
<section class="sec"><div class="wrap">
  <p class="notice"><span class="mono">Placeholder names</span> Our list of partner lodges is being finalised. The descriptions show the kind of place we use in each region.</p>
  ${regions
    .filter((r) => stays.some((s) => s.region === r.slug))
    .map((r) => `<div class="stay-group reveal"><h2 class="h-md"><a href="/regions/${r.slug}/">${esc(r.name)}</a></h2><div class="sgrid">${stays.filter((s) => s.region === r.slug).map(stayCard).join("")}</div></div>`)
    .join("")}
</div></section>
<section class="sec sec--bark"><div class="wrap split">
  <div>${label(2, "What to expect")}<h2 class="h-lg">Simple, <em>and honest about it</em>.</h2></div>
  <ul class="ticks prose">
    <li>Outside the cities and Nosy Be, electricity can be limited to certain hours and hot water may be solar.</li>
    <li>Wi-Fi is often slow or absent in parks. We think that's fine.</li>
    <li>In remote places like Masoala and the Tsingy, accommodation is simple. We say so before you book.</li>
  </ul>
</div></section>
${cta()}`,
  });
}

function aboutPage() {
  return layout({
    path: "/about/",
    title: "About",
    description: `About ${brand.name}: honest, expert-led Madagascar journeys.`,
    body: `${pageHead({ n: 6, kicker: "About us", title: `Why <em>${esc(brand.name)}</em>.`, lead: esc(brand.nameStory), art: "about" })}
<section class="sec"><div class="wrap statement">
  ${label(1, "What we believe")}
  <p class="statement__t reveal">Madagascar is not an easy destination, and that is part of why it is extraordinary. <span>All of its lemurs, nearly all of its frogs and reptiles, and over 80% of its plants are found nowhere else on Earth. Getting to them takes time, on roads slower than any map suggests.</span></p>
</div></section>
<section class="sec sec--line"><div class="wrap split">
  <div>${label(2, "How we work")}<h2 class="h-lg">Four rules <em>we don't bend</em>.</h2></div>
  <ol class="rules">
    <li><strong>Local guides, always.</strong> Every park visit is with a licensed local guide, as park rules require. They are the experts.</li>
    <li><strong>Small groups and private trips.</strong> A vehicle and driver for your party, so you can stop when something moves in a tree.</li>
    <li><strong>A pace you can live with.</strong> After every long road day comes at least a two-night stop.</li>
    <li><strong>Responsible wildlife watching.</strong> No feeding, no playback, no animals kept for photos.</li>
  </ol>
</div></section>
<section class="sec sec--bark"><div class="wrap split">
  <div>${label(3, "The team")}<h2 class="h-lg">Profiles <em>coming soon</em>.</h2></div>
  <div class="prose">
    <p>We won't publish names, credentials or experience until each person has approved their own profile.</p>
    <h3 class="h-md">What you won't find here</h3>
    <p>You won't find invented reviews, award badges or press logos. When travellers write to us about their trips, we will ask their permission before sharing their words, and we will share them as they were written.</p>
    <p>The facts on this site are referenced on our <a href="/sources/">sources page</a>.</p>
  </div>
</div></section>
${cta()}`,
  });
}

function journalIndex() {
  return layout({
    path: "/journal/",
    title: "Journal",
    description: "Notes on travelling in Madagascar: real driving times, seasons, and wildlife.",
    body: `${pageHead({ n: 7, kicker: "Journal", title: "Notes from <em>the slow road</em>.", art: "journal" })}
<section class="sec"><div class="wrap"><div class="posts posts--list">${journal.map(postCard).join("")}</div></div></section>`,
  });
}

function journalPost(p) {
  return layout({
    path: `/journal/${p.slug}/`,
    title: p.title,
    description: p.excerpt,
    body: `${pageHead({ n: 7, kicker: "Journal", title: esc(p.title), lead: esc(p.excerpt), art: p.slug })}
<section class="sec"><div class="wrap article"><p class="mono"><time datetime="${p.date}">${fmtDate(p.date)}</time> · ${esc(brand.name)}</p><div class="prose prose--article">${p.body}</div><p><a class="pill pill--dark" href="/journal/">All journal posts ${ARROW}</a></p></div></section>
${cta()}`,
  });
}

function enquirePage() {
  const interests = ["Lemurs", "Birds", "Reptiles and frogs", "Walking and trekking", "The Tsingy", "Baobabs", "Whales and marine life", "Beaches", "Culture and crafts", "Photography"];
  const endpoint = config.enquiry.formEndpoint;
  return layout({
    path: "/enquire/",
    title: "Enquire",
    description: `Tell ${brand.name} what you'd like to see in Madagascar and when you can travel.`,
    scripts: ["/assets/enquiry.js"],
    body: `${pageHead({ n: 8, kicker: "Enquire", title: "Tell us about <em>your trip</em>.", lead: "There's no obligation. A real person reads every enquiry and replies with honest advice, including telling you if something isn't realistic in the months you have.", art: "enquire" })}
<section class="sec"><div class="wrap enquiry-layout">
  <form class="enquiry" id="enquiry" method="post" ${endpoint ? `action="${esc(endpoint)}"` : `action="mailto:${contact.email}" enctype="text/plain"`} data-endpoint="${esc(endpoint)}" data-email="${esc(contact.email)}" novalidate>
    <fieldset class="fset"><legend class="mono">(01) You</legend>
      <div class="field-row">
        <div class="field"><label for="f-name">Your name <span class="req">(required)</span></label><input id="f-name" name="name" autocomplete="name" required></div>
        <div class="field"><label for="f-email">Email <span class="req">(required)</span></label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
      </div>
    </fieldset>
    <fieldset class="fset"><legend class="mono">(02) Your trip</legend>
      <div class="field-row">
        <div class="field"><label for="f-when">When would you like to travel?</label><input id="f-when" name="when" placeholder="e.g. October 2027, flexible"></div>
        <div class="field"><label for="f-length">Roughly how long?</label>
          <select id="f-length" name="length"><option value="">Not sure yet</option><option>Up to 10 days</option><option>11–14 days</option><option>15–21 days</option><option>More than 3 weeks</option></select></div>
      </div>
      <div class="field-row">
        <div class="field"><label for="f-people">How many travellers?</label><input id="f-people" name="travellers" placeholder="e.g. 2 adults"></div>
        <div class="field"><label for="f-journey">Starting point (optional)</label>
          <select id="f-journey" name="journey"><option value="">No particular journey</option>${journeys.map((j) => `<option value="${j.slug}">${esc(j.name)}</option>`).join("")}</select></div>
      </div>
    </fieldset>
    <fieldset class="fset"><legend class="mono">(03) What you'd love to see</legend><div class="chips">${interests.map((i, n) => `<label class="chip"><input type="checkbox" name="interests" value="${esc(i)}" id="f-int-${n}"><span>${esc(i)}</span></label>`).join("")}</div></fieldset>
    <fieldset class="fset"><legend class="mono">(04) Long drives?</legend>
      <div class="radios">
      <label class="radio"><input type="radio" name="drives" value="Happy with long road days"><span><strong>Bring them on</strong> The road is part of the journey</span></label>
      <label class="radio"><input type="radio" name="drives" value="Some driving, fly where it saves a day" checked><span><strong>Some driving</strong> Fly where it saves a day</span></label>
      <label class="radio"><input type="radio" name="drives" value="As little driving as possible"><span><strong>As little as possible</strong> We'll keep you off the road</span></label>
      </div>
    </fieldset>
    <div class="field"><label for="f-msg">Anything else?</label><textarea id="f-msg" name="message" rows="5" placeholder="Must-see species, mobility needs, budget range…"></textarea></div>
    <label class="check"><input type="checkbox" name="consent" required id="f-consent"> I'm happy for ${esc(brand.name)} to use these details to reply to my enquiry. <span class="req">(required)</span></label>
    <div class="form-errors" id="form-errors" role="alert" tabindex="-1"></div>
    <p><button class="pill pill--gold pill--lg" type="submit">Send enquiry ${ARROW}</button></p>
    <p class="note" id="form-note">${endpoint ? "" : "Sending opens your email app with your answers filled in, ready to send."}</p>
  </form>
  <aside class="glance">
    <p class="mono">Other ways to reach us</p>
    <ul class="plain contact-list">
      <li><a href="mailto:${contact.email}">${esc(contact.email)}</a></li>
      <li><a href="tel:${contact.phone.replace(/[^+\d]/g, "")}">${esc(contact.phone)}</a></li>
      <li>${esc(contact.officeHours)}</li>
    </ul>
    <p class="mono glance__h">Before you write</p>
    <ul class="ticks">
      <li>Check the <a href="/when-to-go/">seasons</a>: some parks close in the rains.</li>
      <li>Look at the <a href="/map/">driving times</a>: they shape every itinerary.</li>
      <li>Entry and visa rules change, so check current requirements with official sources for your nationality.</li>
    </ul>
  </aside>
</div></section>`,
  });
}

function sourcesPage() {
  const host = (u) => new URL(u).hostname.replace(/^www\./, "");
  return layout({
    path: "/sources/",
    title: "Sources",
    description: "The references behind the driving times, closures and wildlife information on this site.",
    body: `${pageHead({ n: 9, kicker: "Sources", title: "Where our facts <em>come from</em>.", lead: "We checked the driving times, closures and wildlife notes on this site against published sources in October 2026. Most are guidebooks, operators, news reports and scientific references rather than official notices, so we still confirm closures and schedules before every booking.", art: "sources" })}
<section class="sec"><div class="wrap">${sources
      .map(
        (g, i) => `<div class="src-group reveal">${label(i + 1, esc(g.topic))}<ul class="src-list">${g.items
          .map((it) => `<li><p>${esc(it.claim)}</p><p class="src-refs">${it.refs.map((u) => `<a href="${esc(u)}" rel="noopener">${esc(host(u))}</a>`).join("")}</p></li>`)
          .join("")}</ul></div>`
      )
      .join("")}</div></section>`,
  });
}

function creditsPage() {
  const list = Object.entries(photos);
  return layout({
    path: "/credits/",
    title: "Photo credits",
    description: "Credits for every photograph on this site.",
    body: `${pageHead({ n: 9, kicker: "Credits", title: "Photo credits.", lead: "Every photo here comes from Unsplash. We only use a photo when its location matches the place it illustrates, and we credit every photographer." })}
<section class="sec"><div class="wrap">
  ${list.length ? `<ul class="credits">${list
    .map(([k, p]) => `<li>${img(p, { sizes: "160px" })}<div><p class="mono">${k === "hero" ? "Home page" : esc(regionBySlug[k]?.name || k)}</p><p>${credit(p)}</p><p class="note">Location check: ${esc(p.evidence)}</p></div></li>`)
    .join("")}</ul>` : "<p>No photos yet.</p>"}
  <p class="note">Regions without a verified photo show contour artwork until we find a photo taken there.</p>
</div></section>`,
  });
}

function notFound() {
  return layout({
    path: "/404.html",
    title: "Page not found",
    body: `${pageHead({ n: 0, kicker: "404", title: "This road <em>doesn't go anywhere</em>.", lead: 'The page you were looking for isn\'t here. Try the <a href="/regions/">regions</a>, the <a href="/map/">driving map</a> or the <a href="/">home page</a>.', art: "404" })}`,
  });
}

// ── assets ───────────────────────────────────────────────────
function tokens() {
  const p = palette, f = config.fonts;
  const vars = Object.entries(p).map(([k, v]) => `--${k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}:${v};`).join("");
  return `:root{${vars}--font-display:${f.display};--font-body:${f.body};--font-mono:${f.mono};}\n`;
}

// ── build ────────────────────────────────────────────────────
rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, "assets"), { recursive: true });
cpSync(join(ROOT, "src/assets"), join(OUT, "assets"), { recursive: true });
writeFileSync(join(OUT, "assets/styles.css"), tokens() + readFileSync(join(ROOT, "src/assets/styles.css"), "utf8"));
writeFileSync(
  join(OUT, "favicon.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="${palette.night}"/><path d="M13 31h6l-1-14c3-1 6-3 8-6-3 1-5 1-7 0 2-2 3-4 3-7-2 2-4 3-6 3-2 0-4-1-6-3 0 3 1 5 3 7-2 1-4 1-7 0 2 3 5 5 8 6z" fill="${palette.gold}"/></svg>`
);

const pages = {
  "index.html": home(),
  "regions/index.html": regionsIndex(),
  "map/index.html": mapPage(),
  "wildlife/index.html": wildlifePage(),
  "journeys/index.html": journeysPage(),
  "when-to-go/index.html": whenToGoPage(),
  "stays/index.html": staysPage(),
  "about/index.html": aboutPage(),
  "journal/index.html": journalIndex(),
  "enquire/index.html": enquirePage(),
  "sources/index.html": sourcesPage(),
  "credits/index.html": creditsPage(),
  "404.html": notFound(),
};
for (const r of regions) pages[`regions/${r.slug}/index.html`] = regionPage(r);
for (const p of journal) pages[`journal/${p.slug}/index.html`] = journalPost(p);
for (const [path, html] of Object.entries(pages)) write(path, html);

const urls = Object.keys(pages).filter((p) => p !== "404.html").map((p) => "/" + p.replace(/index\.html$/, ""));
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${config.siteUrl}${u}</loc></url>`).join("\n")}\n</urlset>\n`);
write("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${config.siteUrl}/sitemap.xml\n`);

console.log(`Built ${Object.keys(pages).length} pages into dist/`);
