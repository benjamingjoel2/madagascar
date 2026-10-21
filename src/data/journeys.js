// Sample journeys. Every one is a starting point for a tailor-made trip.
// We do not publish prices until they are confirmed with local partners.

export default [
  {
    slug: "rn7-slow-road",
    name: "The slow road south",
    days: 16,
    months: "April to November",
    pace: "Long drives on most travel days, with two- and three-night stops between them",
    summary:
      "The classic overland route: rainforest, highlands, canyons and the spiny south-west, driven one way down the RN7 and flown back.",
    regions: ["antananarivo", "andasibe", "rn7-south", "ranomafana", "isalo", "ifaty"],
    days_detail: [
      ["1", "Arrive in Antananarivo", "Transfer to a guesthouse. Rest."],
      ["2–4", "Andasibe", "3½–4 hours east. Indri at dawn, Mantadia, night walks."],
      ["5", "Back west to Antsirabe", "About 8 hours, back through Tana: the longest day of the trip."],
      ["6–8", "Ranomafana", "6–7 hours via Ambositra. Two full days of trails and a night walk."],
      ["9", "Fianarantsoa", "Short drive. Old town and tea or wine country."],
      ["10", "Ambalavao and Anja", "Ring-tailed lemurs on the boulders, paper-making."],
      ["11–13", "Isalo", "5–6 hours across the plateau. Canyons, pools, lemurs."],
      ["14–15", "Ifaty", "4–5 hours to the coast. Spiny forest at dawn."],
      ["16", "Fly Toliara → Antananarivo", "Saves about 2½ days of driving. Connect to your international flight next day if possible."],
    ],
    honestNote:
      "About 30–35 hours of driving in total. If that sounds like too much, drop Andasibe from the start and add it as a short trip at the end instead.",
  },
  {
    slug: "baobabs-and-tsingy",
    name: "Baobabs and the Tsingy",
    days: 11,
    months: "June to October only",
    pace: "Two long track days; otherwise relaxed",
    summary:
      "The west: sunset on the Avenue of the Baobabs, fossa at Kirindy, and the limestone pinnacles of the Tsingy de Bemaraha, reached by a long track and two river ferries.",
    regions: ["antananarivo", "morondava-baobabs", "tsingy-de-bemaraha"],
    days_detail: [
      ["1", "Arrive in Antananarivo", "Rest."],
      ["2", "Fly to Morondava", "About an hour, against 12–14 hours by road. Sunset on the avenue."],
      ["3–4", "Kirindy Forest", "Day and night walks for sifaka, mouse lemurs and, with luck, fossa."],
      ["5", "Track to Bekopaka", "A full day of 8–10 hours, with ferries at Belo-sur-Tsiribihina and on the Manambolo."],
      ["6–8", "Tsingy de Bemaraha", "Grand Tsingy, Petits Tsingy, Manambolo gorge by canoe."],
      ["9", "Track back to Morondava", "Another 8–10 hours. Sunrise at the baobabs next morning."],
      ["10", "Fly to Antananarivo", "Afternoon in the city."],
      ["11", "Depart", ""],
    ],
    honestNote:
      "Only possible in the dry season, because the Tsingy is usually closed for part of the wet season. The track days are dusty and bumpy, and there is no shortcut.",
  },
  {
    slug: "red-ruffed-rainforest",
    name: "Rainforest to the sea",
    days: 11,
    months: "September to December",
    pace: "Slow and immersive; short transfers by boat",
    summary:
      "Two contrasting rainforests: the singing indri of Andasibe and the remote Masoala peninsula, home of the red ruffed lemur, reached by plane and boat.",
    regions: ["antananarivo", "andasibe", "masoala"],
    days_detail: [
      ["1", "Arrive in Antananarivo", "Rest."],
      ["2–4", "Andasibe", "Indri, diademed sifaka, night walks."],
      ["5", "Back to Antananarivo", "3½–4 hours."],
      ["6", "Fly to Maroantsetra", "Look for tomato frogs in town."],
      ["7–9", "Masoala", "Boat across the bay. Red ruffed lemurs, forest walks, kayaking. A night trip to Nosy Mangabe."],
      ["10", "Boat and fly to Antananarivo", "Flights here are less reliable than on other routes, so we leave a spare day before your international flight."],
      ["11", "Depart", ""],
    ],
    honestNote:
      "Masoala is wet in every month, and the lodges there are simple. Flights to Maroantsetra are sometimes rescheduled, which is why we always build in a buffer day.",
  },
  {
    slug: "lemurs-and-islands",
    name: "Lemurs and the islands",
    days: 10,
    months: "April to December",
    pace: "Easy: one road day, one flight",
    summary:
      "A first taste for travellers short on time: the indri of Andasibe, then black lemurs, chameleons and warm water around Nosy Be.",
    regions: ["antananarivo", "andasibe", "nosy-be"],
    days_detail: [
      ["1", "Arrive in Antananarivo", "Rest."],
      ["2–4", "Andasibe", "Indri at dawn, night walks."],
      ["5", "Back to Antananarivo", "3½–4 hours."],
      ["6", "Fly to Nosy Be", "Boat to a smaller island lodge."],
      ["7–9", "Nosy Be islands", "Lokobe, snorkelling and, in season, whale sharks offshore."],
      ["10", "Fly to Antananarivo and depart", ""],
    ],
    honestNote:
      "This route skips the long drives, so it also misses the change of landscape that makes the RN7 special. It suits a first trip, or travellers with limited mobility.",
  },
];
