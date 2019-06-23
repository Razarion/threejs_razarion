import {Base} from "./base";
import * as THREE from "three";
import waterUrl from "./textures/Foam.png";
import coastUrl from "./textures/Coast.png";
import coastBumpMapUrl from "./textures/CoastBumpMap.png";
import slopeVertexShaderUrl from "./shaders/Slope.vert";
import slopeFragmentShaderUrl from "./shaders/Slope.frag";
import distortionMapUrl from "./textures/FoamDistortion.png";

class Slope extends Base {
    constructor(x, y, yLength, terrainShape, datGui, seabed) {
        super();
        this.x = x;
        this.y = y;
        this.yLength = yLength;
        this.terrainShape = terrainShape;
        this.waterLevel = -0.2;
        this.waterDelta = 1;
        this.waterGround = -2;
        this.waterScale = 57;
        this.coastScale = 57;
        this.coastBumpMapDepth = 1;
        this.metalnessFactor = 0.5;
        this.roughnessFactor = 0.5;
        this.distortionStrength = 0.1;
        this.distortionScale = 300;
        this.animationDuration = 40;
        this.gui = datGui.addFolder('Slope');
        this.gui.add(this, 'waterScale');
        this.gui.add(this, 'coastScale', 0);
        this.gui.add(this, 'coastBumpMapDepth');
        this.gui.add(this, 'metalnessFactor');
        this.gui.add(this, 'roughnessFactor');
        this.gui.add(this, 'distortionStrength');
        this.gui.add(this, 'distortionScale');
        this.gui.add(this, 'animationDuration');
        this.gui.add(this, 'waterLevel');
        this.gui.add(this, 'waterDelta');
        this.gui.add(this, 'waterGround');
        this.seabed = seabed;
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
        let water = this.setupTextureSimple(waterUrl, this.waterScale, this.xLength, this.yLength);
        let coast = this.setupTextureSimple(coastUrl, this.coastScale, this.xLength, this.yLength);
        let coastBumpMap = this.setupTextureSimple(coastBumpMapUrl, textureScale, this.xLength, this.yLength);
        let distortionMap = this.setupTextureSimple(distortionMapUrl, textureScale, this.xLength, this.yLength);

        this.material = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.merge([
                THREE.UniformsLib["lights"],
                {
                    uLightSpecularIntensity: {value: this.lightSpecularIntensity},
                    uLightSpecularHardness: {value: this.lightSpecularHardness},
                    uWater: {value: null},
                    uWaterScale: {value: this.waterScale},
                    uCoast: {value: null},
                    uCoastScale: {value: this.coastScale},
                    uSeabedTexture: {value: null},
                    uSeabedTextureScale: {value: this.seabed.getTextureScale()},
                    uCoastBumpMap: {value: null},
                    uCoastBumpMapDepth: {value: this.coastBumpMapDepth},
                    uMetalnessFactor: {value: this.metalnessFactor},
                    uRoughnessFactor: {value: this.roughnessFactor},
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
        this.material.uniforms.uCoast.value = coast;
        this.material.uniforms.uCoastBumpMap.value = coastBumpMap;
        this.material.uniforms.uSeabedTexture.value = this.seabed.setupTexture();
        this.material.uniforms.uDistortionMap.value = distortionMap;
        this.material.lights = true;
        this.material.metalness = 0;
        this.material.roughness = 0.5;
        this.material.extensions.derivatives = true;

        this.gui.add(this.material, "wireframe", 0, 1);

        let mesh = new THREE.Mesh(geometry, this.material);
        mesh.receiveShadow = true;
        scene.add(mesh);
    }

    update() {
        this.material.uniforms.uWaterScale.value = this.waterScale;
        this.material.uniforms.uCoastScale.value = this.coastScale;
        this.material.uniforms.uCoastBumpMapDepth.value = this.coastBumpMapDepth;
        this.material.uniforms.uMetalnessFactor.value = this.metalnessFactor;
        this.material.uniforms.uRoughnessFactor.value = this.roughnessFactor;
        this.material.uniforms.uDistortionScale.value = this.distortionScale;
        this.material.uniforms.uDistortionStrength.value = this.distortionStrength;
        this.material.uniforms.uSeabedTextureScale.value = this.seabed.getTextureScale();
        this.material.uniforms.animation.value = this.setupWaterAnimation();
        this.material.uniforms.uWaterLevel.value = this.waterLevel;
        this.material.uniforms.uWaterDelta.value = this.waterDelta;
        // this.material.uniforms.uWaterGround.value = this.waterGround;
    }
}

export {
    Slope
}