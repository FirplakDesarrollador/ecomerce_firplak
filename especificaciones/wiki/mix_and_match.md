# Especificación: Módulo Visualizador Mix & Match

> [!IMPORTANT]
> **Estrategia Condensada del Segmento**:
> Empoderar al comprador permitiéndole personalizar su conjunto de baño mediante un carrusel interactivo sincronizado en dos niveles (lavamanos superior + mueble inferior). El frontend consulta en tiempo real la matriz de compatibilidad en Supabase, asegurando que solo se puedan combinar piezas dimensionalmente exactas, e inyecta ambos SKUs al carrito con un incentivo de descuento por bundle para elevar el ticket promedio.

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

### Lógica de Variaciones, Colores Independientes y Complementos
1.  **Selección de Color Independiente:**
    *   **Color del Mueble:** Se puede alternar el acabado o color del mueble (ej. Madera, Blanco, Grafito, Roble) de forma independiente.
    *   **Color del Lavamanos:** Se puede alternar la variación de color o acabado del lavamanos (ej. Blanco, Negro Mate, Gris Marmoleado) de forma independiente sin cambiar el modelo.
2.  **Adición de Complementos (Add-ons):**
    *   El usuario puede seleccionar e incorporar complementos opcionales al conjunto en tiempo real:
        *   **Griferías y Plomería:** Selección de grifería compatible (alta, baja, monocontrol) y desagües/sifones según la matriz de compatibilidad en [griferia_plomeria.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/griferia_plomeria.md) y [accesorios.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/accesorios.md).
        *   **Incrustaciones:** Detalles decorativos o apliques para el mueble/lavamanos.
        *   **Accesorios de Confort:** Espejos, repisas de vidrio templado y toalleros.
    *   Los complementos seleccionados se previsualizan e integran en la combinación visual (cuando aplique asset 2D) y agregan sus SKUs independientes al total de la compra.
3.  **Validación de Compatibilidad en Base de Datos:**
    *   Al cambiar el Lavamanos (A), se consultará la base de datos para obtener el listado de Muebles (X, Y) y Griferías/Complementos que son físicamente compatibles con sus dimensiones, orificios y desagües.
    *   Si el mueble o complemento seleccionado no es compatible, el sistema sugerirá la combinación recomendada o auto-ajustará a la opción compatible más cercana.

### Cantidades y Adición al Carrito
*   **Selector de Cantidad:** Permite especificar la cantidad requerida para el conjunto completo o de forma individual para cada componente (lavamanos, mueble y complementos).
*   **Compra en Combo / Configurado:** El botón de "Añadir al Carrito" agrega la lista completa de SKUs correspondientes (SKU Lavamanos + SKU Mueble + SKUs de Complementos) vinculándolos bajo el mismo identificador de conjunto configurado en el pedido.

---

## 3. Requerimientos de Assets y Multimedia

*   **Imágenes Transparentes (PNG/WebP):** Las imágenes deben tener fondo transparente y estar recortadas exactamente con la misma proporción y punto de anclaje (bounding box alineada) para lograr un montaje perfecto por CSS overlay.
*   **Renderización Dinámica (Overlay):** En lugar de imágenes estáticas de combinaciones precalculadas, el frontend superpone la imagen del Lavamanos seleccionada (`image_url`) directamente sobre la imagen del Mueble seleccionada, logrando la simulación exacta de la instalación conjunta en tiempo real.
