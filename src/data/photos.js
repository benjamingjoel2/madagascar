// Unsplash photos. A photo is only listed here when its location matches the
// place it is used for: the photographer's own location tag or description
// names the place. `evidence` records that check. Keys are region slugs
// (plus "hero"). Regions without a verified photo show a labelled placeholder.
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
};
