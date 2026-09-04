# Especificaciones de Producto: Cocinas Integrales y Mobiliario

> [!IMPORTANT]
> **Estrategia Condensada del Segmento**:
> Posicionar cocinas modulares y completas de alta gama combinando tableros RH y superficies minerales (Quartzstone y mármol sintético). La estrategia de UX neutraliza el error humano más costoso de la categoría exigiendo la confirmación interactiva de orientación de la poceta (Izquierda o Derecha) antes de la compra, complementada con venta cruzada de grifería flexible y canastillas de acero.

Este documento define la especificación técnica, funcional, logística y de experiencia de usuario (UX/UI) para la comercialización de **Cocinas Integrales, Mesones y Muebles de Cocina** en la plataforma Firplak E-commerce.

---

## 1. Clasificación y Tipología de Cocinas

La categoría abarca desde conjuntos integrales completos hasta módulos individuales configurables para optimización del espacio:

| Tipología | Descripción | Medidas Típicas / Opciones |
| :--- | :--- | :--- |
| **Cocinas Integrales Completas** | Paquetes completos compuestos por mueble superior, mueble inferior, mesón con lavaplatos y espacio para estufa/campana. | 1.20 m, 1.50 m, 1.80 m y 2.00 m lineales. |
| **Muebles Solos Inferiores** | Módulos base a piso o suspendidos con cubierteros, cajones caceroleros y espacio para empotrar grifería/desagüe. | Muebles de 100 cm a 200 cm en madera RH. |
| **Muebles Solos Superiores** | Alacenas con puertas batientes o pistones de gas, locero/platero de acero y espacio para campana extractora. | Muebles aéreos de 120 cm a 200 cm (altura 60 cm a 75 cm). |
| **Mesones de Cocina** | Superficies continuas con poceta integrada o perforada para submontar en materiales de alta resistencia. | **Quartzstone** y **Mármol Sintético**. |
| **Lavaplatos Independientes** | Pocetas individuales o dobles para sobreponer o submontar. | Acero inoxidable AISI 304 y Mármol Sintético. |
| **Barras y Módulos Auxiliares** | Soluciones multifuncionales para desayunador o comedor auxiliar. | **Línea Barra Zafiro** y muebles despensa. |

---

## 2. Materiales, Herrajes y Especificación de Calidad

### A. Superficies de Mesón: Quartzstone vs Mármol Sintético
- **Quartzstone (Gama Alta)**:
  - Composición: 93% cuarzo natural cristalizado y 7% resinas poliméricas avanzadas.
  - Gran resistencia a rayones de cuchillos, manchas de vino, café, aceites y ácidos cítricos.
  - Acabado pulido brillante o mate satinado con bordes biselados o pulidos en máquina CNC.
- **Mármol Sintético Sanitario**:
  - Solución económica y funcional de alta durabilidad con recubrimiento en gelcoat resistente a manchas térmicas moderadas (hasta 120 °C indirectos).

### B. Estructura de Muebles y Herrajería
- **Tableros RH (Resistente a la Humedad)**:
  - Densidad media de 650 kg/m³ tratada con resinas de melamina para repeler vapor y derrames accidentales.
  - Emisiones de formaldehído bajo norma ambiental internacional (E1).
- **Herrajes de Movimiento**:
  - Bisagras metálicas niqueladas con amortiguador de cierre suave (*soft-close*) probado a 50.000 ciclos.
  - Rieles telescópicos de extensión total para cajones de servicio pesado (hasta 30 kg de carga).
  - Pistones de gas presurizado para puertas abatibles superiores.

---

## 3. Requerimientos Técnicos y Pre-Instalación

1. **Orientación de Poceta (Parámetro Crítico)**:
   - Toda cocina o mesón requiere especificar si el lavaplatos va a la **Izquierda** o a la **Derecha**, dependiendo de la ubicación del desagüe existente en el muro del cliente.
2. **Acometidas de Gas y Campana**:
   - Salida de gas flexible de 1/2 pulgada con llave de paso accesible.
   - Perforación o salida a exterior para ducto de ventilación de campana extractora (diámetro estándar de 4 a 6 pulgadas).
3. **Plomería y Desagüe**:
   - Tubería sanitaria de PVC de **2 pulgadas** con trampa de grasas en la bajante.
   - Suministro de agua con llaves de regulación independientes para agua fría y caliente.

---

## 4. Políticas Comerciales, Logísticas y Garantía

### A. Tiempos de Entrega
- **Fabricación Estándar**: **15 días hábiles** a partir de confirmación del pago.
- **Módulos en Envío Rápido**: Muebles y mesones estándar en color humo o blanco despachables en <72 horas.

### B. Restricciones de Transporte
- **Entrega Estricta en Primer Piso (Nivel 0)**:
  - La transportadora no traslada módulos pesados de cocina por escaleras de caracol ni elevadores no industriales.

### C. Garantía Firplak
- **Mesones en Quartzstone y Mármol**: **5 años** de garantía estructural.
- **Muebles de Cocina en Madera RH**: **3 años** en estructura melamínica.
- **Herrajes y Accesorios Móviles**: **1 año**.
- **Plazo de Reporte de Averías**: Máximo **3 días hábiles** tras la entrega.

---

## 5. Experiencia UI/UX en la PDP y Configurador

1. **Selector Visual Interactivo de Orientación (L/R)**:
   - Visualización gráfica que rota o conmuta el render de la cocina entre:
     - `Poceta a la Izquierda / Estufa a la Derecha`
     - `Poceta a la Derecha / Estufa a la Izquierda`
   - Bloqueo de confirmación en el checkout para asegurar que el cliente verificó su tubería.
2. **Selector de Acabados de Melamina y Mesón**:
   - Swatches de textura con degradados reales (Blanco, Humo, Mitte, Tabaco Chic, Quartzstone Blanco Estelar, Negro Marquina).
3. **Cross-Selling Recomendado**:
   - Grifería monocontrol cuello de ganso con chorro tipo ducha (especificada en [accesorios.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/accesorios.md) y [griferia_plomeria.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/griferia_plomeria.md)).
   - Canastilla de acero inoxidable de 3.5 pulgadas con trampa de sólidos.
   - Paquete de instalación certificada y nivelación profesional (detallado en [servicios.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/servicios.md)).
