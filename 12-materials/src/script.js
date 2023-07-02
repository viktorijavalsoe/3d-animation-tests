import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Debug
 */

 const gui = new GUI();

/**
 * Textures
 */

const textureLoader = new THREE.TextureLoader()
//for environment loaders 
const cubeTextureLoader = new THREE.CubeTextureLoader()

const doorColorTexture = textureLoader.load("textures/door/color.jpg")
const alphaDoorTexture = textureLoader.load("textures/door/alpha.jpg")
const ambientOcclusionDoorTexture = textureLoader.load("textures/door/ambientOcclusion.jpg")
const roughnessDoorTexture = textureLoader.load("textures/door/roughness.jpg")
const metalnessDoorTexture = textureLoader.load("textures/door/metalness.jpg")
const heightDoorTexture = textureLoader.load("textures/door/height.jpg")
const normalDoorTexture = textureLoader.load("textures/door/normal.jpg")
const matCapsTexture = textureLoader.load("textures/matcaps/4.png")
const gradientTexture = textureLoader.load("textures/gradients/3.jpg")
gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.magFilter = THREE.NearestFilter
//can deactivate because we have NearestFilter
gradientTexture.generateMipmaps = false

const environmentMapTexture = cubeTextureLoader.load([
    //the order of px ... py are important
    'textures/environmentMaps/4/px.png',
    'textures/environmentMaps/4/nx.png',
    'textures/environmentMaps/4/py.png',
    'textures/environmentMaps/4/ny.png',
    'textures/environmentMaps/4/pz.png',
    'textures/environmentMaps/4/py.png',
])




/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Material 
 * */

// MeshBasicMaterial
// const material = new THREE.MeshBasicMaterial()
// material.map = doorColorTexture
// material.color.set('#ff00ff')
// material.wireframe = true
// material.opacity = 0.5
// material.transparent = true
// material.alphaMap = alphaDoorTexture
// material.side = THREE.BackSide

// MeshNormalMaterial
// const material = new THREE.MeshNormalMaterial()
// material.wireframe = true
// material.flatShading = true

// MeshMatcapMaterial
// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matCapsTexture

// MeshDepthMaterial
// colored geometry in white when close and black when far
// const material = new THREE.MeshDepthMaterial()

// MeshLambertMaterials
// very performant material
// const material = new THREE.MeshLambertMaterial({color: 'blue'})

// MeshPhongMaterial
// less performant, but has some reflection comparing to MeshLambertMaterials
// const material = new THREE.MeshPhongMaterial({color: 'hotpink'})
// material.shininess = 100
// material.specular = new THREE.Color('pink')

// MeshToonMaterial
// cartoonish effect
// const material = new THREE.MeshToonMaterial()
// material.gradientMap = gradientTexture

// MeshStandardMaterial
// const material = new THREE.MeshStandardMaterial()
//those are default values for metalness and roughness, should not mix if maps are used for those values
// door example
// material.metalness = 0
// material.roughness = 1
// material.map = doorColorTexture
// material.side = THREE.DoubleSide
// material.aoMap = ambientOcclusionDoorTexture
// material.aoMapIntensity = 1
// material.displacementMap = heightDoorTexture
// material.displacementScale = 0.05
// material.roughnessMap= roughnessDoorTexture
// material.metalnessMap = metalnessDoorTexture
// material.normalMap = normalDoorTexture
// material.normalScale.set(0.5, 0.5)
// material.alphaMap = alphaDoorTexture
// if you want to use alpha, transperacy must be set to true
// material.transparent = true

// environment example
const material = new THREE.MeshStandardMaterial()
material.metalness = 0.8
material.roughness = 0.01
material.envMap = environmentMapTexture

gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)
gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.001)
gui.add(material, 'displacementScale').min(0).max(10).step(0.001)


// MeshPhysicalMaterisl
// used to create clear coat
const shinyMaterial = new THREE.MeshPhysicalMaterial({color: 'blue'})
shinyMaterial.reflectivity = 0.6
shinyMaterial.clearcoat = 0.6
shinyMaterial.clearcoatRoughness = 0.6

// gui.add(shinyMaterial, 'reflectivity').min(0).max(1).step(0.001)
// gui.add(shinyMaterial, 'clearcoat').min(0).max(1).step(0.001)
// gui.add(shinyMaterial, 'clearcoatRoughness').min(0).max(10).step(0.001)

/**
 * Objects
 */

const sphereBufferGeometry = new THREE.SphereBufferGeometry(0.5, 64, 64)
const planeGeometry = new THREE.PlaneGeometry(1, 1, 64, 64)
const torusBufferGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 64, 128)

const sphere = new THREE.Mesh( sphereBufferGeometry, material)
sphere.position.x = - 1.5
sphere.geometry.setAttribute(
    'uv2', 
    new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
)

const plane = new THREE.Mesh( planeGeometry, material)
plane.geometry.setAttribute(
    'uv2', 
    new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
)

const torus = new THREE.Mesh(torusBufferGeometry, material)
torus.position.x = 1.5
torus.geometry.setAttribute(
    'uv2', 
    new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
)

scene.add(
    sphere, 
    plane, 
    torus
    )

/**
 * Light
 */

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)
const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 1
pointLight.position.y = 2
pointLight.position.z = 3
scene.add(pointLight)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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

    //Update objects
    sphere.rotation.y = elapsedTime * 0.1
    plane.rotation.y = elapsedTime * 0.1
    torus.rotation.y = elapsedTime * 0.1
    sphere.rotation.x = elapsedTime * 0.15
    plane.rotation.x = elapsedTime * 0.15
    torus.rotation.x = elapsedTime * 0.15

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()