"""
=========================================================
File : texture_loader.py

Folder :
backend/body_prediction/smpl/

Purpose
-------
1. Load texture files from textures/skin/.
2. Verify the requested texture exists.
3. Return the texture file path.

Project
-------
AI Tailor System
=========================================================
"""

import os


class TextureLoader:
    """
    Loads skin texture images.
    """

    def __init__(self):

        # Skin texture folder
        self.texture_folder = os.path.join(
            "backend",
            "body_prediction",
            "smpl",
            "textures",
            "default"
        )

    # -------------------------------------------------
    # Load Texture
    # -------------------------------------------------

    def load_texture(self, texture_name):
        """
        Load the selected skin texture.

        Parameters
        ----------
        texture_name : str

        Returns
        -------
        str
            Full path of the texture image.
        """

        texture_path = os.path.join(
            self.texture_folder,
            texture_name + ".jpg"
        )

        if not os.path.exists(texture_path):
            raise FileNotFoundError(
                f"Texture '{texture_name}' not found."
            )

        print(f"Texture Loaded : {texture_path}")

        return texture_path