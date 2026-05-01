"""Train GNN model on mobility graph."""
import torch
from pathlib import Path

from app.infrastructure.ai.graph_converter import nx_to_pyg
from app.infrastructure.ai.gnn_model import GrafoMovGAT

BASE = Path(__file__).resolve().parent.parent.parent.parent.parent
MODELS_DIR = BASE / "models"


def train():
    # Load data
    data = nx_to_pyg()

    # Normalize features
    mean = data.x.mean(dim=0)
    std = data.x.std(dim=0)
    std[std == 0] = 1  # avoid division by zero
    data.x = (data.x - mean) / std

    # Normalize target (log scale for degree)
    data.y = torch.log1p(data.y)

    # Train/val/test split (70/15/15)
    n = data.num_nodes
    perm = torch.randperm(n)
    train_mask = torch.zeros(n, dtype=torch.bool)
    val_mask = torch.zeros(n, dtype=torch.bool)
    test_mask = torch.zeros(n, dtype=torch.bool)
    train_mask[perm[:int(0.7 * n)]] = True
    val_mask[perm[int(0.7 * n):int(0.85 * n)]] = True
    test_mask[perm[int(0.85 * n):]] = True

    # Model
    model = GrafoMovGAT(in_channels=data.num_features)
    optimizer = torch.optim.Adam(model.parameters(), lr=0.005, weight_decay=5e-4)

    # Training loop
    best_val_loss = float("inf")
    patience = 20
    patience_counter = 0

    for epoch in range(1, 201):
        model.train()
        optimizer.zero_grad()
        out = model(data.x, data.edge_index)
        loss = torch.nn.functional.mse_loss(out[train_mask], data.y[train_mask])
        loss.backward()
        optimizer.step()

        # Validation
        model.eval()
        with torch.no_grad():
            val_out = model(data.x, data.edge_index)
            val_loss = torch.nn.functional.mse_loss(val_out[val_mask], data.y[val_mask])

        if epoch % 10 == 0:
            print(f"Epoch {epoch:3d} | Train Loss: {loss:.4f} | Val Loss: {val_loss:.4f}")

        # Early stopping
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            patience_counter = 0
            torch.save(model.state_dict(), MODELS_DIR / "gat_best.pt")
        else:
            patience_counter += 1
            if patience_counter >= patience:
                print(f"Early stopping at epoch {epoch}")
                break

    # Test
    model.load_state_dict(torch.load(MODELS_DIR / "gat_best.pt"))
    model.eval()
    with torch.no_grad():
        test_out = model(data.x, data.edge_index)
        test_loss = torch.nn.functional.mse_loss(test_out[test_mask], data.y[test_mask])
        mae = torch.nn.functional.l1_loss(test_out[test_mask], data.y[test_mask])

    print(f"\n{'='*40}")
    print(f"TEST RESULTS")
    print(f"{'='*40}")
    print(f"  MSE:  {test_loss:.4f}")
    print(f"  MAE:  {mae:.4f}")
    print(f"  RMSE: {test_loss.sqrt():.4f}")

    # Show predictions vs actual for top nodes
    pred = torch.expm1(test_out)  # undo log1p
    actual = torch.expm1(data.y)
    test_indices = test_mask.nonzero().squeeze()[:10]
    print(f"\n  Sample predictions (degree):")
    for idx in test_indices:
        i = idx.item()
        print(f"    {data.node_ids[i][:40]:40s} | actual: {actual[i]:.0f} | pred: {pred[i]:.1f}")

    # Save normalization params
    torch.save({"mean": mean, "std": std}, MODELS_DIR / "norm_params.pt")

    print(f"\n💾 Model saved: models/gat_best.pt")
    print(f"💾 Norm params: models/norm_params.pt")


if __name__ == "__main__":
    train()
