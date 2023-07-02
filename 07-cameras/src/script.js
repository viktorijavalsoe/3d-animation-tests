import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

console.log(OrbitControls);

/**
 * Cursor
 */
const cursor = {
    x: 0,
    y: 0,
}

window.addEventListener('mousemove', (event) => {
    // divide by sizes to limit the span between 0 and 1
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = -(event.clientY / sizes.height - 0.5)
})

/**
 * Base Canvas 
 */
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Scene
const scene = new THREE.Scene()

// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 'hotpink' })
)
scene.add(mesh)

// Camera
const aspectRatio = sizes.width / sizes.height
// vertical field of view in degrees, aspect ratio, near and far
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000)
camera.position.z = 3
scene.add(camera)

//Controls 
const controls = new OrbitControls(camera, canvas )
controls.enableDamping = true
// controls.autoRotate = true

// to update camera point of view 
// controls.target.y = 1
controls.update()

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    // Update camera
    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2
    // camera.position.y = cursor.y * 3
    // camera.lookAt(mesh.position)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)

    //Update Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

}

tick()