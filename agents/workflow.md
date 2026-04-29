# Workflow Completo del Proyecto — Guía para Agentes

Este archivo es la referencia definitiva del proceso de desarrollo. El resumen ejecutivo
está en `AGENTS.md` en la raíz del proyecto. Aquí están todos los detalles.

---

## FLUJO DE 4 FASES (OBLIGATORIO EN CADA MÓDULO)

### FASE 1 — Desarrollo del Módulo
1. Verificar si existe una `skill` relevante en `/skills/` antes de escribir código desde cero.
2. Crear el módulo siguiendo la arquitectura del proyecto (Next.js App Router, TypeScript).
3. Mantener los componentes pequeños, reutilizables y correctamente tipados.

### FASE 2 — Pruebas Unitarias
1. Crear el archivo `/pruebas-unitarias/<nombre-modulo>.test.ts`.
2. Cubrir como mínimo:
   - El caso de uso principal (happy path).
   - Al menos un caso de error o borde.
   - Las funciones de transformación/validación de datos.
3. Ejecutar `npm test` y confirmar que todas las pruebas pasan.

### FASE 3 — Auditoría de Seguridad
1. Revisar el módulo buscando las siguientes vulnerabilidades:
   - **Rutas no protegidas**: ¿Cualquier usuario puede acceder?
   - **Validación de inputs**: ¿Se validan y sanitizan todos los datos del usuario?
   - **Exposición de secretos**: ¿Hay API keys o variables de entorno en el código?
   - **Autorización**: ¿Se verifica que el usuario tiene permiso para cada acción?
   - **Inyección**: ¿Las queries a la base de datos son seguras?
2. Crear `/security/auditoria-<nombre-modulo>.md` con los hallazgos y correcciones.
3. Si no hay vulnerabilidades, el archivo debe decir "Sin hallazgos — revisión completada".

### FASE 4 — Documentación
1. Crear o actualizar `/docs/<nombre-modulo>.txt` usando la plantilla de abajo.
2. El archivo DEBE estar completo. Nunca dejar campos vacíos.

---

## PLANTILLA OBLIGATORIA: /docs/<nombre-modulo>.txt

```
================================================================================
DOCUMENTACIÓN DEL MÓDULO
================================================================================

NOMBRE DEL MÓDULO   : [Nombre descriptivo del módulo]
ÚLTIMA ACTUALIZACIÓN: [DD/MM/YYYY]

--------------------------------------------------------------------------------
DESCRIPCIÓN GENERAL
--------------------------------------------------------------------------------
[Descripción clara de qué hace el módulo, cuál es su propósito dentro del
sistema y qué problema resuelve.]

--------------------------------------------------------------------------------
DEPENDENCIAS DE BASE DE DATOS
--------------------------------------------------------------------------------
TABLAS:
  - [nombre_tabla_1]  : [descripción breve del uso]
  - [nombre_tabla_2]  : [descripción breve del uso]

VISTAS:
  - [nombre_vista_1]  : [descripción breve del uso]
  (Si no aplica, escribir: NINGUNA)

--------------------------------------------------------------------------------
DEPENDENCIAS DE SERVICIOS EXTERNOS
--------------------------------------------------------------------------------
ENDPOINTS / APIs:
  - [URL o nombre del endpoint] : [descripción del uso]
  (Si no aplica, escribir: NINGUNO)

CONEXIÓN SAP:
  - [Nombre del objeto SAP / BAPI / consulta] : [descripción]
  (Si no aplica, escribir: NINGUNA)

CONEXIÓN MICROSOFT (Azure, Graph API, etc.):
  - [Nombre del servicio] : [descripción]
  (Si no aplica, escribir: NINGUNA)

--------------------------------------------------------------------------------
HISTORIAL DE ACTUALIZACIONES
--------------------------------------------------------------------------------
[DD/MM/YYYY] - [Descripción del cambio realizado]
[DD/MM/YYYY] - [Descripción del cambio realizado]

================================================================================
```

---

## ESTRUCTURA DE CARPETAS

| Carpeta              | Propósito                                              |
|----------------------|--------------------------------------------------------|
| `/agents`            | Instrucciones y workflow para agentes de IA            |
| `/skills`            | Scripts reutilizables que los agentes pueden invocar   |
| `/security`          | Auditorías de seguridad por módulo                     |
| `/pruebas-unitarias` | Tests de Vitest por módulo                             |
| `/docs`              | Documentación en .txt de cada módulo                   |

---

## REGLA FINAL
**Si una tarea no requiere crear un módulo** (ej: solo editar estilos o corregir un bug menor),
las Fases 2, 3 y 4 se aplican igualmente si el cambio afecta la lógica de negocio o
la seguridad. En caso de duda, aplicar las 4 fases.
