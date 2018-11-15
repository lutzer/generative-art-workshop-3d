precision highp float;

uniform float time;
varying vec2 vUv;

#pragma glslify: noise = require('glsl-noise/simplex/3d');
#pragma glslify: hsl2rgb = require('glsl-hsl2rgb');

void main () {
    float d = noise(vec3(vUv * 0.85, time * 0.5)) * 0.5 + 0.5;

    float hue = d * 0.15;
    hue = mod(hue + time * 0.05, 1.0);
    vec3 color = hsl2rgb(hue, 0.5, 0.5);
    gl_FragColor = vec4(color, 1.0);
}