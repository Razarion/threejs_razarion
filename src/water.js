import * as THREE from "three";
import waterSurfaceTextureUrl from "./textures/WaterCloudReflection.png";
import distortionMapUrl from "./textures/WaterDistortion.png";
import normMapUrl from "./textures/WaterNorm.png";
import {Base} from "./base";
import waterVertexShaderUrl from './shaders/Water.vert';
import waterFragmentShaderUrl from './shaders/Water.frag';
import {sawtooth} from "./utils";

class Water extends Base {
    constructor(x, y, width, height, datGui) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.lightSpecularIntensity = 0.7;
        this.lightSpecularHardness = 100;
        this.reflectionScale = 90;
        this.distortionScale = 1000;
        this.distortionStrength = 0.1;
        this.distortionScale = 20;
        this.normMapDepth = 1;
        this.transparency = 0.5;
        this.animationDuration = 20;

        this.gui = datGui.addFolder('Water');
        this.gui.add(this, 'lightSpecularIntensity', 0, 1);
        this.gui.add(this, 'lightSpecularHardness');
        this.gui.add(this, 'reflectionScale');
        this.gui.add(this, 'distortionStrength');
        this.gui.add(this, 'distortionScale');
        this.gui.add(this, 'normMapDepth', 0, 1);
        this.gui.add(this, 'transparency', 0, 1);
        this.gui.add(this, 'animationDuration');
    }

    generateMesh(scene) {
        let geometry = this.setupGeometry(this.x, this.y, this.width, this.height);
        let loader = new THREE.TextureLoader();
        let reflection = loader.load(waterSurfaceTextureUrl);
        reflection.wrapS = THREE.RepeatWrapping;
        reflection.wrapT = THREE.RepeatWrapping;
        let distortionMap = loader.load(distortionMapUrl);
        distortionMap.wrapS = THREE.RepeatWrapping;
        distortionMap.wrapT = THREE.RepeatWrapping;
        let normMap = loader.load(normMapUrl);
        normMap.wrapS = THREE.RepeatWrapping;
        normMap.wrapT = THREE.RepeatWrapping;
        this.material = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.merge([
                THREE.UniformsLib["lights"],
                {
                    uLightSpecularIntensity: {value: this.lightSpecularIntensity},
                    uLightSpecularHardness: {value: this.lightSpecularHardness},
                    uReflectionScale: {value: this.reflectionScale},
                    uReflection: {value: null},
                    uDistortionScale: {value: this.distortionScale},
                    uDistortionMap: {value: null},
                    uDistortionStrength: {value: this.distortionStrength},
                    uNormMap: {value: null},
                    uNormMapDepth: {value: this.normMapDepth},
                    uTransparency: {value: 0.9},
                    animation: {value: this.setupWaterAnimation()}
                }
            ]),
            vertexShader: waterVertexShaderUrl,
            fragmentShader: waterFragmentShaderUrl
        });
        this.material.uniforms.uReflection.value = reflection;
        this.material.uniforms.uDistortionMap.value = distortionMap;
        this.material.uniforms.uNormMap.value = normMap;
        this.material.lights = true;
        this.material.transparent = true;
        this.gui.add(this.material, "wireframe", 0, 1);

        scene.add(new THREE.Mesh(geometry, this.material));
    }

    update() {
        this.material.uniforms.uLightSpecularIntensity.value = this.lightSpecularIntensity;
        this.material.uniforms.uLightSpecularHardness.value = this.lightSpecularHardness;
        this.material.uniforms.uReflectionScale.value = this.reflectionScale;
        this.material.uniforms.uDistortionScale.value = this.distortionScale;
        this.material.uniforms.uDistortionStrength.value = this.distortionStrength;
        this.material.uniforms.uNormMapDepth.value = this.normMapDepth;
        this.material.uniforms.uTransparency.value = this.transparency;
        this.material.uniforms.animation.value = this.setupWaterAnimation();
    }

    setupWaterAnimation() {
        return sawtooth(Date.now(), this.animationDuration * 1000, 0);
    }
}

export {
    Water
}