import * as THREE from "three";
import waterSurfaceTextureUrl from "./textures/WaterCloudReflection.png";
import distortionMapUrl from "./textures/WaterDistortion.png";
import bumpMapUrl from "./textures/WaterBumpMap.png";
import {Base} from "./base";
import waterVertexShaderUrl from './shaders/Water.vert';
import waterFragmentShaderUrl from './shaders/Water.frag';

class Water extends Base {
    constructor(terrainWaterTile, slopeSkeletonConfig) {
        super();
        this.terrainWaterTile = terrainWaterTile;
        this.slopeSkeletonConfig = slopeSkeletonConfig;
    }

    generateMesh(scene) {
        let geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(this.terrainWaterTile.vertices), 3));
        geometry.addAttribute('aOffsetToOuter', new THREE.BufferAttribute(new Float32Array(this.terrainWaterTile.offsetToOuters), 1));

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
                    animation: {value: this.setupWaterAnimation(this.slopeSkeletonConfig.waterAnimationDuration)}
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
        this.material.uniforms.uWaterBeginsOffset.value = this.slopeSkeletonConfig.waterBeginsOffset;
        this.material.uniforms.uWaterFadeoutDistance.value = this.slopeSkeletonConfig.waterFadeoutDistance;
        this.material.uniforms.animation.value = this.setupWaterAnimation(this.slopeSkeletonConfig.waterAnimationDuration);
    }
}

export {
    Water
}