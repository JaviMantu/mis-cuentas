// Evals del harness. Cada caso = prompt real + checks de aceptación deterministas.
//   node evals/run.mjs --root <proyecto>          corre los checks sobre el estado actual (CI, cada cambio)
//   node evals/run.mjs --root <proyecto> --agent  además ejecuta cada prompt con `claude -p` en un worktree
// Corren en CI al cambiar CLAUDE.md, skills, hooks o evals. Cada incidente nuevo = un caso nuevo.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';

const args = process.argv.slice(2);
const root = args[args.indexOf('--root') + 1] ?? '.';
const agent = args.includes('--agent');

const walk = (dir) => !existsSync(dir) ? [] : readdirSync(dir).flatMap(f => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? (f === 'node_modules' ? [] : walk(p)) : [p];
});
const workFiles = (base, name) => walk(join(base, 'work')).filter(p => p.endsWith(`/${name}`));

const checks = {
  // todo work/*/<file> tiene las secciones pedidas
  sections: (base, c) => {
    const files = workFiles(base, c.file);
    const bad = files.filter(f => c.sections.some(s => !readFileSync(f, 'utf8').includes(`## ${s}`)));
    return { ok: !bad.length, detail: files.length ? (bad.length ? `faltan secciones en ${bad.map(f => relative(base, f))}` : `${files.length} ${c.file}`) : `sin ${c.file} aún` };
  },
  // todo spec.md con criterios en formato Dado/cuando/entonces e ID
  criteria: (base) => {
    const bad = workFiles(base, 'spec.md').filter(f => {
      const acs = readFileSync(f, 'utf8').split('\n').filter(l => /\*\*AC-\d{3}\.\d+\*\*/.test(l));
      return !acs.length || acs.some(l => !/Dado .*cuando .*entonces/i.test(l));
    });
    return { ok: !bad.length, detail: bad.length ? `criterios mal formados en ${bad.map(f => relative(base, f))}` : 'criterios Dado/cuando/entonces' };
  },
  // todo AC-* de un spec aparece en el título de algún test
  traceability: (base) => {
    const ids = workFiles(base, 'spec.md').flatMap(f => [...readFileSync(f, 'utf8').matchAll(/\*\*(AC-\d{3}\.\d+)\*\*/g)].map(m => m[1]));
    const tests = walk(join(base, 'tests')).map(f => readFileSync(f, 'utf8')).join('\n');
    const missing = ids.filter(id => !tests.includes(id));
    return { ok: !missing.length, detail: missing.length ? `sin test: ${missing.join(', ')}` : `${ids.length} criterios trazados` };
  },
  // patrón prohibido dentro de un directorio del proyecto
  forbid: (base, c) => {
    const hits = walk(join(base, c.dir)).filter(f => new RegExp(c.pattern).test(readFileSync(f, 'utf8')));
    return { ok: !hits.length, detail: hits.length ? `${c.pattern} en ${hits.map(f => relative(base, f))}` : `sin ${c.pattern}` };
  },
  // archivo del repo con un máximo de líneas
  maxLines: (_, c) => {
    const n = readFileSync(c.file, 'utf8').split('\n').length;
    return { ok: n <= c.max, detail: `${c.file}: ${n}/${c.max} líneas` };
  },
  // un hook con un stdin dado debe salir con el código esperado
  hook: (_, c) => {
    const r = spawnSync(c.hook, { input: JSON.stringify(c.stdin), env: { ...process.env, FIX_MODE: '0', RELEASE_APPROVED: '0', ...c.env }, encoding: 'utf8' });
    return { ok: r.status === c.exit, detail: `${c.hook.split('/').pop()} → exit ${r.status} (esperado ${c.exit})` };
  },
  // comando arbitrario; solo si existe el archivo `when` en el proyecto
  cmd: (base, c) => {
    if (c.when && !existsSync(join(base, c.when))) return { ok: true, detail: `n/a (${c.when} no existe en ${base})` };
    const r = spawnSync('sh', ['-c', c.run], { cwd: base, encoding: 'utf8' });
    return { ok: r.status === 0, detail: r.status === 0 ? (c.label ?? c.run) : (r.stderr || r.stdout).trim().split('\n').pop() };
  },
};

function runAgent(prompt) {
  const dir = join(tmpdir(), `eval-${Date.now()}`);
  spawnSync('git', ['worktree', 'add', '--detach', dir], { stdio: 'ignore' });
  const r = spawnSync('claude', ['-p', prompt, '--permission-mode', 'acceptEdits'], { cwd: dir, encoding: 'utf8', timeout: 600000 });
  return { dir, ok: r.status === 0, cleanup: () => spawnSync('git', ['worktree', 'remove', '--force', dir]) };
}

let failed = 0;
for (const file of readdirSync('evals/cases').filter(f => f.endsWith('.json')).sort()) {
  const c = JSON.parse(readFileSync(join('evals/cases', file), 'utf8'));
  let base = root, run;
  if (agent && c.prompt) { run = runAgent(c.prompt); base = join(run.dir, root); }
  const results = c.checks.map(k => checks[k.type](base, k));
  run?.cleanup();
  const ok = results.every(r => r.ok) && (!run || run.ok);
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${c.id.padEnd(16)} [${c.stage}] ${results.map(r => r.detail).join(' · ')}`);
}
console.log(`\n${failed ? `${failed} eval(s) fallaron` : 'evals OK'} · root=${root}${agent ? ' · modo agente' : ''}`);
process.exit(failed ? 1 : 0);
