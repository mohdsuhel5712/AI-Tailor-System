
import { BodyEngine } from "./virtual_tryon/bodyEngine.js";
import { GarmentManager } from "./virtual_tryon/garmentManager.js";

let scene;
let camera;
let renderer;
let controls;
let body;
let bodyEngine;
let garmentManager;
let studioFloor;
let allGarments = [];
let shirts = [];
let pants = [];

function initViewer() {
    const container = document.getElementById("viewer-container");
    if (!container) {
        console.error("❌ Viewer container not found");
        return;
    }

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x10131a);

    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 1.4, 3.2);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    if ("outputColorSpace" in renderer) {
        renderer.outputColorSpace = THREE.SRGBColorSpace;
    } else {
        renderer.outputEncoding = THREE.sRGBEncoding;
    }

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 0.8;
    controls.maxDistance = 8;
    controls.minPolarAngle = 0.25;
    controls.maxPolarAngle = Math.PI - 0.25;

    createStudioLighting();
    createStudioFloor();
    loadBody();

    window.addEventListener("resize", onWindowResize);
    animate();

    console.log("✅ AI AlterFit Viewer Initialized");
}

function createStudioLighting() {
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x20242c, 2.0);
    scene.add(hemisphereLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
    keyLight.position.set(3, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.1;
    keyLight.shadow.camera.far = 20;
    keyLight.shadow.camera.left = -4;
    keyLight.shadow.camera.right = 4;
    keyLight.shadow.camera.top = 6;
    keyLight.shadow.camera.bottom = -2;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xb8c7ff, 1.2);
    fillLight.position.set(-4, 3, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.4);
    rimLight.position.set(0, 4, -5);
    scene.add(rimLight);
}

function createStudioFloor() {
    const geometry = new THREE.PlaneGeometry(20, 20);
    const material = new THREE.MeshStandardMaterial({
        color: 0x181c24,
        roughness: 0.82,
        metalness: 0.05
    });

    studioFloor = new THREE.Mesh(geometry, material);
    studioFloor.rotation.x = -Math.PI / 2;
    studioFloor.position.y = 0;
    studioFloor.receiveShadow = true;

    scene.add(studioFloor);
}

function alignStudioFloor() {
    if (!studioFloor || !bodyEngine) {
        return;
    }

    const box = bodyEngine.getBoundingBox();
    studioFloor.position.y = box.min.y - 0.01;
}

function loadBody() {
    const loader = new THREE.OBJLoader();
    const bodyPath = "/static/generated/processed_body.obj";

    console.log("🧍 Loading body:", bodyPath);

    loader.load(
        bodyPath,
        (loadedBody) => {
            body = loadedBody;
            body.name = "AI_Body";

            body.traverse((child) => {
                if (!child.isMesh) {
                    return;
                }

                child.castShadow = true;
                child.receiveShadow = true;

                if (child.geometry) {
                    child.geometry.computeVertexNormals();
                    child.geometry.computeBoundingBox();
                }

                child.material = new THREE.MeshStandardMaterial({
                    color: 0xc58f72,
                    roughness: 0.72,
                    metalness: 0.0
                });
            });

            body.updateMatrixWorld(true);
            scene.add(body);

            bodyEngine = new BodyEngine(body);
            window.bodyEngine = bodyEngine;

            const bodyData = bodyEngine.getBodyData();

            if (!bodyData || !bodyData.box || !bodyData.size) {
                console.error("❌ Body data could not be calculated");
                return;
            }

            console.log("🧍 Body Size:", bodyData.size);
            console.log("📍 Body Center:", bodyData.center);
            console.log("📦 Body Bounds:", bodyData.box);

            alignStudioFloor();
            frameBody(bodyData);

            garmentManager = new GarmentManager(scene, body);
            window.garmentManager = garmentManager;

            console.log("✅ Garment Manager connected with body");

            loadGarmentsFromDatabase();
        },
        (progress) => {
            if (progress.total) {
                const percent = (progress.loaded / progress.total) * 100;
                console.log(`🧍 Body Loading: ${percent.toFixed(0)}%`);
            }
        },
        (error) => {
            console.error("❌ Body loading failed:", error);
        }
    );
}

function frameBody(bodyData) {
    if (!camera || !controls || !bodyData) {
        return;
    }

    const size = bodyData.size;
    const center = bodyData.center;
    const maxSize = Math.max(size.x, size.y, size.z);
    const distance = Math.max(maxSize * 1.8, size.y * 1.35);

    camera.position.set(center.x, center.y + size.y * 0.03, center.z + distance);
    controls.target.copy(center);
    controls.update();
}

async function loadGarmentsFromDatabase() {
    try {
        console.log("🔄 Loading garments from database...");

        const response = await fetch("/api/garments");

        if (!response.ok) {
            throw new Error("Garment API failed: " + response.status);
        }

        const data = await response.json();

        console.log("📦 Garment API Response:", data);

        if (Array.isArray(data)) {
            allGarments = data;
        } else if (Array.isArray(data.garments)) {
            allGarments = data.garments;
        } else if (Array.isArray(data.data)) {
            allGarments = data.data;
        } else {
            console.error("❌ Invalid garment API response:", data);
            allGarments = [];
        }

        console.log("👕 Garments Loaded:", allGarments.length);

        shirts = allGarments.filter((garment) => {
            return Number(garment.category_id) === 1;
        });

        pants = allGarments.filter((garment) => {
            return Number(garment.category_id) === 2;
        });

        console.log("👕 Shirts:", shirts.length);
        console.log("👖 Pants:", pants.length);

        fillGarmentDropdowns();
    } catch (error) {
        console.error("❌ Failed to load garments:", error);
        allGarments = [];
        shirts = [];
        pants = [];
    }
}

function getGarmentType(garment) {
    const values = [
        garment.type,
        garment.garment_type,
        garment.garmentType,
        garment.category,
        garment.category_name,
        garment.categoryName,
        garment.gender_category
    ];

    const text = values.filter(Boolean).join(" ").toLowerCase();

    if (text.includes("shirt") || text.includes("tshirt") || text.includes("t-shirt") || text.includes("upper")) {
        return "shirt";
    }

    if (text.includes("pant") || text.includes("pants") || text.includes("trouser") || text.includes("lower")) {
        return "pant";
    }

    const categoryId = Number(garment.category_id);

    if (categoryId === 1) {
        return "shirt";
    }

    if (categoryId === 2) {
        return "pant";
    }

    const name = String(garment.name || garment.garment_name || "").toLowerCase();

    if (name.includes("shirt") || name.includes("tshirt") || name.includes("t-shirt")) {
        return "shirt";
    }

    if (name.includes("pant") || name.includes("pants") || name.includes("trouser")) {
        return "pant";
    }

    return null;
}

function getGarmentId(garment) {
    return garment.garment_id ?? garment.id ?? garment.model_id ?? garment._id ?? "";
}

function getGarmentName(garment) {
    return garment.garment_name || garment.name || garment.title || garment.model_name || "Garment";
}

function fillGarmentDropdowns() {
    const shirtSelect = document.getElementById("shirtSelect");
    const pantSelect = document.getElementById("pantSelect");

    if (!shirtSelect) {
        console.error("❌ Shirt dropdown #shirt-select not found");
    }

    if (!pantSelect) {
        console.error("❌ Pant dropdown #pant-select not found");
    }

    if (shirtSelect) {
        shirtSelect.innerHTML = '<option value="">Select Shirt</option>';
    }

    if (pantSelect) {
        pantSelect.innerHTML = '<option value="">Select Pant</option>';
    }

    let shirtCount = 0;
    let pantCount = 0;

    allGarments.forEach((garment) => {
        const type = getGarmentType(garment);
        const id = getGarmentId(garment);

        if (!id || !type) {
            return;
        }

        const option = document.createElement("option");
        option.value = id;
        option.textContent = getGarmentName(garment);

        if (type === "shirt" && shirtSelect) {
            shirtSelect.appendChild(option);
            shirtCount++;
        }

        if (type === "pant" && pantSelect) {
            pantSelect.appendChild(option);
            pantCount++;
        }
    });

    console.log("👕 Shirts:", shirtCount);
    console.log("👖 Pants:", pantCount);
}

function buildGarmentPath(filePath) {
    if (!filePath) {
        return null;
    }

    let path = String(filePath).replace(/\\/g, "/");

    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
    }

    if (path.startsWith("/")) {
        return path;
    }

    if (path.startsWith("static/")) {
        return "/" + path;
    }

    if (path.startsWith("garments/")) {
        return "/static/" + path;
    }

    return "/static/garments/" + path.replace(/^\/+/, "");
}

function getGarmentRecord(id) {
    return allGarments.find((garment) => {
        return String(getGarmentId(garment)) === String(id);
    });
}

async function applySelectedShirt() {
    if (!garmentManager) {
        console.warn("⚠️ Garment Manager is not ready");
        return;
    }

    const select = document.getElementById("shirtSelect");

    if (!select || !select.value) {
        console.warn("⚠️ Select a shirt first");
        return;
    }

    const garmentData = getGarmentRecord(select.value);

    if (!garmentData) {
        console.error("❌ Shirt data not found");
        return;
    }

    const modelFile = garmentData.glb_file || garmentData.obj_file || garmentData.model_path || garmentData.file_path;
    const modelPath = buildGarmentPath(modelFile);

    if (!modelPath) {
        console.error("❌ Shirt model path not found:", garmentData);
        return;
    }

    const materialPath = buildGarmentPath(garmentData.mtl_file || garmentData.material_path);
    const texturePath = buildGarmentPath(garmentData.texture_path || garmentData.texture_file);

    console.log("👕 Selected Shirt:", garmentData.garment_name);
    console.log("🆔 Garment ID:", garmentData.garment_id);
    console.log("📁 Model Path:", modelPath);

    const shirt = await garmentManager.loadGarment({
        type: "shirt",
        modelPath,
        materialPath,
        texturePath: texturePath || null,
        fitType: getCurrentFitType(),
        color: null
    });

    if (shirt) {
        console.log("👕 Shirt applied successfully");
    }
}

async function applySelectedPant() {
    if (!garmentManager) {
        console.warn("⚠️ Garment Manager is not ready");
        return;
    }

    const select = document.getElementById("pantSelect");

    if (!select || !select.value) {
        console.warn("⚠️ Select a pant first");
        return;
    }

    const garmentData = getGarmentRecord(select.value);

    if (!garmentData) {
        console.error("❌ Pant data not found");
        return;
    }

    const modelFile = garmentData.glb_file || garmentData.obj_file || garmentData.model_path || garmentData.file_path;
    const modelPath = buildGarmentPath(modelFile);

    if (!modelPath) {
        console.error("❌ Pant model path not found:", garmentData);
        return;
    }

    const materialPath = buildGarmentPath(garmentData.mtl_file || garmentData.material_path);
    const texturePath = buildGarmentPath(garmentData.texture_path || garmentData.texture_file);

    console.log("👖 Selected Pant:", garmentData.garment_name);
    console.log("🆔 Garment ID:", garmentData.garment_id);
    console.log("📁 Model Path:", modelPath);

    const pant = await garmentManager.loadGarment({
        type: "pant",
        modelPath,
        materialPath,
        texturePath: texturePath || null,
        fitType: getCurrentFitType(),
        color: null
    });

    if (pant) {
        console.log("👖 Pant applied successfully");
    }
}



async function selectShirt() {
    await applySelectedShirt();
}

async function selectPant() {
    await applySelectedPant();
}

function getCustomizationTarget() {
    const targetSelect = document.getElementById("garment-target");
    const target = targetSelect?.value?.toLowerCase();

    if (target === "pant" || target === "pants") {
        return "pant";
    }

    return "shirt";
}

function getCurrentFitType() {
    const fitSelect = document.getElementById("fit-type");
    return fitSelect?.value?.toLowerCase() || "regular";
}

function changeGarmentFit(fitType) {
    if (!garmentManager) {
        console.warn("⚠️ Garment Manager is not ready");
        return null;
    }

    const target = getCustomizationTarget();
    return garmentManager.updateGarmentFit(target, fitType);
}

function changeGarmentColor(color) {
    if (!garmentManager) {
        console.warn("⚠️ Garment Manager is not ready");
        return;
    }

    const target = getCustomizationTarget();

    if (target === "pant") {
        garmentManager.changePantColor(color);
    } else {
        garmentManager.changeShirtColor(color);
    }
}

function changeGarmentFabric(texturePath) {
    if (!garmentManager) {
        console.warn("⚠️ Garment Manager is not ready");
        return;
    }

    const target = getCustomizationTarget();
    const garment = garmentManager.getGarment(target);

    if (!garment) {
        console.warn("⚠️ Garment not loaded:", target);
        return;
    }

    garmentManager.materialEngine.applyFabric(garment, texturePath, 4, 4);
}

function changeGarmentPattern(texturePath) {
    if (!garmentManager) {
        console.warn("⚠️ Garment Manager is not ready");
        return;
    }

    const target = getCustomizationTarget();
    const garment = garmentManager.getGarment(target);

    if (!garment) {
        console.warn("⚠️ Garment not loaded:", target);
        return;
    }

    if (!texturePath || texturePath === "plain") {
        garmentManager.materialEngine.removeTexture(garment);
        return;
    }

    garmentManager.materialEngine.applyPattern(garment, texturePath, 5, 5);
}

function applyFit() {
    const fitType = getCurrentFitType();
    const target = getCustomizationTarget();

    if (!garmentManager) {
        console.warn("⚠️ Garment Manager is not ready");
        return null;
    }

    const garment = garmentManager.updateGarmentFit(target, fitType);

    if (garment) {
        garment.updateMatrixWorld(true);
        console.log("🎯 Fit applied:", target, fitType);
    }

    return garment;
}

function onWindowResize() {
    const container = document.getElementById("viewer-container");

    if (!container || !camera || !renderer) {
        return;
    }

    const width = container.clientWidth;
    const height = Math.max(container.clientHeight, 1);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

function animate() {
    requestAnimationFrame(animate);

    if (controls) {
        controls.update();
    }

    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

window.selectShirt = selectShirt;
window.selectPant = selectPant;
window.applySelectedShirt = applySelectedShirt;
window.applySelectedPant = applySelectedPant;
window.changeGarmentFit = changeGarmentFit;
window.changeGarmentColor = changeGarmentColor;
window.changeGarmentFabric = changeGarmentFabric;
window.changeGarmentPattern = changeGarmentPattern;
window.applyFit = applyFit;

console.log("🌐 AI AlterFit Viewer Functions Connected");

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initViewer);
} else {
    initViewer();
}
