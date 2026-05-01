# ⚠️ Siniestralidad — Datos de datos.gov.co

**Fuente:** datos.gov.co — `rs3u-8r4q`
**Fecha descarga:** 1 mayo 2026

## Archivos

| Archivo | Registros | Descripción |
|---------|-----------|-------------|
| `sectores_criticos_siniestralidad.csv` | 316 | Tramos de la red vial nacional con alta siniestralidad |

## Columnas

- `id_mt` — ID del tramo (ej: 4G013)
- `entidad` — Administrador vial (ANI, INVIAS)
- `tramo` — Nombre del corredor (ej: Bogotá - Villavicencio)
- `nombre` — Nombre del sector específico
- `latitud`, `longitud` — Coordenadas geográficas
- `fallecidos` — Número de fallecidos en el tramo
- `gizscore`, `gipvalue` — Indicadores estadísticos de siniestralidad
- `municipio`, `departamento`, `divipola` — Ubicación administrativa

## ❌ Datos pendientes

Los **Anuarios de Siniestralidad Vial de Bogotá (2017-2024)** están en:
- https://www.datos.gov.co/d/ecpz-jhmd

Contienen bases de datos Excel con 3 secciones cada una:
- **Siniestros:** ubicación, gravedad, clase de accidente
- **Vehículos:** tipo, marca, modelo
- **Actor Vial:** tipo de actor, género, edad

**Problema:** La descarga requiere login en `datosabiertos.bogota.gov.co`.
Si se obtiene acceso, descargar los .xlsx y guardarlos aquí como:
- `siniestralidad_bogota_2024.xlsx`
- `siniestralidad_bogota_2023.xlsx`
- `siniestralidad_bogota_2022.xlsx`
- `siniestralidad_bogota_2021.xlsx`
- `siniestralidad_bogota_2020.xlsx`
