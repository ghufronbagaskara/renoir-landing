import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { dirname, extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const types = { ".html": "text/html; charset=utf-8", ".mp4": "video/mp4", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".woff2": "font/woff2" };
createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    const file = resolve(root, "." + (pathname === "/" ? "/review.html" : pathname));
    if (!file.startsWith(root + sep)) return res.writeHead(403).end();
    const info = await stat(file);
    if (!info.isFile()) return res.writeHead(404).end();
    let start = 0, end = info.size - 1, status = 200;
    if (req.headers.range) {
      const match = /^bytes=(\d+)-(\d*)$/.exec(req.headers.range);
      if (!match) return res.writeHead(416, { "Content-Range": "bytes */" + info.size }).end();
      start = Number(match[1]); end = match[2] ? Math.min(Number(match[2]), end) : end;
      if (start > end) return res.writeHead(416, { "Content-Range": "bytes */" + info.size }).end();
      status = 206; res.setHeader("Content-Range", "bytes " + start + "-" + end + "/" + info.size);
    }
    res.writeHead(status, { "Content-Type": types[extname(file)] || "application/octet-stream", "Content-Length": end - start + 1, "Accept-Ranges": "bytes" });
    if (req.method === "HEAD") return res.end();
    createReadStream(file, { start, end }).on("error", () => res.destroy()).pipe(res);
  } catch (error) {
    res.writeHead(error.code === "ENOENT" ? 404 : 400).end();
  }
}).listen(4395, "127.0.0.1", () => console.log("Katalhys video review: http://127.0.0.1:4395/review.html"));
