import {Base} from "./base";
import * as THREE from "three";
import vertexShaderUrl from "./shaders/Shape.vert";
import fragmentShaderUrl from "./shaders/Shape.frag";
import {VertexContainer} from "./vertex-container";

class Shapes3D extends Base {
    constructor(threeJsShape, datGui) {
        super();
        this.shape3D = threeJsShape.shape3D;
        let gui = datGui.addFolder(this.shape3D.internalName + "(" + this.shape3D.dbId + ")");
        let allVertexContainer = this.setupAllVertexContainer(threeJsShape.vertexContainerBuffer);
        this.vertexContainers = [];
        this.shape3D.element3Ds.forEach(element3D => {
            element3D.vertexContainers.forEach(vertexContainer => {
                this.vertexContainers.push(new VertexContainer(vertexContainer, allVertexContainer.get(vertexContainer.key), gui));
            });
        });
    }

    setupAllVertexContainer(vertexContainerBuffer) {
        let allVertexContainer = new Map();
        vertexContainerBuffer.forEach(vertexContainer => {
            allVertexContainer.set(vertexContainer.key, vertexContainer);
        });
        return allVertexContainer;
    }

    generateMesh(scene, x, y, z) {
        this.vertexContainers.forEach(vertexContainer => {
            const mesh = new THREE.Mesh(vertexContainer.geometry, vertexContainer.material);
            mesh.position.set(x, y, z);
            scene.add(mesh);
        });
    }
}

export {
    Shapes3D
}