---
name: Mis Cuentas
description: Tus cuentas en un vistazo, tus pagos en un toque.
colors:
  amaris-purple: "#6600AE"
  purple-deep: "oklch(0.30 0.17 305)"
  purple-soft: "oklch(0.94 0.035 305)"
  lilac: "#D9B3F4"
  spend-rose: "#DA1C57"
  income-green: "oklch(0.52 0.13 160)"
  signal-gold: "#FFC709"
  amber: "#FAA61A"
  paper: "oklch(0.985 0.005 305)"
  surface: "oklch(0.995 0.003 305)"
  surface-sunk: "oklch(0.955 0.012 305)"
  ink: "oklch(0.21 0.035 305)"
  ink-muted: "oklch(0.47 0.03 305)"
  hairline: "oklch(0.90 0.015 305)"
  night-paper: "oklch(0.17 0.025 305)"
  night-surface: "oklch(0.22 0.03 305)"
  night-ink: "oklch(0.96 0.01 305)"
typography:
  balance:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
    fontFeature: "tnum"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: "1.44rem"
    fontWeight: 700
    lineHeight: 1.2
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 650
    lineHeight: 1.25
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: "0.833rem"
    fontWeight: 600
    lineHeight: 1.3
rounded:
  sm: "10px"
  md: "16px"
  lg: "24px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.amaris-purple}"
    textColor: "{colors.surface}"
    rounded: "{rounded.pill}"
    height: "48px"
    padding: "0 20px"
  button-quiet:
    backgroundColor: "{colors.purple-soft}"
    textColor: "{colors.amaris-purple}"
    rounded: "{rounded.pill}"
    height: "44px"
  fab-spend:
    backgroundColor: "{colors.spend-rose}"
    textColor: "{colors.surface}"
    rounded: "{rounded.pill}"
    height: "56px"
  account-card:
    rounded: "{rounded.lg}"
    padding: "18px"
    width: "220px"
    height: "136px"
  row:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "12px 14px"
  sheet:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "20px"
---

# Design System: Mis Cuentas

## 1. Overview

**Creative North Star: "La billetera de bolsillo"**

Mis Cuentas se comporta como una billetera física bien ordenada: las cuentas son tarjetas que se pueden tocar y deslizar, el saldo está arriba y a la vista, y lo que falta pagar aparece como una lista corta. El púrpura Amaris ocupa el encabezado y las acciones primarias, con compromiso, sin cubrir toda la pantalla. El resto es papel tintado de lila y tinta profunda, para leer bien a plena luz en la fila del supermercado.

La densidad es de app móvil, no de hoja de cálculo: una idea por bloque, aire entre secciones y cifras grandes con números tabulares. El sistema rechaza el azul marino con dorado de la banca tradicional y la grilla plana de la hoja de cálculo.

**Key Characteristics:**
- El encabezado púrpura lleva el saldo y una frase que dice qué falta.
- Las cuentas son tarjetas con gradiente propio en un carrusel con scroll-snap.
- La navegación va abajo con una mano; en escritorio se vuelve un riel lateral.
- Todo lo que se hace en un toque se puede deshacer.

## 2. Colors: La paleta de bolsillo

Estrategia **Committed**: el púrpura Amaris cubre entre el 30 y el 40 % de la pantalla en Resumen (encabezado y acciones); el resto son neutros tintados hacia el hue 305.

### Primary
- **Púrpura Amaris** (#6600AE): encabezado, botón primario, pestaña activa y foco de marca. Es el hex oficial, sin recolorear.
- **Púrpura profundo** (oklch(0.30 0.17 305)): final del gradiente del encabezado y texto de marca sobre fondos lilas.

### Secondary
- **Rosa gasto** (#DA1C57): el botón flotante «+ Gasto» y los montos de gasto. Siempre va con el signo menos.
- **Verde ingreso** (oklch(0.52 0.13 160)): montos de ingreso, el check de pagado y el toast de éxito. Siempre va con el signo más o con un ícono.

### Tertiary
- **Oro señal** (#FFC709): solo el anillo de foco y el segmento pendiente de la barra del mes.
- **Ámbar** (#FAA61A) y **Lila** (#D9B3F4): gradientes de las tarjetas de cuenta (efectivo y tarjeta).

### Neutral
- **Papel** (oklch(0.985 0.005 305)): fondo de la app en claro.
- **Superficie** (oklch(0.995 0.003 305)): filas, sheet y formularios.
- **Superficie hundida** (oklch(0.955 0.012 305)): campos y segmentados.
- **Tinta** (oklch(0.21 0.035 305)) y **tinta tenue** (oklch(0.47 0.03 305)): texto principal y secundario.
- **Filete** (oklch(0.90 0.015 305)): divisores.
- **Noche** (papel oklch(0.17 0.025 305), superficie oklch(0.22 0.03 305), tinta oklch(0.96 0.01 305)): modo oscuro automático.

### Named Rules
**La regla del signo.** Ningún monto depende del color: el gasto lleva «-» y el ingreso «+», o un ícono.
**La regla de la tinta tintada.** No existe `#fff` ni `#000` en la app. Hasta el blanco tiene un toque de lila.

## 3. Typography

**Display Font:** la pila del sistema (-apple-system, Segoe UI, system-ui)
**Body Font:** la misma pila
**Label/Mono Font:** la misma, con `font-variant-numeric: tabular-nums` para cifras

**Character:** Una sola familia, la del teléfono, para que la app se sienta nativa. La jerarquía sale del tamaño y el peso, con una razón de 1,2.

### Hierarchy
- **Balance** (700, 2.5rem, 1.05, tabular): el saldo total del encabezado. En escritorio sube a 3rem.
- **Title** (700, 1.44rem, 1.2): el título de la pantalla.
- **Headline** (650, 1.2rem, 1.25): los títulos de sección (Cuentas, Próximos pagos).
- **Body** (400, 1rem, 1.45): filas y formularios. La prosa se limita a 65 caracteres por línea.
- **Label** (600, 0.833rem, 1.3): metadatos (fecha · cuenta), etiquetas de campo y la barra de pestañas.

### Named Rules
**La regla de los números sagrados.** Las cifras usan números tabulares y nunca se animan: se muestran en su valor final.

## 4. Elevation

Es un sistema tonal con poca sombra. La profundidad sale del contraste entre el papel y la superficie. Solo tres piezas flotan: las tarjetas de cuenta, el botón flotante y el sheet.

### Shadow Vocabulary
- **Tarjeta** (`box-shadow: 0 10px 24px -12px oklch(0.30 0.17 305 / .45)`): tarjetas de cuenta, como un objeto sobre la mesa.
- **Flotante** (`box-shadow: 0 8px 20px -6px oklch(0.55 0.2 10 / .55)`): el botón «+ Gasto».
- **Sheet** (`box-shadow: 0 -12px 40px -12px oklch(0.21 0.035 305 / .35)`): el sheet de movimiento rápido.

### Named Rules
**La regla plana en reposo.** Filas, formularios y secciones no llevan sombra. Separan por tono y por espacio.

## 5. Components

### Buttons
- **Shape:** píldora (999px), de 44 a 56 px de alto.
- **Primary:** púrpura Amaris con texto superficie. Hover oscurece el tono; active escala a .97; disabled baja la opacidad a .45.
- **Quiet:** fondo púrpura suave con texto púrpura. Se usa para Pagado, Recibido, Deshacer y acciones secundarias.
- **FAB «+ Gasto»:** rosa gasto, de 56 px, elevado sobre la barra inferior. Es la acción más frecuente.

### Cards / Containers
- **Tarjeta de cuenta:** 220 × 136 px, radio de 24 px, gradiente propio por tipo (banco: púrpura; efectivo: ámbar a oro; tarjeta: tinta a rosa). Lleva ícono, nombre y saldo tabular. Va en un carrusel con scroll-snap. «Agregar cuenta» cierra el carrusel con borde punteado.
- **Encabezado:** es la única superficie *drenched* (púrpura a púrpura profundo). Lleva el mes, el saldo, la frase «Te faltan…», la barra segmentada y las acciones.

### Inputs / Fields
- **Style:** superficie hundida, sin borde en reposo, radio de 10 px, 48 px de alto.
- **Focus:** anillo oro de 3 px con offset de 2 px.
- **Error:** texto rosa con `role=alert` debajo del campo, y el campo con un filete rosa de 1 px.
- **Monto del sheet:** 2rem, tabular, `inputmode="decimal"`.

### Chips
- **Cuenta y tipo (segmentado):** radios visualmente ocultos con su etiqueta píldora de 44 px. Seleccionado: púrpura con texto superficie.

### Navigation
- **Móvil:** barra inferior fija con safe-area. Tiene tres pestañas (ícono de 24 px y etiqueta de 12 px) y el FAB en el centro. La pestaña activa se marca con el color púrpura y una píldora de fondo suave.
- **Escritorio (≥ 900 px):** riel lateral de 248 px con el nombre de la app, el FAB como botón ancho y las pestañas en vertical.

### Rows
- **Fila de recurrente:** ícono redondo de 40 px (color por tipo), nombre, metadatos «fecha · cuenta», monto con signo y acción. Si ya está hecho, el ícono pasa a check verde y la acción pasa a «Pagado ✓».

### Onboarding (work/007)
- **Stepper:** barra de 4 segmentos de 6 px (hecho: púrpura; actual: oro; pendiente: filete) y la etiqueta «Paso N de 4». La barra crece en 200 ms; los números no se animan.
- **Pregunta del paso:** título de 1.44rem, una por pantalla, y pie fijo con Atrás · Siguiente (primario) · Saltar (enlace).
- **Chip de catálogo:** píldora de 44 px con ícono de 18 px; al elegirse pasa a púrpura con check. Cada chip elegido abre una fila con monto tabular y chips de día.

### Settings list (work/007)
- **Grupos estilo iOS:** superficie con radio de 16 px, filas de 52 px con divisor de filete, etiqueta a la izquierda y control o valor a la derecha. Renombrar ocurre en línea en la misma fila.
- **Archivar:** acción secundaria que se revierte con el toast «Deshacer».

### Feedback
- **Toast:** es una píldora de tinta sobre la barra inferior. Dice «Arriendo pagado» e incluye un botón «Deshacer». Se cierra solo a los 5 s.
- **Sheet:** sube desde abajo en 220 ms con ease-out-quart y tiene un tirador visual. En escritorio es un diálogo centrado.

## 6. Do's and Don'ts

### Do:
- **Do** poner primero, en cada pantalla, la respuesta: el saldo o lo que falta.
- **Do** acompañar cada monto con su signo y usar números tabulares.
- **Do** ofrecer «Deshacer» después de toda acción de un toque.
- **Do** mantener todo objetivo táctil en ≥ 44 × 44 px.

### Don't:
- **Don't** usar azul marino con dorado ni una estética de sucursal bancaria (anti-referencia).
- **Don't** llenar pantallas de filas densas con el mismo peso visual, estilo hoja de cálculo (anti-referencia).
- **Don't** animar cifras, poner texto con gradiente o bordes laterales de color como acento.
- **Don't** usar `#fff` o `#000`: todo neutro va tintado.
