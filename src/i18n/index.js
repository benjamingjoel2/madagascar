// Translation layer for the static build. No runtime dependency, nothing ships to the browser.
//
// English is the source language: every visible string in build.mjs and src/data is written
// in English and passed through `t()`. Each other locale has a dictionary in this folder
// (fr.tsv, de.tsv, es.tsv): one line per string, `<id><TAB><translation>`, where the id is a short
// hash of the English string. "\n" in a translation stands for a line break; lines starting with
// "#" are comments. same.tsv lists strings (mostly place names) that are identical in every language.
//
//   npm run i18n           lists every string with its id, English text and translations
//   npm run i18n -- fr     lists only the strings French is missing
//
// The build fails if a locale is missing a string, so no page ships half in English.
// When you change an English string its id changes too: add the new translation and
// delete the old id (`npm run i18n` flags unused ids).
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

function readTsv(name) {
  const out = {};
  const text = readFileSync(new URL(`./${name}.tsv`, import.meta.url), "utf8");
  for (const line of text.split("\n")) {
    if (!line.trim() || line.startsWith("#")) continue;
    const tab = line.indexOf("\t");
    if (tab < 0) throw new Error(`src/i18n/${name}.tsv: no tab in line "${line.slice(0, 40)}"`);
    out[line.slice(0, tab).trim()] = line.slice(tab + 1).replace(/\\n/g, "\n");
  }
  return out;
}
const SAME = readTsv("same");

export const LOCALES = ["en", "fr", "de", "es"];
export const DEFAULT_LOCALE = "en";
export const LOCALE_META = {
  en: { label: "EN", name: "English", htmlLang: "en-GB", og: "en_GB", intl: "en-GB" },
  fr: { label: "FR", name: "Français", htmlLang: "fr", og: "fr_FR", intl: "fr-FR" },
  de: { label: "DE", name: "Deutsch", htmlLang: "de", og: "de_DE", intl: "de-DE" },
  es: { label: "ES", name: "Español", htmlLang: "es", og: "es_ES", intl: "es-ES" },
};
export const DICTS = { fr: readTsv("fr"), de: readTsv("de"), es: readTsv("es") };

export const idOf = (s) => createHash("sha1").update(s).digest("hex").slice(0, 8);

// Every English string seen during the build, by id (used by scripts/i18n.mjs).
export const seen = new Map();
export const missing = { fr: new Map(), de: new Map(), es: new Map() };

export function makeT(locale) {
  const dict = DICTS[locale];
  return function t(en, vars) {
    if (typeof en !== "string" || en === "") return en;
    const id = idOf(en);
    seen.set(id, en);
    let out = en;
    if (dict && !(id in SAME)) {
      if (Object.prototype.hasOwnProperty.call(dict, id)) out = dict[id];
      else missing[locale].set(id, en);
    }
    if (vars) out = out.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
    return out;
  };
}
