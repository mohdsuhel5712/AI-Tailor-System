"""
===========================================================
File: pose_generator.py

Purpose:
--------
Generate SMPL pose parameters.

SMPL uses:
    - global_orient : Rotation of the whole body
    - body_pose     : 23 joints × 3 values = 69 parameters

Author:
AI Tailor System
===========================================================
"""

import torch


class PoseGenerator:
    """
    Generates body pose parameters for the SMPL model.
    """

    def __init__(self):
        """
        SMPL Body Pose:
        23 joints × 3 axis-angle values = 69 values

        Global Orientation:
        3 values
        """

        self.pose_size = 69
        self.global_size = 3

    # --------------------------------------------------
    # Neutral Standing Pose
    # --------------------------------------------------

    def neutral_pose(self):
        """
        Generate a neutral standing pose.

        Returns
        -------
        body_pose : torch.Tensor
            Shape = (1,69)

        global_orient : torch.Tensor
            Shape = (1,3)
        """

        body_pose = torch.zeros((1, self.pose_size))

        global_orient = torch.zeros((1, self.global_size))

        return body_pose, global_orient

    # --------------------------------------------------
    # Random Pose
    # --------------------------------------------------

    def random_pose(self):
        """
        Generate a random body pose.

        Useful for testing only.
        """

        body_pose = torch.randn((1, self.pose_size)) * 0.05

        global_orient = torch.zeros((1, self.global_size))

        return body_pose, global_orient

    # --------------------------------------------------
    # T-Pose
    # --------------------------------------------------

    def t_pose(self):
        """
        Generate an approximate T-Pose.
        """

        body_pose = torch.zeros((1, self.pose_size))

        # Left Shoulder
        body_pose[0][45] = -1.57

        # Right Shoulder
        body_pose[0][48] = 1.57

        global_orient = torch.zeros((1, self.global_size))

        return body_pose, global_orient

    # --------------------------------------------------
    # Print Pose Information
    # --------------------------------------------------

    def print_pose_info(self, body_pose, global_orient):

        print("\n========== Pose Information ==========\n")

        print("Global Orientation Shape :", global_orient.shape)

        print("Body Pose Shape :", body_pose.shape)

        print("\nTotal Pose Parameters :", body_pose.numel())

        print("\n======================================")