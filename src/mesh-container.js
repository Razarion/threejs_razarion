import {Base} from "./base";
import * as THREE from "three";
import shape3DsJson from "./razarion_generated/mesh_container/shape3Ds.json";
import vertexContainerKeyModelMatricesJson from "./razarion_generated/mesh_container/element3DId_modelMatrices.json";
import vertexContainerBuffersJson from "./razarion_generated/mesh_container/vertexContainerBuffers.json";

class MeshContainer extends Base {

    constructor(scene) {
        super();

        this.vertexConatinerBuffers = new Map();
        vertexContainerBuffersJson.forEach(vertexContainerBuffer => {
            this.vertexConatinerBuffers[vertexContainerBuffer.key] = vertexContainerBuffer;
        });

        for (let vertexContainerKey in vertexContainerKeyModelMatricesJson) {
            let buffers = this.findVertexContainerBuffer(vertexContainerKey);
            let geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(buffers.vertexData), 3));
            geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(buffers.normData), 3));
            geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(buffers.textureCoordinate), 2));
            this.setupMeshes(scene, geometry, vertexContainerKeyModelMatricesJson[vertexContainerKey]);
        }
    }

    findVertexContainerBuffer(vertexContainerKey) {
        let vertexContainerBuffer = null;
        shape3DsJson.forEach(shape3Ds => {
            shape3Ds.element3Ds.forEach(element3D => {
                element3D.vertexContainers.forEach(vertexContainer => {
                    if (vertexContainerKey.localeCompare(vertexContainer.key) === 0) {
                        vertexContainerBuffer = this.vertexConatinerBuffers[vertexContainer.key];
                    }
                })
            })
        });
        return vertexContainerBuffer;

    }

    setupMeshes(scene, geometry, modelMatrices) {
        const material = new THREE.MeshStandardMaterial()
        modelMatrices.forEach(modelMatrix => {
            let staticMatrix = modelMatrix.numbers;
            let m = new THREE.Matrix4();
            m.set(staticMatrix[0][0], staticMatrix[0][1], staticMatrix[0][2], staticMatrix[0][3],
                staticMatrix[1][0], staticMatrix[1][1], staticMatrix[1][2], staticMatrix[1][3],
                staticMatrix[2][0], staticMatrix[2][1], staticMatrix[2][2], staticMatrix[2][3],
                staticMatrix[3][0], staticMatrix[3][1], staticMatrix[3][2], staticMatrix[3][3]);

            const mesh = new THREE.Mesh(geometry, material)
            mesh.scale.x = 0.01;
            mesh.scale.y = 0.01;
            mesh.scale.z = 0.01;
            mesh.applyMatrix4(m);
            // mesh.position.x = 274;
            // mesh.position.y = 100;
            // mesh.position.z = 2;
            scene.add(mesh)
        });
    }
}

export {
    MeshContainer
}