import {Base} from "./base";
import * as THREE from "three";
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

    generateMesh(scene, x, y, z, scaleX, scaleY, scaleZ, rotationZ) {
        this.vertexContainers.forEach(vertexContainer => {
            const mesh = new THREE.Mesh(vertexContainer.geometry, vertexContainer.material);
            mesh.position.set(x, y, z);
            mesh.scale.set(scaleX, scaleY, scaleZ);
            mesh.rotateOnAxis(new THREE.Vector3(0, 0, 1), rotationZ)
            scene.add(mesh);

            mesh.onBeforeRender = function (renderer, scene, camera, geometry, material, group) {
                renderer.getContext().enable(renderer.getContext().SAMPLE_ALPHA_TO_COVERAGE);

            };
            mesh.onAfterRender = function (renderer, scene, camera, geometry, material, group) {
                renderer.getContext().disable(renderer.getContext().SAMPLE_ALPHA_TO_COVERAGE);
            };
        });
    }
}

export {
    Shapes3D
}