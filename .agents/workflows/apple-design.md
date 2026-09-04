---
description: Aplica los principios de diseño de Apple (resortes físicos, tracking 1:1, interrupción y animaciones fluidas).
---

# Apple Design Workflow

## Cuándo usar
Usa este comando al diseñar o refinar componentes UI, animaciones de gestos, transiciones o microinteracciones fluidas al estilo Apple.

## Pasos
1. **Cargar la Skill**: Leer `.agent/skills/apple-design/SKILL.md`.
2. **Auditar el componente**: Verificar latencia (pointerdown), tracking directo 1:1 y respuesta táctil.
3. **Configurar Springs**: Implementar resortes con amortiguación crítica (`bounce: 0` o damping `1.0` por defecto; `0.8` en flicks/impulsos).
4. **Verificar Interrumpibilidad**: Asegurar que las animaciones partan de la posición actual y no bloqueen la entrada del usuario.
