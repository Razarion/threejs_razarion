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
    constructor(terrainWaterTile, slopeSkeletonConfig) {
        super();
        this.terrainWaterTile = terrainWaterTile;
        this.slopeSkeletonConfig = slopeSkeletonConfig;
    }

    generateMesh(scene) {
        let geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(this.terrainWaterTile.shallowVertices), 3));
        geometry.addAttribute('aUv', new THREE.BufferAttribute(new Float32Array(this.terrainWaterTile.shallowUvs), 2));

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
                    uShininess: {value: this.slopeSkeletonConfig.waterShininess},
                    uSpecularStrength: {value: this.slopeSkeletonConfig.waterSpecularStrength},
                    uReflectionScale: {value: this.slopeSkeletonConfig.waterReflectionScale},
                    uMapScale: {value: this.slopeSkeletonConfig.waterMapScale},
                    uReflection: {value: null},
                    uDistortionMap: {value: null},
                    uDistortionStrength: {value: this.slopeSkeletonConfig.waterDistortionStrength},
                    uBumpMap: {value: null},
                    uBumpMapDepth: {value: this.slopeSkeletonConfig.waterBumpMapDepth},
                    uTransparency: {value: this.slopeSkeletonConfig.waterTransparency},
                    uWaterBeginsOffset: {value: this.slopeSkeletonConfig.waterBeginsOffset},
                    uWaterFadeoutDistance: {value: this.slopeSkeletonConfig.waterFadeoutDistance},
                    animation: {value: this.setupWaterAnimation(this.slopeSkeletonConfig.waterAnimationDuration)},
                    uShallowWater: {value: null},
                    uShallowWaterScale: {value: this.slopeSkeletonConfig.shallowWaterTextureScale},
                    uShallowDistortionMap: {value: null},
                    uShallowDistortionStrength: {value: this.slopeSkeletonConfig.shallowDistortionStrength},
                    uShallowAnimation: {value: this.setupWaterAnimation(this.slopeSkeletonConfig.shallowAnimation)},
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
        // this.gui.add(this.material, "wireframe", 0, 1);

        scene.add(new THREE.Mesh(geometry, this.material));
    }

    update() {
        this.material.uniforms.uShininess.value = this.slopeSkeletonConfig.waterShininess;
        this.material.uniforms.uSpecularStrength.value = this.slopeSkeletonConfig.waterSpecularStrength;
        this.material.uniforms.uReflectionScale.value = this.slopeSkeletonConfig.waterReflectionScale;
        this.material.uniforms.uMapScale.value = this.slopeSkeletonConfig.waterMapScale;
        this.material.uniforms.uDistortionStrength.value = this.slopeSkeletonConfig.waterDistortionStrength;
        this.material.uniforms.uBumpMapDepth.value = this.slopeSkeletonConfig.waterBumpMapDepth;
        this.material.uniforms.uTransparency.value = this.slopeSkeletonConfig.waterTransparency;
        this.material.uniforms.animation.value = this.setupWaterAnimation(this.slopeSkeletonConfig.waterAnimationDuration);
        this.material.uniforms.uShallowWaterScale.value = this.slopeSkeletonConfig.shallowWaterTextureScale;
        this.material.uniforms.uShallowDistortionStrength.value = this.slopeSkeletonConfig.shallowDistortionStrength;
        this.material.uniforms.uShallowAnimation.value = this.setupWaterAnimation(this.slopeSkeletonConfig.shallowAnimation);
        this.material.wireframe = this.slopeSkeletonConfig.wireframeSlope;
    }
}

export {
    ShallowWater
}