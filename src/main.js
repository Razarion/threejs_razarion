import * as THREE from 'three';
import * as OrbitControls from 'orbit-controls-es6';
import slopeVertexShader from './shaders/slope-vertx.glsl';
import slopeFragmentShader from './shaders/slope-fragment.glsl';

function setupBeach() {
    var uniforms = {
        colorB: {type: 'vec3', value: new THREE.Color(0xACB6E5)},
        colorA: {type: 'vec3', value: new THREE.Color(0x74ebd5)}
    };
    var material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: slopeVertexShader,
        fragmentShader: slopeFragmentShader
    });
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, 0, 1));
    geometry.vertices.push(new THREE.Vector3(2, 0, 1));
    geometry.vertices.push(new THREE.Vector3(2, 2, 1));

    var normal = new THREE.Vector3(0, 1, 0); //optional
    var color = new THREE.Color(0xffaa00); //optional
    var materialIndex = 0; //optional
    var face = new THREE.Face3(0, 1, 2, normal, color, materialIndex);
    geometry.faces.push(face);

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    return new THREE.Mesh(geometry, material);
}

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var orbitControls = new OrbitControls(camera);
camera.position.z = 80;
camera.rotation.x = THREE.Math.degToRad(35);
orbitControls.update();

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

scene.add(setupBeach());

var animate = function () {
    requestAnimationFrame(animate);

    orbitControls.update();
    renderer.render(scene, camera);
};

animate();

