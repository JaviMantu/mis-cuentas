// Servidor estático mínimo (node:http) con los mismos headers de vercel.json (work/008):
// la aceptación corre bajo la CSP real, así una CSP que rompa la app falla antes de desplegar.
// Uso: node scripts/serve.mjs <dir> [puerto]
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { readFileSync, existsSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';

const root = resolve(process.argv[2] ?? 'src');
const port = Number(process.argv[3] ?? 4173);
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml' };
const rules = existsSync('vercel.json') ? JSON.parse(readFileSync('vercel.json', 'utf8')).headers ?? [] : [];
const matches = (source, path) => source === '/(.*)' || source === path;

createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
  const file = join(root, path.endsWith('/') ? `${path}index.html` : path);
  if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
  const headers = Object.fromEntries(rules.filter(r => matches(r.source, path)).flatMap(r => r.headers.map(h => [h.key, h.value])));
  try {
    const body = await readFile(file);
    res.writeHead(200, { ...headers, 'content-type': `${types[extname(file)] ?? 'application/octet-stream'}; charset=utf-8` }).end(body);
  } catch {
    res.writeHead(404, headers).end('no encontrado');
  }
}).listen(port, () => console.log(`sirviendo ${root} en http://localhost:${port} (headers de vercel.json: ${rules.length} reglas)`));
