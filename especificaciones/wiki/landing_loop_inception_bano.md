# Landing Ricardo · Loop: recorrido Inception por la casa

> [!IMPORTANT]
> **Estrategia Condensada del Segmento**:
> Un landing en bucle donde el scroll mueve una sola cámara por un mundo de imágenes anidadas. La **casa vista desde arriba** es el punto de encuentro: cada espacio es un capítulo que baja desde la casa, muestra el producto real y vuelve a la casa. Hoy: **hidromasaje** (del punto azul del mando a la casa) y **lavamanos** (de la casa al mueble, a la grifería y a una gota que lleva la casa adentro). Cocina y zona de ropas se suman al mismo guion. El scroll nunca termina.

## 1. Dónde vive

| Pieza | Ruta |
|---|---|
| Página | `/?v=ricardo-loop` (también `?v=loop`, `?v=inception`, `?v=v4`) |
| Selector | Botón "Ricardo · Loop" en `components/landing-cinematic/LandingSwitcher.tsx` |
| Experiencia | `components/landing-inception/InceptionBanoExperience.tsx` |
| Guion (capítulos y fotograma) | `components/landing-inception/guion.ts` |
| Capítulo 1 · hidromasaje | `components/landing-inception/camaraInception.ts` (+ `geometriaBano.ts`, `profundidadBano.ts` generados) |
| Capítulo 2 · lavamanos | `components/landing-inception/capituloLavamanos.ts` (+ `profundidadLavamanos.ts` generado) |
| Proyección con giro | `components/landing-inception/proyeccion.ts` |
| WebGL | `placaViva.ts` (placas con paralaje y desenfoque) y `gotaLente.ts` (la gota) |
| Imágenes | `public/images/inception/bano-*.webp`, `lav-*.webp` |
| Placas vivas | `public/videos/inception/{bano-azul,bano-bano,bano-casa,lav-cerrado}.mp4` (y `-m.mp4` para móvil) |
| Scripts | `scripts/inception/`: `preparar-keyframes`, `preparar-profundidad`, `preparar-lavamanos`, `analizar-placa`, `componer-placa` |
| Pruebas | `pruebas-unitarias/inception.test.ts`, `pruebas-unitarias/guion.test.ts` |
| Rama | Solo `Ric` (pedido del usuario: no se fusiona a `Dev` todavía) |

## 2. Gran recorrido

Un bucle de 1600 svh: **azul → hidromasaje → casa → lavamanos → grifería → gota → casa → hidromasaje → azul**. El documento tiene tres vueltas y, al acercarse a un borde, salta una vuelta entera sin que cambie la imagen.

| Capítulo | Parte del bucle | Qué pasa |
|---|---|---|
| 1 · ida | 0–0,28 | Del azul (color medido en el punto del render) a los mandos, al baño con ella y, plegándose, a la casa vista desde arriba. |
| 2 · lavamanos | 0,28–0,74 | La casa gira 90° (la pared del lavamanos queda al fondo), baja y se pliega hasta el mueble; las puertas se abren; zoom a la grifería (recorte exacto del mismo render); se forma una gota que cae con la cámara; dentro de la gota está la casa; al llenar la pantalla, es la casa vista desde arriba. |
| 1 · vuelta | 0,74–1 | De la casa baja al baño, a los mandos y al azul, que es el primer cuadro. |

En la casa vista desde arriba, las etiquetas **Hidromasaje** y **Lavamanos** llevan a su capítulo; **Cocina** y **Zona de ropas** dicen "pronto". El indicador lateral (Azul, Hidromasaje, Casa, Lavamanos, Grifería) marca la parada que se ve, también de vuelta.

## 3. Cómo funciona

- **Mundo y proyección:** el mundo es la casa vista desde arriba (0 a 1). Cada imagen es una capa con centro, lado y giro propios (el lavamanos y la grifería van girados 90°). La cámara tiene centro, vista y **giro**; `transformCapa` arma el `transform` CSS y el pliegue gira sobre un eje horizontal de la pantalla que pasa por el pivote (tina o lavabo), con la perspectiva dentro de la capa.
- **Trayectos:** `trayecto()` recorre paradas con zoom logarítmico alrededor del punto fijo de la semejanza, escala y giro por curvas monótonas continuas en velocidad (Fritsch-Carlson). Ninguna parada es quieta. `mira()` ajusta cada encuadre para que la imagen del frente siempre cubra la pantalla según el zoom y la proporción.
- **Guion:** `fotograma(p)` devuelve, para cualquier punto del bucle, la cámara, la opacidad, inclinación y pivote de cada capa, la floración del azul, las puertas, la gota, las etiquetas y los textos. El componente solo dibuja.
- **La gota:** lente WebGL a pantalla completa: dentro de una gota con brillo y borde de agua se ve la casa (el mismo video de la placa) ampliada en el centro. Mientras cae, la cámara la sigue; al final su contenido pasa sin corte al encuadre de la casa y la cámara "atraviesa".
- **Puertas:** una secuencia de cuadros mezclada en un lienzo que pasa a ser la fuente de la placa del mueble (con su paralaje y desenfoque). Hoy son los renders cerrado y abierto con un fundido; ver §5.
- **Inercia, placas vivas, profundidad y desenfoque:** como en el capítulo 1 (constante de 0,14 s; clips de cámara fija con el render encima; paralaje por mapa de profundidad; desenfoque radial por velocidad de zoom, que ignora el salto del portal).
- **Movimiento reducido:** sin inercia, pliegues, giros, paralaje ni desenfoque.

## 4. Regla de fidelidad del producto

El producto (tina, mandos, ducha, mueble, lavabo, grifería) sale **siempre de los renders**. Nada de producto dibujado por IA:

1. **Primeros planos:** recorte del render real ampliado con Topaz CGI, quitando antes el ruido de render.
2. **Personas:** generadas aparte y compuestas sobre el render con la profundidad correcta (ella, detrás de la tina).
3. **Placas vivas:** solo clips de **cámara fija** con el mismo cuadro al inicio y al final. `analizar-placa.mjs` verifica desplazamiento 0 y marca qué se mueve; `componer-placa.mjs` pone encima el render con la máscara. Lavamanos: se mueven las plantas, el patio (sombras de árbol) y el reflejo del espejo; mueble, lavabo, grifería y sanitario quedan del render.
4. **Transiciones:** nunca son video generado; las hace la cámara del código.

## 5. Pendientes

- [ ] **Render de la apertura de las puertas** (lo hace Ricardo desde su escena 3D): misma cámara y luz que los renders del lavamanos; PNG cuadrados de 2048 px; 48 cuadros `lav_puertas_000.png` (= render cerrado) a `lav_puertas_047.png` (= render abierto); ambas puertas, movimiento con aceleración y frenado suaves; sin desenfoque de movimiento. Se cargan en `CUADROS_PUERTAS`.
- [ ] Opcional: primer plano de la grifería renderizado a 2048 px con el mismo ángulo del recorte (más detalle que la ampliación).
- [ ] Capítulos siguientes: cocina y zona de ropas, con la misma estructura (bajar desde la casa, producto real, volver a la casa).
- [ ] Nombre comercial y ficha del hidromasaje y del mueble para los CTA.
