
// =====================================================
// bodyEngine.js
// Body Geometry and Runtime Body Data Controller
// =====================================================

import {getBoundingBox, getObjectSize, getObjectCenter} from "./helper.js";

export class BodyEngine {
    constructor(body) {
        this.body = body;
        this.box = null;
        this.size = null;
        this.center = null;
        this.update();
        console.log("✅ Body Engine Initialized");
    }

    setBody(body) {
        if (!body) {
            console.error("❌ Body is required");
            return false;
        }

        this.body = body;
        return this.update();
    }

    update() {
        if (!this.body) {
            console.error("❌ Body is not available");
            return false;
        }

        this.body.updateMatrixWorld(true);

        this.box = getBoundingBox(this.body);
        this.size = getObjectSize(this.body);
        this.center = getObjectCenter(this.body);

        if (!this.box || !this.size || !this.center) {
            console.error("❌ Failed to calculate body geometry");
            return false;
        }

        return true;
    }

    getBoundingBox() {
        this.update();
        return this.box;
    }

    getSize() {
        this.update();
        return this.size;
    }

    getCenter() {
        this.update();
        return this.center;
    }

    getBodyData() {
        if (!this.update()) {
            return null;
        }

        return {
            box: this.box.clone(),
            size: this.size.clone(),
            center: this.center.clone()
        };
    }

    getHeight() {
        return this.size ? this.size.y : 0;
    }

    getWidth() {
        return this.size ? this.size.x : 0;
    }

    getDepth() {
        return this.size ? this.size.z : 0;
    }

    getTop() {
        return this.box ? this.box.max.y : 0;
    }

    getBottom() {
        return this.box ? this.box.min.y : 0;
    }

    getFront() {
        return this.box ? this.box.max.z : 0;
    }

    getBack() {
        return this.box ? this.box.min.z : 0;
    }

    isValid() {
        return !!(
            this.body &&
            this.box &&
            this.size &&
            this.size.x > 0 &&
            this.size.y > 0 &&
            this.size.z > 0
        );
    }
}
