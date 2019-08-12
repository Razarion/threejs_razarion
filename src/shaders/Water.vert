attribute float aOffsetToOuter;

varying vec3 vVertexPosition;
varying vec3 vNormal;
varying vec3 vWorldVertexPosition;
varying vec4 vNdcPosition;
varying vec3 vViewPosition;
varying float vOffsetToOuter;

void main(void) {
    vOffsetToOuter = aOffsetToOuter;

    vVertexPosition = (viewMatrix * vec4(position, 1.0)).xyz;
    vWorldVertexPosition = position.xyz;

    vec3 transformedNormal = normalMatrix * vec3(0.0, 0.0, 1.0);
    vNormal = normalize(transformedNormal);

    vec3 transformed = vec3(position);
    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
    vViewPosition = - mvPosition.xyz;

    vNdcPosition = projectionMatrix * modelMatrix * vec4(vVertexPosition, 1.0);
    gl_Position =  vNdcPosition;
}
