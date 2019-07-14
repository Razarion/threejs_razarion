attribute float depth;

varying vec3 vVertexPosition;
varying vec3 vNormal;
varying vec3 vWorldVertexPosition;
varying vec4 vNdcPosition;
varying float vDepth;
varying vec3 vViewPosition;

void main(void) {
    vVertexPosition = (viewMatrix * vec4(position, 1.0)).xyz;
    vWorldVertexPosition = position.xyz;

    vec3 transformedNormal = normalMatrix * vec3(0.0, 0.0, 1.0);
    vNormal = normalize(transformedNormal);

    vec3 transformed = vec3(position);
    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
    vViewPosition = - mvPosition.xyz;

    vDepth = depth;
    vNdcPosition = projectionMatrix * modelMatrix * vec4(vVertexPosition, 1.0);
    gl_Position =  vNdcPosition;
}
