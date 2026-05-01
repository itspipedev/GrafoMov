# 📂 data/raw — Datos Crudos

Datos descargados directamente de fuentes abiertas, sin transformar.

## Estructura

```
data/raw/
├── README.md                  ← Este archivo
├── transmilenio/              ← Estaciones, rutas y trazados troncales TM
├── sitp/                      ← Paraderos, nodos y rutas zonales SITP
├── siniestralidad/
│   ├── datos_gov_co/          ← Datos originales de datos.gov.co
│   └── fuentes_alternativas/  ← Datos de otras fuentes (ver nota abajo)
├── demanda/                   ← Pasajeros transportados
└── red_vial/                  ← Red vial nacional
```

## Fuentes

| Fuente | URL | Tipo |
|--------|-----|------|
| GIS Transmilenio | `gis.transmilenio.gov.co/arcgis/rest/services/` | ArcGIS REST API |
| ArcGIS Hub SDM | `services2.arcgis.com/NEwhEo9GGSHXcRXV/` | ArcGIS FeatureServer |
| datos.gov.co | `www.datos.gov.co/resource/{ID}.csv` | Socrata API |
| datos.gov.co | `www.datos.gov.co/d/{ID}` | Portal web |

## ⚠️ Nota sobre siniestralidad

Los datos detallados de siniestralidad vial de Bogotá (Anuarios 2017-2024 en formato .xlsx) están en:
- https://www.datos.gov.co/d/ecpz-jhmd

Pero su descarga requiere login en `datosabiertos.bogota.gov.co`, al cual no tenemos acceso.

Como alternativa, se descargó el dataset **"Vehículos involucrados en accidentes de tránsito"** (Ley 2251-2022) desde datos.gov.co, filtrado por Bogotá. Este dataset está en `siniestralidad/fuentes_alternativas/` y se documenta en su propio README.

## Fecha de descarga

**1 de mayo de 2026**
