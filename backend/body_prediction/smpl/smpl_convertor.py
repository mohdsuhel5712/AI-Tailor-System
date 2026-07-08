"""
Convert body measurements
to SMPL betas and poses.
"""
class SMPLConvertor:
      def __init__(self,model_directory):
            self.model_directory = ""
            
      def get_model_path(self,gender):
            if gender == 'male':
                  return f"{self.model_directory}/smpl_male.pkl"
            elif gender == 'female':
                  return f"{self.model_directory}/smpl_female.pkl"
            else:
                  return f"{self.model_directory}/smpl_neutron.pkl"