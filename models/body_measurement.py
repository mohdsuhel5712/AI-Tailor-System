# model/body_measurements.py
'''STEP 2 — Create Measurement Model
File'''

# model making means = (creating class file )

class  BodyMeasurement:
      
      def __init__(
            self,height,chest,waist,hip,shoulder,arm_length,leg_length,gender,body_shape,mesh_file=None
      ):
            self.height = height,
            self.chest = chest,
            self.waist = waist,
            self.hip = hip,
            self.shoulder = shoulder,
            self.arm_length = arm_length,
            self.leg_length = leg_length,
            self.gender = gender,
            self.body_shape = body_shape,
            self.mesh_file = mesh_file
            
      
            
      def to_dict(self):
            return {
                  "height":self.height,
                  "chest":self.chest,
                  "waist":self.waist,
                  "hip":self.hip,
                  "shoulder":self.shoulder,
                  "arm_length":self.arm_length,
                  "leg_length":self.leg_length,
                  "gender":self.gender,
                  "body_shape":self.body_shape,
                  "mesh_file":self.mesh_file
            }