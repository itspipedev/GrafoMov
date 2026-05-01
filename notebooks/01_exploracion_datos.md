# Exploración de Datos — GrafoMov
# Resumen de la exploración inicial de datasets

## Datos disponibles para el grafo

### Nodos
| Tipo | Cantidad | Coordenadas | Fuente |
|------|----------|-------------|--------|
| Estaciones Transmilenio | 153 | ✅ 153/153 | GIS Transmilenio |
| Paraderos SITP | 7,694 | ✅ 7,694/7,694 | ArcGIS Hub SDM |
| Nodos principales SITP | 154 | ✅ (MultiPolygon) | ArcGIS Hub SDM |
| Conexiones troncales | 13 | ✅ | GIS Transmilenio |

### Aristas
| Tipo | Cantidad | Geometría | Fuente |
|------|----------|-----------|--------|
| Rutas troncales TM | 126 (todas OPERATIVAS) | LineString | GIS Transmilenio |
| Rutas zonales SITP | 703 | Sin geometría (origen/destino) | GIS Transmilenio |
| Paradas con secuencia | 928 paradas en 42 rutas | Con coordenadas | datos.gov.co |

### Troncales de Transmilenio
Americas, Autonorte, Calle 26, Calle 6, Calle 80, Caracas, Cr 7-10, Eje Ambiental, NQS, Soacha, Suba, Tunal

### Tipos de bus TM
- Biarticulado: 67 rutas
- Articulado: 38 rutas
- Dual: 21 rutas

### Tipos de ruta SITP
- Tipo 3 (Urbana): 555 rutas
- Tipo 4 (Alimentadora): 122 rutas
- Tipo 5 (Complementaria): 15 rutas
- Tipo 6 (Especial): 11 rutas

### Features adicionales
| Dataset | Registros | Uso |
|---------|-----------|-----|
| Accidentes Bogotá | 50,000 | Siniestralidad (sin geoloc) |
| Sectores críticos | 316 | Siniestralidad (con geoloc) |
| Pasajeros TM | 1,000 | Demanda (2020) |
| Parque automotor | 3,160 | Vehículos por tipo |
| Tráfico peajes ANI | 50,000 | Flujo vehicular corredores |
| Tráfico peajes INVIAS | 10,780 | Flujo vehicular peajes |
| Pesaje carga | 50,000 | Transporte de carga |

## Siguiente paso
~~Construir el grafo base con NetworkX~~ ✅ HECHO

### Resultados del grafo construido

| Versión | Nodos | Aristas | Componente principal | Grado promedio |
|---------|-------|---------|---------------------|----------------|
| v1 (base) | 7,856 | 786 | 3% | 0.20 |
| v2 (secuencias) | 7,444 | 41,990 | 97.9% | 11.28 |
| v2 enriched | 7,444 | 41,990 | 97.9% | 11.28 + features |

### Modelo GNN entrenado
- GAT (4 heads, 32 hidden)
- MSE: 0.1809 | RMSE: 0.4253
- Early stopping: epoch 163
