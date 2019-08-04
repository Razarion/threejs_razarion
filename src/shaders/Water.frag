#include <common>
#include <lights_pars_begin>

varying vec3 vVertexPosition;
varying vec3 vWorldVertexPosition;
varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec4 vNdcPosition;

// Light
uniform float uShininess;
uniform float uSpecularStrength;

uniform float uTransparency;
uniform sampler2D uBumpMap;
uniform float uBumpMapDepth;
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

vec2 dHdxy_fwd(vec2 vUv) {
    vec2 dSTdx = dFdx(vUv);
    vec2 dSTdy = dFdy(vUv);
    float Hll = uBumpMapDepth * texture2D(uBumpMap, vUv).x;
    float dBx = uBumpMapDepth * texture2D(uBumpMap, vUv + dSTdx).x - Hll;
    float dBy = uBumpMapDepth * texture2D(uBumpMap, vUv + dSTdy).x - Hll;
    return vec2(dBx, dBy);
}

vec2 dHdxy_fwd_animation() {
    vec2 dHdxy1 = dHdxy_fwd(vWorldVertexPosition.xy / uDistortionScale + vec2(animation, 0.5));
    vec2 dHdxy2 = dHdxy_fwd(vWorldVertexPosition.xy / uDistortionScale + vec2(-animation, animation));
    return (dHdxy1 + dHdxy2) / 2.0;
}

vec3 perturbNormalArb(vec3 surf_pos, vec3 surf_norm, vec2 dHdxy) {
    vec3 vSigmaX = vec3(dFdx(surf_pos.x), dFdx(surf_pos.y), dFdx(surf_pos.z));
    vec3 vSigmaY = vec3(dFdy(surf_pos.x), dFdy(surf_pos.y), dFdy(surf_pos.z));
    vec3 vN = surf_norm;
    vec3 R1 = cross(vSigmaY, vN);
    vec3 R2 = cross(vN, vSigmaX);
    float fDet = dot(vSigmaX, R1);
    fDet *= (float(gl_FrontFacing) * 2.0 - 1.0);
    vec3 vGrad = sign(fDet) * (dHdxy.x * R1 + dHdxy.y * R2);
    return normalize(abs(fDet) * surf_norm - vGrad);
}

void main(void) {
    // Reflection diffuse
    vec2 distortion1 = texture2D(uDistortionMap, vWorldVertexPosition.xy / uDistortionScale + vec2(animation, 0.5)).rg * 2.0 - 1.0;
    vec2 distortion2 = texture2D(uDistortionMap, vWorldVertexPosition.xy / uDistortionScale + vec2(-animation, animation)).rg * 2.0 - 1.0;
    vec2 totalDistortion = distortion1 + distortion2;
    vec2 reflectionCoord = (vWorldVertexPosition.xy) / uReflectionScale + totalDistortion * uDistortionStrength;
    vec3 reflection = texture2D(uReflection, reflectionCoord).rgb;

    vec3 normal = perturbNormalArb(-vViewPosition, vNormal, dHdxy_fwd_animation());
    vec3 directLightColor = directionalLights[0].color;
    vec3 directLightDirection = directionalLights[0].direction;
    // Diffuse
    vec3 slopeDiffuse = max(dot(normal, directLightDirection), 0.0) * directLightColor;
    // Specular
    vec3 viewDir = normalize(vViewPosition);
    vec3 halfwayDir = normalize(directLightDirection + viewDir);
    float spec = pow(max(dot(normal, halfwayDir), 0.0), uShininess);
    vec3 slopeSpecular = uSpecularStrength * spec * directLightColor;

    vec3 waterSurface = (ambientLightColor + slopeSpecular + vec3(0.5, 0.5, 0.5)) * reflection.rgb;

    float z = vWorldVertexPosition.x * (-0.0375) + 0.9;
    float transitionTransparency;
    if(z > 0.0) {
        transitionTransparency = 0.0;
    } else if (z < -1.0){
        transitionTransparency = 1.0;
    } else {
        transitionTransparency = -z;
    }

    gl_FragColor = vec4(waterSurface, uTransparency);
}
