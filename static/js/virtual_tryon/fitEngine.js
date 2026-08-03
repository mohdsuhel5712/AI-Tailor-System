// =====================================================
// fitEngine.js
// Shirt Upper-Body Fit + Pant Waist-to-Ankle Fit
// =====================================================

import {getBoundingBox,getObjectSize,getObjectCenter} from "./helper.js";

export class FitEngine{

constructor(body){
this.body=body;
this.updateBodyData();
console.log("✅ Fit Engine Initialized");
}

// =====================================================
// UPDATE BODY DATA
// =====================================================

updateBodyData(){

if(!this.body){
console.error("❌ Body is not available");
return;
}

this.body.updateMatrixWorld(true);

this.bodyBox=getBoundingBox(this.body);
this.bodySize=getObjectSize(this.body);
this.bodyCenter=getObjectCenter(this.body);

console.log("📏 Body Size:",this.bodySize);

}

// =====================================================
// MAIN FITTING
// =====================================================

fitGarment(garment,garmentType="shirt",fitType="regular"){

if(!garment){
console.error("❌ Garment is required");
return null;
}

this.updateBodyData();

garment.position.set(0,0,0);
garment.rotation.set(0,0,0);
garment.scale.set(1,1,1);

garment.updateMatrixWorld(true);

console.log("👕 Fitting:",garmentType);
console.log("📏 Fit Type:",fitType);

if(garmentType==="shirt"){
return this.fitShirt(
garment,
fitType
);
}

if(
garmentType==="pant"||
garmentType==="pants"
){
return this.fitPant(
garment,
fitType
);
}

console.error(
"❌ Unknown garment type:",
garmentType
);

return null;

}

// =====================================================
// SHIRT FIT
// =====================================================

fitShirt(garment,fitType){

const garmentSize=
getObjectSize(garment);

if(
garmentSize.x<=0||
garmentSize.y<=0||
garmentSize.z<=0
){
console.error("❌ Invalid shirt size");
return null;
}

// Upper body size

const targetWidth=
this.bodySize.x*0.94;

const targetHeight=
this.bodySize.y*0.43;

const targetDepth=
this.bodySize.z*1.03;

// Scale

let scaleX=
targetWidth/garmentSize.x;

let scaleY=
targetHeight/garmentSize.y;

let scaleZ=
targetDepth/garmentSize.z;

// Fit type

if(fitType==="slim"){
scaleX*=0.95;
scaleZ*=0.96;
}

if(fitType==="loose"){
scaleX*=1.08;
scaleZ*=1.10;
scaleY*=1.03;
}

garment.scale.set(
scaleX,
scaleY,
scaleZ
);

garment.updateMatrixWorld(true);

// Center X

let shirtBox=
getBoundingBox(garment);

const shirtCenterX=
(
shirtBox.min.x+
shirtBox.max.x
)/2;

garment.position.x+=
this.bodyCenter.x-
shirtCenterX;

garment.updateMatrixWorld(true);

// Neck position

shirtBox=
getBoundingBox(garment);

const shirtTop=
shirtBox.max.y;

const targetTop=
this.bodyBox.max.y-
this.bodySize.y*0.07;

garment.position.y+=
targetTop-
shirtTop;

garment.updateMatrixWorld(true);

// Center Z

shirtBox=
getBoundingBox(garment);

const shirtCenterZ=
(
shirtBox.min.z+
shirtBox.max.z
)/2;

garment.position.z+=
this.bodyCenter.z-
shirtCenterZ;

// Small outside offset

garment.position.z+=
this.bodySize.z*0.015;

garment.updateMatrixWorld(true);

console.log(
"👕 Shirt fitted to upper body"
);

console.log(
"📏 Shirt Scale:",
garment.scale
);

console.log(
"📍 Shirt Position:",
garment.position
);

return garment;

}

// =====================================================
// PANT FIT
// =====================================================

fitPant(garment,fitType){

const garmentSize=
getObjectSize(garment);

if(
garmentSize.x<=0||
garmentSize.y<=0||
garmentSize.z<=0
){
console.error("❌ Invalid pant size");
return null;
}

// Body levels

const ankleLevel=
this.bodyBox.min.y+
this.bodySize.y*0.02;

const waistLevel=
this.bodyBox.min.y+
this.bodySize.y*0.58;

const targetPantHeight=
waistLevel-
ankleLevel;

// Pant size based on hips

const targetPantWidth=
this.bodySize.x*0.88;

const targetPantDepth=
this.bodySize.z*1.05;

// Scale pant

let scaleX=
targetPantWidth/
garmentSize.x;

let scaleY=
targetPantHeight/
garmentSize.y;

let scaleZ=
targetPantDepth/
garmentSize.z;

// Fit type

if(fitType==="slim"){
scaleX*=0.90;
scaleZ*=0.90;
}

if(fitType==="loose"){
scaleX*=1.02;
scaleZ*=1.04;
}

garment.scale.set(
scaleX,
scaleY,
scaleZ
);

garment.updateMatrixWorld(true);

// Center pant on body X

let pantBox=
getBoundingBox(garment);

const pantCenterX=
(
pantBox.min.x+
pantBox.max.x
)/2;

garment.position.x+=
this.bodyCenter.x-
pantCenterX;

garment.updateMatrixWorld(true);

// Pant top to waist

pantBox=
getBoundingBox(garment);

garment.position.y+=
waistLevel-
pantBox.max.y;

garment.updateMatrixWorld(true);

// Center Z

pantBox=
getBoundingBox(garment);

const pantCenterZ=
(
pantBox.min.z+
pantBox.max.z
)/2;

const bodyFrontZ=
this.bodyBox.max.z;

const pantFrontZ=
pantBox.max.z;

garment.position.z+=
bodyFrontZ-
pantFrontZ;

garment.position.z+=
this.bodySize.z*0.03;

garment.updateMatrixWorld(true);

console.log(
"👖 Pant fitted from waist to ankle"
);

console.log(
"📏 Pant Scale:",
garment.scale
);

console.log(
"📍 Pant Position:",
garment.position
);

return garment;

}

// =====================================================
// COLLISION CHECK
// =====================================================

checkCollision(garment){

const garmentBox=
getBoundingBox(garment);

const intersects=
garmentBox.intersectsBox(
this.bodyBox
);

if(intersects){
console.log(
"⚠️ Garment overlaps body"
);
}else{
console.log(
"✅ Garment is outside body"
);
}

return intersects;

}

}