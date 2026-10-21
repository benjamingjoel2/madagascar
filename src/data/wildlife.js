// Lemur and wildlife guide by park.
//
// access: 12 letters, Jan → Dec.  O = open  D = difficult (wet, partial or unreliable)  C = usually closed
// months: 12 letters, Jan → Dec.  G = good chance  P = possible  - = unlikely
// chance: overall likelihood on a typical 2–3 day visit with a local guide.
//
// These are guide-level estimates, not guarantees. All are listed in FACTS-TO-VERIFY.md.

export default [
  {
    id: "andasibe",
    park: "Andasibe–Mantadia National Park",
    region: "andasibe",
    access: "DDDOOOOOOOOO",
    accessNote: "Open all year. Slippery and very wet January–March.",
    species: [
      { name: "Indri", latin: "Indri indri", type: "lemur", chance: "likely", months: "GGGGGGGGGGGG", note: "Habituated groups in Analamazaotra; most vocal on clear mornings." },
      { name: "Diademed sifaka", latin: "Propithecus diadema", type: "lemur", chance: "possible", months: "PPPGGGGGGGGP", note: "Mantadia section; needs a longer walk." },
      { name: "Common brown lemur", latin: "Eulemur fulvus", type: "lemur", chance: "likely", months: "GGGGGGGGGGGG" },
      { name: "Eastern grey bamboo lemur", latin: "Hapalemur griseus", type: "lemur", chance: "possible", months: "PPPPPPPPPPPP" },
      { name: "Black-and-white ruffed lemur", latin: "Varecia variegata", type: "lemur", chance: "unlikely", months: "PP-------PPP", note: "Present in Mantadia but shy and hard to find. Those on 'lemur islands' nearby are not wild." },
      { name: "Goodman's mouse lemur", latin: "Microcebus lehilahytsara", type: "lemur", chance: "possible", months: "GGGGP---GGGG", note: "Night walks outside the park. Less active, and may go torpid, in the cool dry months." },
      { name: "Parson's chameleon", latin: "Calumma parsonii", type: "reptile", chance: "possible", months: "GGGGP---PGGG" },
      { name: "Leaf-tailed geckos", latin: "Uroplatus spp.", type: "reptile", chance: "possible", months: "PPPPP---PPPP", note: "Night walks with a sharp-eyed guide." },
    ],
  },
  {
    id: "ranomafana",
    park: "Ranomafana National Park",
    region: "ranomafana",
    access: "DDDOOOOOOOOO",
    accessNote: "Open all year. January–March is the wettest time and steep trails are hard going.",
    species: [
      { name: "Golden bamboo lemur", latin: "Hapalemur aureus", type: "lemur", chance: "possible", months: "PPPPPPPPGGGG", note: "Discovered here in 1986. Guides track groups in the bamboo." },
      { name: "Greater bamboo lemur", latin: "Prolemur simus", type: "lemur", chance: "unlikely", months: "------------", note: "Critically endangered; only a few groups live in the park. Treat any sighting as luck." },
      { name: "Milne-Edwards' sifaka", latin: "Propithecus edwardsi", type: "lemur", chance: "likely", months: "GGGGGGGGGGGG" },
      { name: "Red-bellied lemur", latin: "Eulemur rubriventer", type: "lemur", chance: "likely", months: "GGGGGGGGGGGG" },
      { name: "Red-fronted brown lemur", latin: "Eulemur rufifrons", type: "lemur", chance: "likely", months: "GGGGGGGGGGGG" },
      { name: "Brown mouse lemur", latin: "Microcebus rufus", type: "lemur", chance: "likely", months: "GGGGP---PGGG", note: "Night walk along the park boundary." },
      { name: "Fossa", latin: "Cryptoprocta ferox", type: "mammal", chance: "unlikely", months: "PPPPPPPPPPPP" },
      { name: "Frogs (around 100 species)", latin: "various", type: "amphibian", chance: "likely", months: "GGGPP---PGGG", note: "Best after rain in the warm months." },
      { name: "Satanic leaf-tailed gecko", latin: "Uroplatus phantasticus", type: "reptile", chance: "possible", months: "PPPPP---PPPP" },
    ],
  },
  {
    id: "anja",
    park: "Anja Community Reserve (RN7)",
    region: "rn7-south",
    access: "OOOOOOOOOOOO",
    accessNote: "Open all year. Hot around midday in the wet season.",
    species: [
      { name: "Ring-tailed lemur", latin: "Lemur catta", type: "lemur", chance: "likely", months: "GGGGGGGGGGGG", note: "Births August–October (peak September); babies are carried until about November." },
      { name: "Chameleons (several species)", latin: "Furcifer spp.", type: "reptile", chance: "likely", months: "GGGPP---PGGG" },
    ],
  },
  {
    id: "isalo",
    park: "Isalo National Park",
    region: "isalo",
    access: "DDOOOOOOOOOD",
    accessNote: "Open all year, but storms can close canyon routes in December–February.",
    species: [
      { name: "Ring-tailed lemur", latin: "Lemur catta", type: "lemur", chance: "likely", months: "GGGGGGGGGGGG", note: "In the wooded canyons, often near the campsites." },
      { name: "Verreaux's sifaka", latin: "Propithecus verreauxi", type: "lemur", chance: "possible", months: "PPPPPPPPPPPP" },
      { name: "Red-fronted brown lemur", latin: "Eulemur rufifrons", type: "lemur", chance: "possible", months: "PPPPPPPPPPPP" },
      { name: "Benson's rock thrush", latin: "Monticola sharpei bensoni", type: "bird", chance: "possible", months: "PPPPPPPPPPPP" },
    ],
  },
  {
    id: "kirindy",
    park: "Kirindy Forest (near Morondava)",
    region: "morondava-baobabs",
    access: "DCDOOOOOOOOD",
    accessNote: "The access track can be impassable from about mid-January to late March.",
    species: [
      { name: "Fossa", latin: "Cryptoprocta ferox", type: "mammal", chance: "possible", months: "-----PPPPGGP", note: "Best chance in the mating season, about mid-October to mid-November. Fossas also visit the camp in the dry season." },
      { name: "Verreaux's sifaka", latin: "Propithecus verreauxi", type: "lemur", chance: "likely", months: "GGGGGGGGGGGG" },
      { name: "Red-fronted brown lemur", latin: "Eulemur rufifrons", type: "lemur", chance: "likely", months: "GGGGGGGGGGGG" },
      { name: "Madame Berthe's mouse lemur", latin: "Microcebus berthae", type: "lemur", chance: "possible", months: "PPPPP---PPPP", note: "The world's smallest primate. Night walks only." },
      { name: "Giant jumping rat", latin: "Hypogeomys antimena", type: "mammal", chance: "possible", months: "PPPPPPPPPPPP", note: "Found only in this part of western Madagascar." },
      { name: "Narrow-striped mongoose", latin: "Mungotictis decemlineata", type: "mammal", chance: "possible", months: "PPPPPPPPPPPP" },
    ],
  },
  {
    id: "bemaraha",
    park: "Tsingy de Bemaraha National Park",
    region: "tsingy-de-bemaraha",
    access: "CCCDDOOOOODC",
    accessNote:
      "Usually closed in the wet season (roughly December to April); can close from mid-November. Petits Tsingy reopen first; Grand Tsingy circuits typically June to mid-November.",
    species: [
      { name: "Decken's sifaka", latin: "Propithecus deckenii", type: "lemur", chance: "likely", months: "----GGGGGGG-" },
      { name: "Red lemur", latin: "Eulemur rufus", type: "lemur", chance: "possible", months: "----PPPPPPP-", note: "North of the Tsiribihina river this replaces the red-fronted brown lemur." },
      { name: "Cleese's woolly lemur", latin: "Avahi cleesei", type: "lemur", chance: "unlikely", months: "----PPPPPPP-", note: "Nocturnal and elusive." },
      { name: "Madagascar fish eagle", latin: "Haliaeetus vociferoides", type: "bird", chance: "unlikely", months: "----PPPPPPP-", note: "Critically endangered. Sometimes seen along the Manambolo." },
    ],
  },
  {
    id: "lokobe",
    park: "Lokobe (Nosy Be)",
    region: "nosy-be",
    access: "DDDOOOOOOOOO",
    accessNote: "Open all year (only part of the reserve is open to visitors). Heavy rain and cyclone risk January–March.",
    species: [
      { name: "Black lemur", latin: "Eulemur macaco", type: "lemur", chance: "likely", months: "GGGGGGGGGGGG", note: "Males are black; females are russet-brown." },
      { name: "Nosy Be sportive lemur", latin: "Lepilemur tymerlachsoni", type: "lemur", chance: "possible", months: "PPPPPPPPPPPP" },
      { name: "Panther chameleon", latin: "Furcifer pardalis", type: "reptile", chance: "likely", months: "GGGGGGGGGGGG" },
      { name: "Leaf chameleons", latin: "Brookesia spp.", type: "reptile", chance: "possible", months: "GGGPPPPPPGGG" },
      { name: "Whale shark (offshore)", latin: "Rhincodon typus", type: "marine", chance: "possible", months: "--------PGGG", note: "Boat trips; sightings depend on the year." },
      { name: "Humpback whale (offshore)", latin: "Megaptera novaeangliae", type: "marine", chance: "possible", months: "------PGGGP-", note: "Best August–October." },
    ],
  },
  {
    id: "masoala",
    park: "Masoala National Park & Nosy Mangabe",
    region: "masoala",
    access: "DDDOOOOOOOOO",
    accessNote: "Very wet with cyclone risk January–March. Boats may not run and some lodges close.",
    species: [
      { name: "Red ruffed lemur", latin: "Varecia rubra", type: "lemur", chance: "possible", months: "PPPPPPPPGGGG", note: "Found only in the Masoala peninsula region." },
      { name: "White-fronted brown lemur", latin: "Eulemur albifrons", type: "lemur", chance: "likely", months: "GGGGGGGGGGGG" },
      { name: "Aye-aye", latin: "Daubentonia madagascariensis", type: "lemur", chance: "unlikely", months: "PPPPPPPPPPPP", note: "Camping on Nosy Mangabe gives one of the better chances. Never guaranteed." },
      { name: "Helmeted vanga", latin: "Euryceros prevostii", type: "bird", chance: "possible", months: "PPPPPPPPGGGG", note: "Easier to find in the breeding season." },
      { name: "Leaf-tailed geckos", latin: "Uroplatus spp.", type: "reptile", chance: "likely", months: "GGGGGGGGGGGG", note: "Nosy Mangabe." },
      { name: "Tomato frog", latin: "Dyscophus antongilii", type: "amphibian", chance: "possible", months: "GGGPP----PGG", note: "Often in Maroantsetra town itself." },
      { name: "Humpback whale", latin: "Megaptera novaeangliae", type: "marine", chance: "likely", months: "-----PGGGP--", note: "In the Bay of Antongil about June–October, peaking July to early September." },
    ],
  },
  {
    id: "ifaty",
    park: "Ifaty–Mangily spiny forest",
    region: "ifaty",
    access: "OOOOOOOOOOOO",
    accessNote: "Open all year. Hot and humid December–March; go at dawn.",
    species: [
      { name: "Long-tailed ground roller", latin: "Uratelornis chimaera", type: "bird", chance: "possible", months: "GGGPPPPPGGGG", note: "A sought-after endemic for birders. Dawn walks." },
      { name: "Subdesert mesite", latin: "Monias benschi", type: "bird", chance: "possible", months: "GGGPPPPPGGGG" },
      { name: "Grey mouse lemur", latin: "Microcebus murinus", type: "lemur", chance: "possible", months: "GGGPP---PGGG", note: "Night walks." },
      { name: "Radiated tortoise", latin: "Astrochelys radiata", type: "reptile", chance: "likely", months: "GGGGGGGGGGGG", note: "At the Village des Tortues in Mangily. Wild sightings are rare." },
    ],
  },
];
