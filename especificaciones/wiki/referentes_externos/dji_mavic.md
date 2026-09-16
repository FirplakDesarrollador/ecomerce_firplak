# Referente GUI: DJI Mavic 3 Pro

> [!IMPORTANT]
> **Estrategia Condensada del Segmento**:
> Adaptación del estándar de desglose de ingeniería avanzada, gráficos interactivos de alto rendimiento, fichas técnicas desplegables y modo oscuro técnico para las líneas de Spas, Hidromasajes y Asadores de Exterior (Zona Outdoor) en Firplak.

---

## 🔗 Datos de la Fuente
- **Marca / Referente**: SZ DJI Technology Co., Ltd.
- **URL**: `https://www.dji.com/global/mavic-3-pro`
- **Categoría GUI**: Engineering Feature Showcase, Technical Data Visualization & Dark Mode Precision UI.

---

## 🎨 Principios Visuales y UI Destacados

1. **Desglose de Ingeniería Compleja (Tech Spec Overlays)**:
   - Visualización por capas de las características mecánicas y eléctricas pesadas con diagramas vectoriales interactivos.
2. **Estética Dark Mode de Alta Precisión**:
   - Fondo oscuro profundo con acentos de color vibrante (dorado, cyan, blanco puro) para denotar tecnología de vanguardia y durabilidad industrial.
3. **Sliders Comparativos e Interactivos**:
   - Herramientas interactivas antes/después y sliders de demostración funcional (ej. visión térmica, alcance de señal, modos de vuelo).
4. **Tabla de Especificaciones Dinámica**:
   - Matriz completa de especificaciones organizadas por pestañas collapsibles (Dimensiones, Acometida Eléctrica, Rendimiento, Garantía).

---

## 🛠️ Aplicación en el Sitio Web de Firplak

| Componente DJI | Módulo Firplak | Aplicación Concreta en Firplak |
| :--- | :--- | :--- |
| Diagramas de Capas de Ingeniería | `hidromasajes.md` & `zona_outdoor.md` | Desglose técnico de Spas e Hidromasajes: capas de refuerzo en mármol sintético, sistema de aislamiento térmico, distribución de tubería hídrica y jets. |
| Tabla Collapsible de Especificaciones | `zona_outdoor.md` (Asadores Acero 304 & Saunas) | Ficha de instalación para obra civil: acometida eléctrica (110V/220V), consumo de agua (litros), resistencia de carga estructural y especificación de acero inoxidable 304. |
| Dark UI & Tech Accents | `sistema_diseno.md` (Sección Outdoor/Spas) | Interfaz visual en modo oscuro elegante para la línea de Spas y Asadores de exterior Firplak. |

---

## 📐 Especificación Técnica para Desarrollo

- **Componentes Ficha Técnica**: `<TechSpecsAccordion />` renderizando metadatos JSON estructurados desde la tabla `PRODUCT` en Supabase.
- **Diagramas Vectoriales**: Gráficos SVG interactivos con marcadores de punto de interés (*tooltips* reactivos).
