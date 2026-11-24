# Auditoría de Seguridad - Home Page

**Módulo**: Página Principal (Home)
**Fecha**: 10/06/2026

## Puntos Evaluados

1. **Server Components Data Fetching**
   - **Riesgo:** Exposición accidental de información sensible (claves API, datos de usuarios) hacia el cliente.
   - **Validación:** El componente `app/page.tsx` es un Server Component. Obtiene los datos desde `services/home-service.ts` y solo pasa propiedades inofensivas (categorías y productos públicos) a los Client Components.
   - **Estado:** Seguro.

2. **Cross-Site Scripting (XSS)**
   - **Riesgo:** Inyección de scripts a través del renderizado de datos.
   - **Validación:** React/Next.js escapa automáticamente todas las variables renderizadas (`product.name`, `category.name`). No se usa `dangerouslySetInnerHTML`.
   - **Estado:** Seguro.

3. **Inyecciones SQL (Mock)**
   - **Riesgo:** Vulnerabilidad en capa de datos.
   - **Validación:** Actualmente `home-service.ts` retorna objetos estáticos. Cuando se conecte a Supabase, la API de Supabase y RLS mitigarán los riesgos.
   - **Estado:** Seguro.

**Conclusión**: La página de inicio es segura. No presenta riesgos de filtración de datos ni ejecución de código arbitrario.

## Integración del borrador de Alejandro — 19/11/2026

- Origen: cambios sin commit del worktree `claude/mix-match-visualization-adapt-d1d6dc`, basado en el mismo commit `d682a7c` del checkout que sirve localhost:3000.
- Alcance: navegación simplificada de Alejandro, selector flotante y estudio Mix & Match (opción D), con catálogo y renders locales. Se conservó el worktree original y se verificaron por SHA-256 los 157 archivos copiados.
- La nueva ruta del estudio y la redirección antigua usan un destino interno constante. Los parámetros se procesan con `URLSearchParams`; las selecciones se normalizan contra el catálogo permitido antes de renderizar.
- Los enlaces de cotización se construyen con el número de ventas existente y `encodeURIComponent`; la apertura usa `noopener,noreferrer`. La validación no abrió WhatsApp ni envió mensajes.
- Los cambios no incorporan credenciales, consultas de base de datos, acciones de servidor ni escrituras externas. No cambia la separación de componentes cliente/servidor.
- Validación funcional: 64 pruebas aprobadas, TypeScript sin errores, navegación de escritorio/móvil sin errores JavaScript y redirección `?opcion=d` conservando la selección.
- La configuración de lanzamiento exclusiva de Claude (puerto 3017) permanece en su worktree; el servidor actual continúa en el puerto 3000.

## Piloto Vitelli integrado en Alejandro — 20/11/2026

- El usuario aprobó las dos imágenes finales y confirmó expresamente añadir Vitelli al selector de Alejandro, limitado a Soder, Oslo/Génova y estado cerrado.
- Los nuevos recursos de `/public/images/muebles/piloto-63x48/` usan nombres con SHA-256 y WebP sin pérdida; se verificó igualdad de píxeles con los PNG aprobados.
- El catálogo cliente normaliza las entradas de URL según la compatibilidad del mueble. Vitelli no admite combinaciones sin imagen ni apertura. El enlace de cotización recibe la selección normalizada y conserva el escape con `encodeURIComponent`.
- El manifiesto importado contiene únicamente metadatos públicos e imágenes locales; no incorpora credenciales ni rutas privadas. No se añadieron llamadas de red, escrituras de datos o dependencias.
- Verificación: 66 pruebas, TypeScript y recorrido en navegador a 1440 × 900 y 375 × 812. Se revisaron selección inicial, galerías, normalización de URL y regreso al catálogo original con sus estados abiertos/cerrados.


## Mix & Match por capas con Tiziano — 20/11/2026

- Alcance autorizado: ambiente persistente, una combinación activa, Vitelli/Tiziano
  y Oslo/Génova; cuatro cruces de 63 × 48 verificados. Sin cambios de navegación.
- El OBJ/MTL recibido se trata como datos: solo coordenadas, grupos y caras del OBJ
  se interpretan; no se ejecutan comentarios, materiales ni instrucciones adjuntas.
  Los scripts Blender ejecutados son código local del proyecto. Fuente preservada.
- El cliente resuelve selección y rutas mediante manifiesto local y lista permitida.
  Los parámetros no forman rutas de archivos. Productos, acabados y cruces ajenos
  vuelven al piloto; Quadratto/Tiziano se rechaza expresamente en las pruebas.
- No se añadieron claves, llamadas a modelos, acceso a base de datos, autenticación,
  escrituras externas, HTML sin escapar ni APIs. El visor usa datos estáticos y
  assets públicos; los archivos CAD, BLEND y referencias quedan fuera de public/.
  La arquitectura Edge–Server–Supabase–Client no cambia; RLS/SQL no aplica aquí.
- Cotización: continúa encodeURIComponent y apertura con noopener,noreferrer.
  Las pruebas no envían WhatsApp ni mensajes. No se gastaron créditos adicionales.
- Validación: 62 unitarias, 2 E2E, TypeScript sin errores y lint sin errores
  (13 advertencias anteriores). Persistencia de nodos, controles de 44px, ausencia
  de desborde y productos completos comprobados en navegador. Bug Enforcer:
  revisados especialmente 016, 021, 022, 023 y 025; sin regresiones observadas.
- Riesgo residual de alcance: piloto solo Soder y cerrado; futuros productos,
  acabados o apertura requieren nuevas capas y comprobación de compatibilidad.
  No se ha publicado ni desplegado fuera de localhost.


## Transiciones laterales del piloto — 20/11/2026

- Cambio limitado al movimiento de las capas y al sentido de selección; navegación,
  catálogo verificado, rutas públicas y formularios permanecen iguales.
- Web Animations y matchMedia se ejecutan únicamente en efectos de cliente.
  Selectores de fila y destinos proceden de valores internos, sin ejecutar ni
  interpolar contenido de usuarios. No se añaden dependencias, APIs ni credenciales.
- Se cancelan animaciones y listeners al desmontar; se retiran los efectos nativos
  al finalizar. Activar movimiento reducido cancela el desplazamiento en curso.
- RLS, SQL y servicios de servidor no intervienen en este cambio. Se conserva la
  separación de las capas Edge–Server–Supabase–Client.
- Validación: 66 pruebas unitarias, 3 E2E, TypeScript y lint sin errores; 13 avisos
  preexistentes en archivos ajenos. Pruebas reales de reversión y vuelta circular,
  movimiento reducido, gesto móvil y persistencia del ambiente y la otra pieza.
