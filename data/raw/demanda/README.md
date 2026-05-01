# 📈 Demanda — Pasajeros Transporte Masivo

**Fuente:** datos.gov.co — `2h8t-2zik`
**Fecha descarga:** 1 mayo 2026

## Archivos

| Archivo | Registros | Descripción |
|---------|-----------|-------------|
| `pasajeros_transporte_masivo.csv` | 1,000 | Pasajeros diarios por sistema de transporte masivo en Colombia |

## Columnas

- `fecha` — Fecha (DD/MM/YYYY)
- `ciudad` — Ciudad (Cali/Valle, Bogotá, Medellín, etc.)
- `sistema` — Sistema de transporte (MIO, TRANSMILENIO, METRO, etc.)
- `pasajeros_dia` — Pasajeros promedio día laboral
- `pasajeros_d_a_t_pico_laboral` — Pasajeros día típico laboral
- `pasajeros_d_a_s_bado` — Pasajeros día sábado
- `pasajeros_d_a_festivo` — Pasajeros día festivo
- `d_asemana` — Día de la semana (1-7)
- `variaci_n_transmilenio` — Variación respecto a Transmilenio

## Uso en el proyecto

- **Features de demanda** para nodos del grafo
- Series temporales de pasajeros por sistema
- Predicción de demanda con GNN
