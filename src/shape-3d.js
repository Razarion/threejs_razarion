import {Base} from "./base";
import shapes3dJson from "./razarion_generated/shapes-3d";

class Shapes3D extends Base {
    constructor(shapes3dJson) {
        super();
        this.shapes3dJson = shapes3dJson;
    }
}

export {
    Shapes3D
}