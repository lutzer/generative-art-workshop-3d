
precision highp float;

uniform sampler2D image;
uniform float time;
varying vec2 vUv;

void main () {
    // vec3 color = 0.5 + 0.5 * cos(time + vUv.xyx + vec3(0.0, 2.0, 4.0));
    vec2 uv = vUv;
    uv.y = 1.0 - uv.y;

    vec3 color = texture2D(image, uv).rgb;
    gl_FragColor = vec4(color, 1.0);
}