# intent — Ruptura de banda: ci_fallos_pct (2026-09-13)

> Etapa 6 → 1. Lo escribió `ops/control-band.mjs` sin intervención humana. Lo triagea el service owner.

- **ID**: 003
- **Origen**: banda de control · R2 (2 de los últimos 3 más allá de 2σ del mismo lado) · R3 (4 de los últimos 5 más allá de 1σ del mismo lado)
- **Estado**: borrador

## Problema
Porcentaje de corridas de CI en rojo por día en la rama main: el último valor es 4.4, a 1.4σ de la línea base (media 4.03, σ 0.28, 20 puntos). Últimos 5: 4.1, 4.6, 5.1, 5.3, 4.4.
<!-- Tier 2 (diagnose): Claude con herramientas read-only; escribe intent.md. -->

## Resultado esperado
La métrica vuelve dentro de ±1σ durante 5 días seguidos.

## Usuarios y sistemas afectados
- Pipeline de CI en main; equipo que hace merge.

## Restricciones
- Diagnóstico solo de lectura. Cualquier fix pasa por un PR con review y code owner.

## Fuera de alcance
- Cambiar la banda o la línea base sin decisión del service owner.

## Preguntas abiertas
- ¿Es ruido que obliga a ajustar la banda, o es una regresión real? Decide el service owner.
