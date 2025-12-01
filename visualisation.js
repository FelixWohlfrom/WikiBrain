import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// global variables
let scene;
let bulb;
let renderer;

// a list of light bulbs to be updated
let bulbs = new Array();

export class Visualisation {
  
  constructor() {
    // the scene we want to render into
    scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera.position.z = 250;

    // load the background
    const texture = new THREE.TextureLoader().load('./img/wallpaper.jpg');
    scene.background = texture;

    // let it be light
    const light = new THREE.PointLight(0xffffff, 100000);
    light.position.set(-200, 0, 200);
    const secondLight = new THREE.PointLight(0xffffff, 100000);
    secondLight.position.set(200, 0, 200);
    scene.add(light);
    scene.add(secondLight);

    // load brain
    const brain = new THREE.Group();
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('./img/brain.gltf',
      (gltf) => {
        document.getElementById('brainLoader').remove();
        brain.add(gltf.scene)
      },
      (progress) => { console.log('Loading brain:', (progress.loaded / progress.total) * 100 + '%') },
      (error) => { console.error('Error loading brain:', error) }
    );
    scene.add(brain);

    // load logo
    const wikiLogo = new THREE.Group();
    gltfLoader.load('./img/wikipediaGlobe.gltf',
      (gltf) => {
        document.getElementById('wikiLogoLoader').remove();
        wikiLogo.add(gltf.scene)
      },
      (progress) => { console.log('Loading logo:', (progress.loaded / progress.total) * 100 + '%') },
      (error) => { console.error('Error loading logo:', error) }
    )
    wikiLogo.translateY(100);
    wikiLogo.scale.addScalar(4);
    scene.add(wikiLogo);

    // Create bulb mesh
    const loader = new THREE.TextureLoader();
    loader.load('./img/bulb.png', texture => {
      const geometry = new THREE.BoxGeometry(46, 55, 0);
      geometry.scale(0.5, 0.5, 0.5);
      const material = new THREE.MeshBasicMaterial( { map:texture, transparent: true } );
      bulb = new THREE.Mesh(geometry, material);
      bulb.visible = false;
      scene.add(bulb);
    });

    // handle window resize
    window.addEventListener('resize', onWindowResize, false)
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // run animation
    function animate() {
      brain.rotation.y += 0.01;
      wikiLogo.rotation.y += 0.01;
      Visualisation.updateBulbs();
      
      renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(animate);
  }

  onWikiEvent(_event) {
    if (bulb !== undefined) {
      const newBulb = bulb.clone();
      const rendererSize = renderer.getSize(new THREE.Vector2());
      let xPosition = rendererSize.x / 2;
      if (Math.random() < 0.5) {
        xPosition = -xPosition;
      }
      newBulb.position.set(
        xPosition,
        Math.random() * rendererSize.y - rendererSize.y / 2,
        0);
      newBulb.visible = true;
      scene.add(newBulb);
      bulbs.push(newBulb);
    }
  }

  static updateBulbs() {
    const toDelete = new Array();
    for (const bulbIdx in bulbs) {
      const bulb = bulbs[bulbIdx];
      
      // update x position, move towards the center
      const deltaX = 2;
      if (bulb.position.x > 0) {
        bulb.position.x -= deltaX;
      } else {
        bulb.position.x += deltaX;
      }

      // update y position, use same relation as for x update
      const relation = Math.abs(bulb.position.y) / Math.abs(bulb.position.x);
      const deltaY = relation * deltaX;
      if (bulb.position.y > 0) {
        bulb.position.y -= deltaY;
      } else {
        bulb.position.y += deltaY;
      }

      // clean items that are close to the center
      if (Math.abs(bulb.position.x) < 30) {
        toDelete.push(bulbIdx);
      }
    }

    while (toDelete.length > 0) {
      const toDeleteIdx = toDelete.pop();
      scene.remove(bulbs[toDeleteIdx]);
      bulbs.splice(toDeleteIdx, 1);
    }
  }
}
