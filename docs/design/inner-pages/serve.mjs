import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve(import.meta.dirname, '../../..');
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript', '.json':'application/json', '.md':'text/plain; charset=utf-8', '.webp':'image/webp', '.jpg':'image/jpeg', '.png':'image/png', '.woff2':'font/woff2', '.svg':'image/svg+xml' };
const allowed = ['docs/design/inner-pages/', 'src/assets/'];
http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).slice(1);
    const target = resolve(root, pathname);
    const relative = target.slice(root.length + 1).replaceAll(sep, '/');
    if (!target.startsWith(root + sep) || !allowed.some(prefix => relative === prefix.slice(0, -1) || relative.startsWith(prefix))) { res.writeHead(404).end('Not found'); return; }
    const file = (await stat(target)).isDirectory() ? resolve(target, 'index.html') : target;
    res.writeHead(200, {'content-type': mime[extname(file)] ?? 'application/octet-stream', 'cache-control':'no-store'});
    res.end(await readFile(file));
  } catch { res.writeHead(404).end('Not found'); }
}).listen(4391, '127.0.0.1', () => console.log('Review: http://127.0.0.1:4391/docs/design/inner-pages/'));
