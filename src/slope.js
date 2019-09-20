import {Base} from "./base";
import * as THREE from "three";
import waterUrl from "./textures/Foam.png";
import coastUrl from "./textures/Coast.png";
import coastBumpMapUrl from "./textures/CoastBumpMap.png";
import slopeVertexShaderUrl from "./shaders/Slope.vert";
import slopeFragmentShaderUrl from "./shaders/Slope.frag";
import distortionMapUrl from "./textures/FoamDistortion.png";
import underWaterUrl from "./textures/UnderWater.png";

class Slope extends Base {
    constructor(datGui, terrainSlopeTile, slopeSkeletonConfig) {
        super();
        this.terrainSlopeTile = terrainSlopeTile;
        this.slopeSkeletonConfig = slopeSkeletonConfig;
        this.coastScale = 21;
        this.coastBumpMapDepth = 0.5;
        this.shininess = 3;
        this.specularStrength = 0.5;
        this.distortionStrength = 1;
        this.animationDuration = 10;
        this.gui = datGui.addFolder('Slope (' + terrainSlopeTile.slopeSkeletonConfigId + ')');
        this.gui.add(this, 'coastScale', 0);
        this.gui.add(this, 'coastBumpMapDepth', 0.0, 1.0);
        this.gui.add(this, 'shininess');
        this.gui.add(this, 'specularStrength');
        this.gui.add(this, 'distortionStrength');
        this.gui.add(this, 'animationDuration');
    }

    generateMesh(scene) {
        let geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(this.terrainSlopeTile.vertices), 3));
        geometry.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(this.terrainSlopeTile.norms), 3));
        geometry.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(this.terrainSlopeTile.uvs), 2));

        let water = this.setupTextureSimple(waterUrl);
        let coast = this.setupTextureSimple(coastUrl);
        let coastBumpMap = this.setupTextureSimple(coastBumpMapUrl);
        let distortionMap = this.setupTextureSimple(distortionMapUrl);
        let underWater = this.setupTextureSimple(underWaterUrl);

        this.material = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.merge([
                THREE.UniformsLib["lights"],
                {
                    uWater: {value: null},
                    uCoast: {value: null},
                    uCoastScale: {value: this.coastScale},
                    uGroundTexture: {value: this.coastScale},
                    uGroundTextureScale: {value: 3000}, // TODO
                    uCoastBumpMap: {value: null},
                    uCoastBumpMapDepth: {value: this.coastBumpMapDepth},
                    uShininess: {value: this.shininess},
                    uSpecularStrength: {value: this.specularStrength},
                    uDistortionMap: {value: null},
                    uDistortionStrength: {value: this.distortionStrength},
                    animation: {value: this.setupWaterAnimation(this.animationDuration)}
                }
            ]),
            vertexShader: slopeVertexShaderUrl,
            fragmentShader: slopeFragmentShaderUrl
        });

        this.material.uniforms.uWater.value = water;
        this.material.uniforms.uCoast.value = coast;
        this.material.uniforms.uCoastBumpMap.value = coastBumpMap;
        this.material.uniforms.uGroundTexture.value = underWater;
        this.material.uniforms.uDistortionMap.value = distortionMap;
        this.material.lights = true;
        this.material.metalness = 0;
        this.material.roughness = 0.5;
        this.material.extensions.derivatives = true;

        let mesh = new THREE.Mesh(geometry, this.material);
        mesh.receiveShadow = true;
        scene.add(mesh);
    }

    update() {

        this.material.uniforms.uCoastScale.value = this.coastScale;
        this.material.uniforms.uCoastBumpMapDepth.value = this.coastBumpMapDepth;
        this.material.uniforms.uShininess.value = this.shininess;
        this.material.uniforms.uSpecularStrength.value = this.specularStrength;
        this.material.uniforms.uDistortionStrength.value = this.distortionStrength;
        this.material.uniforms.uGroundTextureScale.value = 3000; // TODO
        this.material.uniforms.animation.value = this.setupWaterAnimation(this.animationDuration);
        this.material.wireframe = this.slopeSkeletonConfig.wireframeSlope;
   }
}

export {
    Slope
}