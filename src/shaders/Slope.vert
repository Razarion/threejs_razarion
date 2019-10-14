attribute float aSlopeFactor;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vWorldVertexPosition;
varying float vSlopeFactor;

void main(void) {
    #include <beginnormal_vertex>

    vWorldVertexPosition = position.xyz;

    vUv = uv;

    vSlopeFactor = aSlopeFactor;

    vNormal = normalize(normalMatrix * objectNormal);

    vViewPosition = - (modelViewMatrix * vec4(position, 1.0)).xyz;

    gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0);
}


