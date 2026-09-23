# intent — Una interfaz para cada dispositivo

> Etapa 1 · Plan. Lo pidió el originador después de ver el rediseño 005.

- **ID**: 006
- **Origen**: originador · revisión del rediseño
- **Estado**: aprobado

## Problema
El rediseño 005 es responsive: la misma interfaz se estira según el ancho. En un computador con mouse se siente como una app de celular agrandada, sin atajos, con la lista del mes como tarjetas y el gasto rápido subiendo desde abajo. Y en una tablet táctil apaisada aparece el riel lateral pensado para mouse.

## Resultado esperado
- Dos interfaces con el mismo dominio y los mismos datos. La app elige sola según el dispositivo.
- **Móvil (táctil):** la de 005, pensada para el pulgar.
- **Escritorio (mouse y pantalla de 900 px o más):**
  - panel de control con últimos movimientos;
  - el mes como tabla con columnas;
  - el gasto rápido como panel lateral;
  - atajos de teclado.
- La persona puede cambiar de vista y la app recuerda su elección.

## Usuarios y sistemas afectados
- Las personas de `PRODUCT.md`: en el celular durante el día y en el computador en la revisión de fin de mes.

## Restricciones
- Un solo HTML y un solo dominio: cambia la presentación, no la lógica.
- Sin dependencias nuevas. Aplican `ui-quality` y `build-pattern`.
- AC-005.2 suponía que el ancho decide la navegación. Este intent cambia ese contrato de forma explícita (ver `spec.md`).

## Fuera de alcance
- Una tercera interfaz para tablet. La tablet táctil usa la UI móvil.

## Preguntas abiertas
- Ninguna.
