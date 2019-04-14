import * as THREE from "three";

class Base {
    static get EDGE_LENGTH() {
        return 8;
    }

    setupGeometry(x, y, width, height) {
        let geometry = new THREE.PlaneBufferGeometry(width, height, width / Base.EDGE_LENGTH, height / Base.EDGE_LENGTH);
        geometry.translate(x + width / 2, y + height / 2, 0);
        return geometry;
    }
}

export {
    Base,
}