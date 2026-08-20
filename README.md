# Paul Sulca Gonzales — Portfolio

Sitio personal construido con [Astro](https://astro.build), pensado como una pieza editorial oscura con acentos de aura, tipografía de alto contraste y una escena 3D "chrome" en el hero. El sistema de diseño completo (color, tipografía, motion, accesibilidad) está documentado en [`DESIGN.md`](./DESIGN.md).

## Stack

- **[Astro](https://astro.build)** (`output: 'static'`) — generador del sitio, sin framework de UI adicional; los componentes son `.astro`.
- **[Tailwind CSS v4](https://tailwindcss.com)** vía `@tailwindcss/vite` — tokens de diseño definidos en `@theme` (`src/styles/global.css`).
- **[Three.js](https://threejs.org)** + shaders GLSL propios (`vite-plugin-glsl`) — escena 3D del hero (`src/lib/three/`).
- **[GSAP](https://gsap.com)** (`ScrollTrigger`) + **[Lenis](https://lenis.darkroom.engineering)** — scroll suave y reveal de contenido al hacer scroll.
- **[astro-icon](https://github.com/natemoo-re/astro-icon)** con `@iconify-json/lucide` y `@iconify-json/simple-icons` — iconografía.
- **Fontsource** (`Geist Variable`, `Fraunces Variable`, `JetBrains Mono`) — fuentes autoalojadas, sin llamadas externas.
- Contenido de proyectos como **content collection** (`astro:content`, loader `glob` sobre Markdown).
- **i18n nativo de Astro** — español (`es`, sin prefijo) e inglés (`/en`).

## Requisitos

- Node.js `>= 22.12.0` (ver `engines` en `package.json`)
- [pnpm](https://pnpm.io)

## Empezar

```sh
pnpm install
pnpm dev
```

El sitio queda disponible en `http://localhost:4321`.

> Si trabajas con el agente de Claude Code en este repo, arranca el servidor en background con `astro dev --background` (ver `AGENTS.md` / `CLAUDE.md`) y gestiónalo con `astro dev stop|status|logs`.

## Comandos

| Comando | Acción |
| --- | --- |
| `pnpm install` | Instala dependencias |
| `pnpm dev` | Servidor de desarrollo en `localhost:4321` |
| `pnpm build` | Build de producción a `./dist/` |
| `pnpm preview` | Sirve el build de `./dist/` localmente |
| `pnpm astro ...` | CLI de Astro (`astro check`, `astro add`, etc.) |

## Estructura del proyecto

```text
src/
├── components/
│   ├── ui/                 # Primitivas: Button, Card, Badge, Section
│   ├── effects/             # AuraBackground, AuraGlow, NoiseOverlay
│   ├── ChromeCanvas.astro   # Monta la escena 3D del hero
│   ├── ProjectCarousel.astro
│   └── ProjectCarouselCard.astro
├── content/
│   └── projects/            # Un .md por proyecto (ver esquema abajo)
├── i18n/
│   ├── ui.ts                 # Diccionarios es/en
│   └── utils.ts               # getLangFromUrl, useTranslations, toggle de idioma
├── layouts/
│   └── Layout.astro         # Shell HTML: Header, Footer, NoiseOverlay, smooth scroll
├── lib/
│   ├── animations.ts          # scrollReveal() — GSAP + data-scroll-reveal
│   ├── scroll.ts               # initSmoothScroll() — Lenis
│   ├── projectAccent.ts        # Gradiente hash-determinístico por proyecto
│   └── three/                 # Escena, shaders y tipos GLSL del hero
├── pages/
│   ├── index.astro, about.astro, proyectos/
│   └── en/                    # Mismas rutas bajo /en
└── styles/
    ├── global.css              # @theme: tokens de color, fuente, tracking
    └── fonts.css                # @font-face vía Fontsource
```

## Contenido de proyectos

Cada proyecto es un archivo Markdown en `src/content/projects/`, validado contra el esquema en `src/content.config.ts`:

```yaml
---
title: "Nombre del proyecto"
year: 2025
tags: ["Branding", "Web"]
summary: "Resumen corto para el carousel y el head de la página de detalle."
coverImage: "opcional"
externalLink: "https://... (opcional)"
---
Cuerpo del proyecto en Markdown — se renderiza en la página de detalle.
```

No hace falta registrar el proyecto en ningún otro lugar: `/proyectos` y `/en/projects` lo listan automáticamente (ordenado por `year` descendente) y generan su ruta `[slug]` vía `getStaticPaths`.

## Internacionalización

- Locale por defecto: `es` (sin prefijo de ruta).
- Locale secundario: `en` (bajo `/en`).
- Los textos de UI viven en `src/i18n/ui.ts`; el contenido de proyectos actualmente solo existe en español (no hay versión traducida del Markdown).
- Para añadir una key nueva, agrégala en ambos bloques (`es` y `en`) de `ui.ts` — `useTranslations` hace fallback al locale por defecto si falta una key.

## Diseño

Antes de tocar color, tipografía, motion o los efectos ambientales, revisa [`DESIGN.md`](./DESIGN.md) — documenta los tokens definidos en `@theme` y la razón detrás de cada decisión visual, para mantener el sistema consistente.

## Deploy

`astro.config.mjs` está configurado con `output: 'static'`: `pnpm build` genera un sitio 100% estático en `./dist/`, desplegable en cualquier hosting estático (Netlify, Vercel, Cloudflare Pages, GitHub Pages, etc.) sin necesidad de un runtime de servidor.
