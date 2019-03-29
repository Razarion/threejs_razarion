import * as THREE from "three";

class Base {
    generateWireframe(scene, geometry, color) {
        let wireframe = new THREE.WireframeGeometry(geometry);
        let line = new THREE.LineSegments(wireframe);
        line.material.depthTest = false;
        line.material.opacity = 1;
        line.material.transparent = true;
        line.material.color = color;
        scene.add(line);
    }

    setupGeometry(x, y, width, height) {
        let geometry = new THREE.PlaneBufferGeometry(width, height, width / 8, height / 8);
        geometry.translate(x + width / 2, y + height / 2, 0);
        return geometry;
    }
}

export {
    Base
}