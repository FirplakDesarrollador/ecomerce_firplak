# Especificaciones de Segmento: Carpintería de Obra (Canal B2B / Institucional)

> [!IMPORTANT]
> **Estrategia Condensada del Segmento**:
> Captar y fidelizar el mercado corporativo de constructoras, firmas de arquitectura y proyectos masivos (VIS y No-VIS). La estrategia opera mediante listas de precios mayoristas en SAP Service Layer, carga web de planos (.dwg/.pdf), despachos parciales coordinados por hitos de obra y trazabilidad en tiempo real del estado de producción en planta mediante Supabase OAuth.

Este documento define la especificación comercial, técnica, operativa y de interfaz para la unidad de negocio **Carpintería de Obra y Atención a Constructoras** en Firplak E-commerce.

---

## 1. Propósito y Modelo de Negocio B2B

La unidad de **Carpintería de Obra** atiende las necesidades de constructoras, firmas de arquitectura, contratistas y promotores inmobiliarios que requieren soluciones masivas, estandarizadas y modulares para proyectos de vivienda (VIS y No-VIS), hoteles y obras comerciales:

| Segmento | Necesidad Principal | Solución Firplak |
| :--- | :--- | :--- |
| **Vivienda VIS / VIP** | Costo optimizado, durabilidad y rapidez de instalación masiva. | Combos de cocina y baño estandarizados en medidas 1.00 m a 1.50 m en RH con mesones integrales. |
| **Vivienda No-VIS / Media y Alta** | Diseño arquitectónico, materiales nobles y personalización por tipología. | Cocinas con mesones en Quartzstone, muebles de baño con iluminación LED, closets y vestieres modulares. |
| **Institucional / Dotacional** | Alto tráfico, higiene y resistencia al vandalismo. | Lavamanos colectivos, orinales en mármol sintético y tinas de aseo industrial. |

---

## 2. Portafolio de Soluciones Institucionales

1. **Cocinas de Obra**:
   - Módulos serializados de 1.20 m, 1.50 m y 1.80 m con herrajes reforzados para entregas masivas por torres.
2. **Muebles y Mesones de Baño para Proyectos**:
   - Muebles suspendidos o a piso fabricados en tableros RH hidrófugos con mesones de lavamanos integrados en mármol sintético (cero filtración perimetral).
3. **Closets y Puertas**:
   - Puertas entamboradas y closets modulares con distribución estandarizada de entrepaños y maleteros.
4. **Soluciones Colectivas de Aseo**:
   - Lavamanos corrida múltiple de 2, 3 o 4 pozos para colegios, centros comerciales y hospitales.

---

## 3. Integración con ERP SAP y Seguimiento en Planta

Para dar cumplimiento a los contratos de suministro a constructoras, la plataforma se integra directamente con el backend corporativo:

1. **Cotización B2B y Listas de Precios Mayoristas (SAP Service Layer)**:
   - El sistema vincula al cliente corporativo autenticado con su respectiva **Lista de Precios B2B** (Tier 1, Tier 2 o Precios de Licitación) configurada en SAP Business One.
2. **Trazabilidad en Planta (Supabase + OAuth)**:
   - Siguiendo el [Requerimiento 02](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/integracion_servicios_pedidos.md), los directores de obra pueden consultar en tiempo real el estado de fabricación de sus lotes:
     - `En corte y dimensionado` -> `En enchape de cantos` -> `En armado` -> `Control de calidad` -> `Listo para despacho`.
3. **Despachos Programados por Hitos de Obra**:
   - División de órdenes maestras en entregas parciales coordinadas con el cronograma de avance de obra (ej. Entrega de Torre 1, Torre 2).

---

## 4. Requisitos Contractuales, Certificaciones y Garantía

- **Pólizas y Garantías de Estabilidad**:
  - Emisión de pólizas de estabilidad y calidad de obra para respaldar contratos constructivos.
- **Certificaciones de Materiales**:
  - Tableros RH con certificación de bajas emisiones de formaldehído (Norma E1).
  - Componentes eléctricos certificados bajo reglamento **RETIE** (para iluminación integrada o tomas).
- **Garantías B2B**:
  - **5 años** en superficies de mármol sintético y Quartzstone.
  - **3 años** en muebles melamínicos de obra instalados bajo supervisión técnica oficial.

---

## 5. Experiencia UI/UX en el E-commerce (Landing B2B)

1. **Ruta Dedicada `/carpinteria-obra`**:
   - Landing page corporativa orientada a especificadores, directores de compras y arquitectos.
   - Casos de éxito y galerías de proyectos entregados en Colombia.
2. **Formulario de Cotización de Pliegos**:
   - Campos estructurados: Nombre de constructora, NIT, nombre del proyecto, número de unidades, ciudad y tipo de vivienda.
   - Carga de archivos técnicos: Soporte para adjuntar planos y memorias técnicas en formatos `.dwg`, `.pdf` o `.zip`.
3. **Descarga de Catálogo de Carpintería de Obra**:
   - Acceso directo al PDF oficial con especificaciones técnicas de licitación y cotas dimensionales.
