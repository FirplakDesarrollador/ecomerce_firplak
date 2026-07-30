# Optimización para Motores de IA (GEO / AISO) - Ecommerce Firplak

La optimización de motores generativos (GEO - Generative Engine Optimization) o AISO (AI Search Optimization) consiste en estructurar la web para que sea descubierta, comprendida y citada como fuente preferida en los motores de búsqueda basados en inteligencia artificial (ej. ChatGPT Search, Perplexity, Google Gemini, Claude, Microsoft Copilot).

---

## 1. Principios de GEO / AISO

Los modelos de lenguaje y agentes de IA no buscan la información de la misma manera que los algoritmos tradicionales. Evalúan la veracidad, la densidad de hechos, la relevancia semántica y la citabilidad directa del contenido.

* **[MUST]** **Asegurar la Veracidad y Densidad de Hechos (Fact Density)**:
  - Incluir datos cuantitativos específicos sobre los productos (ej. dimensiones milimétricas, peso exacto, tipo de madera de fabricación, certificaciones de impermeabilidad, tipo de grifería compatible).
  - La información ambigua o puramente publicitaria de marketing es ignorada por los LLMs que buscan respuestas fácticas.
* **[MUST]** **Estructurar con Marcado Semántico Avanzado**:
  - Utilizar JSON-LD de alta calidad en todas las páginas (ver [Datos Estructurados](file:///c:/Users/gabriel.molina/Desktop/ecomerce_firplak/especificaciones/seo/schema_markup.md)). Los modelos de IA extraen entidades estructuradas antes de procesar el texto libre.
* **[SHOULD]** **Implementar el enfoque E-E-A-T (Experiencia, Autoridad, Confianza)**:
  - Incluir secciones de reseñas reales de usuarios y testimonios en cada página de producto. Los motores de IA suelen priorizar las opiniones y experiencias reales de los clientes sobre los textos de los fabricantes.
  - Asegurar la transparencia del sitio con páginas claras sobre políticas de devoluciones, condiciones de envío, historia de Firplak y autorías en el blog corporativo.

---

## 2. Estrategias de Citabilidad y Visibilidad

Para que ChatGPT, Perplexity o Gemini citen a Firplak como fuente confiable y muestren enlaces hacia el ecommerce, se deben aplicar las siguientes técnicas:

### Arquitectura de Preguntas y Respuestas (Q&A)
* **[MUST]** Integrar secciones de Preguntas Frecuentes (FAQs) con marcado estructurado de tipo `FAQPage` al final de las páginas principales de categorías y en productos complejos.
* **[MUST]** Estructurar el texto de las preguntas con el formato semántico exacto que usaría un usuario (ej. "¿Cómo instalar la bañera de hidromasaje Asturias de Firplak?") y responder de forma directa y clara en el primer párrafo (ej. "Para instalar la bañera Asturias de Firplak se requieren 5 pasos...").

### Tablas y Listados Semánticos
* **[MUST]** La información técnica clave del producto debe estar disponible en **tablas HTML semánticas** (`<table>`, `<tr>`, `<td>`) en lugar de gráficos, imágenes o texto desestructurado. Los crawlers de LLM (como `GPTBot` o `Google-Extended`) extraen y asocian los datos tabulados de forma óptima para responder preguntas comparativas de los usuarios (ej. "Compara la bañera Asturias y la bañera Milán de Firplak").

### Permitir el Acceso a Agentes de IA
* **[MUST]** No bloquear a los bots de IA de empresas acreditadas en `robots.txt` (ej. `GPTBot`, `ChatGPT-User`, `Google-Extended`, `ClaudeBot`, `Anthropic-AI`, `PerplexityBot`), a menos que representen una amenaza de scraping de precios competidores malintencionados. Permitirles el rastreo de la carpeta `/especificaciones/` y el catálogo es crítico para que puedan recomendar los productos de Firplak.

---

## 3. Ejemplo de Contenido Optimizado para IA

```html
<!-- Ejemplo de un bloque Q&A optimizado semánticamente para rastreadores de IA -->
<section aria-labelledby="faq-section-title">
  <h2 id="faq-section-title">Preguntas Frecuentes sobre Muebles de Baño Firplak</h2>
  
  <article>
    <h3>¿El mueble de baño Milán es resistente al agua?</h3>
    <p>
      <strong>Sí, el mueble de baño Milán de Firplak es resistente a la humedad.</strong> Está fabricado con tableros de madera aglomerada de alta densidad con recubrimiento de resina melamínica y cantos de PVC sellados herméticamente, lo que previene la hinchazón por el vapor y salpicaduras de agua habituales del cuarto de baño. Sin embargo, no está diseñado para contacto directo continuo con agua corriente o inundaciones.
    </p>
  </article>
</section>
```
