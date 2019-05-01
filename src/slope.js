import {Base} from "./base";
import * as THREE from "three";
import textureUrl from "./textures/Grey512.png";
import bumpMapUrl from "./textures/NormalMaps3.png";

class Slope extends Base {
    constructor(x, y, yLength, terrainShape, datGui) {
        super();
        this.x = x;
        this.y = y;
        this.yLength = yLength;
        this.terrainShape = terrainShape;
        this.waterLevel = 0;
        this.waterGround = -2;
        this.underWaterTopColor = new THREE.Color('#f5d15c');
        this.underWaterBottomColor = new THREE.Color('#2e758c');
        this.gui = datGui.addFolder('Slope');
        this.gui.add(this, 'waterLevel');
        this.gui.add(this, 'waterGround');
        let holder1 = {'underWaterTopColor': this.underWaterTopColor.getHex()};
        this.gui.addColor(holder1, 'underWaterTopColor').onChange(() => this.underWaterTopColor.setHex(holder1.underWaterTopColor));
        let holder2 = {'underWaterBottomColor': this.underWaterBottomColor.getHex()};
        this.gui.addColor(holder2, 'underWaterBottomColor').onChange(() => this.underWaterBottomColor.setHex(holder2.underWaterBottomColor));
    }

    generateMesh(scene) {
        let xSegments = this.terrainShape.length - 1;
        let ySegments = Math.floor(this.yLength / Base.EDGE_LENGTH);
        this.xLength = xSegments * Base.EDGE_LENGTH;
        this.yLength = ySegments * Base.EDGE_LENGTH;
        let geometry = new THREE.PlaneBufferGeometry(this.xLength, this.yLength, xSegments, ySegments);
        geometry.translate(this.x + this.xLength / 2, this.y + this.yLength / 2, 0);
        let index = 0;
        for (let y = 0; y <= ySegments; y++) {
            for (let x = 0; x <= xSegments; x++) {
                geometry.attributes.position.array[index * 3 + 2] = this.terrainShape[x];
                index++;
            }
        }
        geometry.computeVertexNormals();

        let textureScale = 1;
        let texture = this.setupTexture(textureUrl, textureScale, this.xLength, this.yLength);
        let bumpMap = this.setupTexture(bumpMapUrl, textureScale, this.xLength, this.yLength);
        // this.material = new THREE.MeshNormalMaterial()
        this.material = new THREE.MeshStandardMaterial({
                map: texture,
                // bumpMap: bumpMap,
                normalMap: bumpMap,
            }
        );
        this.material.metalness = 0;
        this.material.roughness = 0.5;

        this.gui.add(this.material, "metalness", 0, 1);
        this.gui.add(this.material, "roughness", 0, 1);
        // this.gui.add(this.material, "bumpScale", -5, 5);
        let normalScaleModel = {normalScale: 1.0};
        this.gui.add(normalScaleModel, 'normalScale', -5, 5).onChange(() => this.material.normalScale.set(normalScaleModel.normalScale, normalScaleModel.normalScale));

        this.gui.add(this.material, "wireframe", 0, 1);

        scene.add(new THREE.Mesh(geometry, this.material));
    }

    update() {
        // this.material.uniforms.uWaterLevel.value = this.waterLevel;
        // this.material.uniforms.uWaterGround.value = this.waterGround;
        // this.material.uniforms.uUnderWaterTopColor.value = this.underWaterTopColor;
        // this.material.uniforms.uUnderWaterBottomColor.value = this.underWaterBottomColor;
    }
}

export {
    Slope
}