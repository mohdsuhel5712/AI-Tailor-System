import pandas as pd


def load_dataset():

    df = pd.read_csv(
        "backend/dataset/body_dataset.csv"
    )

    X = df[
        [
            "height",
            "weight",
            "age",
            "gender",
            "body_shape",
            "arm_length",
            "leg_length",
            "neck"
        ]
    ]

    y = df[
        [
            "chest",
            "waist",
            "hip",
            "shoulder"
        ]
    ]

    return X,y