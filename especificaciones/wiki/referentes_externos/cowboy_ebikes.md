# Referente GUI: Cowboy E-Bikes

> [!IMPORTANT]
> **Estrategia Condensada del Segmento**:
> Implementación de la interacción de personalización de producto 360° en tiempo real, micro-animaciones kinetic UI y conmutación fluida de colores, acabados y accesorios para el módulo interactivo **Mix & Match** de Firplak.

---

## 🔗 Datos de la Fuente
- **Marca / Referente**: Cowboy SA
- **URL**: `https://cowboy.com/`
- **Categoría GUI**: Real-Time Product Customizer, Kinetic UI Motion & Interactive Specs.

---

## 🎨 Principios Visuales y UI Destacados

1. **Configurador Dinámico de Producto 360°**:
   - Cambio instantáneo del acabado gráfico del producto en respuesta a la selección del usuario (ej. color del marco, tipo de sillín, luces).
   - Renderizado ultrarrápido sin recarga de página ni parpadeos de imagen.
2. **Kinetic Micro-Interactions (Motion Physics)**:
   - Animaciones suaves con física de resorte (*spring animations*) al activar o desactivar opciones.
   - Indicadores dinámicos que actualizan el precio total y las especificaciones en tiempo real con transiciones numéricas rotativas (*count-up / count-down*).
3. **Selector Flotante de Variantes**:
   - Panel modal/drawer limpio con pill selectors (selectores en forma de píldora) para colores y opciones complementarias.
4. **Narrativa de Atributos Clave**:
   - Tarjetas flotantes que destacan características tecnológicas al hacer hover sobre partes específicas del producto.

---

## 🛠️ Aplicación en el Sitio Web de Firplak

| Componente Cowboy | Módulo Firplak | Aplicación Concreta en Firplak |
| :--- | :--- | :--- |
| Dynamic 360° Product Configurator | `mix_and_match.md` | Visualizador interactivo de Baño: selección en tiempo real del acabado del mueble de madera RH (Duna, Roble, Blanco), tipo de lavamanos y modelo de grifería. |
| Kinetic Numbers & Animated Price | `pagina_producto.md` / `mix_and_match.md` | Actualización animada del precio acumulado según los componentes agregados al combo (ej. añadir espejo LED o grifería monocontrol). |
| Dynamic Color Swatches | `sistema_diseno.md` & `pagina_producto.md` | Selectores de color interactivos para lavamanos y muebles con retroalimentación hápctica/visual inmediata. |

---

## 📐 Especificación Técnica para Desarrollo

- **Lógica de Estado**: Gestor de estado cliente (Zustand / React Context) cargando configuraciones de `PRODUCT_VARIATION` indexadas en JSONB desde Supabase.
- **Librería de Animación**: Framer Motion / CSS Transitions con físicas `spring` (`stiffness: 300, damping: 30`).
