# Product

> Deriva de `work/001-marcar-pagado/intent.md` y de la ronda de discovery del 2026-09-23 (skill `ui-quality`, flujo `impeccable teach`). Dueño: product owner.

## Register

product

## Users
Una persona que administra sus finanzas personales sin ser experta: tiene dos o tres cuentas (efectivo, banco, tarjeta) y entre tres y quince pagos que se repiten cada mes. El momento crítico ocurre de pie en la fila del supermercado o al salir de un pago, con el celular en una mano y a plena luz. Tiene cinco segundos, no cinco minutos. El segundo momento es de noche: revisa qué falta pagar antes de que termine el mes.

## Product Purpose
Mis Cuentas responde dos preguntas en un vistazo: cuánto tengo de verdad en cada cuenta y qué me falta pagar este mes. Registrar un gasto toma dos toques y marcar un recurrente, uno. Sin backend, sin registro, sin telemetría: los datos no salen del dispositivo. Hay éxito cuando la persona sigue usándola al segundo mes, algo que la hoja de cálculo nunca logró.

## Brand Personality
Cercana, precisa, ágil. Habla como una amiga que sabe de números: frases cortas, sin jerga bancaria, y nunca regaña. La marca Amaris se siente en el color, no en el discurso. El objetivo emocional es la calma: saber, sin esfuerzo, que todo está bajo control.

## Anti-references
- **Banca tradicional:** azul marino con dorado, tablas grises, menús de sucursal, sensación de trámite.
- **Hoja de cálculo:** filas densas sin jerarquía, todo con el mismo peso visual. Es el problema que describe el intent 001.

Referencias que sí: Copilot Money (pulido, íconos por categoría), Revolut (saldo protagonista, acciones rápidas), Apple Wallet (cuentas como tarjetas físicas) y YNAB / Monarch (qué falta pagar frente a lo hecho).

## Design Principles
1. **Un vistazo, una respuesta.** Cada pantalla contesta una pregunta, y la contesta antes de pedir algo.
2. **La acción frecuente cuesta un toque.** Pagar un recurrente toma un toque y un gasto, dos. Todo lo demás puede costar más.
3. **Todo se puede deshacer.** Una acción de un toque siempre ofrece revertirse.
4. **Los números son sagrados.** Son exactos al centavo, nunca se animan y siempre muestran su signo.
5. **No teclees lo que ya sabemos** (work/007). Catálogos, plantillas, el último monto y la última cuenta llenan por ti; la persona escribe solo lo que de verdad cambia, casi siempre el monto.
6. **Guiado primero, libre después.** La primera visita es un camino de 4 pasos; después, todo se puede ajustar en un solo lugar.

## Accessibility & Inclusion
WCAG 2.2 AA. Objetivos táctiles de al menos 44 × 44 px, pensando en el uso con una mano. El color nunca es la única señal: gasto e ingreso llevan signo e ícono. Foco visible y operación completa con teclado. Con `prefers-reduced-motion` no hay animaciones. El modo oscuro se activa solo, según el sistema.
