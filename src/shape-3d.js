import {Base} from "./base";
import * as THREE from "three";

class Shapes3D extends Base {
    constructor(threeJsShape, x, y, z, datGui) {
        super();
        this.threeJsShape = threeJsShape;
        this.x = x;
        this.y = y;
        this.z = z;
        this.datGui = datGui;
    }

    generateMesh(scene) {
        let geometry = new THREE.BufferGeometry();

        let staticMatrics = this.threeJsShape.shape3D.element3Ds[0].vertexContainers[0].shapeTransform.staticMatrix.numbers;
        let buffer = this.threeJsShape.vertexContainerBuffer[0];

        let m = new THREE.Matrix4();
        m.set(staticMatrics[0][0], staticMatrics[0][1], staticMatrics[0][2], staticMatrics[0][3],
            staticMatrics[1][0], staticMatrics[1][1], staticMatrics[1][2], staticMatrics[1][3],
            staticMatrics[2][0], staticMatrics[2][1], staticMatrics[2][2], staticMatrics[2][3],
            staticMatrics[3][0], staticMatrics[3][1], staticMatrics[3][2], staticMatrics[3][3]);

        geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(buffer.vertexData), 3));
        geometry.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(buffer.normData), 3));
        geometry.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(buffer.testureCoordinate), 2));
        geometry.applyMatrix(m);

        const material = new THREE.MeshPhongMaterial({
            color: '#ff0017',
        });
        // this.datGui.addMaterial("MeshPhongMaterial", material);

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(this.x, this.y, this.z);
        scene.add(mesh);
    }
}

export {
    Shapes3D
}