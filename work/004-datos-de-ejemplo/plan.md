# plan — Ver la app con datos antes de cargar los míos

- **Spec**: `work/004-datos-de-ejemplo/spec.md`
- **Riesgo**: bajo, lo aprueba el ingeniero

## Archivos que cambian
- `tests/unit/demo.test.js` — AC-004.3, en rojo
- `tests/acceptance/datos-de-ejemplo.spec.js` — AC-004.1 y AC-004.2, en rojo
- `src/domain/demo.js` — `demoState`
- `src/index.html`, `src/app.js` — botón y visibilidad

## Orden de trabajo
1. Tests en rojo, en un commit propio.
2. `demo.js` hasta verde en unit.
3. Botón en la pantalla hasta verde en aceptación.

## Riesgos
- Sobrescribir datos reales. Mitigación: el botón solo existe con el estado vacío, y AC-004.2 lo prueba.

## Cómo se prueba que funciona
- `make check P=ejemplo/mis-cuentas` en verde.
