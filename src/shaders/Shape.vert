varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main(void) {
    #include <beginnormal_vertex>

    vUv = uv;

    vNormal = normalize(normalMatrix * objectNormal);

    vViewPosition = - (modelViewMatrix * vec4(position, 1.0)).xyz;

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}


