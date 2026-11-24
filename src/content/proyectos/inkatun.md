---
titulo: Inkatún — BI para una mesa de ayuda universitaria
resumen: Reconstrucción profesional de un pipeline de business intelligence para una mesa de ayuda universitaria con ~70.000 tickets, más un análisis extendido con estadística y machine learning.
orden: 1
estado: En desarrollo
etiquetas: [SQL, MariaDB, Python, Power BI, Machine Learning]
metricas:
  - valor: "~70K"
    etiqueta: tickets reales (2019–2026)
  - valor: "0,733"
    etiqueta: AUC del modelo predictivo
  - valor: "3"
    etiqueta: esquemas de base de datos
# repositorio: https://github.com/barrareyesjose/NOMBRE-DEL-REPO   ← descomenta cuando subas el código
---

## Contexto

Durante mi práctica construí dashboards en Power BI para la mesa de ayuda de una universidad,
basada en osTicket. El sistema atiende a toda la institución y acumula **~70.000 tickets reales
entre 2019 y 2026**.

La versión original funcionaba, pero toda la lógica vivía en Power Query: difícil de mantener,
de auditar y de automatizar. Este proyecto la reconstruye como lo haría un equipo de datos
profesional.

> Para proteger la información de la institución, la versión pública usa **15.000 tickets
> sintéticos** generados con Python (Faker), con distribuciones de estado realistas según la
> antigüedad del ticket. No inventé cifras para que el resultado se vea mejor: si un indicador
> sale bajo en la realidad, se mantiene bajo.

## El problema

- La lógica de negocio estaba repartida en pasos de Power Query, sin versionar.
- El cumplimiento de SLA no se medía.
- Dos indicadores de calidad (ISO 9001) dependían de encuestas en otra fuente (Google Sheets).
- Los cortes semestrales se calculaban a mano.

## Arquitectura

El principio central: **la lógica de negocio va en SQL, la orquestación en Python y la
presentación en Power BI**.

| Capa | Qué contiene |
|---|---|
| Origen (solo lectura) | Tablas de tickets del sistema de mesa de ayuda |
| Personal | Datos del personal de soporte (un solo modelo, validado contra las fuentes) |
| Analítica | Vistas, procedimientos almacenados y tablas de automatización |

- **Base de datos:** MariaDB con tres esquemas separados.
- **SLA:** script en Python que calcula el cumplimiento en **horas hábiles** (sin fines de
  semana ni feriados) y guarda el resultado en la misma base para Power BI.
- **Snapshots semestrales:** el procedimiento `sp_snapshot_indicadores` congela los indicadores
  al cierre de cada semestre, programado con el Programador de tareas.
- **Reportes:** PDF con semáforo de indicadores (fpdf2) y simulación del envío por correo (`.eml`).
- **Power BI:** una página de *Indicadores* con la evolución semestre a semestre y un
  *Dashboard* del semestre en curso con el avance mensual.

## Análisis extendido

Sobre los datos construí cuatro notebooks de Python:

1. **EDA:** exploración de volumen, estados, tiempos de resolución y temas.
2. **Tests estadísticos:** Mann-Whitney U y correlación de Spearman.
3. **NLP y clustering** sobre el texto libre de las encuestas de satisfacción.
4. **Modelo predictivo:** Random Forest + Gradient Boosting, con un **AUC final de 0,733
   (+9,3 puntos sobre el baseline)** y explicabilidad completa con SHAP.

<!-- PENDIENTE: agrega aquí 2 o 3 hallazgos concretos del análisis
     (por ejemplo, qué variables pesaron más en el modelo según SHAP)
     y, cuando los tengas, capturas del dashboard de Power BI. -->

## Lo que aprendí

- **Validar con datos reales antes de diseñar.** El volumen de tickets, el catálogo de estados
  (7 en la realidad), el mapeo de temas de las encuestas y los tipos de SLA eran distintos a
  los supuestos iniciales.
- **Los errores silenciosos son peligrosos.** Reemplacé un proceso que "terminaba bien" sin
  datos por validaciones explícitas con mensajes de error claros.
- **Simple donde hay ambigüedad.** El cálculo de SLA se mantuvo lo más simple posible para
  que sea fácil de explicar y mantener.

## Estado

El backend completo (esquemas, vistas, procedimientos, automatización y reportes) está
terminado y probado en un entorno real. La capa de Power BI está en construcción.

**Herramientas:** MariaDB · SQL · Python (Faker, fpdf2, Random Forest, Gradient Boosting, SHAP) · Power BI · DAX
