import {Base} from "./base";
import * as THREE from "three";
import {Color} from "three";
import sandTextureUrl from "./textures/Sand01.png";

class Slope extends Base {
    constructor(x, y, yLength, terrainShape, datGui) {
        super();
        this.x = x;
        this.y = y;
        this.yLength = yLength;
        this.terrainShape = terrainShape;
        let gui = datGui.addFolder('Slope');
        // gui.add(this, 'animationDuration');
    }

    generateMesh(scene) {
        let xSegments = this.terrainShape.length - 1;
        let ySegments = Math.floor(this.yLength / Base.EDGE_LENGTH);
        let xLength = xSegments * Base.EDGE_LENGTH;
        this.yLength = ySegments * Base.EDGE_LENGTH;
        let geometry = new THREE.PlaneBufferGeometry(xLength, this.yLength, xSegments, ySegments);
        geometry.translate(this.x + xLength / 2, this.y + this.yLength / 2, 0);
        let index = 0;
        for (let y = 0; y <= ySegments; y++) {
            for (let x = 0; x <= xSegments; x++) {
                geometry.attributes.position.array[index * 3 + 2] = this.terrainShape[x];
                index++;
            }
        }

        let loader = new THREE.TextureLoader();
        loader.load(
            sandTextureUrl,
            function (texture) {
                let material = new THREE.MeshBasicMaterial({
                    map: texture
                });
                scene.add(new THREE.Mesh(geometry, material));
            },
            undefined, // onProgress callback currently not supported
            function (err) {
                console.log('Slope: an error happened:' + err);
            }
        );

        super.generateWireframe(scene, geometry, new Color(0.8, 0.8, 0));
    }

}

export {
    Slope
}