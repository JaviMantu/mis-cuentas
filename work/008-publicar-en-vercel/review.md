# review — Publicar Mis Cuentas gratis, con previews y un gate humano

> Etapa 5 · Deploy. Cierre de work/008 el 2026-09-23. Revisó el originador.

## Resultado
- **Producción:** https://mis-cuentas-kappa.vercel.app (Vercel Hobby, scope `poc-javi`, costo $0).
- **Repo:** https://github.com/JaviMantu/mis-cuentas (público).
- **Primer paso a producción:** PR #1, squash `e1ad519`, con `check`, `smoke` y `Vercel` en verde.

## Criterios

| Criterio | Evidencia |
|---|---|
| AC-008.1 CSP por hash y headers | `make deploy-check` en PASS. `curl -I` a producción devuelve `nosniff`, `strict-origin-when-cross-origin`, `no-cache`, y una CSP con `sha256-Y8XK…` y sin `'unsafe-inline'` en `script-src` |
| AC-008.2 smoke | `make smoke URL=https://mis-cuentas-kappa.vercel.app` pasa 2/2 (móvil y escritorio): onboarding visible, 0 errores de consola, 0 peticiones a otros orígenes |
| AC-008.3 CI y smoke por despliegue | PR #1: `check` corre `make check`, y `smoke` corrió sobre el preview y después sobre producción (`deployment_status`, run 35890987103) |
| AC-008.4 protección de `main` | `scripts/check-protection.sh` en PASS: exige PR, checks `check` y `smoke` con la rama al día, `enforce_admins`, y no permite force-push ni borrar la rama |
| AC-008.5 / AC-008.6 hook | `tests/unit/deploy.test.js`: `vercel --prod`, `git push … main`, `gh pr merge`, `gh pr review --approve` y `…/pulls/N/merge` quedan bloqueados sin `RELEASE_APPROVED=1` |

## Lo que pasó y lo que aprendimos
1. **El smoke no se dejó engañar.** El primer preview respondía 302 al login de Vercel (Vercel Authentication), y el test leyó la CSP de Vercel en lugar de la nuestra. Ahora el smoke detecta el redirect y explica qué hacer.
2. **La protección por defecto cubría también producción** (`ssoProtection: all_except_custom_domains`), así que la app no habría sido pública. Decisión del originador: todo público (`ssoProtection: null`), cambiado por la API de Vercel con su sesión. No expone nada nuevo: el código ya es público y la app no guarda datos en el servidor.
3. **Una sola identidad no puede auto-aprobarse.** AC-008.4 pedía 1 aprobación, pero agente y originador usan la misma cuenta (JaviMantu). Opción B: sin aprobación requerida, y el hook impide que el agente apruebe o haga merge (AC-008.6). Cambio de contrato declarado en `spec.md`.
4. **El merge del PR #1 lo ejecutó el agente con autorización explícita del originador en el chat**, equivalente a `RELEASE_APPROVED=1`. Queda registrado aquí porque es justo el gate que el framework hace visible.
5. **Push directo a `main`:** hubo uno solo, el inicial, que creó la rama antes de que existiera la protección. Después de protegerla no se intentó un push real a `main`: si la protección estuviera mal, ese push publicaría sin revisión. La evidencia es la lectura de la API.
6. **El dominio `mis-cuentas.vercel.app` pertenece a otra persona.** Vercel asignó `mis-cuentas-kappa.vercel.app`.
7. **Secretos:** el bypass de automatización no hizo falta. `vercel link` creó un `.env.local` con un token OIDC de vida corta; se borró y `.env*` quedó ignorado.

## Pendientes (intents futuros)
- **Identidad propia para el agente** (bot de GitHub App): permitiría volver a exigir 1 aprobación humana en GitHub.
- **Dominio propio**, si se quiere una URL sin sufijo.
