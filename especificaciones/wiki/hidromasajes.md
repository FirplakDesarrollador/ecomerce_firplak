# Especificaciones de Producto: Spas e Hidromasajes

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

### Experiencia de Navegación Animada (In-Scroll)
En la PDP con formato **Scroll Animado**, el cliente puede alternar en tiempo real entre las versiones **Empotradas, Plus o Spa**:
- **Renderizado Dinámico al Scroll**: La secuencia animada y renders del producto se actualizan fluidamente mostrando los componentes de cada versión (ej. adición del faldón sintético en versión Spa o el acabado empotrado).
- **Indicadores de Acometida In-Scroll**: Al seleccionar cada versión, el scroll despliega automáticamente los datos clave graficados (potencia de motobomba requerida, esquema de desagüe y espacio de escotilla de mantenimiento).

### Kits de Equipamiento Predeterminados
1. **Kit Básico / Estándar**:
   - Motobomba de agua de alto rendimiento.
   - Sistema de hidromasaje (Jets orientables de agua).
   - Botón neumático de encendido (On/Off).
   - Control de aire manual.
   - Succión de seguridad y desagüe.

2. **Kit Intermedio (Confort)**:
   - Todo lo del Kit Básico.
   - Sistema de iluminación LED / Cromoterapia (cambio de color).
   - Microjets dorsales/plantares.
   - Calentador de agua eléctrico mantiene/eleva temperatura.

3. **Kit Premium (Lujo / Spa Complet):**
   - Todo lo del Kit Intermedio.
   - Sistema de aeromasaje (Blower de burbujas de aire).
   - Panel de control digital / táctil.
   - Sistema de desinfección (Ozonificador / Filtro de cartucho).
   - Cascadas decorativas y llenado integrado.
   - Grifería monocontrol y regadera de mano integrada.

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

---

## 5. Integración con Servicios Técnicos de Agendamiento

El e-commerce debe ofrecer servicios complementarios para hidromasajes:

1. **Visita Previa de Inspección Técnica (Opcional/Pago)**:
   - Permite agendar a un técnico Firplak para evaluar si el espacio del cliente cumple con los requisitos eléctricos y de espacio antes de la compra.
2. **Servicio de Instalación Autorizada Firplak**:
   - Posibilidad de añadir al carrito el paquete de *"Instalación Certificada Firplak"* para activar cobertura extendida de garantía.
3. **Agendamiento en Línea**:
   - Integrado directamente con el sistema de citas Firplak (`integracion_servicios_pedidos.md`).
