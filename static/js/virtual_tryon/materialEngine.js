// =====================================================
// materialEngine.js
// Professional Runtime Material Controller
// =====================================================

export class MaterialEngine {
    constructor() {
        this.textureLoader=new THREE.TextureLoader();
        console.log("✅ Material Engine Initialized");
    }

    // =================================================
    // APPLY COLOR
    // =================================================

    applyColor(garment,color) {
        if(!garment||!color) {
            return;
        }

        garment.traverse((child)=>{
            if(!child.isMesh||!child.material) {
                return;
            }

            const materials=Array.isArray(child.material)
                ?child.material
                :[child.material];

            materials.forEach((material)=>{
                if(material.color) {
                    material.color.set(color);
                }

                material.needsUpdate=true;
            });
        });

        console.log("🎨 Garment color applied:",color);
    }

    // =================================================
    // APPLY TEXTURE
    // =================================================

    applyTexture(garment,texturePath) {
        return new Promise((resolve,reject)=>{
            if(!garment||!texturePath) {
                reject(
                    new Error(
                        "Garment and texture path are required"
                    )
                );
                return;
            }

            this.textureLoader.load(
                texturePath,
                (texture)=>{
                    texture.wrapS=THREE.RepeatWrapping;
                    texture.wrapT=THREE.RepeatWrapping;
                    texture.repeat.set(1,1);
                    texture.needsUpdate=true;

                    garment.traverse((child)=>{
                        if(
                            !child.isMesh||
                            !child.material
                        ) {
                            return;
                        }

                        const materials=
                            Array.isArray(child.material)
                                ?child.material
                                :[child.material];

                        materials.forEach((material)=>{
                            material.map=texture;
                            material.needsUpdate=true;
                        });
                    });

                    console.log(
                        "🧵 Texture applied:",
                        texturePath
                    );

                    resolve(texture);
                },
                undefined,
                (error)=>{
                    console.error(
                        "❌ Texture loading failed:",
                        error
                    );

                    reject(error);
                }
            );
        });
    }

    // =================================================
    // REMOVE TEXTURE
    // =================================================

    removeTexture(garment) {
        if(!garment) {
            return;
        }

        garment.traverse((child)=>{
            if(
                !child.isMesh||
                !child.material
            ) {
                return;
            }

            const materials=
                Array.isArray(child.material)
                    ?child.material
                    :[child.material];

            materials.forEach((material)=>{
                if(material.map) {
                    material.map.dispose();
                }

                material.map=null;
                material.needsUpdate=true;
            });
        });

        console.log("🗑️ Texture removed");
    }

    // =================================================
    // APPLY FABRIC
    // =================================================

    applyFabric(garment,fabricType) {
        if(!garment) {
            return;
        }

        const fabricSettings={
            cotton:{
                roughness:0.85,
                metalness:0.0
            },
            denim:{
                roughness:0.75,
                metalness:0.0
            },
            silk:{
                roughness:0.25,
                metalness:0.0
            },
            leather:{
                roughness:0.35,
                metalness:0.0
            },
            wool:{
                roughness:0.95,
                metalness:0.0
            },
            polyester:{
                roughness:0.55,
                metalness:0.0
            }
        };

        const settings=
            fabricSettings[
                String(fabricType).toLowerCase()
            ]||
            fabricSettings.cotton;

        garment.traverse((child)=>{
            if(
                !child.isMesh||
                !child.material
            ) {
                return;
            }

            const materials=
                Array.isArray(child.material)
                    ?child.material
                    :[child.material];

            materials.forEach((material)=>{
                material.roughness=
                    settings.roughness;

                material.metalness=
                    settings.metalness;

                material.needsUpdate=true;
            });
        });

        console.log(
            "🧵 Fabric applied:",
            fabricType
        );
    }

    // =================================================
    // SET ROUGHNESS
    // =================================================

    setRoughness(garment,roughness) {
        if(!garment) {
            return;
        }

        garment.traverse((child)=>{
            if(
                !child.isMesh||
                !child.material
            ) {
                return;
            }

            const materials=
                Array.isArray(child.material)
                    ?child.material
                    :[child.material];

            materials.forEach((material)=>{
                material.roughness=
                    THREE.MathUtils.clamp(
                        Number(roughness),
                        0,
                        1
                    );

                material.needsUpdate=true;
            });
        });
    }

    // =================================================
    // SET METALNESS
    // =================================================

    setMetalness(garment,metalness) {
        if(!garment) {
            return;
        }

        garment.traverse((child)=>{
            if(
                !child.isMesh||
                !child.material
            ) {
                return;
            }

            const materials=
                Array.isArray(child.material)
                    ?child.material
                    :[child.material];

            materials.forEach((material)=>{
                material.metalness=
                    THREE.MathUtils.clamp(
                        Number(metalness),
                        0,
                        1
                    );

                material.needsUpdate=true;
            });
        });
    }
}



// ====================== HERE I GET STRTED TO WORK ON TEXTUTE ON CLICK ON BTN =================
// =====================================================
// materialEngine.js
// Runtime Color, Fabric Texture and Pattern System
// =====================================================

// =====================================================
// TEXTURE LOADER
// =====================================================

const textureLoader = new THREE.TextureLoader();
// =====================================================
// GET SELECTED GARMENT
// =====================================================

function getSelectedGarment(target) {

    const manager = window.garmentManager;

    if (!manager) {
        console.error(
            "❌ Garment manager is not available"
        );

        return null;
    }

    console.log(
        "✅ Garment manager found:",
        manager
    );


    if (target === "shirt") {

        return (
            manager.shirt ||
            manager.currentShirt ||
            manager.shirtGarment ||
            null
        );
    }


    if (target === "pant") {

        return (
            manager.pant ||
            manager.currentPant ||
            manager.pantGarment ||
            null
        );
    }


    console.error(
        "❌ Invalid target:",
        target
    );

    return null;
    console.log(window.garmentManager);
console.log(window.garmentManager.shirt);
}

// // =====================================================
// APPLY COLOR
// =====================================================

function applyGarmentColor(target,color){
    console.log("Color Target:", target);
    console.log("Color garment:", garment);

    const garment = getSelectedGarment(target);
    console.log("Selected Garment:", garment);
    if(!garment){
        console.warn(`${target} is not loaded`);
        return;
    }
    garment.traverse((child)=>{
        if(child.isMesh && child.material){
            child.material.color.set(color);
            child.material.needsUpdate= true;
        }
    });

    console.log(`${target} color updated`,color);
}


// =====================================================
// APPLY FABRIC TEXTURE
// =====================================================

function applyGarmentFabric(
    target,
    texturePath
) {

    const garment =
        getSelectedGarment(
            target
        );

    if (!garment) {

        console.warn(
            `${target} is not loaded`
        );

        return;
    }

    const loader =
        new THREE.TextureLoader();

    loader.load(

        texturePath,

        function(texture) {

            texture.wrapS =
                THREE.RepeatWrapping;

            texture.wrapT =
                THREE.RepeatWrapping;

            texture.repeat.set(
                4,
                4
            );

            garment.traverse(
                function(child) {

                    if (
                        child.isMesh &&
                        child.material
                    ) {

                        child.material.map =
                            texture;

                        child.material.color.set(
                            0xffffff
                        );

                        child.material.needsUpdate =
                            true;
                    }
                }
            );

            console.log(
                "Fabric applied:",
                texturePath
            );
        },

        undefined,

        function(error) {

            console.error(
                "Fabric loading failed:",
                texturePath,
                error
            );
        }
    );
}



// =====================================================
// APPLY PATTERN
// =====================================================
function applyGarmentPattern(
    target,
    texturePath
) {

    const garment =
        getSelectedGarment(
            target
        );

    if (!garment) {

        console.warn(
            `${target} is not loaded`
        );

        return;
    }

    const loader =
        new THREE.TextureLoader();

    loader.load(

        texturePath,

        function(texture) {

            texture.wrapS =
                THREE.RepeatWrapping;

            texture.wrapT =
                THREE.RepeatWrapping;

            texture.repeat.set(
                5,
                5
            );

            garment.traverse(
                function(child) {

                    if (
                        child.isMesh &&
                        child.material
                    ) {

                        child.material.map =
                            texture;

                        child.material.color.set(
                            0xffffff
                        );

                        child.material.needsUpdate =
                            true;
                    }
                }
            );

            console.log(
                "Pattern applied:",
                texturePath
            );
        },

        undefined,

        function(error) {

            console.error(
                "Pattern loading failed:",
                texturePath,
                error
            );
        }
    );
}

// =====================================================
// REMOVE TEXTURE / PATTERN
// =====================================================

function clearGarmentTexture(target){
    const garment = getSelectedGarment(target);
    if(!garment){
        return;
    }

    garment.traverse((child)=>{
        if(child.isMesh && child.material){
            child.material.map = null;
            child.material.needsUpdate =true;
        }
    });

    console.log(`${target} texture cleared`)
}


// apply globle avaialabel 
window.applyGarmentFabric =
    applyGarmentFabric;

window.applyGarmentPattern =
    applyGarmentPattern;

window.clearGarmentTexture =
    clearGarmentTexture;

window.applyGarmentColor =
    applyGarmentColor;