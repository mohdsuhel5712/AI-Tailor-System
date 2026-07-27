"""
===========================================================
File : body_mesh_generator.py
Location:
backend/body_prediction/smpl/
Purpose
-------
Complete AI Body Generation Pipeline
Flow:
User Measurements
        |
        ↓
Predictor
        |
        ↓
Predicted Body Measurements
        |
        ↓
BodyParameterMapper
        |
        ↓
SMPL Generator
        |
        ↓
A-Pose Generation
        |
        ↓
Mesh Exporter
        |
        ↓
OBJ File
Project :
AI Tailor System
===========================================================
"""
import os
import torch
from backend.body_prediction.predictor import Predictor
from backend.body_prediction.smpl.body_parameter_mapper import (
    BodyParameterMapper
)
from backend.body_prediction.smpl.smpl_model import (
    SMPLModel
)
from backend.body_prediction.smpl.smpl_generator import (
    SMPLGenerator
)
from backend.body_prediction.smpl.mesh_exporter import (
    MeshExporter
)
from backend.body_prediction.smpl.pose_generator import (
    PoseGenerator
)
class BodyMeshGenerator:
    def __init__(
        self,
        model_directory
    ):
        print(
            "\n================================"
        )
        print(
            " BODY MESH GENERATOR INIT "
        )
        print(
            "================================\n"
        )
        self.model_directory = model_directory
        # =================================================
        # POSE GENERATOR
        # =================================================
        self.pose_generator = PoseGenerator()
        # =================================================
        # AI PREDICTION MODEL
        # =================================================
        self.predictor = Predictor()
        # =================================================
        # MEASUREMENT → SMPL PARAMETERS
        # =================================================
        self.mapper = BodyParameterMapper()
        # =================================================
        # LOAD SMPL MODEL
        # =================================================
        smpl_loader = SMPLModel(
            model_directory
        )
        smpl_model = smpl_loader.load_model(
            "neutral"
        )
        self.generator = SMPLGenerator(
            smpl_model
        )
        # =================================================
        # MESH EXPORT
        # =================================================
        output_directory = os.path.join(
            os.getcwd(),
            "static",
            "generated"
        )
        self.exporter = MeshExporter(
            output_dir=output_directory
        )
        print(
            "\nBody Mesh Pipeline Ready.\n"
        )
    # =====================================================
    # GENERATE BODY
    # =====================================================
    def generate(
        self,
        measurements
    ):
        print(
            "\n==================================="
        )
        print(
            "STEP 1 : AI BODY PREDICTION"
        )
        print(
            "===================================\n"
        )
        # =================================================
        # STEP 1
        # AI PREDICTION
        # =================================================
        prediction = self.predictor.predict(
            measurements
        )
        print(
            "\nPrediction Received:"
        )
        print(
            prediction
        )
        # =================================================
        # CONVERT PREDICTION DICTIONARY
        # FOR SMPL MAPPER
        # =================================================
        predicted_measurements = {
            "height": float(
                measurements["height"]
            ),
            "weight": float(
                measurements["weight"]
            ),
            "neck": float(
                prediction["neck"]
            ),
            "chest": float(
                prediction["chest"]
            ),
            "waist": float(
                prediction["waist"]
            ),
            "hip": float(
                prediction["hip"]
            ),
            "shoulder": float(
                prediction["shoulder"]
            ),
            "arm_length": float(
                prediction["arm_length"]
            ),
            "leg_length": float(
                prediction["leg_length"]
            )
        }
        print(
            "\nFinal Measurements For SMPL:"
        )
        for key, value in predicted_measurements.items():
            print(
                key,
                ":",
                value
            )
        # =================================================
        # STEP 2
        # MEASUREMENTS → SMPL BETAS
        # =================================================
        print(
            "\n==================================="
        )
        print(
            "STEP 2 : CONVERT TO SMPL BETAS"
        )
        print(
            "===================================\n"
        )
        betas = self.mapper.measurements_to_betas(
            predicted_measurements
        )
        betas = torch.tensor(
            betas,
            dtype=torch.float32
        )
        self.mapper.print_betas(
            betas.numpy()
        )
        # =================================================
        # STEP 3
        # GENERATE SMPL MESH
        # =================================================
        print(
            "\n==================================="
        )
        print(
            "STEP 3 : GENERATE SMPL MESH"
        )
        print(
            "===================================\n"
        )
        # IMPORTANT:
        #
        # Use "apose" here.
        #
        # Previously:
        #
        # pose_name="standing"
        #
        # That was the reason the body was generated
        # in the previous pose configuration.
        #
        vertices, faces = self.generator.generate(
            betas=betas,
            pose_name="apose"
        )
        print(
            "Vertices :",
            len(vertices)
        )
        print(
            "Faces :",
            len(faces)
        )
        # =================================================
        # STEP 4
        # EXPORT OBJ
        # =================================================
        print(
            "\n==================================="
        )
        print(
            "STEP 4 : EXPORT OBJ"
        )
        print(
            "===================================\n"
        )
        filename = (
            "processed_body.obj"
        )
        output_file = self.exporter.export(
            vertices,
            faces,
            filename
        )
        print(
            "\nOBJ Generated:"
        )
        print(
            output_file
        )
        return output_file
# =========================================================
# TEST
# =========================================================
if __name__ == "__main__":
    sample_measurements = {
        "height": 175,
        "weight": 70,
        "age": 22,
        "category": 'Male',
        "body_shape": "Slim",
        "mesh_file": "mesh002.obj",
        "neck": 38,
        "arm_length": 60,
        "leg_length": 95,
        "chest": 40,
        "waist": 32,
        "hip": 38,
        "shoulder": 18
    }
    generator = BodyMeshGenerator(
        "backend/body_prediction/models"
    )
    print("TEST MEASUREMENTS:")
    print(sample_measurements)
    file = generator.generate(
        sample_measurements
    )
    print(
        "\nGenerated OBJ:"
    )
    print(
        file
    )