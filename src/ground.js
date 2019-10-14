import {Base} from "./base";
import * as THREE from "three";
import groundVertexShaderUrl from "./shaders/Ground.vert";
import groundFragmentShaderUrl from "./shaders/Ground.frag";

class Ground extends Base {
    constructor(groundPositions, groundNormals, groundSkeletonConfig, slopeSkeletonConfig) {
        super();
        this.groundPositions = groundPositions;
        this.groundNormals = groundNormals;
        this.groundSkeletonConfig = groundSkeletonConfig;
        this.slopeSkeletonConfig = slopeSkeletonConfig;
    }

    generateMesh(scene) {
        let geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(this.groundPositions), 3));
        geometry.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(this.groundNormals), 3));

        let uniforms = THREE.UniformsLib["lights"];
        uniforms = Ground.enrichUniform(this.slopeSkeletonConfig, this.groundSkeletonConfig, uniforms);

        this.material = new THREE.ShaderMaterial({
            vertexShader: groundVertexShaderUrl,
            fragmentShader: groundFragmentShaderUrl,
            uniforms: uniforms
        });

        Ground.enrichMaterial(this.slopeSkeletonConfig, this.groundSkeletonConfig, this.material, this);

        this.material.lights = true;
        this.material.extensions.derivatives = true;

        let mesh = new THREE.Mesh(geometry, this.material);
        scene.add(mesh);
    }

    static enrichUniform(slopeSkeletonConfig, groundSkeletonConfig, uniforms) {
        let topTextureScale;
        let topBumpMapDepth;
        let topShininess;
        let topSpecularStrength;
        if (slopeSkeletonConfig != null && slopeSkeletonConfig.hasOwnProperty('groundTextureId')) {
            topTextureScale = slopeSkeletonConfig.groundTextureScale;
            topBumpMapDepth = slopeSkeletonConfig.groundBumpMapDepth;
            topShininess = slopeSkeletonConfig.groundShininess;
            topSpecularStrength = slopeSkeletonConfig.groundSpecularStrength;
        } else {
            topTextureScale = groundSkeletonConfig.topTexture.textureScaleConfig.scale;
            topBumpMapDepth = groundSkeletonConfig.topTexture.bumpMapDepth;
            topShininess = groundSkeletonConfig.topTexture.shininess;
            topSpecularStrength = groundSkeletonConfig.topTexture.specularStrength;
        }

        let newUniforms = THREE.UniformsUtils.merge([
            uniforms,
            {
                uTopTexture: {value: null},
                uTopTextureScale: {value: topTextureScale},
                uTopBumpMap: {value: null},
                uTopBumpMapDepth: {value: topBumpMapDepth},
                uTopShininess: {value: topShininess},
                uTopSpecularStrength: {value: topSpecularStrength},
            }
        ]);

        if (groundSkeletonConfig.hasOwnProperty('bottomTexture')) {
            newUniforms = THREE.UniformsUtils.merge([newUniforms,
                {
                    uBottomTexture: {value: null},
                    uBottomTextureScale: {value: groundSkeletonConfig.bottomTexture.textureScaleConfig.scale},
                    uBottomBumpMap: {value: null},
                    uBottomBumpMapDepth: {value: groundSkeletonConfig.bottomTexture.bumpMapDepth},
                    uBottomShininess: {value: groundSkeletonConfig.bottomTexture.shininess},
                    uBottomSpecularStrength: {value: groundSkeletonConfig.bottomTexture.specularStrength},
                    uSplatting: {value: null},
                    uSplattingScale1: {value: groundSkeletonConfig.splatting.scale},
                    uSplattingScale2: {value: groundSkeletonConfig.splattingScale2},
                    uSplattingFadeThreshold: {value: groundSkeletonConfig.splattingFadeThreshold},
                    uSplattingOffset: {value: groundSkeletonConfig.splattingOffset}
                }]);
        }

        return newUniforms;
    }

    static enrichMaterial(slopeSkeletonConfig, groundSkeletonConfig, material, helperRef) {
        if (slopeSkeletonConfig != null && slopeSkeletonConfig.hasOwnProperty('groundTextureId')) {
            material.uniforms.uTopTexture.value = helperRef.setupTextureSimple(helperRef.imageTable(slopeSkeletonConfig.groundTextureId));
            material.uniforms.uTopBumpMap.value = helperRef.setupTextureSimple(helperRef.imageTable(slopeSkeletonConfig.groundBumpMapId));
            material.wireframe = slopeSkeletonConfig.wireframeSlopeGround;
        } else {
            material.uniforms.uTopTexture.value = helperRef.setupTextureSimple(helperRef.imageTable(groundSkeletonConfig.topTexture.textureScaleConfig.id));
            material.uniforms.uTopBumpMap.value = helperRef.setupTextureSimple(helperRef.imageTable(groundSkeletonConfig.topTexture.bumpMapId));
            if (groundSkeletonConfig.hasOwnProperty('bottomTexture')) {
                material.uniforms.uBottomTexture.value = helperRef.setupTextureSimple(helperRef.imageTable(groundSkeletonConfig.bottomTexture.textureScaleConfig.id));
                material.uniforms.uBottomBumpMap.value = helperRef.setupTextureSimple(helperRef.imageTable(groundSkeletonConfig.bottomTexture.bumpMapId));
                material.uniforms.uSplatting.value = helperRef.setupTextureSimple(helperRef.imageTable(groundSkeletonConfig.splatting.id));
                material.defines = {
                    RENDER_GROUND_TEXTURE: true
                };
            }
            material.wireframe = groundSkeletonConfig.wireframe;
        }
    }

    update() {
        Ground.update(this.slopeSkeletonConfig, this.groundSkeletonConfig, this.material);
    }

    static update(slopeSkeletonConfig, groundSkeletonConfig, material) {
        if (slopeSkeletonConfig != null && slopeSkeletonConfig.hasOwnProperty('groundTextureId')) {
            material.uniforms.uTopTextureScale.value = slopeSkeletonConfig.groundTextureScale;
            material.uniforms.uTopBumpMapDepth.value = slopeSkeletonConfig.groundBumpMapDepth;
            material.uniforms.uTopShininess.value = slopeSkeletonConfig.groundShininess;
            material.uniforms.uTopSpecularStrength.value = slopeSkeletonConfig.groundSpecularStrength;
            material.wireframe = slopeSkeletonConfig.wireframeSlopeGround;
        } else {
            material.uniforms.uTopTextureScale.value = groundSkeletonConfig.topTexture.textureScaleConfig.scale;
            material.uniforms.uTopBumpMapDepth.value = groundSkeletonConfig.topTexture.bumpMapDepth;
            material.uniforms.uTopShininess.value = groundSkeletonConfig.topTexture.shininess;
            material.uniforms.uTopSpecularStrength.value = groundSkeletonConfig.topTexture.specularStrength;
            material.wireframe = groundSkeletonConfig.wireframe;
            if (groundSkeletonConfig.hasOwnProperty('bottomTexture')) {
                material.uniforms.uBottomTextureScale.value = groundSkeletonConfig.bottomTexture.textureScaleConfig.scale;
                material.uniforms.uBottomBumpMapDepth.value = groundSkeletonConfig.bottomTexture.bumpMapDepth;
                material.uniforms.uBottomShininess.value = groundSkeletonConfig.bottomTexture.shininess;
                material.uniforms.uBottomSpecularStrength.value = groundSkeletonConfig.bottomTexture.specularStrength;
                material.uniforms.uSplattingScale1.value = groundSkeletonConfig.splatting.scale;
                material.uniforms.uSplattingScale2.value = groundSkeletonConfig.splattingScale2;
                material.uniforms.uSplattingFadeThreshold.value = groundSkeletonConfig.splattingFadeThreshold;
                material.uniforms.uSplattingOffset.value = groundSkeletonConfig.splattingOffset;
            }
        }

    }

}

export {
    Ground
}
