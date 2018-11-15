precision highp float;

uniform float time;
varying vec2 vUv;

#pragma glslify: noise = require('glsl-noise/simplex/3d');

void main () {
    float d = noise(vec3(vUv * 0.85, time * 0.5)) * 0.5 + 0.5;

    vec3 color = vec3(d);
    gl_FragColor = vec4(color, 1.0);
}