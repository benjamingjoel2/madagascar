// Tiny static server for local preview: `npm run dev`, then open http://localhost:8080
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";

const DIST = new URL("../dist/", import.meta.url).pathname;
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".xml": "application/xml", ".txt": "text/plain" };
const PORT = process.env.PORT || 8080;

createServer(async (req, res) => {
  let path = join(DIST, decodeURIComponent(new URL(req.url, "http://x").pathname));
  try {
    if ((await stat(path)).isDirectory()) path = join(path, "index.html");
    res.writeHead(200, { "Content-Type": TYPES[extname(path)] || "application/octet-stream" });
    res.end(await readFile(path));
  } catch {
    res.writeHead(404, { "Content-Type": TYPES[".html"] });
    res.end(await readFile(join(DIST, "404.html")));
  }
}).listen(PORT, () => console.log(`Preview on http://localhost:${PORT}`));
