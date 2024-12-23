import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Enable antialiasing in the renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); // Set the pixel ratio for high-density screens
renderer.setClearColor(0xffffff, 0);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// const environmentMap = textureLoader.load([
//   "/posx.jpg",
//   "/negx.jpg",
//   "/posy.jpg",
//   "/negy.jpg",
//   "/posz.png",
//   "/negz.jpg",
// ]);

// scene.background = environmentMap; // Set as the scene background

// Increase radial segments for smoother edges
const geometry = new THREE.CylinderGeometry(1, 1, 0.45, 128); // 128 radial segments for a smoother cylinder

const textureLoader = new THREE.TextureLoader();
const rubberTexture = textureLoader.load(
  "/rubber.jpg",
  () => {
    console.log("Texture loaded successfully!");
  },
  undefined,
  (err) => {
    console.error("An error occurred while loading the texture:", err);
  }
);
const material = new THREE.MeshStandardMaterial({
  color: 0x1c1c1c, // Dark gray for a rubbery look
  roughness: 1, // High roughness for a matte finish
  metalness: 0, // No metallic reflection
  bumpMap: rubberTexture, // Use the rubber texture as a bump map
  bumpScale: 3.2, // Adjust the intensity of the texture
});
const puck = new THREE.Mesh(geometry, material);
scene.add(puck);
puck.scale.set(1.7, 1.7, 1.7); // Scale factors for X, Y, Z (2x the original size

camera.position.z = 5;

// Add lights
const ambientLight = new THREE.AmbientLight(0x4910ce, 70.5); // Soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 13); // Bright directional light
directionalLight.position.set(5, 5, 5); // Position it to shine on the puck
scene.add(directionalLight);

// Variable to store mouse positions
let mouseX = 0;
let mouseY = 0;

// Add an event listener for mouse movement
document.addEventListener("mousemove", (event) => {
  // Normalize mouse positions (values between -1 and 1)
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = (event.clientY / window.innerHeight) * 2 - 1;
});

// Adjust canvas size on window resize
window.addEventListener("resize", () => {
  // Update renderer size
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Update camera aspect ratio and projection matrix
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Animation loop
function animate() {
  // Rotate the puck based on mouse movement
  puck.rotation.x = mouseY * Math.PI; // Rotation on X-axis corresponds to vertical movement
  puck.rotation.y = mouseX * Math.PI; // Rotation on Y-axis corresponds to horizontal movement

  // Add diagonal tilting effect (z-axis)
  puck.rotation.z = (mouseX + mouseY) * 0.3 * Math.PI; // Combine X and Y for diagonal tilt

  renderer.render(scene, camera);
}
