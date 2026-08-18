// =====================================================
// garmentManager.js
// Shirt + Pant Runtime Controller
// =====================================================

import {GarmentEngine} from "./garmentEngine.js";
import {FitEngine} from "./fitEngine.js";
import {MaterialEngine} from "./materialEngine.js";

export class GarmentManager{

constructor(scene,body){
this.scene=scene;
this.body=body;
this.garmentEngine=new GarmentEngine();
this.fitEngine=new FitEngine(body);
this.materialEngine=new MaterialEngine();

this.shirt=null;
this.pant=null;

this.shirtData=null;
this.pantData=null;

console.log("✅ Garment Manager Initialized");
}

// =====================================================
// LOAD GARMENT
// =====================================================

async loadGarment({
type="shirt",
modelPath,
materialPath=null,
texturePath=null,
fitType="regular",
color=null
}){

if(!modelPath){
console.error("❌ Garment model path is required");
return null;
}

console.log("👕 Loading:",type);

try{

// Remove only same garment type

if(type==="shirt"){
this.removeShirt();
}

if(type==="pant"){
this.removePant();
}

// Load OBJ

const garment=await this.garmentEngine.load(
modelPath,
materialPath
);

if(!garment){
console.error("❌ Garment not loaded");
return null;
}

garment.position.set(0,0,0);
garment.rotation.set(0,0,0);
garment.scale.set(1,1,1);

garment.updateMatrixWorld(true);

console.log("📦 Model loaded:",type);

// Fit shirt or pant

const fittedGarment=
this.fitEngine.fitGarment(
garment,
type,
fitType
);

if(!fittedGarment){
console.error("❌ Fitting failed:",type);
return null;
}

fittedGarment.updateMatrixWorld(true);

// Apply color

if(color!==null){

this.materialEngine.applyColor(
fittedGarment,
color
);

}

// Apply texture

if(texturePath){

await this.materialEngine.applyTexture(
fittedGarment,
texturePath
);

}

fittedGarment.updateMatrixWorld(true);

// Add to scene

this.scene.add(
fittedGarment
);

// Store separately

if(type==="shirt"){

this.shirt=fittedGarment;

this.shirtData={
type,
modelPath,
materialPath,
texturePath,
fitType,
color
};

}

if(type==="pant"){

this.pant=fittedGarment;

this.pantData={
type,
modelPath,
materialPath,
texturePath,
fitType,
color
};

}

console.log("🎉 Added:",type);

console.log(
"📏 Scale:",
fittedGarment.scale
);

console.log(
"📍 Position:",
fittedGarment.position
);

return fittedGarment;

}catch(error){

console.error(
"❌ Loading failed:",
type,
error
);

return null;
console.log("Shirt:", this.shirt);
console.log("Pant:", this.pant);
console.log("Same Instance:", this === window.garmentManager);

}

}




// =====================================================
// LOAD SHIRT
// =====================================================

async loadShirt(modelPath,fitType="regular",){
return await this.loadGarment({
type:"shirt",
modelPath:modelPath,
fitType:fitType,
color:color
});

}

// =====================================================
// LOAD PANT
// =====================================================

async loadPant(modelPath,fitType="regular",color=0x222222){
return await this.loadGarment({
type:"pant",
modelPath:modelPath,
fitType:fitType,
color:color
});
}

// =====================================================
// REMOVE SHIRT
// =====================================================

removeShirt(){

if(!this.shirt){
return;
}

this.garmentEngine.remove(
this.shirt,
this.scene
);

this.shirt=null;

this.shirtData=null;

console.log("🗑️ Shirt removed");

}

// =====================================================
// REMOVE PANT
// =====================================================

removePant(){

if(!this.pant){
return;
}

this.garmentEngine.remove(
this.pant,
this.scene
);

this.pant=null;

this.pantData=null;

console.log("🗑️ Pant removed");

}

// =====================================================
// REMOVE ALL
// =====================================================

removeAllGarments(){

this.removeShirt();

this.removePant();

console.log(
"🗑️ All garments removed"
);

}

// =====================================================
// CHANGE SHIRT FIT
// =====================================================

changeShirtFit(fitType){

if(!this.shirt){
console.warn(
"⚠️ Shirt not loaded"
);
return null;
}

this.shirt.position.set(
0,0,0
);

this.shirt.rotation.set(
0,0,0
);

this.shirt.scale.set(
1,1,1
);

const fitted=
this.fitEngine.fitGarment(
this.shirt,
"shirt",
fitType
);

this.shirt=fitted;

this.shirtData.fitType=
fitType;

return fitted;

}

// =====================================================
// CHANGE PANT FIT
// =====================================================

changePantFit(fitType){

if(!this.pant){
console.warn(
"⚠️ Pant not loaded"
);
return null;
}

this.pant.position.set(
0,0,0
);

this.pant.rotation.set(
0,0,0
);

this.pant.scale.set(
1,1,1
);

const fitted=
this.fitEngine.fitGarment(
this.pant,
"pant",
fitType
);

this.pant=fitted;

this.pantData.fitType=
fitType;

return fitted;

}

// =====================================================
// CHANGE SHIRT COLOR
// =====================================================

changeShirtColor(color){

if(!this.shirt){
return;
}

this.materialEngine.applyColor(
this.shirt,
color
);

this.shirtData.color=
color;

}

// =====================================================
// CHANGE PANT COLOR
// =====================================================

changePantColor(color){

if(!this.pant){
return;
}

this.materialEngine.applyColor(
this.pant,
color
);

this.pantData.color=
color;

}

// =====================================================
// GET SHIRT
// =====================================================

getShirt(){
return this.shirt;
}

// =====================================================
// GET PANT
// =====================================================

getPant(){
return this.pant;
}

}



// ===============
// update the garment fitting 
// ===============
class updatedGarment{

    constructor(fitEngine) {

        this.fitEngine = fitEngine;

        this.shirt = null;
        this.pant = null;
    }


    // =====================================
    // UPDATE GARMENT FIT
    // =====================================

    updateGarmentFit(type, fitType) {

        let garment = null;

        if (type === "shirt") {
            garment = this.shirt;
        }

        if (type === "pant") {
            garment = this.pant;
        }

        if (!garment) {
            console.warn(type + " not loaded");
            return;
        }

        if (!this.fitEngine) {
            console.error("FitEngine not available");
            return;
        }

        this.fitEngine.applyFit(
            garment,
            fitType
        );
    }
}

// const updatedGarment = new updatedGarment(
//     fitEngine
// );

window.updatedGarment =new  updatedGarment(window.updatedFiting);