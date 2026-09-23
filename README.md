# Mis Cuentas

Finanzas personales guiadas: configura tus cuentas y tus fijos en 4 pasos, marca lo pagado en un toque y ve cuánto te queda. Los datos nunca salen de tu navegador.

- **App:** https://mis-cuentas-kappa.vercel.app (Vercel Hobby · cada PR tiene su preview · producción = merge a `main`)
- **Cómo nació:** en el harness [`ai-native-sdlc`](../ai-native-sdlc) de Amaris, siguiendo el AI-Native SDLC. Allí queda el ejemplo congelado en 007; este repo es su **continuación consolidada y publicada**.

## Cómo se trabaja aquí

| Etapa | Dónde |
|---|---|
| 1 · Plan | `work/NNN-*/intent.md` (plantilla en `templates/`) |
| 2 · Design | `spec.md` y, si es interfaz, `design-brief.md` (skill `ui-quality`, `PRODUCT.md`, `DESIGN.md`) |
| 3 · Build | `plan.md` antes del código · `CLAUDE.md` · skills en `.claude/skills/` |
| 4 · Test | `make check` (unit, aceptación, evals y deploy-check) |
| 5 · Deploy | PR → preview de Vercel + smoke → merge humano a `main` = producción |
| 6 · Maintain | lo que se rompa vuelve como un `work/NNN-*/intent.md` nuevo |

## Historial de decisiones (`work/`)

| | Qué decidió |
|---|---|
| 001 | Marcar pagado en 1 clic, gasto en 2, balances al centavo |
| 002 | Bug del día 31 en febrero, arreglado con test primero |
| 003 | Una banda de control rota convertida en intent |
| 004 | Datos de ejemplo con la app vacía |
| 005 | Rediseño mobile-first derivado con la skill de diseño |
| 006 | Una interfaz por dispositivo |
| 007 | Onboarding, catálogos, esquema v2 y lo aprendido |
| 008 | Publicar en Vercel Hobby con previews, smoke y gate humano |

```bash
npm ci && npx playwright install chromium && make check
```
