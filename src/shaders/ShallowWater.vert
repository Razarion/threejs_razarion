attribute vec2 aUv;

varying vec3 vWorldVertexPosition;
varying vec3 vViewPosition;
varying vec2 vUv;

void main(void) {
    vUv = aUv;

    vWorldVertexPosition = position.xyz;

    vec3 transformed = vec3(position);
    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
    vViewPosition = - mvPosition.xyz;

    gl_Position = projectionMatrix * modelMatrix * vec4((viewMatrix * vec4(position, 1.0)).xyz, 1.0);
}
