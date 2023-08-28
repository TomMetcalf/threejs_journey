import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import gsap from 'gsap';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

THREE.ColorManagement.enabled = false;

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// // Axis helper
// const axisHelper = new THREE.AxesHelper()
// scene.add(axisHelper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const matcapsTextures = [
  '/textures/matcaps/1.png',
  '/textures/matcaps/2.png',
  '/textures/matcaps/3.png',
  '/textures/matcaps/4.png',
  '/textures/matcaps/5.png',
  '/textures/matcaps/6.png',
  '/textures/matcaps/7.png',
  '/textures/matcaps/8.png',
];

let matcapTexture = textureLoader.load(matcapsTextures[0]);

const donutsGroup = new THREE.Group();
scene.add(donutsGroup);

/**
 * Fonts
 */
const fontLoader = new FontLoader();
fontLoader.load(
  // resource URL
  'fonts/helvetiker_regular.typeface.json',

  // onLoad callback
  (font) => {
    // do something with the font
    const textGeometry = new TextGeometry('Tom Met Dev', {
      font: font,
      size: 0.5,
      height: 0.2,
      curveSegments: 5,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 4,
    });

    // textGeometry.computeBoundingBox()
    // textGeometry.translate(
    //    - (textGeometry.boundingBox.max.x -0.02) * 0.5,
    //    - (textGeometry.boundingBox.max.y -0.02) * 0.5,
    //    - (textGeometry.boundingBox.max.z -0.03) * 0.5,
    //     )

    textGeometry.center();

    // textGeometry.computeBoundingBox();
    // console.log(textGeometry.boundingBox);

    const material = new THREE.MeshMatcapMaterial({
      matcap: matcapTexture,
    });
    const text = new THREE.Mesh(textGeometry, material);
    scene.add(text);

    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);

    const numDonuts = 200;

    for (let i = 0; i < numDonuts; i++) {
      const donut = new THREE.Mesh(donutGeometry, material);

      donut.position.x = (Math.random() - 0.5) * 10;
      donut.position.y = (Math.random() - 0.5) * 10;
      donut.position.z = (Math.random() - 0.5) * 10;

      donut.rotation.x = Math.random() * Math.PI;
      donut.rotation.y = Math.random() * Math.PI;

      const scale = Math.random();

      donut.scale.set(scale, scale, scale);

      donutsGroup.add(donut);
    }

    // Debug UI
    // gui.add(text.position, 'x', -3, 3, 0.01)
    // gui.add(text.position, 'y', -3, 3, 0.01)
    // gui.add(text.position, 'z', -3, 3, 0.01)

    const parameters = {
      color: 0xffffff,
      spinText: () => {
        gsap.to(text.rotation, {
          duration: 1,
          x: text.rotation.x + Math.PI * 2,
        });
      },
      numDonuts: 200,
    };

    gui
      .add(text.position, 'x')
      .min(-3)
      .max(3)
      .step(0.01)
      .name('Move Text X Axis');
    gui
      .add(text.position, 'y')
      .min(-3)
      .max(3)
      .step(0.01)
      .name('Move Text Y Axis');
    gui
      .add(text.position, 'z')
      .min(-3)
      .max(3)
      .step(0.01)
      .name('Move Text Z Axis');
    gui
      .add(text.rotation, 'x')
      .min(-10)
      .max(10)
      .step(0.01)
      .name('Rotate Text X Axis');
    gui
      .add(text.rotation, 'y')
      .min(-10)
      .max(10)
      .step(0.01)
      .name('Rotate Text Y Axis');
    gui
      .add(text.rotation, 'z')
      .min(-10)
      .max(10)
      .step(0.01)
      .name('Rotate Text Z Axis');
    gui.add(text, 'visible').name('Show / Hide');
    gui
      .addColor(parameters, 'color')
      .name('Color')
      .onChange(() => {
        material.color.set(parameters.color);
      });

    const matcapTextureRange = {
      MatcapIndex: 0,
    };

    gui
      .add(matcapTextureRange, 'MatcapIndex', 0, matcapsTextures.length - 1, 1)
      .step(1)
      .name('Change Style')
      .onChange(() => {
        matcapTexture = textureLoader.load(
          matcapsTextures[matcapTextureRange.MatcapIndex]
        );
        material.matcap = matcapTexture;
        material.needsUpdate = true;
      });
    gui
      .add(parameters, 'numDonuts')
      .min(0)
      .max(500)
      .step(1)
      .name('Number of Donuts')
      .onChange(() => {
        const currentDonuts = donutsGroup.children.length;
        const targetDonuts = parameters.numDonuts;

        if (currentDonuts < targetDonuts) {
          const numToAdd = targetDonuts - currentDonuts;
          for (let i = 0; i < numToAdd; i++) {
            const donut = new THREE.Mesh(donutGeometry, material);

            donut.position.x = (Math.random() - 0.5) * 10;
            donut.position.y = (Math.random() - 0.5) * 10;
            donut.position.z = (Math.random() - 0.5) * 10;

            donut.rotation.x = Math.random() * Math.PI;
            donut.rotation.y = Math.random() * Math.PI;

            const scale = Math.random();
            donut.scale.set(scale, scale, scale);

            donutsGroup.add(donut);
          }
        } else if (currentDonuts > targetDonuts) {
          const numToRemove = currentDonuts - targetDonuts;
          for (let i = 0; i < numToRemove; i++) {
            donutsGroup.remove(donutsGroup.children[0]);
          }
        }
      });

      gui.add(parameters, 'spinText').name('Press to Spin Text');
  },

  // onProgress callback
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
  },

  // onError callback
  function (err) {
    console.log('An error happened');
  }
);

// /**
//  * Object
//  */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )

// scene.add(cube)

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
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 3;
scene.add(camera);

gui
  .add(camera.position, 'x')
  .min(-3)
  .max(3)
  .step(0.01)
  .name('Move Camera X Axis');
gui
  .add(camera.position, 'y')
  .min(-3)
  .max(3)
  .step(0.01)
  .name('Move Camera Y Axis');

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

const spinSpeed = 0.05;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Calculate the new rotation value based on elapsed time and spin speed
  const newRotationY = elapsedTime * spinSpeed;

  // Set the rotation value of the donutsGroup to the new rotation value
  donutsGroup.rotation.y = newRotationY;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
