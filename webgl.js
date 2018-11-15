const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');
const bezierEasing = require('bezier-easing');
const  { mapRange } = require('canvas-sketch-util/math');

// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require('three');

// Include any additional ThreeJS examples below
require('three/examples/js/controls/OrbitControls');

const settings = {
  dimensions: [ 512, 512],
  // Make the loop animated
  animate: true,
  duration: 10,
  // Get a WebGL canvas rather than 2D
  context: 'webgl',
  // Turn on MSAA
  attributes: { antialias: true }
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    context
  });

  // WebGL background color
  renderer.setClearColor('white', 1);

  // Setup a camera
  const camera = new THREE.OrthographicCamera();

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera);

  // Setup your scene
  const scene = new THREE.Scene();

  const palette = random.pick(palettes);

  const geometry = new THREE.BoxGeometry(1,1,1);

  const randomizeMesh = (mesh) => {
    mesh.scale.y = 0.1
    mesh.position.set(
      random.range(-1,1) * 0.5,
      random.range(-1,1),
      random.range(-1,1) * 0.5,
    ).multiplyScalar(1)
    mesh.scale.set(
      random.gaussian() * 0.2,
      random.gaussian() * 0.5,
      random.gaussian() * 0.2
    )

    mesh.duration = random.range(2,8);
    mesh.time = 0;
    mesh.originalScale = mesh.scale.clone();
    mesh.material.color.setStyle({ color: random.pick(palette) })
  }
  
  const meshes = [];
  const container = new THREE.Group();
  for (let i = 0; i < 20; i++) {
    const material = new THREE.MeshStandardMaterial({
       color: random.pick(palette),
       roughness: 1,
       metallness: 3
      });
    const mesh = new THREE.Mesh(geometry, material);

    randomizeMesh(mesh);

    meshes.push(mesh);
    container.add(mesh);

    
  }

  scene.add(container);

  const light = new THREE.DirectionalLight("white", 1);
  light.position.set(4,4,0);
  scene.add(light);
  

  // draw each frame
  return {
    // Handle resize events here
    resize ({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight);

      const aspect = viewportWidth / viewportHeight;

      // Ortho zoom
      const zoom = 1;

      // Bounds
      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;

      // Near/Far
      camera.near = -100;
      camera.far = 100;

      // Set position & look at world center
      camera.position.set(zoom, zoom, zoom);
      camera.lookAt(new THREE.Vector3());

      // Update the camera
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render ({ time, deltaTime, playhead }) {
      meshes.forEach( (mesh, i) => {
        mesh.time = mesh.time > mesh.duration ? 0 : mesh.time + deltaTime;
        
        if (mesh.time == 0) {
          randomizeMesh(mesh);
        }

        const noise = random.noise2D(
          i*1000,
          mesh.time * 0.1
        )

        const s = Math.max(0.0001, Math.sin(mesh.time / mesh.duration * Math.PI));
        mesh.scale.copy(mesh.originalScale).multiplyScalar(s);

        mesh.scale.x *= noise;

        mesh.position.y = mapRange(mesh.time, 0 ,mesh.duration, -1, 1);

      })

      container.rotation.y = playhead * Math.PI * 2;

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