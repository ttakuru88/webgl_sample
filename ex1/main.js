var width = 640;
var height = 480;

var geometry = new THREE.CubeGeometry(100, 100, 100);
var material = new THREE.MeshBasicMaterial({color: 0x0000aa});
var mesh     = new THREE.Mesh(geometry, material);
mesh.rotation = {x: 0.5, y: 0.5, z: 0.0};

var camera   = new THREE.PerspectiveCamera(40, width / height, 1, 1000);
camera.position.z = -400;
camera.lookAt(mesh.position);

var scene    = new THREE.Scene();
scene.add(mesh);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);

window.onload = function(){
  document.getElementById('canvas-wrapper').appendChild(renderer.domElement);
  renderer.render(scene, camera);
}