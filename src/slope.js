import {Base} from "./base";
import * as THREE from "three";
import slopeVertexShaderUrl from "./shaders/Slope.vert";
import slopeFragmentShaderUrl from "./shaders/Slope.frag";
import {Ground} from "./ground";

class Slope extends Base {

    constructor(slopeGeometry, slopeConfig, groundSkeletonConfig, slopeGroundSplattingConfig) {
        super();
        this.slopeGeometry = slopeGeometry;
        this.slopeConfig = slopeConfig;
        this.groundSkeletonConfig = groundSkeletonConfig;
        this.slopeGroundSplattingConfig = slopeGroundSplattingConfig;
    }

    generateMesh(scene) {
        let geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(this.slopeGeometry.positions), 3));
        geometry.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(this.slopeGeometry.norms), 3));
        geometry.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(this.slopeGeometry.uvs), 2));
        geometry.addAttribute('aSlopeFactor', new THREE.BufferAttribute(new Float32Array(this.slopeGeometry.slopeFactors), 1));

        let uniforms = THREE.UniformsUtils.merge([
            THREE.UniformsLib["lights"],
            {
                uSlope: {value: null},
                uSlopeScale: {value: this.slopeConfig.slopeTextureScale},
                uSlopeBumpMap: {value: null},
                uSlopeBumpMapDepth: {value: this.slopeConfig.slopeBumpMapDepth},
                uShininess: {value: this.slopeConfig.slopeShininess},
                uSpecularStrength: {value: this.slopeConfig.slopeSpecularStrength},
            }
        ]);

        if (this.slopeGroundSplattingConfig != null) {
            uniforms = THREE.UniformsUtils.merge([uniforms,
                {
                    uSlopeSplatting: {value: null},
                    uSlopeSplattingScale1: {value: this.slopeGroundSplattingConfig.scale1},
                    uSlopeSplattingScale2: {value: this.slopeGroundSplattingConfig.scale2},
                    uSlopeSplattingFadeThreshold: {value: this.slopeGroundSplattingConfig.fadeThreshold},
                    uSlopeSplattingOffset: {value: this.slopeGroundSplattingConfig.offset}
                }]);
        }

        if (this.slopeConfig.hasOwnProperty('slopeFoamTextureId')) {
            uniforms = THREE.UniformsUtils.merge([uniforms,
                {
                    uFoam: {value: null},
                    uFoamDistortion: {value: null},
                    uFoamDistortionStrength: {value: this.slopeConfig.slopeFoamDistortionStrength},
                    uFoamAnimation: {value: this.setupWaterAnimation(this.slopeConfig.slopeFoamAnimationDuration)}
                }]);
        }
        if (this.groundSkeletonConfig != null) {
            uniforms = Ground.enrichUniform(this.groundSkeletonConfig, uniforms);
        }

        this.material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: slopeVertexShaderUrl,
            fragmentShader: slopeFragmentShaderUrl
        });

        this.material.uniforms.uSlope.value = this.setupTextureSimple(this.imageTable(this.slopeConfig.slopeTextureId));
        this.material.uniforms.uSlopeBumpMap.value = this.setupTextureSimple(this.imageTable(this.slopeConfig.slopeBumpMapId));
        if (this.slopeGroundSplattingConfig != null) {
            this.material.uniforms.uSlopeSplatting.value = this.setupTextureSimple(this.imageTable(this.slopeGroundSplattingConfig.imageId));
        }
        if (this.slopeConfig.hasOwnProperty('slopeFoamTextureId')) {
            this.material.uniforms.uFoam.value = this.setupTextureSimple(this.imageTable(this.slopeConfig.slopeFoamTextureId));
            this.material.uniforms.uFoamDistortion.value = this.setupTextureSimple(this.imageTable(this.slopeConfig.slopeFoamDistortionId));
            // TODO Foam not rendered because DEFINES are overridden
            // TODO Foam is replaced by WaterShader? What about foam on cliffs?
            // TODO Problem with Fresnel in Water
            // this.material.defines = {
            //     RENDER_FOAM: true
            // };
        }
        if (this.groundSkeletonConfig != null) {
            Ground.enrichMaterial(this.groundSkeletonConfig, this.material, this);
        }

        this.material.lights = true;
        this.material.extensions.derivatives = true;

        let mesh = new THREE.Mesh(geometry, this.material);
        mesh.receiveShadow = true;
        scene.add(mesh);
    }

    update() {
        this.material.uniforms.uSlopeScale.value = this.slopeConfig.slopeTextureScale;
        this.material.uniforms.uSlopeBumpMapDepth.value = this.slopeConfig.slopeBumpMapDepth;
        this.material.uniforms.uShininess.value = this.slopeConfig.slopeShininess;
        this.material.uniforms.uSpecularStrength.value = this.slopeConfig.slopeSpecularStrength;
        if (this.groundSkeletonConfig != null) {
            this.material.uniforms.uSlopeSplattingScale1.value = this.slopeGroundSplattingConfig.scale1;
            this.material.uniforms.uSlopeSplattingScale2.value = this.slopeGroundSplattingConfig.scale2;
            this.material.uniforms.uSlopeSplattingFadeThreshold.value = this.slopeGroundSplattingConfig.fadeThreshold;
            this.material.uniforms.uSlopeSplattingOffset.value = this.slopeGroundSplattingConfig.offset;
        }
        if (this.slopeConfig.hasOwnProperty('slopeFoamTextureId')) {
            this.material.uniforms.uFoamDistortionStrength.value = this.slopeConfig.slopeFoamDistortionStrength;
            this.material.uniforms.uFoamAnimation.value = this.setupWaterAnimation(this.slopeConfig.slopeFoamAnimationDuration);
        }
        this.material.wireframe = this.slopeConfig.wireframeSlope;

        if (this.groundSkeletonConfig != null) {
            Ground.update(this.groundSkeletonConfig, this.material);
        }
    }
}

export {
    Slope
}