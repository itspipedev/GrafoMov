# 🚏 SITP — Sistema Integrado de Transporte Público

**Fuentes:**
- GIS Transmilenio — `gis.transmilenio.gov.co/arcgis/rest/services/Zonal/`
- ArcGIS Hub SDM — `services2.arcgis.com/NEwhEo9GGSHXcRXV/`
- datos.gov.co — `hxy3-94yh`

**Fecha descarga:** 1 mayo 2026

## Archivos

| Archivo | Features | Geometría | Descripción | Rol en grafo |
|---------|----------|-----------|-------------|--------------|
| `paraderos_sitp_bogota.geojson` | 7,694 | Point | Paraderos SITP con código, nombre, dirección | **NODOS** paradas |
| `nodos_sitp_bogota.geojson` | 154 | MultiPolygon | Nodos principales (portales, estaciones, intercambiadores) | **NODOS** principales |
| `rutas_zonales_sitp.geojson` | 703 | — | Rutas zonales con origen, destino, operador, zona SITP | **ARISTAS** |
| `paraderos_zonales_sitp.geojson` | 2,000* | Point | Paraderos zonales con zona SITP, localidad | Nodos zonales |
| `paraderos_rutas_sitp.geojson` | 2,000* | Point | Relación paradero↔ruta (qué paradero sirve a qué ruta) | Relación nodo↔arista |
| `paraderos_sistema.csv` | 928 | CSV | Paradas con coordenadas X/Y, nombre, secuencia, ruta | Nodos + secuencia |

> *Nota: 2,000 es el límite por página del GIS de Transmilenio. Puede haber más registros.

### Archivos duplicados (otra fuente, mismos datos)
| Archivo | Fuente | Nota |
|---------|--------|------|
| `paraderos_sitp_arcgis_hub.geojson` | ArcGIS Hub SDM | Mismo dato que `paraderos_sitp_bogota.geojson`, otra fuente |
| `nodos_sitp_arcgis_hub.geojson` | ArcGIS Hub SDM | Mismo dato que `nodos_sitp_bogota.geojson`, otra fuente |

## Columnas clave

### paraderos_sitp_bogota
- `NTRCODIGO` — Código del paradero
- `NTRNOMBRE` — Nombre (ej: PUENTE AEREO)
- `NTRDIRECCION` — Dirección (ej: AC 26 -KR 103)
- `NTRTIPO` — Tipo de nodo
- Geometría Point con coordenadas

### rutas_zonales_sitp
- `codigo_definitivo_ruta_zonal` — Código de ruta (ej: BC917)
- `denominacion_ruta_zonal` — Nombre descriptivo
- `origen_ruta_zonal`, `destino_ruta_zonal` — Origen y destino
- `operador_ruta_zonal` — Empresa operadora
- `zona_origen_ruta_zonal`, `zona_destino_ruta_zonal` — Zonas SITP
- `longitud_ruta_zonal` — Longitud en km

### paraderos_sistema.csv
- `nombre_ruta` — Ruta que pasa por el paradero
- `nombre_parada` — Nombre del paradero
- `secuencia_parada` — Orden en la ruta (clave para construir aristas)
- `coordenada_x`, `coordenada_y` — Coordenadas
