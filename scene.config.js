// SCENE
window.scene = new THREE.Scene()
var container, scene, camera, renderer, controls, stats

// INITIALIZE
(function () {
  scene = window.scene

  // CAMERA
  var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight
  var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000
  camera = new THREE.OrthographicCamera(
    -SCREEN_WIDTH / 2, // left
    SCREEN_WIDTH / 2, // right
    SCREEN_HEIGHT / 2, // top
    -SCREEN_HEIGHT / 2, // bottom
    NEAR, // near
    FAR // far
  )
  scene.add(camera)
  camera.position.set(0,-500, 400)
  camera.lookAt(scene.position)

  // RENDERER
  if ( Detector.webgl ) {
    renderer = new THREE.WebGLRenderer({antialias:true})
  } else {
    renderer = new THREE.CanvasRenderer()
  }
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)
  renderer.setClearColor(new THREE.Color(0xf7f8f9, 1.0))
  container = document.getElementById( 'ThreeJS' )
  container.appendChild(renderer.domElement)

  // CONTROLS
  controls = new THREE.OrbitControls(camera, renderer.domElement)

  // STATS
  stats = new Stats()
  stats.domElement.style.position = 'absolute'
  stats.domElement.style.bottom = '0px'
  stats.domElement.style.zIndex = 100
  container.appendChild(stats.domElement)

  // LIGHT
  var light = new THREE.DirectionalLight(0x444444, 1)
  light.position.set(0, 0, 1).normalize()
  scene.add(light)

  // GRID
  var grid1 = new THREE.GridHelper(SCREEN_WIDTH / 2, 6)
  grid1.rotation.x = Math.PI / 2
  grid1.setColors(0x444444, 0xe1e2e3)
  scene.add(grid1)

  var grid2 = new THREE.GridHelper(SCREEN_WIDTH / 2, 30)
  grid2.rotation.x = Math.PI / 2
  grid2.setColors(0x444444, 0xc1c2c3)
  scene.add(grid2)
})()
animate()

function animate () {
  requestAnimationFrame(animate)
  render()
  update()
}

function update () {
  controls.update()
  stats.update()
}

function render () {
  renderer.render(scene, camera)
}