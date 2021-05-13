import * as THREE from "/build/three.module.js";
import Stats from "/js/jsm/libs/stats.module.js";
import {OrbitControls} from "/js/jsm/controls/OrbitControls.js";
import * as dat from "/js/jsm/libs/dat.gui.module.js";

"use strict";

let renderer, scene, camera, skyboxMesh, stats, cameraControls, gui, 
    sunMesh, earthMesh, mercuryMesh, venusMesh, marsMesh, jupiterMesh, saturnMesh, ringMesh, uranusMesh, neptuneMesh;

function init(event) {
    // RENDERER ENGINE
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(new THREE.Color(0, 0, 0));
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // SCENE
    scene = new THREE.Scene();

    // CAMERA
    let fovy = 60.0;    // Field ov view
    let aspectRatio = window.innerWidth / window.innerHeight;
    let nearPlane = 0.1;
    let farPlane = 10000.0;
    camera = new THREE.PerspectiveCamera(fovy, aspectRatio, nearPlane, farPlane);
    camera.position.set(55,35,55)
    cameraControls = new OrbitControls(camera, renderer.domElement);
            
    // MODEL
    // skybox (CUBE)
    let skybox = new THREE.BoxGeometry();

    

    // Skybox MATERIAL
    let texture1 = new THREE.TextureLoader().load("/img/skybox/blue/bkg1_front.png");
    let texture2 = new THREE.TextureLoader().load("/img/skybox/blue/bkg1_back.png");
    let texture3 = new THREE.TextureLoader().load("/img/skybox/blue/bkg1_top.png");
    let texture4 = new THREE.TextureLoader().load("/img/skybox/blue/bkg1_bot.png");
    let texture5 = new THREE.TextureLoader().load("/img/skybox/blue/bkg1_left.png");
    let texture6 = new THREE.TextureLoader().load("/img/skybox/blue/bkg1_right.png");
    

    //texture.wrapS = THREE.RepeatWrapping;
    //texture.wrapT = THREE.RepeatWrapping;
    //texture.repeat.set(10, 10);

    let cubeMaterials = [
        new THREE.MeshBasicMaterial({map: texture1, side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({map: texture2, side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({map: texture3, side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({map: texture4, side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({map: texture5, side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({map: texture6, side: THREE.DoubleSide}),
    ];

    
    skyboxMesh = new THREE.Mesh(skybox, cubeMaterials);
    skyboxMesh.scale.set(200, 200, 200);

    //Sun Model
    let sun = new THREE.SphereGeometry(6.5,20,20);
    let textureSun = new THREE.TextureLoader().load("/img/sun.jpg");
    let sunMaterial = new THREE.MeshBasicMaterial( { map: textureSun, overdraw: 0.5 } );

    sunMesh = new THREE.Mesh(sun, sunMaterial);
    sunMesh.position.set(0,0,0);

    //mercury Model
    let mercury = new THREE.SphereGeometry(0.5,20,20);
    let textureMercury = new THREE.TextureLoader().load("/img/mercury.jpg");
    let mercuryMaterial = new THREE.MeshBasicMaterial( { map: textureMercury, overdraw: 0.5 } );

    mercuryMesh = new THREE.Mesh(mercury, mercuryMaterial);
    mercuryMesh.position.set(10,0,0);

    //Venus Model

    let venus = new THREE.SphereGeometry(0.8,20,20);
    let textureVenus = new THREE.TextureLoader().load("/img/venus.jpg");
    let venusMaterial = new THREE.MeshBasicMaterial( { map: textureVenus, overdraw: 0.5 } );

    venusMesh = new THREE.Mesh(venus, venusMaterial);
    venusMesh.position.set(15,0,0);

    //Earth Model
    let earth = new THREE.SphereGeometry(1.3,20,20);
    let textureEarth = new THREE.TextureLoader().load("/img/earth.jpg");
    let earthMaterial = new THREE.MeshBasicMaterial( { map: textureEarth, overdraw: 0.5 } );

    earthMesh = new THREE.Mesh(earth, earthMaterial);
    earthMesh.position.set(20,0,0);

    //Mars Model
    let mars = new THREE.SphereGeometry(1,20,20);
    let textureMars = new THREE.TextureLoader().load("/img/mars.jpg");
    let marsMaterial = new THREE.MeshBasicMaterial( { map: textureMars, overdraw: 0.5 } );

    marsMesh = new THREE.Mesh(mars, marsMaterial);
    marsMesh.position.set(25,0,0);

    //Jupiter Model
    let jupiter = new THREE.SphereGeometry(3.5,20,20);
    let textureJupiter = new THREE.TextureLoader().load("/img/jupiter.jpg");
    let jupiterMaterial = new THREE.MeshBasicMaterial( { map: textureJupiter, overdraw: 0.5 } );

    jupiterMesh = new THREE.Mesh(jupiter, jupiterMaterial);
    jupiterMesh.position.set(35,0,0);

    //Saturn Model
    let saturn = new THREE.SphereGeometry(2.5,20,20);
    let textureSaturn = new THREE.TextureLoader().load("/img/saturn.jpg");
    let saturnMaterial = new THREE.MeshBasicMaterial( { map: textureSaturn, overdraw: 0.5 } );

    saturnMesh = new THREE.Mesh(saturn, saturnMaterial);
    saturnMesh.position.set(45,0,0);

    //Ring Model

    let ring = new THREE.RingBufferGeometry(3.1, 4.5, 25);
    var pos = ring.attributes.position;
    var v3 = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++){
      v3.fromBufferAttribute(pos, i);
      ring.attributes.uv.setXY(i, v3.length() < 4 ? 0 : 1, 1);
    }
    let textureRing = new THREE.TextureLoader().load("/img/ring.png");
    let ringMaterial = new THREE.MeshBasicMaterial( { map: textureRing, side: THREE.DoubleSide, transparent: true } );

    ringMesh = new THREE.Mesh(ring,ringMaterial);
    ringMesh.position.set(45,0,0);
    ringMesh.rotateX(45);
    ringMesh.rotateZ(15);

    //Uranus Model
    let uranus = new THREE.SphereGeometry(2,20,20);
    let textureUranus = new THREE.TextureLoader().load("/img/uranus.jpg");
    let uranusMaterial = new THREE.MeshBasicMaterial( { map: textureUranus, overdraw: 0.5 } );

    uranusMesh = new THREE.Mesh(uranus, uranusMaterial);
    uranusMesh.position.set(55,0,0);

    //Neptune Model
    let neptune = new THREE.SphereGeometry(3,20,20);
    let textureNeptune = new THREE.TextureLoader().load("/img/neptune.jpg");
    let neptuneMaterial = new THREE.MeshBasicMaterial( { map: textureNeptune, overdraw: 0.5 } );

    neptuneMesh = new THREE.Mesh(neptune, neptuneMaterial);
    neptuneMesh.position.set(65,0,0);


    // SCENE HIERARCHY
    scene.add(skyboxMesh);
    scene.add(sunMesh);
    scene.add(mercuryMesh);
    scene.add(venusMesh);
    scene.add(earthMesh);
    scene.add(marsMesh);
    scene.add(jupiterMesh);
    scene.add(saturnMesh);
    scene.add(ringMesh);
    scene.add(uranusMesh);
    scene.add(neptuneMesh);

    // GUI
    gui = new dat.GUI();
    
    let params =  {
        
        general: function() {
            camera.position.set(55,35,55);
            camera.lookAt(0,0,0);
        },
        earth: function() {
            camera.position.set(15, 20, 15);
            camera.lookAt(earthMesh.position.x, earthMesh.position.y, earthMesh.position.z);
        },
        /*frontal: function() {
            camera1.position.set(0, 0, 3);
            camera1.lookAt(0, 0, 0);
        },
        lateral: function(){
            camera3.position.set(3, 0, 0);
            camera3.lookAt(0, 0, 0);
        }*/
         
     };

    gui.add(params, "general").name("GENERAL VIEW").listen().onChange(function(value) {

    });
    gui.add(params, "earth").name("EARTH VIEW").listen().onChange(function(value) {   
      
    });/*
    gui.add(params, "lateral").name("LATERAL CAM").listen().onChange(function(value) {   
      
    });
    gui.add(params, "perspective").name("PERSPECTIVE CAM").listen().onChange(function(value) {
        
    });*/

    gui.close();

    // SETUP STATS
    stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);

    // DRAW SCENE IN A RENDER LOOP (ANIMATION)
    renderLoop();
}

function renderLoop() {
    stats.begin();
    renderer.render(scene, camera); // DRAW SCENE
    updateScene();
    stats.end();
    stats.update();
    requestAnimationFrame(renderLoop);
}

function updateScene() {
    
}

// EVENT LISTENERS & HANDLERS

document.addEventListener("DOMContentLoaded", init);

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    cameraControls.update();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);