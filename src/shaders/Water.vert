attribute vec2 aUv;

varying vec3 vNormal;
varying vec3 vWorldVertexPosition;
varying vec3 vViewPosition;
varying vec2 vUv;

void main(void) {
    vUv = aUv;

    vWorldVertexPosition = position.xyz;

    vNormal = normalize(normalMatrix * vec3(0.0, 0.0, 1.0));

    vec4 mvPosition = viewMatrix * vec4(position, 1.0);
    vViewPosition = - mvPosition.xyz;

    gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0);
}
