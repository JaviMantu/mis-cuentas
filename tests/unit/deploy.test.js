// work/008-publicar-en-vercel — criterios verificables sin red.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { checkDeploy } from '../../scripts/check-deploy.mjs';

const html = readFileSync('src/index.html', 'utf8');
const config = JSON.parse(readFileSync('vercel.json', 'utf8'));

test('AC-008.1 vercel.json y el hash CSP del script inline están en regla', () => {
  assert.deepEqual(checkDeploy({ html, config }), []);
});

test('AC-008.1 detecta un script inline cambiado sin actualizar el hash', () => {
  const changed = html.replace("dataset.ui =", "dataset.ui  =");
  assert.match(checkDeploy({ html: changed, config }).join('\n'), /hash/);
});

test('AC-008.1 detecta un header de seguridad faltante', () => {
  const noNosniff = structuredClone(config);
  for (const h of noNosniff.headers) h.headers = h.headers.filter(x => x.key !== 'X-Content-Type-Options');
  assert.match(checkDeploy({ html, config: noNosniff }).join('\n'), /X-Content-Type-Options/);
});

test('AC-008.3 CI corre make check en cada PR y el smoke sigue al despliegue de Vercel', () => {
  const ci = readFileSync('.github/workflows/ci.yml', 'utf8');
  const smoke = readFileSync('.github/workflows/smoke.yml', 'utf8');
  assert.match(ci, /pull_request/);
  assert.match(ci, /make check/);
  assert.match(smoke, /deployment_status/);
  assert.match(smoke, /target_url/);
  assert.match(smoke, /make smoke/);
});

// AC-008.4 (protección de main) depende de GitHub: se verifica con scripts/check-protection.sh
// después de publicar, y la evidencia queda en work/008-publicar-en-vercel/review.md.

const gate = (command, env = {}) => spawnSync('.claude/hooks/production-gate.sh', {
  input: JSON.stringify({ tool_input: { command } }), env: { ...process.env, RELEASE_APPROVED: '0', ...env }, encoding: 'utf8',
}).status;

test('AC-008.5 el hook cierra los atajos del agente a producción', () => {
  assert.equal(gate('vercel --prod'), 2);
  assert.equal(gate('npx vercel deploy --prod --yes'), 2);
  assert.equal(gate('git push origin main'), 2);
  assert.equal(gate('git push -u origin HEAD:main'), 2);
  assert.equal(gate('git push origin feat/transferencias'), 0);
  assert.equal(gate('vercel deploy'), 0, 'un preview está permitido');
  assert.equal(gate('vercel --prod', { RELEASE_APPROVED: '1' }), 0);
});
