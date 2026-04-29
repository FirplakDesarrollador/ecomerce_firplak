# Skills — Habilidades Reutilizables para Agentes

Este directorio contiene scripts y procedimientos que los agentes de IA deben usar
al realizar tareas comunes en el proyecto. Si existe una skill relevante para la tarea
que estás realizando, **debes usarla en lugar de improvisar**.

---

## Habilidades Disponibles

*(Se irán añadiendo conforme el proyecto avance)*

### Próximamente
- `crear-modulo.md` — Procedimiento para crear un módulo completo (4 fases)
- `crear-route-handler.md` — Template para Route Handlers con auth + Zod + service
- `crear-tabla-supabase.md` — Procedimiento para crear tablas con RLS y policies
- `auditar-seguridad.md` — Checklist completo de auditoría de seguridad

---

## Cómo añadir una Skill

1. Crear un archivo `.md` en esta carpeta con instrucciones paso a paso.
2. El nombre debe ser descriptivo en kebab-case (ej: `crear-route-handler.md`).
3. Incluir ejemplos de código cuando sea posible.
4. Referenciar la skill en `/agents/README.md`.
