# Especificaciones de Producto: Accesorios, Grifería y Plomería

> [!IMPORTANT]
> **Estrategia Condensada del Segmento**:
> Incrementar el ticket promedio y la rentabilidad del e-commerce mediante una separación taxativa entre **Grifería/Plomería Técnica** (piezas de instalación obligatoria) y **Accesorios de Confort**. El motor de compatibilidad en frontend asigna automáticamente grifería caña alta a lavamanos vessel y desagües sin rebose a piezas de mármol macizo, ofreciendo descuentos automáticos de bundle (-10%) para cerrar la venta integral.

Este documento define la taxonomía, especificaciones técnicas, materiales y reglas de compatibilidad para la categoría de **Accesorios**, estableciendo una **separación estricta y obligatoria** entre **Grifería y Plomería Técnica** (cuyo anexo normativo detallado se encuentra en [griferia_plomeria.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/griferia_plomeria.md)) y **Accesorios de Confort / Decoración**.

---

## 1. Separación Estructural de la Categoría

Para evitar confusión en el catálogo y permitir filtros técnicos precisos en el e-commerce, los productos se dividen en dos grandes familias:

```
                      CATEGORÍA ACCESORIOS
                                │
        ┌───────────────────────┴───────────────────────┐
        ▼                                               ▼
[ FAMILIA 1: GRIFERÍA Y PLOMERÍA ]       [ FAMILIA 2: ACCESORIOS DE CONFORT ]
- Griferías de Baño (Vessel / Vanity)    - Sets de Accesorios de Baño
- Griferías de Cocina (Monocontrol)      - Accesorios de Tinas e Hidros
- Llaves y Grifos de Lavadero            - Kits de Mantenimiento de Agua
- Plomería Técnica (Desagües, Sifones)   - Cuidado de Mármol y Superficies
```

---

## 2. Familia 1: Grifería y Plomería Técnica

### A. Clasificación de Griferías
1. **Griferías para Lavamanos de Baño**:
   - **Monocontrol Caña Alta**: Diseñadas exclusivamente para lavamanos de sobreponer tipo *Vessel* (altura superior a 28 cm).
   - **Monocontrol Caña Baja**: Para lavamanos de incrustar o tipo *Vanity* con perforación sobre la cubierta (altura entre 14 cm y 18 cm).
   - **Mezcladores 8 Pulgadas / Doble Mando**: Para lavamanos clásicos de tres perforaciones.
   - **Griferías de Pared**: Para empotrar en mampostería, requeridas en mesones sin perforación.
2. **Griferías para Cocina**:
   - **Monocontrol Cuello Flexible / Extensible (Pull-Down)**: Cabezal móvil con botón para cambio de chorro (aireado vs concentrado).
   - **Monocontrol Cuello de Ganso Fijo**: Diseño arquitectónico curvo de alto despeje para lavado de ollas grandes.
3. **Llaves y Grifería de Lavadero / Ropas**:
   - Grifos metálicos de pared con boquilla roscada para conexión de manguera de jardín o lavadora.

### B. Plomería Técnica Sanitaria
1. **Desagües (Desagüe Tipo Push / Click-Clack)**:
   - **Desagüe Push CON Rebose**: Para lavamanos que cuentan con orificio de rebose integrado.
   - **Desagüe Push SIN Rebose**: Obligatorio para lavamanos de mármol sintético o vessel macizos sin rebose (evita fugas en la rosca inferior).
2. **Sifones y Trampas**:
   - **Sifones Rígidos Metálicos (Tipo Botella / P-Trap)**: Acabado cromo brillante o negro mate para instalaciones con sifón a la vista (muebles abiertos).
   - **Sifones Corrugados Flexibles en Polipropileno**: De 1.25" a 2" con trampa de olores orientable para espacios reducidos bajo muebles cerrados.
3. **Acoples Flexibles y Válvulas de Regulación**:
   - Mangueras trenzadas en acero inoxidable 304 con terminales en latón de 1/2" a 3/8".
   - Válvulas angulares de paso con cierre 1/4 de vuelta.

### C. Especificaciones Técnicas y Rendimiento
- **Cartucho**: Cartucho cerámico de 35 mm o 40 mm probado para **500.000 ciclos de apertura y cierre** sin goteo.
- **Material del Cuerpo**: Latón macizo (aleación de cobre y zinc libre de plomo) o acero inoxidable AISI 304.
- **Rango de Presión**: Óptimo entre **20 y 80 PSI**.
- **Ahorro de Agua**: Aireador anticalcáreo con restricción ecológica de flujo a máximo **6.0 a 8.3 L/min** (certificación ambiental colombiana).

---

## 3. Familia 2: Accesorios de Confort, Decoración y Cuidado

### A. Accesorios de Baño
- **Sets de Incrustar y Pegar**: Toalleros de barra (60 cm), toalleros de argolla, perchas dobles, portarrollos con tapa o abierto, y repisas de vidrio templado.
- **Materiales**: Latón o acero inoxidable con acabados en cromo electroplateado, negro mate (electrostatic coating) y níquel cepillado.

### B. Accesorios para Hidromasajes y Spas
- **Almohadillas Cervicales**: Poliuretano impermeable de alta resiliencia con ventosas traseras o imanes de fijación.
- **Agarraderas de Seguridad**: Barras de apoyo en acero inoxidable pulido para entrada/salida segura de la tina.
- **Cubiertas Térmicas de Spa**: Fundas aislantes en vinilo marino reforzado para retención de temperatura exterior y protección contra hojas/polvo.

### C. Consumibles y Cuidado de Superficies
- **Kits Químicos para Agua de Spa**: Tabletas de bromo/oxígeno activo, clarificadores y neutralizadores de pH no abrasivos.
- **Cera y Sellador Firplak**: Pasta desmanchadora y pulidora formulada específicamente para restaurar el brillo del gelcoat de mármol sintético y superficies de Quartzstone.

---

## 4. Reglas de Validación y Compatibilidad en el E-commerce (PDP)

Para evitar que el cliente compre una grifería o plomería incompatible con su lavamanos o lavaplatos:

1. **Regla Vessel vs Caña Alta**:
   - Si `product.category == "lavamanos-vessel"`, el recomendador de accesorios en la PDP debe filtrar automáticamente solo griferías de **Caña Alta** o **Pared**.
2. **Regla Rebose en Desagüe**:
   - Si `product.has_overflow == false`, el selector de compra bundle debe asignar por defecto el `Desagüe Push SIN Rebose`.
3. **Descuentos por Bundle (Mix & Match Complementario)**:
   - Al seleccionar un combo de lavamanos + grifería + sifón en el configurador [mix_and_match.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/mix_and_match.md) o en la [pagina_producto.md](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/pagina_producto.md), aplicar un **10% de descuento automático** en los accesorios seleccionados.
