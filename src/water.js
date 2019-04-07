import * as THREE from "three";
import {Color} from "three";
import waterSurfaceTextureUrl from "./textures/WaterCloudReflection.png";
import distortionMapUrl from "./textures/WaterDistortion.png";
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
        this.animationDuration = 20;

        let gui = datGui.addFolder('Water');
        gui.add(this, 'animationDuration');

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
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                uReflectionScale: {value: 100},
                uReflection: {value: reflection},
                uDistortionScale: {value: 100},
                uDistortionMap: {value: distortionMap},
                uDistortionStrength: {value: 1},
                animation: {value: this.setupWaterAnimation()}
            },
            vertexShader: waterVertexShader,
            fragmentShader: waterFragmentShader
        });
        scene.add(new THREE.Mesh(geometry, this.material));
        super.generateWireframe(scene, geometry, new Color(0.0, 0.0, 1.0));
    }

    updateAnimation() {
        this.material.uniforms.animation.value = this.setupWaterAnimation();
    }

    setupWaterAnimation() {
        return sawtooth(Date.now(), this.animationDuration * 1000, 0);
    }
}

export {
    Water
}