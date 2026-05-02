# 📄 Documentación CRISP-ML — GrafoMov

> Cross-Industry Standard Process for Machine Learning
> Requisito obligatorio del concurso Datos al Ecosistema 2026

---

## 1. Comprensión del Negocio

### 1.1 Problema
Bogotá tiene uno de los peores sistemas de transporte público de Latinoamérica. Los datos de movilidad están fragmentados entre múltiples entidades (Transmilenio S.A., Secretaría de Movilidad, RUNT, ANSV) y no existe una herramienta que los integre para tomar decisiones basadas en evidencia.

### 1.2 Objetivos
1. **Predecir demanda/congestión** en estaciones y paraderos
2. **Detectar zonas de alta siniestralidad** cercanas a rutas de transporte
3. **Medir accesibilidad** e identificar zonas mal conectadas (inequidad)
4. **Democratizar el acceso** a la información mediante un agente conversacional

### 1.3 Criterios de éxito
| Criterio | Métrica | Objetivo |
|----------|---------|----------|
| Predicción de importancia | RMSE en grado de nodos | < 0.5 |
| Cobertura del grafo | % nodos en componente principal | > 95% |
| Siniestralidad | Nodos con score > 0 | > 30 |
| Accesibilidad | Closeness centrality calculada | 100% nodos |
| Agente | Respuestas correctas | > 80% |

### 1.4 Stakeholders
- Secretaría Distrital de Movilidad de Bogotá
- Transmilenio S.A.
- Ciudadanos usuarios del transporte público
- Planificadores urbanos

---

## 2. Comprensión de los Datos

### 2.1 Fuentes de datos

| Fuente | Tipo | Registros | Formato |
|--------|------|-----------|---------|
| GIS Transmilenio | Estaciones, rutas, trazados troncales | 153 estaciones, 126 rutas, 20 troncales | GeoJSON |
| ArcGIS Hub SDM | Paraderos SITP, nodos transporte | 7,694 paraderos, 154 nodos | GeoJSON |
| GIS Transmilenio (Zonal) | Paraderos-rutas, rutas zonales | 42,601 relaciones, 703 rutas | GeoJSON |
| datos.gov.co | Pasajeros transporte masivo | 1,000 registros | CSV |
| datos.gov.co | Sectores críticos siniestralidad | 316 tramos | CSV |
| datos.gov.co | Vehículos en accidentes Bogotá | 50,000 registros | CSV |
| datos.gov.co | Parque automotor RUNT | 3,160 registros | CSV |
| datos.gov.co | Tráfico peajes ANI/INVIAS | 60,780 registros | CSV |

### 2.2 Calidad de datos
- **Completitud:** 100% de estaciones y paraderos tienen coordenadas geográficas
- **Actualización:** Datos de infraestructura actualizados a abril 2026
- **Limitaciones:**
  - Demanda de pasajeros solo disponible para período pandemia (2020)
  - Accidentes sin geolocalización (solo municipio)
  - Anuarios de siniestralidad detallada requieren login institucional

### 2.3 Exploración
- 7,444 nodos únicos (153 estaciones TM + 7,291 paraderos SITP)
- 41,990 aristas (83 rutas troncales + 41,907 secuencias de paradas)
- 97.9% del grafo conectado en una sola componente
- 13 troncales: Americas, Autonorte, Calle 26, Calle 6, Calle 80, Caracas, Cr 7-10, Eje Ambiental, NQS, Soacha, Suba, Tunal
- Nodo más central: Br. San Benito (betweenness 0.26)

---

## 3. Preparación de los Datos

### 3.1 Construcción del grafo
1. **Nodos:** Estaciones TM + paraderos SITP con coordenadas (lat, lon)
2. **Aristas TM:** Rutas troncales conectando estaciones por nombre origen/destino
3. **Aristas SITP:** Secuencia de paraderos por ruta (42,601 relaciones paradero↔ruta ordenadas)
4. **Deduplicación:** Paraderos únicos por cenefa (de 42,601 a 7,291)

### 3.2 Feature engineering
| Feature | Tipo | Descripción |
|---------|------|-------------|
| lat, lon | Geográfica | Coordenadas del nodo |
| grado | Topológica | Número de conexiones |
| betweenness | Topológica | Centralidad de intermediación |
| closeness | Topológica | Centralidad de cercanía |
| siniestralidad_score | Contextual | Índice de peligrosidad (sectores críticos a < 2km) |
| fallecidos_cercanos | Contextual | Fallecidos en accidentes cercanos |
| is_tm | Categórica | 1 si es estación TM, 0 si es paradero SITP |

### 3.3 Normalización
- Features normalizadas con z-score (media=0, std=1)
- Target (grado) transformado con log1p para manejar distribución sesgada

---

## 4. Modelado

### 4.1 Arquitectura
**Graph Attention Network (GAT)** — PyTorch Geometric

```
Input (8 features) → GATConv(8→32, 4 heads) → ELU → Dropout(0.3)
                   → GATConv(128→32, 1 head) → ELU
                   → Linear(32→1) → Output (importancia)
```

### 4.2 Hiperparámetros
| Parámetro | Valor |
|-----------|-------|
| Hidden channels | 32 |
| Attention heads (capa 1) | 4 |
| Dropout | 0.3 |
| Learning rate | 0.005 |
| Weight decay | 5e-4 |
| Early stopping patience | 20 epochs |
| Split | 70/15/15 (train/val/test) |

### 4.3 Justificación
- **GAT vs GCN:** GAT aprende pesos de atención por vecino, capturando que no todos los vecinos son igual de importantes
- **4 heads:** Multi-head attention captura diferentes patrones de relación
- **Dropout 0.3:** Regularización para evitar overfitting en grafos sparse

---

## 5. Evaluación

### 5.1 Resultados del modelo
| Métrica | Valor |
|---------|-------|
| MSE (test) | 0.1809 |
| MAE (test) | 0.3355 |
| RMSE (test) | 0.4253 |
| Early stopping | Epoch 163/200 |

### 5.2 Métricas del grafo
| Métrica | Valor |
|---------|-------|
| Nodos | 7,444 |
| Aristas | 41,990 |
| Componentes conexas | 129 |
| Componente principal | 7,290 (97.9%) |
| Grado promedio | 11.28 |
| Grado máximo | 52 |

### 5.3 Hallazgos clave
- **Nodo más central:** Br. San Benito (Ciudad Bolívar) — cuello de botella de la red
- **Zona más peligrosa:** Fontibón (KR 123) — 13 fallecidos, score 2.99
- **Parque automotor:** 2.7M vehículos, motos son el vehículo #1 en accidentes
- **Accidentes 2024:** 50,000 (96.5% con heridos, 3.5% con muertos)

---

## 6. Despliegue

### 6.1 Arquitectura de despliegue
```
PostgreSQL + PostGIS  ←→  FastAPI Backend  ←→  Streamlit Frontend
     (datos)              (API + GNN + Agent)    (UI tipo Waze)
```

### 6.2 Componentes
| Componente | Tecnología | Estado |
|-----------|-----------|--------|
| Base de datos | PostgreSQL 16 + PostGIS 3.4 (Docker) | ✅ |
| Backend API | FastAPI (SOLID architecture) | ✅ |
| Modelo GNN | PyTorch Geometric (GAT) | ✅ |
| Agente IA | OpenAI/Ollama + Graph RAG (6 tools) | ✅ |
| Frontend | Streamlit + Folium (mapa tipo Waze) | ✅ |

### 6.3 Endpoints API
| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/v1/graph/metrics` | GET | Estadísticas del grafo |
| `/api/v1/graph/nodes` | GET | Listar nodos por tipo |
| `/api/v1/graph/nearby` | GET | Paraderos cercanos (PostGIS) |
| `/api/v1/graph/path` | GET | Ruta más corta |
| `/api/v1/graph/top/{metric}` | GET | Top nodos por métrica |
| `/api/v1/graph/siniestralidad/top` | GET | Zonas peligrosas |
| `/api/v1/graph/accessibility/worst` | GET | Zonas mal conectadas |
| `/api/v1/agent/chat` | POST | Chat con agente IA |

### 6.4 Cómo ejecutar
```bash
# Base de datos
docker compose up -d

# Backend
cd backend && pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd frontend && pip install -r requirements.txt
streamlit run app.py
```

---

## 7. Monitoreo y Mantenimiento

### 7.1 Actualización de datos
- Datos de infraestructura (estaciones, paraderos): actualizar trimestralmente desde GIS Transmilenio
- Siniestralidad: actualizar anualmente cuando se publiquen nuevos anuarios
- Demanda: buscar fuentes actualizadas post-pandemia

### 7.2 Reentrenamiento del modelo
- Reentrenar GNN cuando se actualice el grafo (nuevas estaciones/rutas)
- Monitorear RMSE en producción

### 7.3 Escalabilidad
- PostGIS soporta millones de puntos con índices GIST
- Arquitectura SOLID permite cambiar backend sin modificar lógica
- Agente soporta OpenAI (cloud) y Ollama (local)

---

## Repositorio
- **GitHub:** https://github.com/itspipedev/GrafoMov
- **Datos:** datos.gov.co, GIS Transmilenio, ArcGIS Hub SDM
- **Licencia:** MIT
