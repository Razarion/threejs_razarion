#include <common>
#include <lights_pars_begin>

varying vec3 vVertexPosition;
varying vec3 vWorldVertexPosition;
varying float vTransparency;
varying vec4 vNdcPosition;

// Light
uniform float uLightSpecularIntensity;
uniform float uLightSpecularHardness;

uniform mat3 normalMatrix;
uniform float uTransparency;
uniform sampler2D uNormMap;
uniform float uNormMapDepth;
uniform sampler2D uDistortionMap;
uniform float uReflectionScale;
uniform sampler2D uReflection;
uniform float uDistortionScale;
uniform float uDistortionStrength;
uniform sampler2D uRgbDepthTexture;
uniform float animation;

const vec3 SPECULAR_LIGHT_COLOR = vec3(1.0, 1.0, 1.0);

vec3 vec3ToRgb(vec3 normVec) {
    return normVec * 0.5 + 0.5;
}

vec3 setupSpecularLight(vec3 correctedLightDirection, vec3 correctedNorm, float intensity, float hardness) {
    vec3 reflectionDirection = normalize(reflect(correctedLightDirection, normalize(correctedNorm)));
    vec3 eyeDirection = normalize(-vVertexPosition.xyz);
    float factor = pow(max(dot(reflectionDirection, eyeDirection), 0.0), hardness) * intensity;
    return SPECULAR_LIGHT_COLOR * factor;
}


// +++ Also used in Slop.frag
void setupWater(inout vec3 ambient, inout vec3 specular) {
    // Setup ambient
    vec2 distortion1 = texture2D(uDistortionMap, vWorldVertexPosition.xy / uDistortionScale + vec2(animation, 0.5)).rg * 2.0 - 1.0;
    vec2 distortion2 = texture2D(uDistortionMap, vWorldVertexPosition.xy / uDistortionScale + vec2(-animation, animation)).rg * 2.0 - 1.0;
    vec2 totalDistortion = distortion1 + distortion2;
    vec2 reflectionCoord = (vWorldVertexPosition.xy) / uReflectionScale + totalDistortion * uDistortionStrength;
    ambient = texture2D(uReflection, reflectionCoord).rgb/* * ambientLightColor*/;
    // Setup norm map and light
    vec3 correctedLightDirection = normalize(directionalLights[0].direction);
    vec3 normMap1 = texture2D(uNormMap, vWorldVertexPosition.xy / uDistortionScale + vec2(animation, 0.5)).xyz;
    vec3 normMap2 = texture2D(uNormMap, vWorldVertexPosition.xy / uDistortionScale + vec2(-animation, animation)).xyz;
    vec3 normMap = (normMap1 + normMap2) / 2.0;
    normMap = vec3(normMap.x * 2.0 - 1.0, normMap.y * 2.0 - 1.0, normMap.z * 2.0 - 1.0);
    normMap = mix(vec3(0.0, 0.0, 1.0), normMap, uNormMapDepth);
    vec3 correctedNorm = normalize(normalMatrix * normMap);
    specular = setupSpecularLight(correctedLightDirection, correctedNorm, uLightSpecularIntensity, uLightSpecularHardness);
}
// +++ Also used in Slop.frag ends

void main(void) {
    vec3 ambient;
    vec3 specular;
    setupWater(ambient, specular);

    vec3 ndcPosition = vNdcPosition.xyz / vNdcPosition.w;
    vec2 texCoordinate = ndcPosition.xy * 0.5 + 0.5;
    float depthTestureZ = texture2D(uRgbDepthTexture, texCoordinate).r;
    float actualZ = ndcPosition.z * 0.5 + 0.5;

    float near = 70.0;
    float far = 250.0;
    float xxx = 2.0 * near * far / (far + near - (2.0 * depthTestureZ - 1.0) * (far - near));


    gl_FragColor = vec4(ambient + specular, (depthTestureZ - actualZ)  * 100.0);
    gl_FragColor = vec4(xxx, 0.0, 0.0, 1.0);
}
