# No Regressions Rule

## Description
Prevents the re-introduction of previously fixed bugs.

## Trigger
- Before starting any code modification or bug fix.

## Mandatory Behavior
- The agent must check the `.agent/skills/bugs-knowhow/SKILL.md` logs.
- Identify if the current area has had similar issues in the past.

## Restrictions
- Cannot proceed with a "fix" that mimics a previously recorded failed attempt.
