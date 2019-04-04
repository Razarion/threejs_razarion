precision mediump float;

varying vec3 vWorldVertexPosition;

uniform float uReflectionScale;
uniform sampler2D uReflection;

void main() {
    gl_FragColor = texture2D(uReflection, vWorldVertexPosition.xy / uReflectionScale);
}
