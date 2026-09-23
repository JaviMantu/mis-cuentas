# spec — Que Mis Cuentas se sienta como una app de la App Store

> Etapa 2 · Design. Los criterios salen de `design-brief.md`. Lo aprobó el product owner.

- **Intent**: `work/005-rediseno-mobile/intent.md`
- **Brief**: `work/005-rediseno-mobile/design-brief.md`
- **Skills aplicadas**: `ui-quality@1`, `build-pattern@1`, `money-safety@1`

## Requisitos
1. El layout es mobile-first, con barra inferior bajo 900 px y riel lateral desde 900 px.
2. En Resumen van el encabezado con el saldo, la frase de lo que falta, la barra segmentada, el carrusel de cuentas y los próximos pagos (máximo 3) con acción en línea.
3. Mes lista primero los pendientes y después los hechos. Cada acción de un toque muestra un toast con «Deshacer».
4. Los íconos por palabra clave (`iconFor`) y por cuenta vienen de un sprite propio, sin librería.
5. El modo oscuro es automático y el contraste cumple AA.
6. Se conservan los nombres accesibles y el comportamiento de los criterios AC-001, AC-002 y AC-004.

## Diseño
Según `design-brief.md` y `DESIGN.md`. El dominio suma `unmarkDone` (ledger) e `iconFor` (icons).

## Criterios de aceptación
- **AC-005.1** — Dado un ancho de 320, 375, 768 o 1280 px con datos de ejemplo, cuando recorro las tres pestañas y abro el movimiento rápido, entonces nunca aparece scroll horizontal.
- AC-005.2 (reemplazado por AC-006.1 y AC-006.2 en `work/006-ui-por-dispositivo`): la navegación ya no depende del ancho sino del dispositivo.
- **AC-005.3** — Dado un celular de 375 px con datos de ejemplo, cuando mido cada botón y campo visible en todas las pestañas, entonces todos miden al menos 44 × 44 px.
- **AC-005.4** — Dado que marqué «Arriendo» como pagado, cuando toco «Deshacer» en el aviso, entonces vuelve a estar pendiente y el balance de Banco se restaura.
- **AC-005.5** — Dado el esquema oscuro del sistema, cuando abro la app, entonces el fondo es oscuro y el saldo total tiene contraste de al menos 4,5:1 con su fondo.
- **AC-005.6** — Dado los datos de ejemplo, cuando veo Resumen, entonces leo «Te faltan $ 1.295.000 en 2 pagos» y, al marcar Arriendo en Próximos pagos, leo «Te faltan $ 95.000 en 1 pago» sin salir de Resumen.
- **AC-005.7** — Dado un movimiento marcado desde una ocurrencia, cuando llamo `unmarkDone` con su clave, entonces solo ese movimiento desaparece, y repetir la llamada no cambia nada.
- **AC-005.8** — Dado un nombre como «Arriendo», «Internet hogar» o «Sueldo», cuando llamo `iconFor`, entonces devuelve casa, wifi o maletín, y «etiqueta» para cualquier otro.
- **AC-005.9** — Dado que cargué los datos de ejemplo, cuando veo Resumen y Mes, entonces no se muestra ningún estado vacío ni un aviso sin texto. (Salió del audit: `display` en `.empty` y `.toast` anulaba el atributo `hidden`.)

## Preocupaciones señaladas
- «Próximos pagos» en Resumen repite el botón «Marcar X como pagado» de Mes. Se resolvió con el dueño de los tests: los paneles inactivos quedan `hidden`, así que nunca hay dos botones visibles con el mismo nombre.
