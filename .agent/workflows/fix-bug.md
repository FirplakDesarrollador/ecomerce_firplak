---
description: Workflow to identify, document, and fix bugs while preventing regressions.
---

# Fix Bug Workflow

## When to use
Use this workflow when a bug is reported or discovered in the codebase.

## Steps
1. **Reproduce**: Confirm the bug exists and identify the root cause.
2. **Check History**: Run `.agent/skills/bugs-knowhow-enforcer/SKILL.md` to see if this is a known regression.
3. **Draft Fix**: Develop the solution in a minimal, focused manner.
4. **Document Bug**: Invoke `.agent/skills/bugs-knowhow/SKILL.md` to record the fix.
5. **Verify**: Test the fix in the current environment.
6. **Apply Bug Enforcer**: Run `.agent/skills/bugs-knowhow-enforcer/SKILL.md` again after implementation.

## Skills to Invoke
- `.agent/skills/bugs-knowhow/SKILL.md`
- `.agent/skills/bugs-knowhow-enforcer/SKILL.md`

## Final Validations
- Ensure the fix doesn't break related functionality.
- Verify that the bug log is updated correctly.
