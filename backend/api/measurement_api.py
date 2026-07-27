"""
=========================================================
File : measurement_api.py

Folder :
backend/api/

Purpose
-------
1. Receive measurements from HTML
2. Validate measurements
3. Save into PostgreSQL
4. Predict remaining measurements
5. Generate personalized body mesh
6. Open body viewer

Project : AI Tailor System
=========================================================
"""

from flask import Blueprint
from flask import request
from flask import render_template

from backend.validators.measurement_validator import validate_measurements

from backend.services.measurement_service import save_measurements
from backend.services.body_generation_service import BodyGenerationService
from backend.body_prediction.smpl.smpl_model import SMPLModel
 

# -----------------------------------------------------
# Blueprint
# -----------------------------------------------------

api_bp = Blueprint(
    "measurement_bp",
    __name__
)

# -----------------------------------------------------
# Initialize Body Generation Service
# -----------------------------------------------------

body_service = BodyGenerationService()


# -----------------------------------------------------
# Save Measurement Route
# -----------------------------------------------------

@api_bp.route("/save-measurements", methods=["POST"])
def save_measurement():

    print("\n========== STEP 1 ==========")
    print("measurement_api.py reached")
    print("============================")

    # -----------------------------------------
    # Read Form Data
    # -----------------------------------------

    data = {

        "height": float(request.form["height"]),
        "weight": float(request.form["weight"]),
        "age": int(request.form["age"]),
        "category": request.form["category"],
        "body_shape": request.form["body_shape"],
        "mesh_file": request.form["mesh_file"]
    }
    # model = smpl_model.load_model(gender)

    print("\nReceived Measurements")
    print(data)

    # -----------------------------------------
    # Validate
    # -----------------------------------------

    validate_measurements(data)

    # -----------------------------------------
    # Save + AI Prediction
    # -----------------------------------------

    prediction = save_measurements(data)

    print("\nPrediction Returned")
    print(prediction)

    # -----------------------------------------
    # Merge Original + Predicted Measurements
    # -----------------------------------------

    complete_measurements = {

        **data,

        **prediction

    }

    print("\n========== COMPLETE BODY ==========")

    for key, value in complete_measurements.items():

        print(f"{key:15} : {value}")

    print("===================================\n")

    # -----------------------------------------
    # Generate Personalized Mesh
    # -----------------------------------------

    obj_file = body_service.generate_body(
        complete_measurements
    )

    print("\nGenerated OBJ :", obj_file)

    # -----------------------------------------
    # Open Viewer
    # -----------------------------------------

    return render_template(

        "body_viewer.html",

        mesh_file=obj_file,

        prediction=prediction,

        measurements=complete_measurements

    )