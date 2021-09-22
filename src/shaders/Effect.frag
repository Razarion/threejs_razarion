uniform float opacity;

uniform sampler2D tDiffuse;

varying vec2 vUv;

void main() {

    vec3 texel = texture2D(tDiffuse, vUv).rgb;
    if(length(texel) > 0.0) {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}
