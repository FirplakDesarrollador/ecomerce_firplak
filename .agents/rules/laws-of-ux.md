# Laws of UX & Design System Enforcement Rule

## Description
Garantiza que cualquier cambio visual, componente UI, menú, pantalla, popover o flujo frontend cumpla de manera estricta e inviolable con las **Leyes de UX (Jon Yablonski / lawsofux.com)** y los tokens normados en [especificaciones/wiki/sistema_diseno.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK%20e-commerce/especificaciones/wiki/sistema_diseno.md).

## Trigger
- Modificación o creación de componentes visuales en `components/`.
- Creación o edición de vistas y rutas en `app/`.
- Ajustes de diseño, hojas de estilo CSS o interacciones de usuario.

## Mandatory Behavior
1. **Consulta Previa y Posterior del Skill**:
   - Antes y después de cualquier cambio de UI/UX, validar contra [skills/laws-of-ux/SKILL.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK%20e-commerce/skills/laws-of-ux/SKILL.md).
2. **Aplicar las 4 Dimensiones Obligatorias**:
   - **Cognición (Hick, Miller, Tesler)**: Máximo 5 a 6 opciones concurrentes; agrupar información técnica en chunks de 3 a 5 datos; no trasladar complejidad al usuario.
   - **Gestalt (Proximity, Common Region, Von Restorff)**: Agrupación semántica estricta; cards con delimitación clara; el CTA primario (`[Añadir al Carrito]`, `[WhatsApp]`) debe ser visualmente dominante y único en su categoría cromática.
   - **Ergonomía & Performance (Fitts, Doherty)**: Touch targets **$\ge 44 \times 44$ px** sin excepción; feedback de hover/tap en $< 150$ ms; respuesta de carga en $< 400$ ms con skeletons inmediatos.
   - **Emoción (Peak-End, Aesthetic-Usability)**: Acabados pulidos y consistentes; micro-interacciones elásticas físicas; confirmaciones claras.
3. **Uso Obligatorio de Tokens de [sistema_diseno.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK%20e-commerce/especificaciones/wiki/sistema_diseno.md)**:
   - Todo modal, dropdown, drawer o tarjeta flotante DEBE utilizar `.glass-panel` (claro) o `.glass-panel-dark` (`rgba(15, 23, 42, 0.94)` / `--color-primary-900`) con `backdrop-filter: blur(20px)` y borde `rgba(255, 255, 255, 0.14)`.

## Prohibiciones Estrictas (Bloqueantes de Aprobación)
- ❌ **Prohibido el uso de grises/fondos oscuros arbitrarios** (ej. `rgba(70, 70, 70, ...)`, `#333`, `#444`). Se deben usar exclusivamente los tokens del sistema.
- ❌ **Prohibidos touch-targets menores a 44px** en botones, enlaces o selectores interactivos (violación de la Ley de Fitts).
- ❌ **Prohibido texto con bajo contraste (violación WCAG 2.1 AA)**: Prohibido usar `text-white/40` o fuentes menores a 11px en textos explicativos o números de contacto.
- ❌ **Prohibida la sobrecarga y competencia cromática (violación de Von Restorff & Hick)**: No colocar 3 o más botones con estilos saturados distintos compitiendo en el mismo componente.
- ❌ **Prohibido omitir validación tolerante en formularios (violación de Postel's Law)**.
- ❌ **Prohibido dejar interacciones asíncronas sin indicador de carga inmediato (violación del Umbral de Doherty)**.
