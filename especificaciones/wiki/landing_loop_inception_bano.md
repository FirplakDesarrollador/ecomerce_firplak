# Landing Ricardo · Loop: recorrido Inception del baño

> [!IMPORTANT]
> **Estrategia Condensada del Segmento**:
> Un landing en bucle donde el scroll mueve una sola cámara por un mundo de imágenes anidadas: el **punto azul** del mando de agua fría vive dentro de los mandos, los mandos dentro del **baño** y el baño dentro de la **casa** vista desde arriba. La cámara sale del azul hasta la casa y vuelve a entrar; el scroll nunca termina. Es el primer capítulo (baño) de un recorrido por cada espacio de la casa.

## 1. Dónde vive

| Pieza | Ruta |
|---|---|
| Página | `/?v=ricardo-loop` (también `?v=loop`, `?v=inception`, `?v=v4`) |
| Selector | Botón "Ricardo · Loop" en `components/landing-cinematic/LandingSwitcher.tsx` |
| Experiencia | `components/landing-inception/InceptionBanoExperience.tsx` |
| Cámara (lógica pura) | `components/landing-inception/camaraInception.ts` |
| Geometría medida | `components/landing-inception/geometriaBano.ts` (generado) |
| Imágenes | `public/images/inception/bano-{azul,bano,casa}.webp` (2048 px, ~0,9 MB en total) |
| Script | `scripts/inception/preparar-keyframes.mjs <azul.png> <bano.png> <casa.png>` |
| Pruebas | `pruebas-unitarias/inception.test.ts` |
| Rama | Solo `Ric` (pedido del usuario: no se fusiona a `Dev` todavía) |

## 2. Recorrido

| Tramo (salida) | Qué se ve |
|---|---|
| Azul | Pantalla llena del color medido en el punto del render; se contrae hasta ser el punto real. |
| Llave | Primer plano real de los tres mandos: rojo, azul (centro) y liso. |
| Hacia el baño | Zoom continuo desde los mandos hasta el baño completo, con la mujer tocando los mandos. |
| Baño | Pausa con CTA "Ver hidromasajes freestanding". |
| Pliegue | La cámara se inclina sobre la tina: el baño se funde y la casa se endereza hasta verse desde arriba. |
| Casa | Planta completa con los espacios marcados (Baño "estás aquí"; Patio, Cuarto, Cocina y Zona de lavado "pronto") y un giro leve. |

La segunda mitad del bucle recorre los mismos tramos al revés y termina en el azul, que es el primer cuadro: el documento tiene tres vueltas y, al acercarse a un borde, salta una vuelta entera sin que cambie la imagen. El indicador lateral (Azul, Llave, Baño, Casa) lleva a cada parada.

## 3. Cómo funciona

- **Mundo anidado:** cada imagen se coloca dentro de la otra con medidas tomadas en los keyframes (mando del baño = punto azul del primer plano; tina del baño = tina de la casa).
- **Cámara siempre en movimiento:** el zoom es logarítmico alrededor del punto fijo de la semejanza entre paradas, y su escala sigue una curva monótona continua en velocidad (Fritsch-Carlson) por todas las paradas: no hay pausas quietas, en cada parada sigue alejándose y paneando sin dejar de cubrir la pantalla. En la cima del bucle la casa sigue girando mientras la cámara da la vuelta.
- **Inercia:** un solo bucle de `requestAnimationFrame` persigue al scroll con una constante de 0,14 s; el salto de vuelta del scroll infinito se aplica también a la cámara para que no se note. Escribe `transform` y `opacity` directo en el DOM (sin estado de React por cuadro).
- **Placas vivas:** cada imagen tiene un clip de 8 s con la cámara fija (agua, luz, hojas, ella) que se reproduce en bucle aunque el scroll esté quieto. El producto del render va encima del clip con una máscara (ver §4), así el movimiento no lo puede deformar.
- **Profundidad:** el primer plano y el baño se dibujan en WebGL (`placaViva.ts`) con su mapa de profundidad (Depth Anything): al panear, lo cercano se desplaza más que lo lejano; al acercarse, crece más rápido; un vaivén lento hace respirar la cámara en reposo.
- **Desenfoque de zoom:** radial, proporcional a la velocidad real del zoom.
- **Pliegue:** `perspective()` dentro de cada capa, girando alrededor de la tina, con los bordes difuminados.
- **Movimiento reducido:** sin inercia, pliegue, giro, paralaje ni desenfoque; solo fundidos.

| Archivo | Para qué |
|---|---|
| `public/videos/inception/bano-{azul,bano,casa}.mp4` | Placas vivas 2048 px (y `-m.mp4` a 1080 para móvil) |
| `public/images/inception/bano-{azul,bano}-prof.webp` | Mapas de profundidad (1 = cerca) |
| `components/landing-inception/profundidadBano.ts` | Profundidad que queda quieta en el paralaje (generado por `scripts/inception/preparar-profundidad.mjs`) |

## 4. Regla de fidelidad del producto

El usuario exige que el producto sea **real**. Las imágenes generadas cambiaron los mandos (un botón grande, colores en el cubo equivocado) y un video de prueba convirtió la ducha de mano en un grifo. Por eso:

1. **Primer plano:** recorte del render real ampliado con Topaz en modo CGI (sin inventar formas), quitando antes el ruido de render.
2. **Baño:** el render real es la base; la mujer generada se recorta por diferencia con el render y se compone **detrás** de la tina; tina, cubierta, ducha y mandos del render quedan siempre delante.
3. **Videos:** solo clips de **cámara fija** con el mismo cuadro al inicio y al final (bucle cerrado). Se verifica que la cámara no se mueva (desplazamiento 0 contra el keyframe) y se pone encima el render donde manda la máscara: en el primer plano todo menos el agua; en el baño todo menos agua, ella, la vela y el patio, con tina, ducha y mandos siempre del render. Las transiciones entre imágenes nunca son video generado: las hace la cámara del código.

## 5. Pendientes
- [ ] Capítulos siguientes con la misma técnica: cocina, zona de lavado, cuarto, patio.
- [ ] Nombre comercial y ficha del hidromasaje para el CTA.
