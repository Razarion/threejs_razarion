import {Base} from "./base";
import * as THREE from "three";
import waterUrl from "./textures/Foam.png";
import waveUrl from "./textures/Waves.png";
import bumpMapUrl from "./textures/CoastBumpMap.png";
import slopeVertexShaderUrl from "./shaders/Slope.vert";
import slopeFragmentShaderUrl from "./shaders/Slope.frag";
import distortionMapUrl from "./textures/WaterDistortion.png";
import groundTextureUrl from "./textures/UnderWater.png";

class Slope extends Base {
    constructor(x, y, yLength, terrainShape, datGui) {
        super();
        this.x = x;
        this.y = y;
        this.yLength = yLength;
        this.terrainShape = terrainShape;
        this.waterLevel = -0.2;
        this.waterDelta = 1;
        this.waterGround = -2;
        this.waterScale = 57;
        this.waveScale = 1;
        this.groundTextureScale = 90;
        this.distortionStrength = 0.1;
        this.distortionScale = 300;
        this.animationDuration = 40;
        this.underWaterTopColor = new THREE.Color('#f5d15c');
        this.underWaterBottomColor = new THREE.Color('#2e758c');
        this.gui = datGui.addFolder('Slope');
        this.gui.add(this, 'waterScale');
        this.gui.add(this, 'waveScale');
        this.gui.add(this, 'groundTextureScale');
        this.gui.add(this, 'distortionStrength');
        this.gui.add(this, 'distortionScale');
        this.gui.add(this, 'animationDuration');
        this.gui.add(this, 'waterLevel');
        this.gui.add(this, 'waterDelta');
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
        let water = this.setupTextureSimple(waterUrl, textureScale, this.xLength, this.yLength);
        let waves = this.setupTextureSimple(waveUrl, textureScale, this.xLength, this.yLength);
        let bumpMap = this.setupTextureSimple(bumpMapUrl, textureScale, this.xLength, this.yLength);
        let distortionMap = this.setupTextureSimple(distortionMapUrl, textureScale, this.xLength, this.yLength);
        let groundTexture = this.setupTextureScaled(groundTextureUrl, 1, this.xLength, this.yLength);

        this.material = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.merge([
                THREE.UniformsLib["lights"],
                {
                    uLightSpecularIntensity: {value: this.lightSpecularIntensity},
                    uLightSpecularHardness: {value: this.lightSpecularHardness},
                    uWater: {value: null},
                    uWaterScale: {value: this.waterScale},
                    waveScale: {value: this.waveScale},
                    groundTextureScale: {value: this.groundTextureScale},
                    wave: {value: null},
                    groundTexture: {value: null},
                    bumpMap: {value: null},
                    uDistortionScale: {value: this.distortionScale},
                    uDistortionMap: {value: null},
                    uDistortionStrength: {value: this.distortionStrength},
                    uWaterLevel: {value: this.waterLevel},
                    uWaterDelta: {value: this.waterDelta},
                    animation: {value: this.setupWaterAnimation()}
                }
            ]),
            vertexShader: slopeVertexShaderUrl,
            fragmentShader: slopeFragmentShaderUrl
        });

        this.material.uniforms.uWater.value = water;
        this.material.uniforms.wave.value = waves;
        this.material.uniforms.groundTexture.value = groundTexture;
        this.material.uniforms.uDistortionMap.value = distortionMap;
        this.material.lights = true;
        this.material.metalness = 0;
        this.material.roughness = 0.5;

        this.gui.add(this.material, "wireframe", 0, 1);

        let mesh = new THREE.Mesh(geometry, this.material);
        mesh.receiveShadow = true;
        scene.add(mesh);
    }

    update() {
        this.material.uniforms.uWaterScale.value = this.waterScale;
        this.material.uniforms.waveScale.value = this.waveScale;
        this.material.uniforms.uDistortionScale.value = this.distortionScale;
        this.material.uniforms.uDistortionStrength.value = this.distortionStrength;
        this.material.uniforms.groundTextureScale.value = this.groundTextureScale;
        this.material.uniforms.animation.value = this.setupWaterAnimation();
        this.material.uniforms.uWaterLevel.value = this.waterLevel;
        this.material.uniforms.uWaterDelta.value = this.waterDelta;
        // this.material.uniforms.uWaterGround.value = this.waterGround;
        // this.material.uniforms.uUnderWaterTopColor.value = this.underWaterTopColor;
        // this.material.uniforms.uUnderWaterBottomColor.value = this.underWaterBottomColor;
    }
}

export {
    Slope
}