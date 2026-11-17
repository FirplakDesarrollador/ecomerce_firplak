# Especificaciones de Producto: Spas e Hidromasajes

> [!IMPORTANT]
> **Estrategia Condensada del Segmento**:
> Consolidar el liderazgo de Firplak como referente de bienestar, spa y relajación en el hogar. La estrategia de UX/UI expone visualmente los kits y configuraciones mediante scroll interactivo, previene reclamaciones mediante advertencias rigurosas de pre-instalación eléctrica (GFCI/amperaje) e hidráulica, e incrementa la rentabilidad mediante la venta cruzada de visitas previas de inspección y paquetes de instalación certificada que habilitan la garantía de 5 años.

Este documento define la especificación técnica, funcional, logística y de experiencia de usuario (UX/UI) para la comercialización de spas, jacuzzis y tinas de hidromasaje en la plataforma Firplak E-commerce.

---

## 1. Clasificación y Tipología de Hidromasajes

Los productos de hidromasaje se organizan según su tipo de instalación y capacidad:

| Tipología | Descripción | Capacidad / Ubicación |
| :--- | :--- | :--- |
| **Jacuzzis / Spas Exentos (Freestanding)** | Estructuras autoportantes con faldón o recubrimiento sintético/acrílico. | 1 a 6+ personas (Exterior / Interior) |
| **Tinas de Hidromasaje Empotrables** | Requieren estructura de mampostería o faldón decorativo para su instalación. | 1 a 2 personas (Cuarto de baño) |
| **Bañeras de Inmersión (Sin Hidromasaje)** | Tinas sin sistema electromecánico de jets. | 1 a 2 personas |

---

## 2. Experiencia de Navegación Animada y Configuración

### A. Navegación Animada (In-Scroll Canvas Frame Scrubbing)
En la PDP con formato **Scroll Animado**, el producto se renderiza mediante el motor **Canvas Frame Scrubbing con GSAP + ScrollTrigger**:
- **Secuencia Fotográfica Pre-renderizada**: 60 a 120 fotogramas en formato WebP (<40 KB c/u) que revelan progresivamente el despiece del casco, faldones WPC, tuberías perimetrales de PVC flexible y luces LED subacuáticas sin exigir procesamiento WebGL al dispositivo móvil.
- **Conmutación Instantánea de Versiones**: Al alternar entre las versiones **Empotradas, Plus o Spa**, el `<canvas>` conmuta fluidamente a la secuencia de fotogramas correspondiente.
- **Indicadores de Acometida In-Scroll**: Al fijarse la vista al scroll (*pinning*), se proyectan overlays con datos técnicos acotados (motobomba de 2 HP, acometida 220V/110V GFCI, trampa de desagüe y escotilla de 40x40 cm).

### B. Configuración de Equipamiento y Sistema de Hydro
Cada modelo de hidromasaje incluye su **set de jets específico** integrado de fábrica:
- **Set de Jets Especificado por Producto**: La cantidad, tipo y distribución de jets están definidos específicamente según el diseño y dimensiones de cada hidromasaje/tina.
- **Potencia de Motobomba**: 
  - **Spas**: Equipados con motobombas de alta potencia de **2 HP**.
  - **Tina / Hidromasaje Estándar**: Equipados con la motobomba especificada técnicamente para su respectivo set de jets.

---

## 3. Requerimientos Técnicos y Advertencias de Pre-Instalación

Para evitar devoluciones o garantías por mala instalación, la PDP y el flujo de checkout deben mostrar de forma prominente las **condiciones previas requeridas**:

### A. Acometida Eléctrica
- **Voltaje**: Especificar si requiere **110V** o **220V Bifásico** según la motobomba y el calentador.
- **Protección**: Circuito independiente con interruptor breaker termo-magnético y protección **GFCI** (Diferencial).
- **Calibre de Cable**: Cable de cobre #10 o #8 según la carga en vatios (kW).

### B. Acometida Hidráulica y Desagüe
- Presión de agua mínima requerida para el llenado (PSI).
- Puntos de agua fría y caliente (1/2" o 3/4").
- Tubería de desagüe de 1.5" a 2" con trampa de olor.

### C. Registro de Mantenimiento y Ventilación
- Es **obligatorio** contar con un registro o escotilla de inspección técnica de mínimo **40x40 cm** para acceso a la motobomba y caja eléctrica.
- Espacio suficiente de ventilación para disipación de calor del motor.

---

## 4. Políticas Comerciales, Logísticas y Garantía

### A. Promesa de Entrega y Fabricación
- **Tiempo de entrega Estándar**: **15 días hábiles** a partir del pago confirmado (producto bajo pedido/fabricación).

### B. Restricciones Críticas de Transporte y Almacenaje
- **Entrega Estricta en Primer Piso (Nivel 0)**:
  - *Mensaje obligatorio en checkout y PDP*: *"La entrega de jacuzzis y tinas se realiza únicamente en el primer nivel del inmueble. El personal logístico no realiza maniobras de elevación por fachada, escaleras estrechas ni ascensores"*.
- **Dimensiones de Acceso**: El cliente debe verificar que las puertas, pasillos y accesos al inmueble permitan el paso del volumen de la tina embalada.

### C. Garantía Firplak
- **Casco / Fibra de Vidrio / Acrílico / Mármol Sintético**: **5 años** de garantía por defectos de fabricación o fisuras estructurales.
- **Componentes Electromecánicos (Motobomba, Blower, Panel, Luces, Calentador)**: **1 año** de garantía.
- **Plazo de Reporte de Averías**: Máximo **3 días hábiles** tras la entrega para reportar daños físicos o estéticos de transporte.

---

## 5. Integración con Servicios Técnicos de Agendamiento

El e-commerce debe ofrecer servicios complementarios para hidromasajes (detallados en [servicios.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/servicios.md)):

1. **Visita Previa de Inspección Técnica (Opcional/Pago)**:
   - Permite agendar a un técnico Firplak para evaluar si el espacio del cliente cumple con los requisitos eléctricos y de espacio antes de la compra.
2. **Servicio de Instalación Autorizada Firplak**:
   - Posibilidad de añadir al carrito el paquete de *"Instalación Certificada Firplak"* para activar cobertura extendida de garantía.
3. **Agendamiento en Línea**:
   - Integrado directamente con el sistema de citas Firplak ([integracion_servicios_pedidos.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/integracion_servicios_pedidos.md)).
