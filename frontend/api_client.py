"""API client — Consumes GrafoMov backend."""
import requests

BASE_URL = "http://localhost:8000/api/v1"


def get_metrics():
    return requests.get(f"{BASE_URL}/graph/metrics").json()


def get_nodes(node_type=None, limit=100):
    params = {"limit": limit}
    if node_type:
        params["node_type"] = node_type
    return requests.get(f"{BASE_URL}/graph/nodes", params=params).json()


def get_nearby(lat, lon, radius_km=0.5, limit=10):
    return requests.get(f"{BASE_URL}/graph/nearby", params={
        "lat": lat, "lon": lon, "radius_km": radius_km, "limit": limit
    }).json()


def get_path(origin, destination):
    return requests.get(f"{BASE_URL}/graph/path", params={
        "origin": origin, "destination": destination
    }).json()


def get_top(metric, limit=10):
    return requests.get(f"{BASE_URL}/graph/top/{metric}", params={"limit": limit}).json()


def get_siniestralidad(limit=20):
    return requests.get(f"{BASE_URL}/graph/siniestralidad/top", params={"limit": limit}).json()


def get_worst_accessibility(limit=20):
    return requests.get(f"{BASE_URL}/graph/accessibility/worst", params={"limit": limit}).json()
