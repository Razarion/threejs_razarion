import * as THREE from 'three';
import * as OrbitControls from 'orbit-controls-es6';
import slopeVertexShader from './shaders/slope-vertx.glsl';
import slopeFragmentShader from './shaders/slope-fragment.glsl';

function setupBeach() {
    var uniforms = {
        colorA: {type: 'vec3', value: new THREE.Color(0x0000FF)},
        colorB: {type: 'vec3', value: new THREE.Color(0xFF0000)}
    };
    var material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: slopeVertexShader,
        fragmentShader: slopeFragmentShader
    });
    var widthSegments = 20;
    var geometry = new THREE.PlaneBufferGeometry(30, 60, widthSegments, 30);
    var vertices = geometry.attributes.position.array;
    for (var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
        var z = (1.0 - (i % (widthSegments + 1) / (widthSegments + 1))) - 0.5;
        z += (Math.random() * 2.0 - 1.0) * 0.2;
        vertices[j + 2] = z;
    }
    scene.add( new THREE.Mesh(geometry, material) );

    // Wireframe
    var wireframe = new THREE.WireframeGeometry( geometry );
    var line = new THREE.LineSegments( wireframe );
    line.material.depthTest = false;
    line.material.opacity = 1;
    line.material.transparent = true;
    scene.add( line );
}

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 80;

var orbitControls = new OrbitControls(camera);
orbitControls.minPolarAngle = THREE.Math.degToRad(180 - 35);
orbitControls.maxPolarAngle = THREE.Math.degToRad(180 - 35);
orbitControls.minAzimuthAngle = 0;
orbitControls.maxAzimuthAngle = 0;
orbitControls.update();

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

scene.add(setupBeach());

var animate = function () {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
};

animate();

