"""
=========================================================
File : body_generation_service.py

Folder :
backend/services/

Purpose
-------
Acts as the bridge between Flask and the
complete AI Tailor Body Generation Pipeline.

Pipeline
--------

Flask
    ↓
BodyGenerationService
    ↓
BodyMeshGenerator
    ↓
TextureService
    ↓
TextureLoader
    ↓
MaterialGenerator
    ↓
TextureMapper
    ↓
Textured OBJ

Project :
AI Tailor System
=========================================================
"""

import os

from backend.body_prediction.smpl.body_mesh_generator import (
    BodyMeshGenerator
)

from backend.services.texture_service import (
    TextureService
)


class BodyGenerationService:
    """
    Generates a personalized textured human body.
    """

    def __init__(self):

        print("\n================================")
        print(" BODY GENERATION SERVICE START ")
        print("================================\n")

        # ----------------------------------
        # Project Root
        # ----------------------------------

        self.project_root = os.getcwd()

        # ----------------------------------
        # Model Directory
        # ----------------------------------

        self.model_directory = os.path.join(
            self.project_root,
            "backend",
            "body_prediction",
            "models"
        )

        print("Loading Models From:")
        print(self.model_directory)

        # ----------------------------------
        # Initialize Body Mesh Generator
        # ----------------------------------

        self.generator = BodyMeshGenerator(
            model_directory=self.model_directory
        )

        # ----------------------------------
        # Initialize Texture Service
        # ----------------------------------

        self.texture_service = TextureService()

        print("\nBody Generation Service Ready.\n")

    # =====================================================
    # Generate Personalized Body
    # =====================================================

    def generate_body(
        self,
        measurements,
        texture_name="default_skin"
    ):
        """
        Parameters
        ----------
        measurements : dict
            User body measurements.

        texture_name : str
            Name of the selected texture.

        Returns
        -------
        str
            Path of final textured OBJ.
        """

        print("\n================================")
        print(" GENERATING PERSONALIZED BODY ")
        print("================================\n")

        print("Measurements:")
        print(measurements)

        # ----------------------------------
        # Step 1 : Generate Body Mesh
        # ----------------------------------

        obj_file = self.generator.generate(
            measurements
        )

        print("\nBody Mesh Generated Successfully")
        print("OBJ :", obj_file)

        # ----------------------------------
        # Step 2 : Apply Texture
        # ----------------------------------
        # textured_obj = os.path.join(
        #     self.project_root,
        #     "static",
        #     "generated",
        #     "personalized_body.obj")

        textured_obj = self.texture_service.apply_texture(
           obj_file=obj_file,
        #    textured_obj = textured_obj,
           texture_name=texture_name
        )

        print("\nTexture Applied Successfully")
        print("Final OBJ :", textured_obj)

        # ----------------------------------
        # Return Final Mesh
        # ----------------------------------

        return textured_obj