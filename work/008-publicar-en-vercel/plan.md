# plan — Publicar Mis Cuentas gratis, con previews y un gate humano

- **Spec**: `work/008-publicar-en-vercel/spec.md`
- **Riesgo**: medio. Es la primera vez que algo sale a internet. Mitigación: la CSP se prueba en local antes del primer deploy y producción exige un merge humano. Aprobó el tech lead.

## Archivos que cambian
- `tests/unit/deploy.test.js`: AC-008.1, AC-008.3 y AC-008.5, en rojo.
- `tests/smoke/smoke.spec.js` y `tests/smoke/playwright.smoke.config.mjs`: AC-008.2, en rojo.
- `vercel.json`, `scripts/check-deploy.mjs` y `scripts/check-protection.sh`: AC-008.4.
- `scripts/serve.mjs`: aplica los headers de `vercel.json`.
- `.claude/hooks/production-gate.sh`: bloquea `vercel --prod` y el push a `main`.
- `.github/workflows/ci.yml` y `.github/workflows/smoke.yml`.
- `evals/cases/10-deploy.json`.

## Orden de trabajo (TDD / ATDD)
1. Tests en rojo, en un commit.
2. `check-deploy` y `vercel.json` hasta verde.
3. `serve.mjs` con headers: la suite de aceptación completa sigue en verde bajo la CSP.
4. Smoke local en verde contra `make serve`.
5. Hook y workflows. Luego la publicación (acciones humanas), el preview, el smoke del preview, la protección y el merge.

## Riesgos
- **Una CSP demasiado estricta que rompa la app en producción.** Mitigación: el paso 3 corre toda la aceptación con la misma CSP.
- **Hash desactualizado tras editar el script inline.** Mitigación: `make check` incluye `deploy-check`.
- **Un preview que exponga datos.** Mitigación: no hay datos del servidor; todo vive en el `localStorage` de cada visitante.

## Cómo se prueba que funciona
- `set -o pipefail; make check` con exit 0.
- `make smoke URL=<preview>` y `make smoke URL=<producción>` en verde.
- `scripts/check-protection.sh` en PASS.
