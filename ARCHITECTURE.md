# Arquitectura

Este documento describe cómo está organizado el código del portfolio: qué va en cada carpeta, qué convenciones sigue y por qué. Es la referencia de arquitectura que complementa a [`DESIGN.md`](./DESIGN.md) (sistema visual/tokens) y a [`CLAUDE.md`](./CLAUDE.md) / [`AGENTS.md`](./AGENTS.md) (flujo de desarrollo).

Stack: [Astro](https://astro.build) 7 en modo `output: 'static'`, Tailwind 4 (`@tailwindcss/vite`), GSAP + Lenis para motion, Three.js + GLSL para la escena 3D del hero, `astro:content` para los proyectos.

## Mapa de carpetas

```
src/
├── components/
│   ├── ui/            # primitivas de interfaz sin lógica de negocio
│   ├── effects/        # capas puramente decorativas (aria-hidden, pointer-events-none)
│   └── *.astro          # componentes de página/sección compuestos a partir de ui/ y effects/
├── content/
│   └── projects/        # una entrada .md por proyecto
├── content.config.ts    # schema Zod de la colección `projects`
├── i18n/
│   ├── ui.ts             # diccionario de strings por locale (es/en)
│   └── utils.ts          # getLangFromUrl, useTranslations, getLocaleTogglePath
├── layouts/
│   └── Layout.astro       # único shell HTML del sitio
├── lib/
│   ├── animations.ts       # scroll reveal (GSAP + ScrollTrigger)
│   ├── scroll.ts            # smooth scroll (Lenis)
│   ├── projectAccent.ts      # utilidades de presentación de proyectos
│   └── three/                 # todo lo específico de la escena 3D
│       ├── scene.ts             # setup/dispose de la escena Three.js
│       └── shaders/              # chrome.vert.glsl, chrome.frag.glsl
├── pages/
│   ├── (rutas en español, locale por defecto sin prefijo)
│   └── en/               # mismas rutas, prefijo /en
└── styles/
    ├── fonts.css           # @fontsource-variable imports
    └── global.css           # @theme tokens (ver DESIGN.md)
```

## Componentes (`src/components`)

- **`ui/`** — `Button`, `Badge`, `Card`, `Section`. Sin fetch de datos, sin i18n, sin conocimiento de rutas. Reciben todo por `Astro.props` y aceptan `class` extra vía `class:list` para componerse. Si un componente empieza a necesitar `getCollection` o `useTranslations`, ya no pertenece aquí.
- **`effects/`** — `AuraBackground`, `AuraGlow`, `NoiseOverlay`. Mismo criterio: cero lógica, solo salida visual. Se marcan `aria-hidden="true"` porque no aportan contenido.
- **Nivel raíz de `components/`** — piezas con identidad propia dentro de una página (`Header`, `Footer`, `ChromeCanvas`, `ProjectCarousel`, `ProjectCarouselCard`). Estas sí pueden traer i18n (`Header`) o montar scripts de cliente (`ChromeCanvas`). No hay una carpeta `sections/` separada: la línea entre "componente de página" y "página" la marca si el archivo vive bajo `pages/` o no.

## Contenido (`src/content`)

Los proyectos son Markdown validado por `content.config.ts` (loader `glob`, schema Zod: `title`, `year`, `tags`, `summary`, `coverImage?`, `externalLink?`). Añadir un proyecto es agregar un `.md` en `src/content/projects/` — no requiere tocar código de página, porque `[slug].astro` genera las rutas vía `getStaticPaths` + `getCollection`.

## Internacionalización (`src/i18n` + `src/pages`)

- `es` es el locale por defecto sin prefijo de ruta; `en` vive bajo `/en` (configurado en `astro.config.mjs` con `prefixDefaultLocale: false`).
- `i18n/ui.ts` es un diccionario plano por clave (`'hero.badge'`, `'about.bio'`, etc.), tipado por inferencia (`as const`) para que `useTranslations` autocomplete y valide claves en build.
- `i18n/utils.ts` centraliza la lectura del locale desde la URL y la construcción de rutas — ningún componente parsea `Astro.url.pathname` a mano para esto.
- **Deuda conocida**: `src/pages/*.astro` y `src/pages/en/*.astro` son actualmente estructuras espejo — cada página existe una vez por locale, con el mismo markup y solo el `title` (y las rutas relativas de import) distintos. Es deuda intencional por ahora: no se ha extraído a componentes compartidos. Al tocar una página, hay que replicar el cambio manualmente en su par de idioma.

## Motion y 3D (`src/lib`)

- `scroll.ts` y `animations.ts` son los dos únicos puntos de entrada de motion del sitio; ambos respetan `prefers-reduced-motion` explícitamente (ver `DESIGN.md`). Cualquier animación nueva basada en scroll debería reusar el atributo `data-scroll-reveal` en vez de inventar un mecanismo paralelo.
- `lib/three/` aísla todo lo que toca WebGL: `scene.ts` expone `dispose()` y se importa dinámicamente solo cuando el canvas entra en viewport y no hay reduced motion (ver `ChromeCanvas.astro`). Los shaders viven junto a la escena, no en `styles/`.

## Estilos (`src/styles`)

Un solo archivo de tokens (`global.css`, `@theme` de Tailwind 4) y un archivo de imports de fuentes (`fonts.css`). No hay CSS por componente: todo el styling vive en clases Tailwind inline en los `.astro`. El detalle de tokens y su razón de ser está en `DESIGN.md`, no se repite aquí.

## Convenciones generales

- **Sin barrel files** (`index.ts` de re-export): cada import apunta directo al archivo.
- **Sin gestor de estado global**: el sitio es estático, la única interactividad de cliente son scripts inline (`<script>` en `.astro`) montados por página/componente, sin framework de UI (React/Vue/etc.) — de ahí que no exista una carpeta `src/hooks` o `src/store`.
- **Rutas relativas, no alias `@/`**: no hay `paths` configurado en `tsconfig.json`; los imports usan `../` consistentemente.
- **Un componente, un archivo `.astro`**: no se dividen en `Componente.astro` + `Componente.module.css` + `Componente.ts`; lógica mínima de cliente va inline en `<script>` dentro del mismo archivo (ver `Header.astro`).
