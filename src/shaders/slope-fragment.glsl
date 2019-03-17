    uniform vec3 overWaterColor;
    uniform vec3 underWaterColor;
    varying vec3 vUv;

    void main() {
        if(vUv.z > 0.0) {
            gl_FragColor = vec4(overWaterColor, 1.0);
        } else if(vUv.z < 0.0) {
            gl_FragColor = vec4(underWaterColor, 1.0);
        } else {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        }
    }
