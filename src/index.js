//scene creation
var scene = new THREE.Scene();

//camera
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

//WebGL renderer
var renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth * 0.9, window.innerHeight * 0.7);
renderer.setClearColor(0xfffafa, 1);

// getting DOM container
dom = document.getElementById("MainContainer");
dom.appendChild(renderer.domElement);
rock();

sunLight();
var tree = createTree();
scene.add(tree);
var sphericalHelper = new THREE.Spherical();
//Rock
function rock() {
  var sphereGeometry = new THREE.DodecahedronGeometry(0.2, 1);
  var sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0xe5f2f2,
    shading: THREE.FlatShading
  });
  jumping = false;
  heroSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  heroSphere.receiveShadow = true;
  heroSphere.castShadow = true;
  scene.add(heroSphere);

  //moving rock
  heroSphere.position.y = 1.8;
  heroSphere.position.z = 4.8;
  currentLane = 0;
  heroSphere.position.x = currentLane;

  camera.position.z = 10;
}
//Fog environment
scene.fog = new THREE.FogExp2(0xf0fff0, 0.14);

//environment Sunlight effect
function sunLight() {
  var hemisphereLight = new THREE.HemisphereLight(0xfffafa, 0x000000, 0.9);
  scene.add(hemisphereLight);
  sun = new THREE.DirectionalLight(0xcdc1c5, 0.9);
  sun.position.set(12, 6, -7);
  sun.castShadow = true;
  scene.add(sun);
}

//create tree

function createTree() {
  var sides = 8;
  var tiers = 6;
  var scalarMultiplier = Math.random() * (0.25 - 0.1) + 0.05;
  var midPointVector = new THREE.Vector3();
  var vertexVector = new THREE.Vector3();
  var treeGeometry = new THREE.ConeGeometry(0.5, 1, sides, tiers);
  var treeMaterial = new THREE.MeshStandardMaterial({
    color: 0x33ff33,
    shading: THREE.FlatShading
  });
  var offset;
  midPointVector = treeGeometry.vertices[0].clone();
  var currentTier = 0;
  var vertexIndex;
  blowUpTree(treeGeometry.vertices, sides, 0, scalarMultiplier);
  tightenTree(treeGeometry.vertices, sides, 1);
  blowUpTree(treeGeometry.vertices, sides, 2, scalarMultiplier * 1.1, true);
  tightenTree(treeGeometry.vertices, sides, 3);
  blowUpTree(treeGeometry.vertices, sides, 4, scalarMultiplier * 1.2);
  tightenTree(treeGeometry.vertices, sides, 5);
  var treeTop = new THREE.Mesh(treeGeometry, treeMaterial);
  treeTop.castShadow = true;
  treeTop.receiveShadow = false;
  treeTop.position.y = 0.9;
  treeTop.rotation.y = Math.random() * Math.PI;
  var treeTrunkGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5);
  var trunkMaterial = new THREE.MeshStandardMaterial({
    color: 0x886633,
    shading: THREE.FlatShading
  });
  var treeTrunk = new THREE.Mesh(treeTrunkGeometry, trunkMaterial);
  treeTrunk.position.y = 0.25;
  var tree = new THREE.Object3D();
  tree.add(treeTrunk);
  tree.add(treeTop);
  return tree;
}

function blowUpTree(vertices, sides, currentTier, scalarMultiplier, odd) {
  var vertexIndex;
  var vertexVector = new THREE.Vector3();
  var midPointVector = vertices[0].clone();
  var offset;
  for (var i = 0; i < sides; i++) {
    vertexIndex = currentTier * sides + 1;
    vertexVector = vertices[i + vertexIndex].clone();
    midPointVector.y = vertexVector.y;
    offset = vertexVector.sub(midPointVector);
    if (odd) {
      if (i % 2 === 0) {
        offset.normalize().multiplyScalar(scalarMultiplier / 6);
        vertices[i + vertexIndex].add(offset);
      } else {
        offset.normalize().multiplyScalar(scalarMultiplier);
        vertices[i + vertexIndex].add(offset);
        vertices[i + vertexIndex].y =
          vertices[i + vertexIndex + sides].y + 0.05;
      }
    } else {
      if (i % 2 !== 0) {
        offset.normalize().multiplyScalar(scalarMultiplier / 6);
        vertices[i + vertexIndex].add(offset);
      } else {
        offset.normalize().multiplyScalar(scalarMultiplier);
        vertices[i + vertexIndex].add(offset);
        vertices[i + vertexIndex].y =
          vertices[i + vertexIndex + sides].y + 0.05;
      }
    }
  }
}
function tightenTree(vertices, sides, currentTier) {
  var vertexIndex;
  var vertexVector = new THREE.Vector3();
  var midPointVector = vertices[0].clone();
  var offset;
  for (var i = 0; i < sides; i++) {
    vertexIndex = currentTier * sides + 1;
    vertexVector = vertices[i + vertexIndex].clone();
    midPointVector.y = vertexVector.y;
    offset = vertexVector.sub(midPointVector);
    offset.normalize().multiplyScalar(0.06);
    vertices[i + vertexIndex].sub(offset);
  }
}

//Animation Loop
var animate = function() {
  requestAnimationFrame(animate);

  heroSphere.rotation.x += 0.01;
  heroSphere.rotation.y += 0.01;

  renderer.render(scene, camera);
};

animate();
