import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh);

// Position - Vector3
// You can either change individual values

// mesh.position.x = 0.7
// mesh.position.y = -0.6;
// mesh.position.z = 1;

// or all three using .set
mesh.position.set(0.7, -0.6, 1)

// Scale  - Vector3
// You can either change individual values
// mesh.scale.x = 2
// mesh.scale.y = 0.5
// mesh.scale.z = 0.5

// or all three using .set
mesh.scale.set(2, 0.5, 0.5)

// Rotation - Euler
// Reorder - this needs to be done before changing the values 
mesh.rotation.reorder('YXZ')

// mesh.rotation.x = 3.14159 // PI
// mesh.rotation.y = Math.PI // PI
// mesh.rotation.z = 1;
mesh.rotation.set(0.25, 0.25, 0.25)


// Axes helper
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

/*
red   line = positive x
green line = positive y
blue  line = positive z
*/

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
// camera.position.y = 1
// camera.position.x = 1
scene.add(camera)

camera.lookAt(mesh.position)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)