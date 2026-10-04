
// =====================================================
// helper.js
// Shared Three.js Geometry and Object Utilities
// =====================================================

export function getBoundingBox(object) {
    if (!object) {
        console.error("❌ Object is required"); 
        return new THREE.Box3();
    }

    object.updateMatrixWorld(true);

    const box = new THREE.Box3();
    box.setFromObject(object);

    return box;
}

export function getObjectSize(object) {
    if (!object) {
        return new THREE.Vector3();
    }

    const box = getBoundingBox(object);
    const size = new THREE.Vector3();

    box.getSize(size);
    return size;
}

export function getObjectCenter(object) {
    if (!object) {
        return new THREE.Vector3();
    }

    const box = getBoundingBox(object);
    const center = new THREE.Vector3();

    box.getCenter(center);
    return center;
}

export function getObjectDimensions(object) {
    if (!object) {
        return null;
    }

    const box = getBoundingBox(object);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    box.getSize(size);
    box.getCenter(center);

    return {
        min: {
            x: box.min.x,
            y: box.min.y,
            z: box.min.z
        },
        max: {
            x: box.max.x,
            y: box.max.y,
            z: box.max.z
        },
        size,
        center
    };
}

export function getObjectHeight(object) {
    const box = getBoundingBox(object);
    return box.max.y - box.min.y;
}

export function getObjectWidth(object) {
    const box = getBoundingBox(object);
    return box.max.x - box.min.x;
}

export function getObjectDepth(object) {
    const box = getBoundingBox(object);
    return box.max.z - box.min.z;
}

export function getObjectBottom(object) {
    return getBoundingBox(object).min.y;
}

export function getObjectTop(object) {
    return getBoundingBox(object).max.y;
}

export function getObjectFront(object) {
    return getBoundingBox(object).max.z;
}

export function getObjectBack(object) {
    return getBoundingBox(object).min.z;
}

export function isValidObjectSize(size) {
    return !!(
        size &&
        size.x > 0 &&
        size.y > 0 &&
        size.z > 0
    );
}

export function isValidObject(object) {
    if (!object) {
        return false;
    }

    const size = getObjectSize(object);
    return isValidObjectSize(size);
}

export function getRelativeHeight(object, ratio) {
    if (!object) {
        return 0;
    }

    const box = getBoundingBox(object);
    const height = box.max.y - box.min.y;

    return box.min.y + height * ratio;
}

export function getRelativeWidth(object, ratio) {
    if (!object) {
        return 0;
    }

    const box = getBoundingBox(object);
    const width = box.max.x - box.min.x;

    return box.min.x + width * ratio;
}

export function getRelativeDepth(object, ratio) {
    if (!object) {
        return 0;
    }

    const box = getBoundingBox(object);
    const depth = box.max.z - box.min.z;

    return box.min.z + depth * ratio;
}

export function getObjectWorldPosition(object) {
    if (!object) {
        return new THREE.Vector3();
    }

    object.updateMatrixWorld(true);

    const position = new THREE.Vector3();
    object.getWorldPosition(position);

    return position;
}

export function resetTransform(object) {
    if (!object) {
        return;
    }

    object.position.set(0, 0, 0);
    object.rotation.set(0, 0, 0);
    object.scale.set(1, 1, 1);
    object.updateMatrixWorld(true);
}

export function cloneTransform(object) {
    if (!object) {
        return null;
    }

    return {
        position: object.position.clone(),
        rotation: object.rotation.clone(),
        scale: object.scale.clone()
    };
}

export function restoreTransform(object, transform) {
    if (!object || !transform) {
        return;
    }

    if (transform.position) {
        object.position.copy(transform.position);
    }

    if (transform.rotation) {
        object.rotation.copy(transform.rotation);
    }

    if (transform.scale) {
        object.scale.copy(transform.scale);
    }

    object.updateMatrixWorld(true);
}

export function logObjectBounds(name, object) {
    if (!object) {
        console.warn("⚠️ Cannot inspect missing object:", name);
        return null;
    }

    const data = getObjectDimensions(object);

    console.log("📦 " + name + " Bounds:", data);

    return data;
}
