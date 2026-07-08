"""
visualization.py

Visualize mesh.
"""
import trimesh


class MeshVisualizer:
      @staticmethod
      def show(vertices,faces):
            mesh = trimesh.Trimesh(vertices=vertices,faces=faces)
            mesh.show()
            
            