import * as THREE from "three";
import waterSurfaceTextureUrl from "./textures/WaterCloudReflection.png";
import distortionMapUrl from "./textures/WaterDistortion.png";
import bumpMapUrl from "./textures/WaterBumpMap.png";
import {Base} from "./base";
import shallowWaterVertexShaderUrl from './shaders/ShallowWater.vert';
import shallowWaterFragmentShaderUrl from './shaders/ShallowWater.frag';
import shallowWaterUrl from "./textures/ShallowWaterFoam.png";
import shallowDistortionUrl from "./textures/FoamDistortion.png";
import waterStencilUrl from "./textures/WaterStencil.png";

class ShallowWater extends Base {
    constructor(terrainWaterTile, slopeConfig) {
        super();
        this.terrainWaterTile = terrainWaterTile;
        this.slopeConfig = slopeConfig;
    }

    generateMesh(scene) {
        let geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(this.terrainWaterTile.shallowVertices), 3));
        geometry.addAttribute('aUv', new THREE.BufferAttribute(new Float32Array(this.terrainWaterTile.shallowUvs), 2));

        // TODO take image from imageTable -> merge water with this class
        let loader = new THREE.TextureLoader();
        let reflection = loader.load(waterSurfaceTextureUrl);
        reflection.wrapS = THREE.RepeatWrapping;
        reflection.wrapT = THREE.RepeatWrapping;
        let distortionMap = loader.load(distortionMapUrl);
        distortionMap.wrapS = THREE.RepeatWrapping;
        distortionMap.wrapT = THREE.RepeatWrapping;
        let bumpMap = loader.load(bumpMapUrl);
        bumpMap.wrapS = THREE.RepeatWrapping;
        bumpMap.wrapT = THREE.RepeatWrapping;
        let shallowWater = new THREE.TextureLoader().load(shallowWaterUrl);
        shallowWater.wrapS = THREE.ClampToEdgeWrapping;
        shallowWater.wrapT = THREE.RepeatWrapping;
        let shallowDistortionMap = this.setupTextureSimple(shallowDistortionUrl);
        let waterStencil = new THREE.TextureLoader().load(waterStencilUrl);
        waterStencil.wrapS = THREE.ClampToEdgeWrapping;
        waterStencil.wrapT = THREE.RepeatWrapping;

        this.material = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.merge([
                THREE.UniformsLib["lights"],
                {
                    uFresnelOffset: {value: this.slopeConfig.waterFresnelOffset},
                    uFresnelDelta: {value: this.slopeConfig.waterFresnelDelta},
                    uShininess: {value: this.slopeConfig.waterShininess},
                    uSpecularStrength: {value: this.slopeConfig.waterSpecularStrength},
                    uReflectionScale: {value: this.slopeConfig.waterReflectionScale},
                    uMapScale: {value: this.slopeConfig.waterMapScale},
                    uReflection: {value: null},
                    uDistortionMap: {value: null},
                    uDistortionStrength: {value: this.slopeConfig.waterDistortionStrength},
                    uBumpMap: {value: null},
                    uBumpMapDepth: {value: this.slopeConfig.waterBumpMapDepth},
                    uTransparency: {value: this.slopeConfig.waterTransparency},
                    uWaterBeginsOffset: {value: this.slopeConfig.waterBeginsOffset},
                    uWaterFadeoutDistance: {value: this.slopeConfig.waterFadeoutDistance},
                    animation: {value: this.setupWaterAnimation(this.slopeConfig.waterAnimationDuration)},
                    uShallowWater: {value: null},
                    uShallowWaterScale: {value: this.slopeConfig.shallowWaterTextureScale},
                    uShallowDistortionMap: {value: null},
                    uShallowDistortionStrength: {value: this.slopeConfig.shallowWaterDistortionStrength},
                    uShallowAnimation: {value: this.setupWaterAnimation(this.slopeConfig.shallowWaterAnimation)},
                    uWaterStencil: {value: null},
                }
            ]),
            vertexShader: shallowWaterVertexShaderUrl,
            fragmentShader: shallowWaterFragmentShaderUrl
        });
        this.material.uniforms.uReflection.value = reflection;
        this.material.uniforms.uDistortionMap.value = distortionMap;
        this.material.uniforms.uBumpMap.value = bumpMap;
        this.material.uniforms.uShallowWater.value = shallowWater;
        this.material.uniforms.uShallowDistortionMap.value = shallowDistortionMap;
        this.material.uniforms.uWaterStencil.value = waterStencil;
        this.material.lights = true;
        this.material.transparent = true;
        this.material.extensions.derivatives = true;

        scene.add(new THREE.Mesh(geometry, this.material));
    }

    update() {
        this.material.uniforms.uFresnelOffset.value = this.slopeConfig.waterFresnelOffset;
        this.material.uniforms.uFresnelDelta.value = this.slopeConfig.waterFresnelDelta;
        this.material.uniforms.uShininess.value = this.slopeConfig.waterShininess;
        this.material.uniforms.uSpecularStrength.value = this.slopeConfig.waterSpecularStrength;
        this.material.uniforms.uReflectionScale.value = this.slopeConfig.waterReflectionScale;
        this.material.uniforms.uMapScale.value = this.slopeConfig.waterMapScale;
        this.material.uniforms.uDistortionStrength.value = this.slopeConfig.waterDistortionStrength;
        this.material.uniforms.uBumpMapDepth.value = this.slopeConfig.waterBumpMapDepth;
        this.material.uniforms.uTransparency.value = this.slopeConfig.waterTransparency;
        this.material.uniforms.animation.value = this.setupWaterAnimation(this.slopeConfig.waterAnimationDuration);
        this.material.uniforms.uShallowWaterScale.value = this.slopeConfig.shallowWaterTextureScale;
        this.material.uniforms.uShallowDistortionStrength.value = this.slopeConfig.shallowWaterDistortionStrength;
        this.material.uniforms.uShallowAnimation.value = this.setupWaterAnimation(this.slopeConfig.shallowWaterAnimation);
        this.material.wireframe = this.slopeConfig.wireframeWater;
    }
}

export {
    ShallowWater
}