# 🚀 GrafoMov

### Grafo inteligente de movilidad urbana para ciudades colombianas

> 🏆 Proyecto para el concurso **Datos al Ecosistema 2026: IA para Colombia** — MinTIC
>
> 📊 Reto: **Transporte** | 🧠 Categoría: **IA aplicada a datos abiertos** | ⚡ Nivel: **Avanzado**

---

## 🎯 ¿Qué es GrafoMov?

GrafoMov transforma la red de transporte público de Bogotá en un **grafo de conocimiento** con **7,444 nodos** y **41,990 conexiones**, aplicando inteligencia artificial para responder preguntas que hoy nadie responde:

- 🔮 **¿Dónde habrá congestión?** — Predicción con Graph Attention Networks (GAT)
- 🚨 **¿Qué zonas son peligrosas?** — Detección de siniestralidad vial geolocalizada
- 🗺️ **¿Qué barrios están mal conectados?** — Análisis de accesibilidad e inequidad
- 💬 **¿Cómo llego de X a Y?** — Agente conversacional (LLM + Graph RAG)

## 🧩 Arquitectura

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  datos.gov.co│────▶│   Backend (API)  │────▶│ Frontend (Web)  │
│  GIS TransMi │     │                  │     │                 │
│  ArcGIS Hub  │     │  FastAPI         │     │  Streamlit      │
└─────────────┘     │  ├─ Graph Builder │     │  ├─ Mapa Waze   │
                    │  ├─ GNN (GAT)     │     │  ├─ Dashboard   │
 ┌─────────────┐    │  ├─ Anomaly Det.  │     │  ├─ Chat IA     │
 │  PostgreSQL  │◀──▶│  └─ Agent (RAG)  │     │  └─ Métricas    │
 │  + PostGIS   │    └──────────────────┘     └─────────────────┘
 └─────────────┘
```

## 📊 Datos

Todos los datos provienen de fuentes abiertas colombianas:

| Fuente | Datos | Registros |
|--------|-------|-----------|
| [GIS Transmilenio](https://gis.transmilenio.gov.co) | Estaciones, rutas troncales, trazados, conexiones | 153 estaciones, 126 rutas |
| [ArcGIS Hub SDM](https://services2.arcgis.com/NEwhEo9GGSHXcRXV/) | Paraderos SITP, nodos de transporte | 7,694 paraderos, 154 nodos |
| [GIS Transmilenio (Zonal)](https://gis.transmilenio.gov.co) | Paraderos-rutas, rutas zonales | 42,601 relaciones, 703 rutas |
| [datos.gov.co](https://www.datos.gov.co) | Siniestralidad, demanda, parque automotor, tráfico | 125,000+ registros |

## 🧠 Modelo GNN

**Graph Attention Network (GAT)** entrenado sobre el grafo de movilidad:

| Métrica | Valor |
|---------|-------|
| Arquitectura | GAT (4 heads, 32 hidden) |
| Features por nodo | 8 (lat, lon, grado, betweenness, closeness, siniestralidad, fallecidos, is_tm) |
| MSE (test) | 0.1809 |
| RMSE (test) | 0.4253 |
| Early stopping | Epoch 163/200 |

## 🤖 Agente Conversacional

LLM + Graph RAG con 6 herramientas que consultan el grafo en tiempo real:

- `find_nearby` — Paraderos cercanos a coordenadas
- `find_route` — Ruta más corta entre nodos
- `get_dangerous_zones` — Zonas con siniestralidad
- `get_worst_accessibility` — Zonas mal conectadas
- `get_most_central` — Nodos más importantes
- `get_graph_stats` — Estadísticas del grafo

Soporta **OpenAI** (gpt-4o-mini) y **Ollama** (llama3.2 local).

## 🛠️ Stack Técnico

| Capa | Tecnología |
|------|-----------|
| **Base de datos** | PostgreSQL 16 + PostGIS 3.4 (Docker) |
| **Backend** | FastAPI (arquitectura SOLID) |
| **Grafos** | NetworkX + PyTorch Geometric |
| **GNN** | GAT (Graph Attention Network) |
| **Agente IA** | OpenAI / Ollama + Graph RAG |
| **Frontend** | Streamlit + Folium (mapa tipo Waze) |
| **Datos** | Socrata API + ArcGIS REST |

## 📁 Estructura del Proyecto

```
GrafoMov/
├── backend/                     # FastAPI — SOLID architecture
│   ├── main.py                  #   Entry point
│   ├── app/
│   │   ├── core/                #   Config + Dependency Injection
│   │   ├── domain/              #   Entities, Services, Repository interfaces
│   │   ├── infrastructure/      #   NetworkX, PostGIS, GNN, Agent implementations
│   │   └── api/v1/              #   Endpoints, Schemas, Mappers
│   └── requirements.txt
├── frontend/                    # Streamlit — Waze-style UI
│   ├── app.py                   #   8 views: map, nearby, routes, danger, accessibility, chat
│   ├── api_client.py            #   Backend API consumer
│   └── requirements.txt
├── data/
│   ├── raw/                     # 22+ datasets organizados por categoría
│   │   ├── transmilenio/        #   6 archivos GeoJSON
│   │   ├── sitp/                #   7 archivos GeoJSON + CSV
│   │   ├── vehicular/           #   4 archivos CSV
│   │   ├── siniestralidad/      #   2 archivos CSV
│   │   ├── demanda/             #   1 archivo CSV
│   │   └── red_vial/            #   1 archivo CSV
│   ├── processed/               # Datos transformados
│   └── graphs/                  # Grafos construidos (.graphml, .pt)
├── models/                      # Modelos entrenados (GAT)
├── src/                         # Scripts de construcción y enriquecimiento del grafo
├── notebooks/                   # Exploración de datos
├── docs/                        # Documentación CRISP-ML
├── docker-compose.yml           # PostgreSQL + PostGIS
├── PROYECTO.md                  # Plan detallado del concurso
└── README.md
```

## 🚀 Inicio Rápido

```bash
# 1. Clonar
git clone https://github.com/itspipedev/GrafoMov.git
cd GrafoMov

# 2. Base de datos (opcional — por defecto usa NetworkX)
docker compose up -d

# 3. Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# 4. Frontend (otra terminal)
cd frontend
pip install -r requirements.txt
streamlit run app.py
```

**API Docs:** http://localhost:8000/docs
**Frontend:** http://localhost:8501

## 📈 Hallazgos Clave

- **97.9%** del grafo está conectado en una sola componente
- **Br. San Benito** (Ciudad Bolívar) es el mayor cuello de botella de la red
- **Fontibón** (KR 123) es la zona más peligrosa (13 fallecidos)
- **2.7M vehículos** en Bogotá — motos son el #1 en accidentes
- **50,000 accidentes** en 2024 (96.5% heridos, 3.5% muertos)

## 📄 Metodología

Proyecto documentado con **CRISP-ML** — ver [`docs/CRISP-ML.md`](docs/CRISP-ML.md)

## 👥 Equipo

| Rol | Nombre |
|-----|--------|
| Líder / Data Scientist | |
| Analista de datos | |
| Desarrollador | |
| | |

## 📜 Licencia

MIT

---

> 🇨🇴 Hecho con datos abiertos de Colombia para el concurso [Datos al Ecosistema 2026](https://www.datos.gov.co/stories/s/Concurso-Datos-al-Ecosistema-2026-IA-para-Colombia/ddau-8cy9/)
