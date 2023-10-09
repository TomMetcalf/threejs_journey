import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader';
import { GroundProjectedSkybox } from 'three/examples/jsm/objects/GroundProjectedSkybox';

/**
 * Loader
 */
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
const rgbeLoader = new RGBELoader();
const exrLoader = new EXRLoader();
const textureLoader = new THREE.TextureLoader();

/**
 * Base
 */
// Debug
const gui = new dat.GUI();
const global = {};

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (child.isMesh && child.material.isMeshStandardMaterial) {
      child.material.envMapIntensity = global.envMapIntensity;
    }
  });
};

/**
 * Environment map
 */
scene.backgroundBlurriness = 0;
scene.backgroundIntensity = 1;
gui.add(scene, 'backgroundBlurriness').min(0).max(1).step(0.001);
gui.add(scene, 'backgroundIntensity').min(0).max(10).step(0.001);

// Global intensity
global.envMapIntensity = 0.3;
gui
  .add(global, 'envMapIntensity')
  .min(0)
  .max(10)
  .step(0.001)
  .onChange(updateAllMaterials);

// LDR cube texture
// const environemntMap = cubeTextureLoader.load([
//   '/environmentMaps/0/px.png',
//   '/environmentMaps/0/nx.png',
//   '/environmentMaps/0/py.png',
//   '/environmentMaps/0/ny.png',
//   '/environmentMaps/0/pz.png',
//   '/environmentMaps/0/nz.png',
// ]);

// scene.environment = environemntMap;
// scene.background = environemntMap;

// HDR (RGBE) equirectangular
// rgbeLoader.load('/environmentMaps/blender-2k-lights.hdr', (environmentMap) => {
//     environmentMap.mapping = THREE.EquirectangularReflectionMapping

// scene.background = environmentMap
// scene.environment = environmentMap
// })

// HDR (EXR) equirectangular
// exrLoader.load('/environmentMaps/nvidiaCanvas-4k.exr', (environmentMap) => {
//     environmentMap.mapping = THREE.EquirectangularReflectionMapping

// scene.background = environmentMap
// scene.environment = environmentMap
// })

// LDR equirectangular
// const environmentMap = textureLoader.load(
//   '/environmentMaps/blockadesLabsSkybox/anime_art_style_japan_streets_with_cherry_blossom_.jpg'
// );
// environmentMap.mapping = THREE.EquirectangularReflectionMapping;
// environmentMap.colorSpace = THREE.SRGBColorSpace

// scene.background = environmentMap;
// scene.environment = environmentMap;

// Ground projected skybox
rgbeLoader.load('/environmentMaps/2/2k.hdr',
  (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = environmentMap;

    // Skybox
    const skybox = new GroundProjectedSkybox(environmentMap)
    skybox.radius = 120
    skybox.height = 11
    skybox.scale.setScalar(50)
    scene.add(skybox)

    gui.add(skybox, 'radius', 1, 200, 0.1)
    gui.add(skybox, 'height', 1, 200, 0.1)
  });

/**
 * Torus Knot
 */
// const torusKnot = new THREE.Mesh(
//   new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
//   new THREE.MeshStandardMaterial({
//     roughness: 0.3,
//     metalness: 1,
//     color: 0xaaaaaa,
//   })
// );

// torusKnot.material.envMap = environemntMap
// torusKnot.position.x = -4;
// torusKnot.position.y = 4;
// scene.add(torusKnot);

/**
 * Models
 */
gltfLoader.load('models/Fox/glTF/Fox.gltf', (gltf) => {
  gltf.scene.scale.set(0.025, 0.025, 0.025);
  scene.add(gltf.scene);

  updateAllMaterials();
});

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
camera.position.set(5, 3, 6);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.y = 3.5;
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
const tick = () => {
  // Time
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
