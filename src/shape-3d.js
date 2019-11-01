import {Base} from "./base";
import * as THREE from "three";

class Shapes3D extends Base {
    constructor(threeJsShape, datGui) {
        super();
        this.threeJsShape = threeJsShape;
        this.datGui = datGui;
    }

    prepare() {
        this.geometry = new THREE.BufferGeometry();

        let staticMatrix = this.threeJsShape.shape3D.element3Ds[0].vertexContainers[0].shapeTransform.staticMatrix.numbers;
        let m = new THREE.Matrix4();
        m.set(staticMatrix[0][0], staticMatrix[0][1], staticMatrix[0][2], staticMatrix[0][3],
            staticMatrix[1][0], staticMatrix[1][1], staticMatrix[1][2], staticMatrix[1][3],
            staticMatrix[2][0], staticMatrix[2][1], staticMatrix[2][2], staticMatrix[2][3],
            staticMatrix[3][0], staticMatrix[3][1], staticMatrix[3][2], staticMatrix[3][3]);

        let buffer = this.threeJsShape.vertexContainerBuffer[0];
        this.geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(buffer.vertexData), 3));
        this.geometry.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(buffer.normData), 3));
        this.geometry.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(buffer.textureCoordinate), 2));
        this.geometry.applyMatrix(m);
        // this.geometry.applyMatrix(new THREE.Matrix4().makeScale(5, 5, 5));

        let texture = this.setupTextureSimple(this.imageTable(20));

        this.material = new THREE.MeshPhongMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.5,
            shininess: 20,
        });

        // GUI
        const gui = this.datGui.addFolder('Bush');
        gui.add(this.material, 'alphaTest', 0, 1).name('Alpha Test').onChange(() => {
            this.material.needsUpdate = true
        });
        gui.addMaterial("MeshPhongMaterial", this.material);
    }

    generateMesh(scene, x, y, z) {
        const mesh = new THREE.Mesh(this.geometry, this.material);
        mesh.position.set(x, y, z);
        scene.add(mesh);
    }
}

export {
    Shapes3D
}