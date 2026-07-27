"""
=========================================================
File : train_model.py

Purpose
-------
Loads the dataset,
preprocesses the data,
trains the neural network,
and saves the trained model.

Project : AI Tailor System
=========================================================
"""

import os
import torch
import torch.nn as nn

from backend.body_prediction.dataset_loader import load_dataset
from backend.body_prediction.preprocess import preprocess
from backend.body_prediction.body_prediction_model import BodyPrecitor


# =====================================================
# Load Dataset
# =====================================================

print("\n========== LOADING DATASET ==========\n")

X, y = load_dataset()

print("Dataset Loaded Successfully.")
print("Number of Samples :", len(X))
print()

# =====================================================
# Preprocess Dataset
# =====================================================

X, y = preprocess(X, y)

# =====================================================
# Convert to Tensor
# =====================================================

X = torch.tensor(
    X,
    dtype=torch.float32
)

y = torch.tensor(
    y,
    dtype=torch.float32
)

print("Tensor Conversion Complete.\n")

# =====================================================
# Build Neural Network
# =====================================================

model = BodyPrecitor()

print(model)

# =====================================================
# Loss Function
# =====================================================

criterion = nn.MSELoss()

# =====================================================
# Optimizer
# =====================================================

optimizer = torch.optim.Adam(

    model.parameters(),

    lr=0.001

)

# =====================================================
# Training Settings
# =====================================================

EPOCHS = 300

print("\n========== TRAINING STARTED ==========\n")

# =====================================================
# Training Loop
# =====================================================

for epoch in range(EPOCHS):

    prediction = model(X)

    loss = criterion(
        prediction,
        y
    )

    optimizer.zero_grad()

    loss.backward()

    optimizer.step()

    if (epoch + 1) % 10 == 0:

        print(

            f"Epoch {epoch + 1:03d} | Loss = {loss.item():.6f}"

        )

# =====================================================
# Save Model
# =====================================================

MODEL_DIR = os.path.join(
    "backend",
    "models"
)

os.makedirs(
    MODEL_DIR,
    exist_ok=True
)

MODEL_PATH = os.path.join(
    MODEL_DIR,
    "body_predictor.pth"
)

torch.save(

    model.state_dict(),

    MODEL_PATH

)

print("\n======================================")
print("Training Completed Successfully.")
print("Model Saved Successfully.")
print(MODEL_PATH)
print("======================================")