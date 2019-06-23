import * as THREE from 'three';
import {Water} from "./water";
import {Slope} from "./slope";
import {createSphereMesh, js2Terrain} from "./utils";
import dat from "dat.gui";
import {Seabed} from "./seabed";
import modelUrl from "./models/Tree1.dae";
import {ColladaModel} from "./collada-model";

document.addEventListener('mousedown', onDocumentMouseDown, false);

let datGui = new dat.GUI();

let scene = new THREE.Scene();

let directionalLightHelper;
let shadowCameraHelper;

let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 100;
camera.position.y = 0;
camera.position.z = 80;
camera.rotation.x = THREE.Math.degToRad(35);

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

setupCameraGui();

let renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let groundLevel = -0.9;

let terrainShape = js2Terrain([
    [0.9, 0.6, 0.3, 0, -0.3, -0.6, groundLevel, groundLevel],
]);
let seabed = new Seabed(56, 0, groundLevel, 1000, 1000, datGui);
seabed.generateMesh(scene);

let slope = new Slope(0, 0, 1000, terrainShape, datGui, seabed);
slope.generateMesh(scene);

let water = new Water(0, 0, 1000, 1000, datGui);
water.generateMesh(scene);


let colladaModel = new ColladaModel(20, 28, 0.0, modelUrl, datGui);
colladaModel.generateScene(scene);

scene.add(createSphereMesh(24, 40, 10, 2))

setupLight();

let animate = function () {
    directionalLightHelper.update();
    requestAnimationFrame(animate);

    try {
        water.update();
        slope.update();
        seabed.update();
        renderer.render(scene, camera);
        // console.log(renderer.getContext().getError());
    } catch (err) {
        console.error(err.stack);
    }
};
animate();

function setupLight() {
    let ambientLight = new THREE.AmbientLight(0x808080);
    scene.add(ambientLight);

    let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(70, 30, 50);
    directionalLight.target.position.set(50, 50, 0);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.bottom = -50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 100;

    scene.add(directionalLight);
    scene.add(directionalLight.target);
    directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
    scene.add(directionalLightHelper);

    shadowCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
    scene.add(shadowCameraHelper);

    let gui = datGui.addFolder('Light');
    let ambientLightGui = gui.addFolder('Ambient Light');
    let ambientLightModel = {'color': ambientLight.color.getHex()};
    ambientLightGui.addColor(ambientLightModel, 'color').onChange(() => ambientLight.color.setHex(ambientLightModel.color));
    ambientLightGui.add(ambientLight, 'intensity', 0, 20, 0.1);

    let directionalLightGui = gui.addFolder('DirectionalLight');
    let directionalLightModel = {'color': directionalLight.color.getHex()};
    directionalLightGui.addColor(directionalLightModel, 'color').onChange(() => directionalLight.color.setHex(directionalLightModel.color));
    directionalLightGui.add(directionalLight, 'intensity', 0, 20, 0.1);
    directionalLightGui.add(directionalLight.position, 'x');
    directionalLightGui.add(directionalLight.position, 'y');
    directionalLightGui.add(directionalLight.position, 'z');
    directionalLightGui.add(directionalLight.target.position, 'x');
    directionalLightGui.add(directionalLight.target.position, 'y');
    directionalLightGui.add(directionalLight.target.position, 'z');

    // directionalLight.addEventListener('change', () => directionalLightGui.updateDisplay());
}

function setupCameraGui() {
    let gui = datGui.addFolder('Camera');
    gui.add(camera.position, 'x', -10, 200, 0.1);
    gui.add(camera.position, 'y', -10, 1000, 0.1);
    gui.add(camera.position, 'z', -10, 200, 0.1);
    gui.add(camera.rotation, 'x', 0.0, Math.PI / 2, 0.01);
    gui.open();

}

function onDocumentMouseDown(event) {
    let pickingTexture = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
    renderer.setRenderTarget(pickingTexture);
    renderer.render(scene, camera);
    let pixelBuffer = new Uint8Array(4);
    renderer.readRenderTargetPixels(pickingTexture, event.clientX, window.innerHeight - event.clientY, 1, 1, pixelBuffer);
    renderer.setRenderTarget(null);

    let normX = (pixelBuffer[0] / 255 * 2) - 1;
    let normY = (pixelBuffer[1] / 255 * 2) - 1;
    let normZ = (pixelBuffer[2] / 255 * 2) - 1;
    let magnitude = new THREE.Vector3(normX, normY, normZ).length();
    console.warn(event.clientX + ':' + event.clientY + '|r:' + pixelBuffer[0] + ' g:' + pixelBuffer[1] + ' b:' + pixelBuffer[2] + '|Norm x:' + normX + ' y:' + normY + ' z:' + normZ + "|Magnitude:" + magnitude);
}
