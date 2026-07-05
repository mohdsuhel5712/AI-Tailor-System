'''STEP 5 — Create Save API'''
'''FASH_SHOP/backend/api/measurement_api.py'''

from flask import Blueprint
from flask import request
from flask import jsonify
from flask import redirect
from flask import flash

from backend.services.measurement_service import (
    save_measurements,
    get_measurement
)

from backend.validators.measurement_validator import (
    validate_measurements
)

api_bp = Blueprint(
    "measurements",
    __name__
)


@api_bp.route("/api/measurements",methods=['POST']
)
def create_measurement():

    try:

        data = {

            'height':
                int(
                    request.form['height']
                ),

            'chest':
                int(
                    request.form['chest']
                ),

            'waist':
                int(
                    request.form['waist']
                ),

            'hip':
                int(
                    request.form['hip']
                ),

            'shoulder':
                int(
                    request.form['shoulder']
                ),

            'arm_length':
                int(
                    request.form['arm_length']
                ),

            'leg_length':
                int(
                    request.form['leg_length']
                ),

            'gender':
                request.form['gender'],

            'body_shape':
                request.form['body_shape'],

            'mesh_file':
                request.form['mesh_file']
        }

        validate_measurements(
            data
        )

        save_measurements(
            data
        )
        
        flash("Measurements saved successfully!")
        return redirect('/measurement')

      #   return jsonify(
      #       {
      #           "success": True,
      #           "message":
      #           "Measurements saved successfully"
      #       }
      #   )

    except Exception as e:

        return jsonify(
            {
                "success": False,
                "error": str(e)
            }
        )


@api_bp.route("/api/measurements",methods=['GET']
)
def fetch():

    return jsonify(
        get_measurement()
    )