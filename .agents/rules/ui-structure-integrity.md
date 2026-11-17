# UI Structure Integrity & Assets Policy Rule

## Description
Garantiza la integridad estructural y la unificación de la interfaz de usuario (UI), jerarquía de información, menús de navegación y tarjetas informativas en el Home y en todas las visualizaciones del proyecto. 

Cuando se realicen actualizaciones o reemplazos de assets (vídeos, imágenes, gráficos, modelos 3D, posters), bajo ninguna circunstancia se debe modificar la estructura de la UI, el layout, el contenido informativo ni la oferta de navegación.

## Trigger
- Modificación, reemplazo o adición de assets multimedia (videos, posters, imágenes, banners, gráficos).
- Tareas de integración o ajuste de escenas en el Home y landings.
- Peticiones del usuario que propongan alteraciones de layout, componentes de UI, menús o tarjetas de información.

## Mandatory Behavior

1. **Aislamiento Estricto en Cambios de Assets**:
   - Al actualizar assets (videos, imágenes, gráficos), los cambios deben limitarse exclusivamente a las referencias del recurso (rutas `src`, `poster`, propiedades de aspect ratio o encuadre del asset).
   - **Prohibido tocar**:
     - Menús y barras de navegación (`LoomereNavbar`, `LoomereMegamenu`, cabeceras).
     - Tarjetas informativas de escenas, productos o características (`LoomereOverlay`, `LoomereProductDrawer`, `FirplakKeyFeatures`, `FirplakEcosystemSection`).
     - Estructura DOM/JSX, clases de layout, breakpoints o jerarquías de contenido.

2. **UI Unificada entre Visualizaciones**:
   - Todas las propuestas y visualizaciones del sitio comparten una base de diseño y experiencia de usuario unificada. Las variaciones permitidas entre visualizaciones se limitan a assets visuales y detalles puntuales de contenido interno, preservando la coherencia global del producto.

3. **Confirmación Previa Obligatoria ante Cambios de UI o Estructura**:
   - Si el usuario solicita **expresamente** un cambio en la UI, en los menús, en las tarjetas de información o en la estructura de contenido:
     - **El agente NO debe ejecutar el cambio de inmediato.**
     - **Debe consultar y advertir primero al usuario**, indicando con claridad:
       > *"¿Confirmas que deseas modificar la UI / estructura de información? Ten en cuenta que esto afectará las directrices de UI unificada ya implementadas para las diferentes visualizaciones del proyecto."*
     - Únicamente tras recibir la ratificación explícita del usuario, se procederá con la modificación solicitada.

## Restrictions
- ❌ Prohibido alterar menús, tarjetas informativas o flujos de navegación durante tareas de assets.
- ❌ Prohibido aplicar cambios estructurales de UI sin haber solicitado y obtenido confirmación previa del usuario.
