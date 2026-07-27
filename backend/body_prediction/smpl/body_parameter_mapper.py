"""
===========================================================
File : body_parameter_mapper.py

Folder :
backend/body_prediction/smpl/

Purpose
-------
Convert body measurements into SMPL Shape Betas.

Author
------
AI Tailor System
===========================================================
"""

import numpy as np


class BodyParameterMapper:

    def __init__(self):

        self.beta_count = 10

    # -----------------------------------------------------
    # Normalize Measurements
    # -----------------------------------------------------

    def normalize(self, measurements):

        normalized = {}

        normalized["height"] = (measurements["height"] - 140) / 70.0
        normalized["weight"] = (measurements["weight"] - 35) / 115.0

        normalized["chest"] = (measurements["chest"] - 60) / 70.0
        normalized["waist"] = (measurements["waist"] - 50) / 80.0
        normalized["hip"] = (measurements["hip"] - 70) / 80.0

        normalized["neck"] = (measurements["neck"] - 28) / 22.0

        normalized["arm_length"] = (measurements["arm_length"] - 45) / 35.0
        normalized["leg_length"] = (measurements["leg_length"] - 65) / 45.0

        normalized["shoulder"] = (measurements["shoulder"] - 30) / 30.0

        return normalized

    # -----------------------------------------------------
    # Measurements -> Betas
    # -----------------------------------------------------

    def measurements_to_betas(self, measurements):

        m = self.normalize(measurements)

        betas = np.zeros((1, self.beta_count))

        # -----------------------------
        # Body Ratios
        # -----------------------------

        bmi = measurements["weight"] / (
            (measurements["height"] / 100) ** 2
        )

        chest_waist = (
            measurements["chest"] - measurements["waist"]
        )

        hip_waist = (
            measurements["hip"] - measurements["waist"]
        )

        shoulder_ratio = (
            measurements["shoulder"] / measurements["height"]
        )

        arm_ratio = (
            measurements["arm_length"] / measurements["height"]
        )

        leg_ratio = (
            measurements["leg_length"] / measurements["height"]
        )

        # -----------------------------
        # Beta 0
        # Overall Body Size
        # -----------------------------

        betas[0][0] = (
            1.5 * m["height"] +
            1.2 * m["weight"] - 1.0
        )

        # -----------------------------
        # Beta 1
        # Body Fat
        # -----------------------------

        betas[0][1] = (
            (bmi - 22) / 6.0
        )

        # -----------------------------
        # Beta 2
        # Chest
        # -----------------------------

        betas[0][2] = (
            1.8 * m["chest"] +
            0.5 * shoulder_ratio -
            0.5
        )

        # -----------------------------
        # Beta 3
        # Waist
        # -----------------------------

        betas[0][3] = (
            2.0 * m["waist"] +
            0.02 * chest_waist
        )

        # -----------------------------
        # Beta 4
        # Hip
        # -----------------------------

        betas[0][4] = (
            2.0 * m["hip"] +
            0.02 * hip_waist
        )

        # -----------------------------
        # Beta 5
        # Neck + Shoulder
        # -----------------------------

        betas[0][5] = (
            1.2 * m["neck"] +
            0.8 * m["shoulder"]
        )

        # -----------------------------
        # Beta 6
        # Arm
        # -----------------------------

        betas[0][6] = (
            2.0 * arm_ratio +
            0.8 * m["arm_length"]
        )

        # -----------------------------
        # Beta 7
        # Leg
        # -----------------------------

        betas[0][7] = (
            2.0 * leg_ratio +
            0.8 * m["leg_length"]
        )

        # -----------------------------
        # Beta 8
        # Torso Shape
        # -----------------------------

        betas[0][8] = (
            (chest_waist + hip_waist) / 50.0
        )

        # -----------------------------
        # Beta 9
        # Overall Shape
        # -----------------------------

        betas[0][9] = (
            (
                betas[0][0] +
                betas[0][1] +
                betas[0][2] +
                betas[0][3] +
                betas[0][4]
            ) / 5.0
        )

        # Keep Betas in SMPL Range

        betas = np.clip(
            betas,
            -3.0,
            3.0
        )

        return betas

    # -----------------------------------------------------
    # Print Betas
    # -----------------------------------------------------

    def print_betas(self, betas):

        print("\n========== GENERATED SMPL BETAS ==========\n")

        for index, value in enumerate(betas[0]):

            print(f"Beta {index} : {value:.4f}")

        print("\n==========================================")