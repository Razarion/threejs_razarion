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

        let topTextureScale;
        let topBumpMapDepth;
        let topShininess;
        let topSpecularStrength;
        if (this.slopeSkeletonConfig != null && this.slopeSkeletonConfig.hasOwnProperty('groundTextureId')) {
            topTextureScale = this.slopeSkeletonConfig.groundTextureScale;
            topBumpMapDepth = this.slopeSkeletonConfig.groundBumpMapDepth;
            topShininess = this.slopeSkeletonConfig.groundShininess;
            topSpecularStrength = this.slopeSkeletonConfig.groundSpecularStrength;
        } else {
            topTextureScale = this.groundSkeletonConfig.topTexture.textureScaleConfig.scale;
            topBumpMapDepth = this.groundSkeletonConfig.topTexture.bumpMapDepth;
            topShininess = this.groundSkeletonConfig.topTexture.shininess;
            topSpecularStrength = this.groundSkeletonConfig.topTexture.specularStrength;
        }

        let uniforms = THREE.UniformsUtils.merge([
            THREE.UniformsLib["lights"],
            {
                uTopTexture: {value: null},
                uTopTextureScale: {value: topTextureScale},
                uTopBumpMap: {value: null},
                uTopBumpMapDepth: {value: topBumpMapDepth},
                uTopShininess: {value: topShininess},
                uTopSpecularStrength: {value: topSpecularStrength},
            }
        ]);

        if (this.groundSkeletonConfig.hasOwnProperty('bottomTexture')) {
            uniforms = THREE.UniformsUtils.merge([uniforms,
                {
                    uBottomTexture: {value: null},
                    uBottomTextureScale: {value: this.groundSkeletonConfig.bottomTexture.textureScaleConfig.scale},
                    uBottomBumpMap: {value: null},
                    uBottomBumpMapDepth: {value: this.groundSkeletonConfig.bottomTexture.bumpMapDepth},
                    uBottomShininess: {value: this.groundSkeletonConfig.bottomTexture.shininess},
                    uBottomSpecularStrength: {value: this.groundSkeletonConfig.bottomTexture.specularStrength},
                    uSplatting: {value: null},
                    uSplattingScale: {value: this.groundSkeletonConfig.splatting.scale},
                    uSplattingFadeThreshold: {value: this.groundSkeletonConfig.splattingFadeThreshold},
                    uSplattingOffset: {value: this.groundSkeletonConfig.splattingOffset}
                }]);
        }

        this.material = new THREE.ShaderMaterial({
            vertexShader: groundVertexShaderUrl,
            fragmentShader: groundFragmentShaderUrl,
            uniforms: uniforms
        });

        if (this.slopeSkeletonConfig != null && this.slopeSkeletonConfig.hasOwnProperty('groundTextureId')) {
            this.material.uniforms.uTopTexture.value = this.setupTextureSimple(this.imageTable(this.slopeSkeletonConfig.groundTextureId));
            this.material.uniforms.uTopBumpMap.value = this.setupTextureSimple(this.imageTable(this.slopeSkeletonConfig.groundBumpMapId));
            this.material.wireframe = this.slopeSkeletonConfig.wireframeSlopeGround;
        } else {
            this.material.uniforms.uTopTexture.value = this.setupTextureSimple(this.imageTable(this.groundSkeletonConfig.topTexture.textureScaleConfig.id));
            this.material.uniforms.uTopBumpMap.value = this.setupTextureSimple(this.imageTable(this.groundSkeletonConfig.topTexture.bumpMapId));
            if (this.groundSkeletonConfig.hasOwnProperty('bottomTexture')) {
                this.material.uniforms.uBottomTexture.value = this.setupTextureSimple(this.imageTable(this.groundSkeletonConfig.bottomTexture.textureScaleConfig.id));
                this.material.uniforms.uBottomBumpMap.value = this.setupTextureSimple(this.imageTable(this.groundSkeletonConfig.bottomTexture.bumpMapId));
                this.material.uniforms.uSplatting.value= this.setupTextureSimple(this.imageTable(this.groundSkeletonConfig.splatting.id));
                this.material.defines = {
                    RENDER_GROUND_TEXTURE: true
                };
            }
            this.material.wireframe = this.groundSkeletonConfig.wireframe;
        }
        this.material.lights = true;
        this.material.extensions.derivatives = true;

        let mesh = new THREE.Mesh(geometry, this.material);
        scene.add(mesh);
    }

    update() {
        if (this.slopeSkeletonConfig != null && this.slopeSkeletonConfig.hasOwnProperty('groundTextureId')) {
            this.material.uniforms.uTopTextureScale.value = this.slopeSkeletonConfig.groundTextureScale;
            this.material.uniforms.uTopBumpMapDepth.value = this.slopeSkeletonConfig.groundBumpMapDepth;
            this.material.uniforms.uTopShininess.value = this.slopeSkeletonConfig.groundShininess;
            this.material.uniforms.uTopSpecularStrength.value = this.slopeSkeletonConfig.groundSpecularStrength;
            this.material.wireframe = this.slopeSkeletonConfig.wireframeSlopeGround;
        } else {
            this.material.uniforms.uTopTextureScale.value = this.groundSkeletonConfig.topTexture.textureScaleConfig.scale;
            this.material.uniforms.uTopBumpMapDepth.value = this.groundSkeletonConfig.topTexture.bumpMapDepth;
            this.material.uniforms.uTopShininess.value = this.groundSkeletonConfig.topTexture.shininess;
            this.material.uniforms.uTopSpecularStrength.value = this.groundSkeletonConfig.topTexture.specularStrength;
            this.material.wireframe = this.groundSkeletonConfig.wireframe;
            if (this.groundSkeletonConfig.hasOwnProperty('bottomTexture')) {
                this.material.uniforms.uBottomTextureScale.value = this.groundSkeletonConfig.bottomTexture.textureScaleConfig.scale;
                this.material.uniforms.uBottomBumpMapDepth.value = this.groundSkeletonConfig.bottomTexture.bumpMapDepth;
                this.material.uniforms.uBottomShininess.value = this.groundSkeletonConfig.bottomTexture.shininess;
                this.material.uniforms.uBottomSpecularStrength.value = this.groundSkeletonConfig.bottomTexture.specularStrength;
                this.material.uniforms.uSplattingScale.value = this.groundSkeletonConfig.splatting.scale;
                this.material.uniforms.uSplattingFadeThreshold.value = this.groundSkeletonConfig.splattingFadeThreshold;
                this.material.uniforms.uSplattingOffset.value = this.groundSkeletonConfig.splattingOffset;
            }
        }

    }

}

export {
    Ground
}
