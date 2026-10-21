// Unsplash photos. A photo is only listed here when its location matches the
// place it is used for: the photographer's own location tag or description
// names the place. `evidence` records that check. Keys are region slugs
// (plus "hero"). Regions without a verified photo show contour artwork instead.
// Rejected example: Unsplash results for "Masoala" are mostly from the
// Masoala rainforest hall at Zürich Zoo, so they are not used.
//
// Unsplash licence: free to use; we credit every photographer anyway.
// Images are hotlinked from images.unsplash.com as Unsplash's API guidelines ask.

export default {
  hero: {
    src: "https://images.unsplash.com/photo-1597426061335-e50c8697630b",
    width: 5947, height: 3965, color: "#404026",
    alt: "Baobab trees silhouetted against an orange sunset on the Avenue of the Baobabs",
    location: "Avenue of the Baobabs, near Morondava",
    photographer: "Dmitrii Zhodzishskii",
    photographerUrl: "https://unsplash.com/@dmitrii_zhodzishskii",
    unsplashUrl: "https://unsplash.com/photos/silhouette-of-trees-during-sunset-JyN-RZBCwRo",
    evidence: "Photographer's description: \"Sunset on the Avenue of the Baobabs, Madagascar\"",
  },
  "morondava-baobabs": {
    src: "https://images.unsplash.com/photo-1570742544137-3a469196c32b",
    width: 3847, height: 2570, color: "#f3d9c0",
    alt: "Tall baobab trees lining the sandy road of the Avenue of the Baobabs at sunrise",
    location: "Avenue of the Baobabs, Morondava",
    photographer: "Yasmine Arfaoui",
    photographerUrl: "https://unsplash.com/@yasmine_photo",
    unsplashUrl: "https://unsplash.com/photos/avenue-of-the-baobabs-madagascar-during-day-G40jEUyEsEk",
    evidence: "Photographer's description: \"Beautiful alley of baobabs during sunrise in Morondava, Madagascar.\"",
  },
  "tsingy-de-bemaraha": {
    src: "https://images.unsplash.com/photo-1781428269291-e4b90f17e6dd",
    width: 7705, height: 5139, color: "#a6a6a6",
    alt: "A suspension bridge crossing the jagged grey limestone pinnacles of the Tsingy",
    location: "Tsingy de Bemaraha National Park",
    photographer: "Rafael Peier",
    photographerUrl: "https://unsplash.com/@rafaelpeier",
    unsplashUrl: "https://unsplash.com/photos/adventurous-rope-bridge-crosses-dramatic-limestone-karst-landscape-4z3Rl7U8Pxk",
    evidence: "Unsplash location tag: \"Tsingy De Bemaraha National Park, Begara, Madagaskar\"",
  },
  "andasibe": {
    src: "https://images.unsplash.com/photo-1656163157891-0c4564353085",
    width: 5501, height: 3667, color: "#26260c",
    alt: "A lemur sitting on a branch in the forest",
    location: "Andasibe",
    photographer: "Sandy Ravaloniaina",
    photographerUrl: "https://unsplash.com/@th3sand7",
    unsplashUrl: "https://unsplash.com/photos/a-monkey-sitting-on-a-tree-branch-PQ4a3wTeF9s",
    evidence: "Unsplash location tag: \"Andasibe, Madagascar\"",
  },
  "antananarivo": {
    src: "https://images.unsplash.com/photo-1624272909636-4995421e37e7",
    width: 5184, height: 3456, color: "#d9d9d9",
    alt: "Antananarivo's hillside houses and a church spire under a cloudy sky",
    location: "Antananarivo",
    photographer: "Sitraka Mamy Tantely Andriamialijaona",
    photographerUrl: "https://unsplash.com/@sitrakamamytantely12",
    unsplashUrl: "https://unsplash.com/photos/aerial-view-of-city-buildings-during-daytime-9NkRPZHp94E",
    evidence: "Unsplash location tag: \"Antananarivo, Madagascar\"; photographer's description: \"Manjakaray Landscape\" (a district of Antananarivo)",
  },
  "rn7-south": {
    src: "https://images.unsplash.com/photo-1707772775063-a6a33b61f561",
    width: 4714, height: 3143, color: "#262626",
    alt: "A pousse-pousse rickshaw driver cycling down a street in Antsirabe",
    location: "Antsirabe, on the RN7",
    photographer: "Sitraka",
    photographerUrl: "https://unsplash.com/@srakotoarivelo7",
    unsplashUrl: "https://unsplash.com/photos/a-man-riding-a-cart-pulled-by-a-horse-down-a-street-hotmNvhgPkg",
    evidence: "Photographer's description: \"The Cyclo Pousse Pousse in Antsirabe, Madagascar\"",
  },
  "isalo": {
    src: "https://images.unsplash.com/photo-1743096155861-b9f7457873e2",
    width: 6000, height: 4000, color: "#a68c73",
    alt: "Dry grassland and green valley floor seen from the mountains of Isalo",
    location: "Isalo National Park",
    photographer: "Guillermo Suarez",
    photographerUrl: "https://unsplash.com/@gsuarezllana",
    unsplashUrl: "https://unsplash.com/photos/dry-arid-landscape-with-patches-of-greenery-UI_KXF1e3Ko",
    evidence: "Photographer's description: \"Vistas desde las montañas del parque nacional Isalo, hacia fuera\" (views out from the mountains of Isalo National Park)",
  },
  "nosy-be": {
    src: "https://images.unsplash.com/photo-1698727854413-cd4af0ee63e7",
    width: 5184, height: 3456, color: "#d9d9d9",
    alt: "A forested headland and rocky shore on the coast of Nosy Be at dusk",
    location: "Nosy Be",
    photographer: "Hannova Beats",
    photographerUrl: "https://unsplash.com/@hannova",
    unsplashUrl: "https://unsplash.com/photos/a-group-of-people-standing-on-top-of-a-cliff-next-to-the-ocean-NuYQMxwND-E",
    evidence: "Photographer's description: \"Sur la côte de Nosy be\"",
  },
  "ifaty": {
    src: "https://images.unsplash.com/photo-1746739394640-2c69ae7851ca",
    width: 6240, height: 4160, color: "#0c260c",
    alt: "A white-footed sportive lemur clinging to a tree trunk in the spiny forest",
    location: "Reniala Reserve, Ifaty",
    photographer: "Ingeborg Korme",
    photographerUrl: "https://unsplash.com/@ingeborgkorme",
    unsplashUrl: "https://unsplash.com/photos/a-lemur-clings-to-a-tree-trunk-74b7q5NZm1U",
    evidence: "Photographer's description: \"White-footed sportive lemur, Reniala Reserve, Ifaty, Madagascar. April 2025\"",
  },
};
