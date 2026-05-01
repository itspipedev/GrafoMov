# 🚌 Movilidad Urbana — Pasajeros y Viajes

**Fuente:** datos.gov.co
**Fecha descarga:** 1 mayo 2026

## Archivos

| Archivo | ID | Registros | Descripción |
|---------|-----|-----------|-------------|
| `pasajeros_carretera_origen_destino.csv` | `eh75-8ah6` | 50,000 | Despachos y pasajeros en terminales de transporte por carretera |

## Columnas

### pasajeros_carretera_origen_destino.csv
- `terminal` — Terminal de transporte (ej: T.T. DE BOGOTÁ SALITRE)
- `clase_vehiculo` — BUSETA, BUS, MICROBUS, etc.
- `nivel_servicio` — BASICO, PREFERENCIAL
- `municipio_origen_ruta` — Código DANE del municipio origen
- `municipio_destino_ruta` — Código DANE del municipio destino
- `fecha_despacho` — Fecha (2020-01 a 2023-12)
- `hora_despacho` — Hora del despacho
- `tipo_despacho` — ORIGEN
- `despachos` — Número de despachos
- `pasajeros` — Número de pasajeros

## Terminales de Bogotá
- T.T. DE BOGOTÁ SALITRE: 4,474 registros
- T.T. DE BOGOTÁ NORTE: 1,537 registros
- T.T. DE BOGOTÁ SUR: 1,216 registros

## Uso en el proyecto
- Flujos de pasajeros interurbanos desde/hacia Bogotá
- Patrones de demanda por hora y día
- Conexiones origen-destino para el grafo de movilidad ampliado

## ⏳ Datos pendientes
- Encuesta de Movilidad Bogotá (federated, requiere acceso a datosabiertos.bogota.gov.co)
- Sensores Conteo Bicicleta (federated)
- Ciclorrutas Bogotá (federated)
- Observatorio de Movilidad Bogotá (federated)
