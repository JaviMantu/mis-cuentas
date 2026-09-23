---
name: ui-quality
description: Use for any work on screens, components, CSS or UI copy. Derives PRODUCT.md, DESIGN.md and a design-brief.md from the intent before the spec, and enforces the impeccable design laws while building.
version: 1
---

# Calidad de interfaz: se deriva del intent y se hace cumplir al construir

Complementa `build-pattern`. Esa skill decide *cómo* se construye (simple first, TDD y ATDD); esta decide *qué* se construye cuando hay interfaz. Si la skill `impeccable` está instalada, úsala en cada paso; esta skill es su contrato mínimo dentro del repo.

## 1. Cadena de derivación (antes de escribir el spec)
1. `PRODUCT.md` en la raíz del proyecto. Lleva el register (product o brand), usuarios, propósito, personalidad, anti-referencias, principios y accesibilidad. Si no existe, entrevista con 2 o 3 preguntas por ronda. Nunca lo sintetices solo a partir del pedido.
2. `DESIGN.md`, en formato Stitch: frontmatter de tokens más seis secciones (Overview, Colors, Typography, Elevation, Components, Do's and Don'ts).
3. `work/NNN-*/design-brief.md`, a partir de `templates/design-brief.md`, equivalente a `impeccable shape`. La persona lo confirma antes de seguir.
4. `spec.md`: cada criterio AC sale del brief. Layout, estados e interacción se vuelven criterios automatizables (Playwright).
5. Después de construir, `review.md` con el resultado de `impeccable audit` y `critique`: puntaje, hallazgos y cómo se corrigieron.

## 2. Leyes que se aplican siempre
- **Color:**
  - Los neutros van tintados hacia el hue de marca, en OKLCH.
  - Nunca `#fff` ni `#000` como superficie o texto.
  - La estrategia de color se declara en el brief.
- **Tema:** claro u oscuro sale de la frase de escena, nunca por defecto.
- **Tipografía:**
  - escala con razón ≥ 1,2;
  - cifras tabulares en montos;
  - prosa de 65 a 75 caracteres por línea como máximo.
- **Motion:**
  - 150 a 250 ms, ease-out exponencial, sin rebote;
  - no se animan propiedades de layout;
  - no se animan cifras;
  - `prefers-reduced-motion` lo apaga todo.
- **Accesibilidad:**
  - WCAG 2.2 AA;
  - objetivos táctiles ≥ 44 × 44 px;
  - el color nunca es la única señal: se acompaña de signo, ícono o texto;
  - foco visible;
  - íconos con `aria-hidden` y controles con nombre accesible.
- **Componentes:** cada control tiene sus estados default, hover, focus, active, disabled, error y éxito.
- **Copy:** sin em dashes (—); cada palabra se gana su lugar.

## 3. Prohibido (el eval `ui-quality` lo verifica en `src/`)
- `border-left` o `border-right` de color mayor a 1 px como acento.
- Texto con gradiente (`background-clip: text`).
- Glassmorphism decorativo.
- La plantilla «cifra enorme + etiquetas + gradiente» de los dashboards SaaS.
- Grillas de tarjetas idénticas.
- Un modal como primera opción. Si hace falta uno, el brief justifica la excepción.
