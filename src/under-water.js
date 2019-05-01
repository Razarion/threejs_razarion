import {Base} from "./base";
import * as THREE from "three";
import groundTextureUrl from "./textures/UnderWater.png";

class UnderWater extends Base {
    constructor(x, y, z, xLength, yLength, datGui) {
        super();
        this.x = x;
        this.y = y;
        this.z = z;
        this.xLength = xLength;
        this.yLength = yLength;
        this.gui = datGui.addFolder('Under water');
    }

    generateMesh(scene) {
        let geometry = new THREE.BufferGeometry();
        let vertices = new Float32Array([
            this.x, this.y, this.z,
            this.x + this.xLength, this.y, this.z,
            this.x + this.xLength, this.y + this.yLength, this.z,

            this.x + this.xLength, this.y + this.yLength, this.z,
            this.x, this.y + this.yLength, this.z,
            this.x, this.y, this.z
        ]);
        geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
        let uvs = new Float32Array([
            0, 0,
            1, 0,
            1, 1,

            1, 1,
            0, 1,
            0, 0
        ]);
        geometry.addAttribute('uv', new THREE.BufferAttribute(uvs, 2));

        let groundTexture = this.setupTexture(groundTextureUrl, 1, this.xLength, this.yLength);
        this.material = new THREE.MeshBasicMaterial({
                map: groundTexture,
            }
        );
        this.gui.add(this.material, "wireframe", 0, 1);

        scene.add(new THREE.Mesh(geometry, this.material));
    }
}

export {
    UnderWater
}