# plan — Una experiencia guiada que no te hace teclear lo que ya sabemos

- **Spec**: `work/007-experiencia-guiada/spec.md`
- **Riesgo**: alto, porque cambia el esquema de datos y se refactoriza toda la UI. Mitigación: la migración queda con tests, los 40 tests de aceptación existentes siguen en verde (salvo el cambio declarado de AC-002.3), se corre `--repeat-each=3` y se verifica con `pipefail`. Aprobó el tech lead.

## Archivos que cambian
- **Dominio:** nuevos `src/domain/{schema,catalog,suggest,onboarding,dates}.js`, cada uno con su unit test (AC-007.1 a AC-007.5).
- **Estado:** `src/store.js` con load → migrate → save y subscribe.
- **UI:**
  - `src/ui/dom.js` con las utilidades de DOM;
  - `src/ui/{resumen,mes,presupuesto,ajustes,quick,onboarding}.js` con una vista por módulo;
  - `src/app.js` queda solo como arranque, pestañas, vista y atajos;
  - `src/index.html` suma la pestaña Ajustes y los contenedores de onboarding y ajustes;
  - `src/styles.css` suma stepper, chips de catálogo, lista de ajustes y la barra de 4 pestañas.
- **Tests:**
  - `tests/acceptance/guiada.spec.js`: AC-007.6 a AC-007.13;
  - `tests/acceptance/febrero.spec.js`: el cambio declarado de AC-002.3.

## Orden de trabajo (TDD / ATDD)
1. Tests en rojo (unit y aceptación) y el cambio de AC-002.3, en un commit.
2. Dominio hasta verde.
3. `store.js` y el refactor de la UI sin funciones nuevas, hasta que los 40 tests anteriores sigan en verde. Así el refactor queda aislado.
4. Funciones nuevas hasta que AC-007.6 a AC-007.13 pasen.
5. Audit visual, `review.md` y un test por cada hallazgo.

## Riesgos
- **Migración que pierda datos.** Mitigación: AC-007.1 con un estado v1 real, idempotencia y conservación de montos.
- **Refactor que rompa el comportamiento.** Mitigación: el paso 3 no agrega funciones, así que los tests existentes son la red.
- **Nombres accesibles nuevos que choquen con los existentes** (por ejemplo, un chip «Gasto» y «+ Gasto»). Mitigación: revisar cada nombre y correr la suite completa en los dos proyectos.

## Cómo se prueba que funciona
- `set -o pipefail; make check P=ejemplo/mis-cuentas` con exit 0.
- `--repeat-each=3` en la aceptación.
- Capturas del onboarding, del gasto rápido y de Ajustes en `review.md`.
