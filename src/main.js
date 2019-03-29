import * as THREE from 'three';
import * as OrbitControls from 'orbit-controls-es6';
import {Water} from "./water";
import {Slope} from "./slope";

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

let slope = new Slope(0, 0, 40, 40);
slope.generateMesh(scene);

let water = new Water(0, 0, 80, 40);
water.generateMesh(scene);

let animate = function () {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
};

animate();

