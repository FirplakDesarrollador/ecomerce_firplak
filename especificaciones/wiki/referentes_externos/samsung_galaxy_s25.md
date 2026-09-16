# Referente GUI: Samsung Galaxy S25 Ultra

> [!IMPORTANT]
> **Estrategia Condensada del Segmento**:
> Implementación del Wizard de compra transaccional por pasos, cálculo dinámico de financiamiento en cuotas (ADDI, ePayco), módulos de venta cruzada (kit de grifería, instalación oficial) y barra fija de resumen de carrito en la PDP de Firplak.

---

## 🔗 Datos de la Fuente
- **Marca / Referente**: Samsung Electronics
- **URL**: `https://www.samsung.com/us/smartphones/galaxy-s25-ultra/buy/galaxy-s25-ultra-256gb-verizon-sku-sm-s938uzbavzw/`
- **Categoría GUI**: High-Conversion E-commerce Purchase Wizard, Trade-in & Dynamic Financing UI.

---

## 🎨 Principios Visuales y UI Destacados

1. **Step-by-Step Purchase Wizard (Configurador Guiado de Compra)**:
   - Pasos secuenciales integrados dentro de la misma pantalla PDP:
     - Paso 1: Selección de Variante / Dimensión.
     - Paso 2: Selección de Acabado / Color.
     - Paso 3: Adición de Garantía Extendida o Servicio Técnico.
     - Paso 4: Selección de Accesorios Compatibles (Cross-selling).
2. **Desglose de Financiamiento Dinámico**:
   - Muestra instantánea del valor total de contado vs pago a cuotas mensuales en tiempo real (ej. *Desde $120.000/mes con ADDI*).
3. **Barra Fija Inferior / Lateral de Resumen (Sticky Drawer)**:
   - Resumen en vivo de la configuración seleccionada con desglose de descuentos, precio final y CTA claro "Comprar Ahora" / "Agregar al Carrito".
4. **Trust Badges & Garantía Visible**:
   - Sellos de confianza integrados (Envío asegurado, Garantía de fábrica Firplak, Instalación oficial).

---

## 🛠️ Aplicación en el Sitio Web de Firplak

| Componente Samsung | Módulo Firplak | Aplicación Concreta en Firplak |
| :--- | :--- | :--- |
| Purchase Wizard por Pasos | `pagina_producto.md` | Flujo comercial en PDP: 1) Seleccionar tamaño de lavamanos/mueble, 2) Elegir acabado de madera y color de superficie, 3) Añadir kit de grifería compatible, 4) Añadir Servicio de Instalación Certificada Firplak. |
| Calculadora de Financiamiento | `pagos_e_integraciones.md` | Módulo de simulación de crédito transparente (ADDI, ePayco, PSE) en la PDP y Carrito. |
| Cross-selling de Accesorios Obligatorios/Recomendados | `accesorios.md` & `griferia_plomeria.md` | Checkbox interactivo en la PDP para agregar el desagüe/sifón y la grifería adecuada antes de finalizar la compra. |

---

## 📐 Especificación Técnica para Desarrollo

- **Componente Wizard**: `<ProductPurchaseWizard />` sincronizado con Supabase RLS y pasarelas de pago (`pagos_e_integraciones.md`).
- **Resumen Sticky**: Sticky bottom bar responsive que se adapta a pantallas móviles con botón CTA prioritario.
