// Driving-time map data.
// `hours` is a realistic door-to-door range for a private vehicle with a
// driver, including short stops but not sightseeing. All figures are
// estimates to check: see FACTS-TO-VERIFY.md.

export const places = {
  tana: { name: "Antananarivo", lon: 47.52, lat: -18.91, region: "antananarivo", airport: true },
  andasibe: { name: "Andasibe", lon: 48.42, lat: -18.93, region: "andasibe" },
  antsirabe: { name: "Antsirabe", lon: 47.03, lat: -19.87, region: "rn7-south" },
  ranomafana: { name: "Ranomafana", lon: 47.46, lat: -21.26, region: "ranomafana" },
  fianar: { name: "Fianarantsoa", lon: 47.09, lat: -21.45, region: "rn7-south" },
  ambalavao: { name: "Ambalavao & Anja", lon: 46.94, lat: -21.83, region: "rn7-south" },
  isalo: { name: "Isalo (Ranohira)", lon: 45.4, lat: -22.55, region: "isalo" },
  toliara: { name: "Toliara", lon: 43.67, lat: -23.35, region: "ifaty", airport: true },
  ifaty: { name: "Ifaty", lon: 43.62, lat: -23.15, region: "ifaty" },
  miandrivazo: { name: "Miandrivazo", lon: 45.46, lat: -19.52, region: "morondava-baobabs" },
  morondava: { name: "Morondava", lon: 44.28, lat: -20.28, region: "morondava-baobabs", airport: true },
  bekopaka: { name: "Bekopaka (Tsingy)", lon: 44.87, lat: -19.14, region: "tsingy-de-bemaraha" },
  nosybe: { name: "Nosy Be", lon: 48.27, lat: -13.33, region: "nosy-be", airport: true },
  maroantsetra: { name: "Maroantsetra", lon: 49.74, lat: -15.43, region: "masoala", airport: true },
  masoala: { name: "Masoala lodges", lon: 50.05, lat: -15.75, region: "masoala" },
};

// mode: "road" | "track" (unpaved, 4x4) | "boat" | "flight"
// season: "all" | "dry" (only realistic in the dry season)
// flightSaves: text shown when a domestic flight saves at least a day
// labelOffset / bend: drawing tweaks for the map only (pixels), so labels don't collide
export const legs = [
  {
    from: "tana", to: "andasibe", labelOffset: [0, -20], mode: "road", km: 145, hours: [3.5, 4], season: "all",
    note: "RN2 east. Leaving Tana can take an hour on its own.",
  },
  {
    from: "tana", to: "antsirabe", labelOffset: [30, 0], mode: "road", km: 170, hours: [4, 4.5], season: "all",
    note: "RN7 south through the highlands.",
  },
  {
    from: "antsirabe", to: "ranomafana", labelOffset: [30, 0], mode: "road", km: 250, hours: [6, 7], season: "all",
    note: "Via Ambositra, then the RN25 down the escarpment.",
  },
  {
    from: "ranomafana", to: "fianar", labelOffset: [42, 4], mode: "road", km: 65, hours: [1.5, 2], season: "all",
    note: "Winding road back up to the RN7.",
  },
  {
    from: "fianar", to: "ambalavao", labelOffset: [-50, -1], mode: "road", km: 56, hours: [1, 1.5], season: "all",
    note: "Anja Community Reserve is just south of Ambalavao.",
  },
  {
    from: "ambalavao", to: "isalo", labelOffset: [14, 14], mode: "road", km: 240, hours: [5, 6], season: "all",
    note: "Across the Horombe plateau via Ihosy.",
  },
  {
    from: "isalo", to: "toliara", labelOffset: [8, 16], mode: "road", km: 240, hours: [4, 5], season: "all",
    note: "Through Ilakaka (sapphire town) and the dry south-west.",
  },
  {
    from: "toliara", to: "ifaty", labelOffset: [-44, 2], mode: "road", km: 25, hours: [0.75, 1], season: "all",
    note: "Short coastal hop. Road condition varies.",
  },
  {
    from: "tana", to: "miandrivazo", labelOffset: [-6, 14], mode: "road", km: 430, hours: [8, 9], season: "all",
    note: "RN7 to Antsirabe, then west on the RN34. Usually the first night of a road trip to Morondava.",
  },
  {
    from: "miandrivazo", to: "morondava", labelOffset: [26, 14], mode: "road", km: 240, hours: [4.5, 5.5], season: "all",
    note: "RN35 across the western plains.",
  },
  {
    from: "morondava", to: "bekopaka", labelOffset: [-58, -2], mode: "track", km: 200, hours: [8, 10], season: "dry",
    note: "Rough 4x4 track with ferry crossings at Belo-sur-Tsiribihina and on the Manambolo. Dry season only.",
  },
  {
    from: "maroantsetra", to: "masoala", labelOffset: [44, -20], mode: "boat", km: 45, hours: [1.5, 3], season: "all",
    note: "Boat across the Bay of Antongil, usually leaving early before the wind picks up. Weather-dependent.",
  },
  // Domestic flights. Schedules change often and some routes are not daily.
  {
    from: "tana", to: "morondava", bend: 70, labelOffset: [-4, -4], mode: "flight", hours: [1, 1], season: "all",
    flightSaves: "Saves about a day and a half each way compared with 12–14 hours on the road.",
  },
  {
    from: "toliara", to: "tana", bend: -95, mode: "flight", hours: [1.25, 1.25], season: "all",
    flightSaves: "Saves about two and a half days of driving back up the RN7.",
  },
  {
    from: "tana", to: "nosybe", mode: "flight", hours: [1.5, 2], season: "all",
    flightSaves: "There is no sensible road option for a holiday: this flight saves two days or more.",
  },
  {
    from: "tana", to: "maroantsetra", mode: "flight", hours: [1.5, 2.5], season: "all",
    flightSaves: "The only practical way in. Some flights stop on the way.",
  },
];

// Long road alternatives to show alongside flights (never drawn on the map).
export const roadAlternatives = [
  { from: "Antananarivo", to: "Morondava", hours: "12–14 hours", days: "2 days with a night in Miandrivazo" },
  { from: "Toliara", to: "Antananarivo", hours: "about 20 hours", days: "2½–3 days on the RN7" },
  { from: "Antananarivo", to: "Nosy Be", hours: "20+ hours plus a ferry", days: "not recommended" },
];
