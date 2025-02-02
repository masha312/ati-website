// // import * as THREE from "three";
// import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js";

// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(
//   75,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   1000
// );

// // Enable antialiasing in the renderer
// const renderer = new THREE.WebGLRenderer({ antialias: true });
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setPixelRatio(window.devicePixelRatio); // Set the pixel ratio for high-density screens
// renderer.setClearColor(0xffffff, 0);
// renderer.setAnimationLoop(animate);

// const coverSection = document.querySelector("section.cover");
// if (coverSection) {
//   coverSection.appendChild(renderer.domElement);
// } else {
//   console.warn(
//     "No section with class 'cover' found. Appending to body instead."
//   );
//   document.body.appendChild(renderer.domElement);
// }

// // const environmentMap = textureLoader.load([
// //   "/posx.jpg",
// //   "/negx.jpg",
// //   "/posy.jpg",
// //   "/negy.jpg",
// //   "/posz.png",
// //   "/negz.jpg",
// // ]);

// // scene.background = environmentMap; // Set as the scene background

// // Increase radial segments for smoother edges
// const geometry = new THREE.CylinderGeometry(1, 1, 0.45, 128); // 128 radial segments for a smoother cylinder

// const textureLoader = new THREE.TextureLoader();
// const rubberTexture = textureLoader.load(
//   "/public/rubber.jpg",
//   () => {
//     console.log("Texture loaded successfully!");
//   },
//   undefined,
//   (err) => {
//     console.error("An error occurred while loading the texture:", err);
//   }
// );
// const material = new THREE.MeshStandardMaterial({
//   color: 0x1c1c1c, // Dark gray for a rubbery look
//   roughness: 1, // High roughness for a matte finish
//   metalness: 0, // No metallic reflection
//   // bumpMap: rubberTexture, // Use the rubber texture as a bump map
//   bumpScale: 3.2, // Adjust the intensity of the texture
// });
// const puck = new THREE.Mesh(geometry, material);
// scene.add(puck);
// puck.scale.set(1.7, 1.7, 1.7); // Scale factors for X, Y, Z (2x the original size

// camera.position.z = 5;

// // Add lights
// const ambientLight = new THREE.AmbientLight(0x4910ce, 20.5); // Soft white light
// scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 4); // Bright directional light
// directionalLight.position.set(5, 5, 5); // Position it to shine on the puck
// scene.add(directionalLight);

// // Variable to store mouse positions
// let mouseX = 0;
// let mouseY = 0;

// // Add an event listener for mouse movement
// document.addEventListener("mousemove", (event) => {
//   // Normalize mouse positions (values between -1 and 1)
//   mouseX = (event.clientX / window.innerWidth) * 2 - 1;
//   mouseY = (event.clientY / window.innerHeight) * 2 - 1;
// });

// // Adjust canvas size on window resize
// window.addEventListener("resize", () => {
//   // Update renderer size
//   renderer.setSize(window.innerWidth, window.innerHeight);

//   // Update camera aspect ratio and projection matrix
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
// });

// // Animation loop
// function animate() {
//   // Rotate the puck based on mouse movement
//   puck.rotation.x = mouseY * Math.PI; // Rotation on X-axis corresponds to vertical movement
//   puck.rotation.y = mouseX * Math.PI; // Rotation on Y-axis corresponds to horizontal movement

//   // Add diagonal tilting effect (z-axis)
//   puck.rotation.z = (mouseX + mouseY) * 0.3 * Math.PI; // Combine X and Y for diagonal tilt

//   renderer.render(scene, camera);
// }

// Import Three.js from CDN
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Enable antialiasing and improve rendering quality
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  powerPreference: "high-performance"
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0xffffff, 0);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const coverSection = document.querySelector("section.cover");
if (coverSection) {
  coverSection.appendChild(renderer.domElement);
} else {
  console.warn("No section with class 'cover' found. Appending to body instead.");
  document.body.appendChild(renderer.domElement);
}

// Create a material for the puck
const puckMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x1c1c1c,
  roughness: 0.5,
  metalness: 0.3,
  reflectivity: 0.5,
  clearcoat: 0.3,
  clearcoatRoughness: 0.25,
  flatShading: false,
  side: THREE.DoubleSide
});

// Load the OBJ model
let puck;
const objLoader = new OBJLoader();
objLoader.load(
  "./public/puck.obj",
  (object) => {
    puck = object;
    puck.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.computeVertexNormals();
        if (!(child.geometry instanceof THREE.BufferGeometry)) {
          child.geometry = new THREE.BufferGeometry().copy(child.geometry);
        }
        child.material = puckMaterial;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    puck.scale.set(2.2, 2.2, 2.2);
    scene.add(puck);
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error) => {
    console.error("An error occurred while loading the OBJ:", error);
  }
);

camera.position.z = 4;

// Lighting setup
const ambientLight = new THREE.AmbientLight(0x4910ce, 80.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("#ffffff", 100);
directionalLight.position.set(2, 2, 2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 100;
scene.add(directionalLight);

const pointLight = new THREE.PointLight("#ffffff", 2, 10);
pointLight.position.set(2, 2, 2);
scene.add(pointLight);

// Post-processing setup
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

// Add FXAA pass
const fxaaPass = new ShaderPass(FXAAShader);
const pixelRatio = renderer.getPixelRatio();
fxaaPass.material.uniforms['resolution'].value.x = 1 / (window.innerWidth * pixelRatio);
fxaaPass.material.uniforms['resolution'].value.y = 1 / (window.innerHeight * pixelRatio);
composer.addPass(fxaaPass);

// Add bloom pass
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.1,    // bloom strength
  0.1,    // radius
  0.1     // threshold
);
composer.addPass(bloomPass);

// Add SMAA pass last
composer.addPass(new SMAAPass(window.innerWidth * pixelRatio, window.innerHeight * pixelRatio));

// Mouse movement variables
let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = (event.clientY / window.innerHeight) * 2 - 1;
});

window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  
  renderer.setSize(width, height);
  composer.setSize(width, height);
  
  // Update FXAA resolution
  fxaaPass.material.uniforms['resolution'].value.x = 1 / (width * pixelRatio);
  fxaaPass.material.uniforms['resolution'].value.y = 1 / (height * pixelRatio);
});

function animate() {
  if (puck) {
    puck.rotation.x = mouseY * Math.PI;
    puck.rotation.y = mouseX * Math.PI;
    puck.rotation.z = (mouseX + mouseY) * 0.3 * Math.PI;
  }
  composer.render();
}

renderer.setAnimationLoop(animate);