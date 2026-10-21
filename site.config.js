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
  // WCAG AA by `npm run check` (scripts/check.mjs).
  palette: {
    laterite: "#B4441F", // laterite red earth: accents, buttons
    lateriteDark: "#8E3215", // links and small accent text on paper
    lateriteLight: "#F08A5D", // laterite on dark backgrounds
    rainforest: "#1F4A35", // rainforest green: panels, "good" cells
    rainforestLight: "#DCE6DC", // pale green tint
    night: "#0E1712", // deep forest night: dark sections, header, footer
    nightSoft: "#1A2620", // raised surfaces on dark
    bark: "#4A3427", // baobab bark brown: body text on paper
    barkLight: "#E7DCCD", // pale bark: hairlines, cards
    gold: "#E7A93E", // sunset gold: highlights (only under dark text, or as text on night)
    goldLight: "#F6E6C3", // pale gold for callouts
    cream: "#F5EFE4", // paper: page background
    mist: "#C9C4B8", // muted text on dark
    muted: "#74645A", // muted text on paper
    ink: "#1C140E", // headings on paper
    white: "#FFFFFF",
    sea: "#16241D", // sea on the driving-time map (dark)
    land: "#2C3A30", // land on the driving-time map
  },

  // Fonts come from Google Fonts. Change the families here and update `href` to match.
  fonts: {
    display: "'Instrument Serif', 'Times New Roman', serif",
    body: "'Inter Tight', system-ui, -apple-system, 'Segoe UI', sans-serif",
    mono: "'JetBrains Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace",
    href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
  },
};
