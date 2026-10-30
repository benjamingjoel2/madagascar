# Facts to verify before launch

Every fact on the site was checked against published sources in **October 2026** (web search; see `src/data/sources.js` and the public `/sources/` page). Most sources are guidebooks, operators, news and scientific references, **not official notices**. So each item below still needs a final check by a Madagascar specialist or the official body before launch.

**Status key**
- ✅ **Sourced**: supported by at least one published source; confirm with an official source.
- ✏️ **Corrected**: the research contradicted or refined our first draft, and the site has been updated to match the sources.
- ❓ **Open**: no good source found yet; the site words it cautiously or doesn't state it.

**Priority key**
- **P1**: could cause a missed trip, a safety problem or a legal issue.
- **P2**: could mislead a traveller.
- **P3**: nice to get right.

---

## 1. Entry, visas and health (P1, not published on the site)

The site deliberately does **not** state visa rules, fees or health requirements. It only says "check current requirements with official sources". Internal research notes:

- [ ] ❓ **E-visa fees** reportedly rose from 16 Feb 2026:
  - 15 days: €30
  - 30 days: €35
  - 60 days: €40
  - 90 days: €50

  Visa-on-arrival fees are reported inconsistently. Sources: travelnews.co.za (Feb 2026), visasnews.com. Verify on the official e-visa portal or with an embassy.
- [ ] ❓ Passport validity of 6 months from arrival (agency sites only).
- [ ] ❓ Tourist tax: a per-night hotel "vignette touristique" is usually included in room rates. Whether any entry tax applies is unclear.
- [ ] ✅ **Yellow fever:** a certificate is required only for travellers aged 9 months or over arriving from a country with risk of transmission, including transits of more than 12 hours. Madagascar itself has no risk. Source: CDC Yellow Book (2018 edition). Check the current WHO and CDC lists.
- [ ] ❓ Malaria advice per region: link to official travel-health sources instead of giving advice.
- [ ] ❓ Current government travel advice for the main source markets.

## 2. Park closures and seasonal access (P1)

Files: `src/data/wildlife.js` (`access`), `src/data/regions.js`, `src/data/seasons.js`, the journal.

- [ ] ✏️ **Tsingy de Bemaraha.**
  - The access string is now `CCCDDOOOOODC`: closed from about December to March, difficult in April, May and November.
  - The park can close from mid-November if the rivers rise early.
  - The Petits Tsingy reopen first. The Grand Tsingy circuits typically run from about June to early or mid-November.
  - In the wet season the whole park is effectively closed, including the Petits Tsingy.
  - Sources: fairmoove.fr, newsmada.com, matadornetwork.com.
  - **Confirm the current dates with Madagascar National Parks (MNP).**
- [ ] ✅ **Morondava–Bekopaka track:** dry season only, with ferries on the Tsiribihina (at Belo) and the Manambolo. Sources: evaneos.fr, madagascartravel.com. Also check RN8 roadworks between Andimaka and Bekopaka, reported starting in April 2024 (lexpress.mg).
- [ ] ✏️ **Kirindy:** now `DCDOOOOOOOOD`. The track can be impassable from mid-January to late March. Sources: wildmadagascar.org, atrsafari.com. Confirm with the forest operator.
- [ ] ✅ **Masoala:** wettest months best avoided. Masoala Forest Lodge closes for part of the wet season (sources differ: Feb–Mar, or mid-Jan to mid-Apr). The site doesn't name lodges. Confirm with the lodges.
- [ ] ✅ **Isalo:** storms and flash floods can restrict canyon routes in the wet season. Source: vivytravel.com.
- [ ] ❓ **Andasibe, Ranomafana, Lokobe, Anja, Ifaty:** no seasonal closures found. ✏️ Lokobe: only part of the reserve is open to visitors (evaneos.com).
- [ ] ✏️ **Seasons:**
  - The rainy season is now described as "roughly November/December to March (into April in wet years)".
  - The official cyclone season is 15 Nov–30 Apr, with the highest risk January–March.
  - Sources: lonelyplanet.com, lexpress.mg.
- [ ] ✅ July–August is the busiest period and Christmas is busy. Jacarandas flower around October. Source: roughguides.com.
- [ ] ❓ The dry-season toggle in the map planner says "May–November". Consistent with the above, but confirm.

## 3. Park fees and rules (P1, not published)

- [ ] ❓ **MNP fees DOUBLE from 1 November 2026**, according to L'Express (May 2026). Foreign adults go from about 45,000 Ar to about 90,000 Ar per day at standard parks, and some parks are higher. Sources: lexpress.mg (2026-05), marojejy.com 2026–27 tariff PDF, safarifind.com. Any figures you publish must be the new ones. **Confirm with MNP.**
- [ ] ✅ **Local guides are mandatory in national parks.** The About page says this. Sources: roughguides.com, safarifind.com. Confirm that it applies to every park listed.
- [ ] ✅ **Night walks generally take place outside park boundaries**, along the road or in community reserves. The site's wildlife notes say this. Source: vivytravel.com.
- [ ] ❓ Community-reserve fees: Anja, Ifaty/Mangily reserves, Andasibe community reserves.

## 4. Driving and flight times (P2)

Files: `src/data/routes.js`, repeated in `regions.js`, `journeys.js` and the journal. Sources are listed on `/sources/`. Ask your ground handler to confirm each figure against recent trips.

| Leg | Site now says | Status |
|---|---|---|
| Antananarivo → Andasibe | 145 km, 3½–4 h | ✅ |
| Antananarivo → Antsirabe | 170 km, 4–4½ h | ✅ (RN7 works under way) |
| Antsirabe → Ranomafana | 250 km, 6–7 h | ✅ (route wording no longer says "RN25") |
| Ranomafana → Fianarantsoa | 65 km, **2–3 h** | ✏️ was 1½–2 h |
| Fianarantsoa → Ambalavao | 56 km, **1–2 h** | ✏️ was 1–1½ h |
| Ambalavao → Isalo | **225 km**, **4½–6 h** | ✏️ was 240 km, 5–6 h |
| Isalo → Toliara | **245 km**, **5–7 h** | ✏️ was 4–5 h; road badly potholed (L'Express, Nov 2025) |
| Toliara → Ifaty | **27 km**, **½–¾ h** | ✏️ RN9 paved |
| Antananarivo → Miandrivazo | **390 km**, **9–10 h** | ✏️ was 430 km, 8–9 h |
| Miandrivazo → Morondava | **265 km**, **4–5 h** | ✏️ |
| Road Tana → Morondava | **13–15 h** | ✏️ was 12–14 h |
| Morondava → Bekopaka | 200 km, 8–10 h | ✅ |
| Maroantsetra → Masoala lodges (boat) | 1½–3 h | ✅ |
| Toliara → Tana by road | about 20 h, 2½–3 days | ✅ |
| Bekopaka → Grand Tsingy | 17 km, **1–2 h** | ✏️ |
| Flight Tana → Morondava | about 1 h, **often about weekly** | ✏️ frequency added |
| Flight Toliara → Tana | **1¼–1½ h** | ✏️ |
| Flight Tana → Nosy Be | **1½–1¾ h** | ✏️ |
| Flight Tana → Maroantsetra | **1¼–2½ h**, often weekly, some via Toamasina | ✏️ |

- [ ] ❓ **RN35 bridge:** one source says a broken bridge on the RN35 has made it impassable since 2023. Our Miandrivazo → Morondava leg uses the RN34 to Malaimbandy, then the RN35. **Confirm the current route with your driver.**
- [ ] ✏️ **Airline:** domestic routes are flown by Madagascar Airlines, reportedly reverting to the Air Madagascar name from 31 Oct 2026. Tsaradia no longer operates separately. Madagasikara Airways' status is unclear. The site names no airline.
- [ ] ❓ The planner adds 3 h per flight for check-in and transfers (`src/assets/map.js`).
- [ ] ❓ "We do not drive after dark": this must be real company policy.
- [ ] ✏️ The slow road south's total driving is now "about 32–38 hours".

## 5. Wildlife (P2)

File: `src/data/wildlife.js`. The likelihood and month strings remain **estimates**. Ask a naturalist guide for each park to review them.

- [ ] ✅ Indri: habituated groups at Analamazaotra, morning song, none in captivity.
- [ ] ✏️ Golden bamboo lemur: **discovered in 1986**, described in 1987. Ranomafana opened in 1991.
- [ ] ✅ Greater bamboo lemur: few groups, rarely seen.
- [ ] ✏️ Black-and-white ruffed lemur in Mantadia: now "present but shy and hard to find".
- [ ] ✅ Mouse lemurs: less active, and may go torpid, in the cool dry season.
- [ ] ✏️ Ring-tailed lemur births run August–October (peak September); babies are carried until about November.
- [ ] ✏️ Fossa: the mating season is about **mid-October to mid-November**. Fossas also visit the Kirindy camp in the dry season.
- [ ] ✅ Madame Berthe's mouse lemur; giant jumping rat; Decken's sifaka; Cleese's woolly lemur.
- [ ] ✏️ **Bemaraha's brown lemur is the red lemur, *Eulemur rufus*** (north of the Tsiribihina), not *E. rufifrons*.
- [ ] ✅ Black lemur colouring; Nosy Be sportive lemur (*L. tymerlachsoni*).
- [ ] ✅ Whale sharks off Nosy Be, about Sep/Oct–Dec.
- [ ] ✏️ Humpbacks:
  - Antongil Bay: about June–October, peaking July to early September.
  - Nosy Be: July–November, best August–October.
  - Ifaty: **removed**, because no reliable source was found.
- [ ] ✅ Red ruffed lemur: Masoala peninsula region.
- [ ] ✏️ Aye-aye on Nosy Mangabe: "one of the better places", needs camping overnight, never guaranteed.
- [ ] ✅ Tomato frog in Maroantsetra town; spiny-forest birds at Ifaty; Village des Tortues at Mangily.
- [ ] ✏️ Ranomafana frogs: now "around 100 species" (sources give 98 to "nearly 120 incl. candidates").
- [ ] ✏️ Endemism: "all lemurs, nearly all frogs and reptiles, over 80% of plants" (was "around 90% of wildlife").

## 6. Places and general claims (P2/P3)

- [ ] ✅ Ivato handles international and domestic flights.
- [ ] ✏️ Ambohimanga (the UNESCO site) is about 24 km north-east of Tana. The Rova is on Analamanga in the city and is *not* a UNESCO site. The copy keeps the two separate.
- [ ] ✅ "Ranomafana" means "hot water"; there are hot springs. Zafimaniry woodcarving at Ambositra; silk and Antemoro paper at Ambalavao.
- [ ] ✏️ Anja: "ring-tailed lemurs on granite boulders" was **removed**, because no source confirmed it. It now says "a community-run reserve where ring-tailed lemurs are easy to see".
- [ ] ✏️ Ilakaka is now a "former sapphire boomtown".
- [ ] ✏️ Baobabs Amoureux: now "a different species, a few kilometres away" (they are *Adansonia za*). The Avenue itself is *A. grandidieri*.
- [ ] ✏️ Masoala is "Madagascar's largest national park". Makira is the largest protected area.
- [ ] ✅ Nosy Be islands; Fascene airport; Ifaty lagoon and Vezo communities; Madagascar's area (587,041 km², roughly France plus Belgium).

## 7. Business details (P1)

`site.config.js`

- [ ] Email is `baobabroad@tourground.com`; business address is Le BOP coworking, Villa Chti'mi, Androhibe, 101 Antananarivo (from coworker.com's listing): confirm the exact address with the space. Office hours are a placeholder. The site deliberately shows no phone or WhatsApp.
- [ ] `siteUrl`: set it to the real domain.
- [ ] Enquiry form: set `enquiry.formEndpoint`, or confirm that the mailto fallback is acceptable. The success message promises a reply "within two working days" (`src/assets/enquiry.js`).
- [ ] Add a privacy notice. The form collects personal data.
- [ ] Add any licensing or financial-protection details your market requires (for example ATOL/ABTA in the UK) only once they are real.
- [ ] Stays: **all names are placeholders** (`src/data/stays.js`).
- [ ] Home and About promises must hold true in practice: real hours, never selling a closed park, no guaranteed sightings, two-night stops after long road days, no playback, no feeding.
- [ ] Team profiles are a placeholder.

## 8. Photos (P2)

`src/data/photos.js`

- [ ] Each photo's `evidence` field records why it was accepted. Spot-check each one on Unsplash.
- [ ] Regions without a verified photo show contour artwork. Add photos only when the location is confirmed.
