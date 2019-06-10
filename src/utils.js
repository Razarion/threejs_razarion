import * as THREE from "three";
import bumpMapUrl from "./textures/CoastBumpMap.png";

function js2Terrain(jsField) {
    let webGlField = [];
    for (let y = 0; y < jsField.length; y++) {
        for (let x = 0; x < jsField[0].length; x++) {
            if (webGlField[x] === undefined) {
                webGlField[x] = [];
            }
            webGlField[x][y] = jsField[jsField.length - y - 1][x];
        }
    }
    return webGlField;
}

function sawtooth(millis, durationMs, offsetMs) {
    let totMillis = millis + offsetMs;
    return (totMillis % durationMs) / durationMs; // Saegezahn
}

function createSphereMesh(x, y, z, sphereRadius) {
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 16;
    const sphereGeo = new THREE.SphereBufferGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
    const bumpMap = new THREE.TextureLoader().load(bumpMapUrl);
    const sphereMat = new THREE.MeshStandardMaterial({
        bumpMap: bumpMap,
        color: '#CA8'
    });
    sphereMat.metalness = 0.2;
    sphereMat.roughness = 0.5;
    sphereMat.bumpScale = 0.5;

    const mesh = new THREE.Mesh(sphereGeo, sphereMat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.set(x, y, z);
    return mesh;
}


export {
    js2Terrain,
    sawtooth,
    createSphereMesh
}