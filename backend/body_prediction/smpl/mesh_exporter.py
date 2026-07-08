"""
mesh_exporter.py

Exports mesh to OBJ.
"""

import trimesh

class MeshExporter:
      @staticmethod
      def export(vertices,faces,output_path):
            mesh = trimesh.Trimesh(vertices=vertices,faces=faces)
            mesh.export(output_path)
            print(f" mesh export to the : {output_path}")