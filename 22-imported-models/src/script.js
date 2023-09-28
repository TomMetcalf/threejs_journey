import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

THREE.ColorManagement.enabled = false;

// Create a settings object
const settings = {
  animationSpeed: 0.8,
  selectedAnimation: 0,
};

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Add the settings to the GUI
const animationFolder = gui.addFolder('Animation');
animationFolder.add(settings, 'animationSpeed', 0.1, 3.0).onChange((value) => {
  if (mixer !== null) {
    mixer.timeScale = value;
  }
});

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Models
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null
let currentAction = null;

gltfLoader.load('/models/Fox/glTF/Fox.gltf', (gltf) => {
  mixer = new THREE.AnimationMixer(gltf.scene);
  const action = mixer.clipAction(gltf.animations[0]);
  action.play();
  currentAction = action;

  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
    }
  });

  gltf.scene.scale.set(0.025, 0.025, 0.025);
  scene.add(gltf.scene);

  animationFolder
    .add(settings, 'selectedAnimation', { 'Look Around': 0, Walk: 1, Run: 2 })
    .onChange((value) => {
      if (currentAction) {
        currentAction.stop();
      }
      if (mixer !== null && gltf.animations[value]) {
        const newAction = mixer.clipAction(gltf.animations[value]);
        newAction.play();
        currentAction = newAction; 
      }
    });
});

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: '#444444',
    metalness: 0,
    roughness: 0.5,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

// Directional Light
const directionalLight = new THREE.DirectionalLight(0x003264, 0.8);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(0, 5, 0);
scene.add(directionalLight);

const directionalLightPosition = {
  x: directionalLight.position.x,
  y: directionalLight.position.y,
  z: directionalLight.position.z,
};

function updateDirectionalLightPosition() {
  directionalLight.position.set(
    directionalLightPosition.x,
    directionalLightPosition.y,
    directionalLightPosition.z
  );
}

const directionalLightFolder = gui.addFolder('Directional Light Controls');

directionalLightFolder
  .add(directionalLight, 'intensity')
  .min(0)
  .max(1)
  .step(0.01)
  .name('DL Intensity');

directionalLightFolder.addColor(directionalLight, 'color').name('DL Color');

directionalLightFolder
  .add(directionalLightPosition, 'x', -10, 10)
  .onChange(updateDirectionalLightPosition)
  .name('DL Pos X-Axis');
directionalLightFolder
  .add(directionalLightPosition, 'y', 2, 10)
  .onChange(updateDirectionalLightPosition)
  .name('DL Pos Y-Axis');
directionalLightFolder
  .add(directionalLightPosition, 'z', -10, 10)
  .onChange(updateDirectionalLightPosition)
  .name('DL Pos Z-Axis');

directionalLightFolder.add(directionalLight, 'visible').name('DL Visible');

directionalLightFolder.close();

// // Point Light
// const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2);
// pointLight.position.set(1, -0.5, 1);
// scene.add(pointLight);

// const pointLightPosition = {
//   x: pointLight.position.x,
//   y: pointLight.position.y,
//   z: pointLight.position.z,
// };

// function updatePointLightPosition() {
//   pointLight.position.set(
//     pointLightPosition.x,
//     pointLightPosition.y,
//     pointLightPosition.z
//   );
// }

// const pointLightFolder = gui.addFolder('Point Light Controls');
// pointLightFolder
//   .add(pointLight, 'intensity')
//   .min(0)
//   .max(1)
//   .step(0.01)
//   .name('PL Intensity');

// pointLightFolder
//   .add(pointLight, 'distance')
//   .min(0)
//   .max(50)
//   .step(0.01)
//   .name('PL Distance');

// pointLightFolder
//   .add(pointLight, 'decay')
//   .min(0)
//   .max(5)
//   .step(0.01)
//   .name('PL Decay');

// pointLightFolder
//   .add(pointLightPosition, 'x', -10, 10)
//   .onChange(updatePointLightPosition)
//   .name('PL Pos X-Axis');
// pointLightFolder
//   .add(pointLightPosition, 'y', -10, 10)
//   .onChange(updatePointLightPosition)
//   .name('PL Pos Y-Axis');
// pointLightFolder
//   .add(pointLightPosition, 'z', -10, 10)
//   .onChange(updatePointLightPosition)
//   .name('PL Pos Z-Axis');

// pointLightFolder.add(pointLight, 'visible').name('PL Visible');

// pointLightFolder.close();

// const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
// scene.add(pointLightHelper);

// Spot Light
const spotLightPosition = {
  x: 0,
  y: 2,
  z: 6,
};

const spotLight = new THREE.SpotLight(0xffa82e, 0.5, 10, 0.5, 0.25, 1);
spotLight.position.set(spotLightPosition.x, spotLightPosition.y, spotLightPosition.z);
scene.add(spotLight);

spotLight.target.position.x = 0;
spotLight.target.position.y = -1;
spotLight.target.position.z = -1;

scene.add(spotLight.target);

const spotLightFolder = gui.addFolder('Spot Light Controls');
spotLightFolder
  .add(spotLight, 'intensity')
  .min(0)
  .max(1)
  .step(0.01)
  .name('SL Intensity');

spotLightFolder.addColor(spotLight, 'color').name('SL Color');

spotLightFolder
  .add(spotLight, 'distance')
  .min(0)
  .max(50)
  .step(0.01)
  .name('SL Distance');

spotLightFolder
  .add(spotLight, 'angle')
  .min(Math.PI * 0.0)
  .max(Math.PI * 0.5)
  .step(Math.PI * 0.05)
  .name('SL Angle');

spotLightFolder
  .add(spotLight, 'penumbra')
  .min(0)
  .max(1)
  .step(0.01)
  .name('SL Penumbra');

spotLightFolder
  .add(spotLight, 'decay')
  .min(0)
  .max(1)
  .step(0.1)
  .name('SL Decay');

const spotLightTargetControllerX = spotLightFolder
  .add({ targetX: spotLight.target.position.x }, 'targetX', -5, 5)
  .name('SL Tilt X-Axis');

spotLightTargetControllerX.onChange(function (value) {
  spotLight.target.position.x = value;
});

const spotLightTargetControllerY = spotLightFolder
  .add({ targetY: spotLight.target.position.y }, 'targetY', -10, 5)
  .name('SL Tilt Y-Axis');

spotLightTargetControllerY.onChange(function (value) {
  spotLight.target.position.y = value;
});

const spotLightTargetControllerZ = spotLightFolder
  .add({ targetZ: spotLight.target.position.z }, 'targetZ', -10, 5)
  .name('SL Tilt Z-Axis');

spotLightTargetControllerZ.onChange(function (value) {
  spotLight.target.position.z = value;
});

const spotLightPosXController = spotLightFolder
  .add(spotLightPosition, 'x', -10, 10)
  .name('SL Position X-Axis')
  .onChange((value) => {
    spotLight.position.x = value;
  });

const spotLightPosYController = spotLightFolder
  .add(spotLightPosition, 'y', -10, 10)
  .name('SL Position Y-Axis')
  .onChange((value) => {
    spotLight.position.y = value;
  });

const spotLightPosZController = spotLightFolder
  .add(spotLightPosition, 'z', -10, 10)
  .name('SL Position Z-Axis')
  .onChange((value) => {
    spotLight.position.z = value;
  });

spotLightFolder.add(spotLight, 'visible').name('SL Visible');

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
spotLightHelper.visible = false;
scene.add(spotLightHelper);

spotLightFolder.add(spotLightHelper, 'visible').name('Spot Light Helper');

spotLightFolder.close();



/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(2, 2, 2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0.75, 0);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Update mixer
  if (mixer !== null) {
      mixer.update(deltaTime)
  }

  // Update controls
  controls.update();

  spotLightHelper.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
