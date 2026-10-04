
// =====================================================
// garmentManager.js
// Shirt + Pant Runtime Controller
// =====================================================

import { GarmentEngine } from "./garmentEngine.js";
import { FitEngine } from "./fitEngine.js";
import { MaterialEngine } from "./materialEngine.js";

export class GarmentManager {
    constructor(scene, body) {
        this.scene = scene;
        this.body = body;
        this.garmentEngine = new GarmentEngine();
        this.fitEngine = new FitEngine(body);
        this.materialEngine = new MaterialEngine();
        this.shirt = null;
        this.pant = null;
        this.shirtData = null;
        this.pantData = null;
        console.log("✅ Garment Manager Initialized");
    }

    // =================================================
    // LOAD GARMENT
    // =================================================

    async loadGarment({
        type = "shirt",
        modelPath,
        materialPath = null,
        texturePath = null,
        fitType = "regular",
        color = null
    }) {
        if (!modelPath) {
            console.error("❌ Garment model path is required");
            return null;
        }

        if (type !== "shirt" && type !== "pant") {
            console.error("❌ Unsupported garment type:", type);
            return null;
        }

        console.log("👕 Loading:", type);

        try {
            if (type === "shirt") {
                this.removeShirt();
            } else {
                this.removePant();
            }

            const garment = await this.garmentEngine.load(modelPath, materialPath);

            if (!garment) {
                console.error("❌ Garment not loaded:", type);
                return null;
            }

            console.log("📦 Model loaded:", type);

            // FitEngine owns garment fitting and transformation.
            const fittedGarment = this.fitEngine.fitGarment(garment, type, fitType);

            if (!fittedGarment) {
                console.error("❌ Fitting failed:", type);
                return null;
            }

            fittedGarment.updateMatrixWorld(true);

            if (color !== null) {
                this.materialEngine.applyColor(fittedGarment, color);
            }

            if (texturePath) {
                await this.materialEngine.applyTexture(fittedGarment, texturePath);
            }

            fittedGarment.updateMatrixWorld(true);
            this.scene.add(fittedGarment);

            const garmentData = {
                type,
                modelPath,
                materialPath,
                texturePath,
                fitType,
                color
            };

            if (type === "shirt") {
                this.shirt = fittedGarment;
                this.shirtData = garmentData;
            } else {
                this.pant = fittedGarment;
                this.pantData = garmentData;
            }

            console.log("🎉 Added:", type);
            console.log("📏 Scale:", fittedGarment.scale);
            console.log("📍 Position:", fittedGarment.position);
            console.log("🔄 Rotation:", fittedGarment.rotation);

            return fittedGarment;
        } catch (error) {
            console.error("❌ Loading failed:", type, error);
            return null;
        }
    }

    // =================================================
    // LOAD SHIRT
    // =================================================

    async loadShirt(modelPath, fitType = "regular", color = null) {
        return await this.loadGarment({
            type: "shirt",
            modelPath,
            fitType,
            color
        });
    }

    // =================================================
    // LOAD PANT
    // =================================================

    async loadPant(modelPath, fitType = "regular", color = 0x222222) {
        return await this.loadGarment({
            type: "pant",
            modelPath,
            fitType,
            color
        });
    }

    // =================================================
    // REMOVE SHIRT
    // =================================================

    removeShirt() {
        if (!this.shirt) {
            return;
        }

        this.garmentEngine.remove(this.shirt, this.scene);
        this.shirt = null;
        this.shirtData = null;
        console.log("🗑️ Shirt removed");
    }

    // =================================================
    // REMOVE PANT
    // =================================================

    removePant() {
        if (!this.pant) {
            return;
        }

        this.garmentEngine.remove(this.pant, this.scene);
        this.pant = null;
        this.pantData = null;
        console.log("🗑️ Pant removed");
    }

    // =================================================
    // REMOVE ALL GARMENTS
    // =================================================

    removeAllGarments() {
        this.removeShirt();
        this.removePant();
        console.log("🗑️ All garments removed");
    }

    // =================================================
    // CHANGE SHIRT FIT
    // =================================================

    changeShirtFit(fitType) {
        if (!this.shirt) {
            console.warn("⚠️ Shirt not loaded");
            return null;
        }

        const fittedGarment = this.fitEngine.fitGarment(
            this.shirt,
            "shirt",
            fitType
        );

        if (!fittedGarment) {
            console.error("❌ Shirt fitting failed");
            return null;
        }

        this.shirt = fittedGarment;

        if (this.shirtData) {
            this.shirtData.fitType = fitType;
        }

        this.shirt.updateMatrixWorld(true);

        return this.shirt;
    }

    // =================================================
    // CHANGE PANT FIT
    // =================================================

    changePantFit(fitType) {
        if (!this.pant) {
            console.warn("⚠️ Pant not loaded");
            return null;
        }

        const fittedGarment = this.fitEngine.fitGarment(
            this.pant,
            "pant",
            fitType
        );

        if (!fittedGarment) {
            console.error("❌ Pant fitting failed");
            return null;
        }

        this.pant = fittedGarment;

        if (this.pantData) {
            this.pantData.fitType = fitType;
        }

        this.pant.updateMatrixWorld(true);

        return this.pant;
    }

    // =================================================
    // UPDATE GARMENT FIT
    // =================================================

    updateGarmentFit(type, fitType) {
        if (type === "shirt") {
            return this.changeShirtFit(fitType);
        }

        if (type === "pant") {
            return this.changePantFit(fitType);
        }

        console.warn("⚠️ Unknown garment type:", type);
        return null;
    }

    // =================================================
    // CHANGE SHIRT COLOR
    // =================================================

    changeShirtColor(color) {
        if (!this.shirt) {
            console.warn("⚠️ Shirt not loaded");
            return;
        }

        this.materialEngine.applyColor(this.shirt, color);

        if (this.shirtData) {
            this.shirtData.color = color;
        }
    }

    // =================================================
    // CHANGE PANT COLOR
    // =================================================

    changePantColor(color) {
        if (!this.pant) {
            console.warn("⚠️ Pant not loaded");
            return;
        }

        this.materialEngine.applyColor(this.pant, color);

        if (this.pantData) {
            this.pantData.color = color;
        }
    }

    // =================================================
    // GET SHIRT
    // =================================================

    getShirt() {
        return this.shirt;
    }

    // =================================================
    // GET PANT
    // =================================================

    getPant() {
        return this.pant;
    }

    // =================================================
    // GET GARMENT
    // =================================================

    getGarment(type) {
        if (type === "shirt") {
            return this.shirt;
        }

        if (type === "pant") {
            return this.pant;
        }

        return null;
    }

    // =================================================
    // GET GARMENT DATA
    // =================================================

    getGarmentData(type) {
        if (type === "shirt") {
            return this.shirtData;
        }

        if (type === "pant") {
            return this.pantData;
        }

        return null;
    }
}
