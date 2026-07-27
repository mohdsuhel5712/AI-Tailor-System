"""
=========================================================
File : texture_service.py

Folder :
backend/services/

Purpose
-------
Handles the complete texture generation pipeline.

Pipeline
--------

Flask
    ↓
TextureService
    ↓
TextureLoader
    ↓
MaterialGenerator
    ↓
TextureMapper
    ↓
Textured OBJ Mesh

Project :
AI Tailor System
=========================================================
"""

import os

from backend.body_prediction.smpl.texture_loader import TextureLoader
from backend.body_prediction.smpl.material_generator import MaterialGenerator
from backend.body_prediction.smpl.texture_mapper import TextureMapper


class TextureService:
    """
    Handles the complete texture pipeline.
    """

    def __init__(self):

        print("\n================================")
        print(" TEXTURE SERVICE INITIALIZED ")
        print("================================\n")

        # ----------------------------------
        # Project Root
        # ----------------------------------

        self.project_root = os.getcwd()

        # ----------------------------------
        # Output Folder
        # ----------------------------------

        self.output_folder = os.path.join(
            self.project_root,
            "static",
            "generated"
        )

        os.makedirs(
            self.output_folder,
            exist_ok=True
        )

        # ----------------------------------
        # Initialize Components
        # ----------------------------------

        self.texture_loader = TextureLoader()

        self.material_generator = MaterialGenerator()

        self.texture_mapper = TextureMapper()

        print("Texture Service Ready.\n")

    # =====================================================
    # Apply Texture Pipeline
    # =====================================================

    def apply_texture(
        self,
        obj_file,
        texture_name="default_skin"
    ):
        """
        Apply texture and material to the generated OBJ.

        Parameters
        ----------
        obj_file : str
            Path of generated OBJ mesh.

        texture_name : str
            Selected texture name.

        Returns
        -------
        str
            Path of textured OBJ.
        """

        print("\n================================")
        print(" APPLYING TEXTURE ")
        print("================================\n")

        # ----------------------------------
        # Check OBJ File
        # ----------------------------------

        if not os.path.exists(obj_file):
            raise FileNotFoundError(
                f"OBJ File not found: {obj_file}"
            )

        # ----------------------------------
        # Load Texture
        # ----------------------------------

        texture_file = self.texture_loader.load_texture(
            texture_name
        )

        print("Texture Loaded:")
        print(texture_file)

        # ----------------------------------
        # Generate Material File
        # ----------------------------------

        material_file = self.material_generator.generate(
            texture_file
        )

        print("Material Generated:")
        print(material_file)

        # ----------------------------------
        # Output OBJ
        # ----------------------------------

        textured_obj = os.path.join(
            self.output_folder,
            "personalized_body.obj"
        )

        # ----------------------------------
        # Apply Material to OBJ
        # ----------------------------------

        textured_obj = self.texture_mapper.apply_texture(
            obj_file=obj_file,
            textured_obj=textured_obj,
            material_file=material_file
        )

        print("\n================================")
        print(" TEXTURE APPLIED SUCCESSFULLY ")
        print("================================")

        print("Textured OBJ :", textured_obj)
        print("Material File:", material_file)

        return textured_obj