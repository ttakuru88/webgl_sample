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
var renderer = new THREE.CanvasRenderer();
renderer.setSize(width, height);

var mousedown = false;
var prevPosition = {};
renderer.domElement.addEventListener('mousedown', function(e){onMousedown(e, e.pageX, e.pageY);}, false);
renderer.domElement.addEventListener('touchstart', function(){onMousedown(event, event.touches[0].pageX, event.touches[0].pageY);}, false);
onMousedown = function(e, x, y){
  e.preventDefault();
  mousedown = true;
  prevPosition = {x: x, y: y};
};

renderer.domElement.addEventListener('mousemove', function(e){onMousemove(e, e.pageX, e.pageY, e.shiftKey);}, false);
renderer.domElement.addEventListener('touchmove', function(){onMousemove(event, event.touches[0].pageX, event.touches[0].pageY, event.touches.length > 1);}, false);
onMousemove = function(e, x, y, flg){
  if(!mousedown) return;

  moveDistance = {x: prevPosition.x - x, y: prevPosition.y - y};
  if(flg){
    mesh.position.x += moveDistance.x * 0.5;
    mesh.position.y += moveDistance.y * 0.5;
  }
  else{
    mesh.rotation.x += moveDistance.y * 0.01;
    mesh.rotation.y -= moveDistance.x * 0.01;
  }

  prevPosition = {x: x, y: y};
  render();
};

renderer.domElement.addEventListener('mouseup', function(e){
  mousedown = false;
}, false);
renderer.domElement.addEventListener('mouseout', function(e){
  mousedown = false;
}, false);

renderer.domElement.addEventListener('mousedown', function(e){ rayIntersect(e, e.pageX, e.pageY, 'クリック'); }, false);
renderer.domElement.addEventListener('touchstart', function(){ rayIntersect(event, event.touches[0].pageX, event.touches[0].pageY, 'タッチ'); }, false);
rayIntersect = function(e, x, y, type){
    var mouse_x =   ((x - e.target.offsetParent.offsetLeft) / renderer.domElement.width)  * 2 - 1;
    var mouse_y = - ((y - e.target.offsetParent.offsetTop) / renderer.domElement.height) * 2 + 1;
  var vector = new THREE.Vector3(mouse_x, mouse_y, 0.5);
  projector.unprojectVector(vector, camera);

  var ray = new THREE.Ray(camera.position, vector.subSelf(camera.position).normalize());
  var obj = ray.intersectObjects([mesh]);

  if(obj.length > 0){
    var text = document.createTextNode("立方体を"+type+"しました。 x = "+obj[0].point.x+"y = "+obj[0].point.y+"z = "+obj[0].point.z);
    var p = document.createElement('p')
    p.appendChild(text);
    document.body.appendChild(p);
  }
}

function render(){
  renderer.render(scene, camera);
}

window.onload = function(){
  document.getElementById('canvas-wrapper').appendChild(renderer.domElement);
  render();
}