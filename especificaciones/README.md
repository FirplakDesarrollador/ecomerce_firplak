# Wiki de Especificaciones y Conocimiento de Firplak E-commerce

Esta carpeta almacena la documentación de especificaciones y conocimiento del proyecto, siguiendo el patrón **LLM Wiki** (compilación incremental y persistente de conocimiento).

## Estructura del Wiki

- **[raw/](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/raw/)**: Carpeta para almacenar fuentes brutas e inmutables de requerimientos (pdfs, transcripciones, notas de reuniones, capturas).
- **[wiki/](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/)**: Base de conocimiento procesada y compilada.
  - **[index.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/index.md)**: Catálogo organizado de páginas y conceptos del wiki.
  - **[log.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/log.md)**: Registro histórico de ingestas, consultas y auditorías.
  - **Módulos/Conceptos**: Archivos markdown con la especificación detallada de cada componente.

---

## Instrucciones para el Agente (Schema)

Como asistente de IA, debes seguir estas reglas al interactuar con esta wiki:

### 1. Ingesta de fuentes (Ingest)
Cuando se añada una nueva fuente a `raw/` o se defina un nuevo requerimiento:
- Lee y analiza a fondo la fuente.
- Identifica qué páginas de `wiki/` deben actualizarse o si se debe crear una nueva.
- Actualiza las páginas afectadas garantizando consistencia (si un dato nuevo contradice uno viejo, discútelo o refléjalo con advertencias).
- Agrega referencias cruzadas usando enlaces markdown relativos (ej. `[Módulo de Pago](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/modulo_pago.md)`).
- Actualiza el archivo `wiki/index.md` con la nueva página y su resumen.
- Añade una entrada en `wiki/log.md` con el prefijo:
  `## [YYYY-MM-DD] ingest | <Título de la fuente o cambio>`

### 2. Resolución de Consultas (Query)
Para responder preguntas sobre la arquitectura o lógica de negocio:
- Lee primero `wiki/index.md` para encontrar las páginas relevantes.
- Lee las páginas del wiki para construir tu respuesta.
- Si la respuesta a la consulta genera un análisis valioso, guárdalo como una nueva página en `wiki/` y regístralo.

### 3. Auditoría de Salud (Lint)
Periódicamente (o a petición), realiza un escaneo de salud:
- Verifica enlaces rotos.
- Busca contradicciones entre páginas de especificaciones.
- Identifica páginas huérfanas.
- Propón mejoras o vacíos de información que requieran investigación.
