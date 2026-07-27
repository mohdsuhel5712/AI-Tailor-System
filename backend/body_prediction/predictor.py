# ==========================================
# Body Prediction Inference Module
# ==========================================

# import os
# import torch
# import joblib
# import numpy as np

# from backend.body_prediction.body_prediction_model import BodyPrecitor


# # ==========================================
# # Load trained model
# # ==========================================

# model = BodyPrecitor()

# model.load_state_dict(
#     torch.load(
#         "backend/models/body_predictor.pth",
#         map_location=torch.device("cpu")
#     )
# )

# model.eval()


# # ==========================================
# # Load scalers
# # ==========================================

# x_scaler = joblib.load(
#     "backend/models/x_scaler.pkl"
# )

# y_scaler = joblib.load(
#     "backend/models/y_scaler.pkl"
# )


# # ==========================================
# # Prediction Function
# # ==========================================

# def predict(features):
#     """
#     INPUT:
#     [
#         height,
#         weight,
#         age,
#         gender,
#         body_shape,
#         arm_length,
#         leg_length,
#         neck
#     ]

#     OUTPUT:
#     {
#         chest,
#         waist,
#         hip,
#         shoulder
#     }
#     """

#     # convert to numpy
#     features = np.array(
#         [features],
#         dtype=np.float32
#     )

#     # apply input scaling
#     features = x_scaler.transform(
#         features
#     )

#     # convert to tensor
#     features = torch.tensor(
#         features,
#         dtype=torch.float32
#     )

#     # inference mode
#     with torch.no_grad():

#         prediction = model(
#             features
#         )

#         prediction = prediction.numpy()

#         # inverse scaling
#         prediction = y_scaler.inverse_transform(
#             prediction
#         )

#     return {

#         "chest":
#             round(
#                 float(prediction[0][0]),
#                 2
#             ),

#         "waist":
#             round(
#                 float(prediction[0][1]),
#                 2
#             ),

#         "hip":
#             round(
#                 float(prediction[0][2]),
#                 2
#             ),

#         "shoulder":
#             round(
#                 float(prediction[0][3]),
#                 2
#             )
#     }


# ''' new predictor.py has beeen created  '''
# import os
# import torch
# import joblib
# import numpy as np

# from backend.body_prediction.body_prediction_model import BodyPrecitor


# class predictor:
#     def __init__(self):
#         self.model = BodyPrecitor()
        
#         model_path = os.path.join(
#             'backend',
#             'models',
#             'body_predictor.pth'
#         )  # here i am using .pth file to predict the human body mesh 
#         self.model.load_state_dict(torch.load(model_path,map_location=torch.device('cpu')))
#         self.model.eval() # evaluation on 
        
#         scaler_path = os.path.join(
#             'backend',
#             'models',
#             'x_scaler.pkl'
#         )
#         self.scaler = joblib.load(scaler_path)
    
    
#     # creation of the predict() = function
#     def predict(self,measurements):
#         features = np.array([[
#             measurements['height'],
#             measurements['weight'],
#             measurements['age'],
#             measurements['neck'],
#             measurements['arm_length'],
#             measurements['leg_length'],
#             1 if measurements['gender'].lower() == 'male' else 0,0
            
#         ]])
        
#         features = self.scaler.transform(features)
#         features = torch.tensor(features,dtype=torch.float32)
        
#         # this sithe part of the model evaluation
#         with torch.no_grad():
#             prediction = self.model(features)
#         return prediction.numpy()[0]
     
    
    
"""
=========================================================
File : predictor.py

Purpose
-------
Loads the trained AI model and predicts
body measurements from basic user inputs.

Inputs
------
height
weight
age
gender
body_shape

Outputs
-------
neck
chest
waist
hip
shoulder
arm_length
leg_length

Project : AI Tailor System
=========================================================
"""

import os
import torch
import joblib
import numpy as np
import pandas as pd 

from backend.body_prediction.body_prediction_model import BodyPrecitor


class Predictor:

    def __init__(self):

        print("\nLoading Trained Body Prediction Model...")

        # -----------------------------------------
        # Load Neural Network
        # -----------------------------------------

        self.model = BodyPrecitor()

        model_path = os.path.join(
            "backend",
            "models",
            "body_predictor.pth"
        )

        self.model.load_state_dict(
            torch.load(
                model_path,
                map_location=torch.device("cpu")
            )
        )

        self.model.eval()

        print("Model Loaded Successfully.")

        # -----------------------------------------
        # Load Input Scaler
        # -----------------------------------------

        self.x_scaler = joblib.load(
            os.path.join(
                "backend",
                "models",
                "x_scaler.pkl"
            )
        )

        print("Input Scaler Loaded.")

        # -----------------------------------------
        # Load Output Scaler
        # -----------------------------------------

        self.y_scaler = joblib.load(
            os.path.join(
                "backend",
                "models",
                "y_scaler.pkl"
            )
        )

        print("Output Scaler Loaded.\n")

    # ===================================================
    # Predict Measurements
    # ===================================================

    def predict(self, measurements):

        gender = (
            1
            if measurements["category"].lower() == "male"
            else 0
        )

        body_shape_map = {
            "Slim": 0,
            "Regular": 1,
            "Athletic": 2,
            "Broad": 3
        }

        body_shape = body_shape_map.get(
            measurements["body_shape"],
            0
        )

        # -----------------------------------------
        # Input Features
        # -----------------------------------------

        # features = np.array([[
        #     measurements["height"],
        #     measurements["weight"],
        #     measurements["age"],
        #     gender,
        #     body_shape
        # ]])


        features = pd.DataFrame(
            [[
        measurements["height"],
        measurements["weight"],
        measurements["age"],
        gender,
        body_shape
        ]],
            columns=[
        "height",
        "weight",
        "age",
        "gender",
        "body_shape"
        ])
        # -----------------------------------------
        # Scale Input
        # -----------------------------------------

        features = self.x_scaler.transform(
            features
        )

        features = torch.tensor(
            features,
            dtype=torch.float32
        )

        # -----------------------------------------
        # Predict
        # -----------------------------------------

        with torch.no_grad():

            prediction = self.model(
                features
            )

        prediction = prediction.numpy()

        # -----------------------------------------
        # Inverse Scaling
        # -----------------------------------------

        prediction = self.y_scaler.inverse_transform(
            prediction
        )

        prediction = prediction[0]
        
        result = {
            # input features 
            "height": measurements["height"],
            "weight": measurements["weight"],
            "age": measurements["age"],
            "category": measurements["category"],
            "body_shape": measurements["body_shape"],
            "mesh_file": measurements["mesh_file"],

            # AI predictions
            "neck": round(float(prediction[0]), 2),
            "chest": round(float(prediction[1]), 2),
            "waist": round(float(prediction[2]), 2),
            "hip": round(float(prediction[3]), 2),
            "shoulder": round(float(prediction[4]), 2),
            "arm_length": round(float(prediction[5]), 2),
            "leg_length": round(float(prediction[6]), 2)
            }

        # result = {
            
        #     "height":round(float(prediction[0]),2),
        #     "weight":round(float(prediction[1]),2),
        #     "age":round(float(prediction[2]),2),
        #     "gender":round(float(prediction[3]),2),
        #     "body_shape":round(float(prediction[4]),2),
        #     "mesh_file":round(float(prediction[5]),2),
        #     "neck":
        #         round(float(prediction[6]), 2),

        #     "chest":
        #         round(float(prediction[7]), 2),

        #     "waist":
        #         round(float(prediction[8]), 2),

        #     "hip":
        #         round(float(prediction[9]), 2),

        #     "shoulder":
        #         round(float(prediction[10]), 2),

        #     "arm_length":
        #         round(float(prediction[11]), 2),

        #     "leg_length":
        #         round(float(prediction[12]), 2)

        # }

        print("\n========== AI BODY PREDICTION ==========")

        for key, value in result.items():

            print(f"{key:12}: {value}")

        print("========================================\n")

        return result


# ===================================================
# Testing
# ===================================================

if __name__ == "__main__":

    sample_measurements = {

        "height": 175,
        "weight": 70,
        "age": 22,
        "category": "Male",
        "body_shape": "Athletic"

    }

    predictor = Predictor()

    result = predictor.predict(
        sample_measurements
    )

    print(result)