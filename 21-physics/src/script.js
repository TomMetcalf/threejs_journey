import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import * as CANNON from 'cannon-es';

THREE.ColorManagement.enabled = false;

/**
 * Debug
 */
const gui = new dat.GUI();

const debugObject = {};

debugObject.createSphere = () => {
  createSphere(Math.random() * 0.5, {
    x: (Math.random() - 0.5) * 3,
    y: 3,
    z: (Math.random() - 0.5) * 3,
  });
};

gui.add(debugObject, 'createSphere').name('Create a Ball');

debugObject.createBox = () => {
  createBox(Math.random(), Math.random(), Math.random(), {
    x: (Math.random() - 0.5) * 3,
    y: 3,
    z: (Math.random() - 0.5) * 3,
  });
};

gui.add(debugObject, 'createBox').name('Create a Box');

debugObject.reset = () => {
  // Remove
  for (const object of objectsToUpdate) {
    // Remove body
    object.body.removeEventListener('collide', playSound);
    world.removeBody(object.body);

    // Remove mesh
    scene.remove(object.mesh);
  }
  objectsToUpdate.splice(0, objectsToUpdate.length);
};

gui.add(debugObject, 'reset').name('Remove Objects');

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Sounds
 */
const hitSound = new Audio('/sounds/hit.mp3');
const bubbleSound = new Audio('/sounds/bubble.mp3');
const bounceSound = new Audio('/sounds/bounce.mp3');

const playSound = (collision, material, object) => {
  const impactStrength = collision.contact.getImpactVelocityAlongNormal();

  const maxImpactStrength = 10;
  const maxVolume = 1.0;

  // Calculate a volume scale factor based on the size of the object
  const sizeScaleFactor = Math.min(
    object.scale.x,
    object.scale.y,
    object.scale.z
  );

  // Adjust the volume based on impact strength
  const volume =
    Math.min(impactStrength / maxImpactStrength, maxVolume) * sizeScaleFactor;

  if (impactStrength > 0.7) {
    if (material === ballMaterial) {
      const adjustedVolume = volume * 0.5;
      bounceSound.volume = adjustedVolume;
      bounceSound.currentTime = 0;
      bounceSound.play();
    } else if (material === cubeMaterial) {
      hitSound.volume = volume;
      hitSound.currentTime = 0;
      hitSound.play();
    }
  }
};

const playBubbleSound = () => {
  bubbleSound.volume = 0.6;
  bubbleSound.currentTime = 0;
  bubbleSound.play();
};

// Random color
function getRandomColor() {
  const color = new THREE.Color();
  color.setRGB(Math.random(), Math.random(), Math.random());
  return color;
}

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
  '/textures/environmentMaps/0/px.png',
  '/textures/environmentMaps/0/nx.png',
  '/textures/environmentMaps/0/py.png',
  '/textures/environmentMaps/0/ny.png',
  '/textures/environmentMaps/0/pz.png',
  '/textures/environmentMaps/0/nz.png',
]);

/**
 * Physics
 */
// World
const world = new CANNON.World();
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;
world.gravity.set(0, -9.82, 0);

// Materials
const floorMaterial = new CANNON.Material('floor');
const ballMaterial = new CANNON.Material('ball');
const cubeMaterial = new CANNON.Material('cube');

const floorBallContactMaterial = new CANNON.ContactMaterial(
  floorMaterial,
  ballMaterial,
  {
    friction: 0.1,
    restitution: 0.7,
  }
);
world.addContactMaterial(floorBallContactMaterial);

const floorCubeContactMaterial = new CANNON.ContactMaterial(
  floorMaterial,
  cubeMaterial,
  {
    friction: 0.1,
    restitution: 0.3,
  }
);
world.addContactMaterial(floorCubeContactMaterial);

// const defaultMaterial = new CANNON.Material('default');

// const defaultContactMaterial = new CANNON.ContactMaterial(
//   defaultMaterial,
//   defaultMaterial,
//   {
//     friction: 0.1,
//     restitution: 0.7,
//   }
// );
// world.addContactMaterial(defaultContactMaterial);
// world.defaultContactMaterial = defaultContactMaterial;

// Sphere
// const sphereShape = new CANNON.Sphere(0.5)
// const sphereBody = new CANNON.Body({
//     mass: 1,
//     position: new CANNON.Vec3(0, 3, 0),
//     shape: sphereShape,
// })
// sphereBody.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0, 0, 0))
// world.addBody(sphereBody)

// Floor
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body();
floorBody.material = floorMaterial;
floorBody.mass = 0;
floorBody.addShape(floorShape);
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
world.addBody(floorBody);

/**
 * Test sphere
 */
// const sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(0.5, 32, 32),
//     new THREE.MeshStandardMaterial({
//         metalness: 0.3,
//         roughness: 0.4,
//         envMap: environmentMapTexture,
//         envMapIntensity: 0.5
//     })
// )
// sphere.castShadow = true
// sphere.position.y = 0.5
// scene.add(sphere)

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: '#777777',
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

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
camera.position.set(-3, 3, 3);
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Utils
 */
const objectsToUpdate = [];

// Sphere
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);

const createSphere = (radius, position) => {
  // Three.js Mesh
  const randomColor = getRandomColor();
  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: randomColor,
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
  });
  const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  mesh.scale.set(radius, radius, radius);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  // Cannon.js body
  const shape = new CANNON.Sphere(radius);
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape,
    material: ballMaterial,
  });
  body.position.copy(position);
  body.addEventListener('collide', (e) => playSound(e, ballMaterial, mesh));
  world.addBody(body);

  // Save objects to update
  objectsToUpdate.push({
    mesh: mesh,
    body: body,
  });
};

// createSphere(0.5, { x: 0, y: 3, z: 0 });

// Box
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

const createBox = (width, height, depth, position) => {
  const randomColor = getRandomColor();
  const boxMaterial = new THREE.MeshStandardMaterial({
    color: randomColor,
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
  });
  // Three.js Mesh
  const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
  mesh.scale.set(width, height, depth);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  // Cannon.js body
  const shape = new CANNON.Box(
    new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5)
  );
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape,
    material: cubeMaterial,
  });
  body.position.copy(position);
  body.addEventListener('collide', (e) => playSound(e, cubeMaterial, mesh));
  world.addBody(body);

  // Save objects to update
  objectsToUpdate.push({
    mesh: mesh,
    body: body,
  });
};

function isSphereOutsideBounds(sphere) {
  const spherePosition = sphere.body.position;
  const bounds = 5;

  return (
    spherePosition.x < -bounds ||
    spherePosition.x > bounds ||
    spherePosition.z < -bounds ||
    spherePosition.z > bounds
  );
}

/**
 * Animate
 */
const clock = new THREE.Clock();
let oldElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  // Update physics world
  world.step(1 / 60, deltaTime, 3);

  for (let i = objectsToUpdate.length - 1; i >= 0; i--) {
    const object = objectsToUpdate[i];
    object.mesh.position.copy(object.body.position);
    object.mesh.quaternion.copy(object.body.quaternion);

    if (isSphereOutsideBounds(object)) {
      playBubbleSound();
      // Remove body
      object.body.removeEventListener('collide', playSound);
      world.removeBody(object.body);

      // Remove mesh
      scene.remove(object.mesh);

      // Remove the object from the objectsToUpdate array
      objectsToUpdate.splice(i, 1);
    }
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
