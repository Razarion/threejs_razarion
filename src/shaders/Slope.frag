#include <common>
#include <lights_pars_begin>

uniform sampler2D uWater;
uniform float uWaterScale;
uniform sampler2D uCoast;
uniform float uCoastScale;
uniform sampler2D uCoastBumpMap;
uniform float uCoastBumpMapDepth;
uniform sampler2D uSeabedTexture;
uniform float uSeabedTextureScale;

uniform float uMetalnessFactor;
uniform float uRoughnessFactor;
uniform float uShininess;
uniform float uSpecularStrength;

varying vec3 vNormal;
varying vec3 vWorldVertexPosition;

uniform sampler2D uDistortionMap;
uniform float uDistortionStrength;
uniform float animation;

varying vec3 vViewPosition;

vec3 vec3ToReg(vec3 normVec) {
    return normVec * 0.5 + 0.5;
}

vec2 dHdxy_fwd() {
    vec2 vUv = vWorldVertexPosition.xy / uCoastScale;
    vec2 dSTdx = dFdx(vUv);
    vec2 dSTdy = dFdy(vUv);
    float Hll = uCoastBumpMapDepth * texture2D(uCoastBumpMap, vUv).x;
    float dBx = uCoastBumpMapDepth * texture2D(uCoastBumpMap, vUv + dSTdx).x - Hll;
    float dBy = uCoastBumpMapDepth * texture2D(uCoastBumpMap, vUv + dSTdy).x - Hll;
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

    // Slope
    vec4 coast = texture2D(uCoast, vWorldVertexPosition.xy / uCoastScale);
    vec3 slopeDiffuse = max(dot(normal, directLightDirection), 0.0) * directLightColor;
    vec3 halfwayDir = normalize(directLightDirection + viewDir);
    float spec = pow(max(dot(normal, halfwayDir), 0.0), uShininess);
    vec3 slopeSpecular = uSpecularStrength * spec * directLightColor;
    vec3 slope = (ambientLightColor + slopeDiffuse + slopeSpecular) * coast.rgb;

    // Seabed
    vec3 seabedTexture = texture2D(uSeabedTexture, vWorldVertexPosition.xy / uSeabedTextureScale).rgb;

    // Water
    vec2 totalDistortion = uDistortionStrength  * (texture2D(uDistortionMap, vWorldVertexPosition.xy / uCoastScale + vec2(animation, 0)).rg * 2.0 - 1.0);
    vec4 water = texture2D(uWater, (vWorldVertexPosition.xy + totalDistortion) / uCoastScale);

    vec3 coastSeabed = slope * coast.a + seabedTexture * (1.0 - coast.a);

    gl_FragColor = vec4(water.rgb * water.a + coastSeabed * (1.0 - water.a), 1.0);
}
