# Laws of UX Enforcement Rule

## Description
Garantiza que cualquier cambio visual, componente UI, pantalla, flujo de compra o interacción frontend cumpla estrictamente con las Leyes de UX (Jon Yablonski / lawsofux.com).

## Trigger
- Modificación o creación de componentes visuales en `src/components`.
- Creación o edición de vistas y rutas en `src/app`.
- Ajustes de diseño, hojas de estilo CSS o interacciones de usuario.

## Mandatory Behavior
1. **Consultar el Skill**: Antes y después de cambios de UI/UX, validar contra [.agent/skills/laws-of-ux/SKILL.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK%20e-commerce/.agent/skills/laws-of-ux/SKILL.md).
2. **Aplicar las 4 Dimensiones**:
   - **Cognición**: Evitar sobrecarga de opciones (Hick's Law), simplificar formularios (Chunking / Miller's Law).
   - **Gestalt**: Agrupación clara por proximidad y contenedor (Common Region), destacar el CTA principal (Von Restorff).
   - **Ergonomía & Performance**: Touch targets $\ge 44$px (Fitts's Law), retroalimentación visual en $< 400$ms (Doherty Threshold).
   - **Emoción**: Progresión visible (Goal-Gradient / Zeigarnik) y cierre satisfactorio (Peak-End Rule).

## Restrictions
- Prohibido agregar formularios sin validación tolerante (Postel's Law).
- Prohibido crear pantallas saturadas de acciones secundarias compitiendo con el CTA principal.
- Prohibido dejar interacciones asíncronas sin indicador de carga o skeleton inmediato.
