import * as THREE from "/build/three.module.js";
import Stats from "/js/jsm/libs/stats.module.js";
import {OrbitControls} from "/js/jsm/controls/OrbitControls.js";
import * as dat from "/js/jsm/libs/dat.gui.module.js";

"use strict";

let renderer, scene, camera, skyboxMesh, stats, cameraControls, gui, 
    sunMesh, earthMesh, mercuryMesh, venusMesh, marsMesh, jupiterMesh, saturnMesh, ringMesh, uranusMesh, neptuneMesh, moonMesh,
    firstTime, secondTime, timeScale, params, oldScale, newScale,
    text2, day, year;

   //PLANETS VARIABLE DECLARATION
   var orbits = new THREE.Object3D();

   var scaleFactor = .1;
   
   var scaled = false;
   
   day=0;
   year=0;

   
   
   // Planets data

   //PlanetsCore. Use in LookAt
   
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
   var  saturnrbitalPeriod = 29.447 ;
   var    uranusOrbitalPeriod = 84.016 ;
   var  neptuneOrbitalPeriod = 64.7913;

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
    let nearPlane = 0.001;
    let farPlane = 10000.0;
    camera = new THREE.PerspectiveCamera(fovy, aspectRatio, nearPlane, farPlane);
    camera.position.set(scaleFactor*450,scaleFactor*50,scaleFactor*450);
    camera.lookAt(new THREE.Vector3(0,0,0));
    cameraControls = new OrbitControls(camera, renderer.domElement);
            
    // MODEL
    // skybox (CUBE)
    let skybox = new THREE.BoxGeometry();

    //Days and Years
    text2 = document.createElement('div');
	text2.style.position = 'absolute';
	text2.style.width = 180;
	text2.style.height = 40;
	text2.style.color="#00E5E5";
	
	
	text2.style.top = 1 + 'px';
	text2.style.left = 100 + 'px';
	document.body.appendChild(text2);  

    

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


    //Planets cameras

    let cameraMercury = new THREE.PerspectiveCamera()

    //ORBITS

    
    //Mercury Orbit
	var mercurymat = new THREE.LineBasicMaterial({color: 0xBEBA99,}); 
    let pointsMercury = [];
    for(var theta = 0;  theta <= 2*Math.PI;  theta+=Math.PI/365){
		pointsMercury.push(new THREE.Vector3(1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(mercuryA*mercuryA)+ Math.sin(theta)*Math.sin(theta)/(mercuryB*mercuryB))) * Math.cos(theta),
			Math.sin(mercuryObliquity+theta),		
			1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(mercuryA*mercuryA)+ Math.sin(theta)*Math.sin(theta)/(mercuryB*mercuryB))) * Math.sin(theta)));  
	}
    var mercuryOrbit = new THREE.BufferGeometry().setFromPoints(pointsMercury);

    //Venus orbit
	var venusmat = new THREE.LineBasicMaterial({color: 0xFFF300,}); 
    let pointsVenus = [];
    for(var theta = 0;  theta <= 2*Math.PI;  theta+=Math.PI /365){
		pointsVenus.push(new THREE.Vector3(1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(venusA*venusA)+ Math.sin(theta)*Math.sin(theta)/(venusB*venusB))) * Math.cos(theta),
			Math.sin(venusObliquity+theta),		
			1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(venusA*venusA)+ Math.sin(theta)*Math.sin(theta)/(venusB*venusB))) * Math.sin(theta)));  
	}
    var venusOrbit = new THREE.BufferGeometry().setFromPoints(pointsVenus);

    //Earth and moon orbit
	var earthmat = new THREE.LineBasicMaterial({color: 0x15FF00,});
    let pointsEarth = [];
    for(var theta = 0;  theta < 2*Math.PI;  theta+=Math.PI /365){
		pointsEarth.push(new THREE.Vector3( 1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(earthA*earthA)+ Math.sin(theta)*Math.sin(theta)/(earthB*earthB))) * Math.cos(theta),
			Math.sin(earthObliquity+theta),
			1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(earthA*earthA)+ Math.sin(theta)*Math.sin(theta)/(earthB*earthB))) * Math.sin(theta)));  
	}
    var earthOrbit = new THREE.BufferGeometry().setFromPoints(pointsEarth);

    //Mars orbit
	var marsmat = new THREE.LineBasicMaterial({color: 0xFF0000,});
    let pointsMars = [];
    for(var theta = 0;  theta < 2*Math.PI;  theta+=Math.PI/365){
		pointsMars.push(new THREE.Vector3(1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(marsA*marsA)+ Math.sin(theta)*Math.sin(theta)/(marsB*marsB))) * Math.cos(theta),
			Math.sin(theta+marsObliquity),
			1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(marsA*marsA)+ Math.sin(theta)*Math.sin(theta)/(marsB*marsB))) * Math.sin(theta)));  
	}
    var marsOrbit = new THREE.BufferGeometry().setFromPoints(pointsMars);

    //Jupiter orbit
	var jupitermat = new THREE.LineBasicMaterial({color: 0xFF9A00,});
    let pointsJupiter = [];
    for(var theta = 0;  theta < 2*Math.PI;  theta+=Math.PI/365){
		pointsJupiter.push(new THREE.Vector3(1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(jupiterA*jupiterA)+ Math.sin(theta)*Math.sin(theta)/(jupiterB*jupiterB))) * Math.cos(theta),
			Math.sin(jupiterObliquity+theta), 
			1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(jupiterA*jupiterA)+ Math.sin(theta)*Math.sin(theta)/(jupiterB*jupiterB))) * Math.sin(theta)));  
	}
    var jupiterOrbit = new THREE.BufferGeometry().setFromPoints(pointsJupiter);

    //Saturn orbit
	var saturnmat = new THREE.LineBasicMaterial({color: 0xF0D1A1,});
    let pointsSaturn = [];
    for(var theta = 0;  theta < 2*Math.PI;  theta+=Math.PI/365){
		pointsSaturn.push(new THREE.Vector3(1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(saturnA*saturnA)+ Math.sin(theta)*Math.sin(theta)/(saturnB*saturnB))) * Math.cos(theta),
			Math.sin(saturnbliquity+theta),
			1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(saturnA*saturnA)+ Math.sin(theta)*Math.sin(theta)/(saturnB*saturnB))) * Math.sin(theta)));  
	}
    var saturnrbit = new THREE.BufferGeometry().setFromPoints(pointsSaturn);

    //Uranus orbit
	var uranusmat = new THREE.LineBasicMaterial({color: 0x060F69,});
    let pointsUranus = [];
    for(var theta = 0;  theta < 2*Math.PI;  theta+=Math.PI/365){
		pointsUranus.push(new THREE.Vector3(1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(uranusA*uranusA)+ Math.sin(theta)*Math.sin(theta)/(uranusB*uranusB))) * Math.cos(theta),
			Math.sin(uranusObliquity+theta),
			1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(uranusA*uranusA)+ Math.sin(theta)*Math.sin(theta)/(uranusB*uranusB))) * Math.sin(theta)));  
	}
    var uranusOrbit = new THREE.BufferGeometry().setFromPoints(pointsUranus);

    //Neptune orbit
	var neptunemat = new THREE.LineBasicMaterial({color: 0x30BBFF,});
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

    // SETUP STATS
    stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);

    // DRAW SCENE IN A RENDER LOOP (ANIMATION)
    firstTime = Date.now();
    timeScale = 0.0001;
    var angle = 0;

    



    renderLoop();
}

function renderLoop() {
    stats.begin();



    renderer.render(scene, camera); // DRAW SCENE
    updateScene();
    updateCamera();
    stats.end();
    text2.innerHTML = 'Days: '+parseFloat(day).toFixed(1)+'<br> Years: ' + parseFloat(year).toFixed(2);
    stats.update();
    requestAnimationFrame(renderLoop);
}

function updateScene() {
    if (params.planetFormation){

    }else{ 
        timeScale = params.simulationSpeed/1000;
        if (oldScale != newScale){
            scalePlanets();
            oldScale = newScale;
        }
        
        translatePlanets();
        rotatePlanets();
    }
    

}

function scalePlanets(){
    if(newScale){

            mercurySize	 = .001*mercuryRadius;
            venusSize 		 = .001*venusRadius;
            earthSize 		 =  0.001*earthRadius;
            moonSize 		 =  0.001*moonRadius;
            marsSize 		 =  0.001*marsRadius;
            jupiterSize 	 =  0.001*jupiterRadius;
            saturnSize		 =  0.001*saturnRadius;
            satRingsSizeMax =  0.001*satRingsRadiusMax;
            satRingsSizeMin =  0.001*satRingsRadiusMin;
            uranusSize 		 =  0.001*uranusRadius;
            neptuneSize 	 =  0.001*neptuneRadius;
    
            mercuryMesh.scale.set(0.001, 0.001, 0.001);
            venusMesh.scale.set( 0.001, 0.001, 0.001);
            earthMesh.scale.set( 0.001, 0.001, 0.001);
            moonMesh.scale.set( 0.001, 0.001, 0.001);
            marsMesh.scale.set( 0.001, 0.001, 0.001);
            jupiterMesh.scale.set( 0.001, 0.001, 0.001);
            saturnMesh.scale.set( 0.001, 0.001, 0.001);
            ringMesh.scale.set( 0.001, 0.001, 0.001);
            uranusMesh.scale.set( 0.001, 0.001, 0.001);
            neptuneMesh.scale.set( 0.001, 0.001, 0.001);
    }
    
    else{ 	 
            mercurySize	 = mercuryRadius;
            venusSize 		 = venusRadius;
            earthSize 		 = earthRadius;
            moonSize 		 = moonRadius;
            marsSize 		 = marsRadius;
            jupiterSize 	 = jupiterRadius;
            saturnSize		 = saturnRadius;
            satRingsSizeMax = satRingsRadiusMax;
            satRingsSizeMin = satRingsRadiusMin;
            uranusSize 		 = uranusRadius;
            neptuneSize 	 = neptuneRadius;
    
            mercuryMesh.scale.set(1,1,1);
            venusMesh.scale.set(1,1,1);
            earthMesh.scale.set(1,1,1);
            moonMesh.scale.set(1,1,1);
            marsMesh.scale.set(1,1,1);
            jupiterMesh.scale.set(1,1,1);
            saturnMesh.scale.set(1,1,1);
            ringMesh.scale.set(1,1,1);
            uranusMesh.scale.set(1,1,1);
            neptuneMesh.scale.set(1,1,1);
    }
}

function updateCamera(){
    switch (params.lookAt){

        case "Mercury" : 
        let mercuryCenter = getCenterPoint(mercuryMesh)
        camera.position.set(mercuryMesh.position.x + mercurySize*5, mercuryMesh.position.y + mercurySize, mercuryMesh.position.z + mercurySize*5);
        camera.lookAt(mercuryMesh.position);
        
        camera.updateProjectionMatrix();
        if (cameraControls.enabled){
            cameraControls.enabled =false;
            
        }
        break;


        case "Venus" : 
        camera.position.set(venusMesh.position.x + venusSize*5, venusMesh.position.y + venusSize, venusMesh.position.z + venusSize * 5);
        camera.lookAt(venusMesh.position);
        if (cameraControls.enabled){
            cameraControls.enabled =false;
        }
        break;
        case "Earth" : 
        
        camera.position.set(earthMesh.position.x + earthSize*5, earthMesh.position.y + earthSize, earthMesh.position.z + earthSize * 3);
        camera.lookAt(earthMesh.position);
        if (cameraControls.enabled){
            cameraControls.enabled =false;
        }
        break;

        case "Mars" : 
        camera.position.set(marsMesh.position.x+ marsSize * 5, marsMesh.position.y + marsSize, marsMesh.position.z + marsSize * 5);
        camera.lookAt(marsMesh.position);
        if (cameraControls.enabled){
            cameraControls.enabled =false;
        }
        break;
        case "Jupiter" : 
        camera.position.set(jupiterMesh.position.x + jupiterSize * 5, jupiterMesh.position.y + jupiterSize, jupiterMesh.position.z + jupiterSize * 5);
        camera.lookAt(jupiterMesh.position);
        if (cameraControls.enabled){
            cameraControls.enabled =false;
        }
        break;

        case "Saturn" : 
        camera.position.set(saturnMesh.position.x + saturnSize * 5, saturnMesh.position.y + saturnSize, saturnMesh.position.z + saturnSize * 5);
        camera.lookAt(saturnMesh.position);
        if (cameraControls.enabled){
            cameraControls.enabled =false;
        }
        break;

        case "Uranus" : 
        camera.position.set(uranusMesh.position.x + uranusSize * 5, uranusMesh.position.y + uranusSize, uranusMesh.position.z + uranusSize * 5);
        camera.lookAt(uranusMesh.position);
        if (cameraControls.enabled){
            cameraControls.enabled =false;
        }
        break;

        case "Neptune" : 
        camera.position.set(neptuneMesh.position.x + neptuneSize * 5, neptuneMesh.position.y + neptuneSize, neptuneMesh.position.z + neptuneSize * 5);
        camera.lookAt(neptuneMesh.position);
        if (cameraControls.enabled){
            cameraControls.enabled =false;
        }
        break;

        default:
            if (!cameraControls.enabled){
                cameraControls.enabled =true;
            }
            break;
    }
}

function setupGUI(){
    gui = new dat.GUI();
    
    params =  {

        lookAt: 'None',
        scale: false,
        planetFormation: false,
        simulationSpeed: 1,
         
     };

     gui.add(params, "simulationSpeed", 0, 100, 1).name("Simulation Speed").listen().onChange(function(value) {   
        
    });

    /*gui.add(params, "planetFormation").name("Align Planets").listen().onChange(function(value) {   
        
    });
    */
    

    gui.add(params, "scale").name("Scale Planets").listen().onChange(function(value) {   
      newScale = !newScale;
    });


    gui.add(params, "lookAt", ["None","Mercury", "Venus", "Earth", "Mars", "Jupiter","Saturn","Uranus","Neptune"]).name("Focus on planet").onChange(function(value){
    	
    });
    oldScale=false;
    newScale = false;

    gui.close();
}

function planetFormation(){
    params.scale = true;
}

function rotatePlanets(){
    day+=(secondTime-firstTime)*timeScale;
    year=day/365;
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
	saturnTheta  +=Math.PI*2/ saturnrbitalPeriod /365*timeScale*(secondTime-firstTime);
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

function getCenterPoint(mesh) {
    var geometry = mesh.geometry;
    geometry.computeBoundingBox();
    var center = new THREE.Vector3();
    geometry.boundingBox.getCenter( center );
    mesh.localToWorld( center );
    return center;
}

// EVENT LISTENERS & HANDLERS

//document.addEventListener("DOMContentLoaded", init);
setupGUI();
init();

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    cameraControls.update();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);