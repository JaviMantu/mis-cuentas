# intent — Llevar mis cuentas personales con pocos clics

> Etapa 1 · Plan. Lo originó Javier en una sesión de brainstorming con Claude. Lo aprobó el product owner con el merge del PR #1 del ejemplo.

- **ID**: 001
- **Origen**: necesidad personal · conversación con Claude
- **Estado**: aprobado

## Problema
Llevo mis finanzas en una hoja de cálculo que abandono a las dos semanas. Registrar un gasto me cuesta demasiados pasos, y cada mes olvido los pagos recurrentes (arriendo, servicios, suscripciones), así que nunca sé cuánto tengo de verdad en cada cuenta.

## Resultado esperado
- Defino una vez mis ingresos y gastos recurrentes, y cada mes solo marco "Pagado" o "Recibido" con un clic.
- Un gasto suelto se registra en dos clics como máximo.
- Siempre veo el balance por cuenta y el total, exacto al centavo.

## Usuarios y sistemas afectados
- Persona que administra sus finanzas personales, en el celular o el computador.
- No hay sistemas externos: los datos quedan solo en el navegador.

## Restricciones
- Sin backend, sin cuentas de usuario y sin telemetría: los datos no salen del dispositivo.
- Debe funcionar en celular (≥ 375 px) y con teclado.
- Aplica la skill `money-safety`.

## Fuera de alcance
- Sincronizar entre dispositivos, conectarse con bancos, manejar varias monedas y hacer reportes.

## Preguntas abiertas
- ~~¿Las tarjetas de crédito cuentan como saldo negativo?~~ Resuelta: una tarjeta es una cuenta más y su balance puede quedar negativo.
