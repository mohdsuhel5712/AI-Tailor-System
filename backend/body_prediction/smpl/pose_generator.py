"""
===========================================================
File : pose_generator.py

Location:
backend/body_prediction/smpl/

Purpose
-------
Generate SMPL body poses.

Project:
AI Tailor System
===========================================================
"""

import random
import torch


class PoseGenerator:

    def __init__(self):

        self.pose_size = 69

        self.global_size = 3

        self.available_poses = [

            "neutral",

            "standing",

            "apose",

            "walking",

            "running",

            "fashion",

            "hands_on_waist",

            "cross_arm"

        ]

    # =====================================================
    # MAIN POSE INTERFACE
    # =====================================================

    def generate_pose(self, pose_name="apose"):

        return self.get_pose(pose_name)

    # =====================================================
    # NEUTRAL POSE
    # =====================================================

    def neutral_pose(self):

        body_pose = torch.zeros(

            self.pose_size,

            dtype=torch.float32

        )

        global_orient = torch.zeros(

            (1, 3),

            dtype=torch.float32

        )

        return body_pose, global_orient

    # =====================================================
    # A-POSE
    # =====================================================

    def apose(self):

        body_pose = torch.zeros(

            self.pose_size,

            dtype=torch.float32

        )

        # -------------------------------------------------
        # SMPL body_pose is:
        #
        # 23 joints × 3 rotation values
        #
        # Each joint:
        #
        # [rotation_x,
        #  rotation_y,
        #  rotation_z]
        #
        # -------------------------------------------------

        # LEFT SHOULDER
        #
        # Try rotation around Z axis
        # to move the left arm downward.

        body_pose[45 + 2] = -1.00


        # RIGHT SHOULDER
        #
        # Opposite rotation around Z axis.

        body_pose[48 + 2] = 1.00


        # -------------------------------------------------
        # ELBOW
        #
        # Keep elbows almost straight.
        # -------------------------------------------------

        body_pose[51 + 0] = 0.0
        body_pose[54 + 0] = 0.0
        global_orient = torch.zeros((1, 3),dtype=torch.float32)

        print("\n========== A-POSE ==========")
        print("Left shoulder rotation :",body_pose[45:48])
        print("Right shoulder rotation:",body_pose[48:51])
        print("============================\n")
        return body_pose, global_orient

    # =====================================================
    # STANDING
    # =====================================================

    def standing_pose(self):

        body_pose = torch.zeros(self.pose_size,dtype=torch.float32)

        global_orient = torch.zeros((1, 3),dtype=torch.float32)
        return body_pose, global_orient

    # =====================================================
    # WALKING
    # =====================================================

    def walking_pose(self):

        body_pose = torch.zeros(self.pose_size,dtype=torch.float32)
        body_pose[0] = 0.20
        body_pose[3] = -0.20
        global_orient = torch.zeros((1, 3),dtype=torch.float32)
        return body_pose, global_orient

    # =====================================================
    # RUNNING
    # =====================================================

    def running_pose(self):

        body_pose = torch.zeros(self.pose_size,dtype=torch.float32)
        body_pose[0] = 0.50
        body_pose[3] = -0.50
        global_orient = torch.zeros( (1, 3),dtype=torch.float32)
        return body_pose, global_orient

    # =====================================================
    # FASHION
    # =====================================================

    def fashion_pose(self):

        body_pose = torch.zeros(self.pose_size, dtype=torch.float32)
        body_pose[45] = -0.70
        body_pose[48] = 0.20
        global_orient = torch.tensor([[0.0, 0.25, 0.0]],dtype=torch.float32)
        return body_pose, global_orient

    # =====================================================
    # HANDS ON WAIST
    # =====================================================

    def hands_on_waist(self):

        body_pose = torch.zeros(self.pose_size,dtype=torch.float32 )

        body_pose[45] = -1.20
        body_pose[48] = 1.20
        body_pose[46] = -0.50
        body_pose[49] = 0.50
        global_orient = torch.zeros((1, 3),dtype=torch.float32)

        return body_pose, global_orient

    # =====================================================
    # CROSS ARM
    # =====================================================

    def cross_arm(self):

        body_pose = torch.zeros( self.pose_size,dtype=torch.float32)
        body_pose[45] = -1.40
        body_pose[48] = 1.40
        body_pose[46] = -1.00
        body_pose[49] = 1.00
        global_orient = torch.zeros((1, 3),dtype=torch.float32)
        return body_pose, global_orient

    # =====================================================
    # RANDOM POSE
    # =====================================================

    def random_pose(self):
        selected_pose = random.choice(
            self.available_poses
        )

        print("\nSelected Pose:", selected_pose)
        return self.get_pose(selected_pose
        )

    # =====================================================
    # SELECT POSE
    # =====================================================

    def get_pose(self,pose_name):

        pose_name = pose_name.lower()

        pose_functions = {

            "neutral":self.neutral_pose, 
            "standing":self.standing_pose,
            "apose":self.apose,
            "walking":self.walking_pose,
            "running": self.running_pose,
            "fashion":self.fashion_pose,
            "hands_on_waist":self.hands_on_waist,
            "cross_arm":self.cross_arm
        }

        function = pose_functions.get(pose_name,self.apose)
        return function()