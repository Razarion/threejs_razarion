import {Base} from "./base";
import * as THREE from "three";
import groundVertexShaderUrl from "./shaders/Ground.vert";
import groundFragmentShaderUrl from "./shaders/Ground.frag";

class Ground extends Base {
    constructor(groundPositions, groundNormals, groundSkeletonConfig) {
        super();
        this.groundPositions = groundPositions;
        this.groundNormals = groundNormals;
        this.groundSkeletonConfig = groundSkeletonConfig;
    }

    generateMesh(scene) {
        let geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.groundPositions), 3));
        geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(this.groundNormals), 3));

        let uniforms = THREE.UniformsLib["lights"];
        uniforms = Ground.enrichUniform(this.groundSkeletonConfig, uniforms);

        this.material = new THREE.ShaderMaterial({
            vertexShader: groundVertexShaderUrl,
            fragmentShader: groundFragmentShaderUrl,
            uniforms: uniforms
        });
        this.material.wireframe = this.groundSkeletonConfig.wireframe;

        Ground.enrichMaterial(this.groundSkeletonConfig, this.material, this);

        this.material.lights = true;
        this.material.extensions.derivatives = true;

        let mesh = new THREE.Mesh(geometry, this.material);
        scene.add(mesh);
    }

    static enrichUniform(groundSkeletonConfig, uniforms) {
        let newUniforms = THREE.UniformsUtils.merge([
            uniforms,
            {
                uTopTexture: {value: null},
                uTopTextureScale: {value: groundSkeletonConfig.topTexture.textureScaleConfig.scale},
                uTopBumpMap: {value: null},
                uTopBumpMapDepth: {value: groundSkeletonConfig.topTexture.bumpMapDepth},
                uTopShininess: {value: groundSkeletonConfig.topTexture.shininess},
                uTopSpecularStrength: {value: groundSkeletonConfig.topTexture.specularStrength},
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

    static enrichMaterial(groundSkeletonConfig, material, helperRef) {
        material.uniforms.uTopTexture.value = helperRef.setupTextureSimple(helperRef.imageTable(groundSkeletonConfig.topTexture.textureScaleConfig.id));
        material.uniforms.uTopBumpMap.value = helperRef.setupTextureSimple(helperRef.imageTable(groundSkeletonConfig.topTexture.bumpMapId));
        if (groundSkeletonConfig.hasOwnProperty('bottomTexture')) {
            material.uniforms.uBottomTexture.value = helperRef.setupTextureSimple(helperRef.imageTable(groundSkeletonConfig.bottomTexture.textureScaleConfig.id));
            material.uniforms.uBottomBumpMap.value = helperRef.setupTextureSimple(helperRef.imageTable(groundSkeletonConfig.bottomTexture.bumpMapId));
            material.uniforms.uSplatting.value = helperRef.setupTextureSimple(helperRef.imageTable(groundSkeletonConfig.splatting.id));
            material.defines = material.defines || {};
            material.defines.RENDER_GROUND_BOTTOM_TEXTURE = true;
        }
    }

    update() {
        Ground.update(this.groundSkeletonConfig, this.material);
    }

    static update(groundSkeletonConfig, material) {
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

export {
    Ground
}
