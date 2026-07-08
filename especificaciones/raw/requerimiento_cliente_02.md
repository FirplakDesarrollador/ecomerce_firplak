# Requerimiento de Cliente 02: Agendamiento de Servicios, Estado de Pedidos en Planta y OAuth de Supabase

**Fecha:** 2026-07-08  
**Origen:** Audio enviado por el cliente  

## Descripción del Requerimiento

1. **Agendamiento de Servicios:**
   - Permitir al usuario agendar servicios técnicos o de instalación directamente desde la aplicación de e-commerce.
   - Este sistema ya existe en otro proyecto de Supabase en la empresa, el cual contiene toda la lógica y arquitectura correspondiente.
   - La base de datos del e-commerce actual actuará como respaldo/enlace para conectar con esta base de datos preexistente de servicios.

2. **Consulta del Estado del Pedido (Trazabilidad en Planta):**
   - Permitir a los clientes consultar el estado de fabricación/procesamiento de sus pedidos en tiempo real dentro de la planta de producción.
   - Estos datos provienen de otra base de datos de Supabase perteneciente a una aplicación interna de producción de la empresa.

3. **Seguridad y Autenticación (OAuth de Supabase):**
   - Las consultas a estas bases de datos de Supabase federadas se deben realizar mediante un flujo de autenticación OAuth de cliente final.
   - La identidad del cliente se centralizará a través de Supabase, permitiendo que el cliente autenticado en el e-commerce acceda de forma segura a sus servicios y al estado de producción de sus pedidos.
