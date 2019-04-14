#include <common>
#include <lights_pars_begin>

varying vec3 vWorldVertexPosition;
// Water
uniform float uWaterLevel;
uniform float uWaterGround;

const vec3 underWaterTopColor = vec3(0.0, 0.7, 0.8);
const vec3 underWaterBottomColor = vec3(0.0, 0.1, 0.2);

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
    vec3 color = mix(underWaterBottomColor, underWaterTopColor, underWaterFactor);
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