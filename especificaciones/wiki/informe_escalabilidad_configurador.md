# Informe: escalabilidad del configurador de muebles

> [!IMPORTANT]
> **Estrategia Condensada del Segmento**:
> El 3D en tiempo real crece por **mueble distinto**, no por combinación: cada ficha pesa lo mismo con 1 o con 130 referencias. Lo costoso no es la web sino **preparar los archivos fuente y los datos** (SKU, precio, compatibilidad). La recomendación es un **camino híbrido**: una sola fuente (modelo 3D + tableros + datos) que produce renders fotorrealistas automáticos para el listado y Google, el configurador 3D en la ficha y realidad aumentada.

Fecha: 13 de octubre de 2026 · Contexto: sesión *lavamanos & muebles*, [Opción A](banos_muebles_opcion_a.md) (Vitelli 63). Hoja resumen visual: [presentación de una hoja](https://claude.ai/artifact/XEyZwSZsVNjE6tmUeBHY78) (privada, del autor).

**Cómo leer los números:** los pesos de la sección 1 están **medidos** en esta sesión; los tiempos de producción, render y nube son **estimaciones de orden de magnitud** para comparar caminos, no para presupuestar. Un piloto de 2–3 muebles los convierte en datos propios.

---

## 1. Punto de partida (medido)

| Pieza | Peso | Nota |
|---|---|---|
| Motor 3D (three.js + React Three Fiber) | 303 KB gzip | Solo en esa página; la landing no lo descarga (verificado) |
| Modelo Vitelli (GLB) | 691 KB | Desde un FBX de 3,9 MB; 118.080 → 88.223 triángulos |
| 5 texturas de tablero | 708 KB | 1024 px; se pueden pedir de a una |
| Miniaturas y muestras | 55 KB | Selectores de acabado y lavamanos |
| **Total primera visita** | **≈ 1,76 MB** | Igual con 1 o con 130 referencias |
| Memoria de video (texturas) | ≈ 28 MB | Con KTX2 baja a ≈ 7 MB |

La conversión FBX → web es automática (1–2 min). Lo que tomó tiempo fue adaptar ese FBX: copias abiertas y cerradas, nombres genéricos (`Group026`…), lavamanos superpuestos y 2 de 4 sin perforación de grifo.

## 2. Cómo crece el catálogo

**1 modelo × 5 acabados × 4 lavamanos = 20 combinaciones vendibles por mueble.**

- **En 3D:** 1 modelo + 5 texturas compartidas por todo el catálogo.
- **En renders:** 20 combinaciones × 4 vistas × 2 estados (cerrado / abierto) = **160 imágenes por mueble**.

La pregunta clave es cuántos muebles distintos (geometrías) hay detrás de las referencias.

### 80 referencias, dos lecturas

| | A · 80 muebles distintos | B · 16 muebles × 5 acabados |
|---|---|---|
| Modelos 3D a preparar | 80 | 16 |
| Almacenamiento 3D | ≈ 56 MB + texturas | ≈ 11 MB + texturas |
| Peso de cada ficha (3D) | ≈ 1,76 MB | ≈ 1,76 MB |
| Renders por combinación | 12.800 imágenes · 2,5 GB | 2.560 imágenes · 0,5 GB |
| Render con Lumen (≈ 5 s c/u) | ≈ 18 h de GPU | ≈ 4 h de GPU |
| Path tracing (≈ 1 min c/u) | ≈ 9 días de GPU | ≈ 2 días de GPU |

Supuestos: 5 acabados y 4 lavamanos por mueble; 4 vistas y 2 estados; WebP 2K de ≈ 200 KB; ≈ 15 tableros compartidos (≈ 2 MB); 1 GPU de estación de trabajo.

### Sumar 50 muebles o cambiar un acabado

| Camino | Sumar 50 muebles | Retirar un acabado y entrar uno nuevo (80 muebles) |
|---|---|---|
| 3D en tiempo real | 50 modelos; ninguna ficha pesa más | 1 textura; las 80 fichas cambian al instante |
| Renders por combinación | 8.000 renders (+1,6 GB) | 2.560 renders por repetir |
| Capas fotorreales | 4.000 capas | 640 capas |
| **Híbrido (recomendado)** | 50 modelos + 200 renders automáticos | 1 textura + re-render automático de lo que la usa |

Con renders, el costo crece con cada opción nueva; con 3D, solo con cada mueble nuevo.

### Quitar referencias también tiene costo

- **Enlaces compartidos:** un link con un acabado retirado ya cae a la combinación inicial; falta avisarlo.
- **Google y SEO:** redirigir (301) cada ficha retirada a su reemplazo o a la categoría.
- **Feeds y cadenas:** sacar el SKU de Google Shopping y de los retailers el mismo día.
- **Cotizaciones abiertas:** lo ya cotizado debe seguir visible para el asesor.
- **Archivos:** con 3D se borra 1 modelo; con renders, cientos de imágenes en CDN y cachés.
- **Historial:** guardar qué se eligió indica qué acabado reemplaza mejor al que sale.

## 3. Tiempos de producción (estimados)

| Tarea | Por mueble | Para +50 muebles |
|---|---|---|
| FBX con convención de entrega | 1–3 h | 50–150 h |
| FBX sin convención (como el Vitelli) | 4–8 h de adaptación | 200–400 h |
| Conversión a GLB y miniaturas | 1–2 min, automática | 1–2 h de máquina |
| Revisión visual (QA) | 15–30 min | 12–25 h |
| Datos: SKU, precio, compatibilidad | 15–30 min | 12–25 h |
| Renders por combinación (Lumen / path tracing) | 13 min / 2,7 h de GPU | 11 h / 5,6 días de GPU |

**Totales de trabajo de persona** (modelado + QA + datos):

| | Por mueble | 80 muebles | +50 muebles |
|---|---|---|---|
| Con convención | ≈ 1,5–4 h | **120–320 h** (≈ 4–11 semanas) | 75–200 h |
| Sin convención | ≈ 4,5–9 h | 360–720 h (≈ 12–24 semanas) | 225–450 h |

Semanas con 1 persona a ≈ 30 h productivas por semana; con dos en paralelo, casi la mitad. Los renders son tiempo de máquina (corren solos): en el camino híbrido, 4 por mueble, 80 muebles = 320 imágenes ≈ 30 min con Lumen o ≈ 5 h con path tracing.

**La convención de entrega es la decisión que más ahorra:** baja la adaptación de horas a minutos.

## 4. Calidad visual "tipo Unreal"

| Nivel | Qué es | Peso por ficha | Móvil | Costo |
|---|---|---|---|---|
| 1 · Hoy (Opción A) | Luz en tiempo real, sombras, texturas reales de tablero | ≈ 1,76 MB | Bien desde gama media | Ya está hecho |
| 2 · Premium web | Oclusión horneada en Unreal o Blender, relieve de tablero y canto, HDRI de estudio, post-proceso, texturas KTX2 | ≈ 3,5 MB | Gama de entrada con modo imagen | 1–2 semanas + horneado por mueble |
| 3 · Unreal en la nube | Pixel Streaming: Unreal en una GPU remota, llega como video | Video continuo | Depende de la red; hay latencia | ≈ US$0,5–2 por hora y usuario |

El nivel 3 sirve para showroom o eventos, no para tráfico masivo de ecommerce. Unreal 5 ya no exporta a navegador (el HTML5 de 4.23 fue experimental y se retiró).

### Peso de página por camino (red móvil lenta de 2 Mbps)

| Camino | Descarga | Tiempo |
|---|---|---|
| Render estático (1 vista) | 0,25 MB | 1 s |
| Capas fotorreales (1 vista) | 0,4 MB | 1,6 s |
| Opción A optimizada (una textura al inicio) | 1,2 MB | 4,8 s |
| Opción A (hoy) | 1,76 MB | 7 s |
| Giro 360° (36 fotos) | 2,2 MB | 8,8 s |
| Nivel 2 premium web | 3,5 MB | 14 s |

En 4G de 10 Mbps, dividir los tiempos entre 5. Cualquier camino 3D puede mostrar primero un render (≈ 0,25 MB) y descargar el 3D solo si el cliente lo pide.

## 5. Archivos fuente: FBX, OBJ o GLB

| Capacidad | OBJ | FBX | GLB / glTF |
|---|---|---|---|
| Jerarquía y pivotes (abrir puertas y cajones) | No | Sí | Sí |
| Unidades y escala | No las guarda | Sí | Sí, en metros |
| Materiales | Básicos (MTL) | Solo nombres; Corona no viaja | PBR estándar |
| Listo para la web | No | Con conversión | Sí |
| Recomendación | Evitar | Desde 3ds Max | Ideal si se exporta directo |

OBJ no sirve para un configurador: pierde jerarquía y pivotes, así que no hay puerta ni cajones que se abran.

### Convención de entrega para cada mueble

1. Un archivo por mueble; cada lavamanos en su propio archivo, reutilizable.
2. Centímetros; origen en la pared, la base del mueble y el centro del ancho.
3. Solo el estado cerrado: sin copias de puertas o cajones abiertos.
4. Puertas con el pivote en la bisagra; cajones con su recorrido en el nombre.
5. Nombres por rol: `MUEBLE_`, `PUERTA_`, `CAJON_`, `LAV_`, `GRIFO_`, `SIFON_`, `HERRAJE_`.
6. Materiales por rol: `ACABADO`, `CANTO`, `MARMOL`, `METAL_NEGRO`, `CROMO`.
7. Lavamanos con dos marcadores: `PUNTO_GRIFO` y `PUNTO_DESAGUE`.
8. Máximo ≈ 60.000 triángulos por mueble; herrajes ocultos simplificados.
9. Tableros escaneados con medida real, sin costuras y con la veta indicada.
10. Exportar FBX 2020 o GLB, sin luces, cámaras ni objetos ocultos.

Cada regla responde a un problema real del FBX del Vitelli.

## 6. Escenarios que no estamos viendo

**Datos y negocio**
- **Cada combinación es un SKU:** precio, stock y código SAP por combinación; hoy no existen, se cotiza.
- **No todo combina:** medidas, perforaciones y pocetas desplazadas (¿Parma izquierdo y derecho?).
- **El listado no puede ser 3D:** una grilla con 80 visores 3D no carga; la categoría necesita imágenes igual.
- **Google pide foto por variante:** Shopping y marketplaces exigen la imagen de cada color.
- **Pantalla ≠ tablero real:** calibrar color, aviso de "imagen de referencia" (SIC) y muestras físicas.
- **El canto también es acabado:** el tapacanto puede variar de color y hoy usa la textura del frente.

**Técnica y operación**
- **Archivos fuera de git:** `public/` ya pesa 158 MB (videos 127 MB); modelos y renders van a almacenamiento + CDN.
- **Versiones y caché:** si un modelo cambia y conserva el nombre, el cliente puede ver el viejo.
- **Gama de entrada:** móviles con poca memoria o datos prepago → solo modo imagen.
- **Hoy agrega un dev:** sumar un mueble es editar código y correr scripts; falta un panel de carga.
- **Librerías que cambian:** three r186 ya quitó un tipo de sombra que usábamos; fijar versiones.
- **Accesibilidad:** buscadores y lectores de pantalla no ven el 3D; cada vista necesita texto.

**Oportunidades que salen del mismo modelo:** realidad aumentada ("ver en tu baño"; USDZ para iPhone), fotos automáticas por variante, widget para cadenas retail, tablet y QR en tienda física, imagen al compartir por WhatsApp y datos de demanda (qué acabados eligen).

## 7. ¿Renders e imágenes es mejor? Cuatro caminos

| Criterio | A · 3D en tiempo real | B · Render por combinación | C · Capas fotorreales | D · Híbrido (recomendado) |
|---|---|---|---|---|
| Realismo | Medio-alto | Muy alto | Alto | Muy alto + 3D |
| Peso por ficha | 1,76 MB | 0,25 MB por vista | 0,4 MB por vista | 0,25 MB; 3D opcional |
| Sumar 50 muebles | 50 modelos | 8.000 renders | 4.000 capas | 50 modelos + 200 renders |
| Cambiar 1 acabado | 1 textura | 2.560 renders | 640 capas | 1 textura + renders auto |
| Interactividad | Girar, abrir, medir | Ninguna | Opciones en vista fija | Completa en la ficha |
| SEO y Google Shopping | Débil | Fuerte | Fuerte | Fuerte |
| Móvil de entrada | Riesgo | Excelente | Excelente | Excelente |

Para verse bien y cargar rápido, los renders ganan; para crecer y cambiar acabados, no. Las capas (C) corresponden al concepto [mix_and_match.md](mix_and_match.md); su reto son las sombras entre capas.

## 8. Recomendación: una fuente, tres salidas

**Fuente única:** modelo 3D por mueble con la convención de entrega, tableros escaneados compartidos por todo el catálogo, y SKU, precio y compatibilidad desde Supabase y SAP.

1. **Renders fotorreales en Unreal**, automáticos con Variant Manager y Movie Render Queue (ya en el proyecto `Vitelli_M_M`; requiere un script que recorra las variantes). Para listado, SEO, Google y redes.
2. **Configurador 3D en la ficha** (Opción A), cargado al tocar "Ver en 3D".
3. **Realidad aumentada y widget retail**.

### Siguientes pasos (piloto antes de escalar a 80)

1. Definir qué es una referencia y la matriz de compatibilidad.
2. Probar la convención de entrega con 2 muebles nuevos.
3. Automatizar los renders de variantes desde `Vitelli_M_M`.
4. Mover modelos y renders a almacenamiento con CDN.
5. Catálogo en Supabase y un panel para cargar referencias.
6. Medir en el piloto: cotizaciones con render contra con 3D.

### Decisiones pendientes

- ¿Las 80 son muebles distintos o ya incluyen acabados?
- ¿Cuántos acabados y lavamanos por línea?
- ¿Grifo y sifón se venden con el combo?
- ¿Qué GPU y presupuesto para renders?
- ¿Qué cadenas recibirán el configurador?

## 9. Supuestos

| Medido en la sesión | Estimado, a validar |
|---|---|
| JS 3D: 1.088 KB minificado, 303 KB gzip | Render: ≈ 5 s Lumen, ≈ 1 min path tracing |
| GLB 691 KB desde un FBX de 3,9 MB | Horas de modelado y adaptación de FBX |
| Triángulos 118.080 → 88.223 | ≈ 200 KB por render WebP 2K |
| Texturas 708 KB; miniaturas 55 KB | Peso del nivel 2 (≈ 3,5 MB) |
| La landing no descarga three.js | Pixel Streaming: US$0,5–2 por hora |
| `public/` 158 MB (videos 127 MB) | Redes móviles de 2 y 10 Mbps |

## 10. Nota posterior: la Opción B confirma el camino de capas

La [Opción B](banos_muebles_opcion_b.md) (19 oct 2026) aplica el camino C con una mejora: cada render trae una **capa de luz** y el navegador pinta cualquiera de los 5 tableros. Con 2 muebles y 5 lavamanos no hicieron falta 2 × 5 × 5 = 50 renders: bastaron 9, y la combinación faltante se armó por capas. Para sumar piezas basta **un render por mueble y uno por lavamanos** con la misma cámara.
