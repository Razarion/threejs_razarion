import {Base} from "./base";
import * as THREE from "three";
import grassTextureUrl from "./textures/GrassTexture.png";
import underWaterUrl from "./textures/UnderWater.png";
import groundVertexShaderUrl from "./shaders/Ground.vert";
import groundFragmentShaderUrl from "./shaders/Ground.frag";

class Ground extends Base {
    constructor(datGui, slopeId, groundPositions, groundNormals) {
        super();
        this.groundPositions = groundPositions;
        this.groundNormals = groundNormals;
        this.slopeId = slopeId;
        if(slopeId != null) {
            this.gui = datGui.addFolder('Ground (SlopeId:' + slopeId + ')');
        } else {
            this.gui = datGui.addFolder('Ground');
        }
        // Render Properties
        if(slopeId != null) {
            this.groundTextureScale = 3000;
        } else {
            this.groundTextureScale = 50;
        }
    }

    generateMesh(scene) {
        let geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(this.groundPositions), 3));
        geometry.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(this.groundNormals), 3));

        this.material = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.merge([
                THREE.UniformsLib["lights"],
                {
                    uGroundTexture: {value: null},
                    uGroundTextureScale: {value: this.groundTextureScale},
                    // uCoast: {value: null},
                    // uCoastScale: {value: this.coastScale},
                    // uSeabedTexture: {value: null},
                    // uSeabedTextureScale: {value: this.seabed.getTextureScale()},
                    // uCoastBumpMap: {value: null},
                    // uCoastBumpMapDepth: {value: this.coastBumpMapDepth},
                    // uShininess: {value: this.shininess},
                    // uSpecularStrength: {value: this.specularStrength},
                    // uDistortionMap: {value: null},
                    // uDistortionStrength: {value: this.distortionStrength},
                    // animation: {value: this.setupWaterAnimation()}
                }
            ]),
            vertexShader: groundVertexShaderUrl,
            fragmentShader: groundFragmentShaderUrl
        });
        if(this.slopeId != null) {
            this.material.uniforms.uGroundTexture.value = this.setupTextureSimple(underWaterUrl);
        } else {
            this.material.uniforms.uGroundTexture.value = this.setupTextureSimple(grassTextureUrl);
        }
        // this.material.uniforms.uCoast.value = coast;
        // this.material.uniforms.uCoastBumpMap.value = coastBumpMap;
        // this.material.uniforms.uSeabedTexture.value = this.seabed.setupTexture();
        // this.material.uniforms.uDistortionMap.value = distortionMap;
        this.material.lights = true;
        // this.material.metalness = 0;
        // this.material.roughness = 0.5;
        this.material.extensions.derivatives = true;

        this.gui.add(this.material, "wireframe", 0, 1);

        let mesh = new THREE.Mesh(geometry, this.material);
        // mesh.receiveShadow = true;
        scene.add(mesh);
    }

}

export {
    Ground
}
