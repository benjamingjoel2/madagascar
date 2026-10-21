# Facts to verify before launch

Everything below appears on the site. It was written from general knowledge, **not** checked against current official sources. Before launch, a Madagascar specialist should check each item and tick it off. Where a fact lives in a data file, the file is named so you can fix it in one place.

Priority key: **P1** = could cause a missed trip, a safety problem or a legal issue · **P2** = could mislead a traveller · **P3** = nice to get right.

---

## 1. Entry, visas and health (P1)

The site deliberately does **not** state visa rules, fees or health requirements. It only says "check current requirements with official sources" (`build.mjs`, enquiry page sidebar). Before you add any of these, verify them:

- [ ] Visa on arrival vs. e-visa: which nationalities, current fees, maximum stay lengths, passport validity and blank-page rules.
- [ ] Any tourist tax or airport fees paid on arrival.
- [ ] Yellow fever certificate rules (generally only when arriving from a risk country: confirm).
- [ ] Malaria advice for each region (link to official travel-health sources instead of giving advice).
- [ ] Current government travel advice for the main source markets (UK FCDO, US State Department, etc.).

## 2. Park closures and seasonal access (P1)

`src/data/wildlife.js` (the `access` strings), `src/data/regions.js` (`access`, `accessNote`), `src/data/seasons.js`, journal post "Planning around the wet season".

- [ ] **Tsingy de Bemaraha**: the site says it is usually closed for part of the wet season, "roughly December to April", with May and November marked "difficult". Confirm current Madagascar National Parks (MNP) opening and closing dates, and whether the Petits Tsingy stay open when the Grand Tsingy is closed.
- [ ] Morondava–Bekopaka track: dry season only; ferry crossings at Belo-sur-Tsiribihina and on the Manambolo. Confirm the ferries are still how the route works, and whether any bridge or road works have changed the timings.
- [ ] Kirindy Forest: access marked "difficult" January–March and in December. Confirm, and check whether Kirindy (CNFEREF) closes outright in the wet season.
- [ ] Masoala: "very wet with cyclone risk January–March; boats may not run and some lodges close". Confirm which lodges close and when.
- [ ] Isalo: storms "can close canyon routes in December–February". Confirm.
- [ ] Andasibe, Ranomafana, Lokobe, Anja and Ifaty marked as open all year. Confirm none have seasonal closures.
- [ ] Cyclone season stated as "roughly January to March" (some pages say December–March for the rainy season). Check against official meteorological sources and make the wording consistent.
- [ ] The "Travelling in the dry season (May–November)" toggle in the map planner (`build.mjs`, `mapPage`).

## 3. Park fees and rules (P1)

The site does **not** quote park fees. Before you add them, verify:

- [ ] Current MNP entry fees (they usually vary by park and by number of days).
- [ ] Guide fees, and whether a local guide is compulsory in every park. The About page says every park visit is with a licensed local guide "as park rules require": **confirm that this is true in every park listed**.
- [ ] Night-walk rules: Andasibe and Ranomafana night walks are described as taking place on the road or along the park boundary. Confirm current rules.
- [ ] Any community-reserve fees (Anja, Ifaty/Mangily reserves, Andasibe community reserves).

## 4. Driving and flight times (P2)

`src/data/routes.js` (`hours`, `km`, `flightSaves`, `roadAlternatives`), also repeated in `src/data/regions.js` (`gettingThere`), `src/data/journeys.js`, and the journal post "Why we quote hours".

Ask your ground handler to confirm each figure against recent trips:

| Leg | Site says |
|---|---|
| Antananarivo → Andasibe | 145 km, 3½–4 h |
| Antananarivo → Antsirabe | 170 km, 4–4½ h |
| Antsirabe → Ranomafana | 250 km, 6–7 h |
| Ranomafana → Fianarantsoa | 65 km, 1½–2 h |
| Fianarantsoa → Ambalavao | 56 km, 1–1½ h |
| Ambalavao → Isalo (Ranohira) | 240 km, 5–6 h |
| Isalo → Toliara | 240 km, 4–5 h |
| Toliara → Ifaty | 25 km, ¾–1 h |
| Antananarivo → Miandrivazo | 430 km, 8–9 h |
| Miandrivazo → Morondava | 240 km, 4½–5½ h |
| Morondava → Bekopaka | 200 km, 8–10 h (dry season) |
| Maroantsetra → Masoala lodges | ~45 km by boat, 1½–3 h |
| Flight Tana → Morondava | ~1 h |
| Flight Toliara → Tana | ~1¼ h |
| Flight Tana → Nosy Be | 1½–2 h |
| Flight Tana → Maroantsetra | 1½–2½ h (some flights stop on the way) |
| Road Tana → Morondava | 12–14 h |
| Road Toliara → Tana | about 20 h, 2½–3 days |
| Road Tana → Nosy Be | 20+ h plus a ferry |
| RN7 total length | "about 950 km" |
| Avenue of the Baobabs from Morondava | 30–45 min |
| Kirindy from the avenue | about 1½ h further north |
| Bekopaka → Grand Tsingy | about 1½ h on track |

- [ ] Which domestic routes currently run, how often, and on which airline(s). The site does not name an airline.
- [ ] The planner adds 3 hours per flight for check-in and transfers (`src/assets/map.js`, `FLIGHT_OVERHEAD`). Confirm that this is sensible.
- [ ] "We do not drive after dark" (map page, journal). Make sure this is real company policy.
- [ ] Sample journey totals: "about 30–35 hours of driving" on The slow road south.

## 5. Wildlife: species, likelihood and months (P2)

`src/data/wildlife.js`. Every `chance` (likely / possible / unlikely) and every 12-month string is an estimate. Ask a naturalist guide for each park to review the whole table. In particular:

- [ ] Indri: habituated groups in Analamazaotra; most vocal in the morning; "not kept in zoos" (journal post "Listening for the indri").
- [ ] Golden bamboo lemur: "described to science in 1987" and Ranomafana "was created after it was found here". Check both the date and the wording about cause and effect.
- [ ] Greater bamboo lemur at Ranomafana: rarely seen.
- [ ] Black-and-white ruffed lemur at Mantadia: rarely seen; the animals on "lemur islands" are not wild.
- [ ] Diademed sifaka in Mantadia.
- [ ] Mouse lemurs "less active in the cool dry months" (torpor). Check this for each species listed.
- [ ] Ring-tailed lemur babies "from about September to November" (Anja). Check birth season.
- [ ] Lemur babies generally "from around September to November" (journal, when to go).
- [ ] Fossa at Kirindy: best "roughly September to November" (mating season). The when-to-go page says "fossa season beginning" in September and "fossa at Kirindy" in October.
- [ ] Madame Berthe's mouse lemur: "world's smallest primate", at Kirindy.
- [ ] Giant jumping rat "found only in this part of western Madagascar".
- [ ] Decken's sifaka at Bemaraha; Cleese's woolly lemur at Bemaraha.
- [ ] Madagascar fish eagle along the Manambolo.
- [ ] Black lemur sexual dichromatism (males black, females russet-brown); Nosy Be sportive lemur (*Lepilemur tymerlachsoni*) at Lokobe.
- [ ] Whale sharks off Nosy Be: marked possible September and good October–December.
- [ ] Humpback whales: July–September (Antongil Bay, Nosy Be, Ifaty). The when-to-go page says whales "arrive" in July.
- [ ] Red ruffed lemur "found only on the Masoala peninsula".
- [ ] Nosy Mangabe as "one of the more reliable places" for the aye-aye.
- [ ] Tomato frog "often in Maroantsetra town"; *Dyscophus antongilii*.
- [ ] Helmeted vanga easier in the breeding season (marked September–December).
- [ ] Long-tailed ground roller and subdesert mesite in the Ifaty spiny forest.
- [ ] Radiated tortoises at a conservation centre near Ifaty (the site does not name it).
- [ ] Ranomafana "over 100 frog species" (species row label).
- [ ] Scientific names, especially recent taxonomic splits (*Eulemur rufifrons* vs *E. rufus*, *Microcebus lehilahytsara*, etc.).
- [ ] "Around 90% of its wildlife is found nowhere else on Earth" (About page). Find a citable figure; it differs by group.

## 6. Places and general claims (P2/P3)

`src/data/regions.js`

- [ ] Ivato is the main international airport; domestic flights leave from the same airport.
- [ ] The Rova and Ambohimanga (UNESCO World Heritage Site).
- [ ] "Ranomafana" means "hot water"; there are hot springs in the village.
- [ ] Ambositra: Zafimaniry woodcarving. Ambalavao: silk weaving and Antemoro paper.
- [ ] Ilakaka described as "sapphire town".
- [ ] Grandidier's baobabs on the Avenue of the Baobabs; the "Baobabs Amoureux".
- [ ] Nosy Be: Fascene airport; nearby islands Nosy Komba, Nosy Sakatia, Nosy Iranja, Nosy Tanikely.
- [ ] Masoala: "Madagascar's largest protected rainforest"; no road access.
- [ ] Ifaty: Vezo fishing communities; reef-sheltered lagoon.
- [ ] Madagascar "about the size of France and Belgium combined" (Regions page).
- [ ] Jacarandas flower in Antananarivo in October (when-to-go).
- [ ] July–August is the busiest period; Christmas is busy.

## 7. Business details (P1)

`site.config.js`

- [ ] Email, phone, WhatsApp, postal address and office hours are **placeholders**.
- [ ] `siteUrl`: set it to the real domain.
- [ ] Enquiry form: set `enquiry.formEndpoint`, or confirm that the mailto fallback is acceptable. The success message promises a reply "within two working days" (`src/assets/enquiry.js`). Confirm or change.
- [ ] Add a privacy notice. The form collects personal data; the consent checkbox alone is not a privacy policy.
- [ ] Any licensing, bonding or financial-protection details your market requires (for example ATOL/ABTA in the UK) are **not** on the site. Add them only once they are real.
- [ ] Stays: **all names are placeholders** (`src/data/stays.js`), and so are the descriptions of each kind of stay. The "What to expect" notes about limited electricity and solar hot water are generalisations.
- [ ] Home page promises ("real hours", "we never sell you a closed park", "never promise" sightings) must hold true in practice.
- [ ] About page: team profiles are a placeholder. Statements about how the company works (local guides, private vehicles, a two-night stop after each long road day, no playback, no feeding) must match what you actually do.

## 8. Photos (P2)

`src/data/photos.js`

- [ ] Each photo's `evidence` field records why it was accepted (the photographer's location tag or description). Spot-check each photo on Unsplash before launch.
- [ ] Regions without a matching photo show a placeholder. Add photos only when the photo's location is confirmed to be that place.
