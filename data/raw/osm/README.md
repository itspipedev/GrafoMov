# 🗺️ OpenStreetMap — Red Vial Bogotá

**Fuente:** OpenStreetMap via Overpass API
**Fecha descarga:** 1 mayo 2026
**Licencia:** ODbL (Open Database License)

## Archivos

| Archivo | Nodos | Vías | Tamaño | Descripción |
|---------|-------|------|--------|-------------|
| `bogota_main_roads.json` | 60,830 | 11,182 | 10 MB | Red vial principal de Bogotá |

## Tipos de vía

| Tipo | Cantidad | Descripción |
|------|----------|-------------|
| secondary | 4,472 | Vías secundarias |
| primary | 3,727 | Vías primarias |
| trunk | 1,533 | Troncales/autopistas |
| primary_link | 656 | Rampas de vías primarias |
| trunk_link | 569 | Rampas de troncales |
| secondary_link | 225 | Rampas de vías secundarias |

## Área de cobertura
- Latitud: 4.50° — 4.80° N
- Longitud: 74.25° — 73.95° W
- Cubre toda el área urbana de Bogotá

## Uso en el proyecto
- **Grafo vehicular:** Nodos = intersecciones, Aristas = segmentos de vía
- Complementa el grafo de transporte público (TM + SITP)
- Permite análisis de movilidad vehicular completa
- Base para routing vehicular y análisis de congestión

## Formato
JSON de Overpass API con elementos tipo `node` (coordenadas) y `way` (secuencia de nodos + tags).
