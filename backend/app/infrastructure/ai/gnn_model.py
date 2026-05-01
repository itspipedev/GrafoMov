"""GNN Model — Graph Attention Network for node importance prediction."""
import torch
import torch.nn.functional as F
from torch_geometric.nn import GATConv


class GrafoMovGAT(torch.nn.Module):
    """Graph Attention Network for predicting node importance/demand."""

    def __init__(self, in_channels: int, hidden_channels: int = 32, heads: int = 4):
        super().__init__()
        self.conv1 = GATConv(in_channels, hidden_channels, heads=heads, dropout=0.3)
        self.conv2 = GATConv(hidden_channels * heads, hidden_channels, heads=1, dropout=0.3)
        self.linear = torch.nn.Linear(hidden_channels, 1)

    def forward(self, x, edge_index):
        x = F.elu(self.conv1(x, edge_index))
        x = F.dropout(x, p=0.3, training=self.training)
        x = F.elu(self.conv2(x, edge_index))
        x = self.linear(x)
        return x.squeeze(-1)
