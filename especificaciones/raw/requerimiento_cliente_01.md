# Requerimiento de Cliente 01: Arquitectura de SKUs, Supabase, Integración SAP y Visualizador Mix & Match

**Fecha:** 2026-07-08  
**Origen:** Transcripción/Instrucciones del Cliente  

## Descripción del Requerimiento

1. **Arquitectura y Catálogo de SKUs:**
   - Soporte para un volumen extremadamente alto de SKUs (muchas referencias de producto).
   - Cada producto cuenta con múltiples variaciones, opciones y elementos adicionales.
   - Las listas de precios se conectarán a Supabase y deben actualizarse de manera sencilla desde diferentes endpoints o fuentes de datos.

2. **Visualizador Interactivo "Mix and Match":**
   - No debe ser una visualización rígida con imágenes estáticas simples.
   - Particularmente para las configuraciones de lavamanos y muebles:
     - Los lavamanos se pueden mover lateralmente (izquierda y derecha).
     - Los muebles/modelos correspondientes se posicionarán abajo, en coincidencia perfecta con el lavamanos seleccionado, y también se podrán mover a la izquierda y derecha.
     - Los modelos variarán de color dinámicamente según la información definida en la base de datos de Supabase, que indicará las variaciones posibles y permitidas existentes de producto.
     - Manejo de cantidades de selección.

3. **Integración con ERP (SAP):**
   - Conexión vía API utilizando el Service Layer de SAP para sincronizar datos comerciales y operativos relevantes.
