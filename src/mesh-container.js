import {Base} from "./base";
import * as THREE from "three";
import shape3DsJson from "./razarion_generated/mesh_container/shape3Ds.json";
import vertexContainerBuffersJson from "./razarion_generated/mesh_container/vertexContainerBuffers.json";
// import assetConfigJson from "./razarion_generated/mesh_container/assetConfig.json";
import assetConfigJson from "./razarion_generated/mesh_container/unityAssetConverterTestAssetConfig.json";

class MeshContainer extends Base {

    constructor(scene) {
        super();

        this.vertexConatinerBuffers = new Map();
        vertexContainerBuffersJson.forEach(vertexContainerBuffer => {
            this.vertexConatinerBuffers[vertexContainerBuffer.key] = vertexContainerBuffer;
        });

        let meshContainer = this.findMeshContainer("Vehicle_11");
        if (meshContainer != null) {
            this.setupMeshContainer(scene, meshContainer);
        }
    }

    findMeshContainer(name) {
        let resultMeshContainer = null;
        assetConfigJson.meshContainers.forEach(meshContainer => {
            if (name.localeCompare(meshContainer.internalName) === 0) {
                resultMeshContainer = meshContainer;
            }
        });
        return resultMeshContainer;
    }

    setupMeshContainer(scene, meshContainer) {
        if (meshContainer.mesh != null) {
            this.setupMeshes(scene, meshContainer.mesh);
        }
        if (meshContainer.children != null) {
            meshContainer.children.forEach(child => {
                this.setupMeshContainer(scene, child);
            });
        }
    }

    setupMeshes(scene, mesh) {
        shape3DsJson.forEach(shape3D => {
            if (shape3D.id === mesh.shape3DId) {
                shape3D.element3Ds.forEach(element3D => {
                    if (element3D.id.localeCompare(mesh.element3DId) === 0) {
                        element3D.vertexContainers.forEach(vertexContainer => {
                            this.setupVertexContainer(scene, vertexContainer, mesh.shapeTransform);
                        });
                    }
                });
            }
        });
    }

    setupVertexContainer(scene, vertexContainer, shapeTransform) {
        let buffers = this.vertexConatinerBuffers[vertexContainer.key];

        let geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(buffers.vertexData), 3));
        geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(buffers.normData), 3));
        geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(buffers.textureCoordinate), 2));

        const material = new THREE.MeshStandardMaterial();

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = 274;
        mesh.position.y = 100;
        mesh.position.z = 2;
        mesh.scale.x = 0.01;
        mesh.scale.y = 0.01;
        mesh.scale.z = 0.01;
        if (shapeTransform != null) {
            mesh.position.x += shapeTransform.translateX;
            mesh.position.y += shapeTransform.translateY;
            mesh.position.z += shapeTransform.translateZ;
            mesh.applyQuaternion(new THREE.Quaternion(
                -shapeTransform.rotateX,
                shapeTransform.rotateY,
                shapeTransform.rotateZ,
                -shapeTransform.rotateW));
            mesh.scale.x *= shapeTransform.scaleX;
            mesh.scale.y *= shapeTransform.scaleY;
            mesh.scale.z *= shapeTransform.scaleZ;
        }
        let quaternion = new THREE.Quaternion();
        quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2);
        mesh.applyQuaternion(quaternion);
        quaternion = new THREE.Quaternion();
        quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
        mesh.applyQuaternion(quaternion);

        scene.add(mesh)
    }
}

export {
    MeshContainer
}