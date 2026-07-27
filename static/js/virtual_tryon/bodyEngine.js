// static/js/virtual_tryon/bodyEngine.js
// 1 FILE
import {getBoundingBox,getObjectSize,getObjectCenter} from "./helper.js";
export class BodyEngine {
    constructor(body) { this.body = body;}
    getBoundingBox() {return getBoundingBox( this.body);
    }
    getSize() {
        return getObjectSize(this.body);
    }
    getCenter() {
        return getObjectCenter(  this.body
        );
    }
    getBodyData() {
        const box =this.getBoundingBox();
        const size = this.getSize();
        const center = this.getCenter();
        return {box, size, center
        };
    }
}