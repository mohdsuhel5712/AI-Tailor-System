// =====================================================
// garmentManager.js
// Central Garment Controller
// =====================================================
// 2 FILE 

import { GarmentEngine } from "./garmentEngine.js";
import { FitEngine } from "./fitEngine.js";
import { MaterialEngine } from "./materialEngine.js";
// =====================================================
// GARMENT MANAGER
// =====================================================
export class GarmentManager {
    constructor(scene, body) {
        // ---------------------------------------------
        // THREE.JS SCENE
        // ---------------------------------------------
        this.scene = scene;
        // ---------------------------------------------
        // BODY MODEL
        // ---------------------------------------------
        this.body = body;
        // ---------------------------------------------
        // GARMENT ENGINE
        // ---------------------------------------------
        this.garmentEngine = new GarmentEngine();
        // ---------------------------------------------
        // FIT ENGINE
        // ---------------------------------------------
        this.fitEngine = new FitEngine( body
            );
        // ---------------------------------------------
        // MATERIAL ENGINE
        // ---------------------------------------------
        this.materialEngine =
            new MaterialEngine();
        // ---------------------------------------------
        // CURRENT GARMENT
        // ---------------------------------------------
        this.currentGarment = null;
        // ---------------------------------------------
        // CURRENT GARMENT DATA
        // ---------------------------------------------
        this.currentGarmentData = null;
        console.log(
            "✅ Garment Manager Initialized"
        );
    }
    // =================================================
    // LOAD GARMENT
    // =================================================
    async loadGarment({
        type = "pants",
        modelPath,
        materialPath = null,
        texturePath = null,
        fitType = "regular",
        color = null
    }) {
        console.log(
            "👕 Loading garment..."
        );
        // ---------------------------------------------
        // REMOVE OLD GARMENT
        // ---------------------------------------------
        this.removeCurrentGarment();
        try {
            // =========================================
            // 1. LOAD OBJ / GLB
            // =========================================
            const garment =
                await this.garmentEngine.load(
                    modelPath,
                    materialPath
                );
                this.garmentEngine.prepareGarment(garment);
            console.log(
                "✅ Garment model loaded"
            );
            // =========================================
            // 2. FIT GARMENT
            // =========================================
            this.fitEngine.fitGarment(
                garment,
                type,
                fitType
            );
            console.log(
                "✅ Garment fitted"
            );
            // =========================================
            // 3. APPLY COLOR
            // =========================================
            if (
                color
            ) {
                this.materialEngine.applyColor(
                    garment,
                    color
                );
            }
            // =========================================
            // 4. APPLY TEXTURE
            // =========================================
            if (
                texturePath
            ) {
                await this.materialEngine.applyTexture(
                    garment,
                    texturePath
                );
            }
            // =========================================
            // 5. ADD TO SCENE
            // =========================================
            this.scene.add(
                garment
            );
            // =========================================
            // 6. SAVE CURRENT GARMENT
            // =========================================
            this.currentGarment =
                garment;
            this.currentGarmentData = {
                type,
                modelPath,
                materialPath,
                texturePath,
                fitType,
                color
            };
            console.log(
                "🎉 Garment added to scene"
            );
            return garment;
        }
        catch (
            error
        ) {
            console.error(
                "❌ Garment loading failed:",
                error
            );
            return null;
        }
    }
    // =================================================
    // REMOVE CURRENT GARMENT
    // =================================================
    removeCurrentGarment() {
        if (
            !this.currentGarment
        ) {
            return;
        }
        this.scene.remove(
            this.currentGarment
        );
        // Dispose geometry/material
        this.currentGarment.traverse(
            function (child) {
                if (
                    child.isMesh
                ) {
                    if (
                        child.geometry
                    ) {
                        child.geometry.dispose();
                    }
                    if (
                        child.material
                    ) {
                        if (
                            Array.isArray(
                                child.material
                            )
                        ) {
                            child.material.forEach(
                                material =>
                                    material.dispose()
                            );
                        }
                        else {
                            child.material.dispose();
                        }
                    }
                }
            }
        );
        this.currentGarment =
            null;
        this.currentGarmentData =
            null;
        console.log(
            "🗑️ Old garment removed"
        );
    }
    // =================================================
    // CHANGE FIT
    // =================================================
    changeFit(
        fitType
    ) {
        if (
            !this.currentGarment
        ) {
            console.warn(
                "⚠️ No garment loaded"
            );
            return;
        }
        const type =
            this.currentGarmentData.type;
        this.fitEngine.fitGarment(
            this.currentGarment,
            type,
            fitType
        );
        this.currentGarmentData.fitType =
            fitType;
        console.log(
            "👖 Fit changed to:",
            fitType
        );
    }
    // =================================================
    // CHANGE COLOR
    // =================================================
    changeColor(
        color
    ) {
        if (
            !this.currentGarment
        ) {
            console.warn(
                "⚠️ No garment loaded"
            );
            return;
        }
        this.materialEngine.applyColor(
            this.currentGarment,
            color
        );
        this.currentGarmentData.color =
            color;
        console.log(
            "🎨 Color changed:",
            color
        );
    }
    // =================================================
    // CHANGE TEXTURE
    // =================================================
    async changeTexture(
        texturePath
    ) {
        if (
            !this.currentGarment
        ) {
            console.warn(
                "⚠️ No garment loaded"
            );
            return;
        }
        await this.materialEngine.applyTexture(
            this.currentGarment,
            texturePath
        );
        this.currentGarmentData.texturePath =
            texturePath;
        console.log(
            "🧵 Texture changed"
        );
    }
    // =================================================
    // GET CURRENT GARMENT
    // =================================================
    getCurrentGarment() {
        return this.currentGarment;
    }
    // =================================================
    // GET GARMENT DATA
    // =================================================
    getCurrentGarmentData() {
        return this.currentGarmentData;
    }
}