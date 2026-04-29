# Seguridad del Proyecto

Este directorio contiene las auditorías de seguridad de cada módulo del sistema.

## Convención de Nombres
- Cada módulo tiene su archivo: `auditoria-<nombre-modulo>.md`
- El archivo se crea en la **Fase 3** del flujo de desarrollo (ver `/agents/workflow.md`).

## Checklist de Auditoría (referencia rápida)

| Categoría | Qué verificar |
|---|---|
| **Rutas** | ¿Todas las rutas de admin están protegidas en `middleware.ts`? |
| **Inputs** | ¿Se validan y sanitizan con Zod todos los datos del usuario? |
| **Secretos** | ¿Hay API keys o variables de entorno expuestas en el cliente? |
| **Autorización** | ¿Se verifica el rol del usuario antes de cada acción? |
| **Inyección** | ¿Las queries usan parámetros seguros (no interpolación de strings)? |
| **RLS** | ¿La tabla tiene RLS habilitado y policies correctas? |
| **CORS** | ¿Los Route Handlers limitan los orígenes permitidos? |
| **service_role_key** | ¿Solo se usa en archivos de servidor, nunca con `NEXT_PUBLIC_`? |

## Política General
- `SUPABASE_SERVICE_ROLE_KEY` **NUNCA** lleva prefijo `NEXT_PUBLIC_`
- Toda tabla nueva **DEBE** tener RLS habilitado
- Toda API route **DEBE** verificar autenticación antes de procesar
- Los buckets de Storage **DEBEN** ser privados con URLs firmadas
