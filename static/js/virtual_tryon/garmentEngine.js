// =====================================================
// garmentEngine.js
// Professional Garment Loader
// Supports OBJ, OBJ + MTL, GLB, GLTF
// =====================================================
// 3 FILE
export class GarmentEngine {
    constructor() {
        // ---------------------------------------------
        // OBJ LOADER
        // ---------------------------------------------
        this.objLoader =
            new THREE.OBJLoader();
        // ---------------------------------------------
        // MTL LOADER
        // ---------------------------------------------
        this.mtlLoader =
            new THREE.MTLLoader();
        // ---------------------------------------------
        // GLTF LOADER
        // ---------------------------------------------
        this.gltfLoader =
            new THREE.GLTFLoader();
        console.log(
            "✅ Garment Engine Initialized"
        );
    }
    // =================================================
    // MAIN LOAD FUNCTION
    // =================================================
    load(
        modelPath,
        materialPath = null
    ) {
        return new Promise(
            (resolve, reject) => {
                // -------------------------------------
                // FILE EXTENSION
                // -------------------------------------
                const extension =
                    modelPath
                        .split(".")
                        .pop()
                        .toLowerCase();
                // -------------------------------------
                // OBJ
                // -------------------------------------
                if (
                    extension === "obj"
                ) {
                    this.loadOBJ(
                        modelPath,
                        materialPath
                    )
                        .then(
                            resolve
                        )
                        .catch(
                            reject
                        );
                    return;
                }
                // -------------------------------------
                // GLB / GLTF
                // -------------------------------------
                if (
                    extension === "glb" ||
                    extension === "gltf"
                ) {
                    this.loadGLTF(
                        modelPath
                    )
                        .then(
                            resolve
                        )
                        .catch(
                            reject
                        );
                    return;
                }
                // -------------------------------------
                // UNSUPPORTED FORMAT
                // -------------------------------------
                reject(
                    new Error(
                        "Unsupported garment format: " +
                        extension
                    )
                );
            }
        );
    }
    // =================================================
    // LOAD OBJ
    // =================================================
    loadOBJ(
        modelPath,
        materialPath = null
    ) {
        return new Promise(
            (resolve, reject) => {
                // -------------------------------------
                // OBJ + MTL
                // -------------------------------------
                if (
                    materialPath
                ) {
                    this.mtlLoader.load(
                        materialPath,
                        (materials) => {
                            materials.preload();
                            this.objLoader
                                .setMaterials(
                                    materials
                                );
                            this.objLoader.load(
                                modelPath,
                                (object) => {
                                    object.name =
                                        "Garment";
                                    console.log(
                                        "✅ OBJ + MTL loaded"
                                    );
                                    resolve(
                                        object
                                    );
                                },
                                undefined,
                                (error) => {
                                    reject(
                                        error
                                    );
                                }
                            );
                        },
                        undefined,
                        (error) => {
                            reject(
                                error
                            );
                        }
                    );
                }
                // -------------------------------------
                // OBJ ONLY
                // -------------------------------------
                else {
                    this.objLoader.load(
                        modelPath,
                        (object) => {
                            object.name =
                                "Garment";
                            console.log(
                                "✅ OBJ loaded"
                            );
                            resolve(
                                object
                            );
                        },
                        undefined,
                        (error) => {
                            reject(
                                error
                            );
                        }
                    );
                }
            }
        );
    }
    // =================================================
    // LOAD GLB / GLTF
    // =================================================
    loadGLTF(
        modelPath
    ) {
        return new Promise(
            (resolve, reject) => {
                this.gltfLoader.load(
                    modelPath,
                    (gltf) => {
                        const garment =
                            gltf.scene;
                        garment.name =
                            "Garment";
                        console.log(
                            "✅ GLB / GLTF loaded"
                        );
                        resolve(
                            garment
                        );
                    },
                    undefined,
                    (error) => {
                        reject(
                            error
                        );
                    }
                );
            }
        );
    }
    // =================================================
    // PREPARE GARMENT
    // =================================================
    prepareGarment(
        garment
    ) {
        garment.traverse(
            (child) => {
                if (
                    child.isMesh
                ) {
                    // ---------------------------------
                    // ENABLE SHADOW
                    // ---------------------------------
                    child.castShadow =
                        true;
                    child.receiveShadow =
                        true;
                    // ---------------------------------
                    // NORMALIZE GEOMETRY
                    // ---------------------------------
                    if (
                        child.geometry
                    ) {
                        child.geometry
                            .computeBoundingBox();
                        child.geometry
                            .computeVertexNormals();
                    }
                }
            }
        );
        garment.updateMatrixWorld(
            true
        );
        console.log(
            "✅ Garment prepared"
        );
        return garment;
    }
}