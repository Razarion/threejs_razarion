import {Base} from "./base";
import * as THREE from "three";
import {Color} from "three";
import sandImage from "./textures/Sand01.png";

class Slope extends Base {
    constructor(x, y, width, height) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    generateMesh(scene) {
        // ---------- Setup Geometry ----------
        let widthSegments = 10;
        let geometry = this.setupGeometry(this.x, this.y, this.width, this.height);
        let vertices = geometry.attributes.position.array;
        for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
            let z = (1.0 - (i % (widthSegments + 1) / (widthSegments + 1))) - 0.5;
            z += (Math.random() * 2.0 - 1.0) * 0.2;
            vertices[j + 2] = z;
        }

        // ---------- Image texture ----------
        let loader = new THREE.ImageBitmapLoader();

        // load a image resource
        loader.load(
            // resource URL
            sandImage,
            // onLoad callback
            function (imageBitmap) {
                let texture = new THREE.CanvasTexture(imageBitmap);
                let material = new THREE.MeshBasicMaterial({map: texture});
                scene.add(new THREE.Mesh(geometry, material));
            },
            // onProgress callback currently not supported
            undefined,
            // onError callback
            function (err) {
                console.log('Slope: an error happened:' + err);
            }
        );

        super.generateWireframe(scene, geometry, new Color(0.5, 0.5, 0));
    }

}

export {
    Slope
}