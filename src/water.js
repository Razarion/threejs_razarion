import * as THREE from "three";
import {Base} from "./base";
import waterVertexShaderUrl from './shaders/Water.vert';
import waterFragmentShaderUrl from './shaders/Water.frag';

class Water extends Base {
    constructor(slopeConfig, waterPositions, waterUvs) {
        super();
        this.slopeConfig = slopeConfig;
        this.waterPositions = waterPositions;
        this.waterUvs = waterUvs;
    }

    generateMesh(scene) {
        let geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(this.waterPositions), 3));
        if (this.waterUvs != null) {
            geometry.addAttribute('aUv', new THREE.BufferAttribute(new Float32Array(this.waterUvs), 2));
        }

        let loader = new THREE.TextureLoader();
        let reflection = loader.load(this.imageTable(this.slopeConfig.waterReflectionId));
        reflection.wrapS = THREE.RepeatWrapping;
        reflection.wrapT = THREE.RepeatWrapping;
        let distortionMap = loader.load(this.imageTable(this.slopeConfig.waterDistortionId));
        distortionMap.wrapS = THREE.RepeatWrapping;
        distortionMap.wrapT = THREE.RepeatWrapping;
        let bumpMap = loader.load(this.imageTable(this.slopeConfig.waterBumpMapId));
        bumpMap.wrapS = THREE.RepeatWrapping;
        bumpMap.wrapT = THREE.RepeatWrapping;

        let uniforms = THREE.UniformsUtils.merge([
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
                animation: {value: this.setupWaterAnimation(this.slopeConfig.waterAnimationDuration)},
            }
        ]);

        if (this.waterUvs != null) {
            uniforms = THREE.UniformsUtils.merge([uniforms,
                {
                    uShallowWater: {value: null},
                    uShallowWaterScale: {value: this.slopeConfig.shallowWaterTextureScale},
                    uShallowDistortionMap: {value: null},
                    uShallowDistortionStrength: {value: this.slopeConfig.shallowWaterDistortionStrength},
                    uShallowAnimation: {value: this.setupWaterAnimation(this.slopeConfig.shallowWaterAnimation)},
                    uWaterStencil: {value: null},
                }]);
        }

        this.material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: waterVertexShaderUrl,
            fragmentShader: waterFragmentShaderUrl
        });


        this.material.uniforms.uReflection.value = reflection;
        this.material.uniforms.uDistortionMap.value = distortionMap;
        this.material.uniforms.uBumpMap.value = bumpMap;
        this.material.lights = true;
        this.material.transparent = true;
        this.material.extensions.derivatives = true;
        if (this.waterUvs != null) {
            let shallowDistortionMap = this.setupTextureSimple(this.imageTable(this.slopeConfig.shallowWaterDistortionId));
            let shallowWater = loader.load(this.imageTable(this.slopeConfig.shallowWaterTextureId));
            shallowWater.wrapS = THREE.ClampToEdgeWrapping;
            shallowWater.wrapT = THREE.RepeatWrapping;
            let waterStencil = loader.load(this.imageTable(this.slopeConfig.shallowWaterStencilId));
            waterStencil.wrapS = THREE.ClampToEdgeWrapping;
            waterStencil.wrapT = THREE.RepeatWrapping;

            this.material.uniforms.uShallowWater.value = shallowWater;
            this.material.uniforms.uShallowDistortionMap.value = shallowDistortionMap;
            this.material.uniforms.uWaterStencil.value = waterStencil;
            this.material.defines = this.material.defines || {};
            this.material.defines.RENDER_SHALLOW_WATER = true;
        }

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
        if (this.waterUvs != null) {
            this.material.uniforms.uShallowWaterScale.value = this.slopeConfig.shallowWaterTextureScale;
            this.material.uniforms.uShallowDistortionStrength.value = this.slopeConfig.shallowWaterDistortionStrength;
            this.material.uniforms.uShallowAnimation.value = this.setupWaterAnimation(this.slopeConfig.shallowWaterAnimation);
        }
        this.material.wireframe = this.slopeConfig.wireframeWater;
    }
}

export {
    Water
}