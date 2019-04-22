import * as THREE from 'three';
import {Water} from "./water";
import {Slope} from "./slope";
import {js2Terrain} from "./utils";
import dat from "dat.gui";

document.addEventListener('mousemove', onDocumentMouseMove, false);

let datGui = new dat.GUI();

let scene = new THREE.Scene();

let slopeDepthScene = new THREE.Scene();
let slopeDepthTarget = new THREE.WebGLRenderTarget(512, 512, {minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, wrapS: THREE.RepeatWrapping, wrapT: THREE.RepeatWrapping});
slopeDepthTarget.depthBuffer = true;
slopeDepthTarget.depthTexture = new THREE.DepthTexture();
slopeDepthTarget.depthTexture.type = THREE.UnsignedShortType;


let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 70, 250);
camera.position.x = 100;
camera.position.y = 600;
camera.position.z = 80;
camera.rotation.x = THREE.Math.degToRad(35);

setupCameraGui();

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let terrainShape = js2Terrain([
    [1, 0.5, 0.3, 0, -0.3, -1, -1.5],
]);
let slope = new Slope(0, 0, 1000, terrainShape, datGui);
slope.generateMesh(scene, slopeDepthScene);

let water = new Water(20, 0, 1000, 1000, datGui);
water.generateMesh(scene);

setupLight();

let animate = function () {
    requestAnimationFrame(animate);

    try {
        water.update();
        slope.update();
        renderer.setRenderTarget(slopeDepthTarget);
        renderer.render(slopeDepthScene, camera);
        renderer.setRenderTarget(null);
        water.updateRgbDepthTexture(slopeDepthTarget);
        renderer.render(scene, camera);
        // console.log(renderer.getContext().getError());
    } catch (err) {
        console.error(err);
    }
};
animate();

function setupLight() {
    let ambientLight = new THREE.AmbientLight(0x808080); // soft white light
    scene.add(ambientLight);

    let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0.041237113402061855, -0.38144329896907214, 0.9234719866622141);
    scene.add(directionalLight);

    let gui = datGui.addFolder('Light');
    let ambientLightGui = gui.addFolder('Ambient Light');
    let ambientLightModel = {'color': ambientLight.color.getHex()};
    ambientLightGui.addColor(ambientLightModel, 'color').onChange(() => ambientLight.color.setHex(ambientLightModel.color));
    ambientLightGui.add(ambientLight, 'intensity', 0, 20, 0.1);

    let directionalLightGui = gui.addFolder('DirectionalLight');
    let directionalLightModel = {'color': directionalLight.color.getHex()};
    directionalLightGui.addColor(directionalLightModel, 'color').onChange(() => directionalLight.color.setHex(directionalLightModel.color));
    directionalLightGui.add(directionalLight, 'intensity', 0, 20, 0.1);
    directionalLightGui.add(directionalLight.position, 'x', -1, 1, 0.1);
    directionalLightGui.add(directionalLight.position, 'y', -1, 1, 0.1);
    directionalLightGui.add(directionalLight.position, 'z', -1, 1, 0.1);

    // directionalLight.addEventListener('change', () => directionalLightGui.updateDisplay());
}

function setupCameraGui() {
    let gui = datGui.addFolder('Camera');
    gui.add(camera.position, 'x', 0, 200, 0.1);
    gui.add(camera.position, 'y', 0, 1000, 0.1);
    gui.add(camera.position, 'z', 0, 200, 0.1);
    gui.add(camera.rotation, 'x', 0.0, Math.PI / 2, 0.01);
    gui.open();

}

function onDocumentMouseMove(event) {
    // console.warn(event.clientX + ":" + event.clientY);
    // let read = new Uint8Array(4);
    // renderer.getContext().bindFramebuffer(renderer.getContext().FRAMEBUFFER, null);
    // renderer.getContext().readPixels(event.clientX, event.clientY, 1, 1, renderer.context.RGBA, renderer.context.UNSIGNED_BYTE, read);
    // console.warn('r:' + read[0] + ' g:' + read[1] + ' b:' + read[2] + ' a:' + read[3]);
    //
    //
    // let windowHalfX = window.innerWidth / 2;
    // let windowHalfY = window.innerHeight / 2;
    // let mouseX = event.clientX - windowHalfX;
    // let mouseY = event.clientY - windowHalfY;
    //
    // let read = new Float32Array(4);
    // renderer.readRenderTargetPixels(renderer.getRenderTarget(), windowHalfX + mouseX, windowHalfY - mouseY, 1, 1, read);
    // console.warn('r:' + read[0] + ' g:' + read[1] + ' b:' + read[2]);

}
