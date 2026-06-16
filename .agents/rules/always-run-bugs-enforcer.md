# Always Run Bugs Enforcer Rule

## Description
Mandatory check to ensure no new regressions were introduced after code changes.

## Trigger
- **ALWAYS** after any code change (creation, modification, or deletion).

## Mandatory Behavior
- The agent MUST execute the skill: `.agent/skills/bugs-knowhow-enforcer/SKILL.md`.
- Verify that the new code does not violate any "lesson learned" from the bug history.

## Restrictions
- Task is not considered "Done" until this rule is satisfied.
