"""
=========================================================
File : body_prediction_api.py

Purpose
-------
Receives measurement data,
predicts body measurements,
generates the mesh,
and opens the body viewer.

=========================================================
"""

from flask import Blueprint
from flask import request
from flask import render_template

from backend.body_prediction.predictor import Predictor
from backend.services.body_generation_service import BodyGenerationService


# -----------------------------------------
# Blueprint
# -----------------------------------------

body_prediction_bp = Blueprint(
    "body_prediction",
    __name__
)

# -----------------------------------------
# Services
# -----------------------------------------

predictor = Predictor()
body_services = BodyGenerationService()

# -----------------------------------------
# Prediction Route
# -----------------------------------------

@body_prediction_bp.route("/predict-body", methods=["POST"])
def predict_body():

    print("\n========== REQUEST RECEIVED ==========")
    print("Method :", request.method)
    print("Form :", request.form.to_dict())
    print("======================================")

    # -----------------------------------------
    # Read Form Data
    # -----------------------------------------

    measurements = {
        "height": float(request.form["height"]),
        "weight": float(request.form["weight"]),
        "age": int(request.form["age"]),
        "category": request.form["category"],
        "body_shape": request.form["body_shape"]
    }

    # -----------------------------------------
    # Prediction
    # -----------------------------------------

    prediction = predictor.predict(measurements)

    print("\nPrediction :", prediction)

    prediction_result = {

        "height": round(float(prediction[0]), 2),
        "weight": round(float(prediction[1]), 2),
        "age": round(float(prediction[2]), 2),
        "category": round(float(prediction[3]), 2),
        "body_shape": round(float(prediction[4]), 2),
        "mesh_file": round(float(prediction[5]), 2),
        "neck": round(float(prediction[6]), 2),
        "chest": round(float(prediction[7]), 2),
        "waist": round(float(prediction[8]), 2),
        "hip": round(float(prediction[9]), 2),
        "shoulder": round(float(prediction[10]), 2),
        "arm_length":round(float(prediction[11]),2),
        "leg_length":round(float(prediction[12]),2)
    }

    # -----------------------------------------
    # Generate Mesh
    # -----------------------------------------

    mesh_file = body_services.generate_body(measurements)

    print("\nGenerated Mesh :", mesh_file)

    # -----------------------------------------
    # Open Viewer
    # -----------------------------------------

    return render_template(

        "body_viewer.html",

        prediction=prediction_result,

        mesh_file=mesh_file,

        measurements=measurements

    )