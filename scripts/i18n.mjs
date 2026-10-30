// `npm run i18n [-- <locale>]`: translation report.
// Without a locale: every string (id, English, fr, de, es) plus ids no longer used.
// With a locale: only the strings that locale is missing, ready to translate.
import { execFileSync } from "node:child_process";
import { readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DICTS } from "../src/i18n/index.js";

const out = join(tmpdir(), `i18n-${process.pid}.json`);
execFileSync(process.execPath, [new URL("../build.mjs", import.meta.url).pathname], { env: { ...process.env, I18N_DUMP: out, I18N_ALLOW_MISSING: "1" }, stdio: "ignore" });
const { seen, missing } = JSON.parse(readFileSync(out, "utf8"));
rmSync(out);
const loc = process.argv[2];
if (loc) {
  const m = missing[loc] || {};
  for (const [id, en] of Object.entries(m)) console.log(`${id}\t${en}`);
  console.error(`${Object.keys(m).length} missing in ${loc}`);
} else {
  for (const [id, en] of Object.entries(seen)) console.log([id, en, ...Object.keys(DICTS).map((l) => DICTS[l][id] ?? "—")].join("\t"));
  for (const [l, d] of Object.entries(DICTS)) {
    const unused = Object.keys(d).filter((id) => !(id in seen));
    if (unused.length) console.error(`${l}: unused ids ${unused.join(", ")}`);
  }
}
