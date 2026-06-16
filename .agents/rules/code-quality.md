# Code Quality Rule

## Description
Ensures that all code added to the repository meets the project's quality and architectural standards.

## Trigger
- Creation of new components or services.
- Modification of existing logic.

## Mandatory Behavior
- Use TypeScript with strict typing (avoid `any`).
- **4-Layer Architecture**: Edge → Server → Supabase → Client.
- **Folder Structure**:
  - `src/app`: Routes and views.
  - `src/lib`: Shared utilities.
  - `src/services`: Business logic and DB calls.
  - `src/components`: UI components.

## Restrictions
- Do not use inline styles (use CSS modules or global variables).
- Do not bypass linter warnings.
- No business logic in components; use services.
