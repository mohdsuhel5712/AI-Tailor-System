"""
=========================================================
File : dataset_loader.py

Purpose
-------
Loads the body dataset and separates the
input features from the target measurements.

Project : AI Tailor System
=========================================================
"""

import pandas as pd


def load_dataset():

    # -----------------------------------------
    # Load Dataset
    # -----------------------------------------

    df = pd.read_csv(
        "backend/dataset/body_dataset.csv"
    )

    # -----------------------------------------
    # Input Features
    # -----------------------------------------

    X = df[
        [
            "height",
            "weight",
            "age",
            "gender",
            "body_shape"
        ]
    ]

    # -----------------------------------------
    # Target Measurements
    # -----------------------------------------

    y = df[
        [
            "neck",
            "chest",
            "waist",
            "hip",
            "shoulder",
            "arm_length",
            "leg_length"
        ]
    ]

    return X, y