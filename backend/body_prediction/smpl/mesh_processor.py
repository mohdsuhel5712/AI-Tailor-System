"""
mesh_processor.py

Process and inspect SMPL mesh.
"""
import numpy as np

class SMPLProcessor:
      def __init__(self,vertices,faces):
            self.vertices = vertices
            self.faces = faces
            
      def mesh_info(self):
            print("\n========== Mesh Information ==========\n")
            print(f"vertices : {len(self.vertices)}")
            print(f"faces : {len(self.faces)}")
            print("--------------------------------------")
            
      def bounding_box(self):
            minimum = np.min(self.vertices,axis=0)
            maximum = np.max(self.vertices,axis=0)
            width = maximum[0] - minimum[0]
            depth = maximum[1] - minimum[1]
            height = maximum[2] - minimum[2]
            print("\n========== Bounding Box ==========\n")
            
            print(f'width:{width:.4f}')
            print(f'depth:{depth:.4f}')
            print(f'height:{height:.4f}')
            
            print("----------------------------------")
            return minimum,maximum
      
      def validate_mesh(self):
            print("\n========== Mesh Validation ==========\n")
            
            if len(self.vertices) == 0:
                  
                  print("❌ No vertices found")
                  return False
            if len(self.faces) ==0:
                  print("❌ No vertices found")
                  return False
            
            print("✅ Mesh is valid")
            return True
      
      


