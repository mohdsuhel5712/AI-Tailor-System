from sklearn.preprocessing import StandardScaler
from pathlib import Path
import joblib


def preprocess(X, y):

    x_scaler = StandardScaler()
    y_scaler = StandardScaler()

    X = x_scaler.fit_transform(X)
    y = y_scaler.fit_transform(y)

    # backend folder ka absolute path
    BASE_DIR = Path(__file__).resolve().parent.parent

    # models folder
    MODEL_DIR = BASE_DIR / "models"

    # agar folder nahi hai to create kar do
    MODEL_DIR.mkdir(exist_ok=True)

    joblib.dump(
        x_scaler,
        MODEL_DIR / "x_scaler.pkl"
    )

    joblib.dump(
        y_scaler,
        MODEL_DIR / "y_scaler.pkl"
    )

    return X, y