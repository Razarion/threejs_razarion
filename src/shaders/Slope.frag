#include <common>
#include <lights_pars_begin>

varying vec3 vWorldVertexPosition;
// Water
uniform float uWaterLevel;
uniform float uWaterGround;
uniform vec3 uUnderWaterTopColor;
uniform vec3 uUnderWaterBottomColor;

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
    if(z >= uWaterLevel) {
        gl_FragColor = vec4(0.75, 0.66, 0.09, 1.0);
    } else {
        // Under water
        float underWaterFactor = (z - uWaterGround) / (uWaterLevel - uWaterGround);
        setupUnderWater(ambient, diffuse, underWaterFactor);
        gl_FragColor = setupColor(ambient, diffuse, vec3(0.0, 0.0, 0.0), false, false);
    }
}