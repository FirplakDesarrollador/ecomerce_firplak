# Informe de Recomendaciones: Montaje de Catálogo de Muebles y Lavamanos FIRPLAK (Mix & Match)

> [!IMPORTANT]
> **Estrategia Condensada**:
> Despliegue integral del catálogo comercial de muebles de baño y lavamanos FIRPLAK mediante el principio de **compatibilidad por huella dimensional** (ancho × profundidad). Este modelo permite desacoplar los inventarios y la producción en planta (Madera Aglomerada RH vs. Mármol Sintético), ofreciendo al cliente la experiencia de combinar libremente piezas con calce físico garantizado, resolviendo precios, SKUs individuales y descuentos de combo de forma transparente hacia SAP Business One y Supabase.

---

## 1. Alcance y Principio de Compatibilidad Dimensional

La relación técnica entre muebles de baño y lavamanos en FIRPLAK obedece a una regla de calce físico por huella: **casi la totalidad de los lavamanos de una dimensión nominal combinan con cualquier mueble diseñado para esa misma huella**.

```
    ┌────────────────────────────────────────────────────────┐
    │          HUELLA DIMENSIONAL NOMINAL (A × P)            │
    │     Ej: 63 × 48 cm  /  80 × 48 cm  /  100 × 48 cm      │
    └───────────────────────────┬────────────────────────────┘
                                │
        ┌───────────────────────┴───────────────────────┐
        ▼                                               ▼
┌──────────────────────────────┐        ┌──────────────────────────────┐
│       LAVAMANOS FIRPLAK      │        │        MUEBLE FIRPLAK        │
│ • Mármol Sintético / Mineral │        │ • Madera Aglomerada RH       │
│ • Acabado: Brillante o Mate  │        │ • Tableros Melamínicos (5)   │
│ • Monolítico o Sobreponer    │        │ • Flotante o a Piso          │
└──────────────────────────────┘        └──────────────────────────────┘
```

---

## 2. Matriz de Atributos, Materiales y Restricciones

### 2.1. Huellas Dimensionales y Volumetría Real del Catálogo (firplak.com)

A partir del levantamiento del catálogo activo en producción (`firplak.com`), se identificaron **36 lavamanos** (33 tipo Vanity + 3 Vessel) y **71 muebles para lavamanos solos** (además de 160 combos comerciales pre-empaquetados). La distribución real por huella nominal es la siguiente:

| Huella Nominal (Ancho × Prof.) | Segmento de Mercado | Lavamanos (Total: 36) | Muebles Solos (Total: 71) | Modelos Representativos |
| :--- | :--- | :---: | :---: | :--- |
| **40 × 30 cm** | Baños sociales / Espacios compactos | **2** | **5** | *Lvm:* Eco 40×30, Iguazú (40×28)<br>*Mbl:* Rayo elevado, Básico piso/elevado |
| **48 × 38 cm** | Compacto estándar | **2** | **5** | *Lvm:* Eco, Oslo<br>*Mbl:* Rayo elevado, Básico piso, Básico elevado |
| **48 × 43 cm** | Vivienda media / Urbano | **4** | **13** | *Lvm:* Oslo, Siena, Río, Quadratto<br>*Mbl:* Godai soporte, Rayo elevado, Roma, Vitelli |
| **63 × 48 cm** | *Core / Línea Insignia (35% catálogo)* | **8** | **20** | *Lvm:* Oslo, Siena, Génova, Bari, Parma, Trentino<br>*Mbl:* Vitelli 63, Gola Curva, Macao, Básico |
| **79 × 48 cm** | Espacios medianos / Confort | **6** | **13** | *Lvm:* Parma, Oslo, Bari, Génova, Quadratto<br>*Mbl:* Macao Class, Macao Life, Vitelli |
| **94 × 48 cm** | Baños principales / Amplios | **5** | **7** | *Lvm:* Bari, Oslo, Génova, Quadratto<br>*Mbl:* Vitelli 94, Macao 94 |
| **124 × 48 cm** | Doble poza / Master Suite | **3** | **6** | *Lvm:* Oslo 124, Génova 124 doble, Siena 124 doble<br>*Mbl:* Vitelli 124, Master 124 |
| **155 × 48 cm** | Gran formato arquitectónico | **1** | **1** | *Lvm:* Duetto / Oslo 155<br>*Mbl:* Master 155 |
| **Otras / Vessel** | Sobreponer y medidas especiales | **5** | **1** | *Lvm:* Oslo 100×50, Ocean 79×56, Sahara, Doha, Meca<br>*Mbl:* Van Gogh 63×38 |

---

### 2.2. Materiales y Propiedades Físicas
1. **Lavamanos:**
   - **Mármol Sintético / Mineral Composite:** Monolítico, no poroso, alta resistencia al impacto y choque térmico. Fácil reparación superficial.
   - **Solid Surface:** Acabado mate sedoso, tacto cálido, resistencia química superior.
2. **Muebles:**
   - **Madera Aglomerada RH (Resistente a la Humedad):** Calibre 15 mm en estructura interna y 18 mm en frentes visibles. Cantos rígidos sellados con adhesivo PUR para evitar hinchamiento por vapor.
   - **Herrajes:** Rieles telescópicos de extensión total con cierre lento amortiguado; bisagras de clip de 110° con freno integrado.

---

### 2.3. Acabados y Colores
* **Muebles (RH):**
  - Tableros Melamínicos textura madera: *Blanco Madera, Soder, Austral, Gracia, Mitte*.
  - Lacados / Termoformados lisos: *Blanco Mate, Grafito Profundo*.
* **Lavamanos:**
  - *Blanco Brillante* (estándar institucional).
  - *Blanco Mate*, *Gris Concreto*, *Negro Mate*, *Hueso*.

---

### 2.4. Restricciones y Reglas de Negocio
1. **Tolerancia Dimensional:** Tolerancia máxima permitida en planta: ±3 mm en lavamanos y ±2 mm en mueble. Todo calce fuera de este margen queda deshabilitado en base de datos.
2. **Restricción de Grifería por Tipología:**
   - *Lavamanos Integral:* La poceta incluye orificio; se restringe a **grifería monocontrol baja** o mezclador 4".
   - *Lavamanos Vessel (Sobreponer):* Montado sobre mesón ciego; exige **grifería monocontrol de caño alto** o grifería empotrada a la pared.
3. **Plomería y Paso del Desagüe:**
   - El primer cajón del mueble debe contar obligatoriamente con el cajeo en "U" para el cuello del sifón, o exigir el kit de sifón flexible ahorrador de espacio FIRPLAK.
4. **Logística y Promesa de Entrega:**
   - Configuración estándar: Fabricación bajo pedido (15 días hábiles).
   - Flag `is_fast_shipping`: Combinaciones con inventario físico para despacho en <48 horas.

---

## 3. Plan de Trabajo: Actividades y Estimación Calibrada de Tiempos

> [!NOTE]
> **Criterio de Estimación Realista**:  
> Se diferencian estrictamente las **actividades transversales de plataforma** (arquitectura, base de datos, frontend y lógica comercial, que se desarrollan una sola vez para la totalidad del catálogo) del **esfuerzo unitario de modelado y renderizado 3D por referencia**, calibrado a **4 – 5 horas netas por modelo**.

```mermaid
gantt
    title Cronograma de Despliegue en Paralelo (Dev + 3D)
    dateFormat  X
    axisFormat Día %d
    section Dev: Plataforma
    Fase 1: Datos & Matriz SAP/Supabase (Todo el catálogo) :0, 5
    Fase 3: Motor Frontend & Carruseles                    :5, 10
    Fase 4: Carrito Multi-SKU & Cotizador                  :10, 13
    Fase 5: QA & Optimización Heurística                   :13, 15
    section 3D: Assets Unitarios (4.5 h/ref)
    Setup Pipeline, Shaders & Cámaras (Único)              :0, 3
    Lote 1: Medida Insignia 63x48 (8 Lvm + 5 Mbl)          :3, 11
    Lote 2: Medidas 48x43 y 79x48 (10 Lvm + 7 Mbl)         :11, 21
    Lote 3: Resto del Catálogo (18 Lvm + 14 Mbl)           :21, 35
```

---

### A. Tareas Transversales de Plataforma (Setup Único para Todo el Catálogo)

#### Fase 1: Arquitectura de Datos y Matriz de Compatibilidades
*Responsable: Backend / DBA Supabase*
* **Actividad 1.1: Estandarización de Taxonomía y Huellas Globales (2.0 días)**
  - Normalización integral de las 8 huellas dimensionales para todas las referencias de SAP en las tablas maestras `DIMENSION`, `MATERIAL`, y `COLOR`.
* **Actividad 1.2: Carga de la Matriz Relacional `COMPATIBILITY` (2.0 días)**
  - Script relacional automatizado para vincular los 36 lavamanos con los 71 muebles según tolerancia física (±3 mm) e índices GIN sobre `attributes` (`jsonb`).
* **Actividad 1.3: Listas de Precios, SKUs y Reglas de Bundles (1.0 día)**
  - Estructuración de descuentos automáticos por combo e inyección de metadatos comerciales.
> **Subtotal Fase 1 (Todo el Catálogo):** **5.0 días hábiles**

#### Fase 3: Motor Frontend Mix & Match
*Responsable: Frontend Engineer (Next.js / TypeScript)*
* **Actividad 3.1: Filtro Dimensional y Carruseles Reactivos (2.5 días)**
  - Selector de huella que sincroniza en tiempo real los carruseles superior e inferior con Zustand.
* **Actividad 3.2: Motor de Renderizado e Interacción (2.5 días)**
  - Implementación del canvas fotorrealista con transiciones físicas de ensamble y visualizador 3D interactivo.
> **Subtotal Fase 3 (Plataforma):** **5.0 días hábiles**

#### Fase 4: Transaccionalidad, Carrito Multi-SKU y SAP
*Responsable: Fullstack / Integraciones*
* **Actividad 4.1: Carrito Multi-SKU y Cotización (2.5 días)**
  - Inyección simultánea `[SKU_MUEBLE, SKU_LAVAMANOS, SKU_GRIFERIA]` vinculados bajo `bundle_id` y generador de enlaces dinámicos para WhatsApp de ventas.
> **Subtotal Fase 4 (Plataforma):** **2.5 días hábiles**

#### Fase 5: QA, Control de Regresiones y Optimización UX
*Responsable: QA Engineer / UX Auditor*
* **Actividad 5.1: Cobertura de Pruebas Unitarias y Auditoría Heurística (2.0 días)**
  - Validación de compatibilidad estricta con Vitest y cumplimiento de leyes de UX (Hick, Fitts, Doherty).
> **Subtotal Fase 5 (Plataforma):** **2.0 días hábiles**

> **Subtotal Global Plataforma (Desarrollo Web & Backend):** **14.5 días hábiles (~3 semanas)**

---

### B. Pipeline de Assets Visuales y Modelado 3D (Cálculo Unitario: 4 – 5 h / referencia)
*Responsable: 3D Artist / Desarrollador Gráfico*

* **Setup Inicial del Pipeline (2.5 días - una sola vez):**
  - Estandarización de cámara (perspectiva 3/4 frontal, iluminación neutra, fondo alfa).
  - Configuración de scripts automáticos de optimización (`preparar-opcion-b.mjs`, compresión Meshopt y exportación GLB).
  - Extracción de texturas melamínicas canónicas a 1024 px con veta continua.

* **Producción por Referencia (4 a 5 horas netas por modelo):**
  - *Lavamanos (36 modelos):* Limpieza de malla CAD/FBX, verificación de orificio de grifería y desagüe, centrado de coordenadas y exportación.  
    $\rightarrow 36 \text{ refs} \times 4.5\text{ h} = \mathbf{162\text{ horas}}$ (~20 días laborales).
  - *Muebles de Baño:*  
    - **Escenario A: Modelos Base / Familias Paramétricas (Recomendado):** Se modelan las **26 estructuras base de mueble** (los acabados melamínicos se aplican dinámicamente en runtime mediante texturas).  
      $\rightarrow 26 \text{ muebles base} \times 4.5\text{ h} = \mathbf{117\text{ horas}}$ (~15 días laborales).
    - **Escenario B: Catálogo Exhaustivo SKU a SKU:** Tratamiento individualizado de las 71 referencias de muebles.  
      $\rightarrow 71 \text{ muebles} \times 4.5\text{ h} = \mathbf{320\text{ horas}}$ (~40 días laborales).

---

## 4. Resumen Consolidado de Esfuerzo y Escenarios de Entrega

Dado que el desarrollo de la **Plataforma (14.5 días)** avanza en paralelo con la producción de **Assets 3D**, la duración total del proyecto depende de la capacidad del equipo de modelado:

| Componente de Trabajo | Alcance / Referencias | Esfuerzo Bruto | Con 1 Modelador 3D | Con 2 Modeladores 3D (Paralelo) |
| :--- | :---: | :---: | :---: | :---: |
| **Plataforma Web & Datos (Fases 1, 3, 4, 5)** | Todo el catálogo (Setup único) | **14.5 días** | 14.5 días hábiles | 14.5 días hábiles |
| **Pipeline Setup 3D (Fase 2 inicial)** | Herramientas y Texturas | **2.5 días** | 2.5 días hábiles | 2.5 días hábiles |
| **Producción 3D Escenario A (Familias Base)** | 36 lavamanos + 26 muebles (**62 refs**) | **~280 horas** | 35 días hábiles | 18 días hábiles |
| **TOTAL PROYECTO (Escenario A - Recomendado)** | **Despliegue Completo Catálogo Base** | — | **~7 a 8 semanas** (40 días) | **~4.5 semanas** (23 días) |
| **TOTAL PROYECTO (Escenario B - Exhaustivo)** | **Despliegue 36 Lvm + 71 Mbl (107 refs)** | **~480 horas** | **~12 semanas** (62 días) | **~6.5 semanas** (33 días) |

---

## 5. Estrategia de Rollout Recomendada por Sprints

1. **Sprint 1 (Medida Insignia 63×48 cm - Semana 1 a 2):**  
   - Despliegue de la plataforma base y modelos insignia (Vitelli 63 y Gola Curva con lavamanos Oslo, Siena, Génova, Parma y Ovalado).
2. **Sprint 2 (Medidas Core 48×43 cm y 79×48 cm - Semana 3 a 4):**  
   - Incorporación de las dos siguientes medidas con mayor demanda comercial (26 referencias adicionales).
3. **Sprint 3 (Formatos Compactos y Gran Formato - Semana 5 en adelante):**  
   - Cierre del catálogo con 40×30 cm, 48×38 cm, 94×48 cm, 124×48 cm y 155×48 cm.

---

## 6. Recomendaciones Estratégicas: Riesgos y Problemáticas de Escalar a todo el Portafolio

Aunque el configurador visual (3D / Mix & Match) es una herramienta de conversión potente para referencias insignia, **intentar desplegar y mantener el 100% de un catálogo masivo, altamente condicionado y creciente mediante este formato presenta riesgos críticos**:

### 6.1. Cuello de Botella Operativo y Deuda de Assets (Asset Pipeline Debt)
* **Pérdida de agilidad en nuevos lanzamientos:** En un e-commerce estándar, dar de alta un producto nuevo toma minutos (cargar ficha técnica y fotos comerciales en el CMS/SAP). Bajo un esquema 3D o de capas fotorrealistas con máscara de luz, **cada nuevo SKU introduce una dependencia técnica obligatoria**:
  - Limpieza de malla poligonal CAD/FBX.
  - Rigging de cajones y puertas con frenado.
  - Mapa de alturas cenital para deducción de perforaciones de grifería y desagüe.
  - Corrección de normales, compresión Meshopt y QA visual.
* Si el equipo de diseño industrial o mercadeo lanza una nueva colección de 10 muebles, el despliegue web queda bloqueado durante 45–50 horas de trabajo gráfico técnico.

### 6.2. Sobrecarga Cognitiva y Fricción de Decisión (Leyes de Hick y Miller)
* **Parálisis por exceso de opciones:** Con 36 lavamanos, 71 muebles y 5 acabados, las combinaciones teóricas superan las **12.000 alternativas posibles**.
* Obligar al usuario a navegar carruseles horizontales con decenas de opciones simultáneas viola la **Ley de Hick** (el tiempo de decisión se incrementa logarítmicamente con el número de estímulos) y la **Ley de Miller** (saturación de la memoria de trabajo).
* **Experiencia de rechazo o frustración:** Al existir tantas restricciones físicas (ciertos lavamanos requieren grifo de pared, muebles con primer cajón que choca con pozas profundas, etc.), el usuario experimenta frustración cuando el sistema le bloquea o "auto-corrige" selecciones que visualmente le parecían atractivas.

### 6.3. Explosión Combinatoria en la Matriz de Reglas (Ley de Tesler)
* **Mantenimiento factorial de excepciones:** La premisa de *"casi todo calza por huella"* se rompe en los casos borde:
  - Lavamanos con pocetas asimétricas o desplazadas a un costado (ej. *Parma* o *Oslo 100 con mesón lateral*).
  - Variaciones en el cajeo del sifón interno de los cajones.
  - Tolerancias físicas milimétricas en mármol sintético que varían según el lote de vaciado (±3 mm).
* Conforme el portafolio crece, la matriz relacional en Supabase acumula excepciones manuales que encarecen el soporte técnico y aumentan la probabilidad de vender combinaciones físicamente incompatibles.

### 6.4. Impacto en Rendimiento Móvil y Pérdida de Conversión (Doherty Threshold)
* En Colombia, más del **70% del tráfico transaccional proviene de dispositivos móviles** (muchos de gama media o baja conectados a redes móviles 4G inestables).
* Instanciar contextos de WebGL pesados (Three.js / React Three Fiber) o decodificar en memoria decenas de WebP en alta resolución satura la GPU/VRAM del smartphone, provocando caídas de FPS, calentamiento del terminal y cierres inesperados por pérdida de contexto (`webglcontextlost`).
* Esto perjudica los **Core Web Vitals** (especialmente LCP e INP), dañando el posicionamiento orgánico en Google (SEO).

### 6.5. Evidencia de la Industria: Estudios de Galerías y Visualizadores 3D en Móvil

De acuerdo con investigaciones empíricas de comercio electrónico (**Baymard Institute, Nielsen Norman Group y Shopify**), la visualización 3D en dispositivos móviles no es intrínsecamente buena ni mala: **su impacto en la conversión es extraordinario (+40% a +94%), pero solo si se respetan reglas estrictas de ergonomía móvil**:

#### A. Métricas Cuantitativas Validadas
* **Incremento en Conversión (+40% a +94%):** Datos de Shopify y estudios de retail en categorías de mobiliario y remodelación demuestran que permitir al usuario inspeccionar el producto en 3D elimina la principal barrera psicológica de compra: *la incertidumbre dimensional y espacial ("¿cómo se ve por dentro?", "¿cabrá en mi baño?")*.
* **Reducción de Devoluciones (-35% a -40%):** Casos de estudio en plataformas como Wayfair e IKEA constatan que la comprensión volumétrica previa reduce drásticamente las devoluciones por descalce físico o falsas expectativas de tamaño.
* **Tiempo de Engagement (2.5×):** Los compradores pasan más del doble de tiempo interactuando con productos que cuentan con inspección tridimensional frente a galerías estáticas.

#### B. Los 3 Errores Críticos Identificados por Baymard Institute y NN/g
1. **La "Trampa de Scroll" (*Scroll Hijacking*):**  
   Si el lienzo 3D ocupa todo el ancho y alto visible del teléfono, el pulgar del comprador que intenta hacer scroll hacia abajo para ver el botón de compra termina **rotando el mueble de forma involuntaria**, atrapándolo en la pantalla.  
   *Directriz:* El lienzo móvil debe incluir márgenes táctiles libres o requerir activación por toque explícito (*"Toca para interactuar en 3D"* o apertura en modal/drawer dedicado).
2. **El 3D NO reemplaza la fotografía de ambiente real:**  
   Nielsen Norman Group demostró que los usuarios desconfían de fichas de producto basadas *únicamente* en renders 3D o modelos CAD, ya que los perciben como "simulaciones de laboratorio". El 3D es insuperable para medidas y ver cajones por dentro, pero el comprador siempre exige **al menos 1 o 2 fotografías reales de ambiente** para validar la textura auténtica de la madera y el brillo del mármol sintético.
3. **Umbral de Doherty en Redes Móviles (< 2 segundos):**  
   Cargar una escena WebGL pesada directamente al abrir la página bloquea la navegación. La mejor práctica de la industria es cargar un **póster WebP estático ultra-ligero** de inmediato, e inicializar el contexto 3D en segundo plano solo cuando el usuario entra al viewport o pulsa la experiencia interactiva.

---

### 6.6. Recomendación de Solución: Enfoque Híbrido Escalonado (Regla de Pareto 80/20)

Para maximizar el ROI de desarrollo y proteger la experiencia de usuario, se recomienda implementar una arquitectura comercial híbrida:

```
                                    PORTAFOLIO TOTAL FIRPLAK
                                                │
                ┌───────────────────────────────┴───────────────────────────────┐
                ▼                                                               ▼
    TOP 20% CATÁLOGO (CORE / HERO)                                 80% CATÁLOGO (LONG-TAIL)
   ┌───────────────────────────────┐                              ┌───────────────────────────────┐
   │ • Medidas: 63×48 y 79×48 cm   │                              │ • Medidas compactas/especiales│
   │ • Modelos: Vitelli, Curva,    │                              │ • Colecciones de baja rotación│
   │   Oslo, Siena, Génova         │                              │ • Muebles complementarios     │
   └───────────────┬───────────────┘                              └───────────────┬───────────────┘
                   ▼                                                              ▼
     EXPERIENCIA MIX & MATCH / 3D                                   PDP ESTÁNDAR + BUNDLE CURADO
    • Configurador visual activo                                   • Galería fotográfica estándar
    • Selección de acabados en vivo                                • Combos pre-cerrados en SAP
    • Simulación física de ensamble                                • "Completa tu look" recomendado
```

1. **Configurador Mix & Match reservado para el "Core" (Top 20%):**  
   Limitar la experiencia interactiva a las 2 medidas más vendidas (**63 × 48 cm y 79 × 48 cm**), donde se concentra más del 65% del volumen de venta de baños.
2. **Selector Guiado tipo Quiz en lugar de Carruseles Infinitos:**  
   Sustituir la navegación manual por un embudo de 3 preguntas:
   - *Paso 1:* ¿Cuánto espacio tienes disponible? *(Selector visual de 3 anchos estándar)*.
   - *Paso 2:* ¿Prefieres mueble flotante a pared o con apoyo a piso?
   - *Paso 3:* Presentar las **3 mejores combinaciones prediseñadas** por arquitectos de Firplak con opción de permutar acabado.
3. **Catálogo Restante en PDP Convencional:**  
   Para referencias de nicho o gran formato, utilizar páginas de producto (PDP) convencionales con fotografía editorial de alta calidad y sugerencias cruzadas mediante bundles predeterminados, eliminando el coste de modelado 3D para SKUs de baja rotación.

---

## 7. Documentos y Referencias Relacionadas
* [banos_muebles_opcion_b.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK%20e-commerce/especificaciones/wiki/banos_muebles_opcion_b.md): Especificación del Mix & Match fotorrealista.
* [banos_muebles_opcion_a.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK%20e-commerce/especificaciones/wiki/banos_muebles_opcion_a.md): Configurador 3D para muebles insignia.
* [mix_and_match.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK%20e-commerce/especificaciones/wiki/mix_and_match.md): Concepto funcional y UX de interacción.
* [arquitectura_datos.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK%20e-commerce/especificaciones/wiki/arquitectura_datos.md): Esquema de datos, tablas de compatibilidad y SAP Service Layer.

