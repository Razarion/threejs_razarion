varying vec3 vVertexPosition;
varying vec3 vWorldVertexPosition;
varying vec3 vNormal;

void main(void) {
    #include <beginnormal_vertex>

    vVertexPosition = (viewMatrix * vec4(position, 1.0)).xyz;
    vWorldVertexPosition = position.xyz;

    vec3 transformedNormal = normalMatrix * objectNormal;
    vNormal = normalize( transformedNormal );

    gl_Position = projectionMatrix * modelMatrix * vec4(vVertexPosition, 1.0);
}

