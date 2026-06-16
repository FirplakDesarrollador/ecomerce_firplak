# Firplak Ecommerce - Agent Configuration

This project follows the **Google Antigravity** structure for AI agents.

## Structure
- **Workflows**: Located in `.agent/workflows/`. Defines standard procedures for common tasks.
- **Rules**: Located in `.agents/rules/`. Enforces architectural and security constraints.
- **Skills**: Located in `.agent/skills/`. Specialized knowledge blocks for the agent.

## Mandatory Rules
1. **Always run the Bug Enforcer**: After any code change, the agent must execute `.agent/skills/bugs-knowhow-enforcer/SKILL.md`.
2. **Follow the 4-Phase Workflow**: Development -> Testing -> Security Audit -> Documentation.
3. **Architecture**: Adhere to the 4-layer Edge-Server-Supabase-Client architecture.

Refer to the individual files in the hidden directories for detailed instructions.
