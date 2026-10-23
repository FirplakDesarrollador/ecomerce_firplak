# Firplak Ecommerce - Agent Configuration

This project follows the **Google Antigravity** structure for AI agents.

## Structure
- **Workflows**: Located in `.agent/workflows/`. Defines standard procedures for common tasks.
- **Rules**: Located in `.agents/rules/`. Enforces architectural and security constraints.
- **Skills**: Located in `skills/`. Specialized knowledge blocks for the agent.

## Mandatory Rules
1. **Always run the Bug Enforcer**: After any code change, the agent must execute `skills/bugs-knowhow-enforcer/SKILL.md`.
2. **Follow the 4-Phase Workflow**: Development -> Testing -> Security Audit -> Documentation.
3. **Architecture**: Adhere to the 4-layer Edge-Server-Supabase-Client architecture.
4. **Enforce Laws of UX**: Every UI/UX and frontend change must comply with `skills/laws-of-ux/SKILL.md` and `.agents/rules/laws-of-ux.md`.
5. **Preserve UI Structure & Unified Navigation**: Enforce `.agents/rules/ui-structure-integrity.md`. Asset changes must never modify UI structure, menus, or information cards. Explicit UI/content changes require prior user confirmation and impact warning.

Refer to the individual files in the hidden directories for detailed instructions.
