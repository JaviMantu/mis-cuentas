# intent — Una experiencia guiada que no te hace teclear lo que ya sabemos

> Etapa 1 · Plan. Reúne lo aprendido en 001–006 y lo lleva al producto. Lo originó Javier después de revisar la interfaz por dispositivo.

- **ID**: 007
- **Origen**: originador · revisión de 006
- **Estado**: aprobado

## Problema
La app se ve bien, pero sigue siendo un formulario para quien la abre por primera vez: tiene que adivinar que debe ir a Presupuesto, escribir «Arriendo» a mano, elegir el día y repetirlo con cada pago fijo. Los gastos no tienen categoría, así que no hay forma de reusar lo ya escrito. Y las cuentas se limitan a Efectivo, Banco y Tarjeta, cuando la gente tiene «Bancolombia», «Nequi» o «Davivienda».

## Resultado esperado
- En el primer uso, un onboarding de 4 pasos configura cuentas, ingresos y gastos fijos en menos de un minuto, y la persona solo teclea montos.
- Catálogos (tipos de ingreso, categorías de gasto y plantillas de fijos) que ahorran escribir, y que la persona puede personalizar en Ajustes.
- Cuentas con nombre libre.
- Fechas legibles («5 sep»).
- Una base de código ordenada por módulos, lista para desplegar como sitio estático (fase B: Vercel Hobby).

## Usuarios y sistemas afectados
- Las personas de `PRODUCT.md`, sobre todo en su primera visita.
- **Datos guardados:** el esquema pasa de v1 a v2. Quien ya usa la app conserva todo gracias a una migración automática.

## Restricciones
- Sin dependencias nuevas y sin build: ES modules estáticos.
- Aplican `ui-quality`, `build-pattern` y `money-safety`.
- Los criterios anteriores se conservan, salvo AC-002.3 (formato de fecha), que cambia de forma explícita en `spec.md`.

## Fuera de alcance
- Sincronizar entre dispositivos, reportes por categoría y exportar. Quedan como intents futuros.

## Lo que aprendimos (001–006) y cómo lo aplicamos aquí
1. **Un test de aceptación fija también la presentación.** AC-002.3 fijó el formato ISO de las fechas. Cambiarlo requiere declararlo en el spec, como hicimos con AC-005.2 en 006. Aquí se aplica al pasar a «28 feb».
2. **Que los tests pasen no prueba que la UI esté bien.** `display` anulaba `hidden` y ningún test falló (005). El audit visual es parte del «hecho», y cada hallazgo se vuelve un test.
3. **Hay que diseñar desde el dispositivo, no desde el ancho (006).** El onboarding y Ajustes se diseñan para las dos interfaces.
4. **Un test intermitente es un bug hasta demostrar lo contrario.** El foco del diálogo tras Esc era un bug real (006). Cerramos con `--repeat-each=3`.
5. **`cmd | tail` oculta el código de salida.** Dejó pasar un commit rojo (006). Aquí todo se verifica con `set -o pipefail`.
6. **Editar por reemplazo de texto puede caer en la función equivocada** (`save()`, 006). Con este refactor en módulos pequeños, cada edición es local, y después de cada edición estructural corren `node --check` y la suite.

## Preguntas abiertas
- Ninguna: el discovery del 2026-09-23 decidió onboarding de 4 pasos, catálogos personalizables, cuentas con nombre libre sin íconos y fechas humanas con cambio de contrato.
