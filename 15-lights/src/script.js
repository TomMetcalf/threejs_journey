import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';

THREE.ColorManagement.enabled = false;

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
// scene.add(ambientLight)

// const pointLight = new THREE.PointLight(0xffffff, 0.5)
// pointLight.position.x = 2
// pointLight.position.y = 3
// pointLight.position.z = 4
// scene.add(pointLight)

// Ambient Light
// Shorthand
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

// Longhand
// const ambientLight = new THREE.AmbientLight();
// ambientLight.color = new THREE.Color(0xffffff)
// ambientLight.intensity = 0.5

scene.add(ambientLight);

const ambientLightFolder = gui.addFolder('Ambient Light Controls');
ambientLightFolder
  .add(ambientLight, 'intensity')
  .min(0)
  .max(1)
  .step(0.01)
  .name('AL Intensity');

ambientLightFolder.addColor(ambientLight, 'color').name('AL Color');
ambientLightFolder.close();

// Directional Light
const directionalLight = new THREE.DirectionalLight(0x00ffffc, 0.3);
directionalLight.position.set(1, 0.25, 0);
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

directionalLightFolder
  .addColor(directionalLight, 'color')
  .name('DL Color');

directionalLightFolder
  .add(directionalLightPosition, 'x', -10, 10)
  .onChange(updateDirectionalLightPosition)
  .name('DL Pos X-Axis');
directionalLightFolder
  .add(directionalLightPosition, 'y', -10, 10)
  .onChange(updateDirectionalLightPosition)
  .name('DL Pos Y-Axis');
directionalLightFolder
  .add(directionalLightPosition, 'z', -10, 10)
  .onChange(updateDirectionalLightPosition)
  .name('DL Pos Z-Axis');

directionalLightFolder.close();

// Hemisphere Light
const hemisphereLight = new THREE.HemisphereLight(0x0ff0000, 0x0000ff, 0.3);
scene.add(hemisphereLight);

const hemisphereLightFolder = gui.addFolder('Hemisphere Light Controls');
hemisphereLightFolder
  .add(hemisphereLight, 'intensity')
  .min(0)
  .max(1)
  .step(0.01)
  .name('HL Intensity');

// skyColor
hemisphereLightFolder
  .addColor(hemisphereLight, 'color')
  .name('HL Sky Color');

// groundColor
hemisphereLightFolder.addColor(hemisphereLight, 'groundColor').name('HL Ground Color');

hemisphereLightFolder.close();

// Point Light
const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2);
pointLight.position.set(1, -0.5, 1);
scene.add(pointLight);

const pointLightPosition = {
  x: directionalLight.position.x,
  y: directionalLight.position.y,
  z: directionalLight.position.z,
};

function updatePointLightPosition() {
  pointLight.position.set(
    pointLightPosition.x,
    pointLightPosition.y,
    pointLightPosition.z
  );
}

const pointLightFolder = gui.addFolder('Point Light Controls');
pointLightFolder
  .add(pointLight, 'intensity')
  .min(0)
  .max(1)
  .step(0.01)
  .name('PL Intensity');

pointLightFolder
  .add(pointLight, 'distance')
  .min(0)
  .max(50)
  .step(0.01)
  .name('PL Distance');

pointLightFolder
  .add(pointLight, 'decay')
  .min(0)
  .max(5)
  .step(0.01)
  .name('PL Decay');

pointLightFolder
  .add(pointLightPosition, 'x', -10, 10)
  .onChange(updatePointLightPosition)
  .name('PL Pos X-Axis');
pointLightFolder
  .add(pointLightPosition, 'y', -10, 10)
  .onChange(updatePointLightPosition)
  .name('PL Pos Y-Axis');
pointLightFolder
  .add(pointLightPosition, 'z', -10, 10)
  .onChange(updatePointLightPosition)
  .name('PL Pos Z-Axis');

pointLightFolder.close();

// Rect Area Light
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 3, 1);
rectAreaLight.position.set(-1.5, 0, 1.5);
rectAreaLight.lookAt(new THREE.Vector3());
scene.add(rectAreaLight);

const rectAreaLightFolder = gui.addFolder('Rect Area Folder');

rectAreaLightFolder
  .add(rectAreaLight, 'intensity')
  .min(0)
  .max(5)
  .step(0.01)
  .name('RAL Intensity');

rectAreaLightFolder
  .add(rectAreaLight, 'width')
  .min(0)
  .max(20)
  .step(0.01)
  .name('RAL Width');

rectAreaLightFolder
  .add(rectAreaLight, 'height')
  .min(0)
  .max(20)
  .step(0.01)
  .name('RAL Height');

rectAreaLightFolder.addColor(rectAreaLight, 'color');

rectAreaLightFolder.close()

// Spot Light
const spotLight = new THREE.SpotLight(
  0x78ff00,
  0.5,
  10,
  Math.PI * 0.1,
  0.25,
  1
);
spotLight.position.set(0, 2, 3);
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
  .name('SL Pos X-Axis');

spotLightTargetControllerX.onChange(function (value) {
  spotLight.target.position.x = value;
});

const spotLightTargetControllerY = spotLightFolder
  .add({ targetY: spotLight.target.position.y }, 'targetY', -10, 5)
  .name('SL Pos Y-Axis');

spotLightTargetControllerY.onChange(function (value) {
  spotLight.target.position.y = value;
});

const spotLightTargetControllerZ = spotLightFolder
  .add({ targetZ: spotLight.target.position.z }, 'targetZ', -10, 5)
  .name('SL Pos Z-Axis');

spotLightTargetControllerZ.onChange(function (value) {
  spotLight.target.position.z = value;
});

spotLightFolder.close();

// Helpers
const hemisphereLightHelper = new THREE.HemisphereLightHelper(
  hemisphereLight,
  0.2
);
hemisphereLightHelper.visible = false; 
scene.add(hemisphereLightHelper);

const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.2
);
directionalLightHelper.visible = false;
scene.add(directionalLightHelper);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
pointLightHelper.visible = false;
scene.add(pointLightHelper);

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
spotLightHelper.visible = false;
scene.add(spotLightHelper);

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
rectAreaLightHelper.visible = false;
scene.add(rectAreaLightHelper);


const helpersFolder = gui.addFolder('Light Helpers');
helpersFolder
  .add(hemisphereLightHelper, 'visible')
  .name('Hemisphere Light Helper');
helpersFolder
  .add(directionalLightHelper, 'visible')
  .name('Directional Light Helper');
helpersFolder.add(pointLightHelper, 'visible').name('Point Light Helper');
helpersFolder.add(spotLightHelper, 'visible').name('Spot Light Helper');
helpersFolder.add(rectAreaLightHelper, 'visible').name('Rect Area Light Helper')

helpersFolder.close()

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
