import {Base} from "./base";
import * as THREE from "three";
import waterVertexShaderUrl from './shaders/Slope.vert';
import waterFragmentShaderUrl from './shaders/Slope.frag';

class Slope extends Base {
    constructor(x, y, yLength, terrainShape, datGui) {
        super();
        this.x = x;
        this.y = y;
        this.yLength = yLength;
        this.terrainShape = terrainShape;
        this.gui = datGui.addFolder('Slope');
        // gui.add(this, 'animationDuration');
    }

    generateMesh(scene) {
        let xSegments = this.terrainShape.length - 1;
        let ySegments = Math.floor(this.yLength / Base.EDGE_LENGTH);
        let xLength = xSegments * Base.EDGE_LENGTH;
        this.yLength = ySegments * Base.EDGE_LENGTH;
        let geometry = new THREE.PlaneBufferGeometry(xLength, this.yLength, xSegments, ySegments);
        geometry.translate(this.x + xLength / 2, this.y + this.yLength / 2, 0);
        let index = 0;
        for (let y = 0; y <= ySegments; y++) {
            for (let x = 0; x <= xSegments; x++) {
                geometry.attributes.position.array[index * 3 + 2] = this.terrainShape[x];
                index++;
            }
        }
        this.material = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.merge([
                THREE.UniformsLib["lights"],
                {
                    uWaterLevel: {value: 0},
                    uWaterGround: {value: -2},
                }
            ]),
            vertexShader: waterVertexShaderUrl,
            fragmentShader: waterFragmentShaderUrl
        });
        this.material.lights = true;
        this.gui.add(this.material, "wireframe", 0, 1);

        scene.add(new THREE.Mesh(geometry, this.material));
    }

}

export {
    Slope
}