# 🚀 GrafoMov

### Grafo inteligente de movilidad urbana para ciudades colombianas

> 🏆 Proyecto para el concurso **Datos al Ecosistema 2026: IA para Colombia** — MinTIC
>
> 📊 Reto: **Transporte** | 🧠 Categoría: **IA aplicada a datos abiertos** | ⚡ Nivel: **Avanzado**

---

## 🎯 ¿Qué es GrafoMov?

GrafoMov transforma la red de transporte público de Bogotá en un **grafo de conocimiento**, donde estaciones y paraderos son nodos, y rutas son aristas. Sobre esta estructura aplicamos inteligencia artificial para responder preguntas que hoy nadie responde:

- 🔮 **¿Dónde habrá congestión mañana?** — Predicción de demanda con Graph Neural Networks
- 🚨 **¿Qué zonas son más peligrosas?** — Detección de anomalías en siniestralidad vial
- 🗺️ **¿Qué barrios están mal conectados?** — Análisis de accesibilidad e inequidad en transporte
- 💬 **¿Cómo llego de X a Y?** — Agente conversacional que consulta el grafo en lenguaje natural

## 🧩 Arquitectura

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  datos.gov.co│────▶│   Backend (API)  │────▶│ Frontend (Web)  │
│  GIS TransMi │     │                  │     │                 │
│  ArcGIS Hub  │     │  FastAPI         │     │  Streamlit      │
└─────────────┘     │  ├─ Graph Builder │     │  ├─ Dashboard   │
                    │  ├─ GNN Models    │     │  ├─ Mapa Grafo  │
                    │  ├─ Anomaly Det.  │     │  ├─ Chat IA     │
                    │  └─ Agent (RAG)   │     │  └─ Métricas    │
                    └──────────────────┘     └─────────────────┘
```

## 📊 Datos

Todos los datos provienen de fuentes abiertas colombianas:

| Fuente | Datos | Registros |
|--------|-------|-----------|
| [GIS Transmilenio](https://gis.transmilenio.gov.co) | Estaciones, rutas troncales, trazados, conexiones | 153 estaciones, 126 rutas |
| [ArcGIS Hub SDM](https://services2.arcgis.com/NEwhEo9GGSHXcRXV/) | Paraderos SITP, nodos de transporte | 7,694 paraderos, 154 nodos |
| [datos.gov.co](https://www.datos.gov.co) | Pasajeros transporte masivo, siniestralidad vial, red vial | 50,000+ registros |

> 📁 Ver [`data/raw/README.md`](data/raw/README.md) para el catálogo completo de datasets.

## 🛠️ Stack Técnico

| Capa | Tecnología | Uso |
|------|-----------|-----|
| **Backend** | FastAPI | API del grafo, modelos, agente |
| **Frontend** | Streamlit | Dashboard, chat, visualización |
| **Grafos** | NetworkX, PyTorch Geometric | Construcción y análisis de grafos |
| **GNN** | PyTorch Geometric (GCN, GAT) | Predicción de demanda, detección de anomalías |
| **Agente IA** | LangChain + Graph RAG | Consultas en lenguaje natural sobre el grafo |
| **Visualización** | PyVis, Plotly | Mapas interactivos de la red |
| **Datos** | Socrata API, ArcGIS REST | Ingesta de datos abiertos |

## 📁 Estructura del Proyecto

```
GrafoMov/
├── backend/                 # FastAPI — API del grafo, modelos, agente
├── frontend/                # Streamlit — dashboard, chat, visualización
├── data/
│   ├── raw/                 # Datos crudos organizados por categoría
│   │   ├── transmilenio/    #   Estaciones, rutas, trazados troncales
│   │   ├── sitp/            #   Paraderos, nodos, rutas zonales
│   │   ├── siniestralidad/  #   Accidentes y sectores críticos
│   │   ├── demanda/         #   Pasajeros transporte masivo
│   │   └── red_vial/        #   Red vial nacional
│   ├── processed/           # Datos limpios y transformados
│   └── graphs/              # Grafos construidos
├── notebooks/               # Exploración y análisis
├── models/                  # Modelos entrenados
├── docs/                    # Documentación CRISP-ML
├── PROYECTO.md              # Plan detallado del concurso
└── README.md                # Este archivo
```

## 🚀 Inicio Rápido

```bash
# Clonar
git clone https://github.com/tu-usuario/GrafoMov.git
cd GrafoMov

# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend (otra terminal)
cd frontend
pip install -r requirements.txt
streamlit run app.py
```

## 📄 Metodología

Este proyecto sigue la metodología **CRISP-ML** (Cross-Industry Standard Process for Machine Learning):

1. **Comprensión del negocio** — Inequidad en transporte público, congestión, siniestralidad
2. **Comprensión de datos** — Exploración de 18+ datasets de datos abiertos
3. **Preparación de datos** — Construcción del grafo (nodos, aristas, features)
4. **Modelado** — GNN para predicción, detección de anomalías
5. **Evaluación** — Métricas de precisión, impacto social
6. **Despliegue** — Dashboard web + agente conversacional

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
