# 📂 data/raw — Datos Crudos

Datos descargados directamente de fuentes abiertas, sin transformar.
**Total: 22+ archivos | ~35 MB | 125,000+ registros**

## Estructura

```
data/raw/
├── README.md                  ← Este archivo
├── transmilenio/              ← 6 archivos — Estaciones, rutas, trazados troncales TM
├── sitp/                      ← 7 archivos — Paraderos, nodos, rutas zonales SITP
├── vehicular/                 ← 4 archivos — Parque automotor, tráfico peajes, pesaje
├── siniestralidad/
│   ├── datos_gov_co/          ← 1 archivo — Sectores críticos (datos.gov.co)
│   └── fuentes_alternativas/  ← 1 archivo — Accidentes Bogotá (fuente alternativa)
├── demanda/                   ← 1 archivo — Pasajeros transporte masivo
└── red_vial/                  ← 1 archivo — Red vial nacional
```

## Resumen de datos

| Carpeta | Archivos | Registros clave | Uso en el grafo |
|---------|----------|-----------------|-----------------|
| `transmilenio/` | 6 GeoJSON | 153 estaciones, 126 rutas, 20 troncales | Nodos + aristas troncales |
| `sitp/` | 5 GeoJSON + 1 CSV | 7,694 paraderos, 42,601 paraderos-rutas, 703 rutas | Nodos + aristas zonales |
| `vehicular/` | 4 CSV | 3,160 parque automotor, 110,780 tráfico/pesaje | Features complementarias |
| `siniestralidad/` | 2 CSV | 316 sectores críticos, 50,000 accidentes | Features de riesgo |
| `demanda/` | 1 CSV | 1,000 registros pasajeros | Features de demanda |
| `red_vial/` | 1 CSV | 44 tramos (15MB geometría) | Red vial macro |

## Fuentes

| Fuente | URL | Tipo |
|--------|-----|------|
| GIS Transmilenio | `gis.transmilenio.gov.co/arcgis/rest/services/` | ArcGIS REST API |
| ArcGIS Hub SDM | `services2.arcgis.com/NEwhEo9GGSHXcRXV/` | ArcGIS FeatureServer |
| datos.gov.co | `www.datos.gov.co/resource/{ID}.csv` | Socrata API |

## ⚠️ Nota sobre siniestralidad

Los datos detallados (Anuarios 2017-2024 en .xlsx) requieren login en `datosabiertos.bogota.gov.co`.
Como alternativa se descargó el dataset de vehículos en accidentes (RUNT, Ley 2251-2022).
Ver `siniestralidad/fuentes_alternativas/README.md` para detalles.

## Fecha de descarga

**1 de mayo de 2026**
