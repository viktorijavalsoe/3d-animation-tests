import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { Float16BufferAttribute } from 'three'

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
 * Fog
 */
 const fog = new THREE.Fog('#262837', 1, 15) //color, near, afr
 scene.fog = fog

/**
 * Textures
 */
const loadingManager = new THREE.LoadingManager()
loadingManager.onError = ()=> {
    console.log('error loading image');
}
const textureLoader = new THREE.TextureLoader(loadingManager)
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const bricksTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')

const grassTexture = textureLoader.load('/textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')

const glassColorTexture = textureLoader.load('/textures/glass/Glass_Window_001_basecolor.jpg')
const glassRoughnessTexture = textureLoader.load('/textures/glass/Glass_Window_001_roughness.jpg')
const glassAmbientOcclusionTexture = textureLoader.load('/textures/glass/Glass_Window_001_roughness.jpg')
const glassAlphaTexture = textureLoader.load('/textures/glass/Glass_Window_001_glass.jpg')
const glassHeightTexture = textureLoader.load('/textures/glass/Glass_Window_001_height.png')
const glassNormalTexture = textureLoader.load('/textures/glass/Glass_Window_001_normal')

const windowColorTexture = textureLoader.load('/textures/window/Window_001_basecolor.jpg')
const windowAmbientOcclusionTexture = textureLoader.load('/textures/window/Glass_Window_001_ambientOcclusion.jpg')
const windowAlphaTexture = textureLoader.load('/textures/window/Window_001_opacity.jpg')
const windowHeightTexture = textureLoader.load('/textures/window/Window_001_height.png')
const windowNormalTexture = textureLoader.load('/textures/window/Window_001_normal.jpg')
const windowRoughnessTexture = textureLoader.load('/textures/window/Window_001_roughness.jpg')
const windowMetalnessTexture = textureLoader.load('/textures/glass/Window_001_metallic.jpg')


//decrease size of texture
grassTexture.repeat.set(8, 8)
grassAmbientOcclusionTexture.repeat.set(8, 8)
grassNormalTexture.repeat.set(8, 8)
grassRoughnessTexture.repeat.set(8, 8)

grassTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping

grassTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

/**
 * House
 */

//Group
const house = new THREE.Group()
scene.add(house)

// Walls
const walls = new THREE.Mesh( 
    new THREE.BoxGeometry(4, 2.5, 4),     
    new THREE.MeshStandardMaterial({ 
        map: bricksTexture, 
        aoMap: bricksAmbientOcclusionTexture, // needs uv 
        normalMap: bricksNormalTexture,
        roughnessMap: bricksRoughnessTexture
    })
)
walls.geometry.setAttribute(
    'uv2', 
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)) //need this for aoMap

//since the house is positioned in the middle of the floor
walls.position.y = 2.5 / 2
house.add(walls)

// Roof
const roof = new THREE.Mesh(
    new THREE.ConeBufferGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({ color: '#b35f45' })
)
roof.position.y = 3
roof.rotation.y =  Math.PI * 0.25
house.add(roof)

//Door
const door = new THREE.Mesh( 
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),  
    new THREE.MeshStandardMaterial({ 
        map: doorColorTexture, 
        alphaMap: doorAlphaTexture, 
        transparent: true, 
        aoMap: doorAmbientOcclusionTexture, // masking 
        displacementMap: doorHeightTexture, // 3d relief
        displacementScale: 0.15,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture //shininess of the dooe 
       
     }))

door.geometry.setAttribute(
    'uv2', 
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)) //need this for aoMap

door.position.y = 1
door.position.z = 2 + 0.01
house.add(door)

//Window
const houseWindow1 = new THREE.Mesh(
    new THREE.PlaneGeometry(1.2, 1.5, 100, 100),
    new THREE.MeshStandardMaterial({ 
        map: windowColorTexture, 
        aoMap: windowAmbientOcclusionTexture,
        alphaMap: windowAlphaTexture, 
        transparent: true,
        displacementMap: windowHeightTexture, // 3d relief
        displacementScale: 0.15,
        normalMap: windowNormalTexture,
        metalnessMap: windowMetalnessTexture,
        roughnessMap: windowRoughnessTexture //shininess of the dooe 
    })
)

houseWindow1.geometry.setAttribute(
    'uv2', 
    new THREE.Float32BufferAttribute(houseWindow1.geometry.attributes.uv.array, 2)) //need this for aoMap

houseWindow1.position.x = 2 + 0.01
houseWindow1.position.y = 1.5
houseWindow1.position.z = 0.8
houseWindow1.rotation.y = Math.PI /2

const houseWindow2 = new THREE.Mesh(
    new THREE.PlaneGeometry(1.2, 1.5, 100, 100),
    new THREE.MeshStandardMaterial({ 
        map: windowColorTexture, 
        aoMap: windowAmbientOcclusionTexture,
        alphaMap: windowAlphaTexture, 
        transparent: true,
        displacementMap: windowHeightTexture, // 3d relief
        displacementScale: 0.15,
        normalMap: windowNormalTexture,
        metalnessMap: windowMetalnessTexture,
        roughnessMap: windowRoughnessTexture //shininess of the dooe 
    })
)

houseWindow2.geometry.setAttribute(
    'uv2', 
    new THREE.Float32BufferAttribute(houseWindow2.geometry.attributes.uv.array, 2))
houseWindow2.position.x = 2 + 0.02
houseWindow2.position.y = 1.5
houseWindow2.position.z = -0.8
houseWindow2.rotation.y = Math.PI /2

house.add(houseWindow1, houseWindow2)

const glass1 = new THREE.Mesh(
    new THREE.PlaneGeometry(0.9, 1, 100, 100),
    new THREE.MeshStandardMaterial({ 
        map: glassColorTexture,
        aoMap: glassAmbientOcclusionTexture,
        // alphaMap: glassAlphaTexture, 
        // transparent: true,
        displacementMap: glassHeightTexture, // 3d relief
        displacementScale: 0.02,
        normalMap: glassNormalTexture,
        roughnessMap: glassRoughnessTexture
     })
)
glass1.position.x = 2 + 0.01
glass1.position.y = 1.5
glass1.position.z = -0.8
glass1.rotation.y = Math.PI /2

glass1.geometry.setAttribute(
    'uv2', 
    new THREE.Float32BufferAttribute(glass1.geometry.attributes.uv.array, 2))

const glass2 = new THREE.Mesh(
    new THREE.PlaneGeometry(0.9, 1, 100, 100),
    new THREE.MeshStandardMaterial({ 
        map: glassColorTexture,
        aoMap: glassAmbientOcclusionTexture,
        // alphaMap: glassAlphaTexture, 
        // transparent: true,
        displacementMap: glassHeightTexture, // 3d relief
        displacementScale: 0.02,
        normalMap: glassNormalTexture,
        roughnessMap: glassRoughnessTexture
     })
)
glass2.position.x = 2 + 0.02
glass2.position.y = 1.5
glass2.position.z = 0.8
glass2.rotation.y = Math.PI /2

glass2.geometry.setAttribute(
    'uv2', 
    new THREE.Float32BufferAttribute(glass2.geometry.attributes.uv.array, 2))

house.add(glass1, glass2)


// Bushes
const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({color: '#89c854'})
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.8, 0.1, 2.2)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1, 0.05, 2.6)

house.add(bush1, bush2, bush3, bush4)

// Graveyards
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' })

for(let i = 0; i < 30; i++)
{
    const angle = Math.random() * Math.PI * 2 // Random angle
    const radius = 3 + Math.random() * 7
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    // Create the mesh
    const grave = new THREE.Mesh(graveGeometry, graveMaterial)

    // Position
    grave.position.set(x, 0.3, z)   
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.rotation.z = (Math.random() - 0.5) * 0.4
    grave.castShadow = true

    // Add to the graves container
    graves.add(grave)
}


// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ 
        map: grassTexture, 
        aoMap: grassAmbientOcclusionTexture, 
        normalMap: grassNormalTexture, 
        roughnessMap: grassRoughnessTexture 
    })
)

floor.geometry.setAttribute(
    'uv2', 
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)) //need this for aoMap
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.5)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

//Door Light
const doorLight = new THREE.PointLight('#ff7d46', 1, 7) //color, intendsity, fading
doorLight.position.set(0, 2.2, 2.7)
house.add(doorLight)


/**
 * Ghosts
 */

const ghost1 = new THREE.PointLight('#ff00ff', 2, 3)
const ghost2 = new THREE.PointLight('#00ffff', 2, 3)
const ghost3 = new THREE.PointLight('#ffff00', 2, 3)

scene.add(ghost1, ghost2, ghost3)

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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
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

//set color to backgroudn
renderer.setClearColor('#262837')

/**
 * Shadowa
 */
renderer.shadowMap.enabled = true
//smother type of shadow
renderer.shadowMap.type = THREE.PCFShadowMap

moonLight.castShadow = true
doorLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true

floor.receiveShadow = true

//optimise shadows for performance

doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.size = 7

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.size = 7

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.size = 7

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.size = 7



/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //Updte Ghost
    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghost1Angle) * 4 // radius
    ghost1.position.z = Math.sin(ghost1Angle) * 4
    ghost1.position.y = Math.sin(elapsedTime * 3) 

    const ghost2Angle = - elapsedTime * 0.32
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 6
    ghost2.position.y = Math.sin(elapsedTime * 4)  + Math.sin(elapsedTime * 2.5) 

    const ghost3Angle = - elapsedTime * 0.18
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
    ghost3.position.y = Math.sin(elapsedTime * 5)  + Math.sin(elapsedTime * 2) 

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()