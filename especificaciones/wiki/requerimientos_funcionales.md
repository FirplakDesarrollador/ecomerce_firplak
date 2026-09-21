# Especificación: Requerimientos Funcionales, Negocio y Operación

Esta página compila y categoriza los requerimientos de marketing, medición, CMS, experiencia de usuario (UX/UI), gobernanza, seguridad e infraestructura para el e-commerce de Firplak.

---

## 1. 📊 Marketing, Analítica y CRM (Trazabilidad y Medición)
- **Trazabilidad End-to-End**: Mantener la trazabilidad completa del usuario desde la primera visita (fuente, campaña, atribución) hasta la conversión/venta final.
- **Atribución de Origen**: Registrar y enviar al CRM el origen exacto de cada lead, oportunidad y venta mediante Pixel de seguimiento y parámetros UTM.
- **Medición de Eventos y Conversiones**: Implementar eventos de analítica para la medición de:
  - Envío de formularios.
  - Clics en el botón de WhatsApp.
  - Descargas de archivos (fichas técnicas, catálogos, instructivos).
  - Interacciones con el carrito de compras (añadir, remover, abandonar).
  - Confirmación y ciclo de compras.
- **Integración CRM Multicanal**: Conectar directamente con el CRM los formularios del sitio web, campañas publicitarias de marketing y canal de atención de WhatsApp.
- **Atención y Conversación Automática / En Vivo**: Evaluar la implementación de chat en vivo con agente humano y/o integración de un Chatbot inteligente para atención rápida.

---

## 2. 🎛️ CMS y Autonomía de Mercadeo
- **Autonomía Comercial y Visual**: Permitir al equipo de mercadeo administrar, actualizar y modificar independientemente elementos comerciales y visuales, incluyendo pop-ups promocionales, banners dinámicos y campañas sin requerir intervención técnica.
- **Flujo de Trabajo del CMS (Workflow)**: El CMS debe contar con capacidades para:
  - **Programación**: Agendar publicaciones con fecha/hora de inicio y fin.
  - **Aprobación**: Flujo de revisión pre-publicación.
  - **Reversión (Rollback)**: Historial de versiones con capacidad de revertir cambios ante errores.
- **Gestión de Instructivos y Códigos QR**: Módulo administrativo dedicado a gestionar instructivos de productos y vincular los códigos QR actuales del negocio.
- **Soporte Multi-Idioma (Inglés)**: Réplica del sitio en versión inglés con fines informativos y de catálogo (excluyendo la opción de compra e internacionalización de pagos/envíos).

---

## 3. 🛍️ Experiencia de Usuario (UX/UI) y Catálogo
- **Vista Previa de Producto (Quick View)**: Permitir abrir un modal/ventana flotante de vista previa al hacer clic en las imágenes del catálogo sin abandonar la página de navegación actual.
- **Visualización Interactiva de Colores**: Vista previa dinámica de las opciones de colores en la categoría de muebles.
- **Carrusel Multimedial de Producto**: Integración nativa de videos dentro del carrusel de imágenes del detalle de producto (PDP).
- **Diseño Responsive Garantizado**: Interfaz adaptada y probada al 100% para dispositivos móviles, tablets y escritorios.

---

## 4. 🛡️ Gobernanza, Seguridad y Continuidad de Negocio
- **Control de Acceso y Roles (RBAC)**: Definición precisa de roles y permisos para administradores, redactores de mercadeo y aprobadores.
- **Mecanismo de Validación / Anti-Errores**: Sistema validador automático que detecte anomalías o errores críticos antes de publicar (ej. alertas por precios raros o inconsistentes).
- **Arquitectura Extensible (APIs y Plugins)**: Capacidad técnica de integración flexible mediante plugins o APIs de terceros.
- **Estrategia de Backups**: Definición clara de la frecuencia automatizada de copias de seguridad y repositorios de almacenamiento seguro.
- **Pruebas de Seguridad y Auditorías**: Protocolos y pruebas periódicas de seguridad (vulnerabilidades, pruebas de penetración).
- **Plan de Continuidad Operacional (Plan B)**: Definición de proveedores, SLA y protocolo de contingencia (Plan B) para la atención de caídas, ciberataques, hackeos o incidencias en horarios críticos (fines de semana y festivos).

---

## 5. ⚡ Rendimiento y Optimización (Performance)
- **Optimización de Activos Digitales**: Compresión y optimización automática de imágenes, videos y contenidos estáticos para garantizar altas velocidades de carga y cumplimiento de métricas Core Web Vitals.
