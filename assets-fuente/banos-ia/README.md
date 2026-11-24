# Imágenes con IA para baños: carpeta de trabajo

Carpeta del flujo de VIBEWORKFLOW **"Flujo de creación de imágenes con AI para baños"** (entorno FIRPLAK, área Mercadeo).
Las herramientas (Fusion, Blender, Higgsfield) vienen del flujo *"Flujo de creación de renders para Mix & Match con IA"* (`87890707-bd52-40a7-bda6-99f11af439a5`).

```
banos-ia/
├── modelos-3d/              ← fuentes 3D de referencia (la geometría del producto sale de aquí)
│   ├── lavamanos/           ← STL/OBJ/GLB de un solo lavamanos
│   ├── muebles/             ← mueble sin lavamanos
│   ├── kits/                ← mueble + lavamanos ensamblados (o piezas de un kit)
│   └── catalogo.json        ← inventario con tamaño y hash; actualizarlo al agregar archivos
├── raw/                     ← evidencias SIN modificar: lo que entrega el usuario o SharePoint
│   └── AAAA-MM-DD_<producto>_<origen>/
│       ├── 00-solicitud/    ← solo origen SharePoint: copia de la carpeta y del brief de cambios
│       ├── 01-ambiente/     ← referencias de estilo / fondo / stage (imágenes y texto)
│       ├── 02-montaje/      ← referencias de acabados, colores, vista y perspectiva
│       ├── brief.md         ← decisiones textuales con fecha, tal como se dieron
│       └── registro.json    ← índice: archivo, origen, fecha, hash, parte (1 o 2)
├── trabajo/<sesión>/        ← render base, máscaras, propuestas de Parte 1, prompts, registro de créditos
└── entregables/<sesión>/    ← imágenes finales aprobadas (formato y resolución acordados)
```

## Reglas
- **`raw/` es solo de entrada.** Se copia el archivo original con su nombre; nunca se edita ni se reemplaza. Cada ingreso se anota en `registro.json`.
- `<origen>` es `directo` (referencias por chat) o `sharepoint` (carpeta de re-render).
- El producto siempre sale del render real del archivo 3D. La IA ambienta y retoca materiales; no redibuja la pieza.
- Unidades: el STL de Fusion está en mm (escala 0,001). El OBJ de Tiziano está en cm (0,01). Siena importa con Z arriba. Ver `renders-3d/fusion-lavamanos-63x48.config.json` (configuración de `scripts/modelos-3d/render-bulk.py`).

## Catálogo inicial (23-11-2026)
| Tipo | Archivos | Origen |
|---|---|---|
| Lavamanos 63×48 | bari, genova, oslo, parma, quadratto, siena, trentino, oasis-meson | Exportados de Fusion (`renders-3d/fusion-lavamanos-63x48`) |
| Lavamanos vessel | doha 45×33, meca 35×35 | Fusion |
| Kits | doha-meca (ensambles doha y meca, mesón y salpicadero QZ); vitelli-63 + oslo (GLB) | Fusion / `public/models/muebles/vitelli-63.glb` |
| Muebles | tiziano 63×48 (OBJ + MTL, en cm) | `assets-fuente/generativo-63x48/piloto-capas/modelos` |

Los binarios no se versionan en git (igual que el resto de `assets-fuente/`); la copia de seguridad la hace OneDrive.
