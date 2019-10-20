import {Base} from "./base";
import * as THREE from "three";
import slopeVertexShaderUrl from "./shaders/Slope.vert";
import slopeFragmentShaderUrl from "./shaders/Slope.frag";
import {Ground} from "./ground";

class Slope extends Base {
    constructor(terrainSlopeTile, slopeSkeletonConfig, groundSkeletonConfig) {
        super();
        this.terrainSlopeTile = terrainSlopeTile;
        this.slopeSkeletonConfig = slopeSkeletonConfig;
        this.groundSkeletonConfig = groundSkeletonConfig;
    }

    generateMesh(scene) {
        let geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(this.terrainSlopeTile.vertices), 3));
        geometry.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(this.terrainSlopeTile.norms), 3));
        geometry.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(this.terrainSlopeTile.uvs), 2));
        geometry.addAttribute('aSlopeFactor', new THREE.BufferAttribute(new Float32Array(this.terrainSlopeTile.slopeFactors), 1));

        let uniforms = THREE.UniformsUtils.merge([
            THREE.UniformsLib["lights"],
            {
                uSlope: {value: null},
                uSlopeScale: {value: this.slopeSkeletonConfig.slopeTextureScale},
                uSlopeBumpMap: {value: null},
                uSlopeBumpMapDepth: {value: this.slopeSkeletonConfig.slopeBumpMapDepth},
                uShininess: {value: this.slopeSkeletonConfig.slopeShininess},
                uSpecularStrength: {value: this.slopeSkeletonConfig.slopeSpecularStrength},
                uSlopeSplatting: {value: null},
                uSlopeSplattingScale1: {value: this.slopeSkeletonConfig.slopeSplattingScale1},
                uSlopeSplattingScale2: {value: this.slopeSkeletonConfig.slopeSplattingScale2},
                uSlopeSplattingFadeThreshold: {value: this.slopeSkeletonConfig.slopeSplattingFadeThreshold},
                uSlopeSplattingOffset: {value: this.slopeSkeletonConfig.slopeSplattingOffset}
            }
        ]);

        if (this.slopeSkeletonConfig.hasOwnProperty('slopeFoamTextureId')) {
            uniforms = THREE.UniformsUtils.merge([uniforms,
                {
                    uFoam: {value: null},
                    uFoamDistortion: {value: null},
                    uFoamDistortionStrength: {value: this.slopeSkeletonConfig.slopeFoamDistortionStrength},
                    uFoamAnimation: {value: this.setupWaterAnimation(this.slopeSkeletonConfig.slopeFoamAnimationDuration)}
                }]);
        }

        uniforms = Ground.enrichUniform(/*TODO this.slopeSkeletonConfig*/ null, this.groundSkeletonConfig, uniforms);

        this.material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: slopeVertexShaderUrl,
            fragmentShader: slopeFragmentShaderUrl
        });

        this.material.uniforms.uSlope.value = this.setupTextureSimple(this.imageTable(this.slopeSkeletonConfig.slopeTextureId));
        this.material.uniforms.uSlopeBumpMap.value = this.setupTextureSimple(this.imageTable(this.slopeSkeletonConfig.slopeBumpMapId));
        this.material.uniforms.uSlopeSplatting.value = this.setupTextureSimple(this.imageTable(this.slopeSkeletonConfig.slopeSplattingId));
        if (this.slopeSkeletonConfig.hasOwnProperty('slopeFoamTextureId')) {
            this.material.uniforms.uFoam.value = this.setupTextureSimple(this.imageTable(this.slopeSkeletonConfig.slopeFoamTextureId));
            this.material.uniforms.uFoamDistortion.value = this.setupTextureSimple(this.imageTable(this.slopeSkeletonConfig.slopeFoamDistortionId));
            // TODO Foam not rendered because DEFINES are overridden
            // TODO Foam is replaced by WaterShader? What about foam on cliffs?
            // TODO Problem with Fresnel in Water
            // this.material.defines = {
            //     RENDER_FOAM: true
            // };
        }
        Ground.enrichMaterial(/* TODO this.slopeSkeletonConfig*/ null, this.groundSkeletonConfig, this.material, this);

        this.material.lights = true;
        this.material.extensions.derivatives = true;

        let mesh = new THREE.Mesh(geometry, this.material);
        mesh.receiveShadow = true;
        scene.add(mesh);
    }

    update() {
        this.material.uniforms.uSlopeScale.value = this.slopeSkeletonConfig.slopeTextureScale;
        this.material.uniforms.uSlopeBumpMapDepth.value = this.slopeSkeletonConfig.slopeBumpMapDepth;
        this.material.uniforms.uShininess.value = this.slopeSkeletonConfig.slopeShininess;
        this.material.uniforms.uSpecularStrength.value = this.slopeSkeletonConfig.slopeSpecularStrength;
        this.material.uniforms.uSlopeSplattingScale1.value = this.slopeSkeletonConfig.slopeSplattingScale1;
        this.material.uniforms.uSlopeSplattingScale2.value = this.slopeSkeletonConfig.slopeSplattingScale2;
        this.material.uniforms.uSlopeSplattingFadeThreshold.value = this.slopeSkeletonConfig.slopeSplattingFadeThreshold;
        this.material.uniforms.uSlopeSplattingOffset.value = this.slopeSkeletonConfig.slopeSplattingOffset;
        if (this.slopeSkeletonConfig.hasOwnProperty('slopeFoamTextureId')) {
            this.material.uniforms.uFoamDistortionStrength.value = this.slopeSkeletonConfig.slopeFoamDistortionStrength;
            this.material.uniforms.uFoamAnimation.value = this.setupWaterAnimation(this.slopeSkeletonConfig.slopeFoamAnimationDuration);
        }
        this.material.wireframe = this.slopeSkeletonConfig.wireframeSlope;

        Ground.update(/* TODO this.slopeSkeletonConfig*/ null, this.groundSkeletonConfig, this.material);
    }
}

export {
    Slope
}