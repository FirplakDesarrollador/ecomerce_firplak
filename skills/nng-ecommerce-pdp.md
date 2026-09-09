# Directrices UX de Nielsen Norman Group para Páginas de Producto (PDP)

> **Fuente**: [Nielsen Norman Group — 11 UX Guidelines for Ecommerce Product Pages](https://www.nngroup.com/articles/ecommerce-product-pages/) (Investigación por Katie Sherwin sobre 49 sitios de comercio electrónico).

La premisa central de NN/g: **En ecommerce, los compradores no pueden tocar el producto, hablar con un vendedor ni probarlo antes de comprar.** La PDP (Product Detail Page) debe responder todas las dudas del usuario con la menor fricción e interacción posible. Una PDP deficiente genera dos consecuencias graves:
1. **Abandono por incertidumbre** (*"Ante la duda, mejor no compro"*).
2. **Compra errónea por suposiciones falsas**, generando clientes insatisfechos, disputas y altas tasas de devolución.

---

## 1. Clasificación de Características de la PDP: Pirámide de Prioridades

NN/g categoriza los elementos de una página de producto en tres niveles:

```
                  ▲
                 / \
                /   \     Nivel 3: Fancy Features
               /  ★  \    (AR, 360°, Try-on, Customizer)
              /-------\   *Solo si la ejecución es impecable*
             /         \
            /  NICE TO  \   Nivel 2: Nice-to-Have
           /    HAVE     \  (Reviews, Video, Zoom, Recomendaciones)
          /---------------\
         /                 \
        /     MUST-HAVE     \  Nivel 1: Requisitos Mínimos Absolutos
       /_____________________\ (Nombre, Fotos, Precio, Specs, Stock, CTA)
```

### Nivel 1: Must-Have (Obligatorios e Innegociables)
- **Nombre de producto descriptivo**: claro, específico y sin jerga críptica interna.
- **Imagen reconocible y fidedigna**: representativa del artículo real.
- **Vista ampliada de alta resolución**: capacidad de ver detalles finos y acabados.
- **Precio explícito y cargos adicionales**: mostrar el precio final, impuestos y costos específicos sin sorpresas.
- **Opciones de producto y selectores claros**: talla, color, material, acabado o configuración técnica.
- **Disponibilidad y stock visible**: informar de inmediato si una variante está agotada o bajo pedido antes de interactuar.
- **Llamado a la acción (CTA) claro para añadir al carrito**: ubicación prominente y botón inequívoco.
- **Feedback inmediato y visible tras agregar al carrito**: confirmación indudable de que el ítem ingresó al pedido.
- **Descripción concisa e informativa**: enfoque en beneficios, uso y specs concretas, eliminando texto de relleno publicitario (*marketing fluff*).

### Nivel 2: Nice-to-Have (Esperados por el comprador moderno)
- **Calificaciones y reseñas de clientes o expertos**: filtrables y ordenables por puntuación.
- **Vistas fotográficas complementarias**: rotaciones, detalles en primer plano, fotos del interior y fotos en contexto de uso real.
- **Video demostrativo de producto**: muestra física de dimensiones y operatividad.
- **Herramienta de zoom o paneo**: inspección visual profunda de texturas y terminaciones.
- **Recomendaciones de productos asociados o complementarios**: sugerencias altamente pertinentes (*Cross-selling*).
- **Herramientas de Wishlist o lista de deseos**.

### Nivel 3: Fancy Features (Opcionales de alto impacto — Exigen ejecución impecable)
> [!WARNING]
> Si estas funciones presentan fallas, lentitud o alta fricción, generan frustración y dañan la credibilidad del sitio. Solo deben incluirse si aportan utilidad real y operan con fluidez técnica absoluta.
- Visualizadores 3D en tiempo real y configuradores interactivos (*Mix & Match*).
- Fotos y videos subidos directamente por compradores en las reseñas.
- Filtros avanzados y metadatos en las opiniones (ej. edad del usuario, dimensiones del espacio, tipo de proyecto).
- Fotografías 360° o scrubbing interactivo de fotogramas.
- Opciones de compra recurrente o agendamiento técnico.

---

## 2. Anticipar y Responder Preguntas: Texto vs. Fotografía

### Copywriting Técnico: Eliminar el "Marketing Fluff"
1. **Patrón de escaneo en F**: Los usuarios leen las primeras líneas de un bloque y el inicio de cada renglón. Lo esencial (medidas, materialidad, qué incluye, tiempos de entrega) debe estar en el primer impacto visual, nunca oculto en el cuarto párrafo.
2. **Aclarar terminología especializada de inmediato**: Si se emplea un término comercial o técnico de la marca (ej. *"Mármol sintético Gelcoat"*, *"Madera RH"*, *"Cartucho cerámico 35mm"*), debe existir una micro-aclaración explícita de qué significa para el cliente (ej. *"Resistente 100% a la humedad, no se hincha"*).
3. **Reducción de devoluciones**: Los usuarios no temen comprar en línea cuando la información dimensional y técnica es exhaustiva y transparente.

### El Poder Decisivo de las Imágenes en Contexto
- **Evidencia empírica NN/g**: En pruebas de usabilidad, múltiples usuarios completaron su decisión de compra examinando **únicamente las fotos de detalle e interior**, sin leer una sola línea de texto.
- **Ángulos indispensables**:
  - Vista general frontal/isométrica.
  - Vistas de escala humana o espacial (contexto de baño/cocina amoblado).
  - Vistas de interior (capacidad de almacenamiento, distribución de desagües o gavetas).
  - Swatches de textura y macros del acabado físico bajo iluminación real.

---

## 3. Consistencia para Facilitar la Comparación

Los compradores comparan alternativas constantemente antes de añadir al carrito. NN/g identifica **4 niveles de consistencia crítica**:

| Nivel | Principio UX de NN/g | Implementación Práctica |
| :--- | :--- | :--- |
| **1. Entre Variantes** | Misma métrica para todas las opciones | Si una variante expresa volumen/capacidad, las demás deben usar la misma unidad y no cambiar a precios unitarios abstractos. |
| **2. Dentro de la Categoría** | Ficha técnica y atributos comparables | Todos los productos de la misma categoría deben listar en el mismo orden sus specs: Largo × Ancho × Profundidad, Peso, Capacidad y Diámetro de Desagüe. Usar tablas estandarizadas. |
| **3. A Nivel Global del Sitio** | Heurística de Consistencia (#4 Nielsen) | La estructura visual de la PDP debe ser uniforme entre categorías; la navegación, ubicación del precio, selector y carrito deben ser familiares. |
| **4. Frente a Competidores** | Políticas clave visibles arriba | Casper vs. Tuft & Needle: mostrar garantías y envío gratuito directamente en la PDP; forzar al usuario a ir al checkout para saber si el envío es gratis destruye la conversión. |

---

## 4. Arquitectura de Reseñas y Experiencias de Clientes

### El Patrón del "Peor Escenario" (*What's the worst that can happen*)
- Los usuarios buscan deliberadamente las **reseñas negativas** para evaluar el riesgo real del producto. Si un sitio oculta las opiniones críticas o solo muestra 5 estrellas, pierde credibilidad instantáneamente.
- La presencia de críticas menores neutrales combinadas con respuestas claras de soporte aumenta la tasa de conversión sobre los productos con reviews 100% perfectas pero sospechosas.

### Requisitos del Módulo de Reseñas según NN/g:
1. **Resumen visual de distribución**: Gráfico de barras de 1 a 5 estrellas con promedio general visible al lado del título del producto.
2. **Filtros rápidos por valoración**: Botones para ver reseñas de 1, 2, 3, 4 y 5 estrellas por separado.
3. **Metadatos contextuales del comprador**:
   - Etiqueta de **Comprador Verificado** (*Verified Purchase*).
   - Datos de perfil relevantes (ej. *"Instalador / Constructor"*, *"Remodelación de hogar"*, *"Uso residencial"*).
   - Tiempo de uso reportado antes de escribir la reseña.

---

## 5. El Proceso de Compra: Selector, Disponibilidad y Feedback del Carrito

### Claridad en Variantes y Opciones
- Los selectores (swatches de color, dimensiones, orientación izquierda/derecha de grifería o poceta) deben cambiar el precio, SKU, fotos y estado de stock en tiempo real.
- Si una opción no está disponible, debe indicarse como inactiva con badge de *"Agotado"* o *"Fabricación bajo pedido (X días)"* antes de que el usuario haga clic.

### El Problema Crítico del Feedback Inadecuado al Añadir al Carrito
- **Falla común observada por NN/g**:
  - Usuarios que no saben si el producto entró al carrito y pulsan repetidamente el botón, generando pedidos con cantidades duplicadas indeseadas.
  - Usuarios que creen haber añadido el ítem, van al checkout y descubren el carrito vacío, abandonando la compra por frustración.
- **Solución certificada por NN/g**:
  - **Opción A (Recomendada para compras asistidas/ticket alto)**: Cajón lateral persistente (*Drawer / Slide-over*) o modal emergente conspicuo que confirme:
    1. Imagen y nombre de la variante exacta agregada.
    2. Subtotal actualizado.
    3. Botón primario: *"Proceder al pago / Ver Carrito"*.
    4. Botón secundario visible: *"Seguir comprando"*.
  - **Opción B (Página intersticial de confirmación)**: Como el caso de Chewy.com analizado por NN/g, siempre incluyendo un enlace claro de retorno para continuar explorando sin recurrir al botón "Atrás" del navegador.

---

## 6. Lista de Chequeo Rápida para Auditoría de PDP (Checklist NN/g)

- [ ] ¿El título del producto es claro, específico y libre de códigos crípticos?
- [ ] ¿El precio principal es visible sin hacer scroll excesivo y desglosa impuestos/adicionales?
- [ ] ¿Hay al menos 4 imágenes de alta resolución que muestren frente, escala, detalles y contexto real?
- [ ] ¿Los primeros 2 renglones de la descripción van al grano y explican los beneficios y materiales reales?
- [ ] ¿Las variantes (color, medidas) actualizan fotos, precio y tiempo de entrega inmediatamente?
- [ ] ¿Se informa con claridad la promesa de entrega y la política de envío desde la ficha de producto?
- [ ] ¿Al hacer clic en "Añadir al Carrito", el feedback visual es instantáneo, inequívoco y ofrece la opción de seguir comprando?
- [ ] ¿Las opiniones de usuarios permiten filtrar las calificaciones bajas y muestran si la compra fue verificada?
