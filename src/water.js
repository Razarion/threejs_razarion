import * as THREE from "three";
import waterSurfaceTextureUrl from "./textures/WaterCloudReflection.png";
import distortionMapUrl from "./textures/WaterDistortion.png";
import bumpMapUrl from "./textures/WaterBumpMap.png";
import {Base} from "./base";
import waterVertexShaderUrl from './shaders/Water.vert';
import waterFragmentShaderUrl from './shaders/Water.frag';

class Water extends Base {
    constructor(x, y, width, height, datGui) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.shininess = 30;
        this.specularStrength = 1;
        this.reflectionScale = 100;
        this.distortionScale = 1000;
        this.distortionStrength = 0.01;
        this.distortionScale = 50;
        this.bumpMapDepth = 0.2;
        this.transparency = 0.5;
        this.animationDuration = 80;

        this.gui = datGui.addFolder('Water');
        this.gui.add(this, 'shininess');
        this.gui.add(this, 'specularStrength');
        this.gui.add(this, 'reflectionScale');
        this.gui.add(this, 'distortionStrength');
        this.gui.add(this, 'distortionScale');
        this.gui.add(this, 'bumpMapDepth', 0, 1);
        this.gui.add(this, 'transparency', 0, 1);
        this.gui.add(this, 'animationDuration');
    }

    generateMesh(scene) {
        let geometry = new THREE.BufferGeometry();
        let vertices = new Float32Array([
            0, 0, 0,
            1000, 0, 0,
            1000, 1000, 0,

            1000, 1000, 0,
            0, 1000, 0,
            0, 0, 0
        ]);
        geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
        let transparencies = new Float32Array([
            1,
            1,
            1,

            1,
            1,
            1,

            1,
            1,
            1,

            1,
            1,
            1
        ]);
        geometry.addAttribute('depth', new THREE.BufferAttribute(transparencies, 1));
        let loader = new THREE.TextureLoader();
        let reflection = loader.load(waterSurfaceTextureUrl);
        reflection.wrapS = THREE.RepeatWrapping;
        reflection.wrapT = THREE.RepeatWrapping;
        let distortionMap = loader.load(distortionMapUrl);
        distortionMap.wrapS = THREE.RepeatWrapping;
        distortionMap.wrapT = THREE.RepeatWrapping;
        let bumpMap = loader.load(bumpMapUrl);
        bumpMap.wrapS = THREE.RepeatWrapping;
        bumpMap.wrapT = THREE.RepeatWrapping;
        this.material = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.merge([
                THREE.UniformsLib["lights"],
                {
                    uShininess: {value: this.shininess},
                    uSpecularStrength: {value: this.specularStrength},
                    uReflectionScale: {value: this.reflectionScale},
                    uReflection: {value: null},
                    uDistortionScale: {value: this.distortionScale},
                    uDistortionMap: {value: null},
                    uDistortionStrength: {value: this.distortionStrength},
                    uBumpMap: {value: null},
                    uBumpMapDepth: {value: this.bumpMapDepth},
                    uTransparency: {value: 0.9},
                    animation: {value: this.setupWaterAnimation()}
                }
            ]),
            vertexShader: waterVertexShaderUrl,
            fragmentShader: waterFragmentShaderUrl
        });
        this.material.uniforms.uReflection.value = reflection;
        this.material.uniforms.uDistortionMap.value = distortionMap;
        this.material.uniforms.uBumpMap.value = bumpMap;
        this.material.lights = true;
        this.material.transparent = true;
        this.material.extensions.derivatives = true;
        this.gui.add(this.material, "wireframe", 0, 1);

        scene.add(new THREE.Mesh(geometry, this.material));
    }

    update() {
        this.material.uniforms.uShininess.value = this.shininess;
        this.material.uniforms.uSpecularStrength.value = this.specularStrength;
        this.material.uniforms.uReflectionScale.value = this.reflectionScale;
        this.material.uniforms.uDistortionScale.value = this.distortionScale;
        this.material.uniforms.uDistortionStrength.value = this.distortionStrength;
        this.material.uniforms.uBumpMapDepth.value = this.bumpMapDepth;
        this.material.uniforms.uTransparency.value = this.transparency;
        this.material.uniforms.animation.value = this.setupWaterAnimation();
    }
}

export {
    Water
}