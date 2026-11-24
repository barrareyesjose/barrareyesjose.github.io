---
titulo: Diagnóstico de eficiencia Order-to-Delivery
resumen: Diagnóstico de la eficiencia de un centro de distribución, de la recepción a la facturación, hecho solo con SQL sobre datos logísticos reales y anonimizados.
orden: 2
etiquetas: [SQL, PostgreSQL, DBeaver, Logística]
metricas:
  - valor: "6"
    etiqueta: tablas del flujo O2D
  - valor: "5"
    etiqueta: pilares de KPI
  - valor: "100%"
    etiqueta: SQL
# repositorio: https://github.com/barrareyesjose/NOMBRE-DEL-REPO   ← descomenta cuando subas el código
---

## Contexto

En mi práctica en una distribuidora trabajé con consultas operacionales sobre el centro de
distribución. Después, con exportaciones autorizadas de los datos, reconstruí y profundicé
ese trabajo como un análisis histórico completo.

El desafío autoimpuesto: **hacerlo todo en SQL**, sin Power BI ni Python, para mostrar que el
análisis se puede resolver donde viven los datos.

## Los datos

Seis tablas cargadas en PostgreSQL (administradas con DBeaver) que cubren todo el flujo
**Order-to-Delivery**: desde que llega la mercadería hasta que se despacha y factura.
Los datos son reales y están anonimizados.

## Marco de KPIs

Organicé el diagnóstico en cinco pilares:

| Pilar | Qué responde |
|---|---|
| Recepción | ¿Qué tan bien se recibe lo que llega? |
| Salud de inventario | ¿El stock está sano, disponible y dentro de su vida útil? |
| Despacho | ¿Se cumple lo prometido al cliente (OTIF, fill rate)? |
| Facturación | ¿Lo despachado se factura correctamente? |
| Tiempo de ciclo O2D | ¿Cuánto tarda el flujo completo? |

Conceptos del dominio que trabajé: **OTIF**, **fill rate**, **backorder**, **shelflife**,
órdenes de compra (OC), avisos de despacho (ASN), unidades logísticas (LPN) y documentos
tributarios electrónicos (DTE).

## Calidad de datos

Antes de medir hubo que limpiar:

- Columnas con tipos de datos mezclados.
- Números enteros guardados como texto.
- Consultas reescritas con **CTEs** para reutilizar cálculos intermedios de forma legible.
- Problemas de compatibilidad del driver de Python en Windows al cargar los datos.

<!-- PENDIENTE: agrega aquí los principales hallazgos (por ejemplo, el OTIF o el fill rate
     obtenidos, y dónde está el cuello de botella del flujo) y 1 o 2 consultas de ejemplo
     en bloques de código ```sql. -->

**Herramientas:** PostgreSQL · DBeaver · SQL (CTEs, funciones de ventana, agregaciones)
