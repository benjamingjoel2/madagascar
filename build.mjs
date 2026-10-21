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

function write(path, html) {
  const file = join(OUT, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

// ── photos ───────────────────────────────────────────────────
function unsplashUrl(p, w) {
  return `${p.src}?auto=format&fit=crop&w=${w}&q=70`;
}
function credit(p) {
  const utm = "utm_source=" + encodeURIComponent(brand.shortName.toLowerCase().replace(/\s+/g, "_")) + "&utm_medium=referral";
  return `Photo: <a href="${p.photographerUrl}?${utm}">${esc(p.photographer)}</a> on <a href="${p.unsplashUrl}?${utm}">Unsplash</a> · ${esc(p.location)}`;
}
function photo(key, { sizes = "100vw", eager = false, cls = "" } = {}) {
  const p = photos[key];
  if (!p) {
    const r = regionBySlug[key];
    return `<figure class="photo photo--missing ${cls}">
      <div class="photo__placeholder" role="img" aria-label="No photo yet">
        <span>Photo to come${r ? `: ${esc(r.name)}` : ""}</span>
        <small>We only use photos taken in the place they show.</small>
      </div></figure>`;
  }
  const ratio = p.height / p.width;
  const widths = [480, 800, 1200, 1600];
  const srcset = widths.map((w) => `${unsplashUrl(p, w)} ${w}w`).join(", ");
  return `<figure class="photo ${cls}">
    <img src="${unsplashUrl(p, 1200)}" srcset="${srcset}" sizes="${sizes}"
      width="1200" height="${Math.round(1200 * ratio)}" alt="${esc(p.alt)}"
      ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"
      style="background:${p.color || palette.barkLight}">
    <figcaption>${credit(p)}</figcaption>
  </figure>`;
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

const LOGO = `<svg class="logo__mark" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
  <path d="M13 31h6l-1-14c3-1 6-3 8-6-3 1-5 1-7 0 2-2 3-4 3-7-2 2-4 3-6 3-2 0-4-1-6-3 0 3 1 5 3 7-2 1-4 1-7 0 2 3 5 5 8 6z" fill="currentColor"/>
</svg>`;

function layout({ title, description = brand.description, path, body, scripts = [], ogImage }) {
  const fullTitle = title ? `${title} · ${brand.name}` : `${brand.name}: ${brand.tagline}`;
  const nav = NAV.map(
    ([href, label]) =>
      `<li><a href="${href}"${path.startsWith(href) ? ' aria-current="page"' : ""}>${label}</a></li>`
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
<meta name="theme-color" content="${palette.rainforest}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://images.unsplash.com">
<link rel="stylesheet" href="${config.fonts.href}">
<link rel="stylesheet" href="/assets/styles.css">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap site-header__inner">
    <a class="logo" href="/">${LOGO}<span>${esc(brand.name)}</span></a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="main-nav" hidden>Menu</button>
    <nav class="menu" id="main-nav" aria-label="Main"><ul>${nav}<li><a class="btn btn--gold" href="/enquire/"${path === "/enquire/" ? ' aria-current="page"' : ""}>Enquire</a></li></ul></nav>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="site-footer">
  <div class="wrap footer-grid">
    <div>
      <p class="logo logo--footer">${LOGO}<span>${esc(brand.name)}</span></p>
      <p>${esc(brand.description)}</p>
    </div>
    <div>
      <h2 class="footer-h">Contact</h2>
      <ul class="plain">
        <li><a href="mailto:${contact.email}">${esc(contact.email)}</a></li>
        <li><a href="tel:${contact.phone.replace(/[^+\d]/g, "")}">${esc(contact.phone)}</a></li>
        ${contact.whatsapp ? `<li><a href="https://wa.me/${contact.whatsapp.replace(/\D/g, "")}">WhatsApp</a></li>` : ""}
        <li>${esc(contact.officeHours)}</li>
        <li>${esc(contact.address)}</li>
      </ul>
    </div>
    <div>
      <h2 class="footer-h">Explore</h2>
      <ul class="plain">${NAV.map(([h, l]) => `<li><a href="${h}">${l}</a></li>`).join("")}<li><a href="/enquire/">Enquire</a></li><li><a href="/credits/">Photo credits</a></li></ul>
    </div>
  </div>
  <div class="wrap footer-small">
    <p>Driving times, park access and seasons are guidance, not guarantees. We check them before every booking.</p>
    <p>© ${new Date().getFullYear()} ${esc(brand.name)}</p>
  </div>
</footer>
<script>
(function(){var b=document.querySelector(".menu-btn"),n=document.getElementById("main-nav");
b.hidden=false;document.documentElement.classList.add("js");
b.addEventListener("click",function(){var o=b.getAttribute("aria-expanded")==="true";b.setAttribute("aria-expanded",String(!o));n.classList.toggle("is-open",!o);});
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&n.classList.contains("is-open")){b.click();b.focus();}});})();
</script>
${scripts.map((s) => `<script src="${s}" defer></script>`).join("\n")}
</body>
</html>`;
}

const hero = ({ kicker, title, lead, photoKey, actions = "" }) => `
<section class="hero${photos[photoKey] ? " hero--photo" : ""}">
  ${photos[photoKey] ? photo(photoKey, { eager: true, cls: "hero__photo" }) : ""}
  <div class="wrap hero__text">
    ${kicker ? `<p class="kicker">${esc(kicker)}</p>` : ""}
    <h1>${title}</h1>
    ${lead ? `<p class="lead">${lead}</p>` : ""}
    ${actions}
  </div>
</section>`;

const pageHead = ({ kicker, title, lead }) => `
<section class="page-head">
  <div class="wrap">
    ${kicker ? `<p class="kicker">${esc(kicker)}</p>` : ""}
    <h1>${title}</h1>
    ${lead ? `<p class="lead">${lead}</p>` : ""}
  </div>
</section>`;

const ACCESS_LABEL = { open: "Open all year", seasonal: "Seasonal access", "closed-wet": "Closed part of the wet season" };
const accessBadge = (a) => `<span class="badge badge--${a}">${ACCESS_LABEL[a]}</span>`;

const regionCard = (r) => `
<article class="card">
  <a class="card__link" href="/regions/${r.slug}/">
    ${photo(r.slug, { sizes: "(min-width: 60em) 30vw, (min-width: 40em) 45vw, 100vw", cls: "card__photo" })}
    <div class="card__body">
      <p class="kicker">${esc(r.kicker)}</p>
      <h3>${esc(r.name)}</h3>
      <p>${esc(r.summary)}</p>
      ${accessBadge(r.access)}
    </div>
  </a>
</article>`;

const enquireCta = (text = "Tell us what you want to see and when you can travel. We'll tell you honestly what is realistic.") => `
<section class="cta">
  <div class="wrap cta__inner">
    <div>
      <h2>Start planning</h2>
      <p>${text}</p>
    </div>
    <a class="btn btn--gold" href="/enquire/">Make an enquiry</a>
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

function mapSvg() {
  const coast = COAST.map(([lo, la]) => proj(lo, la).join(",")).join(" ");
  const [nbx, nby] = proj(48.27, -13.33);
  // flights first, so road labels sit on top of the dashed flight lines
  const order = legs.map((l, i) => [l, i]).sort((a, b) => (b[0].mode === "flight") - (a[0].mode === "flight"));
  const legSvg = order
    .map(([l, i]) => {
      const a = places[l.from], b = places[l.to];
      const [x1, y1] = proj(a.lon, a.lat).map(Number), [x2, y2] = proj(b.lon, b.lat).map(Number);
      const id = `leg-${i}`;
      if (l.mode === "flight") {
        // curve flights so they don't sit on top of roads
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
        const bend = l.bend ?? Math.min(60, len * 0.22);
        const cx = mx + (-dy / len) * bend, cy = my + (dx / len) * bend;
        const lx = (mx + cx) / 2 + (l.labelOffset?.[0] || 0), ly = (my + cy) / 2 + (l.labelOffset?.[1] || 0);
        return `<g class="leg leg--flight" data-leg="${i}" id="${id}">
          <path d="M${x1},${y1} Q${cx.toFixed(1)},${cy.toFixed(1)} ${x2},${y2}" />
          <g class="leg__label leg__label--flight" transform="translate(${lx.toFixed(1)},${ly.toFixed(1)})"><rect x="-30" y="-12" width="60" height="24" rx="12"/><text text-anchor="middle" y="5">✈ ${fmtRange(l.hours)}</text></g>
        </g>`;
      }
      const mx = (x1 + x2) / 2 + (l.labelOffset?.[0] || 0), my = (y1 + y2) / 2 + (l.labelOffset?.[1] || 0);
      const w = l.mode === "boat" ? 56 : 66;
      return `<g class="leg leg--${l.mode}${l.season === "dry" ? " leg--dry" : ""}" data-leg="${i}" id="${id}">
        <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />
        <g class="leg__label" transform="translate(${mx.toFixed(1)},${my.toFixed(1)})"><rect x="${-w / 2}" y="-12" width="${w}" height="24" rx="4"/><text text-anchor="middle" y="5">${fmtRange(l.hours)}</text></g>
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
        <circle cx="${x}" cy="${y}" r="${p.airport ? 7 : 5.5}"/>
        <text x="${(+x + dx).toFixed(1)}" y="${(+y + dy).toFixed(1)}" text-anchor="${anchor}">${esc(p.name)}</text>
      </g>`;
    })
    .join("");
  return `<svg class="map-svg" viewBox="0 0 ${MAP_W} ${MAP_H}" role="img" aria-labelledby="map-title map-desc">
    <title id="map-title">Schematic driving-time map of Madagascar</title>
    <desc id="map-desc">Main overland routes and domestic flights with typical hours per leg. The same information is in the table below the map.</desc>
    <polygon class="land" points="${coast}"/>
    <ellipse class="land" cx="${nbx}" cy="${nby}" rx="9" ry="7"/>
    ${legSvg}
    ${placeSvg}
    <g class="compass" transform="translate(${MAP_W - 40},40)"><path d="M0,-18 L6,0 L0,-4 L-6,0Z"/><text y="16" text-anchor="middle">N</text></g>
  </svg>`;
}

function legsTable() {
  const MODE = { road: "Paved road", track: "4x4 track", boat: "Boat", flight: "Flight" };
  const rows = legs
    .map(
      (l, i) => `<tr data-leg="${i}" class="row--${l.mode}">
      <th scope="row">${esc(places[l.from].name)} → ${esc(places[l.to].name)}</th>
      <td><strong>${fmtRange(l.hours)}</strong></td>
      <td>${l.km ? `${l.km} km` : "—"}</td>
      <td>${MODE[l.mode]}${l.season === "dry" ? ' <span class="badge badge--closed-wet">Dry season only</span>' : ""}</td>
      <td>${l.flightSaves ? `<span class="badge badge--flight">Saves a day</span> ${esc(l.flightSaves)}` : esc(l.note || "")}</td>
    </tr>`
    )
    .join("");
  return `<div class="table-scroll" tabindex="0" role="region" aria-label="All legs, scrollable">
  <table class="data-table legs-table">
    <caption>Every leg on the map, both directions</caption>
    <thead><tr><th scope="col">Leg</th><th scope="col">Typical hours</th><th scope="col">Distance</th><th scope="col">Type</th><th scope="col">Notes</th></tr></thead>
    <tbody>${rows}</tbody>
  </table></div>`;
}

// ── wildlife tables ──────────────────────────────────────────
const ACCESS_CELL = { O: ["open", "Open"], D: ["difficult", "Difficult"], C: ["closed", "Closed"] };
const SIGHT_CELL = { G: ["good", "Good"], P: ["possible", "Possible"], "-": ["none", "Unlikely"] };
const monthHead = () => MONTHS.map((m, i) => `<th scope="col" data-month="${i}"><abbr title="${MONTHS_LONG[i]}">${m[0]}</abbr><span class="sr-only">${m.slice(1)}</span></th>`).join("");

function parkTable(p) {
  const access = [...p.access]
    .map((c, i) => `<td class="cell cell--${ACCESS_CELL[c][0]}" data-month="${i}"><span class="cell__sym" aria-hidden="true">${c === "O" ? "" : c === "D" ? "!" : "×"}</span><span class="sr-only">${ACCESS_CELL[c][1]}</span></td>`)
    .join("");
  const rows = p.species
    .map(
      (s) => `<tr data-type="${s.type}">
      <th scope="row"><span class="sp-name">${esc(s.name)}</span> <i class="latin">${esc(s.latin)}</i>
        <span class="chance chance--${s.chance}">${s.chance === "likely" ? "Likely" : s.chance === "possible" ? "Possible" : "Unlikely"}</span>
        ${s.note ? `<span class="sp-note">${esc(s.note)}</span>` : ""}</th>
      ${[...s.months].map((c, i) => `<td class="cell cell--${SIGHT_CELL[c][0]}" data-month="${i}"><span class="sr-only">${SIGHT_CELL[c][1]}</span></td>`).join("")}
    </tr>`
    )
    .join("");
  const r = regionBySlug[p.region];
  return `<section class="park" id="${p.id}" data-park="${p.id}" aria-labelledby="${p.id}-h">
  <div class="park__head">
    <h3 id="${p.id}-h">${esc(p.park)}</h3>
    <p class="park__meta"><a href="/regions/${r.slug}/">${esc(r.name)}</a> · ${esc(p.accessNote)}</p>
  </div>
  <div class="table-scroll" tabindex="0" role="region" aria-label="${esc(p.park)} by month, scrollable">
  <table class="data-table month-table">
    <thead><tr><th scope="col" class="month-table__label">Species</th>${monthHead()}</tr></thead>
    <tbody>
      <tr class="access-row"><th scope="row">Park access</th>${access}</tr>
      ${rows}
    </tbody>
  </table></div>
</section>`;
}

const legend = () => `
<div class="legend" aria-label="Key">
  <span><i class="swatch cell--good"></i> Good chance</span>
  <span><i class="swatch cell--possible"></i> Possible</span>
  <span><i class="swatch cell--none"></i> Unlikely</span>
  <span><i class="swatch cell--difficult"><b aria-hidden="true">!</b></i> Access difficult</span>
  <span><i class="swatch cell--closed"><b aria-hidden="true">×</b></i> Usually closed</span>
</div>`;

function accessOverview() {
  return `<div class="table-scroll" tabindex="0" role="region" aria-label="Access by month, scrollable">
  <table class="data-table month-table access-table">
    <caption>Park access by month</caption>
    <thead><tr><th scope="col" class="month-table__label">Park</th>${monthHead()}</tr></thead>
    <tbody>${wildlife
      .map(
        (p) => `<tr><th scope="row"><a href="/wildlife/#${p.id}">${esc(p.park)}</a></th>${[...p.access]
          .map((c, i) => `<td class="cell cell--${ACCESS_CELL[c][0]}" data-month="${i}"><span class="cell__sym" aria-hidden="true">${c === "O" ? "" : c === "D" ? "!" : "×"}</span><span class="sr-only">${ACCESS_CELL[c][1]}</span></td>`)
          .join("")}</tr>`
      )
      .join("")}</tbody>
  </table></div>`;
}

// ── pages ────────────────────────────────────────────────────
function home() {
  const featured = ["andasibe", "tsingy-de-bemaraha", "morondava-baobabs", "masoala", "isalo", "ranomafana"].map((s) => regionBySlug[s]);
  return layout({
    path: "/",
    body: `
${hero({
  kicker: "Madagascar, honestly",
  title: esc(brand.tagline),
  lead: esc(brand.description),
  photoKey: "hero",
  actions: `<p class="actions"><a class="btn btn--gold" href="/enquire/">Plan a journey</a> <a class="btn btn--ghost" href="/map/">See real driving times</a></p>`,
})}
<section class="section">
  <div class="wrap promise">
    <h2>What we promise</h2>
    <ul class="promise__list">
      <li><strong>Real hours, not kilometres.</strong> Antsirabe to Ranomafana is about 250 km, and it takes six or seven hours. We tell you that up front.</li>
      <li><strong>Seasons as they are.</strong> Some parks close in the rains. We plan around that and never sell you a closed park.</li>
      <li><strong>Wildlife without guarantees.</strong> We tell you what is likely, what is possible and what would be luck.</li>
    </ul>
  </div>
</section>
<section class="section section--green">
  <div class="wrap split">
    <div>
      <p class="kicker">Signature tool</p>
      <h2>The driving-time map</h2>
      <p>Every main leg in hours, with the places where a domestic flight saves you a day. Pick two places and see the fastest route by road, and how much a flight would save.</p>
      <p><a class="btn btn--gold" href="/map/">Open the map</a></p>
    </div>
    <div>
      <p class="kicker">Signature tool</p>
      <h2>Lemurs by park and month</h2>
      <p>Which species you're likely to see where, in which months, and which parks are hard to reach or closed in the rainy season.</p>
      <p><a class="btn btn--gold" href="/wildlife/">Open the wildlife guide</a></p>
    </div>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <h2>Where we go</h2>
    <div class="grid">${featured.map(regionCard).join("")}</div>
    <p><a class="more" href="/regions/">All ten regions →</a></p>
  </div>
</section>
<section class="section section--bark">
  <div class="wrap">
    <h2>Sample journeys</h2>
    <div class="grid grid--2">${journeys
      .map(
        (j) => `<article class="journey-card"><h3><a href="/journeys/#${j.slug}">${esc(j.name)}</a></h3>
        <p class="journey-card__meta">${j.days} days · ${esc(j.months)}</p><p>${esc(j.summary)}</p></article>`
      )
      .join("")}</div>
  </div>
</section>
${enquireCta()}`,
  });
}

function regionsIndex() {
  return layout({
    path: "/regions/",
    title: "Regions",
    description: "Ten regions of Madagascar, from the indri forests of Andasibe to the Tsingy de Bemaraha, with honest notes on access and seasons.",
    body: `${pageHead({ kicker: "Regions", title: "Ten places, a lot of road between them", lead: "Madagascar is about the size of France and Belgium combined, and most journeys cover only two or three regions properly. Here is what each one offers, and how hard it is to reach." })}
<section class="section"><div class="wrap"><div class="grid">${regions.map(regionCard).join("")}</div></div></section>
${enquireCta()}`,
  });
}

function regionPage(r) {
  const parks = wildlife.filter((p) => p.region === r.slug);
  const myStays = stays.filter((s) => s.region === r.slug);
  const myJourneys = journeys.filter((j) => j.regions.includes(r.slug));
  const myLegs = legs.filter((l) => places[l.from].region === r.slug || places[l.to].region === r.slug);
  return layout({
    path: `/regions/${r.slug}/`,
    title: r.name,
    description: r.summary,
    ogImage: photos[r.slug] ? unsplashUrl(photos[r.slug], 1200) : undefined,
    body: `
${hero({ kicker: r.kicker, title: esc(r.name), lead: esc(r.summary), photoKey: r.slug })}
${photos[r.slug] ? "" : `<div class="wrap">${photo(r.slug, { cls: "photo--inline" })}</div>`}
<section class="section"><div class="wrap region-layout">
  <div class="prose">
    ${r.body.map((p) => `<p>${esc(p)}</p>`).join("")}
    <h2>Highlights</h2>
    <ul>${r.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>
  </div>
  <aside class="facts" aria-label="Key facts">
    <h2 class="facts__h">At a glance</h2>
    <dl>
      <dt>Getting there</dt><dd>${esc(r.gettingThere)}</dd>
      <dt>Best months</dt><dd>${esc(r.bestMonths)}</dd>
      <dt>Access</dt><dd>${accessBadge(r.access)}<br>${esc(r.accessNote)}</dd>
    </dl>
    ${myLegs.length ? `<h3 class="facts__h">Travel times</h3><ul class="plain legs-mini">${myLegs.map((l) => `<li>${l.mode === "flight" ? "✈ " : ""}${esc(places[l.from].name)} → ${esc(places[l.to].name)}: <strong>${fmtRange(l.hours)}</strong></li>`).join("")}</ul><p><a href="/map/">Driving-time map →</a></p>` : ""}
  </aside>
</div></section>
${parks.length ? `<section class="section section--tint"><div class="wrap"><h2>Wildlife here, month by month</h2>${legend()}${parks.map(parkTable).join("")}<p><a class="more" href="/wildlife/">Full wildlife guide →</a></p></div></section>` : ""}
${myStays.length ? `<section class="section"><div class="wrap"><h2>Where to stay</h2><p class="note">Placeholder names: our partner list is being finalised.</p><div class="grid grid--2">${myStays.map(stayCard).join("")}</div></div></section>` : ""}
${myJourneys.length ? `<section class="section section--bark"><div class="wrap"><h2>Journeys that include ${esc(r.name)}</h2><ul class="plain link-list">${myJourneys.map((j) => `<li><a href="/journeys/#${j.slug}">${esc(j.name)}</a>: ${j.days} days, ${esc(j.months)}</li>`).join("")}</ul></div></section>` : ""}
${enquireCta(`Thinking about ${esc(r.name)}? Tell us your dates and we'll tell you honestly how it fits.`)}`,
  });
}

function stayCard(s) {
  return `<article class="stay"><p class="kicker">${esc(s.style)}</p><h3>${esc(s.name)}</h3><p>${esc(s.note)}</p><p class="stay__region"><a href="/regions/${s.region}/">${esc(regionBySlug[s.region].name)}</a></p></article>`;
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
      kicker: "Signature tool",
      title: "The driving-time map",
      lead: "Roads in Madagascar are slow. A 250 km leg can take seven hours. This map shows realistic hours for each leg with a private driver, and marks the places where a domestic flight saves a day.",
    })}
<section class="section"><div class="wrap map-layout">
  <div class="map-wrap">
    ${mapSvg()}
    <p class="note">Schematic: towns are placed by real coordinates, but the roads are drawn as straight lines.</p>
  </div>
  <div class="map-side">
    <div class="map-key">
      <h2 class="h3">Key</h2>
      <ul class="plain">
        <li><svg width="36" height="10" aria-hidden="true"><line x1="0" y1="5" x2="36" y2="5" class="key-road"/></svg> Paved road</li>
        <li><svg width="36" height="10" aria-hidden="true"><line x1="0" y1="5" x2="36" y2="5" class="key-track"/></svg> 4x4 track, dry season only</li>
        <li><svg width="36" height="10" aria-hidden="true"><line x1="0" y1="5" x2="36" y2="5" class="key-boat"/></svg> Boat</li>
        <li><svg width="36" height="10" aria-hidden="true"><line x1="0" y1="5" x2="36" y2="5" class="key-flight"/></svg> Domestic flight that saves a day</li>
      </ul>
    </div>
    <form class="planner" id="planner" data-graph='${esc(JSON.stringify(graph))}'>
      <h2 class="h3">How long between two places?</h2>
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
<section class="section section--tint"><div class="wrap">
  <h2>Where a flight saves a day</h2>
  <div class="grid grid--3">${legs
    .filter((l) => l.flightSaves)
    .map((l) => `<article class="flight-card"><h3>✈ ${esc(places[l.from].name)} ↔ ${esc(places[l.to].name)}</h3><p class="flight-card__time">About ${fmtRange(l.hours)} in the air</p><p>${esc(l.flightSaves)}</p></article>`)
    .join("")}</div>
  <h3>The road alternatives</h3>
  <ul>${roadAlternatives.map((a) => `<li>${esc(a.from)} → ${esc(a.to)} by road: ${esc(a.hours)} (${esc(a.days)})</li>`).join("")}</ul>
  <p class="note">Domestic flight schedules in Madagascar change often and some routes do not fly every day. Add 2–3 hours for check-in and transfers, and keep a spare day before an international connection.</p>
</div></section>
<section class="section"><div class="wrap">
  <h2>All legs</h2>
  ${legsTable()}
  <p class="note">Hours assume a private vehicle with an experienced driver, in daylight, with short stops. Taxi-brousses take longer. We do not drive after dark.</p>
</div></section>
${enquireCta()}`,
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
      kicker: "Signature tool",
      title: "Lemurs and wildlife, park by park",
      lead: "Which species you're likely to see where, and in which months. The top row of each table shows whether the park is open, hard to reach or usually closed. These are our best estimates, not promises.",
    })}
<section class="section"><div class="wrap">
  <form class="filters" id="wl-filters" aria-label="Filter the wildlife guide">
    <label>Park <select name="park"><option value="">All parks</option>${parkOpts}</select></label>
    <label>Month <select name="month"><option value="">All months</option>${monthOpts}</select></label>
    <label>Show <select name="type"><option value="">All wildlife</option><option value="lemur">Lemurs only</option><option value="other">Other wildlife</option></select></label>
  </form>
  <div id="wl-summary" class="wl-summary" aria-live="polite"></div>
  ${legend()}
  ${wildlife.map(parkTable).join("")}
</div></section>
<section class="section section--tint"><div class="wrap">
  <h2>Hard to reach or closed in the rainy season</h2>
  <p>The rainy season runs roughly from December to March, with cyclone risk. Most notably, the <a href="/regions/tsingy-de-bemaraha/">Tsingy de Bemaraha</a> is usually closed for part of the wet season.</p>
  ${accessOverview()}
</div></section>
<section class="section"><div class="wrap prose">
  <h2>How we use these tables</h2>
  <ul>
    <li><strong>Likely</strong> means most of our travellers see it on a two- or three-day visit with a good local guide.</li>
    <li><strong>Possible</strong> means some days yes, some days no.</li>
    <li><strong>Unlikely</strong> means that if you see it, enjoy your luck. We will never promise it.</li>
  </ul>
  <p>We never feed wildlife, use call playback for lemurs, or visit places that keep wild animals for photos.</p>
</div></section>
${enquireCta()}`,
  });
}

function journeysPage() {
  return layout({
    path: "/journeys/",
    title: "Sample journeys",
    description: "Four sample Madagascar journeys with realistic travel times, from the RN7 overland route to the Tsingy and Masoala.",
    body: `${pageHead({ kicker: "Sample journeys", title: "Journeys built around slow roads", lead: "Use these as starting points. Every trip we plan is tailor-made, and every one shows the real driving hours. We quote prices for your dates once you've told us what you want." })}
<section class="section"><div class="wrap journeys">
${journeys
  .map(
    (j) => `<article class="journey" id="${j.slug}">
  <header class="journey__head">
    <h2>${esc(j.name)}</h2>
    <p class="journey__meta"><span>${j.days} days</span><span>${esc(j.months)}</span><span>${esc(j.pace)}</span></p>
    <p class="lead">${esc(j.summary)}</p>
  </header>
  <ol class="itinerary">${j.days_detail.map(([d, t, n]) => `<li><span class="itinerary__day">Day ${esc(d)}</span><strong>${esc(t)}</strong>${n ? `<span>${esc(n)}</span>` : ""}</li>`).join("")}</ol>
  <p class="honest"><strong>Honest note:</strong> ${esc(j.honestNote)}</p>
  <p class="journey__regions">Regions: ${j.regions.map((s) => `<a href="/regions/${s}/">${esc(regionBySlug[s].name)}</a>`).join(", ")}</p>
  <p><a class="btn" href="/enquire/?journey=${j.slug}">Enquire about this journey</a></p>
</article>`
  )
  .join("")}
</div></section>
${enquireCta()}`,
  });
}

function whenToGoPage() {
  const stars = (n) => ["Difficult", "Good, with caveats", "Great"][n - 1];
  return layout({
    path: "/when-to-go/",
    title: "When to go",
    description: "Month-by-month guide to travelling in Madagascar: dry season, rainy season, cyclones, and which parks close.",
    body: `${pageHead({ kicker: "When to go", title: "Two seasons, and a lot of local variation", lead: "Broadly, the dry season runs from about April to November and the rainy season from about December to March. The east is wet all year, the south-west is dry almost all year, and cyclones are possible from roughly January to March." })}
<section class="section"><div class="wrap">
  <ol class="months">${seasons
    .map((s, i) => `<li class="month month--${s.rating}"><h2 class="month__name">${MONTHS_LONG[i]}</h2><p class="month__rating">${stars(s.rating)}</p><p>${esc(s.note)}</p></li>`)
    .join("")}</ol>
</div></section>
<section class="section section--tint"><div class="wrap">
  <h2>Which parks are open when</h2>
  ${legend()}
  ${accessOverview()}
  <p class="note">Closures change every year with the rains. We check opening dates with the park authority before we confirm a booking.</p>
</div></section>
<section class="section"><div class="wrap prose">
  <h2>Our short answer</h2>
  <ul>
    <li><strong>First trip, all-round:</strong> September to November. It is warm, lemurs have young, and every park is open.</li>
    <li><strong>The Tsingy:</strong> June to October.</li>
    <li><strong>Whales:</strong> July to September.</li>
    <li><strong>Frogs and reptiles:</strong> November to March in the eastern rainforest, if you accept the rain.</li>
  </ul>
</div></section>
${enquireCta()}`,
  });
}

function staysPage() {
  return layout({
    path: "/stays/",
    title: "Stays",
    description: "The kind of places we stay in Madagascar: small lodges near park gates, simple eco-camps and guesthouses.",
    body: `${pageHead({ kicker: "Stays", title: "Close to the forest, not far from comfort", lead: "We choose small, locally run places as close to the wildlife as possible, because the best time to see lemurs is early in the morning." })}
<section class="section"><div class="wrap">
  <p class="notice"><strong>These are placeholder names.</strong> Our list of partner lodges is being finalised. The descriptions show the kind of place we use in each region.</p>
  ${regions
    .filter((r) => stays.some((s) => s.region === r.slug))
    .map((r) => `<h2><a href="/regions/${r.slug}/">${esc(r.name)}</a></h2><div class="grid grid--2">${stays.filter((s) => s.region === r.slug).map(stayCard).join("")}</div>`)
    .join("")}
  <div class="prose">
  <h2>What to expect</h2>
  <ul>
    <li>Outside the cities and Nosy Be, electricity can be limited to certain hours and hot water may be solar.</li>
    <li>Wi-Fi is often slow or absent in parks. We think that's fine.</li>
    <li>In remote places like Masoala and the Tsingy, accommodation is simple. We say so before you book.</li>
  </ul></div>
</div></section>
${enquireCta()}`,
  });
}

function aboutPage() {
  return layout({
    path: "/about/",
    title: "About",
    description: `About ${brand.name}: honest, expert-led Madagascar journeys.`,
    body: `${pageHead({ kicker: "About us", title: `Why ${esc(brand.name)}`, lead: esc(brand.nameStory) })}
<section class="section"><div class="wrap prose">
  <h2>What we believe</h2>
  <p>Madagascar is not an easy destination, and that is part of why it is extraordinary. Around 90% of its wildlife is found nowhere else on Earth. Getting to it takes time, on roads that are slower than any map suggests.</p>
  <p>We would rather tell you the truth about this than sell you a trip that looks good on paper. So we publish real driving hours, say which parks close in the rains, and describe sightings as likely, possible or unlikely, never guaranteed.</p>
  <h2>How we work</h2>
  <ul>
    <li><strong>Local guides, always.</strong> Every park visit is with a licensed local guide, as park rules require. They are the experts.</li>
    <li><strong>Small groups and private trips.</strong> A vehicle and driver for your party, so you can stop when something moves in a tree.</li>
    <li><strong>Pace you can live with.</strong> After every long road day comes at least a two-night stop.</li>
    <li><strong>Responsible wildlife watching.</strong> No feeding, no playback, no animals kept for photos.</li>
  </ul>
  <h2>The team</h2>
  <p class="notice">Team profiles are coming soon. We won't publish names, credentials or experience until each person has approved their own profile.</p>
  <h2>What you won't find here</h2>
  <p>You won't find invented reviews, award badges or press logos. When travellers write to us about their trips, we will ask their permission before sharing their words, and we will share them as they were written.</p>
</div></section>
${enquireCta()}`,
  });
}

function journalIndex() {
  return layout({
    path: "/journal/",
    title: "Journal",
    description: "Notes on travelling in Madagascar: real driving times, seasons, and wildlife.",
    body: `${pageHead({ kicker: "Journal", title: "Notes from the slow road" })}
<section class="section"><div class="wrap journal-list">${journal
      .map(
        (p) => `<article class="post-card"><p class="kicker"><time datetime="${p.date}">${fmtDate(p.date)}</time></p><h2><a href="/journal/${p.slug}/">${esc(p.title)}</a></h2><p>${esc(p.excerpt)}</p></article>`
      )
      .join("")}</div></section>`,
  });
}

function journalPost(p) {
  return layout({
    path: `/journal/${p.slug}/`,
    title: p.title,
    description: p.excerpt,
    body: `${pageHead({ kicker: "Journal", title: esc(p.title), lead: esc(p.excerpt) })}
<section class="section"><div class="wrap prose"><p class="byline"><time datetime="${p.date}">${fmtDate(p.date)}</time> · ${esc(brand.name)}</p>${p.body}<p><a href="/journal/">← All journal posts</a></p></div></section>
${enquireCta()}`,
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
    body: `${pageHead({ kicker: "Enquire", title: "Tell us about your trip", lead: "There's no obligation. A real person reads every enquiry and replies with honest advice, including telling you if something isn't realistic in the months you have." })}
<section class="section"><div class="wrap enquiry-layout">
  <form class="enquiry" id="enquiry" method="post" ${endpoint ? `action="${esc(endpoint)}"` : `action="mailto:${contact.email}" enctype="text/plain"`} data-endpoint="${esc(endpoint)}" data-email="${esc(contact.email)}" novalidate>
    <div class="field"><label for="f-name">Your name <span class="req">(required)</span></label><input id="f-name" name="name" autocomplete="name" required></div>
    <div class="field"><label for="f-email">Email <span class="req">(required)</span></label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
    <div class="field-row">
      <div class="field"><label for="f-when">When would you like to travel?</label><input id="f-when" name="when" placeholder="e.g. October 2027, flexible"></div>
      <div class="field"><label for="f-length">Roughly how long?</label>
        <select id="f-length" name="length"><option value="">Not sure yet</option><option>Up to 10 days</option><option>11–14 days</option><option>15–21 days</option><option>More than 3 weeks</option></select></div>
    </div>
    <div class="field"><label for="f-people">How many travellers?</label><input id="f-people" name="travellers" inputmode="numeric" placeholder="e.g. 2 adults"></div>
    <div class="field"><label for="f-journey">Starting point (optional)</label>
      <select id="f-journey" name="journey"><option value="">No particular journey</option>${journeys.map((j) => `<option value="${j.slug}">${esc(j.name)}</option>`).join("")}</select></div>
    <fieldset class="field"><legend>What are you most interested in?</legend><div class="checks">${interests.map((i, n) => `<label class="check"><input type="checkbox" name="interests" value="${esc(i)}" id="f-int-${n}"> ${esc(i)}</label>`).join("")}</div></fieldset>
    <fieldset class="field"><legend>How do you feel about long drives?</legend>
      <label class="check"><input type="radio" name="drives" value="Happy with long road days"> Happy with long road days: it's part of the journey</label>
      <label class="check"><input type="radio" name="drives" value="Some driving, fly where it saves a day" checked> Some driving, but fly where it saves a day</label>
      <label class="check"><input type="radio" name="drives" value="As little driving as possible"> As little driving as possible</label>
    </fieldset>
    <div class="field"><label for="f-msg">Anything else?</label><textarea id="f-msg" name="message" rows="5" placeholder="Must-see species, mobility needs, budget range…"></textarea></div>
    <label class="check"><input type="checkbox" name="consent" required id="f-consent"> I'm happy for ${esc(brand.name)} to use these details to reply to my enquiry. <span class="req">(required)</span></label>
    <div class="form-errors" id="form-errors" role="alert" tabindex="-1"></div>
    <p><button class="btn btn--gold" type="submit">Send enquiry</button></p>
    <p class="note" id="form-note">${endpoint ? "" : "Sending opens your email app with your answers filled in, ready to send."}</p>
  </form>
  <aside class="facts">
    <h2 class="facts__h">Other ways to reach us</h2>
    <ul class="plain">
      <li><a href="mailto:${contact.email}">${esc(contact.email)}</a></li>
      <li><a href="tel:${contact.phone.replace(/[^+\d]/g, "")}">${esc(contact.phone)}</a></li>
      <li>${esc(contact.officeHours)}</li>
    </ul>
    <h3 class="facts__h">Before you write</h3>
    <ul>
      <li>Check the <a href="/when-to-go/">seasons</a>: some parks close in the rains.</li>
      <li>Look at the <a href="/map/">driving times</a>: they shape every itinerary.</li>
      <li>Entry and visa rules change, so check current requirements with official sources for your nationality.</li>
    </ul>
  </aside>
</div></section>`,
  });
}

function creditsPage() {
  const list = Object.entries(photos);
  return layout({
    path: "/credits/",
    title: "Photo credits",
    description: "Credits for every photograph on this site.",
    body: `${pageHead({ kicker: "Credits", title: "Photo credits", lead: "Every photo here comes from Unsplash. We only use a photo when its location matches the place it illustrates, and we credit every photographer." })}
<section class="section"><div class="wrap">
  ${list.length ? `<ul class="credits">${list
    .map(([k, p]) => `<li><img src="${unsplashUrl(p, 240)}" width="120" height="${Math.round((120 * p.height) / p.width)}" alt="" loading="lazy"><div><strong>${k === "hero" ? "Home page" : esc(regionBySlug[k]?.name || k)}</strong><br>${credit(p)}<br><small>Location check: ${esc(p.evidence)}</small></div></li>`)
    .join("")}</ul>` : "<p>No photos yet.</p>"}
  <p class="note">Regions without a verified photo show a placeholder until we find one taken there.</p>
</div></section>`,
  });
}

function notFound() {
  return layout({
    path: "/404.html",
    title: "Page not found",
    body: `${pageHead({ kicker: "404", title: "This road doesn't go anywhere", lead: 'The page you were looking for isn\'t here. Try the <a href="/regions/">regions</a>, the <a href="/map/">driving map</a> or the <a href="/">home page</a>.' })}`,
  });
}

// ── assets ───────────────────────────────────────────────────
function tokens() {
  const p = palette;
  return `:root{
  --laterite:${p.laterite};--laterite-dark:${p.lateriteDark};--rainforest:${p.rainforest};--rainforest-light:${p.rainforestLight};
  --bark:${p.bark};--bark-light:${p.barkLight};--gold:${p.gold};--gold-light:${p.goldLight};--cream:${p.cream};--ink:${p.ink};--white:${p.white};--sea:${p.sea};
  --font-heading:${config.fonts.heading};--font-body:${config.fonts.body};
}\n`;
}

// ── build ────────────────────────────────────────────────────
rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, "assets"), { recursive: true });
cpSync(join(ROOT, "src/assets"), join(OUT, "assets"), { recursive: true });
writeFileSync(join(OUT, "assets/styles.css"), tokens() + readFileSync(join(ROOT, "src/assets/styles.css"), "utf8"));
writeFileSync(
  join(OUT, "favicon.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="${palette.rainforest}"/><path d="M13 31h6l-1-14c3-1 6-3 8-6-3 1-5 1-7 0 2-2 3-4 3-7-2 2-4 3-6 3-2 0-4-1-6-3 0 3 1 5 3 7-2 1-4 1-7 0 2 3 5 5 8 6z" fill="${palette.gold}"/></svg>`
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
