---
description: Workflow to audit code for security vulnerabilities and ensure compliance.
---

# Security Review Workflow

## When to use
Mandatory for any changes involving authentication, data access, or API endpoints.

## Steps
1. **Identify Sensitive Areas**: Pinpoint database queries, JWT handling, and input processing.
2. **Check Rules**: Review `.agents/rules/security.md`.
3. **Audit**: Look for SQL injection, unauthorized access, and key leakage.
4. **Invoke Skill**: Run `supabase-review` for RLS validation.
5. **Document**: Record findings in the security audit files.

## Skills to Invoke
- `.agent/skills/supabase-review/SKILL.md`
- `.agent/skills/code-review/SKILL.md`

## Final Validations
- No secrets exposed.
- RLS enabled on all new tables.
- All inputs validated.
