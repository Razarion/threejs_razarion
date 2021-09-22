uniform float opacity;

uniform sampler2D tDiffuse;
uniform sampler2D effectTexture;

varying vec2 vUv;

void main() {

    vec4 texel = texture2D(tDiffuse, vUv) + texture2D(effectTexture, vUv);
    // vec4 texel = texture2D(effectTexture, vUv);
    gl_FragColor = texel;
}
