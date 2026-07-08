from flask import Blueprint
from flask import request
from flask import render_template

from backend.body_prediction.predictor import predict


body_prediction_bp = Blueprint(
    "body_prediction",
    __name__
)


@body_prediction_bp.route(
    "/predict-body",
    methods=["POST"]
)
def predict_body():

    gender = 1

    if request.form["gender"] == "Female":
        gender = 0


    body_shape = 0

    if request.form["body_shape"] == "Slim":
        body_shape = 0

    elif request.form["body_shape"] == "Regular":
        body_shape = 1

    elif request.form["body_shape"] == "Athletic":
        body_shape = 2

    elif request.form["body_shape"] == "Broad":
        body_shape = 3


    features = [

        float(request.form["height"]),
        float(request.form["weight"]),
        float(request.form["age"]),
        gender,
        body_shape,
        float(request.form["arm_length"]),
        float(request.form["leg_length"]),
        float(request.form["neck"])

    ]


    prediction = predict(features)


    return render_template(
        "prediction_result.html",
        prediction=prediction
    )