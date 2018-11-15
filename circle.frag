precision highp float;

uniform float time;
varying vec2 vUv;
uniform float aspect;

#pragma glslify: noise = require('glsl-noise/simplex/3d');
#pragma glslify: hsl2rgb = require('glsl-hsl2rgb');

void main () {
    // create noise
    float d = 0.25 * noise(vec3(vUv * 0.85, time * 0.5));
    d += 0.75 * noise(vec3(vUv * 3.0, time * 0.5));

    // change color
    float hue = d * 0.15;
    hue = mod(hue + time * 0.05, 1.0);
    vec3 color = hsl2rgb(hue, 0.5, 0.5);

    // fix aspect ratio
    vec2 coord = vUv -0.5;
    coord.x *= aspect;

    // caluclate distance
    float dist = length(coord);
    float mask = dist < 0.25 ? 1.0 : 0.0;

    gl_FragColor = vec4(color * mask, 1.0);
}