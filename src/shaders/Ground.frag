#include <common>
#include <lights_pars_begin>
varying vec3 vWorldVertexPosition;
varying vec3 vViewPosition;
varying vec3 vNormal;
// Top
uniform sampler2D uTopTexture;
uniform float uTopTextureScale;
uniform sampler2D uTopBumpMap;
uniform float uTopBumpMapDepth;
uniform float uTopShininess;
uniform float uTopSpecularStrength;
#ifdef  RENDER_GROUND_TEXTURE
// Bottom
uniform sampler2D uBottomTexture;
uniform float uBottomTextureScale;
uniform sampler2D uBottomBumpMap;
uniform float uBottomBumpMapDepth;
uniform float uBottomShininess;
uniform float uBottomSpecularStrength;
// Top-Bottom Splatting
uniform sampler2D uSplatting;
uniform float uSplattingScale;
uniform float uSplattingFadeThreshold;
uniform float uSplattingOffset;
#endif

vec3 vec3ToReg(vec3 normVec) {
    return normVec * 0.5 + 0.5;
}

vec2 dHdxy_fwd(sampler2D uBumpMap, float uBumpMapDepth, float uTextureScale) {
    vec2 vUv = vWorldVertexPosition.xy / uTextureScale;
    vec2 dSTdx = dFdx(vUv);
    vec2 dSTdy = dFdy(vUv);
    float Hll = uBumpMapDepth * texture2D(uBumpMap, vUv).x;
    float dBx = uBumpMapDepth * texture2D(uBumpMap, vUv + dSTdx).x - Hll;
    float dBy = uBumpMapDepth * texture2D(uBumpMap, vUv + dSTdy).x - Hll;
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


vec3 phong(sampler2D uTexture, float uTextureScale, sampler2D uBumpMap, float uBumpMapDepth, float uShininess, float uSpecularStrength) {
    vec3 normal = perturbNormalArb(-vViewPosition, normalize(vNormal), dHdxy_fwd(uBumpMap, uBumpMapDepth, uTextureScale));
    vec3 viewDir = normalize(vViewPosition);
    vec3 directLightColor = directionalLights[0].color;
    vec3 directLightDirection = directionalLights[0].direction;

    vec4 texture = texture2D(uTexture, vWorldVertexPosition.xy / uTextureScale);
    vec3 diffuse = max(dot(normal, directLightDirection), 0.0) * directLightColor;
    vec3 halfwayDir = normalize(directLightDirection + viewDir);
    float spec = pow(max(dot(normal, halfwayDir), 0.0), uShininess);
    vec3 specular = uSpecularStrength * spec * directLightColor;
    return (ambientLightColor + diffuse + specular) * texture.rgb;
}

void main(void) {
    vec3 top = phong(uTopTexture, uTopTextureScale, uTopBumpMap, uTopBumpMapDepth, uTopShininess, uTopSpecularStrength);
    #ifndef RENDER_GROUND_TEXTURE
    gl_FragColor = vec4(top, 1.0);
    #endif

    #ifdef  RENDER_GROUND_TEXTURE
    vec3 bottom = phong(uBottomTexture, uBottomTextureScale, uBottomBumpMap, uBottomBumpMapDepth, uBottomShininess, uBottomSpecularStrength);

    float splatting = texture2D(uSplatting, vWorldVertexPosition.xy / uSplattingScale).r;
    splatting = (splatting - uSplattingOffset) / (2.0 * uSplattingFadeThreshold) + 0.5;
    splatting = clamp(splatting, 0.0, 1.0);
    gl_FragColor = vec4(mix(top, bottom, splatting), 1.0);
    #endif
}
