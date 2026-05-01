# 🔄 Siniestralidad — Fuentes Alternativas

> **¿Por qué esta carpeta?**
> Los datos detallados de siniestralidad vial de Bogotá (Anuarios 2017-2024 en .xlsx)
> están alojados en `datosabiertos.bogota.gov.co`, que requiere login institucional
> para descargar. Como alternativa, se descargaron estos datos de **otra fuente dentro
> de datos.gov.co** para suplir esa necesidad.

**Fuente:** datos.gov.co — `6jmc-vaxk`
**Dataset original:** "Vehículos involucrados en un accidente de tránsito - Ley 2251-2022"
**Publicado por:** RUNT (Registro Único Nacional de Tránsito)
**Filtro aplicado:** `municipio_accidente=BOGOTA`
**Fecha descarga:** 1 mayo 2026

## Archivos

| Archivo | Registros | Tamaño | Descripción |
|---------|-----------|--------|-------------|
| `vehiculos_accidentes_bogota.csv` | 50,000 | 6.1 MB | Vehículos involucrados en accidentes de tránsito en Bogotá |

## Columnas

- `fecha_accidente` — Fecha del accidente (formato MM/YYYY)
- `gravedad_accidente` — Gravedad: CON HERIDOS, CON MUERTOS, SOLO DAÑOS
- `tipo_vehiculo` — Tipo: AUTOMOVIL, MOTOCICLETA, BUS, CAMIONETA, etc.
- `marca_vehiculo` — Marca del vehículo
- `modelo_vehiculo` — Año del modelo
- `edad_vehiculo` — Antigüedad del vehículo en años
- `departamento_accidente` — BOGOTA D.C.
- `municipio_accidente` — BOGOTA
- `autoridad_de_transito` — SECRETARIA DISTRITAL DE MOVILIDAD DE BOGOTA

## Limitaciones

- No tiene **ubicación geográfica** (lat/lon) — solo municipio
- La fecha es solo **mes/año**, no día exacto
- No tiene información del **actor vial** (peatón, ciclista, etc.)
- Límite de 50,000 registros por consulta API — puede haber más datos

## Uso en el proyecto

Sirve para:
- Análisis temporal de accidentalidad por tipo de vehículo
- Distribución de gravedad de accidentes
- Features agregadas a nivel ciudad/mes para el modelo
- NO sirve para geolocalizar accidentes en el grafo (falta lat/lon)
