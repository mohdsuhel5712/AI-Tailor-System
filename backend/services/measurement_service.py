"""
=========================================================
File : measurement_service.py

Purpose
-------
1. Save user measurements
2. Predict remaining body measurements
3. Return prediction

Project : AI Tailor System
=========================================================
"""

from backend.database.connection import get_db_connection
from backend.body_prediction.predictor import Predictor


# -----------------------------------------
# Load Predictor Only Once
# -----------------------------------------

predictor = Predictor()


# =====================================================
# Save Measurements
# =====================================================

def save_measurements(data):

    print("\n========== MEASUREMENT SERVICE ==========")
    print(data)

    # -----------------------------------------
    # Save into Database
    # -----------------------------------------

    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
        INSERT INTO user_measurements
        (
            height,
            weight,
            age,
            gender,
            body_shape,
            mesh_file
        )

        VALUES
        (
            %s,%s,%s,%s,%s,%s
        )
    """

    cursor.execute(

        query,

        (
            data["height"],
            data["weight"],
            data["age"],
            data["category"],
            data["body_shape"],
            data["mesh_file"]
        )

    )

    conn.commit()

    cursor.close()
    conn.close()

    print("Measurements Saved Successfully.")

    # -----------------------------------------
    # AI Prediction
    # -----------------------------------------

    prediction = predictor.predict(data)

    print("\n========== AI Prediction ==========")

    for key, value in prediction.items():

        print(f"{key:12} : {value}")

    print("===================================\n")

    # -----------------------------------------
    # Return Prediction
    # -----------------------------------------

    return prediction


# =====================================================
# Get All Measurements
# =====================================================

def get_measurement():

    conn = get_db_connection()

    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM user_measurements"
    )

    data = cursor.fetchall()

    cursor.close()
    conn.close()

    return data