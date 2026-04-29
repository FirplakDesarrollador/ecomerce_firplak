<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

<!-- BEGIN:project-workflow-rules -->
# REGLAS OBLIGATORIAS DEL PROYECTO — LEER SIEMPRE ANTES DE ACTUAR

Estas reglas se aplican al **100%** en cada intervención. No son opcionales.
Para instrucciones completas y detalladas, consultar `/agents/workflow.md`.

## ARQUITECTURA COMPLETA → `/agents/system-prompt.md`

Antes de escribir código que toque base de datos, APIs, Supabase o autenticación,
**DEBES leer** `/agents/system-prompt.md`. Contiene:
- Stack del proyecto (Next.js 15 + Supabase + Vercel)
- Arquitectura de 4 capas (Edge → Servidor → Supabase → Cliente)
- Estructura de carpetas obligatoria (`src/app`, `src/lib`, `src/services`, `src/components`)
- Reglas de Supabase (RLS obligatorio, service_role_key solo en servidor, MCP primero)
- Patrones de código (Route Handlers, Server Components, Middleware)
- Variables de entorno correctas
- Lo que NUNCA debes hacer

## FLUJO OBLIGATORIO AL CREAR O MODIFICAR UN MÓDULO

Todo módulo nuevo o modificado DEBE completar las siguientes fases **en orden**:

### FASE 1 — Desarrollo del Módulo
- Usar las `skills` de `/skills/` cuando existan para la tarea.
- Seguir la arquitectura Next.js del proyecto y las convenciones TypeScript.
- Al terminar el módulo, pasar INMEDIATAMENTE a la Fase 2.

### FASE 2 — Pruebas Unitarias (OBLIGATORIO)
- Crear un archivo de prueba en `/pruebas-unitarias/<nombre-modulo>.test.ts`.
- Las pruebas deben cubrir el flujo principal y los casos de error del módulo.
- Las pruebas deben pasar (`npm test`) antes de continuar a la Fase 3.

### FASE 3 — Auditoría de Seguridad (OBLIGATORIO)
- Revisar el módulo buscando: inyección de datos, rutas no protegidas, exposición
  de claves, validación de inputs faltante, y acceso no autorizado.
- Registrar hallazgos y correcciones en `/security/auditoria-<nombre-modulo>.md`.
- Si no hay vulnerabilidades, igualmente crear el archivo indicando "Sin hallazgos".

### FASE 4 — Documentación (OBLIGATORIO)
- Crear o actualizar `/docs/<nombre-modulo>.txt` con la plantilla estándar.
- Ver la plantilla exacta en `/agents/workflow.md`.

**NINGÚN MÓDULO SE CONSIDERA COMPLETO SIN HABER PASADO LAS 4 FASES.**
<!-- END:project-workflow-rules -->
