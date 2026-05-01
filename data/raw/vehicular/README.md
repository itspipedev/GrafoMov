# 🚗 Vehicular — Vehículos Particulares y Flujo Vehicular

**Fuente:** datos.gov.co
**Fecha descarga:** 1 mayo 2026

> Estos datos complementan el grafo de transporte público con información de
> vehículos particulares, flujo vehicular en corredores y transporte de carga.

## Archivos

| Archivo | ID datos.gov.co | Registros | Tamaño | Descripción |
|---------|----------------|-----------|--------|-------------|
| `parque_automotor_bogota.csv` | `u3vn-bdcy` | 3,160 | 264K | Vehículos matriculados en Bogotá por clase, servicio y estado |
| `trafico_vehicular_peajes_ani.csv` | `8yi9-t44c` | 50,000 | 5.0M | Tráfico vehicular en peajes ANI (corredores nacionales) |
| `trafico_peajes_invias.csv` | `tcfu-jngt` | 10,780 | 3.0M | Tráfico en peajes INVIAS por categoría y mes |
| `pesaje_vehiculos_carga.csv` | `atkg-vhpp` | 50,000 | 4.0M | Pesaje de vehículos de carga en básculas de corredores viales |

## Columnas clave

### parque_automotor_bogota.csv
- `nombre_de_la_clase` — AUTOMOVIL, MOTOCICLETA, CAMIONETA, BUS, etc.
- `nombre_servicio` — PARTICULAR, PUBLICO, OFICIAL
- `estado_del_vehiculo` — ACTIVO, CANCELADO
- `cantidad` — Número de vehículos
- `fecha_de_registro` — Año de registro
- `a_o_de_publicacion`, `mes_de_publicacion` — Fecha del reporte (abril 2026)

### trafico_vehicular_peajes_ani.csv
- `peaje` — Nombre del peaje
- `categoriatarifa` — Categoría del vehículo
- `cantidadtrafico` — Cantidad de vehículos
- `desde`, `hasta` — Período

### trafico_peajes_invias.csv
- `estacion_de_peaje` — Nombre de la estación
- `departamento` — Ubicación
- `anio`, `mes` — Período
- `trafico_efectivo_i` a `trafico_efectivo_vi` — Tráfico por categoría vehicular

### pesaje_vehiculos_carga.csv
- `placa` — Placa del vehículo
- `fecha` — Fecha del pesaje
- `estaci_n` — Estación de pesaje (corredor vial)
- `categoria_vehiculo` — Categoría
- `peso_registrado_en_bascula` — Peso real
- `peso_maximo_vehicular` — Peso máximo permitido

## Uso en el proyecto

- **Parque automotor:** Dimensionar la demanda vehicular por tipo en Bogotá
- **Tráfico peajes:** Flujos vehiculares en corredores de acceso a Bogotá (features en aristas del grafo)
- **Pesaje carga:** Patrones de transporte de carga en corredores viales

## ⏳ Datos pendientes por buscar

- Aforos vehiculares dentro de Bogotá (SIMUR/SDM)
- Velocidades en corredores (datos en tiempo real)
- Datos de Waze/Google Traffic (si hay abiertos)
