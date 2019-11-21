#include <common>
#include <lights_pars_begin>

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

uniform sampler2D texture;
uniform float uShininess;
uniform float uSpecularStrength;
uniform float uAlphaCutout;

const float SPECULAR_FACTOR = 3.0;

void main(void) {
    vec3 normal = vNormal;
    vec3 viewDir = normalize(vViewPosition);
    vec3 directLightColor = directionalLights[0].color;
    vec3 directLightDirection = directionalLights[0].direction;

    // Phong Shading + Alpha to coverage
    vec4 shapeTexture = texture2D(texture, vUv);
    vec3 shapeDiffuse = max(dot(normal, directLightDirection), 0.0) * directLightColor;
    vec3 halfwayDir = normalize(directLightDirection + viewDir);
    float spec = pow(max(dot(normal, halfwayDir), 0.0), uShininess);
    vec3 shapeSpecular = uSpecularStrength * SPECULAR_FACTOR * spec * directLightColor;

    vec3 resultRgb = (ambientLightColor + shapeDiffuse) * shapeTexture.rgb  + shapeSpecular;
    float sharpenAlpha = (shapeTexture.a - uAlphaCutout) / max(fwidth(shapeTexture.a), 0.0001) + 0.5;
    gl_FragColor = vec4(resultRgb, sharpenAlpha);
}
