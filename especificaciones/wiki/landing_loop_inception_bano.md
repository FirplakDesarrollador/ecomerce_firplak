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
- **Cámara:** entre paradas el zoom es logarítmico alrededor del punto fijo de la semejanza que lleva un cuadro al siguiente, así nada se desliza al alejarse. En vertical el baño se centra en ella y los mandos, y la casa se aleja hasta caber de ancho.
- **Render por cuadro:** el scroll programa un `requestAnimationFrame` que escribe `transform` y `opacity` directo en el DOM (sin estado de React por cuadro). El pliegue usa `perspective()` dentro de cada capa, girando alrededor de la tina.
- **Movimiento reducido:** sin pliegue ni giro, solo fundidos.

## 4. Regla de fidelidad del producto

El usuario exige que el producto sea **real**. Las imágenes generadas cambiaron los mandos (un botón grande, colores en el cubo equivocado) y un video de prueba convirtió la ducha de mano en un grifo. Por eso:

1. **Primer plano:** recorte del render real ampliado con Topaz en modo CGI (sin inventar formas), quitando antes el ruido de render.
2. **Baño:** el render real es la base; la mujer generada se recorta por diferencia con el render y se compone **detrás** de la tina; tina, cubierta, ducha y mandos del render quedan siempre delante.
3. **Videos:** solo se aceptan después de revisar los cuadros intermedios; si tocan el producto, se descartan.

## 5. Pendientes

- [ ] Movimiento con video sin tocar el producto: clips de cámara fija (agua, pelo, tela) con el producto del render encima, en vez de transiciones generadas.
- [ ] Capítulos siguientes con la misma técnica: cocina, zona de lavado, cuarto, patio.
- [ ] Nombre comercial y ficha del hidromasaje para el CTA.
