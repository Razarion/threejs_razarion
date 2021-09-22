import * as THREE from "three";
import vertexShaderUrl from "./shaders/Shape.vert";
import fragmentShaderUrl from "./shaders/Shape.frag";
import {Base} from "./base";

class VertexContainer extends Base {
    constructor(vertexContainer, buffers) {
        super();
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

        this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.buffers.vertexData), 3));
        this.geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(this.buffers.normData), 3));
        this.geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(this.buffers.textureCoordinate), 2));
        this.geometry.applyMatrix4(m);
        // this.geometry.applyMatrix4(new THREE.Matrix4().makeScale(5, 5, 5));

        let texture = this.setupTextureSimple(this.imageTable(this.vertexContainer.textureId));
        let bumpMap = this.setupTextureSimple(this.imageTable(this.vertexContainer.bumpMapId));

        this.material = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.merge([
                THREE.UniformsLib["lights"],
                {
                    uTexture: {value: null},
                    uBumpMap: {value: null},
                    uBumpMapDepth: {value: this.vertexContainer.bumpMapDepth},
                    uSpecularStrength: {value: this.vertexContainer.specular.r},
                    uShininess: {value: this.vertexContainer.shininess},
                    uAlphaCutout: {value: this.vertexContainer.alphaCutout}
                }
            ]),
            vertexShader: vertexShaderUrl,
            fragmentShader: fragmentShaderUrl
        });
        this.material.uniforms.uTexture.value = texture;
        this.material.uniforms.uBumpMap.value = bumpMap;
        this.material.extensions.derivatives = true;
        this.material.lights = true;
        this.material.postProcessing = this.vertexContainer.postProcessing;
    }

    update() {
        this.material.wireframe = this.vertexContainer.wireframe;
        this.material.uniforms.uSpecularStrength.value = this.vertexContainer.specular.r;
        this.material.uniforms.uShininess.value = this.vertexContainer.shininess;
        this.material.uniforms.uAlphaCutout.value = this.vertexContainer.alphaCutout;
        this.material.uniforms.uBumpMapDepth.value = this.vertexContainer.bumpMapDepth;
    }
}

export {
    VertexContainer
}