// ─────────────────────────────────────────────────────────────
// SITE CONFIG: the only file you need to edit to re-brand.
// Brand name, contact details and palette all live here.
// Run `npm run build` after editing (Vercel does this for you).
// ─────────────────────────────────────────────────────────────

export default {
  brand: {
    name: "Baobab Road",
    shortName: "Baobab Road",
    tagline: "Slow roads. Wildlife found nowhere else.",
    // One sentence, used in <meta name="description"> and the footer.
    description:
      "Honest, expert-led Madagascar journeys for nature lovers who accept slow roads in return for wildlife found nowhere else on Earth.",
    // Explains the name. Shown on the About page.
    nameStory:
      "The name comes from the Avenue of the Baobabs near Morondava, and from the long overland drives that Madagascar is made for.",
  },

  // Placeholder contact details. Replace them before launch (see FACTS-TO-VERIFY.md).
  contact: {
    email: "hello@example.com",
    phone: "+00 0000 000000",
    whatsapp: "", // e.g. "+261340000000". Leave empty to hide.
    address: "Postal address to be confirmed",
    officeHours: "Monday to Friday, 09:00–17:00 (East Africa Time, UTC+3)",
  },

  // Enquiry form. If `formEndpoint` is empty, the form opens the visitor's
  // email app with the message already written (works with no backend).
  // To collect submissions online, paste a form-service URL here
  // (for example a Formspree or Basin endpoint) that accepts a POST.
  enquiry: {
    formEndpoint: "",
  },

  // Production URL, used for canonical links and the sitemap. No trailing slash.
  siteUrl: "https://baobab-road.vercel.app",

  // Palette. Every text/background pair used on the site is checked against
  // WCAG AA by `npm run check` (scripts/check-contrast.mjs).
  palette: {
    laterite: "#A3391C", // laterite red earth: buttons, links, accents
    lateriteDark: "#7A2A14", // hover state, small text on cream
    rainforest: "#1E4A33", // rainforest green: header, footer, panels
    rainforestLight: "#DCE8DF", // pale green tint for chips and table rows
    bark: "#4A3427", // baobab bark brown: body text
    barkLight: "#EADFD3", // pale bark tint for cards
    gold: "#E2A43A", // sunset gold: highlights (only ever under dark text)
    goldLight: "#F8E7C4", // pale gold for callouts
    cream: "#FBF6EE", // page background
    ink: "#241912", // headings and strongest text
    white: "#FFFFFF",
    sea: "#CFE3E6", // sea colour on the driving-time map
  },

  // Fonts come from Google Fonts. Swap the families here and update `href` to match.
  fonts: {
    heading: "'Fraunces', Georgia, 'Times New Roman', serif",
    body: "'Source Sans 3', system-ui, -apple-system, 'Segoe UI', sans-serif",
    href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Source+Sans+3:wght@400;600;700&display=swap",
  },
};
