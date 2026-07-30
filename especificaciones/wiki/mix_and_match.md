# Especificación: Módulo Visualizador Mix & Match

Esta página detalla el comportamiento, lógica visual e interacción del configurador interactivo "Mix & Match" para lavamanos y muebles de baño.

---

## 1. Concepto Funcional

El visualizador permite a los clientes combinar e interactuar con diferentes lavamanos y muebles de forma dinámica y alineada verticalmente. Las imágenes del lavamanos se alinean y superponen sobre la imagen del mueble, simulando visualmente ambos productos instalados juntos en un solo entorno de baño y ofreciendo una experiencia interactiva fluida.

```
          ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
          │  Lavamanos   │ ◄ │  Lavamanos   │ ► │  Lavamanos   │  (Fila Superior - Desplazamiento Lateral)
          │  Modelo A    │   │  Modelo B    │   │  Modelo C    │
          └──────────────┘   └──────────────┘   └──────────────┘
                                     ▲
                          Superposición y Alineación
                            (Simulación de Instalación)
                                     ▼
          ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
          │    Mueble    │ ◄ │    Mueble    │ ► │    Mueble    │  (Fila Inferior - Desplazamiento Lateral)
          │  Modelo X    │   │  Modelo Y    │   │  Modelo Z    │
          └──────────────┘   └──────────────┘   └──────────────┘
```

---

## 2. Comportamiento y UX de Interacción

### Desplazamiento Lateral (Deslizar / Carrusel Sincronizado)
*   **Fila Superior (Lavamanos):** El usuario puede arrastrar o usar botones laterales de navegación para cambiar el lavamanos actual.
*   **Fila Inferior (Muebles):** El usuario puede deslizar lateralmente para cambiar el mueble base.
*   **Coincidencia de Ajuste y Superposición (Simulación de Instalación):**
    *   Los assets de imagen de lavamanos y muebles deben poseer dimensiones proporcionales consistentes.
    *   La imagen del lavamanos se alinea y superpone directamente sobre la parte superior del mueble, proyectando una visualización unificada que simula la instalación física real del lavamanos montado sobre el mueble.

### Lógica de Variación y Colores
1.  **Selección de Color del Mueble:** Cada mueble puede cambiar su color (ej. Madera, Blanco, Grafito) de forma dinámica.
2.  **Validación de Compatibilidad en Base de Datos:**
    *   Al cambiar el Lavamanos (A), se consultará la base de datos para obtener el listado de Muebles (X, Y) que son físicamente compatibles con sus dimensiones y desagües.
    *   Si el mueble seleccionado no es compatible, el sistema sugerirá la combinación recomendada o auto-ajustará al mueble compatible más cercano para evitar combinaciones inviables.

### Cantidades y Adición al Carrito
*   **Selector de Cantidad:** Permite especificar la cantidad requerida para el conjunto completo o de forma individual para el lavamanos y el mueble.
*   **Compra en Combo:** El botón de "Añadir al Carrito" agrega los SKUs correspondientes (Lavamanos SKU y Mueble SKU) vinculándolos en el pedido, permitiendo aplicar descuentos promocionales si aplica.

---

## 3. Requerimientos de Assets y Multimedia

*   **Imágenes Transparentes (PNG/WebP):** Las imágenes deben tener fondo transparente y estar recortadas exactamente con la misma proporción y punto de anclaje (bounding box alineada) para lograr un montaje perfecto por CSS overlay.
*   **Renderización Dinámica (Overlay):** En lugar de imágenes estáticas de combinaciones precalculadas, el frontend superpone la imagen del Lavamanos seleccionada (`image_url`) directamente sobre la imagen del Mueble seleccionada, logrando la simulación exacta de la instalación conjunta en tiempo real.
