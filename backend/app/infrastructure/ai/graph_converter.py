"""Convert NetworkX graph to PyTorch Geometric Data object."""
import torch
import networkx as nx
from torch_geometric.data import Data
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent.parent.parent.parent


def nx_to_pyg(graphml_path: str = None) -> Data:
    """Convert enriched GraphML to PyG Data with node features and edge index."""
    if graphml_path is None:
        graphml_path = str(BASE / "data" / "graphs" / "grafo_movilidad_bogota_enriched.graphml")

    G = nx.read_graphml(graphml_path)
    UG = G.to_undirected()

    # Map node IDs to indices
    node_list = list(UG.nodes())
    node_to_idx = {n: i for i, n in enumerate(node_list)}

    # Node features: [lat, lon, grado, betweenness, closeness, siniestralidad_score, fallecidos, is_tm]
    features = []
    for n in node_list:
        d = UG.nodes[n]
        features.append([
            float(d.get("lat", 0)),
            float(d.get("lon", 0)),
            float(d.get("grado", 0)),
            float(d.get("betweenness", 0)),
            float(d.get("closeness", 0)),
            float(d.get("siniestralidad_score", 0)),
            float(d.get("fallecidos_cercanos", 0)),
            1.0 if d.get("tipo") == "estacion_tm" else 0.0,
        ])

    x = torch.tensor(features, dtype=torch.float)

    # Edge index
    src, tgt = [], []
    for u, v in UG.edges():
        src.append(node_to_idx[u])
        tgt.append(node_to_idx[v])
    edge_index = torch.tensor([src, tgt], dtype=torch.long)

    # Target: grado (node degree) — para predicción de demanda/importancia
    y = torch.tensor([float(UG.degree(n)) for n in node_list], dtype=torch.float)

    data = Data(x=x, edge_index=edge_index, y=y)
    data.node_ids = node_list
    data.num_features = x.shape[1]

    print(f"✅ PyG Data: {data.num_nodes} nodes, {data.num_edges} edges, {data.num_features} features")
    return data


if __name__ == "__main__":
    data = nx_to_pyg()
    print(f"   x shape: {data.x.shape}")
    print(f"   edge_index shape: {data.edge_index.shape}")
    print(f"   y shape: {data.y.shape}")
    print(f"   Feature names: [lat, lon, grado, betweenness, closeness, siniestralidad, fallecidos, is_tm]")

    # Save
    out = BASE / "data" / "graphs" / "pyg_data.pt"
    torch.save(data, out)
    print(f"💾 Saved: {out}")
