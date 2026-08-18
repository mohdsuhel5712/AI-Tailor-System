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


// =====================================================
// viewer.js
// Task:
// 1. Load body
// 2. Load and fit shirt
// 3. Load and fit pant
// =====================================================

console.log("🔥 viewer.js started");

import {BodyEngine} from "./virtual_tryon/bodyEngine.js";
import {GarmentManager} from "./virtual_tryon/garmentManager.js";
// import {clearGarmentTexture} from "/static/js/virtual_tryon/materialEngine.js";


let scene;
let camera;
let renderer;
let controls;
let body;
let bodyEngine;
let garmentManager;
// new
let allGarments=[];

function initViewer(){
console.log("✅ initViewer started");

scene=new THREE.Scene();
scene.background=new THREE.Color(0x0b1220);
scene.fog=new THREE.Fog(0x0b1220,4,12);

const garmentManager  = new GarmentManager(scene);
window.garmentManager = garmentManager;

camera=new THREE.PerspectiveCamera(
45,
1,
0.1,
1000
);

camera.position.set(0,1.2,3);

renderer=new THREE.WebGLRenderer({
antialias:true,
alpha:false
});

renderer.setPixelRatio(
Math.min(
window.devicePixelRatio,
2
)
);

renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;

renderer.outputEncoding=THREE.sRGBEncoding;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1;

const viewerContainer=document.getElementById(
"viewer-container"
);

if(!viewerContainer){
console.error(
"❌ viewer-container not found"
);
return;
}

viewerContainer.appendChild(
renderer.domElement
);

controls=new THREE.OrbitControls(
camera,
renderer.domElement
);

controls.enableDamping=true;
controls.dampingFactor=0.06;
controls.enablePan=false;
controls.minDistance=1.5;
controls.maxDistance=7;
controls.minPolarAngle=Math.PI/3;
controls.maxPolarAngle=(Math.PI*2)/3;
controls.target.set(0,1,0);

createLights();
createStudioFloor();

onWindowResize();

loadBody();

window.addEventListener(
"resize",
onWindowResize
);

animate();
}

function createLights(){

const hemisphereLight=
new THREE.HemisphereLight(
0xbfd7ff,
0x111827,
1.5
);

scene.add(
hemisphereLight
);

const keyLight=
new THREE.DirectionalLight(
0xffffff,
2.2
);

keyLight.position.set(
4,
6,
5
);

keyLight.castShadow=true;

keyLight.shadow.mapSize.set(
2048,
2048
);

keyLight.shadow.camera.left=-5;
keyLight.shadow.camera.right=5;
keyLight.shadow.camera.top=5;
keyLight.shadow.camera.bottom=-5;

scene.add(
keyLight
);

const fillLight=
new THREE.DirectionalLight(
0xC6865B,
1
);

fillLight.position.set(
-5,
3,
2
);

scene.add(
fillLight
);

const rimLight=
new THREE.DirectionalLight(
0xC6865B,
1.2
);

rimLight.position.set(
3,
4,
-4
);

scene.add(
rimLight
);
}

function createStudioFloor(){

const floorGeometry=
new THREE.PlaneGeometry(
20,
20
);

const floorMaterial=
new THREE.MeshStandardMaterial({
color:0x111827,
roughness:0.92,
metalness:0.05
});

const floor=
new THREE.Mesh(
floorGeometry,
floorMaterial
);

floor.rotation.x=-Math.PI/2;
floor.position.y=-1.15;
floor.receiveShadow=true;

scene.add(
floor
);
}

function loadBody(){

console.log(
"🔄 Loading body"
);

const loader=
new THREE.OBJLoader();

loader.load(

"/static/generated/processed_body.obj",

async function(loadedBody){

body=loadedBody;

body.name="Body";

body.traverse(
(child)=>{

if(!child.isMesh){
return;
}

child.castShadow=true;
child.receiveShadow=true;

child.material=
new THREE.MeshStandardMaterial({
color:0xC6865A,
roughness:0.72,
metalness:0,
side:THREE.FrontSide
});

child.material.needsUpdate=true;

}
);

scene.add(
body
);

body.updateMatrixWorld(
true
);

const bodyBox=
new THREE.Box3()
.setFromObject(
body
);

const bodyCenter=
bodyBox.getCenter(
new THREE.Vector3()
);

const bodySize=
bodyBox.getSize(
new THREE.Vector3()
);

const maxBodySize=
Math.max(
bodySize.x,
bodySize.y,
bodySize.z
);

const cameraDistance=
maxBodySize*1.9;

camera.position.set(
bodyCenter.x,
bodyCenter.y,
bodyCenter.z+
cameraDistance
);

controls.target.copy(
bodyCenter
);

controls.update();

bodyEngine=
new BodyEngine(
body
);

garmentManager=new GarmentManager(scene,body);

window.garmentManager = garmentManager;
console.log("globle garment manager connected ! ",window.GarmentManager);
await loadGarmentsFromDatabase();

console.log(
"✅ Body loaded"
);

console.log(
"✅ Garment Manager initialized"
);

// Default shirt load

// await loadDefaultShirt();
// await applySelectedPant();
// await selectPant();

},

undefined,

function(error){

console.error(
"❌ Body loading failed:",
error
);

}

);
}

// =====================================================
// LOAD DEFAULT SHIRT
// =====================================================

async function loadDefaultShirt(){

if(!garmentManager){

console.warn(
"⚠️ Garment Manager not ready"
);

return;

}

const shirt=await garmentManager.loadGarment({

type:"shirt",

modelPath:
"/static/garments/shirts/Male_shirt.obj",

materialPath:
"/static/garments/shirts/Male_shirt.mtl",

fitType:"regular",

color:0xffffff

});

console.log(window.garmentManager.shirt);

if(shirt){

console.log(
"👕 Default shirt loaded"
);

}

}

// =====================================================
// SELECT SHIRT
// =====================================================

async function selectShirt(){

await loadDefaultShirt();

}

// =====================================================
// SELECT PANT
// =====================================================

async function selectPant(){

if(!garmentManager){

console.warn(
"⚠️ Garment Manager not ready"
);

return;

}

console.log(
"👖 Loading pant"
);

const pant=
await garmentManager.loadGarment({

type:"pant",

modelPath:
"/static/garments/pants/pant.obj",

materialPath:null,

fitType:"regular",

color:0x222222

});

if(pant){

console.log(
"👖 Pant loaded successfully"
);

}else{

console.error(
"❌ Pant was not loaded"
);

}

}

// =====================================================
// CHANGE FIT
// =====================================================

function changeGarmentFit(
fitType
){

if(!garmentManager){
return;
}

// Current manager uses
// separate shirt/pant methods

garmentManager.changeShirtFit(
fitType
);

}

// =====================================================
// CHANGE COLOR
// =====================================================

function changeGarmentColor(
color
){

if(!garmentManager){
return;
}

garmentManager.changeShirtColor(
color
);

}

// =====================================================
// RESIZE
// =====================================================

function onWindowResize(){

const viewerContainer=
document.getElementById(
"viewer-container"
);

if(
!viewerContainer||
!camera||
!renderer
){
return;
}

const width=
viewerContainer.clientWidth;

const height=
viewerContainer.clientHeight;

if(
width===0||
height===0
){
return;
}

camera.aspect=
width/height;

camera.updateProjectionMatrix();

renderer.setSize(
width,
height
);

}

// =====================================================
// ANIMATION
// =====================================================

function animate(){

requestAnimationFrame(
animate
);

if(controls){
controls.update();
}

if(
renderer&&
scene&&
camera
){

renderer.render(
scene,
camera
);

}

}

// =====================================================
// CONNECT HTML BUTTONS
// =====================================================



// new function for btn 
// =====================================================
// LOAD GARMENTS FROM DATABASE
// =====================================================

async function loadGarmentsFromDatabase(){
    try{
        const response = await fetch("/api/garments");
        const data = await response.json();

        if(!data.success){
            console.log("! garment api failed");
            return;
        }

        allGarments= data.garments;
        console.log("database garment loaded ! ",allGarments);
        fillGarmentDropdowns();
    }catch(error){
        console.log("garment api erro : ",error);
    }
    
}

// =====================================================
// FILL SHIRT AND PANT DROPDOWNS
// =====================================================


function fillGarmentDropdowns(){
    const shirtSelect = document.getElementById("shirtSelect");
    const pantSelect = document.getElementById("pantSelect");

    if(!shirtSelect || !pantSelect){
        console.warn("garment dropdown not found");
        return;
    }
    shirtSelect.innerHTML= `<option value="">
    Select Shirt
    </option>
    `;
    pantSelect.innerHTML = `
    <option value="">
    Select Pant
    </option>
    `;
    allGarments.forEach((garment)=>{
        const option = document.createElement("option");
        option.value=garment.garment_id;
        option.textContent = garment.garment_name;
        if(garment.category_id==1){
            shirtSelect.appendChild(option);
        }
        if(garment.category_id==2){
            pantSelect.appendChild(option);
        }

    });
    console.log("garment dropdown filles succesfully ! ")
}

// =====================================================
// APPLY SELECTED SHIRT
// =====================================================

async function applySelectedShirt(){
    const shirtSelect=document.getElementById("shirtSelect");
    if(!shirtSelect){
        console.log("shirt dropdown not found");
        return;
    }
    const garmentId=Number(shirtSelect.value);
    if(!garmentId){
        alert("Please select a shirt");
        return;
    }
    const garment=allGarments.find((item)=>item.garment_id===garmentId);
    if(!garment){
        console.log("Selected shirt is not found!");
        return;
    }
    console.log("Apply shirt!",garment);
    const modelPath=garment.glb_file
        ? "static/garments/"+garment.glb_file
        : garment.obj_file
        ? "static/garments/"+garment.obj_file
        : null;
    if(!modelPath){
        console.log("No GLB or OBJ file found for selected shirt!");
        return;
    }
    const shirt=await garmentManager.loadGarment({
        type:"shirt",
        modelPath:modelPath,
        materialPath:null,
        fitType:"regular",
        color:0xffffff
    });
    if(shirt){
        console.log("Selected shirt applied!",modelPath);
    }
}
// =====================================================
// APPLY SELECTED PANT
// =====================================================

async function applySelectedPant(){
    const pantSelect = document.getElementById("pantSelect");
    if(!pantSelect){
        console.log("pant dropdown not found !");
        return;
    }
    const garmentID = Number(pantSelect.value);
    if(!garmentID){
        alert("please select the pant ");
        return;
    }
    const garment = allGarments.find((item)=>item.garment_id===garmentID);
    if(!garment){
        console.log("selected pant not found ");
        return;
    }
    console.log("apply pant ",garment);
    const pant = await garmentManager.loadGarment({
        type:"pant",
        modelPath:"/static/garments/"+garment.obj_file,
        materialPath:null,
        fitType:"regular",
        color:0x222222
    });
    if(pant){
        console.log("select pant applied ! ");
    }
}

// same function calling 
document.addEventListener("DOMContentLoaded",()=>{
    console.log("loading garment dropdown ! ");
    loadGarmentsFromDatabase();
});




// =====================================================
// GET CUSTOMIZATION TARGET
// =====================================================

function getCustomizationTarget(){
    const targetSelect = document.getElementById("customizeTarget");
    if(!targetSelect){
        return "shirt";
    }
    return targetSelect.value;
}

// =====================================================
// CHANGE COLOR
// =====================================================
// function changeGarmentColor(color){
//     const target = getCustomizationTarget();
//     applySelectedPant(target,color);
// }

// =====================================================
// CHANGE FABRIC
// =====================================================
// =====================================================
// CHANGE GARMENT FABRIC
// File: static/js/viewer.js
// =====================================================

function changeGarmentFabric(
    fabric
) {

    const target =getCustomizationTarget();

    console.log("Selected fabric:",fabric);

    console.log("Customization target:", target);


    // Empty option selected
    if (!fabric) {

        console.warn( "⚠️ Please select a fabric");
        return;
    }


    const fabricPaths = {
        cotton: "/static/textures/fabrics/cotton.jpg",

        denim: "/static/textures/fabrics/denim.jpg",

        silk:"/static/textures/fabrics/silk.jpg",

        wool:"/static/textures/fabrics/wool.jpg",

        linen: "/static/textures/fabrics/linen.jpg"
    };


    const texturePath =
        fabricPaths[fabric];


    // Only show this warning if path does not exist
    if (!texturePath) {

        console.error(
            "❌ Fabric path not found for:",
            fabric
        );

        return;
    }


    console.log(
        "✅ Applying fabric:",
        texturePath,
        "to:",
        target
    );


    if (
        typeof applyGarmentFabric
        !== "function"
    ) {

        console.error(
            "❌ applyGarmentFabric() is not available"
        );

        return;
    }


    applyGarmentFabric(
        target,
        texturePath
    );
}


// =====================================================
// CHANGE PATTERN
// =====================================================

function changeGarmentPattern(pattern){
    const target = getCustomizationTarget();
    if(pattern =='plain'){
        clearGarmentTexture(target);
        return;
    }

    const patternPaths = {
        stripes:'/static/textures/patterns/stripes.png',
        checks:'/static/textures/patterns/checks.png',
        floral:'/static/textures/patterns/floral.png',
        dots:'/static/textures/patterns/dots.png',
        plan:'/static/textures/patterns/plan.png'
    };

    const pattenPth = patternPaths[pattern];
    if(!pattenPth){
        console.warn("pattern not found ",pattern);
        return ;
    }
    console.log("applying pattern ",pattenPth,"to:",target);
    applyGarmentPattern(target,pattenPth);
}


// =======================
// apply fit  button
// ========================

function applyFit() {

    const target = getCustomizationTarget();

    const fitType =
        document.getElementById("fitType").value;

    console.log(
        "Applying Fit:",
        target,
        fitType
    );

    if (!window.garmentManager) {
        console.error("garmentManager is not available");
        return;
    }

    if (typeof window.garmentManager.updateGarmentFit !== "function") {
        console.error(
            "updateGarmentFit() is missing from garmentManager",
            window.garmentManager
        );
        return;
    }

    window.garmentManager.updateGarmentFit(
        target,
        fitType
    );
}

window.applyFit = applyFit;


// =====================================================
// START VIEWER
// =====================================================
window.selectShirt=selectShirt;

window.selectPant=selectPant;

window.applySelectedShirt=
    applySelectedShirt;

window.applySelectedPant=
    applySelectedPant;

window.changeGarmentFit=
    changeGarmentFit;

window.changeGarmentColor=
    changeGarmentColor;

window.changeGarmentPattern =
    changeGarmentPattern;
    
// window.changeGarmentTexture=
//     changeGarmentTexture;

window.changeGarmentFabric=changeGarmentFabric;

initViewer();