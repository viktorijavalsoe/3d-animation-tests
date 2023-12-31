
const scene = new THREE.Scene()

// Red cube
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({color: '#ff0000'})
const cube = new THREE.Mesh(geometry, material)

scene.add(cube)

// Sizes
const sizes = {
    width: 800,
    height: 600.
}

// Camera
// vertical field of view, aspect ratio
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
camera.position.x =  -1
scene.add(camera)

// Renderer 
const canvas = document.querySelector('.webgl')

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)