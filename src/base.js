import * as THREE from "three";

class Base {
    static get EDGE_LENGTH() {
        return 8;
    }

    setupTexture(textureUrl, textureScale, xLength, yLength) {
        let texture = new THREE.TextureLoader().load(textureUrl);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat = new THREE.Vector2(textureScale, textureScale * yLength / xLength);
        return texture;
    }

}

export {
    Base,
}