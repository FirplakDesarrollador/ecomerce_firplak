# Agentes — Índice de Documentación

Este directorio contiene toda la configuración que los agentes de IA necesitan
para trabajar correctamente en el proyecto.

## Archivos en este directorio

| Archivo | Propósito |
|---|---|
| `system-prompt.md` | **LEER PRIMERO** — Arquitectura, stack, reglas de código, patrones de Supabase, y todo lo que define cómo se construye este proyecto. |
| `workflow.md` | Flujo de 4 fases obligatorio (Desarrollo → Pruebas → Seguridad → Documentación) con la plantilla de `/docs/`. |

## Archivos relacionados en la raíz

| Archivo | Propósito |
|---|---|
| `AGENTS.md` | Resumen ejecutivo de las reglas — los agentes lo leen automáticamente. |
| `CLAUDE.md` | Alias para agentes Claude (referencia a `AGENTS.md`). |

## Orden de lectura obligatorio

1. `AGENTS.md` (raíz) — resumen de reglas y workflow de 4 fases
2. `agents/system-prompt.md` — arquitectura completa y reglas de código
3. `agents/workflow.md` — detalles del flujo de desarrollo
4. `/skills/` — habilidades reutilizables disponibles
