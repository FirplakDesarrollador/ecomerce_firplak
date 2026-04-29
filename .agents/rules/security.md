# Security Rule

## Description
Protects the application against common vulnerabilities and unauthorized data access.

## Trigger
- Any code involving Supabase interactions.
- Route handlers and server actions.
- Authentication flows.

## Mandatory Behavior
- **RLS Mandatory**: Must be active on every table.
- **Service Role**: `service_role_key` must only be used in server-side contexts.
- **Input Validation**: Validate all incoming user data using Zod or equivalent.
- **Audits**: Every change must have an entry in `/security/auditoria-<module>.md`.

## Restrictions
- Never expose environment variables in the client-side bundle.
- Do not disable CSRF or other built-in security protections.
- No direct database access from the client; use Route Handlers or Server Actions.
