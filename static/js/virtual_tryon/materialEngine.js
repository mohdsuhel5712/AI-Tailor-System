// =====================================================
// materialEngine.js
// Professional Garment Material Controller
// =====================================================
export class MaterialEngine {
    constructor() {
        // ---------------------------------------------
        // TEXTURE LOADER
        // ---------------------------------------------
        this.textureLoader =
            new THREE.TextureLoader();
        console.log(
            "✅ Material Engine Initialized"
        );
    }
    // =================================================
    // APPLY COLOR
    // =================================================
    applyColor(
        garment,
        color
    ) {
        garment.traverse(
            (child) => {
                if (
                    child.isMesh
                ) {
                    // ---------------------------------
                    // EXISTING MATERIAL
                    // ---------------------------------
                    if (
                        child.material
                    ) {
                        // ---------------------------------
                        // ARRAY MATERIAL
                        // ---------------------------------
                        if (
                            Array.isArray(
                                child.material
                            )
                        ) {
                            child.material.forEach(
                                (material) => {
                                    material.color.set(
                                        color
                                    );
                                    material.needsUpdate =
                                        true;
                                }
                            );
                        }
                        // ---------------------------------
                        // SINGLE MATERIAL
                        // ---------------------------------
                        else {
                            child.material.color.set(
                                color
                            );
                            child.material.needsUpdate =
                                true;
                        }
                    }
                }
            }
        );
        console.log(
            "🎨 Garment color applied:",
            color
        );
    }
    // =================================================
    // APPLY TEXTURE
    // =================================================
    applyTexture(
        garment,
        texturePath
    ) {
        return new Promise(
            (resolve, reject) => {
                this.textureLoader.load(
                    texturePath,
                    (texture) => {
                        // ---------------------------------
                        // TEXTURE SETTINGS
                        // ---------------------------------
                        texture.wrapS =
                            THREE.RepeatWrapping;
                        texture.wrapT =
                            THREE.RepeatWrapping;
                        texture.repeat.set(
                            1,
                            1
                        );
                        texture.needsUpdate =
                            true;
                        // ---------------------------------
                        // APPLY TO MESHES
                        // ---------------------------------
                        garment.traverse(
                            (child) => {
                                if (
                                    child.isMesh
                                ) {
                                    if (
                                        child.material
                                    ) {
                                        if (
                                            Array.isArray(
                                                child.material
                                            )
                                        ) {
                                            child.material.forEach(
                                                (material) => {
                                                    material.map =
                                                        texture;
                                                    material.needsUpdate =
                                                        true;
                                                }
                                            );
                                        }
                                        else {
                                            child.material.map =
                                                texture;
                                            child.material.needsUpdate =
                                                true;
                                        }
                                    }
                                }
                            }
                        );
                        console.log(
                            "🧵 Texture applied:",
                            texturePath
                        );
                        resolve(
                            texture
                        );
                    },
                    undefined,
                    (error) => {
                        console.error(
                            "❌ Texture loading failed:",
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
    // REMOVE TEXTURE
    // =================================================
    removeTexture(
        garment
    ) {
        garment.traverse(
            (child) => {
                if (
                    child.isMesh
                ) {
                    if (
                        child.material
                    ) {
                        if (
                            Array.isArray(
                                child.material
                            )
                        ) {
                            child.material.forEach(
                                (material) => {
                                    material.map =
                                        null;
                                    material.needsUpdate =
                                        true;
                                }
                            );
                        }
                        else {
                            child.material.map =
                                null;
                            child.material.needsUpdate =
                                true;
                        }
                    }
                }
            }
        );
        console.log(
            "🗑️ Texture removed"
        );
    }
    // =================================================
    // APPLY FABRIC SETTINGS
    // =================================================
    applyFabric(
        garment,
        fabricType
    ) {
        let roughness =
            0.8;
        let metalness =
            0.0;
        // ---------------------------------------------
        // COTTON
        // ---------------------------------------------
        if (
            fabricType === "cotton"
        ) {
            roughness =
                0.85;
            metalness =
                0.0;
        }
        // ---------------------------------------------
        // DENIM
        // ---------------------------------------------
        else if (
            fabricType === "denim"
        ) {
            roughness =
                0.75;
            metalness =
                0.0;
        }
        // ---------------------------------------------
        // SILK
        // ---------------------------------------------
        else if (
            fabricType === "silk"
        ) {
            roughness =
                0.25;
            metalness =
                0.0;
        }
        // ---------------------------------------------
        // LEATHER
        // ---------------------------------------------
        else if (
            fabricType === "leather"
        ) {
            roughness =
                0.35;
            metalness =
                0.0;
        }
        // ---------------------------------------------
        // APPLY SETTINGS
        // ---------------------------------------------
        garment.traverse(
            (child) => {
                if (
                    child.isMesh
                ) {
                    if (
                        child.material
                    ) {
                        const materials =
                            Array.isArray(
                                child.material
                            )
                                ?
                                child.material
                                :
                                [
                                    child.material
                                ];
                        materials.forEach(
                            (material) => {
                                material.roughness =
                                    roughness;
                                material.metalness =
                                    metalness;
                                material.needsUpdate =
                                    true;
                            }
                        );
                    }
                }
            }
        );
        console.log(
            "🧵 Fabric applied:",
            fabricType
        );
    }
    // =================================================
    // SET ROUGHNESS
    // =================================================
    setRoughness(
        garment,
        roughness
    ) {
        garment.traverse(
            (child) => {
                if (
                    child.isMesh
                ) {
                    const materials =
                        Array.isArray(
                            child.material
                        )
                            ?
                            child.material
                            :
                            [
                                child.material
                            ];
                    materials.forEach(
                        (material) => {
                            material.roughness =
                                roughness;
                            material.needsUpdate =
                                true;
                        }
                    );
                }
            }
        );
    }
    // =================================================
    // SET METALNESS
    // =================================================
    setMetalness(
        garment,
        metalness
    ) {
        garment.traverse(
            (child) => {
                if (
                    child.isMesh
                ) {
                    const materials =
                        Array.isArray(
                            child.material
                        )
                            ?
                            child.material
                            :
                            [
                                child.material
                            ];
                    materials.forEach(
                        (material) => {
                            material.metalness =
                                metalness;
                            material.needsUpdate =
                                true;
                        }
                    );
                }
            }
        );
    }
}