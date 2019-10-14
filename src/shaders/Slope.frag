#include <common>
#include <lights_pars_begin>

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vWorldVertexPosition;
varying vec3 vViewPosition;
varying float vSlopeFactor;
// ----- Slope -----
uniform sampler2D uSlope;
uniform float uSlopeScale;
uniform float uShininess;
uniform float uSpecularStrength;
uniform sampler2D uSlopeBumpMap;
uniform float uSlopeBumpMapDepth;
#ifdef  RENDER_FOAM
uniform sampler2D uFoam;
uniform float uFoamDistortionStrength;
uniform sampler2D uFoamDistortion;
uniform float uFoamAnimation;
#endif
// ----- Ground -----
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
uniform float uSplattingScale1;
uniform float uSplattingScale2;
uniform float uSplattingFadeThreshold;
uniform float uSplattingOffset;
#endif

vec3 vec3ToReg(vec3 normVec) {
    return normVec * 0.5 + 0.5;
}

// ----- Common
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

// ----- Slope
vec2 dHdxy_fwd() {
    vec2 vUv = vUv.xy / uSlopeScale;
    vec2 dSTdx = dFdx(vUv);
    vec2 dSTdy = dFdy(vUv);
    float Hll = uSlopeBumpMapDepth * texture2D(uSlopeBumpMap, vUv).x;
    float dBx = uSlopeBumpMapDepth * texture2D(uSlopeBumpMap, vUv + dSTdx).x - Hll;
    float dBy = uSlopeBumpMapDepth * texture2D(uSlopeBumpMap, vUv + dSTdy).x - Hll;
    return vec2(dBx, dBy);
}

// ----- Ground
vec2 dHdxy_fwd(sampler2D uBumpMap, float uBumpMapDepth, float uTextureScale) {
    vec2 vUv = vWorldVertexPosition.xy / uTextureScale;
    vec2 dSTdx = dFdx(vUv);
    vec2 dSTdy = dFdy(vUv);
    float Hll = uBumpMapDepth * texture2D(uBumpMap, vUv).x;
    float dBx = uBumpMapDepth * texture2D(uBumpMap, vUv + dSTdx).x - Hll;
    float dBy = uBumpMapDepth * texture2D(uBumpMap, vUv + dSTdy).x - Hll;
    return vec2(dBx, dBy);
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

vec3 groundRgb(void) {
    vec3 top = phong(uTopTexture, uTopTextureScale, uTopBumpMap, uTopBumpMapDepth, uTopShininess, uTopSpecularStrength);
    #ifndef RENDER_GROUND_TEXTURE
    return top;
    #endif

    #ifdef  RENDER_GROUND_TEXTURE
    vec3 bottom = phong(uBottomTexture, uBottomTextureScale, uBottomBumpMap, uBottomBumpMapDepth, uBottomShininess, uBottomSpecularStrength);

    float splatting1 = texture2D(uSplatting, vWorldVertexPosition.xy / uSplattingScale1).r;
    float splatting2 = texture2D(uSplatting, vWorldVertexPosition.xy / uSplattingScale2).r;
    float splatting = (splatting1 + splatting2) / 2.0;
    splatting = (splatting - uSplattingOffset) / (2.0 * uSplattingFadeThreshold) + 0.5;
    splatting = clamp(splatting, 0.0, 1.0);
    return mix(top, bottom, splatting);
    #endif
}

void main(void) {
    vec3 normal = perturbNormalArb(-vViewPosition, normalize(vNormal), dHdxy_fwd());
    vec3 viewDir = normalize(vViewPosition);
    vec3 directLightColor = directionalLights[0].color;
    vec3 directLightDirection = directionalLights[0].direction;

    // Slope
    vec4 slopeTexture = texture2D(uSlope, vUv.xy / uSlopeScale);
    vec3 slopeDiffuse = max(dot(normal, directLightDirection), 0.0) * directLightColor;
    vec3 halfwayDir = normalize(directLightDirection + viewDir);
    float spec = pow(max(dot(normal, halfwayDir), 0.0), uShininess);
    vec3 slopeSpecular = uSpecularStrength * spec * directLightColor;
    vec3 slope = (ambientLightColor + slopeDiffuse + slopeSpecular) * slopeTexture.rgb;

    // Ground
    vec3 slopeGround = mix(groundRgb(), slope, vSlopeFactor);

    // Water foam
    #ifdef  RENDER_FOAM
    vec2 totalDistortion = uFoamDistortionStrength  * (texture2D(uFoamDistortion, vUv.xy / uSlopeScale + vec2(uFoamAnimation, 0)).rg * 2.0 - 1.0);
    vec4 foam = texture2D(uFoam, (vUv.xy + totalDistortion) / uSlopeScale);
    gl_FragColor = vec4(foam.rgb * foam.a + slopeGround * (1.0 - foam.a), 1.0);
    #endif

    #ifndef RENDER_FOAM
    gl_FragColor = vec4(slopeGround, 1.0);
    #endif

    // gl_FragColor = vec4(slope * coast.a + groundTexture * (1.0 - coast.a), 1.0);
    // gl_FragColor = vec4(vUv.x/ uCoastScale, mod(vUv.y/ uCoastScale, 1.0), 0.0, 1.0);
}
