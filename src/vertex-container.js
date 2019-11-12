import * as THREE from "three";
import vertexShaderUrl from "./shaders/Shape.vert";
import fragmentShaderUrl from "./shaders/Shape.frag";
import {Base} from "./base";

class VertexContainer extends Base {
    constructor(vertexContainer, buffers, datGui) {
        super();
        this.gui = datGui.addFolder(vertexContainer.materialName + " (" + vertexContainer.materialId + ")");
        this.vertexContainer = vertexContainer;
        this.buffers = buffers;
        this.prepare();
    }

    prepare() {
        this.geometry = new THREE.BufferGeometry();

        let staticMatrix = this.vertexContainer.shapeTransform.staticMatrix.numbers;
        let m = new THREE.Matrix4();
        m.set(staticMatrix[0][0], staticMatrix[0][1], staticMatrix[0][2], staticMatrix[0][3],
            staticMatrix[1][0], staticMatrix[1][1], staticMatrix[1][2], staticMatrix[1][3],
            staticMatrix[2][0], staticMatrix[2][1], staticMatrix[2][2], staticMatrix[2][3],
            staticMatrix[3][0], staticMatrix[3][1], staticMatrix[3][2], staticMatrix[3][3]);

        this.geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(this.buffers.vertexData), 3));
        this.geometry.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(this.buffers.normData), 3));
        this.geometry.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(this.buffers.textureCoordinate), 2));
        this.geometry.applyMatrix(m);
        // this.geometry.applyMatrix(new THREE.Matrix4().makeScale(5, 5, 5));

        let texture = this.setupTextureSimple(this.imageTable(this.vertexContainer.textureId));


        this.material = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.merge([
                THREE.UniformsLib["lights"],
                {
                    texture: {value: null},
                    uShininess: {value: 3},
                    uSpecularStrength: {value: 0.5},
                    alphaTest: {value: 0.37} // DatGui sees ist as integer of not a decimal number
                }
            ]),
            vertexShader: vertexShaderUrl,
            fragmentShader: fragmentShaderUrl
        });
        this.material.uniforms.texture.value = texture;
        this.material.lights = true;

        // GUI
        this.gui.add(this.material.uniforms.uShininess, 'value', 0.0).name('Shininess');
        this.gui.add(this.material.uniforms.uSpecularStrength, 'value', 0.0).name('SpecularStrength');
        this.gui.add(this.material.uniforms.alphaTest, 'value', 0.0, 1.0).name('Alpha Test (0:Off)');
    }

}

export {
    VertexContainer
}