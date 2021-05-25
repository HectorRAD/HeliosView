// import * as THREE from "/build/three.module.js";
import Stats from "/js/jsm/libs/stats.module.js";
import {OrbitControls} from "/js/jsm/controls/OrbitControls.js";
import * as dat from "/js/jsm/libs/dat.gui.module.js";

"use strict";

let renderer, scene, camera, skyboxMesh, stats, cameraControls, gui, 
    sunMesh, earthMesh, mercuryMesh, venusMesh, marsMesh, jupiterMesh, saturnMesh, ringMesh, uranusMesh, neptuneMesh, moonMesh,
    firstTime, secondTime, timeScale;

   //PLANETS VARIABLE DECLARATION
   var orbits = new THREE.Object3D();

   var scaleFactor = 0.1;
   
   var scaled = false;

   // Planets data
   
   // Radius. In thousands of km 
   
   var 	 sunRadius 	  = scaleFactor*1392/100;
   var mercuryRadius	  = scaleFactor*2.49;
   var    venusRadius 	  = scaleFactor*6;
   var   earthRadius 	  = scaleFactor*6.3;
   var     moonRadius 	  = scaleFactor*1.7;
   var    marsRadius 	  = scaleFactor*3.38;
   var  jupiterRadius 	  = scaleFactor*69.9;
   var  saturnRadius	  = scaleFactor*58.2;
   var satRingsRadiusMax = scaleFactor*(58.2+120);
   var satRingsRadiusMin = scaleFactor*(58.2+6.63);
   var  uranusRadius 	  = scaleFactor*25.3;
   var uraRingsRadiusMax = scaleFactor*(25.3+98);
   var uraRingsRadiusMin = scaleFactor*(25.3+38);
   var  neptuneRadius 	 = scaleFactor*24.62;
   
   var 	 sunSize 	 = sunRadius;
   var mercurySize	 = mercuryRadius;
   var    venusSize 	 = venusRadius;
   var   earthSize 	 = earthRadius;
   var     moonSize 	 = moonRadius;
   var    marsSize 	 = marsRadius;
   var  jupiterSize 	 = jupiterRadius;
   var  saturnSize	 = saturnRadius;
   var satRingsSizeMax = satRingsRadiusMax;
   var satRingsSizeMin = satRingsRadiusMin;
   var    uranusSize 	 = uranusRadius;
   var uraRingsSizeMax = uraRingsRadiusMax;
   var uraRingsSizeMin = uraRingsRadiusMin;
   var  neptuneSize 	 = neptuneRadius;
   
   
   
   //Distance to the sun. In thousand of km.
   
   var mercuryMayorAxis =  scaleFactor*57.909;
   var    venusMayorAxis =  scaleFactor*108.208;
   var   earthMayorAxis =  scaleFactor*149.597;
   var     moonMayorAxis =  scaleFactor*10.384399;
   var    marsMayorAxis =  scaleFactor*227.936;
   var  jupiterMayorAxis =  scaleFactor*778.412;
   var  saturnMayorAxis =  scaleFactor*1426.725;
   var    uranusMayorAxis =  scaleFactor*2870.972;
   var  neptuneMayorAxis =  scaleFactor*4498.252;
   
   // Orbits obliquity. In rads.
   
   var mercuryObliquity =  1/360*2*Math.PI*7;
   var    venusObliquity =  1/360*2*Math.PI*3.39;
   var   earthObliquity =  1/360*2*Math.PI*0;
   var     moonObliquity =  1/360*2*Math.PI*5.14;
   var    marsObliquity =  1/360*2*Math.PI*1.85;
   var  jupiterObliquity =  1/360*2*Math.PI*1.305;
   var  saturnbliquity =  1/360*2*Math.PI*2.48;
   var    uranusObliquity =  1/360*2*Math.PI*0.769;
   var  neptuneObliquity =  1/360*2*Math.PI*1.769;
   
   
   
   // Orbits data: Major axis, minor axis and excentricity.
   
   var mercuryA = mercuryMayorAxis;
   var mercuryE =0.205;
   var mercuryB = mercuryA*Math.sqrt(1-mercuryE*mercuryE);
   let mercuryTheta = 0;
   
   var venusA = venusMayorAxis;
   var venusE = 0.0067;
   var venusB = venusA*Math.sqrt(1-venusE*venusE);
   var venusTheta = 0;
   
   var earthA = earthMayorAxis;
   var earthE = 0.0167;
   var earthB = earthA*Math.sqrt(1-earthE*earthE);
   var earthTheta = 0;
   
   
   var moonA =moonMayorAxis;
   var moonE = 0.0549;
   var moonB = moonA*Math.sqrt(1-moonE*moonE);
   var moonTheta = 0;
   
   var marsA = marsMayorAxis;
   var marsE = 0.093;
   var marsB = marsA*Math.sqrt(1-marsE*marsE);
   var marsTheta = 0;
   
   
   var jupiterA = jupiterMayorAxis;
   var jupiterE = 0.0483;
   var jupiterB = jupiterA*Math.sqrt(1-jupiterE*jupiterE);
   var jupiterTheta = 0;
   
   
   var saturnA =saturnMayorAxis;
   var saturnE = 0.0541;
   var saturnB = saturnA*Math.sqrt(1-saturnE*saturnE);
   var saturnTheta = 0;
   
   
   
   var uranusA = uranusMayorAxis;
   var uranusE = 0.0471;
   var uranusB = uranusA*Math.sqrt(1-uranusE*uranusE);
   var uranusTheta = 0;
   
   
   var neptuneA = neptuneMayorAxis;
   var neptuneE = 0.0085;
   var neptuneB = neptuneA*Math.sqrt(1-neptuneE*neptuneE);
   var neptuneTheta = 0;
   
   // Rotation periods (days)
   var mercuryRotPeriod = 58.64;
   var venusRotPeriod	= -243;
   var earthRotPeriod	= 0.99;
   var moonRotPeriod	= 0.3781;
   var marsRotPeriod	=1.025;
   var jupiterRotPeriod	=0.413;
   var saturnRotPeriod	=0.444;
   var uranusRotPeriod	=-0.718;
   var neptuneRotPeriod	=0.671;
   
   
   //Orbital periods (years)
   var mercuryOrbitalPeriod = 0.240  ;
   var    venusOrbitalPeriod = 0.615  ;
   var   earthOrbitalPeriod = 1      ;
   var     moonOrbitalPeriod = 0.074  ;
   var    marsOrbitalPeriod = 1.88   ;
   var  jupiterOrbitalPeriod = 11.86  ;
   var  saturnOrbitalPeriod = 29.447 ;
   var    uranusOrbitalPeriod = 84.016 ;
   var  neptuneOrbitalPeriod = 64.7913;

   // Planets info message data

   var show_planet_info = false;
   var selected_planet =  null;
   var selected_planet_info = null;
   let planets_info = {};

function init(event) {

    // RENDERER ENGINE
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(new THREE.Color(0, 0, 0));
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.shadowMap.enabled = true;
	renderer.shadowMapSoft = true;

    // SCENE
    scene = new THREE.Scene();

    //LIGHTING
	var ambientLight = new THREE.AmbientLight( 0x404040);
	scene.add(ambientLight)

	var pointLight = new THREE.PointLight(0xFFFFFF,2);
	pointLight.position.set(0,0,0);
	scene.add(pointLight);

    // CAMERA
    let fovy = 60.0;    // Field ov view
    let aspectRatio = window.innerWidth / window.innerHeight;
    let nearPlane = 0.1;
    let farPlane = 10000.0;
    camera = new THREE.PerspectiveCamera(fovy, aspectRatio, nearPlane, farPlane);
    camera.position.set(scaleFactor*450,scaleFactor*50,scaleFactor*450);
    camera.lookAt(new THREE.Vector3(0,0,0));
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
    skyboxMesh.scale.set(farPlane, farPlane, farPlane);

    //Sun Model
    let sun = new THREE.SphereGeometry(sunSize,32,32);
    let textureSun = new THREE.TextureLoader().load("/img/sun.jpg");
    let sunMaterial = new THREE.MeshPhongMaterial({ ambient:0xFFF300, side: THREE.Frontside,map: textureSun});

    sunMesh = new THREE.Mesh(sun, sunMaterial);
    sunMesh.position.set(0,0,0);

    //mercury Model
    let mercury = new THREE.SphereGeometry(mercurySize,32,32);
    let textureMercury = new THREE.TextureLoader().load("/img/mercury.jpg");
    let mercuryMaterial = new THREE.MeshLambertMaterial({side: THREE.Frontside,ambient:0xFFFFFF, map: textureMercury});

    mercuryMesh = new THREE.Mesh(mercury, mercuryMaterial);
    mercuryMesh.position.set(mercuryA,0,0);

    //Venus Model

    let venus = new THREE.SphereGeometry(venusSize,32,32);
    let textureVenus = new THREE.TextureLoader().load("/img/venus.jpg");
    let venusMaterial = new THREE.MeshLambertMaterial({side: THREE.Frontside,ambient:0xFFFFFF, map: textureVenus});

    venusMesh = new THREE.Mesh(venus, venusMaterial);
    venusMesh.position.set(venusA,0,0);

    //Earth Model
    let earth = new THREE.SphereGeometry(earthSize,32,32);
    let textureEarth = new THREE.TextureLoader().load("/img/earth.jpg");
    let earthMaterial = new THREE.MeshLambertMaterial({side: THREE.Frontside,ambient:0xFFFFFF, map: textureEarth});

    earthMesh = new THREE.Mesh(earth, earthMaterial);
    earthMesh.position.set(earthA,0,0);

    //Moon model
    var moon = new THREE.SphereGeometry(moonSize, 32,32 );
    var textureMoon = new THREE.TextureLoader().load("/img/moonmap1k.jpg");
    var moonMaterial = new THREE.MeshLambertMaterial({side: THREE.Frontside,ambient:0xFFFFFF, map: textureMoon});

	moonMesh = new THREE.Mesh(moon,moonMaterial);
	moonMesh.position.set(earthA + moonA, 0, 0);

    //Mars Model
    let mars = new THREE.SphereGeometry(marsSize, 32, 32);
    let textureMars = new THREE.TextureLoader().load("/img/mars.jpg");
    let marsMaterial = new THREE.MeshLambertMaterial({side: THREE.Frontside,ambient:0xFFFFFF, map: textureMars});

    marsMesh = new THREE.Mesh(mars, marsMaterial);
    marsMesh.position.set(marsA,0,0);

    //Jupiter Model
    let jupiter = new THREE.SphereGeometry(jupiterSize, 32, 32);
    let textureJupiter = new THREE.TextureLoader().load("/img/jupiter.jpg");
    let jupiterMaterial = new THREE.MeshLambertMaterial({side: THREE.Frontside,ambient:0xFFFFFF, map: textureJupiter});

    jupiterMesh = new THREE.Mesh(jupiter, jupiterMaterial);
    jupiterMesh.position.set(jupiterA,0,0);

    //Saturn Model
    let saturn = new THREE.SphereGeometry(saturnSize, 32, 32);
    let textureSaturn = new THREE.TextureLoader().load("/img/saturn.jpg");
    let saturnMaterial = new THREE.MeshLambertMaterial({side: THREE.Frontside,ambient:0xFFFFFF, map: textureSaturn});

    saturnMesh = new THREE.Mesh(saturn, saturnMaterial);
    saturnMesh.position.set(saturnA,0,0);

    //Ring Model

    var texSatRings = new THREE.TextureLoader().load("/img/saturnringcolor.jpg");
	texSatRings.repeat.set(1,1);
	texSatRings.magFilter = THREE.LinearFilter; 
	texSatRings.minFilter = THREE.LinearFilter; 
	
	var texSatRingsAlpha = new THREE.TextureLoader().load("/img/saturnringpatternrot.gif" );
	texSatRingsAlpha.repeat.set(1,1);
	texSatRingsAlpha.magFilter = THREE.LinearFilter;
	texSatRingsAlpha.minFilter = THREE.LinearFilter; 
    

    let satRings =  new THREE.TorusGeometry(satRingsSizeMax , satRingsSizeMin, 2, 70 );
    var materialsaturnRings = new THREE.MeshLambertMaterial({  
		transparent     : true,
		alphaTest       : 0.05,
		opacity         : 1, 
		flatShading         : THREE.SmoothShading ,
		map 			: texSatRings,
		alphaMap        : texSatRingsAlpha,
	});

    ringMesh = new THREE.Mesh(satRings,materialsaturnRings);
    ringMesh.position.set(saturnA,0,0);
    ringMesh.rotateX(Math.PI/2.2);

    //Uranus Model
    let uranus = new THREE.SphereGeometry(uranusSize, 32, 32);
    let textureUranus = new THREE.TextureLoader().load("/img/uranus.jpg");
    let uranusMaterial = new THREE.MeshLambertMaterial({side: THREE.Frontside,ambient:0xFFFFFF, map: textureUranus});

    uranusMesh = new THREE.Mesh(uranus, uranusMaterial);
    uranusMesh.position.set(uranusA,0,0);

    //Neptune Model
    let neptune = new THREE.SphereGeometry(neptuneSize, 32, 32);
    let textureNeptune = new THREE.TextureLoader().load("/img/neptune.jpg");
    let neptuneMaterial = new THREE.MeshLambertMaterial({side: THREE.Frontside,ambient:0xFFFFFF, map: textureNeptune});

    neptuneMesh = new THREE.Mesh(neptune, neptuneMaterial);
    neptuneMesh.position.set(neptuneA,0,0);

    //ORBITS

    
    //Mercury Orbit
	var mercurymat = new THREE.LineBasicMaterial({color: 0xBEBA99,}); //Gris/beige
    let pointsMercury = [];
    for(var theta = 0;  theta <= 2*Math.PI;  theta+=Math.PI/365){
		pointsMercury.push(new THREE.Vector3(1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(mercuryA*mercuryA)+ Math.sin(theta)*Math.sin(theta)/(mercuryB*mercuryB))) * Math.cos(theta),
			Math.sin(mercuryObliquity+theta),		
			1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(mercuryA*mercuryA)+ Math.sin(theta)*Math.sin(theta)/(mercuryB*mercuryB))) * Math.sin(theta)));  
	}
    var mercuryOrbit = new THREE.BufferGeometry().setFromPoints(pointsMercury);

    //Venus orbit
	var venusmat = new THREE.LineBasicMaterial({color: 0xFFF300,}); //Amarillo
    let pointsVenus = [];
    for(var theta = 0;  theta <= 2*Math.PI;  theta+=Math.PI /365){
		pointsVenus.push(new THREE.Vector3(1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(venusA*venusA)+ Math.sin(theta)*Math.sin(theta)/(venusB*venusB))) * Math.cos(theta),
			Math.sin(venusObliquity+theta),		
			1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(venusA*venusA)+ Math.sin(theta)*Math.sin(theta)/(venusB*venusB))) * Math.sin(theta)));  
	}
    var venusOrbit = new THREE.BufferGeometry().setFromPoints(pointsVenus);

    //Earth and moon orbit
	var earthmat = new THREE.LineBasicMaterial({color: 0x15FF00,}); //Verde
    let pointsEarth = [];
    for(var theta = 0;  theta < 2*Math.PI;  theta+=Math.PI /365){
		pointsEarth.push(new THREE.Vector3( 1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(earthA*earthA)+ Math.sin(theta)*Math.sin(theta)/(earthB*earthB))) * Math.cos(theta),
			Math.sin(earthObliquity+theta),
			1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(earthA*earthA)+ Math.sin(theta)*Math.sin(theta)/(earthB*earthB))) * Math.sin(theta)));  
	}
    var earthOrbit = new THREE.BufferGeometry().setFromPoints(pointsEarth);

    //Mars orbit
	var marsmat = new THREE.LineBasicMaterial({color: 0xFF0000,}); //Rojo
    let pointsMars = [];
    for(var theta = 0;  theta < 2*Math.PI;  theta+=Math.PI/365){
		pointsMars.push(new THREE.Vector3(1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(marsA*marsA)+ Math.sin(theta)*Math.sin(theta)/(marsB*marsB))) * Math.cos(theta),
			Math.sin(theta+marsObliquity),
			1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(marsA*marsA)+ Math.sin(theta)*Math.sin(theta)/(marsB*marsB))) * Math.sin(theta)));  
	}
    var marsOrbit = new THREE.BufferGeometry().setFromPoints(pointsMars);

    //Jupiter orbit
	var jupitermat = new THREE.LineBasicMaterial({color: 0xFF9A00,}); //Naranja
    let pointsJupiter = [];
    for(var theta = 0;  theta < 2*Math.PI;  theta+=Math.PI/365){
		pointsJupiter.push(new THREE.Vector3(1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(jupiterA*jupiterA)+ Math.sin(theta)*Math.sin(theta)/(jupiterB*jupiterB))) * Math.cos(theta),
			Math.sin(jupiterObliquity+theta), 
			1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(jupiterA*jupiterA)+ Math.sin(theta)*Math.sin(theta)/(jupiterB*jupiterB))) * Math.sin(theta)));  
	}
    var jupiterOrbit = new THREE.BufferGeometry().setFromPoints(pointsJupiter);

    //Saturn orbit
	var saturnmat = new THREE.LineBasicMaterial({color: 0xF0D1A1,}); //Marron muy claro
    let pointsSaturn = [];
    for(var theta = 0;  theta < 2*Math.PI;  theta+=Math.PI/365){
		pointsSaturn.push(new THREE.Vector3(1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(saturnA*saturnA)+ Math.sin(theta)*Math.sin(theta)/(saturnB*saturnB))) * Math.cos(theta),
			Math.sin(saturnbliquity+theta),
			1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(saturnA*saturnA)+ Math.sin(theta)*Math.sin(theta)/(saturnB*saturnB))) * Math.sin(theta)));  
	}
    var saturnrbit = new THREE.BufferGeometry().setFromPoints(pointsSaturn);

    //Uranus orbit
	var uranusmat = new THREE.LineBasicMaterial({color: 0x060F69,}); //Azul oscuro
    let pointsUranus = [];
    for(var theta = 0;  theta < 2*Math.PI;  theta+=Math.PI/365){
		pointsUranus.push(new THREE.Vector3(1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(uranusA*uranusA)+ Math.sin(theta)*Math.sin(theta)/(uranusB*uranusB))) * Math.cos(theta),
			Math.sin(uranusObliquity+theta),
			1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(uranusA*uranusA)+ Math.sin(theta)*Math.sin(theta)/(uranusB*uranusB))) * Math.sin(theta)));  
	}
    var uranusOrbit = new THREE.BufferGeometry().setFromPoints(pointsUranus);

    //Neptune orbit
	var neptunemat = new THREE.LineBasicMaterial({color: 0x30BBFF,}); //Azul brillante
    let pointsNeptune = [];
    for(var theta = 0;  theta < 2*Math.PI;  theta+=Math.PI /365){
		pointsNeptune.push(new THREE.Vector3(1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(neptuneA*neptuneA)+ Math.sin(theta)*Math.sin(theta)/(neptuneB*neptuneB))) * Math.cos(theta),
			Math.sin(neptuneObliquity+theta),
			1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(neptuneA*neptuneA)+ Math.sin(theta)*Math.sin(theta)/(neptuneB*neptuneB))) * Math.sin(theta)));  
	}
    var neptuneOrbit = new THREE.BufferGeometry().setFromPoints(pointsNeptune);
	
	// Add the orbits to the scene

	orbits.add(new THREE.Line(mercuryOrbit,mercurymat));
	orbits.add(new THREE.Line(venusOrbit,   venusmat));
	orbits.add(new THREE.Line(earthOrbit,  earthmat));
	orbits.add(new THREE.Line(marsOrbit,   marsmat));
	orbits.add(new THREE.Line(jupiterOrbit, jupitermat));
	orbits.add(new THREE.Line(saturnrbit, saturnmat));
	orbits.add(new THREE.Line(uranusOrbit,   uranusmat));
	orbits.add(new THREE.Line(neptuneOrbit, neptunemat));


    // SCENE HIERARCHY
    scene.add(skyboxMesh);
    scene.add(sunMesh);
    scene.add(mercuryMesh);
    scene.add(venusMesh);
    scene.add(earthMesh);
    scene.add(moonMesh);
    scene.add(marsMesh);
    scene.add(jupiterMesh);
    scene.add(saturnMesh);
    scene.add(ringMesh);
    scene.add(uranusMesh);
    scene.add(neptuneMesh);
    scene.add(orbits);

    // GUI
    gui = new dat.GUI();
    
    planets_info = {
        Mercury: {
            name: 'Mercury',
            translation: '172.404 km/h',
            rotacion: '10.83 km/h',
            translation_time: '88 days',
            model: mercuryMesh,
            size : mercurySize
        },
        Venus: {
            name: 'Venus',
            translation: '126.108 km/h',
            rotacion: '6.52 km/h',
            translation_time: '225 days',
            model: venusMesh,
            size: venusSize
        },
        Earth: {
            name: 'Earth',
            translation: '107.244 km/h',
            rotacion: '1674 km/h',
            translation_time: '365 days',
            model: earthMesh,
            size: earthSize
        },
        Mars: {
            name: 'Mars',
            translation: '86.868 km/h',
            rotacion: '866 km/h',
            translation_time: '687 days',
            model: marsMesh,
            size: marsSize
        },
        Jupiter: {
            name: 'Jupiter',
            translation: '47.016 km/h',
            rotacion: '45.583 km/h',
            translation_time: '12 years',
            model: jupiterMesh,
            size: jupiterSize
        },
        Saturn: {
            name: 'Saturn',
            translation: '34.705 km/h',
            rotacion: '36.840 km/h',
            translation_time: '29 years',
            model: saturnMesh,
            size: saturnSize
        },
        Uranus: {
            name: 'Uranus',
            translation: '24.516 km/h',
            rotacion: '14.794 km/h',
            translation_time: '84 years',
            model: uranusMesh,
            size: uranusSize
        },
        Neptune: {
            name: 'Neptune',
            translation: '19.548 km/h',
            rotacion: '9.719 km/h',
            translation_time: '165 years',
            model: neptuneMesh,
            size: neptuneSize
        }
    }

    let params =  {
        
        general: function() {
            camera.position.set(55,35,55);
            camera.lookAt(0,0,0);
        },
        earth: function() {
            camera.position.set(15, 20, 15);
            camera.lookAt(earthMesh.position.x, earthMesh.position.y, earthMesh.position.z);
        },
        view: {
            listPlanets: ["General", "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"],
            defaultItem: "General"
        }
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

    });
    
    gui.add(params.view, "defaultItem", params.view.listPlanets).name("View").onChange(function(item) {
        clearInfo();
        let view_selected = params.view.defaultItem;
        if(view_selected === 'General'){
            return;
        }
        createPlanetInfo(planets_info[view_selected]);
    });

    /*
    
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
    firstTime = Date.now();
    timeScale = 0.01;
    var angle = 0;

    



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
    translatePlanets();
    rotatePlanets();
    showPlanetInfo();
}

function createPlanetInfo(planet){
    let planet_info_sprite = new THREE.TextSprite({
        text: getDisplayText(planet),
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: planet.size>2? 2: .4,
        alignment: 'left',
        color: '#ffbbff',
    });
    planet_info_sprite.position.x = planet.model.position.x;
    planet_info_sprite.position.y = planet.size + planet.model.position.y + (planet.size<2? 2: 10);
    selected_planet = planet;
    selected_planet_info = planet_info_sprite;
    scene.add(planet_info_sprite);
    show_planet_info = true;
}

function getDisplayText(planet){
    let txt = `\t${planet.name}\n
    Translation velocity: ${planet.translation}\n
    Rotation velocity: ${planet.rotacion}\n
    Translation time: ${planet.translation_time}`;
    return txt;
}

function showPlanetInfo(){
    if(!show_planet_info || selected_planet === null || selected_planet_info === null){
        return;
    }
    let model = selected_planet.model;
    selected_planet_info.position.x = model.position.x;
    selected_planet_info.position.y = selected_planet.size + model.position.y + (selected_planet.size<2? 2: 10);
    selected_planet_info.position.z =  model.position.z;
}

function clearInfo(){
    if(show_planet_info){
        scene.remove(selected_planet_info);
        selected_planet = null;
        selected_planet_info = null;
        show_planet_info = false;
    }
}

function rotatePlanets(){
    mercuryMesh.rotation.y+=(2*Math.PI/mercuryRotPeriod*(secondTime-firstTime))* timeScale;
	venusMesh.rotation.y   +=(2*Math.PI/venusRotPeriod*(secondTime-firstTime)	)* timeScale;
    earthMesh.rotation.y  +=(2*Math.PI/earthRotPeriod*(secondTime-firstTime))* timeScale;
	moonMesh.rotation.y    +=(2*Math.PI/moonRotPeriod*(secondTime-firstTime)	)* timeScale;
	marsMesh.rotation.y   +=(2*Math.PI/marsRotPeriod*(secondTime-firstTime)	)* timeScale;
	jupiterMesh.rotation.y +=(2*Math.PI/jupiterRotPeriod*(secondTime-firstTime))* timeScale;
	saturnMesh.rotation.y +=(2*Math.PI/saturnRotPeriod*(secondTime-firstTime))* timeScale;
	uranusMesh.rotation.y   +=(2*Math.PI/uranusRotPeriod*(secondTime-firstTime)	)* timeScale;
	neptuneMesh.rotation.y +=(2*Math.PI/neptuneRotPeriod*(secondTime-firstTime))* timeScale;
	
	
	
	// Translation movements
	mercuryTheta +=Math.PI*2/mercuryOrbitalPeriod /365*timeScale*(secondTime-firstTime);
	venusTheta    +=Math.PI*2/   venusOrbitalPeriod /365*timeScale*(secondTime-firstTime);
	earthTheta   +=Math.PI*2/  earthOrbitalPeriod /365*timeScale*(secondTime-firstTime);
	moonTheta     +=  Math.PI*2/    moonOrbitalPeriod /365*timeScale*(secondTime-firstTime);
	marsTheta    +=Math.PI*2/   marsOrbitalPeriod /365*timeScale*(secondTime-firstTime);
	jupiterTheta  +=Math.PI*2/ jupiterOrbitalPeriod /365*timeScale*(secondTime-firstTime);
	saturnTheta  +=Math.PI*2/ saturnOrbitalPeriod /365*timeScale*(secondTime-firstTime);
	uranusTheta  +=Math.PI*2/   uranusOrbitalPeriod /365*timeScale*(secondTime-firstTime);
	neptuneTheta    +=Math.PI*2/ neptuneOrbitalPeriod /365*timeScale*(secondTime-firstTime);

    firstTime = secondTime;
}

function translatePlanets(){
    mercuryMesh.position.x =1 /(Math.sqrt(Math.cos(mercuryTheta)*Math.cos(mercuryTheta)/(mercuryA*mercuryA)+ Math.sin(mercuryTheta)*Math.sin(mercuryTheta)/(mercuryB*mercuryB))) * Math.cos(mercuryTheta);
	mercuryMesh.position.z =  1 /(Math.sqrt(Math.cos(mercuryTheta)*Math.cos(mercuryTheta)/(mercuryA*mercuryA)+ Math.sin(mercuryTheta)*Math.sin(mercuryTheta)/(mercuryB*mercuryB))) * Math.sin(mercuryTheta);
    mercuryMesh.position.y  = Math.sin(mercuryObliquity+mercuryTheta);// Math.cos( vz )*c;

    venusMesh.position.x =1 /(Math.sqrt(Math.cos(venusTheta)*Math.cos(venusTheta)/(venusA*venusA)+ Math.sin(venusTheta)*Math.sin(venusTheta)/(venusB*venusB))) * Math.cos(venusTheta);
    venusMesh.position.z =  1 /(Math.sqrt(Math.cos(venusTheta)*Math.cos(venusTheta)/(venusA*venusA)+ Math.sin(venusTheta)*Math.sin(venusTheta)/(venusB*venusB))) * Math.sin(venusTheta);
    venusMesh.position.y  =Math.sin(venusObliquity+venusTheta);// Math.cos( vz )*c;

    earthMesh.position.x =1 /(Math.sqrt(Math.cos(earthTheta)*Math.cos(earthTheta)/(earthA*earthA)+ Math.sin(earthTheta)*Math.sin(earthTheta)/(earthB*earthB))) * Math.cos(earthTheta);
    earthMesh.position.z =  1 /(Math.sqrt(Math.cos(earthTheta)*Math.cos(earthTheta)/(earthA*earthA)+ Math.sin(earthTheta)*Math.sin(earthTheta)/(earthB*earthB))) * Math.sin(earthTheta);
    earthMesh.position.y  =Math.sin(earthObliquity+earthTheta);// Math.cos( vz )*c;

    moonMesh.position.x =earthMesh.position.x + 1 /(Math.sqrt(Math.cos(moonTheta)*Math.cos(moonTheta)/(moonA*moonA)+ Math.sin(moonTheta)*Math.sin(moonTheta)/(moonB*moonB))) * Math.cos(moonTheta);
    moonMesh.position.z =  earthMesh.position.z + 1 /(Math.sqrt(Math.cos(moonTheta)*Math.cos(moonTheta)/(moonA*moonA)+ Math.sin(moonTheta)*Math.sin(moonTheta)/(moonB*moonB))) * Math.sin(moonTheta);
    moonMesh.position.y  = earthMesh.position.y + Math.sin(moonObliquity+moonTheta);// Math.cos( vz )*c;

    marsMesh.position.x =1 /(Math.sqrt(Math.cos(marsTheta)*Math.cos(marsTheta)/(marsA*marsA)+ Math.sin(marsTheta)*Math.sin(marsTheta)/(marsB*marsB))) * Math.cos(marsTheta);
    marsMesh.position.z =  1 /(Math.sqrt(Math.cos(marsTheta)*Math.cos(marsTheta)/(marsA*marsA)+ Math.sin(marsTheta)*Math.sin(marsTheta)/(marsB*marsB))) * Math.sin(marsTheta);
    marsMesh.position.y  = Math.sin(marsObliquity+marsTheta);// Math.cos( vz )*c;

    jupiterMesh.position.x =1 /(Math.sqrt(Math.cos(jupiterTheta)*Math.cos(jupiterTheta)/(jupiterA*jupiterA)+ Math.sin(jupiterTheta)*Math.sin(jupiterTheta)/(jupiterB*jupiterB))) * Math.cos(jupiterTheta);
    jupiterMesh.position.z =  1 /(Math.sqrt(Math.cos(jupiterTheta)*Math.cos(jupiterTheta)/(jupiterA*jupiterA)+ Math.sin(jupiterTheta)*Math.sin(jupiterTheta)/(jupiterB*jupiterB))) * Math.sin(jupiterTheta);
    jupiterMesh.position.y  = Math.sin(jupiterObliquity+jupiterTheta);// Math.cos( vz )*c;

    saturnMesh.position.x =1 /(Math.sqrt(Math.cos(saturnTheta)*Math.cos(saturnTheta)/(saturnA*saturnA)+ Math.sin(saturnTheta)*Math.sin(saturnTheta)/(saturnB*saturnB))) * Math.cos(saturnTheta);
    saturnMesh.position.z =  1 /(Math.sqrt(Math.cos(saturnTheta)*Math.cos(saturnTheta)/(saturnA*saturnA)+ Math.sin(saturnTheta)*Math.sin(saturnTheta)/(saturnB*saturnB))) * Math.sin(saturnTheta);
    saturnMesh.position.y  = Math.sin(saturnbliquity+saturnTheta);// Math.cos( vz )*c;

    ringMesh.position.x =saturnMesh.position.x;
    ringMesh.position.y =saturnMesh.position.y;
    ringMesh.position.z =saturnMesh.position.z;
    
    uranusMesh.position.x =1 /(Math.sqrt(Math.cos(uranusTheta)*Math.cos(uranusTheta)/(uranusA*uranusA)+ Math.sin(uranusTheta)*Math.sin(uranusTheta)/(uranusB*uranusB))) * Math.cos(uranusTheta);
    uranusMesh.position.z =  1 /(Math.sqrt(Math.cos(uranusTheta)*Math.cos(uranusTheta)/(uranusA*uranusA)+ Math.sin(uranusTheta)*Math.sin(uranusTheta)/(uranusB*uranusB))) * Math.sin(uranusTheta);
    uranusMesh.position.y  = Math.sin(uranusObliquity+uranusTheta);// Math.cos( vz )*c;


    neptuneMesh.position.x =1 /(Math.sqrt(Math.cos(neptuneTheta)*Math.cos(neptuneTheta)/(neptuneA*neptuneA)+ Math.sin(neptuneTheta)*Math.sin(neptuneTheta)/(neptuneB*neptuneB))) * Math.cos(neptuneTheta);
    neptuneMesh.position.z =  1 /(Math.sqrt(Math.cos(neptuneTheta)*Math.cos(neptuneTheta)/(neptuneA*neptuneA)+ Math.sin(neptuneTheta)*Math.sin(neptuneTheta)/(neptuneB*neptuneB))) * Math.sin(neptuneTheta);
    neptuneMesh.position.y  = Math.sin(neptuneObliquity+neptuneTheta);// Math.cos( vz )*c;

    secondTime = Date.now();
}

// EVENT LISTENERS & HANDLERS

document.addEventListener("DOMContentLoaded", init);

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    cameraControls.update();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);