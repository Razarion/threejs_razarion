import {Base} from "./base";
import * as THREE from "three";
import slopeVertexShaderUrl from "./shaders/Slope.vert";
import slopeFragmentShaderUrl from "./shaders/Slope.frag";
import underWaterUrl from "./textures/UnderWater.png";

class Slope extends Base {
    constructor(terrainSlopeTile, slopeSkeletonConfig) {
        super();
        this.terrainSlopeTile = terrainSlopeTile;
        this.slopeSkeletonConfig = slopeSkeletonConfig;
        this.coastScale = 21;
        this.distortionStrength = 1;
    }

    generateMesh(scene) {
        let geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(this.terrainSlopeTile.vertices), 3));
        geometry.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(this.terrainSlopeTile.norms), 3));
        geometry.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(this.terrainSlopeTile.uvs), 2));

        let underWater = this.setupTextureSimple(underWaterUrl);

        let uniforms = THREE.UniformsUtils.merge([
            THREE.UniformsLib["lights"],
            {
                uSlope: {value: null},
                uSlopeScale: {value: this.slopeSkeletonConfig.slopeTextureScale},
                uSlopeBumpMap: {value: null},
                uSlopeBumpMapDepth: {value: this.slopeSkeletonConfig.slopeBumpMapDepth},
                uShininess: {value: this.slopeSkeletonConfig.slopeShininess},
                uSpecularStrength: {value: this.slopeSkeletonConfig.slopeSpecularStrength},
                uGroundTexture: {value: this.coastScale}, // TODO
                uGroundTextureScale: {value: 3000}, // TODO
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

        this.material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: slopeVertexShaderUrl,
            fragmentShader: slopeFragmentShaderUrl
        });

        this.material.uniforms.uSlope.value = this.setupTextureSimple(this.imageTable(this.slopeSkeletonConfig.slopeTextureId));
        this.material.uniforms.uSlopeBumpMap.value = this.setupTextureSimple(this.imageTable(this.slopeSkeletonConfig.slopeBumpMapId));
        if (this.slopeSkeletonConfig.hasOwnProperty('slopeFoamTextureId')) {
            this.material.uniforms.uFoam.value = this.setupTextureSimple(this.imageTable(this.slopeSkeletonConfig.slopeFoamTextureId));
            this.material.uniforms.uFoamDistortion.value = this.setupTextureSimple(this.imageTable(this.slopeSkeletonConfig.slopeFoamDistortionId));
            this.material.defines = {
                RENDER_FOAM: true
            };
        }
        this.material.uniforms.uGroundTexture.value = underWater;
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
        if (this.slopeSkeletonConfig.hasOwnProperty('slopeFoamTextureId')) {
            this.material.uniforms.uFoamDistortionStrength.value = this.slopeSkeletonConfig.slopeFoamDistortionStrength;
            this.material.uniforms.uFoamAnimation.value = this.setupWaterAnimation(this.slopeSkeletonConfig.slopeFoamAnimationDuration);
        }
        this.material.uniforms.uGroundTextureScale.value = 3000; // TODO
        this.material.wireframe = this.slopeSkeletonConfig.wireframeSlope;
    }
}

export {
    Slope
}