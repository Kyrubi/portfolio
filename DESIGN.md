# Design System

Este documento describe el sistema de diseño del portfolio: los tokens definidos en `src/styles/global.css`, la razón detrás de cada decisión visual y cómo se traducen en componentes y efectos concretos. Es la referencia a la que apunta el comentario `// see design.md for the full rationale` en ese archivo.

## Filosofía

El sitio se presenta como una pieza editorial oscura con acabado "cromado": tipografía de alto contraste, superficies casi negras, acentos de aura de color y una esfera 3D con material tipo espejo como pieza central del hero. La estética busca transmitir precisión técnica (mono, tracking amplio, bordes sutiles) combinada con un toque expresivo (serif itálica para nombres/acentos, gradientes de aura difuminados).

Todo el sistema visual está pensado para funcionar en un solo tema oscuro — no hay modo claro.

## Color

Los roles de color están definidos como Tailwind theme tokens en `@theme` (`src/styles/global.css`):

| Token | Valor | Rol |
|---|---|---|
| `--color-void` | `#050507` | Fondo base de toda la página (`body`) |
| `--color-surface` | `#0d0d12` | Fondo de superficies elevadas: cards, carousel |
| `--color-violet` | `#66156c` | Acento de aura (gradientes de fondo/hover) |
| `--color-cyan` | `#00e5ff` | Acento de aura + color de foco (`:focus-visible`) + hover de links "visitar proyecto" |
| `--color-pink` | `#ff2a85` | Acento de aura |
| `--color-amber` | `#ff9e00` | Acento de aura |
| `--color-chrome` | `#f0f4f8` | Highlight especular — hover del botón primario, tono claro de la esfera 3D |
| `--color-ink` | `#ededef` | Texto principal |
| `--color-ink-muted` | `#7e7e8f` | Texto secundario, labels mono, bordes sutiles (siempre con opacidad, ej. `text-ink-muted/40`) |

Regla práctica: **violeta/cian/rosa/ámbar nunca se usan como color de texto o de fondo sólido** — solo aparecen en gradientes radiales de baja opacidad (`AuraGlow`, hover de `ProjectCarouselCard`) o en la escena 3D. El contraste de lectura siempre corre por `ink` / `ink-muted` sobre `void` / `surface`.

## Tipografía

Tres familias, cada una con un rol fijo (`@fontsource-variable` en `src/styles/fonts.css`):

- **`--font-display`** — Geist Variable. Fuente por defecto del body, headings, UI.
- **`--font-accent`** — Fraunces Variable, siempre en `italic font-normal`. Se usa como acento puntual dentro de un heading (el apellido en el hero, la palabra "precisión" en about, el título de cada proyecto en el carousel) — nunca para bloques de texto largos.
- **`--font-mono`** — JetBrains Mono. Reservada para elementos de "UI de sistema": navegación, badges, labels, fechas, eyebrows. Siempre en `uppercase tracking-widest text-xs` (u 11px para badges).

Tokens de ajuste fino: `--tracking-tightest: -0.04em` y `--leading-tightest: 0.95` se usan juntos en todos los `h1` grandes para lograr títulos compactos y de alto impacto (`tracking-tightest leading-tightest`).

**Patrón recurrente**: `<heading grande> <span class="font-accent italic font-normal">acento</span>` — se repite en el hero (`Paul <i>Sulca</i>`) y en about (`... focused on <i>precisión</i>`).

## Motion

Dos capas de movimiento, ambas con `prefers-reduced-motion` respetado explícitamente (nunca vía CSS `@media` solamente, sino comprobando `window.matchMedia` en JS y desactivando el efecto por completo):

1. **Scroll suave global** (`src/lib/scroll.ts`) — Lenis sincronizado con `ScrollTrigger.update` y el ticker de GSAP. Se inicializa una sola vez en `Layout.astro`. Si el usuario prefiere movimiento reducido, no se instancia Lenis y el scroll queda nativo.
2. **Scroll reveal por elemento** (`src/lib/animations.ts`) — cualquier elemento con `data-scroll-reveal` entra con `opacity 0→1` + `y: 32→0`, `power3.out`, disparado por `ScrollTrigger` al 85% del viewport. El `delay` se escalona por índice (`(index % 3) * 0.06`) para dar sensación de cascada en grupos de 3. Con reduced motion, los elementos simplemente se fijan en su estado final (`gsap.set`), sin animar.

Además, transiciones de hover puntuales usan siempre la misma curva de easing custom `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out expo) en vez de las curvas por defecto de Tailwind — ver `ProjectCarouselCard.astro`.

El carousel de proyectos (`ProjectCarousel.astro`) usa una animación CSS `marquee` continua (40s linear infinite) en vez de GSAP, y se pausa en `:focus-within`; con reduced motion se desactiva y el contenedor pasa a scroll horizontal manual.

## Escena 3D "Chrome"

`ChromeCanvas.astro` + `src/lib/three/scene.ts` renderizan una escena Three.js minimalista de fondo en el hero:

- Un icosaedro (`IcosahedronGeometry`) con un `ShaderMaterial` custom (`chrome.vert.glsl` / `chrome.frag.glsl`) que mezcla dos colores (`uColorA` gris claro, `uColorB` violeta-gris oscuro) según un término de Fresnel + ondas sinusoidales animadas por `uTime`, más grano procedural para evitar bandas.
- Un wireframe (`EdgesGeometry`) superpuesto en violeta brillante con blending aditivo, ligeramente escalado hacia afuera.
- Una nube de ~90 partículas distribuidas en esfera alrededor del icosaedro.

Reglas de carga: el script solo importa el módulo de Three.js (`import('../lib/three/scene')`) cuando el canvas entra en viewport (`IntersectionObserver`, threshold 0.1) **y** el usuario no tiene `prefers-reduced-motion`. Esto evita pagar el costo de WebGL si no hace falta. El ciclo de vida expone un `dispose()` que libera geometrías, materiales y el renderer — patrón a seguir si se añaden más escenas 3D.

## Efectos ambientales

- **`AuraBackground` / `AuraGlow`** — dos blobs (`radial-gradient` violeta→rosa→cian→transparente) con `blur-[120px]`, posicionados en esquinas opuestas. Es el efecto de "aura" de fondo reutilizado en hero y about (`opacity-60` en about para no competir con el contenido).
- **`NoiseOverlay`** — capa `fixed inset-0` con grano SVG (`feTurbulence`) a `opacity-5` y `mix-blend-overlay`, montada una vez en `Layout.astro` sobre toda la app. Rompe el banding de los gradientes y da textura análoga al fondo casi negro.

Ambos son puramente decorativos (`aria-hidden="true"`, `pointer-events-none`).

## Componentes base (`src/components/ui`)

Primitivas pequeñas, sin lógica de negocio, pensadas para componer:

- **`Section`** — contenedor de ancho máximo (`max-w-6xl`) y padding vertical/horizontal consistente (`px-6 py-24 md:px-10`). Toda página de contenido vive dentro de un `Section`.
- **`Button`** — dos variantes: `primary` (fondo `ink`, hover `chrome`) y `ghost` (borde `ink-muted/40`). Siempre `rounded-full`, texto mono uppercase.
- **`Badge`** — píldora de borde `ink-muted/30`, texto mono 11px uppercase. Se usa para labels de estado (rol, curso, tags de proyecto).
- **`Card`** — superficie `surface` con borde `ink-muted/15` que se aclara en hover; puede renderizar como `<a>` o `<div>` según reciba `href`.

Todos aceptan `class` extra vía `class:list` para composición sin romper el token base.

## Accesibilidad

- **Foco visible**: `:focus-visible` global usa el acento `cyan` como outline (2px, offset 2px) — es el único uso de un color de aura fuera de gradientes/3D.
- **Skip link**: primer elemento del `<body>`, oculto con `sr-only` y visible solo en foco.
- **Reduced motion**: respetado de forma explícita y consistente en las tres piezas de movimiento (Lenis, GSAP scroll-reveal, marquee CSS) y en la escena 3D, que directamente no se carga.
- **Idioma**: el `<html lang>` se deriva de la ruta (`getLangFromUrl`), no es un valor fijo.

## Internacionalización como parte del diseño

El español es el locale por defecto (sin prefijo de ruta); el inglés vive bajo `/en`. El toggle de idioma en `Header.astro` es puramente textual (mono, mismo tratamiento que el resto de la nav) — no hay banderas ni selector visual adicional, para mantener la estética minimalista de la navegación.
