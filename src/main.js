import * as THREE from 'three';
import * as OrbitControls from 'orbit-controls-es6';
import {Water} from "./water";
import {Slope} from "./slope";
import {js2Terrain} from "./utils";

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

let terrainHeights = js2Terrain([
    [1, 0.5, 0.3, 0, -0.5, -1, -1.5, -2, -2, -2],
    [1, 0.5, 0.3, 0, -0.5, -1, -1.5, -2, -2, -2],
    [1, 0.5, 0.3, 0, -0.5, -1, -1.5, -2, -2, -2],
    [1, 0.5, 0.3, 0, -0.5, -1, -1.5, -2, -2, -2],
    [1, 0.5, 0.3, 0, -0.5, -1, -1.5, -2, -2, -2],
    [1, 0.5, 0.3, 0, -0.5, -1, -1.5, -2, -2, -2],
    [1, 0.5, 0.3, 0, -0.5, -1, -1.5, -2, -2, -2],
    [1, 0.5, 0.3, 0, -0.5, -1, -1.5, -2, -2, -2],
    [1, 0.5, 0.3, 0, -0.5, -1, -1.5, -2, -2, -2],
    [1, 0.5, 0.3, 0, -0.5, -1, -1.5, -2, -2, -2],
    [1, 0.5, 0.3, 0, -0.5, -1, -1.5, -2, -2, -2],
]);

let slope = new Slope(0, 0, terrainHeights);
slope.generateMesh(scene);

let water = new Water(20, 0, 80, 80);
water.generateMesh(scene);

let animate = function () {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
};

animate();

