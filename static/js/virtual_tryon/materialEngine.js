
// =====================================================
// materialEngine.js
// Runtime Garment Material, Fabric and Pattern Controller
// =====================================================

export class MaterialEngine {
    constructor() {
        this.textureLoader = new THREE.TextureLoader();
        this.textureCache = new Map();
        console.log("✅ Material Engine Initialized");
    }

    getMaterials(garment) {
        const materials = [];

        if (!garment) {
            return materials;
        }

        garment.traverse((child) => {
            if (!child.isMesh || !child.material) {
                return;
            }

            const childMaterials = Array.isArray(child.material)
                ? child.material
                : [child.material];

            childMaterials.forEach((material) => {
                if (material) {
                    materials.push(material);
                }
            });
        });

        return materials;
    }

    applyColor(garment, color) {
        if (!garment || color === null || color === undefined) {
            return;
        }

        const materials = this.getMaterials(garment);

        materials.forEach((material) => {
            if (material.color) {
                material.color.set(color);
            }

            material.needsUpdate = true;
        });

        console.log("🎨 Garment color applied:", color);
    }

    async applyTexture(garment, texturePath, repeatX = 1, repeatY = 1) {
        if (!garment || !texturePath) {
            throw new Error("Garment and texture path are required");
        }

        try {
            const texture = await this.loadTexture(texturePath);

            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(repeatX, repeatY);
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.needsUpdate = true;

            const materials = this.getMaterials(garment);

            materials.forEach((material) => {
                if (material.map && material.map !== texture) {
                    this.disposeTexture(material.map);
                }

                material.map = texture;

                if (material.color) {
                    material.color.set(0xffffff);
                }

                material.needsUpdate = true;
            });

            console.log("🧵 Texture applied:", texturePath);
            return texture;
        } catch (error) {
            console.error("❌ Texture loading failed:", texturePath, error);
            throw error;
        }
    }

    async applyFabric(garment, fabricType, texturePath = null) {
        if (!garment) {
            return null;
        }

        const fabricSettings = {
            cotton: {
                roughness: 0.85,
                metalness: 0.0,
                repeat: 4
            },
            denim: {
                roughness: 0.75,
                metalness: 0.0,
                repeat: 3
            },
            silk: {
                roughness: 0.25,
                metalness: 0.0,
                repeat: 2
            },
            leather: {
                roughness: 0.35,
                metalness: 0.0,
                repeat: 2
            },
            wool: {
                roughness: 0.95,
                metalness: 0.0,
                repeat: 4
            },
            polyester: {
                roughness: 0.55,
                metalness: 0.0,
                repeat: 4
            }
        };

        const type = String(fabricType || "cotton").toLowerCase();
        const settings = fabricSettings[type] || fabricSettings.cotton;

        this.setMaterialProperties(
            garment,
            settings.roughness,
            settings.metalness
        );

        if (texturePath) {
            return await this.applyTexture(
                garment,
                texturePath,
                settings.repeat,
                settings.repeat
            );
        }

        console.log("🧵 Fabric applied:", type);
        return null;
    }

    async applyPattern(garment, texturePath, repeatX = 5, repeatY = 5) {
        if (!garment || !texturePath) {
            throw new Error("Garment and pattern path are required");
        }

        const texture = await this.applyTexture(
            garment,
            texturePath,
            repeatX,
            repeatY
        );

        console.log("🧩 Pattern applied:", texturePath);
        return texture;
    }

    removeTexture(garment) {
        if (!garment) {
            return;
        }

        const materials = this.getMaterials(garment);

        materials.forEach((material) => {
            if (material.map) {
                this.disposeTexture(material.map);
                material.map = null;
            }

            material.needsUpdate = true;
        });

        console.log("🗑️ Garment texture removed");
    }

    clearTexture(garment) {
        this.removeTexture(garment);
    }

    setRoughness(garment, roughness) {
        if (!garment) {
            return;
        }

        const value = THREE.MathUtils.clamp(
            Number(roughness),
            0,
            1
        );

        const materials = this.getMaterials(garment);

        materials.forEach((material) => {
            material.roughness = value;
            material.needsUpdate = true;
        });

        console.log("🪡 Roughness updated:", value);
    }

    setMetalness(garment, metalness) {
        if (!garment) {
            return;
        }

        const value = THREE.MathUtils.clamp(
            Number(metalness),
            0,
            1
        );

        const materials = this.getMaterials(garment);

        materials.forEach((material) => {
            material.metalness = value;
            material.needsUpdate = true;
        });

        console.log("✨ Metalness updated:", value);
    }

    setMaterialProperties(garment, roughness, metalness) {
        if (!garment) {
            return;
        }

        const materials = this.getMaterials(garment);

        materials.forEach((material) => {
            if (roughness !== undefined) {
                material.roughness = roughness;
            }

            if (metalness !== undefined) {
                material.metalness = metalness;
            }

            material.needsUpdate = true;
        });
    }

    async loadTexture(texturePath) {
        if (this.textureCache.has(texturePath)) {
            return this.textureCache.get(texturePath);
        }

        const texture = await new Promise((resolve, reject) => {
            this.textureLoader.load(
                texturePath,
                resolve,
                undefined,
                reject
            );
        });

        this.textureCache.set(texturePath, texture);
        return texture;
    }

    disposeTexture(texture) {
        if (!texture) {
            return;
        }

        let isCached = false;

        for (const cachedTexture of this.textureCache.values()) {
            if (cachedTexture === texture) {
                isCached = true;
                break;
            }
        }

        if (!isCached) {
            texture.dispose();
        }
    }

    disposeGarmentMaterials(garment) {
        if (!garment) {
            return;
        }

        const materials = this.getMaterials(garment);

        materials.forEach((material) => {
            if (material.map) {
                this.disposeTexture(material.map);
                material.map = null;
            }

            material.dispose();
        });

        console.log("🗑️ Garment materials disposed");
    }
}


// =====================================================
// GLOBAL COMPATIBILITY HELPERS
// Existing HTML buttons can continue using these.
// Primary material control remains MaterialEngine.
// =====================================================

function getSelectedGarment(target) {
    const manager = window.garmentManager;

    if (!manager) {
        console.error("❌ Garment manager is not available");
        return null;
    }

    if (target === "shirt") {
        return manager.getShirt
            ? manager.getShirt()
            : manager.shirt || null;
    }

    if (target === "pant") {
        return manager.getPant
            ? manager.getPant()
            : manager.pant || null;
    }

    console.error("❌ Invalid garment target:", target);
    return null;
}

function getMaterialEngine() {
    const manager = window.garmentManager;

    if (!manager) {
        console.error("❌ Garment manager is not available");
        return null;
    }

    if (!manager.materialEngine) {
        console.error("❌ Material engine is not available");
        return null;
    }

    return manager.materialEngine;
}


// =====================================================
// GLOBAL COLOR FUNCTION
// =====================================================

function applyGarmentColor(target, color) {
    const garment = getSelectedGarment(target);

    if (!garment) {
        console.warn(`⚠️ ${target} is not loaded`);
        return;
    }

    const materialEngine = getMaterialEngine();

    if (!materialEngine) {
        return;
    }

    materialEngine.applyColor(garment, color);
}


// =====================================================
// GLOBAL FABRIC FUNCTION
// =====================================================

async function applyGarmentFabric(target, texturePath) {
    const garment = getSelectedGarment(target);

    if (!garment) {
        console.warn(`⚠️ ${target} is not loaded`);
        return;
    }

    const materialEngine = getMaterialEngine();

    if (!materialEngine) {
        return;
    }

    try {
        await materialEngine.applyFabric(
            garment,
            "cotton",
            texturePath
        );
    } catch (error) {
        console.error(
            "❌ Fabric application failed:",
            error
        );
    }
}


// =====================================================
// GLOBAL PATTERN FUNCTION
// =====================================================

async function applyGarmentPattern(target, texturePath) {
    const garment = getSelectedGarment(target);

    if (!garment) {
        console.warn(`⚠️ ${target} is not loaded`);
        return;
    }

    const materialEngine = getMaterialEngine();

    if (!materialEngine) {
        return;
    }

    try {
        await materialEngine.applyPattern(
            garment,
            texturePath,
            5,
            5
        );
    } catch (error) {
        console.error(
            "❌ Pattern application failed:",
            error
        );
    }
}


// =====================================================
// GLOBAL CLEAR TEXTURE FUNCTION
// =====================================================

function clearGarmentTexture(target) {
    const garment = getSelectedGarment(target);

    if (!garment) {
        console.warn(`⚠️ ${target} is not loaded`);
        return;
    }

    const materialEngine = getMaterialEngine();

    if (!materialEngine) {
        return;
    }

    materialEngine.removeTexture(garment);
}


// =====================================================
// EXISTING BUTTON COMPATIBILITY
// =====================================================

window.applyGarmentColor = applyGarmentColor;
window.applyGarmentFabric = applyGarmentFabric;
window.applyGarmentPattern = applyGarmentPattern;
window.clearGarmentTexture = clearGarmentTexture;
