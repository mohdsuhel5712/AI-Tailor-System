from backend.body_prediction.smpl.pose_generator import PoseGenerator

pose = PoseGenerator()

body_pose,blobal_orient = pose.neutral_pose()
pose.print_pose_info(body_pose,blobal_orient)