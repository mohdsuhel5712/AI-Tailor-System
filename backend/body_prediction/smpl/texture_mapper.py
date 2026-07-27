"""
=========================================================
File : texture_mapper.py

Folder :
backend/body_prediction/smpl/
=========================================================
"""

import os
import shutil


class TextureMapper:

    def apply_texture(
        self,
        obj_file,
        textured_obj,
        material_file
    ):

        if not os.path.exists(obj_file):
            raise FileNotFoundError(obj_file)

        if not os.path.exists(material_file):
            raise FileNotFoundError(material_file)

        output_folder = os.path.dirname(obj_file)

        textured_obj = os.path.join(
            output_folder,
            "textured_body.obj"
        )

        shutil.copy(obj_file, textured_obj)

        with open(textured_obj, "r") as f:
            lines = f.readlines()

        lines = [
            line for line in lines
            if not line.startswith("mtllib")
            and not line.startswith("usemtl")
        ]

        lines.insert(
            0,
            f"mtllib {os.path.basename(material_file)}\n"
        )

        lines.insert(
            1,
            "usemtl body_material\n"
        )

        with open(textured_obj, "w") as f:
            f.writelines(lines)

        print("Texture Mapping Completed")

        return textured_obj