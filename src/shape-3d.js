import {Base} from "./base";
import * as THREE from "three";
import {VertexContainer} from "./vertex-container";

class Shapes3D extends Base {
    constructor(shape3D, staticGameConfigService) {
        super();
        this.shape3D = shape3D;
        this.vertexContainers = [];
        this.shape3D.element3Ds.forEach(element3D => {
            element3D.vertexContainers.forEach(vertexContainer => {
                this.vertexContainers.push(new VertexContainer(vertexContainer, staticGameConfigService.getVertexConatinerBuffer(vertexContainer.key)));
            });
        });
    }

    generateMesh(scene, matrix4) {
        this.vertexContainers.forEach(vertexContainer => {
            const mesh = new THREE.Mesh(vertexContainer.geometry, vertexContainer.material);
            mesh.applyMatrix4(matrix4);
            scene.add(mesh);

            mesh.onBeforeRender = function (renderer, scene, camera, geometry, material, group) {
                renderer.getContext().enable(renderer.getContext().SAMPLE_ALPHA_TO_COVERAGE);

            };
            mesh.onAfterRender = function (renderer, scene, camera, geometry, material, group) {
                renderer.getContext().disable(renderer.getContext().SAMPLE_ALPHA_TO_COVERAGE);
            };
        });
    }

    update() {
        this.vertexContainers.forEach(vertexContainer => vertexContainer.update());
    }
}

export {
    Shapes3D
}