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

#define EPSILON 1e-6
#define RECIPROCAL_PI 0.31830988618
#define DEFAULT_SPECULAR_COEFFICIENT 0.04

vec3 vec3ToReg(vec3 normVec) {
    return normVec * 0.5 + 0.5;
}

struct PhysicalMaterial {
    vec3 diffuseColor;
    float specularRoughness;
    vec3 specularColor;
    float clearCoat;
    float clearCoatRoughness;
};

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

vec3 F_Schlick(const in vec3 specularColor, const in float dotLH) {
    float fresnel = exp2((-5.55473 * dotLH - 6.98316) * dotLH);
    return (1.0 - specularColor) * fresnel + specularColor;
}

float G_GGX_SmithCorrelated(const in float alpha, const in float dotNL, const in float dotNV) {
    float a2 = pow2(alpha);
    float gv = dotNL * sqrt(a2 + (1.0 - a2) * pow2(dotNV));
    float gl = dotNV * sqrt(a2 + (1.0 - a2) * pow2(dotNL));
    return 0.5 / max(gv + gl, EPSILON);
}

float D_GGX(const in float alpha, const in float dotNH) {
    float a2 = pow2(alpha);
    float denom = pow2(dotNH) * (a2 - 1.0) + 1.0;
    return RECIPROCAL_PI * a2 / pow2(denom);
}

vec3 BRDF_Specular_GGX(const in IncidentLight incidentLight, const in GeometricContext geometry, const in vec3 specularColor, const in float roughness) {
    float alpha = pow2(roughness);
    vec3 halfDir = normalize(incidentLight.direction + geometry.viewDir);
    float dotNL = saturate(dot(geometry.normal, incidentLight.direction));
    float dotNV = saturate(dot(geometry.normal, geometry.viewDir));
    float dotNH = saturate(dot(geometry.normal, halfDir));
    float dotLH = saturate(dot(incidentLight.direction, halfDir));
    vec3 F = F_Schlick(specularColor, dotLH);
    float G = G_GGX_SmithCorrelated(alpha, dotNL, dotNV);
    float D = D_GGX(alpha, dotNH);
    return F * (G * D);
}

vec3 BRDF_Diffuse_Lambert(const in vec3 diffuseColor) {
    return RECIPROCAL_PI * diffuseColor;
}

void RE_Direct_Physical(const in IncidentLight directLight, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
    float dotNL = saturate(dot(geometry.normal, directLight.direction));
    vec3 irradiance = dotNL * directLight.color;
    irradiance *= PI;
    reflectedLight.directSpecular +=  irradiance * BRDF_Specular_GGX(directLight, geometry, material.specularColor, material.specularRoughness);
    reflectedLight.directDiffuse += irradiance * BRDF_Diffuse_Lambert(material.diffuseColor);
    reflectedLight.directSpecular += irradiance * material.clearCoat * BRDF_Specular_GGX(directLight, geometry, vec3(DEFAULT_SPECULAR_COEFFICIENT), material.clearCoatRoughness);
}

void main(void) {
    vec3 ambient;
    vec3 diffuse;

    GeometricContext geometry;
    geometry.position = - vViewPosition;
    geometry.normal = perturbNormalArb(-vViewPosition, normalize(vNormal), dHdxy_fwd());
    geometry.viewDir = normalize(vViewPosition);

    vec4 coast = texture2D(uCoast, vWorldVertexPosition.xy / uCoastScale);
    vec3 diffuseColor = coast.rgb;
    vec3 totalEmissiveRadiance = vec3(0.0, 0.0, 0.0);

    PhysicalMaterial material;
    material.diffuseColor = diffuseColor.rgb * (1.0 - uMetalnessFactor);
    material.specularRoughness = clamp(uRoughnessFactor, 0.04, 1.0);
    material.specularColor = mix(vec3(DEFAULT_SPECULAR_COEFFICIENT), diffuseColor.rgb, uMetalnessFactor);

    IncidentLight directLight;
    directLight.color = directionalLights[0].color;
    directLight.direction = directionalLights[0].direction;
    directLight.visible = true;

    ReflectedLight reflectedLight = ReflectedLight(vec3(0.0), vec3(0.0), ambientLightColor, vec3(0.0));
    RE_Direct_Physical(directLight, geometry, material, reflectedLight);

    vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;

    vec3 slopeDiffuse = max(dot(geometry.normal, directLight.direction), 0.0) * directLight.color;
    vec3 reflectDir = reflect(-directLight.direction, geometry.normal);
    float spec = pow(max(dot(geometry.viewDir, reflectDir), 0.0), uShininess);
    vec3 slopeSpecular = uSpecularStrength * spec * directLight.color;
    vec3 slope = (ambientLightColor + slopeDiffuse + slopeSpecular) * coast.rgb;


    vec3 seabedTexture = texture2D(uSeabedTexture, vWorldVertexPosition.xy / uSeabedTextureScale).rgb;

    vec2 totalDistortion = uDistortionStrength  * (texture2D(uDistortionMap, vWorldVertexPosition.xy / uCoastScale + vec2(animation, 0)).rg * 2.0 - 1.0);
    vec4 water = texture2D(uWater, (vWorldVertexPosition.xy + totalDistortion) / uCoastScale);

    vec3 coastSeabed = slope * coast.a + seabedTexture * (1.0 - coast.a);

    gl_FragColor = vec4(water.rgb * water.a + coastSeabed * (1.0 - water.a), 1.0);
}
