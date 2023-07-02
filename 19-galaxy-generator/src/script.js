import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { Material, PointsMaterial } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({width: 360})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Galaxy
 */

const parameters = {}
parameters.count = 100000
parameters.size = 0.01
parameters.radius = 5
parameters.branches = 3
parameters.spin = 2
parameters.randomness = 0.2
parameters.randomnessPower = 3
parameters.insideColor = '#ff6030'
parameters.outsideColor = '#1b3984'

let geometry = null
let material = null
let points = null

const generateGalaxy = () => {
/**
 * Destroy old galaxy
 */
	if(points !== null) {
		geometry.dispose()
		material.dispose()
		scene.remove(points)
	}
  /**
   * Geometry
   */
  geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(parameters.count * 3)
  const colors = new Float32Array(parameters.count * 3) // rgb

  const colorInside = new THREE.Color(parameters.insideColor)
  const colorOutside = new THREE.Color(parameters.outsideColor)

  for(let i = 0; i < parameters.count; i++){     
  	const i3 = i * 3

    //Position
    const radius = Math.random() * parameters.radius
    //the further away fro mthe center , the more spin
    const spinAngle = radius * parameters.spin
    //(i % parameters.branches) / parameters.branches to keep the number between 0 & 1
    const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2

    const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random()< 0.5 ? 1 : -1)
    const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random()< 0.5 ? 1 : -1)
    const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random()< 0.5 ? 1 : -1)

    //to center Math.random() - 0.5
    positions[i3] = Math.cos(branchAngle + spinAngle) * radius  + randomX//x 
    positions[i3 + 1] = randomY//y
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ //z

    //Color
    const mixedColor = colorInside.clone()
    mixedColor.lerp(colorOutside, radius / parameters.radius)
    colors[i3] = mixedColor.r
    colors[i3 + 1] =mixedColor.g
    colors[i3 + 2] = mixedColor.b
  }
    
  geometry.setAttribute(
    'position', new THREE.BufferAttribute(positions, 3),
  )
  geometry.setAttribute(
    'color', new THREE.BufferAttribute(colors, 3),
  )
        
  /**
   * Material
   */
   material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending, //brightens overlapping particles
    vertexColors: true,
  })
        
  /**
   * Points
   */
  points = new THREE.Points(geometry, material)
  scene.add(points)
}
        
generateGalaxy()

gui.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy)
gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(parameters, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)

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
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 3
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

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Update particles
    points.rotation.y = elapsedTime  * 0.3
    points.rotation.x = elapsedTime  * 0.1


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()