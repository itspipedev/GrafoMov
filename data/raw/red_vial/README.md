# 🛣️ Red Vial Nacional

**Fuente:** datos.gov.co — `ie7y-asdn`
**Actualizado:** 20 abril 2026
**Fecha descarga:** 1 mayo 2026

## Archivos

| Archivo | Registros | Tamaño | Descripción |
|---------|-----------|--------|-------------|
| `red_vial_nacional.csv` | 44 | 15 MB | Red vial nacional con geometría de tramos |

## Columnas

- `codigo_tramo` — Código del tramo vial
- `nombre_ruta`, `nombre_tramo` — Identificación de la ruta
- `administrador`, `grupo_administrador_vial` — Quién administra el tramo
- `distancia_inicial`, `distancia_final` — Kilómetros del tramo
- `calzada`, `superficie`, `categoria` — Características físicas
- `territorial` — Territorial INVIAS
- `multiline` — Geometría del tramo (WKT)
- `shape__length` — Longitud del tramo

## Uso en el proyecto

- Contexto de red vial a nivel macro
- Posible capa adicional del grafo para rutas interurbanas
