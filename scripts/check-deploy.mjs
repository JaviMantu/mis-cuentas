// work/008 · AC-008.1: vercel.json sirve src/ con headers de seguridad y la CSP autoriza el script inline por hash.
// Uso: node scripts/check-deploy.mjs  (exit 1 si hay errores)
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const inlineHashes = (html) => [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)]
  .map(m => `'sha256-${createHash('sha256').update(m[1], 'utf8').digest('base64')}'`);

const REQUIRED = {
  'X-Content-Type-Options': (v) => v === 'nosniff',
  'Referrer-Policy': (v) => v === 'strict-origin-when-cross-origin',
  'Permissions-Policy': (v) => /camera=\(\)/.test(v) && /geolocation=\(\)/.test(v),
  'Content-Security-Policy': (v) => ["default-src 'self'", "object-src 'none'", "frame-ancestors 'none'", "connect-src 'none'", "base-uri 'none'"].every(d => v.includes(d)) && !/script-src[^;]*'unsafe-inline'/.test(v),
};

export function checkDeploy({ html, config }) {
  const errors = [];
  if (config.outputDirectory !== 'src') errors.push('outputDirectory debe ser "src" (sitio estático sin build)');
  const all = config.headers?.find(h => h.source === '/(.*)')?.headers ?? [];
  const get = (k) => all.find(h => h.key.toLowerCase() === k.toLowerCase())?.value;
  for (const [key, ok] of Object.entries(REQUIRED)) {
    const v = get(key);
    if (!v) errors.push(`falta el header ${key} en /(.*)`);
    else if (!ok(v)) errors.push(`${key} no cumple la política: ${v}`);
  }
  const csp = get('Content-Security-Policy') ?? '';
  for (const h of inlineHashes(html)) if (!csp.includes(h)) errors.push(`la CSP no autoriza el script inline: falta el hash ${h} en script-src`);
  const noCache = config.headers?.some(h => h.source === '/' && h.headers.some(x => x.key === 'Cache-Control' && /no-cache/.test(x.value)));
  if (!noCache) errors.push('/ debe servirse con Cache-Control: no-cache');
  return errors;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const errors = checkDeploy({ html: readFileSync('src/index.html', 'utf8'), config: JSON.parse(readFileSync('vercel.json', 'utf8')) });
  console.log(errors.length ? errors.map(e => `FAIL  ${e}`).join('\n') : 'deploy-check PASS · vercel.json y CSP en regla');
  process.exit(errors.length ? 1 : 0);
}
