// =====================================================
// fitEngine.js
// Professional Garment Fitting Engine
// =====================================================
// 4 FILE 


import {getBoundingBox,getObjectSize,getObjectCenter} from "./helper.js";
// =====================================================
// FIT ENGINE
// =====================================================
export class FitEngine {
    constructor(body) {
        this.body = body;
        this.bodyBox = getBoundingBox(body);
        this.bodySize = getObjectSize(body);
        this.bodyCenter = getObjectCenter(body);
    }
    // =================================================
    // MAIN FIT FUNCTION
    // =================================================
    fitGarment(
        garment,
        garmentType = "pants",
        fitType = "regular"
    ) {
        console.log(
            "👕 Fitting garment:", garmentType
        );
        console.log(
            "📏 Fit type:",fitType
        );
        // ---------------------------------------------
        // 1. RESET TRANSFORM
        // ---------------------------------------------
        garment.position.set(0,0,0
        );
        garment.rotation.set(0,0,0
        );
        garment.scale.set(1, 1,1
        );
        // ---------------------------------------------
        // 2. GARMENT BOX
        // ---------------------------------------------
        let garmentBox =getBoundingBox(garment);
        let garmentSize =getObjectSize(garment);
        // ---------------------------------------------
        // 3. CALCULATE SCALE
        // ---------------------------------------------
        const scale =
            this.calculateScale(
                garmentSize,
                garmentType
            );
        // ---------------------------------------------
        // 4. APPLY FIT TYPE
        // ---------------------------------------------
        const fitScale =
            this.getFitScale(
                fitType,
                garmentType
            );
        garment.scale.set(
            scale.x * fitScale.x,
            scale.y * fitScale.y,
            scale.z * fitScale.z
        );
        // Update world matrix
        garment.updateMatrixWorld(
            true
        );
        // ---------------------------------------------
        // 5. X ALIGNMENT
        // ---------------------------------------------
        this.alignX(
            garment,
            garmentType
        );
        // ---------------------------------------------
        // 6. Y ALIGNMENT
        // ---------------------------------------------
        this.alignY(
            garment,
            garmentType
        );
        // ---------------------------------------------
        // 7. Z ALIGNMENT
        // ---------------------------------------------
        this.alignZ(
            garment,
            garmentType
        );
        // ---------------------------------------------
        // 8. ROTATION
        // ---------------------------------------------
        this.applyRotation(
            garment,
            garmentType
        );
        // ---------------------------------------------
        // 9. COLLISION CHECK
        // ---------------------------------------------
        this.checkCollision(
            garment
        );
        // ---------------------------------------------
        // 10. UPDATE FINAL DATA
        // ---------------------------------------------
        garment.updateMatrixWorld(
            true
        );
        console.log(
            "✅ Garment fitted successfully"
        );
        return garment;
    }
    // =================================================
    // SCALE CALCULATION
    // =================================================
    calculateScale(
        garmentSize,
        garmentType
    ) {
        // ---------------------------------------------
        // PANTS
        // ---------------------------------------------
        if (
            garmentType === "pants"
        ) {
            const desiredHeight =
                this.bodySize.y * 0.48;
            const uniformScale =
                desiredHeight /
                garmentSize.y;
            return {
                x: uniformScale,
                y: uniformScale,
                z: uniformScale
            };
        }
        // ---------------------------------------------
        // SHIRT
        // ---------------------------------------------
        if (
            garmentType === "shirt"
        ) {
            const desiredHeight =
                this.bodySize.y * 0.42;
            const uniformScale =
                desiredHeight /
                garmentSize.y;
            return {
                x: uniformScale,
                y: uniformScale,
                z: uniformScale
            };
        }
        // ---------------------------------------------
        // DEFAULT
        // ---------------------------------------------
        return {
            x: 1,
            y: 1,
            z: 1
        };
    }
    // =================================================
    // FIT TYPE
    // =================================================
    getFitScale(
        fitType,
        garmentType
    ) {
        // =============================================
        // PANTS
        // =============================================
        if (
            garmentType === "pants"
        ) {
            if (
                fitType === "slim"
            ) {
                return {
                    x: 1.18,
                    y: 1.0,
                    z: 1.18
                };
            }
            if (
                fitType === "loose"
            ) {
                return {
                    x: 1.35,
                    y: 1.0,
                    z: 1.35
                };
            }
            // REGULAR FIT
            return {
                x: 1.28,
                y: 1.0,
                z: 1.28
            };
        }
        // =============================================
        // SHIRT
        // =============================================
        if (
            garmentType === "shirt"
        ) {
            if (
                fitType === "slim"
            ) {
                return {
                    x: 1.05,
                    y: 1.0,
                    z: 1.05
                };
            }
            if (
                fitType === "loose"
            ) {
                return {
                    x: 1.25,
                    y: 1.0,
                    z: 1.25
                };
            }
            return {
                x: 1.15,
                y: 1.0,
                z: 1.15
            };
        }
        return {
            x: 1,
            y: 1,
            z: 1
        };
    }
    // =================================================
    // X ALIGNMENT
    // =================================================
    alignX(
        garment,
        garmentType
    ) {
        const garmentCenter =
            getObjectCenter(
                garment
            );
        const difference =
            this.bodyCenter.x -
            garmentCenter.x;
        garment.position.x +=
            difference;
        console.log(
            "↔ X aligned"
        );
    }
    // =================================================
    // Y ALIGNMENT
    // =================================================
    alignY(
        garment,
        garmentType
    ) {
        const garmentBox =
            getBoundingBox(
                garment
            );
        let targetY;
        // ---------------------------------------------
        // PANTS
        // ---------------------------------------------
        if (
            garmentType === "pants"
        ) {
            targetY =
                this.bodyBox.min.y +
                (
                    this.bodySize.y *
                    0.56
                );
        }
        // ---------------------------------------------
        // SHIRT
        // ---------------------------------------------
        else if (
            garmentType === "shirt"
        ) {
            targetY =
                this.bodyBox.max.y -
                (
                    this.bodySize.y *
                    0.22
                );
        }
        else {
            targetY =
                this.bodyCenter.y;
        }
        const difference =
            targetY -
            garmentBox.max.y;
        garment.position.y +=
            difference;
        console.log(
            "↕ Y aligned"
        );
    }
    // =================================================
    // Z ALIGNMENT
    // =================================================
    alignZ(
        garment,
        garmentType
    ) {
        const garmentCenter =
            getObjectCenter(
                garment
            );
        const difference =
            this.bodyCenter.z -
            garmentCenter.z;
        garment.position.z +=
            difference;
        console.log(
            "↔ Z aligned"
        );
    }
    // =================================================
    // ROTATION
    // =================================================
    applyRotation(
        garment,
        garmentType
    ) {
        // Default garment orientation
        garment.rotation.set(
            0,
            0,
            0
        );
        console.log(
            "🔄 Rotation applied"
        );
    }
    // =================================================
    // COLLISION CHECK
    // =================================================
    checkCollision(
        garment
    ) {
        const garmentBox =
            getBoundingBox(
                garment
            );
        const intersects =
            garmentBox.intersectsBox(
                this.bodyBox
            );
        if (
            intersects
        ) {
            console.log(
                "⚠️ Garment intersects body"
            );
        }
        else {
            console.log(
                "✅ No major collision"
            );
        }
        return intersects;
    }
}