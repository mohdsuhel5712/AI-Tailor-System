import torch
import torch.nn as nn

from backend.body_prediction.dataset_loader import load_dataset
from backend.body_prediction.preprocess import preprocess
from backend.body_prediction.body_prediction_model import BodyPrecitor


X,y = load_dataset()

X,y = preprocess(X,y)

X = torch.tensor(
    X,
    dtype=torch.float32
)

y = torch.tensor(
    y,
    dtype=torch.float32
)

model = BodyPrecitor()

criterion = nn.MSELoss()

optimizer = torch.optim.Adam(
    model.parameters(),
    lr=0.001
)

epochs = 200

for epoch in range(epochs):

    prediction = model(X)

    loss = criterion(
        prediction,
        y
    )

    optimizer.zero_grad()

    loss.backward()

    optimizer.step()

    if epoch%10==0:

        print(
            f"Epoch {epoch} Loss {loss.item()}"
        )

torch.save(
    model.state_dict(),
    "backend/models/body_predictor.pth"
)