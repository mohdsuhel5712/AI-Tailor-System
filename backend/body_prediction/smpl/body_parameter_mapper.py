"""
===========================================================
File: body_parameter_mapper.py

Purpose:
--------
Converts user body measurements into SMPL beta parameters.

The SMPL model uses:
    - betas : Body Shape (10 values)
    - body_pose : Body Pose
    - global_orient : Global Rotation

This file only predicts betas.

Author:
AI Tailor System
===========================================================

Maps body measurements to SMPL beta parameters.
      
 Convert measurements into SMPL betas.

        Parameters
        ----------
        measurements : dict

        Returns
        -------
        numpy.ndarray
        Shape = (1,10)
"""
import numpy as np 

class BodyParameterMapper:
       
    def  __init__(self):
        """
        Initialize mapper.
        """
        self.beta_count= 10
        
    # -----------------------------------------------------
    # Normalize measurements
    # -----------------------------------------------------
    def normalize(self,measurements):
        nomalized = {}
        
        nomalized['height'] = measurements['height']/200.0
        nomalized['weight'] = measurements['weight']/150.0
        nomalized['chest'] = measurements['chest']/150.0
        nomalized['waist'] = measurements['waist']/150.0
        nomalized['hip'] = measurements['hip']/150.0
        nomalized['neck'] = measurements['neck']/60.0
        nomalized['arm_length'] = measurements['arm_length']/100.0
        nomalized['leg_length'] = measurements['leg_length']/150.0
        
        return nomalized
  
    # -----------------------------------------------------
    # Measurements → SMPL Betas
    # -----------------------------------------------------
    def measurements_to_betas(self,measurements):
          
          m = self.normalize(measurements)
          
          betas = np.zeros((1,self.beta_count))
          
          #height
          betas[0][0] = (m['height']-0.85)*3
          #weight
          betas[0][1] = (m['weight']-0.45)*3
          #chest
          betas[0][2] = (m['chest']-0.60)*3
          #waist
          betas[0][3] = (m['waist']-0.55)*3
          #hip
          betas[0][4] = (m['hip']-0.60)*3
          #neck
          betas[0][5] = (m['neck']-0.55)*3
          #arm_length
          betas[0][6] = (m['arm_length']-0.65)*3
          #leg_langth
          betas[0][7] = (m['leg_length']-0.75)*3
          
          #reserved
          betas[0][8] = 0.0
          betas[0][9] = 0.0
          return betas
    
    
    # -----------------------------------------------------
    # Print Betas
    # -----------------------------------------------------
    def print_betas(self,betas):
      print("\n generated fro csv Bteas \n")
      for index, value in enumerate(betas[0]):
            print(f"betas :{index} :{value:.4f}")




      
          
      
      
          

