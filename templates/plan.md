# plan — <título corto>

> Etapa 3 · Build. Sale de una sesión en plan mode donde el agente entrevista al ingeniero. Se commitea ANTES de tocar el código.
> Si la implementación se desvía, el plan se actualiza en el mismo commit.

- **Spec**: `work/NNN-<slug>/spec.md`
- **Riesgo**: bajo, lo aprueba el ingeniero | alto, lo aprueba el tech lead

## Archivos que cambian
- `ruta` — por qué

## Orden de trabajo (TDD / ATDD)
1. Test de aceptación en rojo para AC-NNN.1
2. Unit test en rojo para la regla de dominio
3. Código mínimo hasta verde
4. Refactor con los tests en verde

## Riesgos
- <riesgo → mitigación>

## Cómo se prueba que funciona
- `make check` en verde
- <evidencia adicional: captura, métrica>
