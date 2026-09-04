# Especificaciones de Módulo: Servicios Técnicos, Instalación y Postventa

> [!IMPORTANT]
> **Estrategia Condensada del Segmento**:
> Transformar el servicio técnico en un canal de monetización postventa y blindaje de la garantía de 5 años. Se integra la venta de visitas de pre-inspección e instalación oficial como SKUs adicionales en la PDP de hidromasajes y cocinas, apalancándose en una arquitectura federada con Supabase OAuth para agendamiento en línea y consulta del estado del pedido en planta.

Este documento define la especificación técnica, funcional, operativa y de integración para el portafolio de **Servicios Técnicos Oficiales Firplak** (instalación, pre-inspección, mantenimiento y garantías) en la plataforma e-commerce.

---

## 1. Portafolio de Servicios Técnicos Oficiales

Los servicios complementan la compra de productos de alto valor y aseguran la vigencia de las garantías de fábrica:

| Servicio | Tipo | Descripción | Aplicación Principal |
| :--- | :--- | :--- | :--- |
| **Visita Técnica de Pre-Inspección** | Preventivo / Asesoría | Verificación en el domicilio del cliente de acometidas eléctricas (110V/220V, breakers GFCI), hidráulicas, desagües y accesos (puertas, escaleras) antes del despacho. | Jacuzzis, Spas de gran formato y Cocinas integrales. |
| **Instalación Certificada Firplak** | Montaje Profesional | Conexión, nivelación, fijación, pruebas hidrostáticas y puesta en marcha realizada por técnicos autorizados con tarjeta profesional. | Activa la cobertura extendida de garantía de 5 años. |
| **Mantenimiento Preventivo y Sanitización** | Postventa Periódica | Purga y desinfección de tuberías internas de hidromasaje, revisión de motobombas, sellado de juntas de mesones y calibración de herrajes. | Spas, tinas de hidromasaje y cocinas. |
| **Mantenimiento Correctivo y Repuestos** | Reparación Oficial | Diagnóstico y reemplazo de motobombas, blowers, sensores de nivel, pulsadores neumáticos, griferías o faldones averiados. | Equipos fuera de garantía o reparaciones de siniestros. |

---

## 2. Arquitectura de Integración (Supabase Federado & OAuth)

En concordancia con el [Requerimiento de Cliente 02](file:///c:/Users/isaza/OneDrive/Documentos/FIRPLAK e-commerce/especificaciones/wiki/integracion_servicios_pedidos.md), la gestión de servicios no reside en una base aislada:

```
[ Frontend E-commerce Next.js ]
              │
    (OAuth / JWT Bearer)
              ▼
  [ Supabase Auth Central ] ──── Identidad Unificada de Cliente
              │
    ┌─────────┴────────────────────────┐
    ▼                                  ▼
[ Supabase DB E-commerce ]   [ Supabase DB Servicios Técnicos ]
- Órdenes & Checkout         - Calendarios de Técnicos
- Carrito de Servicios       - Reportes de Visita y Actas
                             - Estados de Fabricación en Planta
```

1. **Autenticación Unificada (Single Sign-On)**:
   - El cliente que adquiere un producto en el e-commerce utiliza las mismas credenciales OAuth para consultar sus citas técnicas y el estado de su orden en planta.
2. **Sincronización con el ERP SAP**:
   - Una vez agendado y ejecutado el servicio, el sistema reporta a SAP el consumo de repuestos y la liquidación del técnico de servicio.

---

## 3. Experiencia de Usuario (UX/UI) y Checkout

### A. Venta de Servicios como SKU en la PDP (Cross-Selling)
- En la PDP de Spas, Hidromasajes o Cocinas, se muestra un checkbox interactivo:
  - 🛠️ *"Añadir Instalación Oficial Certificada Firplak (+ $XXX.000)"*.
  - Al marcarse, se suma dinámicamente al total del pedido como una línea de servicio con su propio SKU.

### B. Portal de Agendamiento Online (`/servicios`)
- Módulo para clientes que desean solicitar servicio postventa con su número de cédula o factura:
  1. Selección del tipo de servicio (Instalación, Garantía, Mantenimiento).
  2. Selección de fecha y franja horaria preferida (sujeta a disponibilidad del técnico de la zona).
  3. Formulario de estado del espacio: Carga de fotos de las acometidas existentes para validación remota previa.

### C. Trazabilidad de Pedidos en Planta
- Pantalla accesible desde la cuenta del cliente (`/mi-cuenta/pedidos-en-planta`) donde se grafica una barra de progreso de producción antes de la coordinación de entrega o instalación.

---

## 4. Políticas Operativas y Cobertura

- **Cobertura Geográfica Oficial**:
  - Área Metropolitana del Valle de Aburrá (Medellín, Envigado, Itagüí, Sabaneta, Bello, Rionegro).
  - Bogotá D.C. y municipios de la Sabana (Chía, Cajicá, Cota, Soacha).
  - Cali y Jamundí.
  - Eje Cafetero y Barranquilla (cobertura programada).
- **Condiciones Previas Obligatorias para el Cliente**:
  - El cliente debe tener las acometidas civiles, eléctricas e hidráulicas en el punto exacto indicado en la ficha técnica antes de la llegada del técnico. Si el espacio no está listo, se cobrará costo de reprogramación de visita.
