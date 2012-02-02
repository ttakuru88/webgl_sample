var width = 640;
var height = 480;

var geometry = new THREE.CubeGeometry(100, 100, 100);
var texture  = new THREE.ImageUtils.loadTexture('/images/anko.jpg');
var material = new THREE.MeshLambertMaterial({map: texture});
var mesh     = new THREE.Mesh(geometry, material);

var camera   = new THREE.PerspectiveCamera(40, width / height, 1, 1000);
camera.position.z = -400;
camera.lookAt(mesh.position);

var scene    = new THREE.Scene();
scene.add(mesh);

var light    = new THREE.DirectionalLight(0xffffff, 1.5);
light.position = {x: 0, y: 0.2, z: -1}
scene.add(light);

var projector = new THREE.Projector();
var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);

var mousedown = false;
renderer.domElement.addEventListener('mousedown', function(e){
  e.preventDefault();
  mousedown = true;
  prevPosition = {x: e.pageX, y: e.pageY};
}, false);

renderer.domElement.addEventListener('mousemove', function(e){
  if(!mousedown) return;
  moveDistance = {x: prevPosition.x - e.pageX, y: prevPosition.y - e.pageY};
  if(e.shiftKey){
    mesh.position.x += moveDistance.x * 0.5;
    mesh.position.y += moveDistance.y * 0.5;
  }
  else{
    mesh.rotation.x += moveDistance.y * 0.01;
    mesh.rotation.y -= moveDistance.x * 0.01;
  }

  prevPosition = {x: e.pageX, y: e.pageY};
  render();
}, false);
renderer.domElement.addEventListener('mouseup', function(e){
  mousedown = false;
}, false);
renderer.domElement.addEventListener('mouseout', function(e){
  mousedown = false;
}, false);

renderer.domElement.addEventListener('mousedown', function(e){
  var mouse_x =   ((e.pageX-e.target.offsetParent.offsetLeft) / renderer.domElement.width) * 2 - 1;
  var mouse_y = - ((e.pageY-e.target.offsetParent.offsetTop) / renderer.domElement.height) * 2 + 1;
  var vector = new THREE.Vector3(mouse_x, mouse_y, 0.5);
  projector.unprojectVector(vector, camera);

  var ray = new THREE.Ray(camera.position, vector.subSelf(camera.position).normalize());
  var obj = ray.intersectObjects([mesh]);

  if(obj.length > 0){
    var text = document.createTextNode("立方体をクリックしました。 x = "+obj[0].point.x+"y = "+obj[0].point.y+"z = "+obj[0].point.z);
    var p = document.createElement('p')
    p.appendChild(text);
    document.body.appendChild(p);
  }
}, false);

function render(){
  renderer.render(scene, camera);
}

window.onload = function(){
  document.getElementById('canvas-wrapper').appendChild(renderer.domElement);
  render();
}