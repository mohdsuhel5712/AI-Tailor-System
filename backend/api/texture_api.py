"""
=========================================================
File : texture_api.py

Folder :
backend/api/

Purpose
-------
1. Receive texture request from Flask.
2. Call TextureService.
3. Apply texture on generated body mesh.
4. Return result.

Project :
AI Tailor System
=========================================================
"""

from flask import Blueprint
from flask import request,render_template
from flask import jsonify

from backend.services.texture_service import TextureService


# -------------------------------------------------
# Blueprint
# -------------------------------------------------

texture_bp = Blueprint(
    "texture",
    __name__
)


# -------------------------------------------------
# Initialize Service
# -------------------------------------------------

texture_service = TextureService()


# -------------------------------------------------
# Apply Texture
# -------------------------------------------------

@texture_bp.route(
    "/apply-texture",
    methods=["POST"]
)
def apply_texture():

    try:

        # ----------------------------------
        # Receive Data
        # ----------------------------------

        data = request.get_json()

        obj_file = data.get(
            "obj_file"
        )

        texture_name = data.get(
            "texture_name",
            "default_skin"
        )

        # ----------------------------------
        # Apply Texture
        # ----------------------------------

        result = texture_service.apply_texture(
            obj_file=obj_file,
            texture_name=texture_name
        )

        # ----------------------------------
        # Return Success
        # ----------------------------------

        return render_template("body_viewer.html",obj_file="generated/personalized_body.obj")


    except Exception as error:

        return jsonify({

            "status": "error",

            "message": str(error)

        }), 500