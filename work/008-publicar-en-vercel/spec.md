# spec — Publicar Mis Cuentas gratis, con previews y un gate humano

- **Intent**: `work/008-publicar-en-vercel/intent.md`
- **Skills aplicadas**: `build-pattern@1`

## Requisitos
1. `vercel.json` sirve `src/` como sitio estático, con headers de seguridad y caché.
2. La CSP permite solo lo propio. El único script inline (la elección de interfaz en `<head>`) va por **hash sha256**, nunca con `'unsafe-inline'`.
3. `scripts/serve.mjs` aplica los mismos headers de `vercel.json` en local. Así los tests de aceptación corren bajo la CSP real, y una CSP que rompa la app falla antes de desplegar.
4. El smoke corre contra cualquier URL (`make smoke URL=…`).
5. CI en cada PR y el smoke del preview disparado por el despliegue de Vercel.
6. Producción solo por merge a `main` protegido, y el hook `production-gate` cierra los atajos del agente.

## Diseño
- **Headers de `/(.*)`:**
  - `Content-Security-Policy: default-src 'self'; script-src 'self' 'sha256-…'; style-src 'self'; style-src-attr 'unsafe-inline'; img-src 'self' data:; connect-src 'none'; font-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`
- **Caché:** `/` e `index.html` con `no-cache`. `style-src-attr 'unsafe-inline'` es necesario solo para los `style="--w:…"` de la barra del mes; no permite `<style>` ni scripts.
- **Scripts:**
  - `scripts/check-deploy.mjs` exporta `checkDeploy({ html, config })` → lista de errores, y la CLI sale con código 1 si hay alguno;
  - `scripts/check-protection.sh` lee la protección de `main` por `gh api`.

## Criterios de aceptación
- **AC-008.1** — Dado `vercel.json` y `index.html`, cuando corro `checkDeploy`, entonces no hay errores; y si cambio el script inline sin actualizar el hash, o quito un header, entonces lo reporta.
- **AC-008.2** — Dado una URL desplegada (o el servidor local con los headers de Vercel), cuando corro el smoke, entonces abre el onboarding, no hay errores de consola, ninguna petición sale a otro origen y la respuesta trae los headers de AC-008.1.
- **AC-008.3** — Dado el repo, cuando reviso `.github/workflows`, entonces `ci.yml` corre `make check` en `pull_request`, y `smoke.yml` corre `make smoke` sobre `deployment_status.target_url` cuando el despliegue termina bien.
- **AC-008.4** — Dado `main` en GitHub, cuando consulto su protección, entonces exige PR, exige los checks `check` y `smoke` actualizados y aplica también a administradores.
- **AC-008.6** — Dado el agente sin `RELEASE_APPROVED=1`, cuando intenta `gh pr merge`, `gh pr review --approve` o el endpoint `…/pulls/N/merge`, entonces el hook lo bloquea: el merge a producción es un acto humano.
- **AC-008.5** — Dado el agente sin `RELEASE_APPROVED=1`, cuando intenta `vercel --prod`, `vercel deploy --prod` o `git push origin main`, entonces el hook lo bloquea; y `git push origin <rama>` pasa.

## Cambio de contrato (primer PR)
- AC-008.4 pedía 1 aprobación. El agente abre los PR con la misma identidad del originador (JaviMantu), y GitHub no deja que el autor apruebe su propio PR: con la regla aplicada a administradores, el PR quedaba trabado. Decisión del originador (opción B): `main` exige PR y los checks `check` y `smoke`, sin aprobación requerida, y la separación de funciones se hace cumplir con el hook (AC-008.6).
- **Límite conocido:** la separación descansa en el hook y no en GitHub. El remedio de fondo es que el agente tenga su propia identidad (un bot de GitHub App). Queda como intent futuro.

## Preocupaciones señaladas
- La protección de rama en GitHub Free exige que el repo sea público. El originador lo acepta: la app no tiene secretos ni datos, y el estudiante necesita acceso.
- La primera vinculación con Vercel (instalar la GitHub App) es manual y humana.
