import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)

/**
 * Raycaster
 */

const raycaster = new THREE.Raycaster()
// const rayOrigin = new  THREE.Vector3(-3, 0, 0)
// // needs to be normalised
// const rayDirection = new  THREE.Vector3(10, 0, 0)
// // keeps the same direction but normaises to lenght 1
// rayDirection.normalize()
// raycaster.set(rayOrigin, rayDirection)

// const intersect = raycaster.intersectObject(object2)
// console.log(intersect);
// const intersects = raycaster.intersectObjects([object1, object2, object3])
// console.log(intersects);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Mouse
 */
const cursor = new THREE.Vector2()
// can add event listener to canvas only, but not necessary if its covering the whole widow
window.addEventListener('mousemove', (event) => {
    // to get value between - 1 and 1
    cursor.x = event.clientX /sizes.width * 2 - 1
    // 1 should be at teh top, and -1 at the bottom
    cursor.y = -(event.clientY /sizes.height * 2 - 1)
})
window.addEventListener('click', () => {
if(currentIntersect){
    switch(currentIntersect.object){
        case object1:
            console.log('objects 1');
            break
        case object2:
            console.log('objects 2');
            break
        case object3:
            console.log('objects 3');
            break
    }
   
}
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

let currentIntersect = null

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    //Animate objects
    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
    object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
    object3.position.y = Math.sin(elapsedTime * 1.2) * 1.5

    //Cast a ray
    // const rayOrigin = new THREE.Vector3(-3, 0, 0)
    // const rayDirection = new THREE.Vector3(1, 0, 0)
    // rayDirection.normalize()
    // raycaster.set(rayOrigin, rayDirection)

    // const objects = [object1, object2, object3]
    // const intersects = raycaster.intersectObjects(objects)
   
    // objects.map(object => {
    //     object.material.color.set('red')
    // })
    
    // intersects.map(intersect => {
    //     intersect.object.material.color.set('hotpink')
    // })

    // Cursor interaction with the raycaster
    raycaster.setFromCamera(cursor, camera)

    const objects = [object1, object2, object3]
    const intersects = raycaster.intersectObjects(objects)
   
    objects.map(object => {
        object.material.color.set('red')
    })

     intersects.map(intersect => {
        intersect.object.material.color.set('hotpink')
    })

    if(intersects.length){
        if (currentIntersect === null){
            // console.log('mouse enter');
        }
            currentIntersect = intersects[0]
    } else {
        if(currentIntersect){
                // console.log('mouse leave');
        }
        currentIntersect = null

    }

    //Witness viable

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()