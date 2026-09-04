---
description: Audita esquemas, políticas RLS, consultas y llamadas a Supabase.
---

# Supabase Review Workflow

## Cuándo usar
Usa este comando al modificar tablas, esquemas, migraciones o consultas de Supabase.

## Pasos
1. **Cargar la Skill**: Leer `.agent/skills/supabase-review/SKILL.md`.
2. **Verificar RLS**: Asegurar que todas las tablas tengan Row Level Security activo.
3. **Auditar Tipos**: Comprobar tipos autogenerados de TypeScript.
4. **Optimizar Consultas**: Evitar consultas N+1 y sobrecarga innecesaria de datos.
