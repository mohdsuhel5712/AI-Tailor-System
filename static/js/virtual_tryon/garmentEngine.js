// =====================================================
// garmentEngine.js
// Runtime Garment Loader
// Loads Shirt and Pant models
// =====================================================

export class GarmentEngine {

    constructor() {

        this.objLoader =
            new THREE.OBJLoader();

        this.mtlLoader =
            new THREE.MTLLoader();

        this.gltfLoader =
            new THREE.GLTFLoader();

        console.log(
            "✅ Garment Engine Initialized"
        );
    }


    // =================================================
    // LOAD SHIRT
    // =================================================

    async loadShirt() {

        const shirtPath =
            "/static/garments/shirts/Male_Shirt.obj";

        console.log(
            "👕 Loading shirt:",
            shirtPath
        );

        const shirt =
            await this.load(
                shirtPath
            );

        shirt.name =
            "Shirt";

        console.log(
            "✅ Shirt loaded successfully"
        );

        return shirt;
    }


    // =================================================
    // LOAD PANT
    // =================================================

    async loadPant() {

        const pantPath =
            "/static/garments/pants/pant.obj";

        console.log(
            "👖 Loading pant:",
            pantPath
        );

        const pant =
            await this.load(
                pantPath
            );

        pant.name =
            "Pant";

        console.log(
            "✅ Pant loaded successfully"
        );

        return pant;
    }


    // =================================================
    // MAIN LOAD FUNCTION
    // =================================================

    async load(
        modelPath,
        materialPath = null
    ) {

        if (!modelPath) {

            throw new Error(
                "Garment model path is required"
            );
        }


        const extension =
            modelPath
            .split(".")
            .pop()
            .toLowerCase();


        let garment;


        // OBJ

        if (
            extension === "obj"
        ) {

            garment =
                await this.loadOBJ(

                    modelPath,

                    materialPath
                );
        }


        // GLB / GLTF

        else if (

            extension === "glb" ||

            extension === "gltf"
        ) {

            garment =
                await this.loadGLTF(

                    modelPath
                );
        }


        // Unsupported

        else {

            throw new Error(

                "Unsupported garment format: " +

                extension
            );
        }


        return this.prepareGarment(

            garment
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

            (
                resolve,
                reject
            ) => {


                // OBJ + MTL

                if (
                    materialPath
                ) {

                    this.mtlLoader.load(

                        materialPath,

                        (
                            materials
                        ) => {

                            materials.preload();


                            this.objLoader
                            .setMaterials(

                                materials
                            );


                            this.objLoader.load(

                                modelPath,

                                (
                                    garment
                                ) => {

                                    garment.name =
                                        "Garment";


                                    console.log(

                                        "✅ OBJ + MTL loaded"
                                    );


                                    resolve(

                                        garment
                                    );
                                },


                                undefined,


                                reject
                            );
                        },


                        undefined,


                        reject
                    );


                    return;
                }


                // ONLY OBJ

                this.objLoader.load(

                    modelPath,


                    (
                        garment
                    ) => {

                        garment.name =
                            "Garment";


                        console.log(

                            "✅ OBJ loaded"
                        );


                        resolve(

                            garment
                        );
                    },


                    undefined,


                    (
                        error
                    ) => {

                        console.error(

                            "❌ OBJ loading failed:",

                            modelPath,

                            error
                        );


                        reject(

                            error
                        );
                    }
                );
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

            (
                resolve,
                reject
            ) => {

                this.gltfLoader.load(

                    modelPath,


                    (
                        gltf
                    ) => {

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


                    reject
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

        // Reset transform

        garment.position.set(

            0,
            0,
            0
        );


        garment.rotation.set(

            0,
            0,
            0
        );


        garment.scale.set(

            1,
            1,
            1
        );


        // Prepare mesh

        garment.traverse(

            (
                child
            ) => {

                if (
                    !child.isMesh
                ) {

                    return;
                }


                child.castShadow =

                    true;


                child.receiveShadow =

                    true;


                if (
                    child.geometry
                ) {

                    child.geometry
                    .computeBoundingBox();


                    child.geometry
                    .computeVertexNormals();
                }


                // OBJ without MTL:
                // add default material

                if (
                    !child.material
                ) {

                    child.material =

                        new THREE
                        .MeshStandardMaterial({

                            color:

                                0x222222,

                            roughness:

                                0.85,

                            metalness:

                                0.0,

                            side:

                                THREE
                                .DoubleSide
                        });
                }


                child.material
                .needsUpdate =

                    true;
            }
        );


        garment
        .updateMatrixWorld(

            true
        );


        // Center garment

        this.centerGarmentGeometry(

            garment
        );


        garment
        .updateMatrixWorld(

            true
        );


        // Print original size

        const box =

            new THREE.Box3()

            .setFromObject(

                garment
            );


        const size =

            new THREE.Vector3();


        box.getSize(

            size
        );


        console.log(

            "📦 Original Garment Size:",

            size
        );


        console.log(

            "✅ Garment prepared"
        );


        return garment;
    }


    // =================================================
    // CENTER GARMENT
    // =================================================

    centerGarmentGeometry(
        garment
    ) {

        const box =

            new THREE.Box3()

            .setFromObject(

                garment
            );


        const center =

            new THREE.Vector3();


        box.getCenter(

            center
        );


        garment.traverse(

            (
                child
            ) => {

                if (

                    !child.isMesh ||

                    !child.geometry

                ) {

                    return;
                }


                child.geometry.translate(

                    -center.x,

                    -center.y,

                    -center.z
                );


                child.geometry
                .computeBoundingBox();


                child.geometry
                .computeVertexNormals();
            }
        );


        console.log(

            "🎯 Garment geometry centered"
        );
    }


    // =================================================
    // REMOVE GARMENT
    // =================================================

    remove(
        garment,
        scene
    ) {

        if (

            !garment ||

            !scene

        ) {

            return;
        }


        scene.remove(

            garment
        );


        garment.traverse(

            (
                child
            ) => {

                if (
                    !child.isMesh
                ) {

                    return;
                }


                if (
                    child.geometry
                ) {

                    child.geometry
                    .dispose();
                }


                if (
                    child.material
                ) {

                    if (

                        Array.isArray(

                            child.material
                        )

                    ) {

                        child.material
                        .forEach(

                            (
                                material
                            ) => {

                                material
                                .dispose();
                            }
                        );

                    }

                    else {

                        child.material
                        .dispose();
                    }
                }
            }
        );


        console.log(

            "🗑️ Garment removed"
        );
    }
}