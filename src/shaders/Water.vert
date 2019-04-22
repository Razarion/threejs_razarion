attribute float depth;

varying vec3 vVertexPosition;
varying vec3 vWorldVertexPosition;
varying vec4 vNdcPosition;
varying float vDepth;

void main(void) {
    vVertexPosition = (viewMatrix * vec4(position, 1.0)).xyz;
    vWorldVertexPosition = position.xyz;

    vDepth = depth;
    vNdcPosition = projectionMatrix * modelMatrix * vec4(vVertexPosition, 1.0);
    gl_Position =  vNdcPosition;
}
