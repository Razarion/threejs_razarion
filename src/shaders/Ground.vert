varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vWorldVertexPosition;

void main(void) {
    #include <beginnormal_vertex>

    vWorldVertexPosition = position.xyz;

    vNormal = normalize(normalMatrix * objectNormal);

    vViewPosition = - (modelViewMatrix * vec4(position, 1.0)).xyz;

    gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0);
}
