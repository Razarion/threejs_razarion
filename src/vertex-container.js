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

        if (!this.vertexContainer.hasOwnProperty('alphaCutout')) {
            this.vertexContainer.alphaCutout = 0.0;
        }

        this.material = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.merge([
                THREE.UniformsLib["lights"],
                {
                    texture: {value: null},
                    uSpecularStrength: {value: this.vertexContainer.specular.r},
                    uShininess: {value: this.vertexContainer.shininess},
                    uAlphaCutout: {value: this.vertexContainer.alphaCutout}
                }
            ]),
            vertexShader: vertexShaderUrl,
            fragmentShader: fragmentShaderUrl
        });
        this.material.uniforms.texture.value = texture;
        this.material.extensions.derivatives = true;
        this.material.lights = true;

        // GUI
        this.gui.add(this.material.uniforms.uShininess, 'value', 0.0).name('Shininess');
        this.gui.add(this.material.uniforms.uSpecularStrength, 'value', 0.0).name('SpecularStrength');
        this.gui.add(this.material.uniforms.uAlphaCutout, 'value', 0.0, 1.0).name('Alpha Cutout (0:Off)');
        this.gui.add(this.material, 'wireframe', 0.0, 1.0).name('Wireframe');
    }

}

export {
    VertexContainer
}