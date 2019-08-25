varying vec3 vWorldVertexPosition;

void main(void) {
    vWorldVertexPosition = position.xyz;
    gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0);
}
