# spec — Una experiencia guiada que no te hace teclear lo que ya sabemos

- **Intent**: `work/007-experiencia-guiada/intent.md`
- **Brief**: `work/007-experiencia-guiada/design-brief.md`
- **Skills aplicadas**: `ui-quality@1`, `build-pattern@1`, `money-safety@1`

## Requisitos
1. **Esquema v2** con cuentas tipadas, catálogo (ingresos, gastos y plantillas), `categoryId` en ítems y movimientos, `onboarded` y `lastByCategory`. `migrate` convierte v1 sin perder datos y es idempotente.
2. **Onboarding** de 4 pasos solo cuando no hay nada guardado; se puede saltar y retomar.
3. **Catálogos personalizables** en Ajustes: agregar, renombrar y archivar. Los nombres son únicos por tipo y los ids estables.
4. **Cuentas con nombre libre** y un tipo que define el color. Se editan en Ajustes.
5. **Gasto rápido con categoría** opcional y «Mismo monto».
6. **Fechas** «5 sep» en toda la interfaz.
7. **Código** repartido en `store.js`, `ui/*.js` y dominio puro.

## Diseño
Según `design-brief.md` y `DESIGN.md` (componentes Stepper, Chip de catálogo y Lista de ajustes). Dominio nuevo: `schema.js`, `catalog.js`, `suggest.js`, `onboarding.js` y `dates.js`.

## Criterios de aceptación
- **AC-007.1** — Dado un estado v1 con recurrentes, cuando lo migro, entonces obtengo un v2 con categorías inferidas, tipo de cuenta, `onboarded` verdadero y los mismos montos; y migrar dos veces da lo mismo.
- **AC-007.2** — Dado el catálogo, cuando agrego un nombre repetido, entonces se rechaza; cuando renombro, entonces el id se conserva; y cuando archivo una categoría en uso, entonces desaparece de las opciones pero su historial la sigue resolviendo por id.
- **AC-007.3** — Dado un onboarding con cuentas, ingresos y plantillas elegidas, cuando construyo el estado, entonces cada ítem pasa `validateItem` y el libre al mes es igual a los ingresos menos los fijos.
- **AC-007.4** — Dado movimientos con categoría, cuando pido el último monto de «Mercado», entonces obtengo el del movimiento más reciente de esa categoría.
- **AC-007.5** — Dado «2026-09-05» o «2026-02-28», cuando llamo `formatDay`, entonces leo «5 sep» o «28 feb».
- **AC-007.6** — Dado un primer uso, cuando abro la app, entonces veo el onboarding en el paso 1 de 4; y cuando toco «Saltar», entonces veo Resumen con «Configurar en 1 minuto».
- **AC-007.7** — Dado el onboarding, cuando elijo Banco, Salario de 4.000.000, y Arriendo de 1.200.000 e Internet de 95.000 desde las plantillas, tecleando solo montos, y toco «Empezar», entonces Resumen dice «Te faltan $ 1.295.000 en 2 pagos» y Mes lista 3 recurrentes.
- **AC-007.8** — Dado el mismo onboarding, cuando llego al paso 4, entonces leo «Te quedan $ 2.705.000 libres al mes».
- **AC-007.9** — Dado un gasto previo de 25.000 en Mercado, cuando abro «+ Gasto», toco el chip Mercado, toco «Mismo monto» y Guardar, entonces se registra otro gasto de 25.000 en Mercado sin teclear.
- **AC-007.10** — Dado Ajustes, cuando agrego la categoría de gasto «Mascotas», entonces aparece como chip en el gasto rápido; cuando la renombro a «Mascota», entonces el chip cambia; y cuando la archivo, entonces el chip desaparece.
- **AC-007.11** — Dado Ajustes, cuando agrego las cuentas «Banco X» (banco) y «Nequi» (billetera digital), entonces aparecen como tarjetas en Resumen con esos nombres y como chips en el gasto rápido.
- **AC-007.12** — Dado Ajustes en escritorio, cuando elijo Móvil y luego Automático, entonces la interfaz cambia a móvil y vuelve a la del dispositivo, sin quedar forzada.
- **AC-007.13** — Dado datos de ejemplo, cuando veo Mes y Próximos pagos, entonces las fechas se leen «5 sep» y no «2026-09-05».

- **AC-007.14** — Dado el onboarding, cuando toco un chip del mismo paso, entonces el paso no vuelve a animarse (sin parpadeo); solo se anima al cambiar de paso. (Salió del audit visual.)

## Cambio de contrato
- AC-002.3 pasa a esperar «28 feb» en lugar de «2026-02-28», y sigue verificando que no aparezca marzo. Su test se actualiza en el mismo commit que este spec (lección 1 del intent).

## Preocupaciones señaladas
- Los tests anteriores siembran estados v1 sin `version`. Se resolvió así: `migrate` los trata como usuarios existentes (`onboarded: true`), de modo que no ven el onboarding y conservan su comportamiento.
