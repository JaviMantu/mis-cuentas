---
name: intent-to-spec
description: Use when turning an approved work/NNN-*/intent.md into spec.md (stage 2 Design). Produces requirements, design and Given/When/Then acceptance criteria with traceable IDs.
version: 1
---

# De intent.md a spec.md

1. Lee `work/NNN-*/intent.md` del proyecto (raíz o `ejemplo/<app>/`) completo. Si queda alguna "Pregunta abierta" que bloquee, detente y pregúntala; no la inventes.
2. Copia `templates/spec.md` en la misma carpeta.
3. **Requisitos**: cada uno debe poder verificarse. Descarta adjetivos como "rápido" o "fácil" si no los acompaña un número; "≤ 2 clics" sí sirve.
4. **Diseño**: describe lo mínimo necesario, aplicando `build-pattern` §1. Si ya existe una pantalla o función que sirva, nómbrala.
5. **Criterios de aceptación**: escríbelos en formato `Dado / cuando / entonces`, uno por comportamiento observable, con ID `AC-NNN.n`. Cada criterio debe poder automatizarse con Playwright o con un unit test.
6. **Skills**: aplica toda skill cuya descripción cubra el tema (p. ej. `money-safety`) y anótala en "Skills aplicadas" con su versión.
7. **Preocupaciones**: todo conflicto con una política va a "Preocupaciones señaladas", con su dueño. No lo resuelvas en silencio.
8. Termina diciendo qué debe aprobar el product owner y si hace falta también el tech lead.
