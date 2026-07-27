"""
visualization.py

Visualize mesh and export the first SMPL HUMAN MESH .

Generate ,validate ,export and visualization , ,inspect SMPL depth
"""
# import trimesh


# class MeshVisualizer:
#       @staticmethod
#       def show(vertices,faces):
#             mesh = trimesh.Trimesh(vertices=vertices,faces=faces)
#             mesh.show()

"""
visualization.py

Phase 6 - Step 4

Generate
Validate
Export
Visualize

SMPL Human Mesh
"""

import os

import open3d as o3d

from backend.api.smpl_api import load_smpl_model

from backend.body_prediction.smpl.smpl_generator import SMPLGenerator

from backend.body_prediction.smpl.mesh_processor import SMPLProcessor

from backend.body_prediction.smpl.mesh_exporter import MeshExporter


class MeshVisualizer:

    """
    Interactive Mesh Viewer
    """

    def __init__(self, vertices, faces):

        self.vertices = vertices
        self.faces = faces

        self.screenshot_dir = os.path.join(
            "backend",
            "body_prediction",
            "smpl",
            "screenshots"
        )

        os.makedirs(
            self.screenshot_dir,
            exist_ok=True
        )

    def create_mesh(self):

        mesh = o3d.geometry.TriangleMesh()

        mesh.vertices = o3d.utility.Vector3dVector(
            self.vertices
        )

        mesh.triangles = o3d.utility.Vector3iVector(
            self.faces
        )

        mesh.compute_vertex_normals()

        return mesh

    def show(self):

        mesh = self.create_mesh()

        axis = o3d.geometry.TriangleMesh.create_coordinate_frame(
            size=0.25,
            origin=[0, 0, 0]
        )

        print("\n======================================")
        print("Interactive Viewer Started")
        print("======================================")

        print("Mouse Controls")
        print("--------------------------")
        print("Left Mouse   : Rotate")
        print("Right Mouse  : Pan")
        print("Mouse Wheel  : Zoom")
        print("Shift + Left : Translate")
        print("R            : Reset Camera")
        print("Q            : Quit")
        print("--------------------------")

        print("\nInspect the model carefully.")

        print("✓ Head")

        print("✓ Torso")

        print("✓ Arms")

        print("✓ Legs")

        print("✓ Feet")

        print("✓ Mesh Quality")

        o3d.visualization.draw_geometries(
            [mesh, axis],
            window_name="AI Tailor System",
            width=1280,
            height=800
        )


def main():

    print("\n========== AI Tailor ==========")

    print("\nLoading SMPL Model...\n")

    model = load_smpl_model()

    print("\nGenerating Human Mesh...\n")

    generator = SMPLGenerator(model)

    vertices, faces = generator.generate()

    processor = SMPLProcessor(
        vertices,
        faces
    )

    processor.mesh_info()

    processor.validate_mesh()

    processor.bounding_box()

    exporter = MeshExporter(output_dir="../static/generated/")

    exporter.export(

        vertices,

        faces,

        filename="human_body.obj"

    )

    viewer = MeshVisualizer(

        vertices,

        faces

    )

    viewer.show()

    print("\n====================================")

    print("Phase 6 - Step 4 Completed")

    print("====================================")


if __name__ == "__main__":
    main()