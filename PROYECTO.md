# 🚀 GrafoMov — Grafo Inteligente de Movilidad Urbana

> **Concurso:** Datos al Ecosistema 2026: IA para Colombia
> **Organizador:** MinTIC — datos.gov.co
> **URL:** https://www.datos.gov.co/stories/s/Concurso-Datos-al-Ecosistema-2026-IA-para-Colombia/ddau-8cy9/

---

## 📅 Cronograma

| Fase | Descripción | Fecha |
|------|-------------|-------|
| 1 | Inscripción y formación | Cierre: **1 mayo 2026** medianoche |
| 2 | Selección y desarrollo | Mayo–Junio 2026 |
| 3 | Presentaciones finalistas (presencial) | Julio 2026 |
| 4 | Premiación en GovCamp 2026 | **Primera semana agosto 2026** |

---

## 📋 Requisitos del Concurso

### Equipo
- 2–4 miembros
- Mínimo **1 mujer**
- Mínimo **1 analista/científico de datos**
- Líder designado
- Multidisciplinario

### Obligatorio
- Usar datos de **datos.gov.co** (priorizar Hojas de Ruta)
- Mínimo **1 componente de IA**
- Repo abierto (GitHub/GitLab)
- Registro en herramientas.datos.gov.co/usos
- Documentación **CRISP-ML**
- Producto funcional (web app / modelo / dashboard)

### Evaluación (100 pts)

| Criterio | Peso | Puntuación 1–5 |
|----------|------|-----------------|
| Innovación | 15 pts | × peso |
| Uso de datos abiertos | 20 pts | × peso |
| Rigor técnico | 15 pts | × peso |
| IA / tecnologías emergentes | 20 pts | × peso |
| Impacto / escalabilidad | 20 pts | × peso |
| Diseño / comunicación | 10 pts | × peso |

### Niveles de Complejidad
- **Básico:** descriptivo, 1–2 datasets, ML básico
- **Intermedio:** random forest/boosting/clustering, 3–10 datasets, NLP básico
- **Avanzado:** redes neuronales, LLMs, multi-agente, real-time, Big Data ← **NUESTRO NIVEL**

---

## 🎯 Nuestro Proyecto

**Nombre:** GrafoMov
**Reto:** Transporte
**Categorías:** Innovación social + IA aplicada a datos abiertos (transversal obligatoria)
**Nivel:** Avanzado

### Idea Central
Construir un **grafo de la red de transporte público** (Bogotá: Transmilenio + SITP) donde:
- **Nodos** = paradas / estaciones (con coordenadas geográficas)
- **Aristas** = rutas / conexiones entre paradas
- **Features** = pasajeros/día, siniestralidad, accesibilidad

### Componentes de IA

| # | Componente | Técnica | Qué resuelve |
|---|-----------|---------|--------------|
| 1 | Predicción de demanda/congestión | **Graph Neural Networks (GNN)** | Predecir demanda por estación/ruta |
| 2 | Detección de anomalías | **Anomaly detection en grafos** | Patrones inusuales en siniestralidad |
| 3 | Análisis de accesibilidad | **Graph analytics** | Zonas mal conectadas (inequidad) |
| 4 | Agente conversacional | **LLM + Graph RAG** | Consultar el grafo en lenguaje natural |

---

## 📊 Datasets Identificados (datos.gov.co)

> Total datasets de transporte disponibles: **587**

### 🔵 Para construir el GRAFO (nodos + aristas)

| Dataset | ID | Uso | Prioridad |
|---------|----|-----|-----------|
| Paraderos del Sistema | `hxy3-94yh` | Coordenadas X/Y, nombre parada, secuencia, nombre ruta | ⭐⭐⭐ |
| Paraderos SITP Bogotá | `yvk5-8nn5` | Paradas sistema integrado Bogotá | ⭐⭐⭐ |
| Nodo de Transporte SITP Bogotá | `djsz-g96f` | Nodos de transporte | ⭐⭐⭐ |
| Rutas Troncales Transmilenio | `njnz-p9se` | Rutas = aristas del grafo | ⭐⭐⭐ |
| Trazados Troncales Transmilenio | `fet3-veag` | Geometría de troncales | ⭐⭐ |
| Red Vial Nacional | `ie7y-asdn` | Red vial con tramos y rutas | ⭐⭐ |
| Rutas Transporte Urbano Bucaramanga | `kcdt-jbvj` | Rutas con frecuencias | ⭐⭐ |
| Estaciones MEGABUS Pereira | `w6sc-6cef` | Estaciones existentes y proyectadas | ⭐ |

### 🟢 Para FEATURES en nodos/aristas

| Dataset | ID | Uso | Prioridad |
|---------|----|-----|-----------|
| Pasajeros Transporte Masivo | `2h8t-2zik` | Pasajeros por día/sistema/ciudad | ⭐⭐⭐ |
| Siniestralidad Vial Bogotá | `ecpz-jhmd` | Accidentes — detección anomalías | ⭐⭐⭐ |
| Sectores Críticos Siniestralidad | `rs3u-8r4q` | Tramos peligrosos con geolocalización | ⭐⭐⭐ |
| Parque Automotor RUNT | `u3vn-bdcy` | Vehículos por municipio | ⭐⭐ |
| Red Semafórica Bogotá | `2gfp-jiqi` | Infraestructura semafórica | ⭐⭐ |

### 🔗 URLs de acceso a datasets
```
https://www.datos.gov.co/resource/{ID}.json    # API JSON
https://www.datos.gov.co/resource/{ID}.csv     # Descarga CSV
https://www.datos.gov.co/d/{ID}                # Vista web
```

### 📥 Estado de descargas

#### ✅ Descargados (API) → `data/raw/`
| Archivo | Registros | Tamaño | Contenido |
|---------|-----------|--------|-----------|
| `paraderos_sistema.csv` | 928 | 128K | Paradas con coordenadas y rutas (nodos del grafo) |
| `pasajeros_transporte_masivo.csv` | 1,000 | 92K | Pasajeros por día/ciudad/sistema (features demanda) |
| `sectores_criticos_siniestralidad.csv` | 316 | 48K | Tramos peligrosos con lat/lon (features riesgo) |
| `red_vial_nacional.csv` | 44 | 15MB | Red vial con geometría (aristas del grafo) |

#### ⏳ Descarga manual → guardar en `data/raw/`
| Dataset | Formato | Guardar como | Método |
|---------|---------|-------------|--------|
| Paraderos SITP Bogotá | GeoJSON | `paraderos_sitp_bogota.geojson` | REST/WFS desde https://www.datos.gov.co/d/yvk5-8nn5 |
| Nodos SITP Bogotá | GeoJSON | `nodos_sitp_bogota.geojson` | REST/WFS desde https://www.datos.gov.co/d/djsz-g96f |
| Rutas Troncales TM | GeoJSON | `rutas_troncales_transmilenio.geojson` | REST/WFS desde https://www.datos.gov.co/d/njnz-p9se |
| Trazados Troncales TM | GeoJSON | `trazados_troncales_transmilenio.geojson` | REST/WFS desde https://www.datos.gov.co/d/fet3-veag |
| Siniestralidad 2024 | XLSX | `siniestralidad_bogota_2024.xlsx` | Descarga directa desde https://www.datos.gov.co/d/ecpz-jhmd |
| Siniestralidad 2023 | XLSX | `siniestralidad_bogota_2023.xlsx` | Descarga directa |
| Siniestralidad 2022 | XLSX | `siniestralidad_bogota_2022.xlsx` | Descarga directa |
| Siniestralidad 2021 | XLSX | `siniestralidad_bogota_2021.xlsx` | Descarga directa |
| Siniestralidad 2020 | XLSX | `siniestralidad_bogota_2020.xlsx` | Descarga directa |

> 💎 **Los Excel de siniestralidad son MINA DE ORO**: cada uno tiene 3 secciones (Siniestros, Vehículos, Actor Vial) + diccionario de datos, con ubicación, gravedad, clase de accidente, actores viales y vehículos involucrados. Datos de 2017 a 2024.

---

## 🌐 Visión: Grafo de Movilidad Completa

GrafoMov no es solo transporte público — es **toda la movilidad urbana** de Bogotá en un grafo.

### Capas del grafo

| Capa | Descripción | Estado |
|------|-------------|--------|
| 🚌 **Transporte masivo (TM)** | Estaciones, rutas troncales, trazados | ✅ Datos descargados |
| 🚏 **Transporte zonal (SITP)** | Paraderos, rutas zonales, nodos | ✅ Datos descargados |
| 🚗 **Vehículos particulares** | Flujos vehiculares, aforos, velocidades | ⏳ Pendiente buscar fuentes |
| 🚨 **Siniestralidad** | Accidentes geolocalizados, sectores críticos | ⚠️ Parcial (falta geolocalización) |
| 📈 **Demanda** | Pasajeros por estación/ruta, series temporales | ⚠️ Parcial (datos 2020 pandemia) |
| 🛣️ **Red vial** | Malla vial completa, intersecciones | ⏳ Pendiente complementar |

### Fuentes de datos

> **Regla del concurso (Nivel Avanzado):** *"Las soluciones podrán involucrar integración de grandes volúmenes de datos (Big Data), combinando datos abiertos con fuentes en tiempo real, así como datos estructurados y no estructurados."*

| Fuente | Tipo | Estado | Datos |
|--------|------|--------|-------|
| **datos.gov.co** | Obligatoria (principal) | ✅ Descargado | TM, SITP, siniestralidad, demanda, red vial |
| **GIS Transmilenio** | Complementaria | ✅ Descargado | Estaciones, rutas, trazados, paraderos |
| **ArcGIS Hub SDM** | Complementaria | ✅ Descargado | Paraderos SITP, nodos transporte |
| **datosabiertos.bogota.gov.co** | Complementaria | ❌ Requiere login | Anuarios siniestralidad 2017-2024 (xlsx) |
| **SIMUR / SDM** | Complementaria | ⏳ Por explorar | Aforos vehiculares, velocidades |
| **IDECA** | Complementaria | ⏳ Por explorar | Datos geoespaciales Bogotá |
| **OpenStreetMap** | Complementaria | ⏳ Por explorar | Red vial completa |
| **GTFS Transmilenio** | Complementaria | ⏳ Por explorar | Horarios, frecuencias, tiempo real |

### Prioridades de datos

1. ✅ **YA TENEMOS:** Estructura del grafo (nodos + aristas de TM y SITP)
2. ⚠️ **MEJORAR:** Siniestralidad con geolocalización, demanda actualizada
3. ⏳ **BUSCAR:** Flujos vehiculares, red vial completa, datos en tiempo real

---

## 🏗️ Arquitectura

**Opción C — Híbrido (Backend API + Frontend Streamlit)**

```
GrafoMov/
├── PROYECTO.md              # Info concurso y plan
├── README.md                # README del repo
├── .gitignore
├── backend/                 # FastAPI — API del grafo, modelos, agente
├── frontend/                # Streamlit — dashboard, chat, visualización
├── data/
│   ├── raw/                 # Datos crudos de datos.gov.co
│   ├── processed/           # Datos limpios y transformados
│   └── graphs/              # Grafos construidos (NetworkX, PyG)
├── notebooks/               # Jupyter notebooks de exploración
├── models/                  # Modelos entrenados
└── docs/                    # Documentación CRISP-ML
```

> ⚠️ Arquitectura puede cambiar si se decide ir monolito (Streamlit) o full separado (React).

### Stack Técnico

- **Backend:** FastAPI (API del grafo, modelos GNN, agente conversacional)
- **Frontend:** Streamlit (dashboard, chat, visualización de grafos)
- **Grafos:** NetworkX / PyTorch Geometric / Neo4j
- **GNN:** PyTorch Geometric (GCN, GAT, GraphSAGE)
- **LLM / Agente:** LangChain + Graph RAG
- **Visualización:** PyVis / Plotly
- **Datos:** Socrata API (datos.gov.co)
- **Documentación:** CRISP-ML

---

## ✅ TODO

- [x] Inscribirse antes del 1 de mayo 2026
- [x] Descargar y explorar datasets clave
- [x] Construir grafo base con paradas + rutas de Bogotá (7,444 nodos, 41,990 aristas)
- [x] Enriquecer nodos/aristas con features (siniestralidad, centralidad, demanda)
- [x] Entrenar modelo GNN (GAT — MSE 0.18, RMSE 0.42)
- [x] Backend FastAPI (SOLID, 8 endpoints + agente)
- [x] PostGIS (Docker, schema, loader, repositorio)
- [x] Agente conversacional (LLM + Graph RAG, 6 tools, OpenAI/Ollama)
- [x] Frontend Streamlit tipo Waze (8 vistas: mapa, nearby, rutas, peligro, accesibilidad, centralidad, métricas, chat)
- [x] Documentación CRISP-ML
- [x] Repo público GitHub
- [ ] Registrar en herramientas.datos.gov.co/usos
- [ ] Buscar datos complementarios (Waze, OSM, SIMUR) para movilidad vehicular completa
- [ ] Mejorar siniestralidad con datos geolocalizados (si se obtiene acceso a datosabiertos.bogota.gov.co)
- [ ] Mejorar demanda con datos post-pandemia
- [ ] Implementar pgRouting para pathfinding en PostGIS
