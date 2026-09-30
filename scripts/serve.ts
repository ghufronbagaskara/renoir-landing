// Serves dist/client like Cloudflare's asset layer (directory index, 404.html, compression, immutable
// /_astro/ caching) so local Lighthouse runs are representative.
// /api/* is not available here (it needs the Worker runtime).
//   bun run build && bun run serve
const root = "dist/client";
const port = Number(process.env.PORT ?? 4322);

async function send(req: Request, file: ReturnType<typeof Bun.file>, status = 200) {
  const headers = new Headers({ "content-type": file.type });
  if (new URL(req.url).pathname.startsWith("/_astro/")) headers.set("cache-control", "public, max-age=31536000, immutable");
  if (/text|javascript|json|svg|css/.test(file.type) && req.headers.get("accept-encoding")?.includes("gzip")) {
    headers.set("content-encoding", "gzip");
    return new Response(Bun.gzipSync(new Uint8Array(await file.arrayBuffer())), { status, headers });
  }
  return new Response(file, { status, headers });
}

Bun.serve({
  port,
  async fetch(req) {
    const { pathname } = new URL(req.url);
    const path = decodeURIComponent(pathname);
    for (const candidate of [path, `${path}/index.html`.replace("//", "/")]) {
      const file = Bun.file(root + candidate);
      if (!candidate.endsWith("/") && (await file.exists())) return send(req, file);
    }
    if (!path.endsWith("/") && (await Bun.file(`${root}${path}/index.html`).exists())) {
      return Response.redirect(`${path}/`, 308);
    }
    return send(req, Bun.file(`${root}/404.html`), 404);
  },
});
console.log(`serving ${root} on http://localhost:${port}`);
