# HISTORIAL DE PROPUESTAS DE DISEÑO DE LANDING PAGE - FIRPLAK

Este directorio documenta las propuestas de diseño activas y el historial de versiones desarrolladas para Firplak, permitiendo alternar, comparar o fijar cualquier propuesta.

---

## Propuestas de Diseño Disponibles

### 1. Alejandro (`alejandro` / Loomere)
- **Concepto:** Experiencia interactiva Loomere inspirada en diseño de alta gama, catálogo modal, selector de escenas, hotspots de producto con cursor magnético interactivo y cajón lateral de producto.
- **Componente Principal:** [`components/loomere/LoomereExperience.tsx`](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK%20e-commerce/components/loomere/LoomereExperience.tsx)
- **URL directa:** `/?v=alejandro`

### 2. Ricardo (`ricardo` / V2 Living Spaces)
- **Concepto:** Experiencia cinematográfica narrativa editorial basada en 4 ambientes fotorrealistas de catálogo con personaje consistente ("Elena") y loops continuos en Seedance 2.5:
  1. **El Baño:** Mueble Vanitorio Flotante blanco con grifería negra (Mañana).
  2. **La Cocina:** Cocina modular terracota y Calacatta Viola (Mediodía).
  3. **La Zona de Lavado:** Centro de lavado y secado compacto (Tarde).
  4. **El Hidromasaje al Atardecer:** Bañera exenta con hidroterapia y velas (Atardecer).
- **Componente Principal:** [`components/landing-cinematic/FirplakLivingSpacesExperience.tsx`](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK%20e-commerce/components/landing-cinematic/FirplakLivingSpacesExperience.tsx)
- **Guión Editorial:** [`scrip_landing/guion_landing.md`](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK%20e-commerce/scrip_landing/guion_landing.md)
- **URL directa:** `/?v=ricardo`

### 3. Isabel / Gabriel (`isabel-gabriel`)
- **Concepto:** Réplica base de la experiencia de Alejandro (Loomere), desacoplada en su propio componente para iterar y desarrollar variaciones de diseño independientes.
- **Componente Principal:** [`components/isabel-gabriel/IsabelGabrielExperience.tsx`](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK%20e-commerce/components/isabel-gabriel/IsabelGabrielExperience.tsx)
- **URL directa:** `/?v=isabel-gabriel`

---

## Conmutador y Modos de Visualización

- **Modo Alternante Secuencial (Por Defecto):**
  En cada recarga de página (*refresh*), el sitio rota secuencialmente: **Alejandro → Ricardo → Isabel / Gabriel → Alejandro**.
- **Control Flotante:**
  En la esquina inferior derecha se encuentra la barra flotante con botones directos para alternar entre las 3 propuestas al instante.
- **Forzado por Parámetro URL:**
  - `/?v=alejandro`
  - `/?v=ricardo`
  - `/?v=isabel-gabriel`

