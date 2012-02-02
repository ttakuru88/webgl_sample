var width = 640;
var height = 480;

var geometry = new THREE.CubeGeometry(10, 10, 10);
var scene    = new THREE.Scene();

var objects = [];
var n = 36;
for(var i=0; i<n; i++){
  var material = new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff});
  var mesh = new THREE.Mesh(geometry, material);

  var rad = Math.PI / 180 * (i/n * 360);
  mesh.position.x = Math.sin(rad) * 70;
  mesh.position.z = Math.cos(rad) * 70;
  mesh.position.y = -100;
  objects.push(mesh);
  scene.add(mesh);
}

var camera   = new THREE.PerspectiveCamera(40, width / height, 1, 1000);
camera.lookAt(objects[0].position);

var light    = new THREE.DirectionalLight(0xffffff, 1.5);
light.position = {x: 1, y: 0.5, z: 0.5};
scene.add(light);

var projector = new THREE.Projector();
var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);

var mousedown = false;

renderer.domElement.addEventListener('mousedown', function(e){
  var mouse_x =   ((e.pageX-e.target.offsetParent.offsetLeft) / renderer.domElement.width)  * 2 - 1;
  var mouse_y = - ((e.pageY-e.target.offsetParent.offsetTop) / renderer.domElement.height) * 2 + 1;
  var vector = new THREE.Vector3(mouse_x, mouse_y, 0.5);
  projector.unprojectVector(vector, camera);

  var ray = new THREE.Ray(camera.position, vector.subSelf(camera.position).normalize());
  var click_objects = ray.intersectObjects(objects);

  if(click_objects.length > 0){
    camera.lookAt(click_objects[0].object.position);
    render();
  }
}, false);

function render(){
  renderer.render(scene, camera);
}

window.onload = function(){
  document.getElementById('canvas-wrapper').appendChild(renderer.domElement);
  render();
}