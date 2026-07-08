# ==========================================
# Body Prediction Inference Module
# ==========================================

import torch
import joblib
import numpy as np

from backend.body_prediction.body_prediction_model import BodyPrecitor


# ==========================================
# Load trained model
# ==========================================

model = BodyPrecitor()

model.load_state_dict(
    torch.load(
        "backend/models/body_predictor.pth",
        map_location=torch.device("cpu")
    )
)

model.eval()


# ==========================================
# Load scalers
# ==========================================

x_scaler = joblib.load(
    "backend/models/x_scaler.pkl"
)

y_scaler = joblib.load(
    "backend/models/y_scaler.pkl"
)


# ==========================================
# Prediction Function
# ==========================================

def predict(features):
    """
    INPUT:
    [
        height,
        weight,
        age,
        gender,
        body_shape,
        arm_length,
        leg_length,
        neck
    ]

    OUTPUT:
    {
        chest,
        waist,
        hip,
        shoulder
    }
    """

    # convert to numpy
    features = np.array(
        [features],
        dtype=np.float32
    )

    # apply input scaling
    features = x_scaler.transform(
        features
    )

    # convert to tensor
    features = torch.tensor(
        features,
        dtype=torch.float32
    )

    # inference mode
    with torch.no_grad():

        prediction = model(
            features
        )

        prediction = prediction.numpy()

        # inverse scaling
        prediction = y_scaler.inverse_transform(
            prediction
        )

    return {

        "chest":
            round(
                float(prediction[0][0]),
                2
            ),

        "waist":
            round(
                float(prediction[0][1]),
                2
            ),

        "hip":
            round(
                float(prediction[0][2]),
                2
            ),

        "shoulder":
            round(
                float(prediction[0][3]),
                2
            )
    }