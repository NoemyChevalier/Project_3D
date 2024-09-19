"use strict";

import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { dat } from "./lib/dat.gui.min.js";
import { Reflector } from "three/addons/objects/Reflector.js";

var camera, renderer;
var scene = new THREE.Scene();
var cameraControls;
var clock = new THREE.Clock();
var gui = new dat.GUI();

var loader = new OBJLoader();
loader.load("vase_bleu.obj", function (object) {
  var textureLoader = new THREE.TextureLoader();

  // NORMAL MAP
  var normalMap = textureLoader.load("vase_normal.png");
  var material = new THREE.MeshStandardMaterial({
    color: 0xadd8e6,
    normalMap: normalMap,
    metalness: 0.5,
    roughness: 0.5,
  });

  object.position.set(-25, -32, -43);
  object.rotation.set(-Math.PI / 2, 0, 0);

  object.traverse(function (child) {
    if (child instanceof THREE.Mesh) {
      child.material = material;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  scene.add(object);
});

var loaderChaise = new OBJLoader();
loaderChaise.load("chaise.obj", function (object) {
  var material = new THREE.MeshPhongMaterial({ color: 0xffffff });

  object.position.set(0, -58.5, -20);
  object.scale.set(0.5, 0.5, 0.5);
  object.rotation.y = Math.PI / -1;

  object.traverse(function (child) {
    if (child instanceof THREE.Mesh) {
      child.material = material;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  scene.add(object);
});

function init() {
  var canvasWidth = window.innerWidth;
  var canvasHeight = window.innerHeight;
  var canvasRatio = canvasWidth / canvasHeight;

  scene.fog = new THREE.Fog(0x808080, 100, 1000);

  // RENDERER
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(canvasWidth, canvasHeight);
  renderer.setClearColor(scene.fog.color, 1);
  renderer.shadowMap.enabled = true;

  // CAMERA
  camera = new THREE.PerspectiveCamera(45, canvasRatio, 1, 2000);
  camera.position.set(0, 0, 300);

  // CONTROLS
  cameraControls = new OrbitControls(camera, renderer.domElement);
  cameraControls.target.set(0, 0, 0);
  cameraControls.maxDistance = 1500;

  // LIGHTS
  scene.add(new THREE.AmbientLight(0xffffff, 0.05));

  var spotlight = new THREE.SpotLight(0xffffff);
  spotlight.intensity = 10000;
  spotlight.position.set(20, 0, 30);
  spotlight.target.position.set(-40, -18, -70);
  spotlight.castShadow = true;
  spotlight.shadow.mapSize.width = 2048;
  spotlight.shadow.mapSize.height = 2048;
  spotlight.shadow.camera.near = 1;
  spotlight.shadow.camera.far = 200;
  spotlight.shadow.camera.fov = 30;
  var spotLightHelper = new THREE.SpotLightHelper(spotlight);
  scene.add(spotLightHelper);
  scene.add(spotlight);
  scene.add(spotlight.target);

  gui.add(spotlight, "intensity", 0, 10000);
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  var delta = clock.getDelta();
  cameraControls.update(delta);
  renderer.render(scene, camera);
}

function addToDOM() {
  var container = document.getElementById("webGL");
  container.appendChild(renderer.domElement);
}

function Skybox() {
  var loader = new THREE.CubeTextureLoader();
  var texture = loader.load([
    "skybox/px.png",
    "skybox/nx.png",
    "skybox/py.png",
    "skybox/ny.png",
    "skybox/pz.png",
    "skybox/nz.png",
  ]);
  scene.background = texture;
}

function Scene() {
  var murGeometry = new THREE.BoxGeometry(5, 100, 110);

  var murColor = new THREE.Color("#E6FFFE");
  var murMaterial = new THREE.MeshStandardMaterial({ color: murColor });

  var murGauche = new THREE.Mesh(murGeometry, murMaterial);
  murGauche.position.set(-53, -10, -30);
  murGauche.receiveShadow = true;
  scene.add(murGauche);

  //Bas
  var murFaceGeometryBas = new THREE.BoxGeometry(5, 35, 110);
  var murFaceBas = new THREE.Mesh(murFaceGeometryBas, murMaterial);
  murFaceBas.position.set(0, -43, -82.5);
  murFaceBas.rotation.y = Math.PI / 2;
  murFaceBas.receiveShadow = true;
  scene.add(murFaceBas);

  //Droite
  var murFaceGeometryDroit = new THREE.BoxGeometry(5, 51, 52);
  var murFaceDroit = new THREE.Mesh(murFaceGeometryDroit, murMaterial);
  murFaceDroit.position.set(-24.5, -0.3, -82.5);
  murFaceDroit.rotation.y = Math.PI / 2;
  murFaceDroit.receiveShadow = true;
  scene.add(murFaceDroit);

  //Gauche
  var murFaceGeometryGauche = new THREE.BoxGeometry(5, 51, 7.9);
  var murFaceGauche = new THREE.Mesh(murFaceGeometryGauche, murMaterial);
  murFaceGauche.position.set(51, -0.3, -82.5);
  murFaceGauche.rotation.y = Math.PI / 2;
  murFaceGauche.receiveShadow = true;
  scene.add(murFaceGauche);

  //Haut
  var murFaceGeometryHaut = new THREE.BoxGeometry(5, 15, 110);
  var murFaceHaut = new THREE.Mesh(murFaceGeometryHaut, murMaterial);
  murFaceHaut.position.set(0, 32.5, -82.5);
  murFaceHaut.rotation.y = Math.PI / 2;
  murFaceHaut.receiveShadow = true;
  scene.add(murFaceHaut);

  // Sol
  var solGeometry = new THREE.BoxGeometry(110, 1, 110);

  var texture = new THREE.TextureLoader();
  var TextureSol = texture.load("bois_sol.jpg");
  var solMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: TextureSol,
  });

  var sol = new THREE.Mesh(solGeometry, solMaterial);
  sol.position.set(0, -60, -30);
  solMaterial.receiveShadow = true;
  scene.add(sol);
}

function Table() {
  var plateauTableGeometry = new THREE.BoxGeometry(100, 5, 50);
  var whiteColor = new THREE.Color(0xffffff);

  var textureLoader = new THREE.TextureLoader();

  var TextureTable = textureLoader.load(
    "texture_table.png",
    function (texture) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 1);
    }
  );

  var plateauTableMaterial = new THREE.MeshStandardMaterial({
    color: whiteColor,
    metalness: 0.5,
    roughness: 0.5,
    map: TextureTable,
  });

  var plateauTable = new THREE.Mesh(plateauTableGeometry, plateauTableMaterial);
  plateauTable.position.set(0, -35, -56);
  plateauTable.receiveShadow = true;
  scene.add(plateauTable);
}

function Fenetre() {
  var textureLoader = new THREE.TextureLoader();
  var TextureVitre = textureLoader.load("texture_vitre.png");

  var windowGeometry = new THREE.BoxGeometry(40, 40, 3);
  var windowMaterial = new THREE.MeshStandardMaterial({
    color: 0x80aaff,
    transparent: true,
    opacity: 0.7,
    map: TextureVitre,
  });
  var windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
  windowMesh.position.set(25, 0, -82.5);

  var contourColor = new THREE.Color("#332405");
  var contourMaterial = new THREE.MeshStandardMaterial({
    color: contourColor,
  });

  // Haut
  var contourFenetreHautGeometry = new THREE.BoxGeometry(40, 5.78, 5);
  var contourFenetreHaut = new THREE.Mesh(
    contourFenetreHautGeometry,
    contourMaterial
  );
  contourFenetreHaut.position.set(25, 22, -82.5);

  // Bas
  var contourFenetreBasGeometry = new THREE.BoxGeometry(5, 5.78, 40);
  var contourFenetreBas = new THREE.Mesh(
    contourFenetreBasGeometry,
    contourMaterial
  );
  contourFenetreBas.position.set(25, -22.7, -82.5);
  contourFenetreBas.rotation.y = Math.PI / 2;

  // Contour droit
  var contourFenetreDroitGeometry = new THREE.BoxGeometry(5, 50.4, 5);
  var contourFenetreDroit = new THREE.Mesh(
    contourFenetreDroitGeometry,
    contourMaterial
  );
  contourFenetreDroit.position.set(4, -0.25, -82.5);

  // Contour gauche
  var contourFenetreGaucheGeometry = new THREE.BoxGeometry(5, 50.3, 5);
  var contourFenetreGauche = new THREE.Mesh(
    contourFenetreGaucheGeometry,
    contourMaterial
  );
  contourFenetreGauche.position.set(45, -0.25, -82.45);

  scene.add(windowMesh);
  scene.add(contourFenetreHaut);
  scene.add(contourFenetreBas);
  scene.add(contourFenetreDroit);
  scene.add(contourFenetreGauche);
}

function Pomme() {
  var pommeGeometry = new THREE.SphereGeometry(5, 32, 32);

  var texture = new THREE.TextureLoader();
  var pommeTextureRouge = texture.load("pomme.jpg");
  var pommeMaterialRouge = new THREE.MeshStandardMaterial({
    map: pommeTextureRouge,
  });

  var pommeRouge = new THREE.Mesh(pommeGeometry, pommeMaterialRouge);
  pommeRouge.position.set(-10, -28, -45);

  var pommeTextureVert = texture.load("pomme_vert.jpg");
  var pommeMaterialVert = new THREE.MeshStandardMaterial({
    map: pommeTextureVert,
  });

  var pommeVert1 = new THREE.Mesh(pommeGeometry, pommeMaterialVert);
  var pommeVert2 = new THREE.Mesh(pommeGeometry, pommeMaterialVert);

  pommeVert1.position.set(20, -28, -65);
  pommeVert1.receiveShadow = true;
  pommeVert2.position.set(33, -28, -62);

  var tigeGeometry = new THREE.CylinderGeometry(0.3, 0.3, 8, 32);
  var tigeMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });

  //Rouge
  var tige = new THREE.Mesh(tigeGeometry, tigeMaterial);
  tige.position.set(-10, -25, -45);

  //Vert
  var tige1 = new THREE.Mesh(tigeGeometry, tigeMaterial);
  tige1.position.set(20, -25, -65);

  //Vert
  var tige2 = new THREE.Mesh(tigeGeometry, tigeMaterial);
  tige2.position.set(33, -25, -62);

  var feuilleGeometry = new THREE.BoxGeometry(2, 2, 2);
  var feuilleMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  var feuille = new THREE.Mesh(feuilleGeometry, feuilleMaterial);

  //Rouge
  feuille.position.set(-10, -23, -46);

  //Vert
  var feuille1 = new THREE.Mesh(feuilleGeometry, feuilleMaterial);
  feuille1.position.set(20, -23, -66);

  //Vert
  var feuille2 = new THREE.Mesh(feuilleGeometry, feuilleMaterial);
  feuille2.position.set(33, -23, -63);

  var pommeGroup = new THREE.Group();
  pommeGroup.add(pommeRouge);
  pommeGroup.add(pommeVert1);
  pommeGroup.add(pommeVert2);
  pommeGroup.add(tige);
  pommeGroup.add(tige1);
  pommeGroup.add(tige2);
  pommeGroup.add(feuille);
  pommeGroup.add(feuille1);
  pommeGroup.add(feuille2);

  scene.add(pommeGroup);
}

function AssietteBlanche() {
  var plateGeometry = new THREE.CylinderGeometry(10, 10, 0.5, 32);
  var plateMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
  var plate = new THREE.Mesh(plateGeometry, plateMaterial);

  plate.position.set(-25, -32, -65);
  scene.add(plate);
}

function BouteilleHuile() {
  var bottleGroup = new THREE.Group();

  var bodyGeometry = new THREE.CylinderGeometry(5, 5, 6, 32);
  var bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffcc,
    opacity: 0.8,
    transparent: true,
  });
  var body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = 10;

  var neckGeometry = new THREE.CylinderGeometry(2, 2, 3, 32);
  var neckMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffcc,
    opacity: 0.8,
    transparent: true,
  });
  var neck = new THREE.Mesh(neckGeometry, neckMaterial);
  neck.position.y = 14;

  var capGeometry = new THREE.CylinderGeometry(2.2, 2.2, 2, 32);
  var capMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
  var cap = new THREE.Mesh(capGeometry, capMaterial);
  cap.position.y = 16;

  var liquidGeometry = new THREE.CylinderGeometry(4.8, 4.8, 4, 10);
  var liquidMaterial = new THREE.MeshStandardMaterial({
    color: 0xffcc00,
    opacity: 0.8,
    transparent: false,
  });
  var liquid = new THREE.Mesh(liquidGeometry, liquidMaterial);
  liquid.position.y = 9.5;

  bottleGroup.add(body);
  bottleGroup.add(neck);
  bottleGroup.add(cap);
  bottleGroup.add(liquid);

  bottleGroup.position.set(-5, -40, -72);
  scene.add(bottleGroup);
}

function Miroir() {
  var mirrorGeometry = new THREE.PlaneGeometry(50, 30);

  var miroir = new Reflector(mirrorGeometry, {
    clipBias: 0.003,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color: 0x889999,
  });

  miroir.position.set(-50, 0, -30);
  miroir.rotation.y = Math.PI / 2;
  scene.add(miroir);
}

function createRain() {
  var rainCount = 10000;
  var rainGeometry = new THREE.BufferGeometry();
  var rainMaterial = new THREE.LineBasicMaterial({
    color: 0xaaaaaa,
    transparent: true,
    opacity: 0.6,
  });

  var positions = new Float32Array(rainCount * 6);
  for (var i = 0; i < rainCount; i++) {
    var x = Math.random() * 400 - 200;
    var y = Math.random() * 500 - 250;
    var z = Math.random() * 400 - 200;

    positions[i * 6] = x;
    positions[i * 6 + 1] = y;
    positions[i * 6 + 2] = z;

    positions[i * 6 + 3] = x;
    positions[i * 6 + 4] = y - 4;
    positions[i * 6 + 5] = z;
  }
  rainGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  var rain = new THREE.LineSegments(rainGeometry, rainMaterial);
  scene.add(rain);

  function animateRain() {
    var positions = rainGeometry.attributes.position.array;
    var speed = 0.5;
    for (var i = 0; i < positions.length; i += 6) {
      positions[i + 1] -= speed;
      positions[i + 4] -= speed;

      if (positions[i + 1] < -200) {
        positions[i + 1] = 200;
        positions[i + 4] = 196;
      }
    }
    rainGeometry.attributes.position.needsUpdate = true;
    requestAnimationFrame(animateRain);
  }

  animateRain();
}

function Tapis() {
  var tapisGeometry = new THREE.CircleGeometry(30, 64);
  var tapisMaterial = new THREE.MeshStandardMaterial({ color: 0xf4c2c2 });

  var tapis = new THREE.Mesh(tapisGeometry, tapisMaterial);
  tapis.rotation.x = -Math.PI / 2;
  tapis.position.set(0, -58.5, -20);

  scene.add(tapis);
}

function Poster() {
  var textureLoader = new THREE.TextureLoader();
  var posterTexture = textureLoader.load("poster.jpg");

  var posterGeometry = new THREE.PlaneGeometry(20, 30);
  var posterMaterial = new THREE.MeshStandardMaterial({
    map: posterTexture,
    side: THREE.DoubleSide,
  });

  var posterMesh = new THREE.Mesh(posterGeometry, posterMaterial);
  posterMesh.position.set(-20, 0, -79);

  scene.add(posterMesh);
}

init();
animate();
Table();
Scene();
Fenetre();
Pomme();
Skybox();
AssietteBlanche();
BouteilleHuile();
Miroir();
Tapis();
createRain();
Poster();
addToDOM();
