/**
 * @Author: Lutz Reiter [http://www.lu-re.de] <lutz>
 * @Date:   2018-11-17T16:45:34+01:00
 * @Last modified by:   lutz
 * @Last modified time: 2018-11-20T22:32:32+01:00
 */



const canvasSketch = require('canvas-sketch');
const glsl = require('glslify')

// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require('three');

// Include any additional ThreeJS examples below
require('three/examples/js/controls/OrbitControls');

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: 'webgl',
  // Turn on MSAA
  attributes: { antialias: true },
  dimensions: [ 512, 512]
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    context
  });

  // const createSphere = (numberOfPoints = 4) => {
  //   let points = [];
  //   for (let i=0; i <= numberOfPoints; i++) {
  //     points.push([
  //       Math.cos(i / numberOfPoints * Math.PI * 2),
  //       Math.sin(i / numberOfPoints * Math.PI * 2),
  //       Math.
  //     ]);
  //   }
  //   return points;
  // }

  // WebGL background color
  renderer.setClearColor('#FFF', 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(60, 1, 0.01, 100);
  camera.position.set(2, 2, -4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera);

  // Setup your scene
  const scene = new THREE.Scene();

  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      fragmentShader: glsl(/* glsl */`
        #pragma glslify: hsl2rgb = require('glsl-hsl2rgb');
        uniform float time;
        varying float n;
        void main () {
          float hue = n * 0.2;
          hue = mod(hue + time * 0.05, 1.0);
          vec3 color = hsl2rgb(hue, 0.5, 0.5);
          gl_FragColor = vec4(vec3(0.4 + n * 0.6), 1.0);
        }
      `),
      vertexShader: glsl(/* glsl */`
        #pragma glslify: noise = require('glsl-noise/simplex/4d);
        uniform float time;
        varying float n;
        void main () {
          n = noise(vec4(position.xyz, time));
          vec3 transformed = position.xyz + normal * n * 0.2;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
        }
      `)
    })
  );
  scene.add(mesh);

  // Specify an ambient/unlit colour
  scene.add(new THREE.AmbientLight('#fff'));

  // Add some light
  const light = new THREE.PointLight('#fff', 1, 15.5);
  light.position.set(2, 2, -4).multiplyScalar(1.5);
  scene.add(light);

  // draw each frame
  return {
    // Handle resize events here
    resize ({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render ({ time }) {
      mesh.material.uniforms.time.value = time;
      mesh.rotation.y = time * (10 * Math.PI / 180);
      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload () {
      controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
