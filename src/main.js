import * as THREE from 'three';
import * as OrbitControls from 'orbit-controls-es6';
import {Water} from "./water";
import {Slope} from "./slope";
import {js2Terrain} from "./utils";
import dat from "dat.gui";
import "three-dat.gui";

let datGui = new dat.GUI();

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

let terrainShape = js2Terrain([
    [1, 0.5, 0.3, 0, -0.5, -1, -1.5, -2, -2, -2],
]);

let slope = new Slope(0, 0, 1000, terrainShape, datGui);
slope.generateMesh(scene);

let water = new Water(20, 0, 1000, 1000, datGui);
water.generateMesh(scene);

let animate = function () {
    requestAnimationFrame(animate);

    try {
        water.update();
        renderer.render(scene, camera);
        // console.log(renderer.getContext().getError());
    } catch (err) {
        console.log('Render failure:' + err);
    }
};

animate();

