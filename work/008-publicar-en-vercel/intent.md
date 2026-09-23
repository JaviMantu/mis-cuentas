# intent — Publicar Mis Cuentas gratis, con previews y un gate humano

> Etapa 1 · Plan. Continúa 007 en el repo propio de la app.

- **ID**: 008
- **Origen**: originador · fase B del plan de formación
- **Estado**: aprobado

## Problema
Mis Cuentas solo corre en local (`make serve`). Nadie la puede abrir desde el celular, el estudiante no ve cómo se ve un producto consolidado con el loop y no existe un camino a producción con gates: hoy «desplegar» es un simulacro.

## Resultado esperado
- Una URL pública en **Vercel Hobby**, a costo cero.
- Cada PR produce un **preview** que CI y un smoke prueban solos.
- **Producción solo por merge a `main` aprobado por una persona.** El agente no puede saltarse ese gate.
- Headers de seguridad que protegen la app sin romperla, y ninguna petición a terceros: los datos siguen solo en el navegador.

## Usuarios y sistemas afectados
- Las personas de `PRODUCT.md`, ahora desde cualquier dispositivo.
- GitHub (repo `JaviMantu/mis-cuentas`), Vercel (proyecto `mis-cuentas`, scope Hobby) y GitHub Actions.

## Restricciones
- $0: plan Hobby de Vercel y GitHub Free. Por eso el repo es público: la protección de rama en GitHub Free solo existe para repos públicos.
- Sin build ni backend: Vercel sirve `src/` tal cual.
- Sin secretos en el repo. La integración Git de Vercel no los necesita.

## Fuera de alcance
- Dominio propio, analítica y service worker offline. Quedan como intents futuros.

## Preguntas abiertas
- Ninguna. Las acciones con credenciales (sesión de JaviMantu en `gh` e instalar la Vercel GitHub App) las hace el originador.
