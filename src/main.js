import * as THREE from 'three';
import {Water} from "./water";
import {Slope} from "./slope";
import {js2Terrain} from "./utils";
import dat from "dat.gui";

let datGui = new dat.GUI();

let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 80;
camera.rotation.x = THREE.Math.degToRad(35);

setupCameraGui();

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

function setupCameraGui() {
    let gui = datGui.addFolder('Camera');
    gui.add(camera.position, 'x', 0, 100, 0.1);
    gui.add(camera.position, 'y', 0, 100, 0.1);
    gui.add(camera.position, 'z', 0, 200, 0.1);
    gui.add(camera.rotation, 'x', 0.0, Math.PI / 2, 0.01);
    gui.open();

}

animate();

