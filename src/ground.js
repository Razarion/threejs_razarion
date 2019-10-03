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

        let textureScale;
        let bumpMapDepth;
        let shininess;
        let specularStrength;
        if (this.slopeSkeletonConfig != null && this.slopeSkeletonConfig.hasOwnProperty('groundTextureId')) {
            textureScale = this.slopeSkeletonConfig.groundTextureScale;
            bumpMapDepth = this.slopeSkeletonConfig.groundBumpMapDepth;
            shininess = this.slopeSkeletonConfig.groundShininess;
            specularStrength = this.slopeSkeletonConfig.groundSpecularStrength;
        } else {
            textureScale = this.groundSkeletonConfig.topTexture.textureScaleConfig.scale;
            bumpMapDepth = this.groundSkeletonConfig.topTexture.bumpMapDepth;
            shininess = this.groundSkeletonConfig.topTexture.shininess;
            specularStrength = this.groundSkeletonConfig.topTexture.specularStrength;

        }

        this.material = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.merge([
                THREE.UniformsLib["lights"],
                {
                    uTexture: {value: null},
                    uTextureScale: {value: textureScale},
                    uBumpMap: {value: null},
                    uBumpMapDepth: {value: bumpMapDepth},
                    uShininess: {value: shininess},
                    uSpecularStrength: {value: specularStrength},
                }
            ]),
            vertexShader: groundVertexShaderUrl,
            fragmentShader: groundFragmentShaderUrl
        });


        if (this.slopeSkeletonConfig != null && this.slopeSkeletonConfig.hasOwnProperty('groundTextureId')) {
            this.material.uniforms.uTexture.value = this.setupTextureSimple(this.imageTable(this.slopeSkeletonConfig.groundTextureId));
            this.material.uniforms.uBumpMap.value = this.setupTextureSimple(this.imageTable(this.slopeSkeletonConfig.groundBumpMapId));
        } else {
            this.material.uniforms.uTexture.value = this.setupTextureSimple(this.imageTable(this.groundSkeletonConfig.topTexture.textureScaleConfig.id));
            this.material.uniforms.uBumpMap.value = this.setupTextureSimple(this.imageTable(this.groundSkeletonConfig.topTexture.bumpMapId));
        }
        this.material.lights = true;
        this.material.extensions.derivatives = true;

        let mesh = new THREE.Mesh(geometry, this.material);
        scene.add(mesh);
    }

    update() {
        if (this.slopeSkeletonConfig != null && this.slopeSkeletonConfig.hasOwnProperty('groundTextureId')) {
            this.material.uniforms.uTextureScale.value = this.slopeSkeletonConfig.groundTextureScale;
            this.material.uniforms.uBumpMapDepth.value = this.slopeSkeletonConfig.groundBumpMapDepth;
            this.material.uniforms.uShininess.value = this.slopeSkeletonConfig.groundShininess;
            this.material.uniforms.uSpecularStrength.value = this.slopeSkeletonConfig.groundSpecularStrength;
        } else {
            this.material.uniforms.uTextureScale.value = this.groundSkeletonConfig.topTexture.textureScaleConfig.scale;
            this.material.uniforms.uBumpMapDepth.value = this.groundSkeletonConfig.topTexture.bumpMapDepth;
            this.material.uniforms.uShininess.value = this.groundSkeletonConfig.topTexture.shininess;
            this.material.uniforms.uSpecularStrength.value = this.groundSkeletonConfig.topTexture.specularStrength;
        }

    }

}

export {
    Ground
}
