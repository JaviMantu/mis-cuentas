# intent — Que Mis Cuentas se sienta como una app de la App Store

> Etapa 1 · Plan. Surgió al revisar la app en el celular durante el ensayo del taller.

- **ID**: 005
- **Origen**: ensayo del taller · originador
- **Estado**: aprobado

## Problema
La app funciona, pero se ve como un formulario: pestañas de texto, filas planas sin íconos y una sola columna estirada en escritorio. En el celular, los botones quedan lejos del pulgar. No invita a volver al segundo mes, que es justo el éxito que persigue el intent 001.

## Resultado esperado
- Una app mobile-first, con la navegación al alcance del pulgar y la acción frecuente a un toque.
- En un vistazo se ve cuánto hay y qué falta pagar este mes.
- Funciona igual de bien de 320 px a escritorio, en claro y en oscuro.
- Tiene íconos que ayudan a reconocer cada pago sin leer.

## Usuarios y sistemas afectados
- Las mismas personas de `PRODUCT.md`.
- Solo cambia la pantalla: el dominio y los datos guardados son los mismos.

## Restricciones
- Los tests de aceptación existentes no se editan y deben seguir en verde: protegen el comportamiento durante el rediseño.
- Sin dependencias nuevas ni librería de íconos (`build-pattern` §1).
- Aplican `ui-quality` y `money-safety`.

## Fuera de alcance
- Categorías editables, gráficos de gasto por categoría y exportar.

## Preguntas abiertas
- Ninguna: la ronda de discovery quedó registrada en `PRODUCT.md` y `DESIGN.md`.
