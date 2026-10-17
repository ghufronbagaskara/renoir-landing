import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
const files = {
  "/": ["./preview.html", "text/html; charset=utf-8"],
  "/general.woff2": ["../../../src/assets/fonts/GeneralSans-Semibold.woff2", "font/woff2"],
  "/inter.woff2": ["../../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2", "font/woff2"],
  "/mark.svg": ["../../../public/brand/katalhys-symbol-white.svg", "image/svg+xml"],
};
createServer(async (request, response) => {
  const file = files[new URL(request.url, "http://localhost").pathname];
  if (!file) { response.writeHead(404).end(); return; }
  try { const data = await readFile(new URL(file[0], import.meta.url)); response.writeHead(200, { "content-type": file[1] }).end(data); }
  catch { response.writeHead(500).end("Preview asset unavailable"); }
}).listen(4393, "127.0.0.1", () => console.log("Motion review: http://localhost:4393"));
