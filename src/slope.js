import {Base} from "./base";
import * as THREE from "three";
import {Color} from "three";
import sandTextureUrl from "./textures/Sand01.png";

class Slope extends Base {
    constructor(x, y, terrainHeights) {
        super();
        this.x = x;
        this.y = y;
        this.terrainHeights = terrainHeights;
    }

    generateMesh(scene) {
        let xSegments = this.terrainHeights.length - 1;
        let ySegments = this.terrainHeights[0].length - 1;
        let xLength = xSegments * Base.EDGE_LENGTH;
        let yLength = ySegments * Base.EDGE_LENGTH;
        let geometry = new THREE.PlaneBufferGeometry(xLength, yLength, xSegments, ySegments);
        geometry.translate(this.x + xLength / 2, this.y + yLength / 2, 0);
        let index = 0;
        for (let y = 0; y <= ySegments; y++) {
            for (let x = 0; x <= xSegments; x++) {
                geometry.attributes.position.array[index * 3 + 2] = this.terrainHeights[x][y];
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