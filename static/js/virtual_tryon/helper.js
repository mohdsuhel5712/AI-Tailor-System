// static/js/virtual_tryon/helper.js

export function getBoundingBox(object) {

    object.updateMatrixWorld(true);

    return new THREE.Box3()
        .setFromObject(object);
}


export function getObjectSize(object) {

    const box =
        getBoundingBox(object);

    const size =
        new THREE.Vector3();

    box.getSize(size);

    return size;
}


export function getObjectCenter(object) {

    const box =
        getBoundingBox(object);

    const center =
        new THREE.Vector3();

    box.getCenter(center);

    return center;
}


export function resetTransform(object) {

    object.position.set(0, 0, 0);

    object.rotation.set(0, 0, 0);

    object.scale.set(1, 1, 1);
}