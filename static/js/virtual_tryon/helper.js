// =====================================================
// helper.js
// Three.js Object Measurement Utilities
// =====================================================

export function getBoundingBox(object) {
    if(!object) {
        console.error("❌ Object is required");
        return new THREE.Box3();
    }

    object.updateMatrixWorld(true);

    const box=new THREE.Box3();

    box.setFromObject(object);

    return box;
}

export function getObjectSize(object) {
    const box=getBoundingBox(object);

    const size=new THREE.Vector3();

    box.getSize(size);

    return size;
}

export function getObjectCenter(object) {
    const box=getBoundingBox(object);

    const center=new THREE.Vector3();

    box.getCenter(center);

    return center;
}

export function getObjectDimensions(object) {
    const box=getBoundingBox(object);

    return {
        min:{
            x:box.min.x,
            y:box.min.y,
            z:box.min.z
        },
        max:{
            x:box.max.x,
            y:box.max.y,
            z:box.max.z
        },
        size:getObjectSize(object),
        center:getObjectCenter(object)
    };
}

export function resetTransform(object) {
    if(!object) {
        return;
    }

    object.position.set(0,0,0);
    object.rotation.set(0,0,0);
    object.scale.set(1,1,1);
    object.updateMatrixWorld(true);
}

export function logObjectBounds(name,object) {
    const data=getObjectDimensions(object);

    console.log("📦 "+name+" Bounds:",data);

    return data;
}