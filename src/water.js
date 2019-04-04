import * as THREE from "three";
import {Color} from "three";
import waterSurfaceTextureUrl from "./textures/WaterCloudReflection.png";
import {Base} from "./base";
import waterVertexShader from './shaders/Water.vert';
import waterFragmentShader from './shaders/Water.frag';

class Water extends Base {
    constructor(x, y, width, height) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    generateMesh(scene) {
        let geometry = this.setupGeometry(this.x, this.y, this.width, this.height);
        let loader = new THREE.TextureLoader();
        loader.load(
            waterSurfaceTextureUrl,
            function (texture) {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                let material = new THREE.ShaderMaterial({
                    uniforms: {
                        uReflectionScale: {value: 100},
                        uReflection: {value: texture},
                    },
                    vertexShader: waterVertexShader,
                    fragmentShader: waterFragmentShader
                });
                scene.add(new THREE.Mesh(geometry, material));
            },
            undefined, // onProgress callback currently not supported
            function (err) {
                console.log('Water: An error happened:' + err);
            }
        );
        super.generateWireframe(scene, geometry, new Color(0.0, 0.0, 1.0));
    }
}

export {
    Water
}