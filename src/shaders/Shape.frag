#include <common>
#include <lights_pars_begin>

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

uniform sampler2D uTexture;
uniform float uShininess;
uniform float uSpecularStrength;
uniform sampler2D uBumpMap;
uniform float uBumpMapDepth;
uniform float uAlphaCutout;

const float SPECULAR_FACTOR = 3.0;

vec3 vec3ToReg(vec3 normVec) {
    return normVec * 0.5 + 0.5;
}

vec2 dHdxy_fwd() {
    vec2 dSTdx = dFdx(vUv);
    vec2 dSTdy = dFdy(vUv);
    float Hll = uBumpMapDepth * texture2D(uBumpMap, vUv).r;
    float dBx = uBumpMapDepth * texture2D(uBumpMap, vUv + dSTdx).r - Hll;
    float dBy = uBumpMapDepth * texture2D(uBumpMap, vUv + dSTdy).r - Hll;
    return vec2(dBx, dBy);
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
    vec3 normal = perturbNormalArb(-vViewPosition, normalize(vNormal), dHdxy_fwd());
    vec3 viewDir = normalize(vViewPosition);
    vec3 directLightColor = directionalLights[0].color;
    vec3 directLightDirection = directionalLights[0].direction;

    // Phong Shading + Alpha to coverage
    vec4 shapeTexture = texture2D(uTexture, vUv);
    vec3 shapeDiffuse = max(dot(normal, directLightDirection), 0.0) * directLightColor;
    vec3 halfwayDir = normalize(directLightDirection + viewDir);
    float spec = pow(max(dot(normal, halfwayDir), 0.0), uShininess);
    vec3 shapeSpecular = uSpecularStrength * SPECULAR_FACTOR * spec * directLightColor;

    vec3 resultRgb = (ambientLightColor + shapeDiffuse) * shapeTexture.rgb  + shapeSpecular;
    float sharpenAlpha = (shapeTexture.a - uAlphaCutout) / max(fwidth(shapeTexture.a), 0.0001) + 0.5;
    gl_FragColor = vec4(resultRgb, sharpenAlpha);
    // gl_FragColor = vec4(vec3ToReg(normal), sharpenAlpha);
}
