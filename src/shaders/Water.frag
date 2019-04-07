precision mediump float;

varying vec3 vWorldVertexPosition;

uniform sampler2D uDistortionMap;
uniform float uReflectionScale;
uniform sampler2D uReflection;
uniform float uDistortionScale;
uniform float uDistortionStrength;
uniform float animation;

// +++ Also used in Slop.frag
void setupWater(inout vec3 ambient, inout vec3 specular) {
    // Setup ambient
    vec2 distortion1 = texture2D(uDistortionMap, vWorldVertexPosition.xy / uDistortionScale + vec2(animation, 0.5)).rg * 2.0 - 1.0;
    vec2 distortion2 = texture2D(uDistortionMap, vWorldVertexPosition.xy / uDistortionScale + vec2(-animation, animation)).rg * 2.0 - 1.0;
    vec2 totalDistortion = distortion1 + distortion2;
    vec2 reflectionCoord = (vWorldVertexPosition.xy) / uReflectionScale + totalDistortion * uDistortionStrength;
    ambient = texture2D(uReflection, reflectionCoord).rgb;
}
// +++ Also used in Slop.frag ends

void main(void) {
    vec3 ambient;
    vec3 specular;
    setupWater(ambient, specular);
    gl_FragColor = vec4(ambient + specular, 1.0);
}
