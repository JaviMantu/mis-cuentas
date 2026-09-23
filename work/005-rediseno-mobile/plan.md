# plan — Que Mis Cuentas se sienta como una app de la App Store

- **Spec**: `work/005-rediseno-mobile/spec.md`
- **Riesgo**: medio, porque la UI se reescribe completa. Mitigación: los 9 specs de aceptación existentes quedan intactos. Aprobó el tech lead.

## Archivos que cambian
- `tests/unit/ledger.test.js` y `tests/unit/icons.test.js`: AC-005.7 y AC-005.8, en rojo.
- `tests/acceptance/rediseno.spec.js`: AC-005.1 a AC-005.6, en rojo.
- `src/domain/ledger.js`: `unmarkDone`.
- `src/domain/icons.js`: `iconFor`, `accountIcon`.
- `src/index.html`: estructura nueva, sprite de íconos y sheet.
- `src/styles.css`: tokens de `DESIGN.md`, mobile-first, oscuro y reduced-motion.
- `src/app.js`: render nuevo, toast con deshacer y próximos pagos.

## Orden de trabajo (TDD / ATDD)
1. Tests nuevos en rojo, en un commit.
2. `unmarkDone` e `iconFor` hasta verde en unit.
3. UI hasta que queden en verde los tests nuevos y los 18 existentes, sin editar los existentes.
4. `impeccable audit` y `critique`: corregir y registrar en `review.md`.

## Riesgos
- **Nombres accesibles duplicados** entre Resumen y Mes. Mitigación: los paneles inactivos van `hidden`, y AC-001.5 lo sigue probando.
- **Carrusel horizontal que produzca scroll de página.** Mitigación: `overflow-x: auto` solo dentro del carrusel, más `min-width: 0` en los contenedores. AC-005.1 lo mide.
- **Contraste del saldo en oscuro.** Mitigación: el encabezado tiene un `background-color` sólido debajo del gradiente, y AC-005.5 lo mide.

## Cómo se prueba que funciona
- `make check P=ejemplo/mis-cuentas` en verde.
- `git diff --stat` sin cambios en `mis-cuentas.spec.js`, `febrero.spec.js` y `datos-de-ejemplo.spec.js`.
- Capturas a 375 px (claro y oscuro), 768 px y 1280 px en `review.md`.
