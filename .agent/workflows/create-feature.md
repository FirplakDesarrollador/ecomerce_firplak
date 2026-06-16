---
description: Workflow to create a new feature in the project following the mandatory 4-phase process.
---

# Create Feature Workflow

## When to use
Use this workflow whenever a new functionality or enhancement is requested.

## Steps
### Phase 1: Development
1. **Understand Requirements**: Review user request and project context.
2. **Research Patterns**: Check existing components and services.
3. **Implement**: Follow Next.js 15 standards and 4-layer architecture.
4. **Execute Skill**: Invoke `nextjs-review` and `supabase-review`.

### Phase 2: Unit Testing (Mandatory)
1. **Create Test**: Save in `/pruebas-unitarias/<module>.test.ts`.
2. **Run Test**: Execute `npm test`.

### Phase 3: Security Audit (Mandatory)
1. **Audit**: Check for SQL injection, key leakage, etc.
2. **Document**: Save findings in `/security/auditoria-<module>.md`.

### Phase 4: Documentation (Mandatory)
1. **Document**: Update `/docs/<module>.txt` using the standard template.

## Skills to Invoke
- `.agent/skills/nextjs-review/SKILL.md`
- `.agent/skills/supabase-review/SKILL.md`
- `.agent/skills/bugs-knowhow-enforcer/SKILL.md`

## Final Validations
- Pass all 4 phases.
- No regressions found by `bugs-knowhow-enforcer`.
