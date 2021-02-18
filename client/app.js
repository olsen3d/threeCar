console.log('app.js here')

//import * as THREE from '/three/build/three.module';
import * as THREE from 'https://unpkg.com/three/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'https://unpkg.com/three/examples/jsm/loaders/GLTFLoader.js'
//console.log(GLTFLoader)


let camera, scene, renderer;
let geometry, material, mesh;
let controls

init()
animate()

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
})

renderer.setClearColor('#555555')

const texture = new THREE.TextureLoader().load( '../src/brick.jpg' )
const materialBrick = new THREE.MeshBasicMaterial( { map: texture } )

const loader = new GLTFLoader();
loader.load( '../src/ingenuity.glb', function ( gltf ) {
  var model = gltf.scene;
//var newMaterial = new THREE.MeshStandardMaterial({color: 0xff0000});
model.traverse((o) => {
  if (o.isMesh) {
    //o.material = materialBrick
    o.castShadow = true
  }
});
	scene.add( gltf.scene );
}, undefined, function ( error ) {
	console.error( error );
} )

const dirLight = new THREE.DirectionalLight( 0xffffff );
				dirLight.position.set( - 3, 10, - 10 );
				dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 1024
        dirLight.shadow.mapSize.height = 1024
				dirLight.shadow.camera.top = 1;
				dirLight.shadow.camera.bottom = -1;
				dirLight.shadow.camera.left = -1;
				dirLight.shadow.camera.right = 1;
				dirLight.shadow.camera.near = 13;
				dirLight.shadow.camera.far = 20;
				scene.add( dirLight );

        const cameraHelper = new THREE.CameraHelper(dirLight.shadow.camera);
        scene.add(cameraHelper)

const ambientLight = new THREE.AmbientLight( 0xffffff)
scene.add(ambientLight)

const ground = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshLambertMaterial( { color: 0x999999, depthWrite: false } ) );
ground.rotation.x = - Math.PI / 2;
ground.receiveShadow = true;
scene.add( ground );


function init() {

	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
	camera.position.set(1, 0.5, 0.5)

	scene = new THREE.Scene()

	geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
	material = new THREE.MeshNormalMaterial();

	mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.shadowMap.enabled = true
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

  const controls = new OrbitControls(camera, renderer.domElement)

  controls.update()

}

function animation( time ) {

	mesh.rotation.x = time / 2000;
	mesh.rotation.y = time / 1000;

	renderer.render( scene, camera );

}

function animate() {

  requestAnimationFrame( animate );

  //controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

  render();

}

function render() {

  renderer.render( scene, camera );

}
