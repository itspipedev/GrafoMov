# 🚌 Transmilenio — Datos Troncales

**Fuente:** GIS Transmilenio — `gis.transmilenio.gov.co/arcgis/rest/services/Troncal/`
**Fecha descarga:** 1 mayo 2026

## Archivos

| Archivo | Features | Geometría | Descripción | Rol en grafo |
|---------|----------|-----------|-------------|--------------|
| `estaciones_troncales_tm.geojson` | 153 | Point | Estaciones del sistema troncal con coordenadas, nombre, troncal, vagones | **NODOS** |
| `rutas_troncales_transmilenio.geojson` | 126 | LineString | Rutas troncales con origen, destino, horarios, tipo de bus, longitud | **ARISTAS** |
| `trazados_troncales_transmilenio.geojson` | 20 | LineString | Corredores troncales (NQS, Caracas, etc.) con geometría | Infraestructura |
| `trazados_estaciones_tm.geojson` | 332 | Point | Relación estación↔trazado (qué estación pertenece a qué troncal) | Relación nodo↔arista |
| `conexiones_troncales_tm.geojson` | 13 | Point | Puntos de conexión/transbordo entre troncales | **NODOS** conexión |
| `patios_troncales_tm.geojson` | 24 | Polygon | Patios y depósitos de buses | Infraestructura |

## Columnas clave

### estaciones_troncales_tm
- `nombre_estacion` — Nombre de la estación
- `coordenada_x_estacion`, `coordenada_y_estacion` — Coordenadas
- `troncal_estacion` — A qué troncal pertenece
- `numero_vagones_estacion` — Capacidad

### rutas_troncales_transmilenio
- `nombre_ruta_troncal` — Código de ruta (ej: G48)
- `origen_ruta_troncal`, `destino_ruta_troncal` — Origen y destino
- `horario_lunes_viernes`, `horario_sabado`, `horario_domingo_festivo` — Horarios
- `desc_tipo_bus_ruta_troncal` — Tipo de bus (BIARTICULADO, ARTICULADO, etc.)
- `longitud_ruta_troncal` — Longitud en km
- `estado_ruta_troncal` — OPERATIVA / NO OPERATIVA
