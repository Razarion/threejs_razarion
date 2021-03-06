import * as THREE from 'three';
import dat from "dat.gui";
import terrainTileArray from "./razarion_generated/terrain-tiles.json";
import staticGameConfigJson from "./razarion_generated/static-game-config.json";
import threeJsShapeJson from "./razarion_generated/shapes-3d";
import {TerrainTile} from "./terrain-tile";
import {StaticGameConfigService} from "./static-game-config-service";

document.addEventListener('mousedown', onDocumentMouseDown, false);

let datGui = new dat.GUI();

let scene = new THREE.Scene();

let directionalLightHelper;
let shadowCameraHelper;

let camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 303;
camera.position.y = 40;
camera.position.z = 80;
camera.rotation.x = THREE.Math.degToRad(40);

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

setupCameraGui();

let renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


let staticGameConfigService = new StaticGameConfigService(staticGameConfigJson, threeJsShapeJson, datGui);
let terrainTiles = [];
for (const terrainTileJson of terrainTileArray) {
    let terrainTile = new TerrainTile(terrainTileJson, scene, staticGameConfigService, threeJsShapeJson);
    terrainTiles.push(terrainTile);
}

setupLight();

let animate = function () {
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    directionalLightHelper.update();
    requestAnimationFrame(animate);

    try {
        terrainTiles.forEach(terrainTile => terrainTile.update());
        renderer.render(scene, camera);
        // console.log(renderer.getContext().getError());
    } catch (err) {
        console.error(err.stack);
    }
};
animate();

function setupLight() {
    let ambientLight = new THREE.AmbientLight(0x808080, 0.5);
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
    gui.add(camera.position, 'x', -10, 400, 0.1);
    gui.add(camera.position, 'y', -10, 1000, 0.1);
    gui.add(camera.position, 'z', -10, 500, 0.1);
    gui.add(camera.rotation, 'x', 0.0, Math.PI / 2, 0.01);
    gui.add(camera, 'fov',);
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
