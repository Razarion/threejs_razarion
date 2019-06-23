varying vec3 vVertexPosition;
varying vec3 vWorldVertexPosition;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main(void) {
    #include <beginnormal_vertex>

    vVertexPosition = (viewMatrix * vec4(position, 1.0)).xyz;
    vWorldVertexPosition = position.xyz;

    vec3 transformedNormal = normalMatrix * objectNormal;
    vNormal = normalize(transformedNormal);

    vec3 transformed = vec3(position);
    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
    vViewPosition = - mvPosition.xyz;

    gl_Position = projectionMatrix * modelMatrix * vec4(vVertexPosition, 1.0);
}


