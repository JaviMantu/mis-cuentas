# plan — El arriendo del 31 aparece en marzo

- **Spec**: `work/002-bug-febrero/spec.md`
- **Riesgo**: bajo, lo aprueba el ingeniero

## Archivos que cambian
- `tests/unit/budget.test.js` — AC-002.1 y AC-002.2, en rojo
- `tests/acceptance/febrero.spec.js` — AC-002.3, en rojo
- `src/domain/budget.js` — limitar el día con `Math.min(day, díasDelMes)`

## Orden de trabajo
1. Tests en rojo, en un commit propio.
2. Lanzar `FIX_MODE=1 claude`: desde aquí el hook bloquea cualquier edición a `tests/`.
3. Fix mínimo hasta verde.

## Riesgos
- Otros llamadores de `occurrencesFor` que asumían el desborde: no hay (grep). El único llamador es `app.js`.

## Cómo se prueba que funciona
- `make check P=ejemplo/mis-cuentas` en verde.
- Un eval nuevo, `evals/cases/bug-febrero.json`: cada incidente se vuelve un eval permanente.
