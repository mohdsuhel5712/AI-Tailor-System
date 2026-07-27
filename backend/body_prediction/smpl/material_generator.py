"""
=========================================================
File : material_generator.py

Folder :
backend/body_prediction/smpl/

Purpose
-------
Generate a Material (.mtl) file for the OBJ mesh.
=========================================================
"""

import os


class MaterialGenerator:

    def __init__(self):

        self.output_folder = os.path.join(
            "backend",
            "body_prediction",
            "output"
        )

        os.makedirs(
            self.output_folder,
            exist_ok=True
        )

    def generate(
        self,
        texture_file
    ):

        material_file = os.path.join(
            self.output_folder,
            "human_body.mtl"
        )

        with open(material_file, "w") as file:

            file.write("newmtl body_material\n")
            file.write("Ka 1.0 1.0 1.0\n")
            file.write("Kd 1.0 1.0 1.0\n")
            file.write("Ks 0.3 0.3 0.3\n")
            file.write("Ns 10\n")
            file.write("illum 2\n")
            file.write(f"map_Kd {texture_file}\n")

        print("Material Generated :", material_file)

        return material_file