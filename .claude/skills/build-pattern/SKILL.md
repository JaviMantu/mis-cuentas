---
name: build-pattern
description: Use whenever you implement, fix or refactor code in this repo. Enforces simple-first, non-negotiable best practices, TDD for domain logic and ATDD for screens.
version: 1
---

# Patrón de construcción: simple first, TDD y ATDD

## 1. Simple first
Recorre la escalera en orden y detente en el primer peldaño que resuelva el problema:
1. ¿Hace falta de verdad? Si la necesidad es especulativa, no se construye y se dice en una línea.
2. ¿Ya existe en el repo? Reutiliza: busca en `src/domain/` del proyecto antes de escribir.
3. ¿Lo trae la plataforma? Usa HTML nativo (`<dialog>`, `<form>`, `<input type="number">`), CSS o Web APIs.
4. Si nada de lo anterior sirve, escribe el mínimo código que funcione.

No se permiten abstracciones de una sola implementación ni configuración para valores que nunca cambian. Una dependencia nueva solo entra si `plan.md` la justifica.

## 2. Buenas prácticas no negociables
- Valida toda entrada del usuario en el dominio, no solo en la pantalla.
- El dinero va en centavos enteros. Nunca `parseFloat` ni aritmética float. Ver skill `money-safety`.
- Accesibilidad básica: cada input con `<label>`, foco visible, todo operable con teclado.
- Nunca secretos en el código. El hook `no-secrets` bloquea el intento.

## 3. TDD para el dominio (`src/domain/*.js`)
1. **Rojo**: escribe el unit test en `tests/unit/` y confirma que falla con `make test`.
2. **Verde**: escribe el mínimo código que lo hace pasar.
3. **Refactor**: limpia el código con los tests en verde.

Commitea el test antes que el código, o en el mismo commit dejando el test primero en el diff.

## 4. ATDD para pantallas
1. Cada criterio `AC-NNN.n` de `spec.md` se convierte en un test Playwright en `tests/acceptance/`, con el ID dentro del título.
2. Córrelo con `make accept` y confirma que falla por la razón correcta.
3. Implementa la pantalla hasta que pase. Selecciona elementos por rol y nombre accesible (`getByRole`), nunca por clases CSS.

## 5. Bug fix
Primero escribe un test que reproduzca el bug y confírmalo en rojo. Luego arregla el **código**, nunca el test. Para eso, lanza la sesión con `FIX_MODE=1`: así `tests/` queda protegido por el hook.

## Definición de hecho
- `make check` en verde.
- Todo criterio de `spec.md` está trazado a un test.
- El diff coincide con `plan.md`.

## Proyecto activo
Un proyecto es una carpeta con `work/`, `src/` y `tests/`. La raíz del repo es un proyecto vacío, donde se trabaja en clase. `ejemplo/mis-cuentas/` es el ejemplo consolidado. Todas las rutas de esta skill son relativas al proyecto activo, y los comandos llevan `P=<carpeta>`: por ejemplo, `make check P=ejemplo/mis-cuentas`.
