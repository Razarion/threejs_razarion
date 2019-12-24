import * as THREE from "three";
import {Base} from "./base";
import waterVertexShaderUrl from './shaders/Water.vert';
import waterFragmentShaderUrl from './shaders/Water.frag';

class Water extends Base {
    constructor(terrainWaterTile, slopeConfig) {
        super();
        this.terrainWaterTile = terrainWaterTile;
        this.slopeConfig = slopeConfig;
    }

    generateMesh(scene) {
        let geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(this.terrainWaterTile.vertices), 3));

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
                }
            ]),
            vertexShader: waterVertexShaderUrl,
            fragmentShader: waterFragmentShaderUrl
        });
        this.material.uniforms.uReflection.value = reflection;
        this.material.uniforms.uDistortionMap.value = distortionMap;
        this.material.uniforms.uBumpMap.value = bumpMap;
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
        this.material.wireframe = this.slopeConfig.wireframeWater;
    }
}

export {
    Water
}