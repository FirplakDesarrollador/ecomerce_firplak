# Bug History Log

This file tracks all bugs fixed in the project to prevent regressions.

| ID | Date | Error Description | Cause | Solution | Prevention |
|----|------|-------------------|-------|----------|------------|
| 001 | 2026-09-04 | `react-hooks/refs`: lectura de `currentPos.current` durante el render en `LoomereCursorPriceTag` | El transform inline leía un ref mutado por el bucle rAF, valor no reactivo y desincronizado | El style inline usa la constante `OFFSCREEN_TRANSFORM`; el rAF sigue siendo el único dueño del transform vía `tagRef` | Nunca leer `.current` en el cuerpo del render: usar constantes para el estado inicial y el DOM directo para animaciones |
| 002 | 2026-09-04 | `react-hooks/set-state-in-effect`: `handleScroll()` síncrono dentro del effect en `LoomereExperience` | El sync inicial del scroll disparaba setState en el cuerpo del effect, causando renders en cascada | Se difiere con `requestAnimationFrame(handleScroll)` y se cancela en el cleanup | Sincronizar estado inicial derivado del DOM fuera del cuerpo del effect (rAF o evento) |
| 003 | 2026-09-04 | `@next/next/no-img-element`: 7 `<img>` nativos en Hero, CategoryGrid, FeaturedProducts, PromoBanners y `categoria/[slug]` | Se omitió `next/image`, degradando LCP y ancho de banda | Migrados a `<Image fill sizes=... />` (Hero con `priority`) y `images.remotePatterns` para `images.unsplash.com` | Usar siempre `next/image` con `fill` + `sizes`; registrar hosts remotos en `next.config.ts` |
| 004 | 2026-09-04 | Imports sin usar: `notFound` en `categoria/[slug]/page.tsx` y `ArrowRight` en `LoomereExperience` | Restos de refactors previos | Eliminados | Correr `npx eslint .` antes de cerrar cualquier cambio |
