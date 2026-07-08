# from backend.body_prediction.smpl.body_parameter_mapper import BodyParameterMapper

# measurements = {
#     "height": 175,
#     "weight": 70,
#     "chest": 95,
#     "waist": 82,
#     "hip": 96,
#     "neck": 39,
#     "arm_length": 63,
#     "leg_length": 98
# }

# mapper = BodyParameterMapper()

# betas = mapper.measurements_to_betas(measurements)

# mapper.print_betas(betas)

# from backend.body_prediction.smpl.smpl_model import SMPLModel


# MODEL_PATH = "../body_prediction/models/smpl"


# loader = SMPLModel(MODEL_PATH)


# model = loader.load_model("neutral")


# loader.model_info(model)

import os
from backend.body_prediction.smpl.smpl_model import SMPLModel

PROJECT_ROOT = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

MODEL_DIR = os.path.join(
    PROJECT_ROOT,
    "body_prediction",
    "models"
)

print("=" * 50)
print("MODEL DIRECTORY :", MODEL_DIR)
print("EXISTS :", os.path.exists(MODEL_DIR))
print("=" * 50)

loader = SMPLModel(MODEL_DIR)

model = loader.load_model("neutral")

loader.model_info(model)