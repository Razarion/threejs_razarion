#include <common>
#include <lights_pars_begin>

uniform sampler2D map;
uniform float mapScale;
uniform sampler2D wave;
uniform float waveScale;
uniform sampler2D groundTexture;
uniform float groundTextureScale;

varying vec3 vNormal;
varying vec3 vWorldVertexPosition;
// Water
uniform float uWaterLevel;
uniform float uWaterDelta;
uniform float uWaterGround;
uniform vec3 uUnderWaterTopColor;
uniform vec3 uUnderWaterBottomColor;

uniform sampler2D uDistortionMap;
uniform float uDistortionScale;
uniform float uDistortionStrength;
uniform float animation;

vec3 vec3ToReg(vec3 normVec) {
    return normVec * 0.5 + 0.5;
}

vec4 setupColor(vec3 ambient, vec3 diffuse, vec3 specular, bool shadow, bool terrainMarker) {
    float shadowFactor = 1.0;
    if(shadow) {
        // shadowFactor = calculateShadowFactor();
    }
    vec4 terrainMarkerColor = vec4(0.0, 0.0, 0.0, 0.0);
    if(terrainMarker) {
        // terrainMarkerColor = setupTerrainMarker();
    }
    return vec4(ambient + diffuse * shadowFactor + specular * shadowFactor, 1.0) + terrainMarkerColor;
}


void setupUnderWater(inout vec3 ambient, inout vec3 diffuse, float underWaterFactor) {
    vec3 color = mix(uUnderWaterBottomColor, uUnderWaterTopColor, underWaterFactor);
    ambient = color * ambientLightColor;
    diffuse = vec3(0.0, 0.0, 0.0);
}

void main(void) {
    vec3 ambient;
    vec3 diffuse;

    float z = vWorldVertexPosition.z;


    vec2 totalDistortion = texture2D(uDistortionMap, vWorldVertexPosition.xy / uDistortionScale + vec2(animation, 0)).rg * 2.0 - 1.0;
    vec2 textureCoord = (vWorldVertexPosition.xy) / mapScale + totalDistortion * uDistortionStrength;
    vec4 foam = texture2D(map, textureCoord);

    float xTexLookup = (uWaterLevel - z) / uWaterDelta + 0.5;
    if(xTexLookup < 0.0) {
        // Over water
        gl_FragColor = vec4(0.9, 0.9, 0.7, 1.0);
    } else if(xTexLookup > 1.0) {
        // Under water
        gl_FragColor = texture2D(groundTexture, vWorldVertexPosition.xy / groundTextureScale);
    } else {
        vec3 slopBackground;
        if(xTexLookup < 0.5) {
            // Over water
            slopBackground = vec3(0.9, 0.9, 0.7);
        } else {
            // Under water
            slopBackground = texture2D(groundTexture, vWorldVertexPosition.xy / groundTextureScale).rgb;
        }

        vec2 textureCoord = vec2(xTexLookup, vWorldVertexPosition.y / mapScale);
        vec4 foam = texture2D(map, textureCoord);

        gl_FragColor = vec4(foam.rgb * foam.a + slopBackground * (1.0 - foam.a), 1.0);
        // gl_FragColor = vec4(slopBackground, 1.0);
    }

    // gl_FragColor = vec4(vec3ToReg(vNormal), 1.0);
}
