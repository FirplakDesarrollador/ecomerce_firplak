---
name: laws-of-ux
description: Marco heurístico y psicológico basado en las 26 Leyes de UX (Jon Yablonski / lawsofux.com) para acompañar, auditar y validar de forma continua cada cambio de diseño UI/UX y desarrollo frontend.
---

# Laws of UX Skill: Marco Heurístico y Psicológico de Diseño

Este skill establece el estándar de psicología cognitiva y principios de interacción humana para **auditar, diseñar y validar cualquier cambio de interfaz (UI), flujo de usuario (UX) o componente interactivo** en la plataforma, basado en el compendio de [Laws of UX](https://lawsofux.com/).

---

## 1. Las 4 Dimensiones Psicológicas de UX

```
+------------------------------------------------------------------------------------+
| 1. COGNICIÓN & DECISIÓN   | Hick, Miller, Carga Cognitiva, Ockham, Tesler, Sesgos |
+------------------------------------------------------------------------------------+
| 2. PERCEPCIÓN & GESTALT   | Proximidad, Región Común, Similitud, Von Restorff      |
+------------------------------------------------------------------------------------+
| 3. ERGONOMÍA & PERFORMANCE| Fitts, Doherty (<400ms), Jakob, Postel, Usuario Activo |
+------------------------------------------------------------------------------------+
| 4. EMOCIÓN & MEMORIA      | Peak-End, Zeigarnik, Goal-Gradient, Efecto Estético     |
+------------------------------------------------------------------------------------+
```

---

## 2. Dimensión 1: Cognición y Toma de Decisiones

Reduce la fatiga mental del usuario para maximizar la claridad y la tasa de conversión.

| Ley | Definición Psicológica | Regla Operativa en UI/Frontend |
| :--- | :--- | :--- |
| **Hick’s Law** | El tiempo de decisión crece con la cantidad y complejidad de opciones. | Limitar opciones concurrentes en menús y PDPs. Dividir formularios complejos en pasos secuenciales. Priorizar una acción principal por vista. |
| **Miller’s Law** | La memoria de trabajo retiene $7 \pm 2$ paquetes de información. | Organizar listados extensos en grupos (*chunking*) semánticos de 5 a 7 ítems. Evitar listas planas interminables. |
| **Cognitive Load** | Capacidad mental finita dividida en intrínseca, germana y extrínseca. | Eliminar ruido visual superfluo (animaciones sin propósito, bordes innecesarios) para que el cerebro se enfoque en el producto. |
| **Occam’s Razor** | La solución más simple con menos supuestos es superior. | Ante dos diseños viables para un selector o modal, elegir el que requiera menos clics, inputs y dependencias visuales. |
| **Tesler’s Law** | Todo sistema tiene una complejidad inherente irreducible. | No trasladar la complejidad del inventario, logística o variantes al cliente; el frontend y backend deben absorber esa lógica. |
| **Choice Overload** | Demasiadas opciones causan parálisis por análisis y abandono. | Usar filtros preseleccionados, tags de "Más Vendido" o "Recomendado" para guiar la decisión rápida. |
| **Mental Model** | El usuario opera según su comprensión previa de sistemas afines. | Mantener íconos universales (lupa para búsqueda, bolsa/carrito para checkout, engrane para ajustes) sin reinvenciones abstractas. |

---

## 3. Dimensión 2: Percepción Visual y Principios Gestalt

El cerebro humano agrupa y jerarquiza patrones automáticamente.

| Ley | Definición Psicológica | Regla Operativa en UI/Frontend |
| :--- | :--- | :--- |
| **Law of Proximity** | Elementos visualmente cercanos se perciben como un conjunto unificado. | El espaciado entre el label y su input debe ser menor que la separación con el siguiente campo. Relacionar precios directamente con su botón de compra. |
| **Law of Common Region** | Los límites compartidos (cards, paneles) generan pertenencia. | Usar tarjetas de producto con bordes o fondos sutiles diferenciados para encapsular imagen, título, precio y botón. |
| **Law of Similarity** | Elementos con igual aspecto (color, forma) cumplen funciones análogas. | Los botones primarios deben compartir el mismo estilo cromático en toda la aplicación; los secundarios deben tener un peso visual inferior consistente. |
| **Law of Uniform Connectedness** | Enlaces visuales explícitos crean la asociación más fuerte. | Usar líneas conectoras en *steppers* de checkout o migas de pan (*breadcrumbs*) para explicitar progreso. |
| **Law of Prägnanz** | El cerebro reduce imágenes complejas a formas geométricas simples. | Evitar composiciones saturadas. Emplear retículas limpias, tipografías legibles y jerarquías claras. |
| **Von Restorff Effect** | El objeto que difiere visualmente del resto es el más recordado y cliqueado. | El CTA principal ("Añadir al carrito", "Pagar ahora") debe ser único y contrastar intencionalmente con la paleta neutra circundante. |
| **Selective Attention** | La atención filtra estímulos secundarios enfocándose en la meta. | En el checkout, remover la navegación global (header masivo, banners) para canalizar el 100% de la atención al pago. |

---

## 4. Dimensión 3: Ergonomía, Interacción y Rendimiento

La experiencia táctil, física y la velocidad de respuesta técnica.

| Ley | Definición Psicológica | Regla Operativa en UI/Frontend |
| :--- | :--- | :--- |
| **Fitts’s Law** | El tiempo para alcanzar un blanco depende de su distancia y tamaño. | Touch targets mínimos de $44 \times 44$ px en mobile. Botones de acción crítica adheridos a la zona cómoda del pulgar (bottom bar). |
| **Doherty Threshold** | Respuesta del sistema en $< 400$ ms garantiza retención y estado de *flow*. | Respuestas instantáneas en clicks y toggles; skeletons inmediatos durante fetch; mutaciones optimistas en carrito y favoritos. |
| **Jakob’s Law** | Los usuarios pasan más tiempo en otros sitios y prefieren que el tuyo funcione igual. | Carrito siempre en la esquina superior derecha; barra de búsqueda accesible; navegación móvil con tabs inferiores o drawer intuitivo. |
| **Postel’s Law** | Sé tolerante en lo que recibes y estricto en lo que envías. | Formatear automáticamente teléfonos y tarjetas con espacios; aceptar números con o sin guiones; tolerar errores menores de tipografía en búsqueda. |
| **Paradox of Active User** | El usuario no lee manuales; aprende usando la interfaz inmediatamente. | Descartar tooltips obligatorios o intros forzadas. La UI debe comunicar su función por affordance visual directo. |

---

## 5. Dimensión 4: Emoción, Memoria y Tiempo

Optimización del impacto emocional residual y la retención del cliente.

| Ley | Definición Psicológica | Regla Operativa en UI/Frontend |
| :--- | :--- | :--- |
| **Peak-End Rule** | La memoria juzga una experiencia por su punto álgido y su final. | El proceso de compra debe culminar con una pantalla de confirmación clara, reconfortante y con microinteracción de éxito memorable. |
| **Zeigarnik Effect** | Las tareas inconclusas quedan fijas en la memoria. | Mostrar barras de progreso o porcentaje completado en el perfil o checkout ("Paso 2 de 3: Envío"). Recordar carritos abandonados. |
| **Goal-Gradient Effect** | El esfuerzo se acelera conforme el usuario ve la meta más cerca. | Indicar cercanía al beneficio: "¡Te faltan $50.000 para envío gratis!" o iniciar el checkout mostrando el paso 1 ya verificado. |
| **Serial Position Effect** | Se retiene con mayor precisión el primer y último ítem de una serie. | Colocar las categorías o productos prioritarios al inicio y al final de los menús de navegación y carruseles. |
| **Aesthetic-Usability Effect** | El diseño visualmente atractivo es percibido como más usable y confiable. | Acabados pulidos, micro-animaciones físicas, tipografía cuidada y materiales de alta fidelidad generan paciencia y credibilidad. |

---

## 6. Checklist Obligatorio para Todo Cambio de UI/UX

Antes de dar por aprobado cualquier componente, pantalla o flujo nuevo:

- [ ] **Decisión limpia (Hick & Choice Overload):** ¿Existe un único foco visual principal por pantalla o bloque?
- [ ] **Consistencia Gestalt (Proximity & Common Region):** ¿Los elementos relacionados están agrupados espacialmente y separados de los ajenos?
- [ ] **Target Ergonómico (Fitts):** ¿Los botones y enlaces interactivos tienen al menos 44px de área táctil accesible?
- [ ] **Latencia Inexistente (Doherty):** ¿Hay feedback de estado de carga o skeleton en $< 400$ ms ante cualquier interacción asíncrona?
- [ ] **Familiaridad (Jakob):** ¿Se respetan los patrones canónicos de navegación y comercio electrónico?
- [ ] **Tolerancia a Entradas (Postel):** ¿Los formularios validan con flexibilidad sin frustrar al usuario?
- [ ] **Sensación de Cierre (Peak-End & Goal-Gradient):** ¿El flujo premia o clarifica el avance del usuario hacia su objetivo?
