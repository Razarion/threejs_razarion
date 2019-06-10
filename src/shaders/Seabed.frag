#include <common>
#include <lights_pars_begin>

uniform sampler2D uTexture;
uniform float uTextureScale;

varying vec3 vNormal;
varying vec3 vWorldVertexPosition;


void main(void) {
    gl_FragColor = texture2D(uTexture, vWorldVertexPosition.xy / uTextureScale);
}
