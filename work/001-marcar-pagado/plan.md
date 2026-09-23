# plan — Llevar mis cuentas personales con pocos clics

> Etapa 3 · Build. Salió de una sesión en plan mode, con entrevista de 4 preguntas. Se commiteó antes del código.

- **Spec**: `work/001-marcar-pagado/spec.md`
- **Riesgo**: bajo, no hay datos de terceros ni red. Lo aprobó el ingeniero.

## Archivos que cambian
- `src/domain/money.js` — `toCents`, `formatMoney`
- `src/domain/budget.js` — `validateItem`, `occurrencesFor`
- `src/domain/ledger.js` — `balances`, `markDone`, `pending`, `addMovement`
- `src/index.html`, `src/app.js`, `src/styles.css` — pantallas
- `tests/unit/*.test.js` — TDD del dominio
- `tests/acceptance/mis-cuentas.spec.js` — ATDD, AC-001.1 a AC-001.6

## Orden de trabajo (TDD / ATDD)
1. Unit tests del dominio en rojo, en un commit propio.
2. Dominio mínimo hasta verde.
3. Specs de aceptación AC-001.* en rojo, en un commit propio.
4. Pantallas hasta verde.
5. Refactor con todo en verde.

## Dependencias
- `@playwright/test` como devDependency: es la única forma razonable de automatizar criterios de pantalla en un navegador real. Justificada según `build-pattern` §1.
- El servidor estático es `scripts/serve.mjs`, escrito con `node:http`, sin dependencias.

## Riesgos
- Los formatos de monto es-CO son ambiguos (`1.200` puede leerse como mil doscientos o como uno coma dos). Mitigación: se tratan como miles cuando los grupos tienen 3 dígitos. Un unit test cubre el caso.
- `localStorage` puede no estar disponible, por ejemplo en modo privado. Mitigación: `try/catch`, y la app funciona en memoria aunque no persista.

## Cómo se prueba que funciona
- `make check P=ejemplo/mis-cuentas` en verde.
- Captura de la pantalla Resumen en 375 px.
