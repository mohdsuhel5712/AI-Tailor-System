"""
=========================================================
File : smpl_generator.py

Location :
backend/body_prediction/smpl/

Purpose
-------
Generate a personalized SMPL human mesh.

Pipeline
--------

Predicted Measurements
        │
        ▼
BodyParameterMapper
        │
        ▼
SMPL Betas
        │
        ▼
PoseGenerator
        │
        ▼
Selected Pose
        │
        ▼
SMPL Model
        │
        ▼
Vertices + Faces


Project :
AI Tailor System
=========================================================
"""


import torch
from backend.body_prediction.smpl.pose_generator import (

    PoseGenerator

)



class SMPLGenerator:


    """
    Generates a personalized human mesh
    using the SMPL model.
    """


    def __init__(

        self,

        model

    ):


        print(

            "\n================================"

        )


        print(

            " INITIALIZING SMPL GENERATOR "

        )


        print(

            "================================\n"

        )


        # =================================================
        # LOADED SMPL MODEL
        # =================================================

        self.model = model


        # =================================================
        # POSE GENERATOR
        # =================================================

        self.pose_generator = PoseGenerator()


        print(

            "SMPL Generator Ready.\n"

        )


    # =====================================================
    # GENERATE MESH
    # =====================================================

    def generate(

        self,

        betas=None,

        body_pose=None,

        global_orient=None,

        pose_name="apose"

    ):


        """
        Generate SMPL mesh.

        Parameters
        ----------

        betas :
            SMPL shape parameters.

        body_pose :
            69 body pose parameters.

        global_orient :
            Global body orientation.

        pose_name :
            Pose name such as:

            apose
            standing
            neutral
            walking
            running

        Returns
        -------

        vertices

        faces

        """


        # =================================================
        # STEP 1
        # SHAPE PARAMETERS
        # =================================================

        if betas is None:


            betas = torch.zeros(

                (1, 10),

                dtype=torch.float32

            )


        elif betas.dim() == 1:


            betas = betas.unsqueeze(0)


        # =================================================
        # STEP 2
        # POSE PARAMETERS
        # =================================================

        if (

            body_pose is None

            or

            global_orient is None

        ):


            # IMPORTANT
            #
            # Generate the selected pose.
            #
            # Previously the code always used:
            #
            # relaxed_pose()
            #
            # That ignored pose_name.
            #
            # Now:
            #
            # pose_name = "apose"
            #
            # actually generates A-pose.

            body_pose, global_orient = (

                self.pose_generator.generate_pose(

                    pose_name

                )

            )


        # =================================================
        # STEP 3
        # ENSURE CORRECT BATCH DIMENSIONS
        # =================================================

        if body_pose.dim() == 1:


            body_pose = body_pose.unsqueeze(0)


        if global_orient.dim() == 1:


            global_orient = global_orient.unsqueeze(0)


        # =================================================
        # STEP 4
        # GENERATE SMPL MESH
        # =================================================

        output = self.model(

            betas=betas,

            body_pose=body_pose,

            global_orient=global_orient,

            transl=torch.zeros(

                (1, 3),

                dtype=torch.float32

            ),

            return_verts=True

        )


        # =================================================
        # STEP 5
        # EXTRACT VERTICES
        # =================================================

        vertices = (

            output.vertices

            .detach()

            .cpu()

            .numpy()[0]

        )


        # =================================================
        # STEP 6
        # EXTRACT FACES
        # =================================================

        faces = self.model.faces


        # =================================================
        # INFORMATION
        # =================================================

        print(

            "\n========== SMPL GENERATED =========="

        )


        print(

            "Vertices :",

            len(vertices)

        )


        print(

            "Faces    :",

            len(faces)

        )


        print(

            "Pose     :",

            pose_name

        )


        print(

            "====================================\n"

        )


        return vertices, faces



# =========================================================
# TEST
# =========================================================

if __name__ == "__main__":


    print(

        "\nRun this file through "

        "body_mesh_generator.py"

    )