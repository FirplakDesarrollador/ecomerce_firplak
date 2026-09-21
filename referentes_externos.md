# Referentes Externos & Benchmark UX/UI para Firplak E-Commerce

Este documento compila el anÃ¡lisis de mejores prÃ¡cticas de comercio electrÃ³nico global y diseÃ±o de experiencia de usuario (UX/UI) extraÃ­das de lÃ­deres de la industria (IKEA, Pure Cycles, Bullfrog Spas, Hot Spring, Jacuzzi, Tonal, Apple, Sundance, Caldera, Hydropool y Aquavia Spa). Su objetivo es orientar las decisiones de arquitectura de informaciÃ³n, diseÃ±o visual y flujos de conversiÃ³n de la nueva tienda online de **FIRPLAK**.

---

## ðŸ§­ 1. VisiÃ³n Macro de NavegaciÃ³n: Los Dos Grandes Universos

Para maximizar la conversiÃ³n y simplificar la carga cognitiva del usuario, la plataforma digital de Firplak debe estructurarse desde el nivel superior en dos grandes categorÃ­as o pestaÃ±as maestras con propuestas de valor, arquetipos de cliente y journeys de compra diferenciados:

```
                  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                  â”‚              FIRPLAK E-COMMERCE HUB                 â”‚
                  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                             â”‚
                  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                  â”‚                                                     â”‚
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”               â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚     ðŸŒ¿ BIENESTAR / WELLNESS        â”‚               â”‚   ðŸ  MEJORAMIENTO DEL HOGAR        â”‚
â”‚  (Alta ConsideraciÃ³n & Deseo)      â”‚               â”‚     (Compra Ãgil & Modular)        â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤               â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ â€¢ Jacuzzis & Spas Exteriores       â”‚               â”‚ â€¢ BaÃ±os (Muebles, Lavamanos, etc.) â”‚
â”‚ â€¢ Tinas de Hidromasaje             â”‚               â”‚ â€¢ Cocinas (Mesones, Lavaplatos)    â”‚
â”‚ â€¢ BaÃ±eras de InmersiÃ³n             â”‚               â”‚ â€¢ Zona de Ropas (Lavaderos)        â”‚
â”‚ â€¢ Saunas & Cabinas                 â”‚               â”‚ â€¢ GriferÃ­as & Accesorios           â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤               â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ Funnel: Asistido, Emocional,       â”‚               â”‚ Funnel: Transaccional, Visual,     â”‚
â”‚ Terapias, Spa Match, ValidaciÃ³n    â”‚               â”‚ Above the Fold, Mix & Match,       â”‚
â”‚ de Espacio y AsesorÃ­a TÃ©cnica      â”‚               â”‚ Shoppable Images, Venta Cruzada    â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜               â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

> [!IMPORTANT]
> **SeparaciÃ³n de Intenciones:** Quien busca un jacuzzi para su terraza o casa campestre estÃ¡ en un proceso de investigaciÃ³n de alta consideraciÃ³n, enfocado en bienestar, relajaciÃ³n familiar y viabilidad de instalaciÃ³n. Quien busca renovar el mueble del baÃ±o o el lavadero de ropas busca dimensiones exactas, compatibilidad estÃ©tica, entrega Ã¡gil y un proceso de compra directo sin fricciones.

---

## ðŸ  2. CategorÃ­as de Mejoramiento del Hogar (BaÃ±os, Cocinas, Ropas)

Para las categorÃ­as transaccionales de mobiliario y aparatos sanitarios, el diseÃ±o debe priorizar la **reducciÃ³n del esfuerzo cognitivo**, la **visualizaciÃ³n ambiental** y la **venta cruzada inmediata**.

### 2.1. "Agregar al Carrito" Inmediato Sin Scroll (Above the Fold)

* **Referente Inspirador:** **Pure Cycles** (PDP de bicicletas y movilidad).

![Pure Cycles - PDP Above the Fold](./especificaciones/wiki/assets/pure_cycles_pdp_above_the_fold.png)

#### Insights Clave de Pure Cycles
1. **CompresiÃ³n Vertical del Hero:** La galerÃ­a del producto a la izquierda convive perfectamente a la misma altura con el panel de decisiÃ³n de compra a la derecha.
2. **JerarquÃ­a Visual Ininterrumpida:** Nombre del producto, precio en tipografÃ­a de alto impacto, selectores rÃ¡pidos de talla/medida, selector de color con swatches interactivos y botÃ³n de compra primario estÃ¡n 100% visibles en el primer viewport (pantalla inicial) sin necesidad de hacer ningÃºn scroll.
3. **Indicadores de Disponibilidad en Vivo:** Leyenda destacada con punto verde: *"In stock, ready to ship"*, reduciendo la duda sobre tiempos de entrega antes del clic.

#### AplicaciÃ³n en Firplak (BaÃ±os, Cocinas y Ropas)
* **EliminaciÃ³n del Scroll Forzado:** En muebles de baÃ±o (ej. Trento, TurÃ­n, Praga), lavamanos y lavaderos, el selector de medida (45 cm, 60 cm, 80 cm, 100 cm), el color/acabado (Humo, ChantillÃ­, Cenizo, Roble) y el botÃ³n **"AÃ±adir al Carrito"** / **"Comprar Ahora"** deben caber por completo en el primer golpe de vista en desktop.
* **Sticky CTA en Mobile:** En dispositivos mÃ³viles, si el usuario scrollea para leer la descripciÃ³n tÃ©cnica o ver fotos de detalle, se fija automÃ¡ticamente una barra inferior (*sticky bottom bar*) con miniatura, precio actual y botÃ³n de compra rÃ¡pido.

---

### 2.2. Venta Cruzada a TravÃ©s de la Imagen (Shoppable Scenes / Hotspots Interactivos)

* **Referente Inspirador:** **IKEA** (Ambientes de BaÃ±o y Escenas Completas).

![IKEA - Shoppable Image con Hotspots Interactivos](./especificaciones/wiki/assets/ikea_hotspot_venta_cruzada_imagen.png)

#### Insights Clave de IKEA
1. **Pines Interactivos (Hotspots) en Escena:** En la galerÃ­a de fotos del producto ambientado, la imagen incluye puntos interactivos circulares colocados sobre cada elemento del baÃ±o (mueble bajo, lavamanos, griferÃ­a, espejo con iluminaciÃ³n, gabinete auxiliar alto, canasta toallero).
2. **Contexto ArquitectÃ³nico Real:** El usuario no ve un mueble aislado en fondo blanco; ve cÃ³mo combina el mueble con el piso de terrazo, el espejo vertical y la griferÃ­a de diseÃ±o.
3. **ExploraciÃ³n Sin Salir del Flujo:** Al tocar un pin, se despliega una pequeÃ±a tarjeta flotante con nombre del producto, referencia, precio y opciÃ³n de agregar al carrito o abrir en pestaÃ±a nueva.

#### AplicaciÃ³n en Firplak
* **"Compra el Ambiente Completo":** Implementar escenas fotogrÃ¡ficas interactivas donde los clientes que compran un mueble de baÃ±o puedan hacer clic en el lavamanos de sobreponer, el espejo biselado LED, el gabinete superior y la griferÃ­a monocontrol que aparecen en la fotografÃ­a oficial de catÃ¡logo.
* **Aumento del Ticket Promedio (AOV):** Permite transformar la venta de un mueble de $400.000 COP en un paquete de renovaciÃ³n de baÃ±o de $1.200.000 COP de forma natural e inspiracional.

---

### 2.3. Bloque Integrado "Completa con..." (Cross-Selling de Accesorios Indispensables)

* **Referente Inspirador:** **IKEA PDP** (`HAVBACK / ORRSJON`).

![IKEA - MÃ³dulo Completa Con](./especificaciones/wiki/assets/ikea_pdp_cross_selling_completa_con.png)

#### Insights Clave de IKEA
1. **UbicaciÃ³n EstratÃ©gica:** Ubicado justo debajo del precio y de la herramienta de diseÃ±o del espacio.
2. **Accesorios que Evitan Dolores de Cabeza:** Muestra inmediatamente insumos indispensables que no vienen incluidos con el mueble base pero son obligatorios para el ensamble (ej. manijas/tiradores, pomos, silicona de sellado sanitario, patas regulables).
3. **AcciÃ³n en 1 Clic:** BotÃ³n directo circular de carrito `[+]` para agregar el insumo complementario sin abrir otra pÃ¡gina.

#### AplicaciÃ³n en Firplak
* **Kit de InstalaciÃ³n Recomendado:**
  * **En Muebles de BaÃ±o:** Sugerir pomos/tiradores opcionales, sifÃ³n corrugado antiolores, desagÃ¼e push cromado/negro y silicona antihongos de alta adherencia.
  * **En Lavaplatos / Cocinas:** Sugerir griferÃ­a flexible/extensible, canastilla sifonada de 4 pulgadas y dispensador de jabÃ³n empotrable.
  * **En Lavaderos de Ropa:** Sugerir base metÃ¡lica estructural con pintura electrostÃ¡tica, sifÃ³n de descarga rÃ¡pida y grifo lavadero cromado.

---

### 2.4. Asistente IA Contextual: Chat Proactivo con Autoescritura ("Â¿Me cabe este mueble?")

* **Concepto UX:** Transformar el tÃ­pico botÃ³n estÃ¡tico de chat en una **burbuja inteligente contextual y proactiva** que simula autoescritura de dudas comunes basadas en el producto especÃ­fico que se estÃ¡ visualizando.

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ ðŸ’¬ Asistente Virtual Firplak                        [ â€“ ] [x]â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ ðŸ‘‹ Â¡Hola! Veo que estÃ¡s revisando el Mueble Trento 80 cm.  â”‚
â”‚                                                             â”‚
â”‚ ðŸ’¡ Preguntas frecuentes sobre este producto:                â”‚
â”‚ â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”‚
â”‚ â”‚ âš¡ "Â¿Me cabe este mueble si mi baÃ±o mide 1.50 x 2.00 m?" â”‚ â”‚
â”‚ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â”‚
â”‚ â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”‚
â”‚ â”‚ âš¡ "Â¿QuÃ© griferÃ­a le queda perfecta a este lavamanos?"  â”‚ â”‚
â”‚ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â”‚
â”‚ â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”‚
â”‚ â”‚ âš¡ "Â¿El aglomerado RH resiste la humedad de la ducha?"   â”‚ â”‚
â”‚ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â”‚
â”‚                                                             â”‚
â”‚ O escribe tu pregunta aquÃ­...                               â”‚
â”‚ [ Escribe tus medidas o dudas de espacio...        ] [Enviar]â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

#### CaracterÃ­sticas Clave
1. **Chips de Preguntas Frecuentes Auto-sugeridas:** Al entrar a la pÃ¡gina del producto, el widget muestra preguntas frecuentes como *"Â¿Me cabe este mueble en mi baÃ±o?"* o *"Â¿Viene armado o desarmado?"* mediante una suave animaciÃ³n de escritura (*typewriter effect*).
2. **ResoluciÃ³n Inmediata de Objeciones Espaciales:** Si el usuario hace clic en *"Â¿Me cabe este mueble?"*, el bot le pide: *"Ingresa el ancho de tu pared o envÃ­a una foto"* y calcula al instante si deja suficiente espacio libre para el paso y el inodoro segÃºn normas ergonÃ³micas.
3. **Sin FricciÃ³n Humana Inicial:** Da respuestas tÃ©cnicas inmediatas apoyadas en la base de conocimiento y fichas de Firplak; si la consulta requiere un asesor comercial o arquitecto, transfiere fluidamente a WhatsApp.

---

## ðŸŒ¿ 3. SecciÃ³n de Hidromasajes & Wellness (Alta ConsideraciÃ³n)

Los hidromasajes, jacuzzis y tinas no son compras por impulso. Son productos de alta inversiÃ³n ($5M a $30M+ COP) donde la mayor barrera de compra no es el precio, sino la **ansiedad tÃ©cnica** (*"Â¿Me cabe?", "Â¿El piso resistirÃ¡ el peso lleno?", "Â¿Tengo la luz necesaria?", "Â¿CÃ³mo lo suben a un piso 4?"*).

### 3.1. MenÃº Horizontal Especializado (InspiraciÃ³n Bullfrog Spas)

* **Referente:** **Bullfrog Spas** ([https://www.bullfrogspas.com/es/](https://www.bullfrogspas.com/es/)).

Al ingresar a la pestaÃ±a o portal **Bienestar / Wellness**, la barra de navegaciÃ³n se transforma en un submenÃº temÃ¡tico especializado que educa, inspira y reduce el miedo tÃ©cnico:

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                                       FIRPLAK WELLNESS COLLECTION                                         â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ 1. Â¿POR QUÃ‰  â”‚ 2. TERAPIAS &    â”‚ 3. SISTEMAS DE  â”‚ 4. ENCUENTRA TU    â”‚ 5. PREPARACIÃ“N  â”‚ 6. RESPALDO &  â”‚
â”‚  FIRPLAK?    â”‚    BENEFICIOS    â”‚    MASAJE & JETSâ”‚    JACUZZI (TEST)  â”‚    TÃ‰CNICA      â”‚    GARANTÃA    â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

#### Desglose de Cada MÃ³dulo del MenÃº
1. **Â¿Por quÃ© Firplak Jacuzzis?**:
   * MÃ¡s de 40 aÃ±os de liderazgo e innovaciÃ³n en Colombia.
   * AcrÃ­lico sanitario reforzado con fibra de vidrio de alta densidad (no se mancha, fÃ¡cil limpieza, brillo duradero).
   * Motobombas de bajo consumo y aislamiento acÃºstico.
2. **Terapias & Beneficios**:
   * Alivio de tensiones lumbares y cervicales (fisioterapia).
   * EstimulaciÃ³n de la circulaciÃ³n y drenaje linfÃ¡tico.
   * Ritual de desconexiÃ³n mental y combate del insomnio.
   * Cromoterapia LED (efecto restaurador de la luz y el color).
3. **Sistemas de Masaje & Jets (Equipamiento)**:
   * DemostraciÃ³n interactiva de boquillas de agua (hidromasaje) vs burbujas de aire (aeromasaje).
   * Equipamientos disponibles: EstÃ¡ndar, Confort, Confort Plus, Lujo/Total Spa.
4. **Encuentra tu Jacuzzi Ideal (Spa Match Test)**:
   * Test guiado de 3 minutos para recomendar el modelo y equipamiento exacto.
5. **PreparaciÃ³n TÃ©cnica & InstalaciÃ³n**:
   * Checklist paso a paso: Acometida elÃ©ctrica (110V vs 220V), losa de soporte (peso lleno de agua + personas), puntos hidrÃ¡ulicos y accesos fÃ­sicos (puertas, escaleras, grÃºa).
6. **Respaldo, GarantÃ­a & Servicio**:
   * Red nacional de tÃ©cnicos certificados Firplak.
   * Repuestos originales garantizados y asesorÃ­a de postventa directa de fÃ¡brica.

---

### 3.2. NavegaciÃ³n por Estilo de Vida y Emociones (No Solo CÃ³digos de Producto)

> *"No estÃ¡s comprando un jacuzzi. EstÃ¡s diseÃ±ando dÃ³nde terminarÃ¡ tu dÃ­a."*

El error comÃºn en sitios tradicionales de jacuzzis es clasificar el catÃ¡logo por nombres internos o nÃºmero de serie (ej. "LÃ­nea 400 vs LÃ­nea 800"). Los referentes mundiales (Sundance, Hot Spring, Bullfrog) demuestran que el cliente navega por **propÃ³sito de vida**:

| Ruta de NavegaciÃ³n | Arquetipo de Usuario | Foco del Mensaje | Modelos Firplak Sugeridos |
| :--- | :--- | :--- | :--- |
| **"Para Dos" (Parejas & Romance)** | Parejas, suites principales, apartamentos con terraza. | Intimidad, desconexiÃ³n, tumbonas dobles ergonÃ³micas. | Jacuzzis de 2 puestos, Tinas de hidromasaje. |
| **"Familiar & Hogar"** | Familias con hijos, casas campestres. | Espacio amplio, asientos multinivel, seguridad y entretenimiento. | Jacuzzis de 4 a 6 personas. |
| **"Recovery & Deportivo"** | Atletas, runners, crossfit, entusiastas del fitness. | Hidroterapia de impacto, alivio muscular profundo, contraste tÃ©rmico. | Modelos con jets lumbares potentes y calentador rÃ¡pido. |
| **"After-Work & Relax"** | Profesionales con alto estrÃ©s laboral. | Silencio, aromaterapia, cromoterapia suave, relajaciÃ³n de hombros y cuello. | Spas con kits de relajaciÃ³n y microjets cervicales. |
| **"Espacios Reducidos & Balcones"** | Terrazas urbanas y Ã¡reas restringidas. | Eficiencia dimensional, fÃ¡cil paso por puertas, bajo peso volumÃ©trico. | Tinas empotradas compactas y spas rectangulares optimizados. |

---

### 3.3. El "Spa Match Test" (Quiz Interactivo de DecisiÃ³n)

Inspirado en los mejores selectores de la industria (*Apple Mac Matcher*, *Master Spas Quiz*, *Hydropool Learning Guide*), este recomendador no debe ser un formulario aburrido para capturar datos, sino una herramienta de consultorÃ­a interactiva:

```
[ PASO 1: PROPÃ“SITO ] â”€â”€â–º [ PASO 2: PERSONAS ] â”€â”€â–º [ PASO 3: ESPACIO ] â”€â”€â–º [ PASO 4: TÃ‰CNICA ] â”€â”€â–º [ RESULTADO MATCH ]
  â€¢ Relax & Pareja           â€¢ 1-2 personas          â€¢ JardÃ­n / Finca          â€¢ Tengo 220V           â­ Jacuzzi Recomendado
  â€¢ Familia & Hijos          â€¢ 3-4 personas          â€¢ Terraza / BalcÃ³n        â€¢ Solo tengo 110V      ðŸ“Š Spa Readiness: 92%
  â€¢ Terapia Deportiva        â€¢ 5+ personas           â€¢ BaÃ±o Principal          â€¢ No estoy seguro      ðŸ“‹ Requisitos de Obra
```

#### Los 7 Bloques del Spa Match Test
1. **Emocional:** Â¿CuÃ¡l es la principal experiencia que sueÃ±as vivir?
2. **Humano:** Â¿CuÃ¡ntas personas lo utilizarÃ¡n simultÃ¡neamente con mayor frecuencia?
3. **Espacial:** Â¿DÃ³nde se ubicarÃ¡? (JardÃ­n sobre tierra, terraza en azotea, deck de madera, cuarto de baÃ±o).
4. **Accesibilidad:** Â¿Por dÃ³nde debe ingresar el equipo hasta su lugar final? (Puerta estÃ¡ndar de 80 cm, ventanal, pasillo abierto, requiere izaje con grÃºa).
5. **TÃ©cnico:** Â¿QuÃ© tipo de energÃ­a elÃ©ctrica tienes disponible? (110V normal, 220V bifÃ¡sico, o "no estoy seguro - requiero asesorÃ­a").
6. **EstÃ©tico:** Â¿Prefieres acabado con faldÃ³n decorativo tipo madera, faldÃ³n acrÃ­lico o empotrado en obra civil?
7. **EconÃ³mico:** Â¿Deseas pago de contado o prefieres cuotas mensuales con financiaciÃ³n (ADDI / ePayco)?

#### Resultado del Test: "Spa Readiness Score"
El sistema no solo arroja un modelo de jacuzzi, sino un **informe de compatibilidad**:
* **Tu Match Ideal:** Jacuzzi Firplak Oasis 5 Personas (94% de afinidad).
* **Compatibilidad de Espacio:** âœ… Excelente (cabe holgadamente en tu terraza de 3.0 Ã— 2.5 m).
* **Ruta de Acceso:** âš ï¸ *AtenciÃ³n requerida:* el ancho del jacuzzi es de 88 cm; confirma si el vano de tu puerta o escalera permite el giro.
* **EnergÃ­a Requerida:** 220V BifÃ¡sico con interruptor de 40A para el calentador elÃ©ctrico.
* **Opciones de AcciÃ³n:** `[Ver en 3D / Realidad Aumentada]` Â· `[Agendar Visita TÃ©cnica de ValidaciÃ³n]` Â· `[Descargar Ficha PreinstalaciÃ³n]`.

---

### 3.4. Tarjetas de Producto en Feed (PLP) con Especificaciones Clave

* **Referente:** **Bullfrog Spas Feed / Grid de Productos**.

![Bullfrog Spas - Feed Cards con Especificaciones](./especificaciones/wiki/assets/bullfrog_feed_cards_especificaciones.png)

#### Insights Clave de Bullfrog Spas
1. **Vista Cenital Limpia:** La fotografÃ­a principal del producto en la grilla es una toma superior ortogonal que permite al usuario comprender de un solo vistazo la cantidad de asientos, la distribuciÃ³n de los jets y la presencia de camas de hidromasaje (*loungers*).
2. **Micro-especificaciones Normalizadas con IconografÃ­a:**
   * ðŸ‘¥ **NÃºmero de Asientos:** ej. 3, 6, 7 puestos.
   * ðŸ›‹ï¸ **Asientos de SalÃ³n / Tumbonas:** ej. 0, 1 o 2 camas reclinables.
   * ðŸŒ€ **NÃºmero de Chorros / Jets:** ej. 28, 47 chorros de agua.
   * ðŸ“ **Dimensiones:** Medidas exteriores precisas en metros (ej. 2.13 m Ã— 2.13 m Ã— 0.91 m).
   * ðŸ’§ **Cuidado del Agua:** Sistema de filtraciÃ³n y purificaciÃ³n (ozonizador, filtro cartucho).

#### AplicaciÃ³n en el CatÃ¡logo de Hidromasajes Firplak
En todas las pÃ¡ginas de categorÃ­a de jacuzzis y tinas, cada tarjeta debe incluir este bloque estandarizado de 5 datos esenciales antes del precio. Esto permite al usuario comparar mentalmente las referencias sin tener que abrir 15 pestaÃ±as simultÃ¡neas.

---

### 3.5. Paradigma de Venta: "Commerce Asistido" vs Add-to-Cart Tradicional

En productos de alta consideraciÃ³n y complejidad fÃ­sica, el modelo tradicional de carrito directo genera abandono o reclamos costosos si el producto llega a la vivienda y no cabe por la puerta o el circuito elÃ©ctrico colapsa.

El modelo Ã³ptimo para Firplak es el **Commerce Asistido en 4 Pasos**:

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”     â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”     â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”     â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ 1. CONFIGURACIÃ“Nâ”‚ â”€â”€â–º â”‚ 2. VALIDACIÃ“N   â”‚ â”€â”€â–º â”‚ 3. PRECIO &     â”‚ â”€â”€â–º â”‚ 4. RESERVA &    â”‚
â”‚    & PERSONALIZAâ”‚     â”‚    DE ESPACIO   â”‚     â”‚    FINANCIACIÃ“N â”‚     â”‚    INSTALACIÃ“N  â”‚
â”‚    (Color, Jets)â”‚     â”‚ (Readiness Checkâ”‚     â”‚ (Desde $X/mes)  â”‚     â”‚ (Visita/Entrega)â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜     â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜     â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜     â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

1. **ConfiguraciÃ³n Visual:** El cliente escoge color de la concha acrÃ­lica, faldÃ³n exterior, nÃºmero de jets y adiciones (calentador, cromoterapia, blower).
2. **ValidaciÃ³n de Espacio ("Installation Readiness"):** Checklist visual de medidas, peso y acometida. Opcional: enviar foto de la terraza por WhatsApp o subir plano para aprobaciÃ³n de ingenierÃ­a Firplak.
3. **Claridad Total de Costos:** Mostrar precio base transparente + opciÃ³n de cuota mensual con ADDI + costo estimado de flete e instalaciÃ³n por separado.
4. **Cierre de Venta Flexible:**
   * Compra online completa con pasarela de pagos segura (ePayco / PSE / Tarjeta de crÃ©dito).
   * Reserva con anticipo/depÃ³sito para congelar el precio mientras se realiza la visita tÃ©cnica.
   * Contacto con ejecutivo de proyectos Firplak para clientes institucionales o constructores.

---

## ðŸ“Š 4. SÃ­ntesis del Benchmark Global de E-Commerce para Spas

El documento tÃ©cnico complementario analizado ([benchmark_global_ecommerce_jacuzzis_ux.pdf](./especificaciones/wiki/assets/benchmark_global_ecommerce_jacuzzis_ux.pdf)) evaluÃ³ a los 10 lÃ­deres internacionales del sector bajo 10 dimensiones heurÃ­sticas de UX/UI (claridad de home, descubrimiento, PDP, visualizaciÃ³n 3D/AR, experiencia mÃ³vil, checkout/conversiÃ³n, confianza, soporte, entrega/instalaciÃ³n y garantÃ­as):

### Tabla Resumen del Benchmark HeurÃ­stico (Sobre 100 Puntos)

| Puesto | Marca / Referente | Score | Lo Mejor para Copiar e Implementar en Firplak |
| :---: | :--- | :---: | :--- |
| **1** | **Hot Spring** | **94 / 100** | Visualizador de Realidad Aumentada (AR) + recorrido 360Â°, precio visible con mensualidad de financiaciÃ³n estimada y recomendador *"Help Me Choose"*. PDP con peso lleno, voltaje y capacidad de agua. |
| **2** | **Bullfrog Spas** | **92 / 100** | Design Studio para personalizaciÃ³n profunda de jets (*JetPaks* intercambiables) y narrativa de bienestar/conexiÃ³n familiar, en lugar de listas frÃ­as de especificaciones. |
| **3** | **JacuzziÂ®** | **90 / 100** | Mejor funnel asistido end-to-end: *Build & Price*, rangos de precio por serie, guÃ­a de preinstalaciÃ³n descargable, prueba en agua (*wet test*) e inspecciÃ³n fÃ­sica del emplazamiento. |
| **4** | **Caldera Spas** | **88 / 100** | *Vision AR* para colocar el modelo 3D en la terraza del usuario y *Learning Center* ordenado por instalaciÃ³n, seguridad, mantenimiento y costos reales de operaciÃ³n. |
| **5** | **Sundance Spas** | **86 / 100** | TaxonomÃ­a de navegaciÃ³n por estilos de vida y motivaciÃ³n (*"Entertaining"*, *"Small Spaces"*, *"Families"*, *"Low Maintenance"*). |
| **6** | **Master Spas** | **84 / 100** | Quiz interactivo *"Find My Spa"*, filtros por tamaÃ±o y precio, y recursos visuales de diseÃ±o de patio (*Backyard Design*). |
| **7** | **Endless Pools** | **84 / 100** | Gran capacidad para explicar un producto tÃ©cnicamente intimidante (piscinas modulares contracorriente) en tÃ©rminos sencillos de instalaciÃ³n y estilo de vida. |
| **8** | **Aquavia Spa** | **78 / 100** | Referente europeo de estÃ©tica y diseÃ±o arquitectÃ³nico; incorporaciÃ³n de chatbot con IA para orientaciÃ³n y asesorÃ­a de navegaciÃ³n. |
| **9** | **Hydropool** | **78 / 100** | Centro educativo excepcional; desmitifica el peso lleno de la tina, la resistencia de losa y las restricciones de instalaciÃ³n sin asustar al comprador. |
| **10** | **Wellis** | **76 / 100** | DiseÃ±o europeo sobrio, eficiencia energÃ©tica comunicada con claridad y fichas de producto bien jerarquizadas. |

### Referentes AnalÃ³gicos Fuera del Sector Tradicional
* **Apple (Mac):** El estÃ¡ndar de oro para traducir especificaciones tÃ©cnicas complejas (chips, memoria unificada, GPU) en soluciones para la vida diaria (*"Ideal para ediciÃ³n de video 4K o tareas universitarias"*), acompaÃ±ado de la herramienta *"Help Me Choose"* y conexiÃ³n con un especialista.
* **IKEA (Planificadores 3D):** La referencia mundial en venta cruzada contextual, modulaciÃ³n de espacios y listas de empaque completas.
* **Tonal (Gimnasio Inteligente de Pared):** Producto fitness de lujo que requiere validar pared, estructura, altura libre y conexiÃ³n elÃ©ctrica antes de enviar el producto. Su checklist de *"Installation Readiness"* es el modelo perfecto para adaptar al checklist de jacuzzis de Firplak.

---

## ðŸš€ 5. Hoja de Ruta de ImplementaciÃ³n para Firplak

Para llevar estos referentes a la realidad operativa del proyecto sin sobrecargar el desarrollo inicial, se propone una hoja de ruta dividida en tres horizontes:

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                                     ROADMAP DE EXPERIENCIA FIRPLAK                                      â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ FASE 1: MVP (0 a 8 Semanas)   â”‚ FASE 2: CONFIANZA (2 a 4 Meses) â”‚ FASE 3: INTELIGENCIA (4 a 8 Meses)    â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ â€¢ MenÃº dual: Bienestar vs     â”‚ â€¢ Spa Match Test v1 interactivo â”‚ â€¢ Visualizador Realidad Aumentada     â”‚
â”‚   Mejoramiento del Hogar      â”‚ â€¢ Shoppable images (hotspots)   â”‚   (AR) para proyectar spa en terraza  â”‚
â”‚ â€¢ PDP Above the Fold en baÃ±os â”‚   en ambientes de baÃ±os/cocina  â”‚ â€¢ Asistente IA multimodal (analiza    â”‚
â”‚ â€¢ Tarjetas Bullfrog en feed   â”‚ â€¢ Calculadora de cuota mensual  â”‚   fotos del espacio del cliente)      â”‚
â”‚ â€¢ Bloque "Completa con..."    â”‚   con financiaciÃ³n ADDI/ePayco  â”‚ â€¢ Agendamiento en lÃ­nea de visita     â”‚
â”‚ â€¢ Chat IA con autoescritura   â”‚ â€¢ Checklist tÃ©cnico interactivo â”‚   tÃ©cnica previa y entrega asistida   â”‚
â”‚   de preguntas frecuentes     â”‚   "Â¿Cabe en mi espacio?"        â”‚ â€¢ Portal de propietarios y repuestos  â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

---

## ðŸ“ 6. Archivos y Recursos Vinculados

* ðŸ“„ **Documento Completo de Benchmark:** [benchmark_global_ecommerce_jacuzzis_ux.pdf](./especificaciones/wiki/assets/benchmark_global_ecommerce_jacuzzis_ux.pdf)
* ðŸ–¼ï¸ **Capturas y Material GrÃ¡fico:**
  * [pure_cycles_pdp_above_the_fold.png](./especificaciones/wiki/assets/pure_cycles_pdp_above_the_fold.png) (Pure Cycles - PDP Above the fold)
  * [ikea_pdp_cross_selling_completa_con.png](./especificaciones/wiki/assets/ikea_pdp_cross_selling_completa_con.png) (IKEA - Venta cruzada en PDP)
  * [ikea_hotspot_venta_cruzada_imagen.png](./especificaciones/wiki/assets/ikea_hotspot_venta_cruzada_imagen.png) (IKEA - Shoppable Image con Hotspots)
  * [bullfrog_feed_cards_especificaciones.png](./especificaciones/wiki/assets/bullfrog_feed_cards_especificaciones.png) (Bullfrog Spas - Feed Cards con especificaciones)

---

## ðŸ”— PÃ¡ginas Relacionadas en el Wiki de Firplak
* [pagina_producto.md](./pagina_producto.md): Arquitectura visual, layout y diseÃ±o de la PDP.
* [hidromasajes.md](./hidromasajes.md): Especificaciones tÃ©cnicas, kits de equipamiento y logÃ­stica de jacuzzis.
* [mix_and_match.md](./mix_and_match.md): Visualizador interactivo de combinaciones de lavamanos y muebles.
* [recomendaciones_pagos_y_productos.md](./recomendaciones_pagos_y_productos.md): Ciclo de vida de pagos, ePayco y ADDI.
* [sistema_diseno.md](./sistema_diseno.md): Sistema de diseÃ±o, colores institucionales y tokens UI.

