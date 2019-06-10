#include <common>
#include <lights_pars_begin>

uniform sampler2D uWater;
uniform float uWaterScale;
uniform sampler2D uCoast;
uniform float uCoastScale;
uniform sampler2D uSeabedTexture;
uniform float uSeabedTextureScale;

varying vec3 vNormal;
varying vec3 vWorldVertexPosition;
// Water
uniform float uWaterLevel;
uniform float uWaterDelta;
uniform float uWaterGround;

uniform sampler2D uDistortionMap;
uniform float uDistortionScale;
uniform float uDistortionStrength;
uniform float animation;

vec3 vec3ToReg(vec3 normVec) {
    return normVec * 0.5 + 0.5;
}

void main(void) {
    vec3 ambient;
    vec3 diffuse;

    float z = vWorldVertexPosition.z;
    float xTexLookup = (uWaterLevel - z) / uWaterDelta + 0.5;

    vec4 coas = texture2D(uCoast, vWorldVertexPosition.xy / uCoastScale);
    vec3 seabedTexture = texture2D(uSeabedTexture, vWorldVertexPosition.xy / uSeabedTextureScale).rgb;

    vec4 water = vec4(0, 0, 0, 0);
    if(xTexLookup >= 0.0 && xTexLookup <= 1.0) {
        vec2 totalDistortion = texture2D(uDistortionMap, vWorldVertexPosition.xy / uDistortionScale + vec2(animation, 0)).rg * 2.0 - 1.0;
        vec2 textureCoord = vec2(xTexLookup, vWorldVertexPosition.y / uWaterScale) + totalDistortion * uDistortionStrength;
        water = texture2D(uWater, textureCoord);
    }

    vec3 coastSeabed = coas.rgb * coas.a + seabedTexture * (1.0 - coas.a);

    gl_FragColor = vec4(water.rgb * water.a + coastSeabed * (1.0 - water.a), 1.0);
}
