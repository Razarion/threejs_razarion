#include <common>
#include <lights_pars_begin>

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

uniform sampler2D texture;
uniform float uShininess;
uniform float uSpecularStrength;
uniform float alphaTest;


void main(void) {
    vec3 normal = vNormal;
    vec3 viewDir = normalize(vViewPosition);
    vec3 directLightColor = directionalLights[0].color;
    vec3 directLightDirection = directionalLights[0].direction;

    // Phong Shading + AlphaTest
    vec4 shapeTexture = texture2D(texture, vUv);
    if(alphaTest != 0.0 && alphaTest > shapeTexture.a) {
        discard;
    }
    vec3 shapeDiffuse = max(dot(normal, directLightDirection), 0.0) * directLightColor;
    vec3 halfwayDir = normalize(directLightDirection + viewDir);
    float spec = pow(max(dot(normal, halfwayDir), 0.0), uShininess);
    vec3 shapeSpecular = uSpecularStrength * spec * directLightColor;
    vec3 resultRgb = (ambientLightColor + shapeDiffuse + shapeSpecular) * shapeTexture.rgb;
    gl_FragColor = vec4(resultRgb, 1.0);
}
