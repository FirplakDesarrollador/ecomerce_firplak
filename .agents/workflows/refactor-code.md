---
description: Workflow to improve code structure, readability, or performance without changing behavior.
---

# Refactor Code Workflow

## When to use
Use this workflow when technical debt is identified or when preparing code for new features.

## Steps
1. **Analyze**: Identify the code block to refactor and its dependencies.
2. **Check Constraints**: Review existing rules and bugs history.
3. **Refactor**: Apply changes following clean code principles.
4. **Execute Skill**: Invoke `code-review` to validate changes.
5. **Apply Bug Enforcer**: Run `.agent/skills/bugs-knowhow-enforcer/SKILL.md`.

## Skills to Invoke
- `.agent/skills/code-review/SKILL.md`
- `.agent/skills/bugs-knowhow-enforcer/SKILL.md`

## Final Validations
- Behavior must remain identical to the original state.
- Code quality metrics should improve.
