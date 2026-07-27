"""
=========================================================
File : mesh_exporter.py

Purpose
-------
Exports the generated SMPL mesh as an OBJ file.

The exported OBJ is stored inside:

static/generated/

so Flask and Three.js can load it directly.

Project : AI Tailor System
=========================================================
"""

# import trimesh

# class MeshExporter:
#       @staticmethod
#       def export(vertices,faces,output_path):
#             mesh = trimesh.Trimesh(vertices=vertices,faces=faces)
#             mesh.export(output_path)
#             print(f" mesh export to the : {output_path}")

"""
=========================================================
File : mesh_exporter.py

Purpose
-------
Exports the generated SMPL mesh as an OBJ file.

The exported OBJ is stored inside:

static/generated/

so Flask and Three.js can load it directly.

Project : AI Tailor System
=========================================================
"""

import os


class MeshExporter:

    def __init__(self,output_dir):
        self.output_dir = output_dir

        # -----------------------------------------
        # Project Root
        # -----------------------------------------

        project_root = os.getcwd()

        # -----------------------------------------
        # Output Folder
        # -----------------------------------------

        self.output_dir = os.path.join(
            project_root,
            "static",
            "generated"
        )

        os.makedirs(
            self.output_dir,
            exist_ok=True
        )

        print("\nMesh Export Directory:")
        print(self.output_dir)

    # ==================================================
    # Export OBJ
    # ==================================================

    def export(
        self,
        vertices,
        faces,
        filename="processed_body.obj"
    ):

        output_path = os.path.join(
            self.output_dir,
            filename
        )

        with open(output_path, "w") as obj:

            # ----------------------------
            # Write Vertices
            # ----------------------------

            for vertex in vertices:

                obj.write(
                    f"v {vertex[0]} {vertex[1]} {vertex[2]}\n"
                )

            # ----------------------------
            # Write Faces
            # ----------------------------

            for face in faces:

                obj.write(
                    f"f {face[0]+1} {face[1]+1} {face[2]+1}\n"
                )

        print("\nOBJ Exported Successfully")
        print(output_path)

        return output_path