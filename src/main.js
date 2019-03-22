import * as THREE from 'three';
import * as OrbitControls from 'orbit-controls-es6';
import sandImage from './textures/sand01.png';

function setupSlope() {
    // ---------- Setup Geometry ----------
    let widthSegments = 10;
    let geometry = new THREE.PlaneBufferGeometry(30, 60, widthSegments, 15);
    let vertices = geometry.attributes.position.array;
    for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
        let z = (1.0 - (i % (widthSegments + 1) / (widthSegments + 1))) - 0.5;
        z += (Math.random() * 2.0 - 1.0) * 0.2;
        vertices[j + 2] = z;
    }

    // ---------- Image texture ----------
    let loader = new THREE.ImageBitmapLoader();

    // load a image resource
    loader.load(
        // resource URL
        sandImage,
        // onLoad callback
        function (imageBitmap) {
            let texture = new THREE.CanvasTexture(imageBitmap);
            let material = new THREE.MeshBasicMaterial({map: texture});
            scene.add(new THREE.Mesh(geometry, material));
        },
        // onProgress callback currently not supported
        undefined,
        // onError callback
        function (err) {
            console.log('An error happened:' + err);
        }
    );

    // ---------- Wireframe texture ----------
    let wireframe = new THREE.WireframeGeometry(geometry);
    let line = new THREE.LineSegments(wireframe);
    line.material.depthTest = false;
    line.material.opacity = 1;
    line.material.transparent = true;
    scene.add(line);
}

let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 80;

let orbitControls = new OrbitControls(camera);
orbitControls.minPolarAngle = THREE.Math.degToRad(180 - 35);
orbitControls.maxPolarAngle = THREE.Math.degToRad(180 - 35);
orbitControls.minAzimuthAngle = 0;
orbitControls.maxAzimuthAngle = 0;
orbitControls.update();

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

setupSlope();

let animate = function () {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
};

animate();

