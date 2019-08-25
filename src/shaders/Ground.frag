#include <common>
#include <lights_pars_begin>

uniform sampler2D uGroundTexture;
uniform float uGroundTextureScale;

varying vec3 vWorldVertexPosition;

void main(void) {
    gl_FragColor = texture2D(uGroundTexture, vWorldVertexPosition.xy / uGroundTextureScale);
}
