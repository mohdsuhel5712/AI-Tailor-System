"""
smpl_generator.py

Generates SMPL mesh.
"""

import torch

class SMPLGenerator:
      def __init__(self,model):
            self.model = model
            
      def generate(self,betas=None):
            if betas is None:
                  betas = torch.zeros((1,10))
            output  = self.model(betas = betas,return_verts=True )
            vertices = output.vertices.detach().cpu().numpy()[0]
            return vertices