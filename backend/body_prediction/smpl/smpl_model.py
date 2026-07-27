# """
# smpl_model.py

# Loads the official SMPL model.
# """

# import os
# import smplx

# class SMPLModel:
#       def __init__(self,model_directory):
#             self.model_directory = model_directory
            
            
#       def load(self,gender='neutral'):
            
#             model = smplx.create(
#                   model_path=self.model_directory,
#                   model_type='smpl',
#                   gender=gender,
#                   create_global_orient=True,
#                   create_body_pose = True,
#                   create_betas= True,
#                   create_transl= True
#             )
            
#             return model
      

"""
===========================================================
File : smpl_model.py

Purpose
-------
Load the official SMPL model.

Author
------
AI Tailor System
===========================================================
"""

import os
import smplx

# this is the model used by the SMPL model loading
class SMPLModel:

    def __init__(self, model_directory):
        # here i am defining path (absolute apth)
        self.model_directory = os.path.abspath(model_directory)
        # kon kon si files  / (diff .pkl file )
        self.supported_gender = [
            "male",
            "female",
            "neutral"
        ]

    # ---------------------------------------
    # Validate Gender
    # ---------------------------------------

    def validate_gender(self, gender):

        gender = gender.lower()

        if gender not in self.supported_gender:
            # here i learn how to raise error in python = (raise ValueError('pass message '))
            raise ValueError(f"Unsupported gender: {gender}")

        return gender

    # ---------------------------------------
    # Load Model
    # ---------------------------------------
    # here after constructor (definening variable and their values )
    # after gender valiadator= (i am on main part)
    # load actual smpl dataste (.PKL)
    def load_model(self, gender="male"):
        

        gender = self.validate_gender(gender)

        print("\n========== DEBUG ==========")
        print("Model Directory :", self.model_directory)
        print("Gender :", gender)
        print("===========================\n")

        smpl_folder = os.path.join(self.model_directory, "smpl")

        if os.path.isdir(smpl_folder):
            model_path = smpl_folder
        else:
            model_path = self.model_directory

        print("model_path =", model_path)
        print("isdir =", os.path.isdir(model_path))
        print("exists =", os.path.exists(model_path))


        #function that create SMPL mesh file PTH 
        model = smplx.create(
            model_path=self.model_directory,
            model_type="smpl",
            gender=gender,
            use_pca=False,
            create_global_orient=True,
            create_body_pose=True,
            create_betas=True,
            create_transl=True
        )

        print("\n✅ SMPL Model Loaded Successfully\n")

        return model

    # ---------------------------------------
    # Model Info
    # ---------------------------------------

    def model_info(self, model):

        print("\n========== SMPL Information ==========")
        print("Faces :", len(model.faces))
        print("Gender:", model.gender)
        print("======================================")