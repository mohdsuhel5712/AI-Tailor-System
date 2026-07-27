// /*
// ===========================================================
// File : viewer.js
// Folder :
// static/js/
// Project :
// AI Tailor System
// Purpose
// -------
// 1. Load Personalized Human Body OBJ
// 2. Display Human Body
// 3. Load Shirt OBJ + MTL
// 4. Automatically Fit Shirt to Personalized Body
// 5. Align Shirt to Body
// 6. Add Realistic Lighting
// 7. Enable Orbit Controls
// 8. Render 3D Viewer
// ===========================================================
// */
// // =========================================================
// // 1. THREE.JS SCENE
// // =========================================================
// const scene = new THREE.Scene();
// scene.background = new THREE.Color(0xf5f5f5);
// // =========================================================
// // 2. VIEWER CONTAINER
// // =========================================================
// const viewer = document.getElementById("viewer");
// // =========================================================
// // 3. CAMERA
// // =========================================================
// const camera = new THREE.PerspectiveCamera(
//     45,
//     viewer.clientWidth / viewer.clientHeight,
//     0.1,
//     100
// );
// camera.position.set(
//     0,
//     1.8,
//     5
// );
// // =========================================================
// // 4. RENDERER
// // =========================================================
// const renderer = new THREE.WebGLRenderer({
//     antialias: true
// });
// renderer.setPixelRatio(
//     window.devicePixelRatio
// );
// renderer.setSize(
//     viewer.clientWidth,
//     viewer.clientHeight
// );
// renderer.shadowMap.enabled = true;
// viewer.appendChild(
//     renderer.domElement
// );
// // =========================================================
// // 5. LIGHTING
// // =========================================================
// const ambientLight =
//     new THREE.AmbientLight(
//         0xffffff,
//         0.5
//     );
// scene.add(
//     ambientLight
// );
// const keyLight =
//     new THREE.DirectionalLight(
//         0xffffff,
//         1
//     );
// keyLight.position.set(
//     5,
//     10,
//     5
// );
// keyLight.castShadow = true;
// scene.add(
//     keyLight
// );
// const fillLight =
//     new THREE.DirectionalLight(
//         0xffffff,
//         0.8
//     );
// fillLight.position.set(
//     -5,
//     4,
//     -2
// );
// scene.add(
//     fillLight
// );
// // =========================================================
// // 6. GRID
// // =========================================================
// const grid =
//     new THREE.GridHelper(
//         5,
//         10,
//         0x888888,
//         0xcccccc
//     );
// scene.add(
//     grid
// );
// // =========================================================
// // 7. ORBIT CONTROLS
// // =========================================================
// const controls =
//     new THREE.OrbitControls(
//         camera,
//         renderer.domElement
//     );
// // Prevent camera from going below ground
// controls.minPolarAngle = 0.5;
// controls.maxPolarAngle =
//     Math.PI / 2;
// // Smooth camera movement
// controls.enableDamping = true;
// controls.dampingFactor = 0.08;
// // Camera rotation target
// controls.target.set(
//     0,
//     1,
//     0
// );
// // =========================================================
// // 8. GLOBAL VARIABLES
// // =========================================================
// let humanBody = null;
// let shirt = null;
// let bodySize = null;
// let bodyBox = null;
// // =========================================================
// // 9. OBJ LOADER
// // =========================================================
// const objLoader =
//     new THREE.OBJLoader();
// // =========================================================
// // 10. LOAD PERSONALIZED HUMAN BODY
// // =========================================================
// objLoader.load(
//     "/static/generated/processed_body.obj",
//     function (object) {
//         console.log(
//             "================================="
//         );
//         console.log(
//             "PERSONALIZED HUMAN BODY LOADED"
//         );
//         console.log(
//             "================================="
//         );
//         // =================================================
//         // BODY MATERIAL
//         // =================================================
//         object.traverse(
//             function (child) {
//                 if (child.isMesh) {
//                     child.material =
//                         new THREE.MeshStandardMaterial({
//                             color: 0xd9b38c,
//                             roughness: 0.9,
//                             metalness: 0.0
//                         });
//                     child.castShadow =
//                         true;
//                     child.receiveShadow =
//                         true;
//                 }
//             }
//         );
//         // =================================================
//         // BODY BOUNDING BOX
//         // =================================================
//         bodyBox = new THREE.Box3().setFromObject( object);
//         const bodyCenter =bodyBox.getCenter(new THREE.Vector3() );
//         bodySize =bodyBox.getSize( new THREE.Vector3());
//         console.log(
//             "BODY SIZE:",
//             bodySize
//         );
//         console.log(
//             "BODY CENTER:",
//             bodyCenter
//         );
//         // =================================================
//         // CENTER BODY
//         // =================================================
//         object.position.sub(
//             bodyCenter
//         );
//         // =================================================
//         // PUT FEET ON GROUND
//         // =================================================
//         object.position.y +=
//             bodySize.y / 2;
//         // =================================================
//         // SAVE BODY
//         // =================================================
//         humanBody =
//             object;
//         // =================================================
//         // ADD BODY TO SCENE
//         // =================================================
//         scene.add(
//             humanBody
//         );
//         console.log(
//             "PERSONALIZED BODY ADDED TO SCENE"
//         );
//         // =================================================
//         // LOAD SHIRT
//         // =================================================
//         loadShirt();
//         loadPant(object);
//     },
//     // =====================================================
//     // BODY LOADING PROGRESS
//     // =====================================================
//     function (xhr) {
//         if (xhr.total) {
//             console.log(
//                 "Body Loading: " +
//                 (
//                     xhr.loaded /
//                     xhr.total *
//                     100
//                 ).toFixed(1) +
//                 "%"
//             );
//         }
//     },
//     // =====================================================
//     // BODY LOADING ERROR
//     // =====================================================
//     function (error) {
//         console.error(
//             "BODY LOADING ERROR:",
//             error
//         );
//     }
// );
// // =========================================================
// // 11. LOAD SHIRT
// // =========================================================
// function loadShirt() {
//     // =====================================================
//     // MTL LOADER
//     // =====================================================
//     const mtlLoader =
//         new THREE.MTLLoader();
//     // =====================================================
//     // LOAD SHIRT MATERIAL
//     // =====================================================
//     mtlLoader.load(
//         "/static/garments/shirts/Male_Shirt.mtl",
//         function (materials) {
//             console.log(
//                 "SHIRT MATERIAL LOADED"
//             );
//             materials.preload();
//             // =================================================
//             // OBJ LOADER
//             // =================================================
//             const shirtLoader =
//                 new THREE.OBJLoader();
//             shirtLoader.setMaterials(
//                 materials
//             );
//             // =================================================
//             // LOAD SHIRT OBJ
//             // =================================================
//             shirtLoader.load(
//                 "/static/garments/shirts/Male_Shirt.obj",
//                 function (loadedShirt) {
//                     console.log(
//                         "SHIRT OBJ LOADED SUCCESSFULLY"
//                     );
//                     // =============================================
//                     // SAVE SHIRT
//                     // =============================================
//                     shirt =
//                         loadedShirt;
//                     shirt.name =
//                         "Male_Shirt";
//                     // =============================================
//                     // AUTOMATIC SHIRT FITTING
//                     // =============================================
//                     autoFitShirtToBody(
//                         shirt,
//                         humanBody
//                     );
//                     // =============================================
//                     // ADD SHIRT TO SCENE
//                     // =============================================
//                     scene.add(
//                         shirt
//                     );
//                     console.log(
//                         "SHIRT ADDED TO SCENE"
//                     );
//                     console.log(
//                         "AUTOMATIC SHIRT FITTING COMPLETE"
//                     );
//                 },
//                 // =============================================
//                 // SHIRT LOADING PROGRESS
//                 // =============================================
//                 function (xhr) {
//                     if (xhr.total) {
//                         console.log(
//                             "Shirt Loading: " +
//                             (
//                                 xhr.loaded /
//                                 xhr.total *
//                                 100
//                             ).toFixed(1) +
//                             "%"
//                         );
//                     }
//                 },
//                 // =============================================
//                 // SHIRT LOADING ERROR
//                 // =============================================
//                 function (error) {
//                     console.error(
//                         "SHIRT LOADING ERROR:",
//                         error
//                     );
//                 }
//             );
//         },
//         // =====================================================
//         // MTL ERROR
//         // =====================================================
//         function (error) {
//             console.error(
//                 "MTL LOADING ERROR:",
//                 error
//             );
//         }
//     );
// }
// // =============
// // pant loader
// // ============
// // =====================================
// // LOAD PANT AND FIT ON BODY
// // =====================================
// // =====================================
// // LOAD AND FIT PANT
// // =====================================
// function loadPant(body) {
//     const loader = new THREE.OBJLoader();
//     loader.load(
//         // ---------------------------------
//         // PANT OBJ FILE
//         // ---------------------------------
//         "/static/garments/pants/pant.obj",
//         function (pant) {
//             pant.name = "Pant";
//             // ---------------------------------
//             // MATERIAL
//             // ---------------------------------
//             pant.traverse(function (child) {
//                 if (child.isMesh) {
//                     child.material =
//                         new THREE.MeshStandardMaterial({
//                             color: 0x222222,
//                             roughness: 0.9,
//                             metalness: 0.1,
//                             side: THREE.DoubleSide
//                         });
//                 }
//             });
//             // ---------------------------------
//             // FIT PANT ON BODY
//             // ---------------------------------
//             fitPantToBody(
//                 pant,
//                 body
//             );
//             // ---------------------------------
//             // ADD PANT TO SCENE
//             // ---------------------------------
//             scene.add(pant);
//             console.log(
//                 "✅ Pant loaded and fitted successfully"
//             );
//         },
//         // ---------------------------------
//         // PROGRESS
//         // ---------------------------------
//         undefined,
//         // ---------------------------------
//         // ERROR
//         // ---------------------------------
//         function (error) {
//             console.error(
//                 "❌ Error loading pant:",
//                 error
//             );
//         }
//     );
// }
// // =====================================
// // FIT PANT TO BODY
// // =====================================
// // =====================================
// // LOAD PANT
// // =====================================
// // =====================================================
// // LOAD PANT
// // =====================================================
// function loadPant(body) {
//     const loader = new THREE.OBJLoader();
//     loader.load(
//         "/static/garments/pants/pant.obj",
//         function (pant) {
//             pant.name = "Pant";
//             // =================================================
//             // MATERIAL
//             // =================================================
//             pant.traverse(function (child) {
//                 if (child.isMesh) {
//                     child.material =
//                         new THREE.MeshStandardMaterial({
//                             color: 0x222222,
//                             roughness: 0.9,
//                             metalness: 0.1,
//                             side: THREE.DoubleSide
//                         });
//                 }
//             });
//             // =================================================
//             // FIT PANT
//             // =================================================
//             fitPantToBody(pant, body);
//             // =================================================
//             // ADD TO SCENE
//             // =================================================
//             scene.add(pant);
//             console.log(
//                 "✅ PANT FITTED SUCCESSFULLY"
//             );
//         },
//         undefined,
//         function (error) {
//             console.error(
//                 "❌ PANT LOAD ERROR:",
//                 error
//             );
//         }
//     );
// }
// // =====================================================
// // FIT PANT TO BODY
// // =====================================================
// function fitPantToBody(pant, body) {
//     // =================================================
//     // RESET TRANSFORM
//     // =================================================
//     pant.position.set(
//         0,
//         0,
//         0
//     );
//     pant.rotation.set(
//         0,
//         0,
//         0
//     );
//     pant.scale.set(
//         1,
//         1,
//         1
//     );
//     // =================================================
//     // BODY BOUNDING BOX
//     // =================================================
//     const bodyBox =
//         new THREE.Box3()
//             .setFromObject(body);
//     const bodySize =
//         new THREE.Vector3();
//     bodyBox.getSize(
//         bodySize
//     );
//     // =================================================
//     // PANT BOUNDING BOX
//     // =================================================
//     const pantBox =
//         new THREE.Box3()
//             .setFromObject(pant);
//     const pantSize =
//         new THREE.Vector3();
//     pantBox.getSize(
//         pantSize
//     );
//     // =================================================
//     // PANT HEIGHT
//     // =================================================
//     // Pant covers lower 48% of body
//     const desiredPantHeight =
//         bodySize.y * 0.48;
//     const heightScale =
//         desiredPantHeight /
//         pantSize.y;
//     // =================================================
//     // FINAL SCALE
//     // =================================================
//     // Controlled width.
//     // Do not use complete body width.
//     const widthScale =
//         heightScale * 1.35;
//     const depthScale =
//         heightScale * 1.70;
//     pant.scale.set(
//         widthScale,
//         heightScale,
//         depthScale
//     );
//     // =================================================
//     // UPDATE PANT BOX
//     // =================================================
//     const fittedPantBox =
//         new THREE.Box3()
//             .setFromObject(pant);
//     // =================================================
//     // BODY CENTER
//     // =================================================
//     const bodyCenterX =
//         (bodyBox.min.x +
//          bodyBox.max.x) / 2;
//     const bodyCenterZ =
//         (bodyBox.min.z +
//          bodyBox.max.z) / 2;
//     const pantCenter =
//         new THREE.Vector3();
//     fittedPantBox.getCenter(
//         pantCenter
//     );
//     // =================================================
//     // CENTER PANT LEFT / RIGHT
//     // =================================================
//     pant.position.x +=
//         bodyCenterX -
//         pantCenter.x;
//     // =================================================
//     // CENTER PANT FRONT / BACK
//     // =================================================
//     pant.position.z +=
//         bodyCenterZ -
//         pantCenter.z;
//     // =================================================
//     // WAIST POSITION
//     // =================================================
//     const bodyHeight =
//         bodyBox.max.y -
//         bodyBox.min.y;
//     // Waist point
//     const waistY =
//         bodyBox.min.y +
//         bodyHeight * 0.56;
//     // Recalculate after X/Z alignment
//     const finalPantBox =
//         new THREE.Box3()
//             .setFromObject(pant);
//     // Move pant top to waist
//     pant.position.y +=
//         waistY -
//         finalPantBox.max.y;
//     // =================================================
//     // FINAL SMALL HIP CORRECTION
//     // =================================================
//     // This is intentionally small.
//     // It prevents the pant from floating
//     // away from the back of the body.
//     pant.position.z -= 0.015;
//     console.log(
//         "================================="
//     );
//     console.log(
//         "✅ PANT FITTED"
//     );
//     console.log(
//         "Pant Scale:",
//         pant.scale
//     );
//     console.log(
//         "Pant Position:",
//         pant.position
//     );
//     console.log(
//         "================================="
//     );
// }
// // =========================================================
// // 12. AUTOMATIC SHIRT FITTING
// // =========================================================
// function autoFitShirtToBody(
//     garment,
//     body
// ) {
//     console.log(
//         "STARTING AUTOMATIC SHIRT FITTING..."
//     );
//     // =====================================================
//     // BODY BOUNDING BOX
//     // =====================================================
//     const currentBodyBox =
//         new THREE.Box3().setFromObject(
//             body
//         );
//     const currentBodySize =
//         currentBodyBox.getSize(
//             new THREE.Vector3()
//         );
//     const bodyCenter =
//         currentBodyBox.getCenter(
//             new THREE.Vector3()
//         );
//     // =====================================================
//     // SHIRT ORIGINAL BOUNDING BOX
//     // =====================================================
//     const originalShirtBox =
//         new THREE.Box3().setFromObject(
//             garment
//         );
//     const originalShirtSize =
//         originalShirtBox.getSize(
//             new THREE.Vector3()
//         );
//     const originalShirtCenter =
//         originalShirtBox.getCenter(
//             new THREE.Vector3()
//         );
//     console.log(
//         "BODY SIZE:",
//         currentBodySize
//     );
//     console.log(
//         "ORIGINAL SHIRT SIZE:",
//         originalShirtSize
//     );
//     // =====================================================
//     // SHIRT FITTING CONFIGURATION
//     // =====================================================
//     /*
//     These values control the fitting.
//     chestEase
//     ----------
//     Extra space around chest.
//     waistEase
//     ----------
//     Extra space around waist.
//     shoulderEase
//     -------------
//     Extra shoulder space.
//     lengthRatio
//     -----------
//     Shirt height compared to body height.
//     */
//     const chestEase =
//         1.20;
//     const waistEase =
//         1.20;
//     const shoulderEase =
//         0.98;
//     const lengthRatio =
//         0.46;
//     // =====================================================
//     // TARGET SHIRT DIMENSIONS
//     // =====================================================
//     /*
//     The shirt is not scaled to the entire body.
//     Width:
//     Body width + fitting ease
//     Height:
//     Approximately upper body height
//     Depth:
//     Body depth + fitting ease
//     */
//     const targetShirtWidth =
//         currentBodySize.x *
//         chestEase;
//     const targetShirtHeight =
//         currentBodySize.y *
//         lengthRatio;
//     const targetShirtDepth =
//         currentBodySize.z *1.80;
//     // =====================================================
//     // CALCULATE SCALE
//     // =====================================================
//     // x y z 
//     const scaleX = targetShirtWidth / originalShirtSize.x;
//     const scaleY =targetShirtHeight /originalShirtSize.y;
//     const scaleZ =  targetShirtDepth /originalShirtSize.z;
//     // =====================================================
//     // APPLY NON-UNIFORM SCALE
//     // =====================================================
//     garment.scale.set(
//         scaleX,
//         scaleY,
//         scaleZ
//     );
//     console.log(
//         "SHIRT SCALE:",
//         garment.scale
//     );
//     // =====================================================
//     // UPDATE SHIRT BOUNDING BOX
//     // =====================================================
//     const fittedShirtBox =
//         new THREE.Box3().setFromObject(
//             garment
//         );
//     const fittedShirtSize =
//         fittedShirtBox.getSize(
//             new THREE.Vector3()
//         );
//     const fittedShirtCenter =
//         fittedShirtBox.getCenter(
//             new THREE.Vector3()
//         );
//     // =====================================================
//     // HORIZONTAL ALIGNMENT
//     // =====================================================
//     garment.position.x += bodyCenter.x -fittedShirtCenter.x;
//     garment.position.z +=bodyCenter.z -fittedShirtCenter.z;
//     // =====================================================
//     // VERTICAL ALIGNMENT
//     // =====================================================
//     /*
//     Shirt should start around
//     shoulder/chest region.
//     We do not use body.max.y directly
//     because the top of the body is the head.
//     */
//     const shirtTopTarget =
//         currentBodyBox.min.y +
//         currentBodySize.y *
//         0.84;
//     const shirtBottomTarget =
//         currentBodyBox.min.y +
//         currentBodySize.y *
//         0.42;
//     const fittedShirtTop =
//         fittedShirtBox.max.y;
//     const fittedShirtBottom =
//         fittedShirtBox.min.y;
//     // Align top first
//     garment.position.y +=
//         shirtTopTarget -
//         fittedShirtTop;
//     // Recalculate after top alignment
//     const updatedShirtBox =
//         new THREE.Box3().setFromObject(
//             garment
//         );
//     const updatedShirtBottom =
//         updatedShirtBox.min.y;
//     // Slight correction for shirt bottom
//     garment.position.y +=
//         shirtBottomTarget -
//         updatedShirtBottom;
//     // =====================================================
//     // FINAL ALIGNMENT
//     // =====================================================
//     const finalShirtBox =
//         new THREE.Box3().setFromObject(
//             garment
//         );
//     const finalShirtCenter =
//         finalShirtBox.getCenter(
//             new THREE.Vector3()
//         );
//     // Final X alignment
//     garment.position.x +=
//         bodyCenter.x -
//         finalShirtCenter.x;
//     // Final Z alignment
//     garment.position.z +=
//         bodyCenter.z -
//         finalShirtCenter.z;
//     // =====================================================
//     // DEBUG INFORMATION
//     // =====================================================
//     console.log(
//         "================================="
//     );
//     console.log(
//         "AUTOMATIC SHIRT FITTING COMPLETE"
//     );
//     console.log(
//         "FINAL SHIRT POSITION:",
//         garment.position
//     );
//     console.log(
//         "FINAL SHIRT SCALE:",
//         garment.scale
//     );
//     console.log(
//         "FINAL SHIRT SIZE:",
//         finalShirtBox.getSize(
//             new THREE.Vector3()
//         )
//     );
//     console.log(
//         "================================="
//     );
// }
// // =========================================================
// // 13. ANIMATION LOOP
// // =========================================================
// function animate() {
//     requestAnimationFrame(
//         animate
//     );
//     controls.update();
//     renderer.render(
//         scene,
//         camera
//     );
// }
// animate();
// // =========================================================
// // 14. WINDOW RESIZE
// // =========================================================
// window.addEventListener(
//     "resize",
//     function () {
//         camera.aspect =
//             viewer.clientWidth /
//             viewer.clientHeight;
//         camera.updateProjectionMatrix();
//         renderer.setSize(
//             viewer.clientWidth,
//             viewer.clientHeight
//         );
//     }
// );
// // =========================================================
// // 15. VIEWER READY
// // =========================================================
// console.log(
//     "================================="
// );
// console.log(
//     "AI TAILOR VIEWER READY"
// );
// console.log(
//     "================================="
// );
// ========== NEW AUTOMATIC GAREENTS LOADING APPLY ============
// ============================================================







// =====================================================
// viewer.js
// Main Three.js Viewer Controller
// =====================================================
// =====================================================
// IMPORT ENGINES
// =====================================================



import {BodyEngine}
from "./virtual_tryon/bodyEngine.js";
import {GarmentManager}
from "./virtual_tryon/garmentManager.js";
// =====================================================
// GLOBAL VARIABLES
// =====================================================
let scene;
let camera;
let renderer;
let controls;
let body;
let bodyEngine;
let garmentManager;
// =====================================================
// INITIALIZE VIEWER
// =====================================================
function initViewer() {
    // =================================================
    // SCENE
    // =================================================
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    // =================================================
    // CAMERA
    // =================================================
    camera = new THREE.PerspectiveCamera(45,window.innerWidth /window.innerHeight,0.1,1000);
    camera.position.set(0,1.2,3);
    // =================================================
    // RENDERER
    // =================================================
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize( window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled =true;
    document.getElementById("viewer-container").appendChild(renderer.domElement);
    // =================================================
    // ORBIT CONTROLS
    // =================================================
    controls =
        new THREE.OrbitControls(
            camera,
            renderer.domElement
        );
    controls.enableDamping =
        true;
    controls.target.set(
        0,
        1,
        0
    );
    // =================================================
    // LIGHTING
    // =================================================
    createLights();
    // =================================================
    // LOAD BODY
    // =================================================
    loadBody();
    // =================================================
    // RESIZE
    // =================================================
    window.addEventListener(
        "resize",
        onWindowResize
    );
    // =================================================
    // START RENDER LOOP
    // =================================================
    animate();
}
// =====================================================
// CREATE LIGHTS
// =====================================================
function createLights() {
    // ---------------------------------------------
    // AMBIENT LIGHT
    // ---------------------------------------------
    const ambientLight =
        new THREE.AmbientLight(
            0xffffff,
            1.5
        );
    scene.add(
        ambientLight
    );
    // ---------------------------------------------
    // KEY LIGHT
    // ---------------------------------------------
    const directionalLight =
        new THREE.DirectionalLight(
            0xffffff,
            2
        );
    directionalLight.position.set(
        3,
        5,
        3
    );
    directionalLight.castShadow =
        true;
    scene.add(
        directionalLight
    );
    // ---------------------------------------------
    // FILL LIGHT
    // ---------------------------------------------
    const fillLight =
        new THREE.DirectionalLight(
            0xffffff,
            1
        );
    fillLight.position.set(
        -3,
        2,
        2
    );
    scene.add(
        fillLight
    );
}
// =====================================================
// LOAD BODY
// =====================================================
function loadBody() {
    const loader =
        new THREE.OBJLoader();
    loader.load(
        // ---------------------------------------------
        // YOUR BODY FILE
        // ---------------------------------------------
        "/static/generated/processed_body.obj",
        function (loadedBody) {
            body =
                loadedBody;
            body.name =
                "Body";
            // -----------------------------------------
            // BODY MATERIAL
            // -----------------------------------------
            body.traverse(
                function (child) {
                    if (
                        child.isMesh
                    ) {
                        child.material =
                            new THREE.MeshStandardMaterial({
                                color: 0xd9a07c,
                                roughness: 0.8,
                                metalness: 0.0,
                                side: THREE.DoubleSide
                            });
                        child.castShadow =
                            true;
                        child.receiveShadow =
                            true;
                    }
                }
            );
            // -----------------------------------------
            // ADD BODY TO SCENE
            // -----------------------------------------
            scene.add(
                body
            );
            // -----------------------------------------
            // CREATE BODY ENGINE
            // -----------------------------------------
            bodyEngine =
                new BodyEngine(
                    body
                );
            // -----------------------------------------
            // CREATE GARMENT MANAGER
            // -----------------------------------------
            garmentManager =
                new GarmentManager(
                    scene,
                    body
                );
            console.log(
                "✅ Body loaded"
            );
            console.log(
                "✅ Body Engine initialized"
            );
            console.log(
                "✅ Garment Manager initialized"
            );
            // -----------------------------------------
            // OPTIONAL DEFAULT PANT
            // -----------------------------------------
            // loadDefaultPant();
        },
        undefined,
        function (error) {
            console.error(
                "❌ Body loading failed:",
                error
            );
        }
    );
}
// =====================================================
// LOAD DEFAULT PANT
// =====================================================
function loadDefaultPant() {
    if (
        !garmentManager
    ) {
        console.warn(
            "⚠️ Garment Manager not ready"
        );
        return;
    }
    garmentManager.loadGarment({
        type:
            "pants",
        modelPath:
            "/static/garments/pants/pant.obj",
        materialPath:
            null,
        fitType:
            "regular",
        color:
            0x222222
    });
}
// =====================================================
// USER: LOAD PANT
// =====================================================
function selectPant() {
    if (
        !garmentManager
    ) {
        console.warn(
            "⚠️ Garment Manager not ready"
        );
        return;
    }
    garmentManager.loadGarment({
        type:
            "pants",
        modelPath:
            "/static/garments/pants/pant.obj",
        fitType:
            "regular",
        color:
            0x222222
    });
}
// =====================================================
// USER: LOAD SHIRT
// =====================================================
function selectShirt() {
    if (
        !garmentManager
    ) {
        console.warn(
            "⚠️ Garment Manager not ready"
        );
        return;
    }
    garmentManager.loadGarment({
        type:
            "shirt",
        modelPath:
            "/static/garments/shirts/Male_Shirt.obj",
        materialPath:
            "/static/garments/shirts/Male_Shirt.mtl",
        fitType:
            "regular",
        color:
            0xffffff
    });
}
// =====================================================
// CHANGE FIT
// =====================================================
function changeGarmentFit(
    fitType
) {
    if (
        !garmentManager
    ) {
        return;
    }
    garmentManager.changeFit(
        fitType
    );
}
// =====================================================
// CHANGE COLOR
// =====================================================
function changeGarmentColor(
    color
) {
    if (
        !garmentManager
    ) {
        return;
    }
    garmentManager.changeColor(
        color
    );
}
// =====================================================
// CHANGE TEXTURE
// =====================================================
async function changeGarmentTexture(
    texturePath
) {
    if (
        !garmentManager
    ) {
        return;
    }
    await garmentManager.changeTexture(
        texturePath
    );
}
// =====================================================
// CHANGE FABRIC
// =====================================================
function changeGarmentFabric(
    fabricType
) {
    if (
        !garmentManager
    ) {
        return;
    }
    garmentManager.changeFabric(
        fabricType
    );
}
// =====================================================
// WINDOW RESIZE
// =====================================================
function onWindowResize() {
    camera.aspect =
        window.innerWidth /
        window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
}
// =====================================================
// ANIMATION LOOP
// =====================================================
function animate() {
    requestAnimationFrame(
        animate
    );
    controls.update();
    renderer.render(
        scene,
        camera
    );
}
// =====================================================
// START VIEWER
// =====================================================
initViewer();