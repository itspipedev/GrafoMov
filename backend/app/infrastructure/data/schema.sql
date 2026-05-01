-- GrafoMov — PostGIS Schema
CREATE EXTENSION IF NOT EXISTS postgis;

-- Nodos: estaciones, paraderos, conexiones
CREATE TABLE nodes (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    node_type VARCHAR(50) NOT NULL,  -- estacion_tm, paradero_sitp, conexion_troncal
    geom GEOMETRY(Point, 4326) NOT NULL,
    properties JSONB DEFAULT '{}'
);

CREATE INDEX idx_nodes_type ON nodes(node_type);
CREATE INDEX idx_nodes_geom ON nodes USING GIST(geom);

-- Aristas: rutas, secuencias
CREATE TABLE edges (
    id SERIAL PRIMARY KEY,
    source_id VARCHAR(100) NOT NULL REFERENCES nodes(id),
    target_id VARCHAR(100) NOT NULL REFERENCES nodes(id),
    edge_type VARCHAR(50) NOT NULL,  -- ruta_troncal, secuencia_ruta, ruta_zonal
    properties JSONB DEFAULT '{}'
);

CREATE INDEX idx_edges_source ON edges(source_id);
CREATE INDEX idx_edges_target ON edges(target_id);
CREATE INDEX idx_edges_type ON edges(edge_type);

-- Métricas globales del grafo
CREATE TABLE graph_metadata (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT NOT NULL
);
