
// =====================================================
// fitEngine.js
// Body-Relative Garment Fitting Engine
// Shirt: Upper-Body Fit
// Pant: Waist-to-Ankle Fit
// =====================================================

import { getBoundingBox, getObjectSize, getObjectCenter } from "./helper.js";

export class FitEngine {
    constructor(body) {
        this.body = body;
        this.bodyBox = null;
        this.bodySize = null;
        this.bodyCenter = null;
        this.updateBodyData();
        console.log("✅ Fit Engine Initialized");
    }

    // =================================================
    // UPDATE BODY DATA
    // =================================================

    updateBodyData() {
        if (!this.body) {
            console.error("❌ Body is not available");
            return false;
        }

        this.body.updateMatrixWorld(true);
        this.bodyBox = getBoundingBox(this.body);
        this.bodySize = getObjectSize(this.body);
        this.bodyCenter = getObjectCenter(this.body);

        if (!this.bodyBox || !this.bodySize) {
            console.error("❌ Unable to calculate body bounds");
            return false;
        }

        console.log("📏 Body Size:", this.bodySize);
        console.log("📍 Body Center:", this.bodyCenter);
        return true;
    }

    // =================================================
    // MAIN FITTING
    // =================================================

    fitGarment(garment, garmentType = "shirt", fitType = "regular") {
        if (!garment) {
            console.error("❌ Garment is required");
            return null;
        }

        if (!this.updateBodyData()) {
            return null;
        }

        garment.updateMatrixWorld(true);

        const type = garmentType.toLowerCase();

        console.log("👕 Fitting:", type);
        console.log("📏 Fit Type:", fitType);

        if (type === "shirt" || type === "tshirt") {
            return this.fitShirt(garment, fitType);
        }

        if (type === "pant" || type === "pants") {
            return this.fitPant(garment, fitType);
        }

        console.error("❌ Unknown garment type:", garmentType);
        return null;
    }

    // =================================================
    // SHIRT FIT
    // =================================================

    fitShirt(garment, fitType = "regular") {
        const garmentSize = getObjectSize(garment);

        if (!this.isValidSize(garmentSize)) {
            console.error("❌ Invalid shirt size");
            return null;
        }

        const fit = this.getFitFactors(fitType);

        const targetWidth = this.bodySize.x * 0.94 * fit.width;
        const targetHeight = this.bodySize.y * 0.43 * fit.height;
        const targetDepth = this.bodySize.z * 1.03 * fit.depth;

        const scaleX = targetWidth / garmentSize.x;
        const scaleY = targetHeight / garmentSize.y;
        const scaleZ = targetDepth / garmentSize.z;

        garment.scale.set(scaleX, scaleY, scaleZ);
        garment.updateMatrixWorld(true);

        this.centerGarmentOnBodyX(garment);
        this.positionShirtVertically(garment);
        this.centerGarmentOnBodyZ(garment);

        garment.position.z += this.bodySize.z * 0.015;
        garment.updateMatrixWorld(true);

        console.log("👕 Shirt fitted to upper body");
        console.log("📏 Shirt Scale:", garment.scale);
        console.log("📍 Shirt Position:", garment.position);

        this.checkCollision(garment);

        return garment;
    }

    // =================================================
    // PANT FIT
    // =================================================

    fitPant(garment, fitType = "regular") {
        const garmentSize = getObjectSize(garment);

        if (!this.isValidSize(garmentSize)) {
            console.error("❌ Invalid pant size");
            return null;
        }

        const fit = this.getFitFactors(fitType);

        const ankleLevel = this.bodyBox.min.y + this.bodySize.y * 0.02;
        const waistLevel = this.bodyBox.min.y + this.bodySize.y * 0.58;
        const targetHeight = waistLevel - ankleLevel;
        const targetWidth = this.bodySize.x * 0.88 * fit.width;
        const targetDepth = this.bodySize.z * 1.05 * fit.depth;

        const scaleX = targetWidth / garmentSize.x;
        const scaleY = targetHeight / garmentSize.y;
        const scaleZ = targetDepth / garmentSize.z;

        garment.scale.set(scaleX, scaleY, scaleZ);
        garment.updateMatrixWorld(true);

        this.centerGarmentOnBodyX(garment);
        this.positionGarmentTop(garment, waistLevel);
        this.centerGarmentOnBodyZ(garment);

        garment.position.z += this.bodySize.z * 0.03;
        garment.updateMatrixWorld(true);

        console.log("👖 Pant fitted from waist to ankle");
        console.log("📏 Pant Scale:", garment.scale);
        console.log("📍 Pant Position:", garment.position);

        this.checkCollision(garment);

        return garment;
    }

    // =================================================
    // FIT FACTORS
    // =================================================

    getFitFactors(fitType) {
        switch (fitType?.toLowerCase()) {
            case "slim":
                return {
                    width: 0.95,
                    height: 1.0,
                    depth: 0.96
                };

            case "loose":
                return {
                    width: 1.08,
                    height: 1.03,
                    depth: 1.10
                };

            case "regular":
            default:
                return {
                    width: 1.0,
                    height: 1.0,
                    depth: 1.0
                };
        }
    }

    // =================================================
    // CENTER GARMENT ON BODY X
    // =================================================

    centerGarmentOnBodyX(garment) {
        garment.updateMatrixWorld(true);

        const garmentBox = getBoundingBox(garment);
        const garmentCenterX = (garmentBox.min.x + garmentBox.max.x) / 2;

        garment.position.x += this.bodyCenter.x - garmentCenterX;
        garment.updateMatrixWorld(true);
    }

    // =================================================
    // CENTER GARMENT ON BODY Z
    // =================================================

    centerGarmentOnBodyZ(garment) {
        garment.updateMatrixWorld(true);

        const garmentBox = getBoundingBox(garment);
        const garmentCenterZ = (garmentBox.min.z + garmentBox.max.z) / 2;

        garment.position.z += this.bodyCenter.z - garmentCenterZ;
        garment.updateMatrixWorld(true);
    }

    // =================================================
    // POSITION SHIRT
    // =================================================

    positionShirtVertically(garment) {
        garment.updateMatrixWorld(true);

        const garmentBox = getBoundingBox(garment);
        const garmentTop = garmentBox.max.y;
        const targetTop = this.bodyBox.max.y - this.bodySize.y * 0.07;

        garment.position.y += targetTop - garmentTop;
        garment.updateMatrixWorld(true);
    }

    // =================================================
    // POSITION PANT TOP
    // =================================================

    positionGarmentTop(garment, targetTop) {
        garment.updateMatrixWorld(true);

        const garmentBox = getBoundingBox(garment);

        garment.position.y += targetTop - garmentBox.max.y;
        garment.updateMatrixWorld(true);
    }

    // =================================================
    // VALIDATE SIZE
    // =================================================

    isValidSize(size) {
        return size &&
            size.x > 0 &&
            size.y > 0 &&
            size.z > 0;
    }

    // =================================================
    // COLLISION CHECK
    // =================================================

    checkCollision(garment) {
        if (!this.bodyBox) {
            return false;
        }

        garment.updateMatrixWorld(true);

        const garmentBox = getBoundingBox(garment);
        const intersects = garmentBox.intersectsBox(this.bodyBox);

        if (intersects) {
            console.log("⚠️ Garment bounding box overlaps body");
        } else {
            console.log("✅ Garment bounding box is outside body");
        }

        return intersects;
    }

    // =================================================
    // APPLY FIT UPDATE
    // =================================================

    applyFit(garment, fitType, garmentType = null) {
        if (!garment) {
            console.warn("⚠️ Garment not available");
            return null;
        }

        if (!garmentType) {
            const name = garment.name?.toLowerCase() || "";

            if (name.includes("pant")) {
                garmentType = "pant";
            } else {
                garmentType = "shirt";
            }
        }

        return this.fitGarment(
            garment,
            garmentType,
            fitType
        );
    }
}

// =====================================================
// LEGACY GLOBAL FIT ACCESS
// =====================================================

window.fitGarmentToBody = function(garment, measurements, type, fitType = "regular") {
    if (!garment) {
        console.error("❌ Garment is required");
        return null;
    }

    if (!measurements) {
        console.error("❌ Measurements are required");
        return null;
    }

    const box = new THREE.Box3().setFromObject(garment);
    const size = new THREE.Vector3();

    box.getSize(size);

    if (size.x <= 0 || size.y <= 0 || size.z <= 0) {
        console.error("❌ Invalid garment geometry");
        return null;
    }

    let targetWidth = 0;
    let targetHeight = 0;

    if (type === "pant" || type === "pants" || type === "shorts") {
        targetWidth = Number(measurements.hip || 0) / 100;
        targetHeight = Number(measurements.leg_length || 0) / 100;
    } else if (type === "shirt" || type === "tshirt") {
        targetWidth = Number(measurements.chest || 0) / 100;
        targetHeight = Number(measurements.shirt_length || 0) / 100;
    }

    if (targetWidth <= 0 || targetHeight <= 0) {
        console.error("❌ Invalid garment measurements");
        return null;
    }

    const fitFactors = {
        slim: { width: 0.95, depth: 0.96 },
        regular: { width: 1.0, depth: 1.0 },
        loose: { width: 1.08, depth: 1.10 }
    };

    const fit = fitFactors[fitType] || fitFactors.regular;

    garment.scale.x *= (targetWidth / size.x) * fit.width;
    garment.scale.y *= targetHeight / size.y;
    garment.scale.z *= (targetWidth / size.x) * fit.depth;

    garment.updateMatrixWorld(true);

    console.log("👕 Auto Fit Applied:", {
        type,
        fitType,
        scale: garment.scale
    });

    return garment;
};
