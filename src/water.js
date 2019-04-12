import * as THREE from "three";
import {Color} from "three";
import waterSurfaceTextureUrl from "./textures/WaterCloudReflection.png";
import distortionMapUrl from "./textures/WaterDistortion.png";
import normMapUrl from "./textures/WaterNorm.png";
import {Base} from "./base";
import waterVertexShader from './shaders/Water.vert';
import waterFragmentShader from './shaders/Water.frag';
import {sawtooth} from "./utils";

class Water extends Base {
    constructor(x, y, width, height, datGui) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.lightSpecularIntensity = 1;
        this.lightSpecularHardness = 40;
        this.reflectionScale = 90;
        this.distortionScale = 1000;
        this.distortionStrength = 0.1;
        this.distortionScale = 20;
        this.normMapDepth = 0;
        this.animationDuration = 20;

        this.gui = datGui.addFolder('Water');
        this.gui.add(this, 'lightSpecularIntensity', 0, 1);
        this.gui.add(this, 'lightSpecularHardness');
        this.gui.add(this, 'reflectionScale');
        this.gui.add(this, 'distortionStrength');
        this.gui.add(this, 'distortionScale');
        this.gui.add(this, 'normMapDepth', 0.0, 10);
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
                    animation: {value: this.setupWaterAnimation()}
                }
            ]),
            vertexShader: waterVertexShader,
            fragmentShader: waterFragmentShader
        });
        this.material.uniforms.uReflection.value = reflection;
        this.material.uniforms.uDistortionMap.value = distortionMap;
        this.material.uniforms.uNormMap.value = normMap;
        this.material.lights = true;
        this.gui.add(this.material, "wireframe", 0, 1);

        scene.add(new THREE.Mesh(geometry, this.material));
        super.generateWireframe(scene, geometry, new Color(0.0, 0.0, 1.0));
    }

    update() {
        this.material.uniforms.uLightSpecularIntensity.value = this.lightSpecularIntensity;
        this.material.uniforms.uLightSpecularHardness.value = this.lightSpecularHardness;
        this.material.uniforms.uReflectionScale.value = this.reflectionScale;
        this.material.uniforms.uDistortionScale.value = this.distortionScale;
        this.material.uniforms.uDistortionStrength.value = this.distortionStrength;
        this.material.uniforms.uNormMapDepth.value = this.normMapDepth;
        this.material.uniforms.animation.value = this.setupWaterAnimation();
    }

    setupWaterAnimation() {
        return sawtooth(Date.now(), this.animationDuration * 1000, 0);
    }
}

export {
    Water
}