import {Base} from "./base";
import * as THREE from "three";
import waterUrl from "./textures/Foam.png";
import coastUrl from "./textures/Coast.png";
import coastBumpMapUrl from "./textures/CoastBumpMap.png";
import slopeVertexShaderUrl from "./shaders/Slope.vert";
import slopeFragmentShaderUrl from "./shaders/Slope.frag";
import distortionMapUrl from "./textures/FoamDistortion.png";
import ocean1Url from "./models/terrain/ocean1.json";

class Slope extends Base {
    constructor(datGui, seabed) {
        super();
        this.coastScale = 21 ;
        this.coastBumpMapDepth = 0.5;
        this.shininess = 3;
        this.specularStrength = 0.5;
        this.distortionStrength = 1;
        this.animationDuration = 10;
        this.gui = datGui.addFolder('Slope');
        this.gui.add(this, 'coastScale', 0);
        this.gui.add(this, 'coastBumpMapDepth', 0.0, 1.0);
        this.gui.add(this, 'shininess');
        this.gui.add(this, 'specularStrength');
        this.gui.add(this, 'distortionStrength');
        this.gui.add(this, 'animationDuration');
        this.seabed = seabed;
    }

    generateMesh(scene) {
        let geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(ocean1Url.positions), 3));
        geometry.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(ocean1Url.norms), 3));
        geometry.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(ocean1Url.uvs), 2));

        let water = this.setupTextureSimple(waterUrl);
        let coast = this.setupTextureSimple(coastUrl);
        let coastBumpMap = this.setupTextureSimple(coastBumpMapUrl);
        let distortionMap = this.setupTextureSimple(distortionMapUrl);

        this.material = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.merge([
                THREE.UniformsLib["lights"],
                {
                    uWater: {value: null},
                    uCoast: {value: null},
                    uCoastScale: {value: this.coastScale},
                    uSeabedTexture: {value: null},
                    uSeabedTextureScale: {value: this.seabed.getTextureScale()},
                    uCoastBumpMap: {value: null},
                    uCoastBumpMapDepth: {value: this.coastBumpMapDepth},
                    uShininess: {value: this.shininess},
                    uSpecularStrength: {value: this.specularStrength},
                    uDistortionMap: {value: null},
                    uDistortionStrength: {value: this.distortionStrength},
                    animation: {value: this.setupWaterAnimation()}
                }
            ]),
            vertexShader: slopeVertexShaderUrl,
            fragmentShader: slopeFragmentShaderUrl
        });

        this.material.uniforms.uWater.value = water;
        this.material.uniforms.uCoast.value = coast;
        this.material.uniforms.uCoastBumpMap.value = coastBumpMap;
        this.material.uniforms.uSeabedTexture.value = this.seabed.setupTexture();
        this.material.uniforms.uDistortionMap.value = distortionMap;
        this.material.lights = true;
        this.material.metalness = 0;
        this.material.roughness = 0.5;
        this.material.extensions.derivatives = true;

        this.gui.add(this.material, "wireframe", 0, 1);

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
        this.material.uniforms.uSeabedTextureScale.value = this.seabed.getTextureScale();
        this.material.uniforms.animation.value = this.setupWaterAnimation();
    }
}

export {
    Slope
}