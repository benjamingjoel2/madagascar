# Baobab Road: Madagascar travel website

A fast, static, mobile-first travel site for honest, expert-led Madagascar journeys. It has no framework and no runtime dependencies: a single Node script turns the config and data files into plain HTML in `dist/`.

**Before launch, read [FACTS-TO-VERIFY.md](FACTS-TO-VERIFY.md).** Every closure, driving time, wildlife estimate and contact detail on the site is listed there, waiting to be checked.

## Run it locally

You need Node.js 18 or newer. There is nothing to install.

```bash
npm run dev      # build, then preview at http://localhost:8080
npm run build    # build only, into ./dist
npm run check    # WCAG AA contrast, data sanity and broken-link checks (run after build)
```

## Deploy

The repo includes `vercel.json`, so Vercel builds it with `npm run build` and serves `dist/`.

- **From Git:** import the repository in Vercel. There is nothing else to configure.
- **From the CLI:** `npx vercel --prod`.

Any other static host works too: upload the contents of `dist/`.

## Where things live

```
site.config.js        ← brand name, tagline, contact details, palette, fonts, form endpoint
src/data/
  regions.js          ← the ten regions (text, access, best months, map position)
  routes.js           ← driving-time map: places, legs (hours, km, mode, season), flights
  wildlife.js         ← wildlife guide: species × park × month, and park access by month
  journeys.js         ← sample journeys
  stays.js            ← stays (all names are placeholders)
  journal.js          ← journal posts (HTML bodies)
  seasons.js          ← month-by-month notes for "When to go"
  photos.js           ← Unsplash photos, credits and the location evidence for each
  sources.js          ← references behind the facts (shown on /sources/)
src/assets/
  styles.css          ← all styles (colour and font tokens are injected from site.config.js)
  site.js             ← header state, mobile menu, scroll reveals
  map.js              ← route planner on the driving-time map
  wildlife.js         ← park, month and type filters on the wildlife guide
  enquiry.js          ← enquiry form validation and sending
build.mjs             ← page templates and the build
scripts/check.mjs     ← contrast, data and link checks
scripts/serve.mjs     ← local preview server
```

## Common edits

### Re-brand

Everything brand-specific is in **`site.config.js`**:

- `brand`: name, tagline, description and the story behind the name (shown on About).
- `contact`: email, phone, WhatsApp (optional), address and office hours.
- `palette`: every colour on the site. After changing colours, run `npm run build && npm run check`. The check fails if any text and background pair the site uses drops below WCAG AA.
- `fonts`: `display` (headlines and the wordmark), `body`, `mono` (small labels), plus the Google Fonts stylesheet URL.
- `siteUrl`: used for canonical links and the sitemap.

The alternative brand, **Indri Journeys**, needs only `brand.name`, `brand.shortName`, `brand.tagline` and `brand.nameStory` changed. The logo mark is a simple baobab (`LOGO` in `build.mjs`); swap that SVG too if you re-brand.

### Make the enquiry form send somewhere

By default the form opens the visitor's email app with the answers filled in. To collect submissions online, set `enquiry.formEndpoint` in `site.config.js` to a form service URL that accepts a POST (for example Formspree or Basin). The form sends `FormData` and expects a 2xx response.

### Change a driving time

Edit the leg in `src/data/routes.js`. `hours: [min, max]` is the realistic range. Add `flightSaves: "…"` to a flight leg to flag it as saving a day. `season: "dry"` marks legs that are only passable in the dry season (the planner leaves them out when the dry-season box is unticked). `labelOffset` and `bend` only adjust where labels and flight arcs sit on the map.

To add a new place, add it to `places` with its longitude and latitude. It is placed on the map automatically.

### Change wildlife or closures

Edit `src/data/wildlife.js`. Each park has:

- `access`: 12 letters, January to December: `O` open, `D` difficult, `C` usually closed.
- for each species, `months`: 12 letters: `G` good chance, `P` possible, `-` unlikely. `chance` is `likely`, `possible` or `unlikely`, and `type` is `lemur`, `mammal`, `bird`, `reptile`, `amphibian` or `marine`.

`npm run check` catches strings with the wrong length.

### Add a photo

The rule: **only use a photo when its location matches the place it's used for**, and credit it. Add an entry to `src/data/photos.js`, keyed by the region slug (or `hero` for the home page):

```js
"isalo": {
  src: "https://images.unsplash.com/photo-…",   // urls.raw from the Unsplash API, without the query string
  width: 4000, height: 2667, color: "#a0522d",
  alt: "What the photo shows",
  location: "Isalo National Park",               // shown in the credit
  photographer: "Name", photographerUrl: "https://unsplash.com/@user",
  unsplashUrl: "https://unsplash.com/photos/…",
  evidence: "Photographer's location tag: Isalo National Park, Madagascar",
},
```

Fill in `evidence` with how you confirmed the location: the photo's Unsplash location tag, or the photographer's own description naming the place. Unsplash's AI-generated alt text does not count. Until a region has a photo, it shows generated contour-line artwork with the region's coordinates and a "photo to come" note. All credits are also listed on `/credits/`.

### Add or update a source

Add the claim and its URLs to `src/data/sources.js`. They appear on `/sources/`. Keep FACTS-TO-VERIFY.md in step with them.

### Add a journal post

Add an object to `src/data/journal.js` with `slug`, `title`, `date` (YYYY-MM-DD), `excerpt` and an HTML `body`.

## Principles the site follows

- **Honesty.** There are no invented reviews, press logos, awards, prices or team biographies. Sightings are described as likely, possible or unlikely, never guaranteed. Stays are clearly marked as placeholders.
- **Fast.** The site is static HTML with one small CSS file and a little vanilla JS, only on the pages that need it. Images are responsive and lazy-loaded from Unsplash's CDN.
- **Accessible.** WCAG AA contrast (checked by `npm run check`), a skip link, visible focus, semantic tables with screen-reader labels for the colour-coded month cells, symbols as well as colour in those cells, and a form with linked error messages. Every page works without JavaScript; the map's legs are all in a table too.
