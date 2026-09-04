# Bug Knowhow Enforcer Skill

## Description
This skill acts as a guardrail by reviewing the documented bug history to prevent regressions.

## Protocol
1. **Load History**: Read `.agent/skills/bugs-knowhow/history.md`.
2. **Context Check**: Compare the current task/code area with the recorded bugs.
3. **Enforce**: If a pattern matches a previous bug, flag it immediately.
4. **Validation**: Confirm that the proposed changes do not violate any "Future Prevention" guidelines from the history.

## Usage
Must be run before starting work and after completing any change.
