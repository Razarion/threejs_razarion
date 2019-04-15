attribute float transparency;

varying vec3 vVertexPosition;
varying vec3 vWorldVertexPosition;
varying float vTransparency;

void main(void) {
    vVertexPosition = (viewMatrix * vec4(position, 1.0)).xyz;
    vWorldVertexPosition = position.xyz;

    vTransparency = transparency;
    gl_Position = projectionMatrix * modelMatrix * vec4(vVertexPosition, 1.0);
}
