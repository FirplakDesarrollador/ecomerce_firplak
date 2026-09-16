# HISTORIAL DE VERSIONES DE LANDING PAGE - FIRPLAK

Este directorio almacena el historial de versiones de las landing pages desarrolladas para Firplak, permitiendo recuperar o comparar cualquier versión previa de manera inmediata.

---

## Versiones Disponibles

### 1. `v1_loomere/`
- **Fecha:** Septiembre 2026
- **Concepto:** Experiencia interactiva Loomere inspirada en diseño de alta gama, catálogo modal, selector de escenas, hotspots de producto con cursor magnético interactivo y cajón lateral de producto.
- **Componente Principal:** [`components/loomere/LoomereExperience.tsx`](file:///c:/Users/Rik/OneDrive/Escritorio/ecomerce_firplak/components/loomere/LoomereExperience.tsx)
- **Copia de Respaldo:** [`historial_landing/v1_loomere/page.original.tsx`](file:///c:/Users/Rik/OneDrive/Escritorio/ecomerce_firplak/historial_landing/v1_loomere/page.original.tsx)

### 2. `v2_cinematic_living_spaces/` (Actual Nueva Versión)
- **Fecha:** Septiembre 2026
- **Concepto:** Experiencia cinematográfica narrativa editorial basada en 4 ambientes fotorrealistas de catálogo con personaje consistente ("Elena") y loops continuos en Seedance 2.5:
  1. **El Baño:** Mueble Vanitorio Flotante blanco con grifería negra (Mañana).
  2. **La Cocina:** Cocina modular terracota y Calacatta Viola (Mediodía).
  3. **La Zona de Lavado:** Centro de lavado y secado compacto (Tarde).
  4. **El Hidromasaje al Atardecer:** Bañera exenta con hidroterapia y velas (Atardecer).
- **Componente Principal:** `components/landing-cinematic/FirplakLivingSpacesExperience.tsx`
- **Guión Editorial:** [`scrip_landing/guion_landing.md`](file:///c:/Users/Rik/OneDrive/Escritorio/ecomerce_firplak/scrip_landing/guion_landing.md)

---

## Cómo Restaurar una Versión Previa

Para dejar fija una versión específica en `app/page.tsx`:
- **Para fijar v1 (Loomere):**
  ```tsx
  import LoomereExperience from '@/components/loomere/LoomereExperience';
  export default function Home() {
    return <LoomereExperience />;
  }
  ```
- **Para fijar v2 (Living Spaces):**
  ```tsx
  import FirplakLivingSpacesExperience from '@/components/landing-cinematic/FirplakLivingSpacesExperience';
  export default function Home() {
    return <FirplakLivingSpacesExperience />;
  }
  ```
- **Modo Alternante (Actual):**
  `app/page.tsx` incluye el conmutador dinámico que alterna entre ambas versiones en cada recarga (*refresh*), además de un control flotante sutil para alternar manualmente en tiempo real.
