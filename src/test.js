import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";
import gsap from "gsap";
import TWEEN from "@tweenjs/tween.js";
import holographicFragmentShader from "./shaders/holographic/fragment.glsl";
import holographicVertexShader from "./shaders/holographic/vertex.glsl";

import labelFragmentShader from "./shaders/labels/fragment.glsl";
import labelVertexShader from "./shaders/labels/vertex.glsl";
// import { ViewportGizmo } from "three-viewport-gizmo";
import { ViewHelper } from "./components/ViewHelper.js";

/**
 * Base
 */
////////////////////////////////////////////////////////////////////////////////
// Loading manager

const loadingBarElement = document.querySelector(".loading");
const ballWireElement = document.querySelector(".ball-wire");

let sceneReady = false;

const loadingManager = new THREE.LoadingManager(
  // Loaded
  () => {
    // Wait a little
    window.setTimeout(() => {
      // Animate overlay
      gsap.to(overlayMaterial.uniforms.uAlpha, {
        duration: 3,
        value: 0,
        delay: 1,
      });
      // Update loadingBarElement
      // loadingBarElement.classList.add("ended");
      loadingBarElement.style.visibility = "hidden";

      // loadingBarElement.style.transform = "";
    }, 500);

    window.setTimeout(() => {
      sceneReady = true;
    }, 2000);
  },

  // Progress
  (itemUrl, itemsLoaded, itemsTotal) => {
    // Calculate the progress and update the loadingBarElement
    const progressRatio = itemsLoaded / itemsTotal;
    console.log(progressRatio);
    // updateWireHeight(progressRatio);
  }
);

const canvas = document.querySelector("canvas.webgl");
const viewport = document.getElementById("viewport");
const checkboxes = document.querySelectorAll(".radio-input-wrapper .check-box");

////////////////////////////////////////////////////////////////////////////////
// Variables
let femur, part1, part2, parentPart;
let transformControls, transformControls1, transformControls2;
let needsRender = true;
let enableAdding = false;
let selectedMesh;
let currentCheckbox = false;
const spheres = [];
let isFirstClick = true;
const firstChecked = Array.from({ length: 10 }, (value, index) => false);
console.log(firstChecked);
let addedSpheres = [];
let checkboxStates = {};
const cursor = new THREE.Vector2();
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  viewportWidth: viewport.clientWidth,
  viewportHeight: viewport.clientHeight,
};

const gltfLoader = new GLTFLoader(loadingManager);

// Debug

const gui = new GUI({
  autoPlace: true,
  width: 370,
});
const guiContainer = gui.domElement;
guiContainer.style.position = "absolute";
guiContainer.style.top = "0";
guiContainer.style.right = "120px";
guiContainer.style.zIndex = "100";

// gui.controllers.disabled = true;
// gui.close();
// hide gui
// gui.toggleHide();

const params = {
  useShaderMaterial: false,
  showTransform1: false,
  showTransform2: false,
};

// Canvas
// const canvas = document.querySelector("canvas.webgl");

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();

// Overlay
const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
const overlayMaterial = new THREE.ShaderMaterial({
  // wireframe: true,
  transparent: true,
  uniforms: {
    uAlpha: { value: 1 },
  },
  vertexShader: `
        varying vec2 vUv;
        void main()
        {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
        }
    `,
  fragmentShader: `
        varying vec2 vUv;
        uniform float uAlpha;

        void main()
        {
            vec2 center = vec2(0.5, 0.5);
            float radius = uAlpha; 

            // Distance from center
            float dist = distance(vUv, center);

            float alpha =  smoothstep(radius,1.0 -  radius , dist);


            // gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);
            gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
        }
    `,
});
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
scene.add(overlay);

////////////////////////////////////////////////////////////////////////////////

/**
 * Camera
 */
// const camera = new THREE.PerspectiveCamera(
//   60,
//   sizes.width / sizes.height,
//   0.1,
//   1000.0
// );
var camera = new THREE.OrthographicCamera(
  sizes.width / -30,
  sizes.width / 30,
  sizes.height / 30,
  sizes.height / -30,
  0.01,
  1000
);

// camera.position.set(1.5, 13, 21);
camera.position.set(0.8, 1.8, 12.5);
// camera.rotation.set(-0.2, 0, 0);
scene.add(camera);

const camera2 = new THREE.PerspectiveCamera(
  25,
  sizes.viewportWidth / sizes.viewportHeight,
  0.01,
  1000
);

camera2.position.set(-2.8, 0.8, 65.5);

scene.add(camera2);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(2, 2, 2);
scene.add(directionalLight);

/**
 * Renderer
 */
const rendererParameters = {};
rendererParameters.clearColor = "#1d1f2a";

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setClearColor(rendererParameters.clearColor);
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// canvas.appendChild(renderer.domElement);
// document.body.appendChild(renderer.domElement);

gui.addColor(rendererParameters, "clearColor").onChange(() => {
  renderer.setClearColor(rendererParameters.clearColor);
});

const renderer2 = new THREE.WebGLRenderer({
  antialias: false,
});
// renderer2.setClearColor(0x000000);
renderer2.setClearColor(rendererParameters.clearColor);
renderer2.setSize(sizes.viewportWidth, sizes.viewportHeight);

renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 1));
viewport.appendChild(renderer2.domElement);

/**
 * Sizes
 */

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  camera2.aspect = sizes.viewportWidth / sizes.viewportHeight;
  camera2.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer2.setSize(sizes.viewportWidth, sizes.viewportHeight);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
  renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 1));
});

// Pivot point for transform controls
const pivot = new THREE.Object3D();
scene.add(pivot);
const curr_transformPoint = new THREE.Object3D();
scene.add(curr_transformPoint);

const previousPosition = new THREE.Object3D();
scene.add(previousPosition);
// Set up controls
const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true;
transformControls = new TransformControls(camera, canvas);
// transformControls.attach(pivot);
scene.add(transformControls);

// GIZMO
// grid helper
const gridHelper = new THREE.GridHelper(100, 40);
gridHelper.position.y = -15;
scene.add(gridHelper);

// const viewhelper = new ViewHelper(camera, canvas);
// scene.add(viewhelper);
/**
 * Material
 */
const materialParameters = {};
materialParameters.color = "#70c1ff";

gui.addColor(materialParameters, "color").onChange(() => {
  holoMaterial.uniforms.uColor.value.set(materialParameters.color);
  basicMaterial.color.set(materialParameters.color);
});

const holoMaterial = new THREE.ShaderMaterial({
  fragmentShader: holographicFragmentShader,
  vertexShader: holographicVertexShader,
  uniforms: {
    uTime: { value: 0 },
    uColor: new THREE.Uniform(new THREE.Color(materialParameters.color)),
  },
  transparent: true,
  side: THREE.DoubleSide,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});

const labelMaterial = new THREE.ShaderMaterial({
  fragmentShader: labelFragmentShader,
  vertexShader: labelVertexShader,
  uniforms: {
    uTime: { value: 0 },
  },
  transparent: true,
  side: THREE.DoubleSide,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});

const basicMaterial = new THREE.MeshLambertMaterial({
  color: materialParameters.color,
});

gui
  .add(params, "useShaderMaterial")
  .name("Holographic View")
  .onChange((value) => {
    if (femur) {
      femur.traverse((child) => {
        if (child.isMesh && child.name === "Right_Femur") {
          child.material = value ? holoMaterial : basicMaterial;
        }
      });
    }
  });

////////////////////////////////////////////////////////////////////////////////

// const testgeometry = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   holoMaterial
// );
// scene.add(testgeometry);
// testgeometry.position.set(0, 1.3, 10);

////////////////////////////////////////////////////////////////////////////////
//// Models
let center;
// Create a parent object
var parentObject = new THREE.Object3D();
scene.add(parentObject);

const pointMaterial = new THREE.MeshToonMaterial({ color: 0xff0000 });
// Right femur
gltfLoader.load("./models/exact.glb", (gltf) => {
  femur = gltf.scene;

  femur.traverse((child) => {
    if (child.isMesh && child.name === "Right_Femur") {
      child.material = basicMaterial;
    }
  });

  console.log(femur);
  femur.position.set(0, -46, -8);
  femur.scale.set(0.05, 0.05, 0.05);
  scene.add(femur);
  // femur.rotation.set(0, Math.PI, 0);

  // const box = new THREE.Box3().setFromObject(femur);
  // center = box.getCenter(new THREE.Vector3());

  // previousPosition.position.copy(femur.position);
  // parentObject.add(femur);
});

// gui
//   .add(params, "showTransform1")
//   .name("Show Transform Part 1")
//   .onChange((value) => {
//     transformControls1.visible = value;
//     needsRender = true;
//   });

// gui
//   .add(params, "showTransform2")
//   .name("Show Transform Part 2")
//   .onChange((value) => {
//     transformControls2.visible = value;
//     needsRender = true;
//   });

////////////////////////////////////////////////////////////////////////////////
//// LANDMARKS

const labelGeometry = new THREE.SphereGeometry(0.5, 32, 32);
// const sphere = new THREE.Mesh(labelGeometry, labelMaterial);
// for (let i = 0; i < 10; i++) {
//   const sphere = new THREE.Mesh(labelGeometry, labelMaterial);
//   // sphere.position.x = i - 4.5; // Position spheres in a line for visibility
//   spheres.push(sphere);
//   // scene.add(sphere);
// }

// on button with class name add a sphere
const butn = document.querySelector(".reset__btn");
butn.addEventListener("click", () => {
  if (spheres.length > 0) {
    scene.remove(sphere);
  }

  // scene.add(spheres[0]);
  //console.log(spheres);
});
const sphere = new THREE.Mesh(labelGeometry, labelMaterial);
function addSphere(position) {
  sphere.position.copy(position);
  scene.add(sphere);
  spheres.push(sphere);
  return sphere;
}

// Event listener for creating spheres on click
window.addEventListener("click", (event) => {
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  // Check if click is on an existing object
  const intersects = raycaster.intersectObjects(spheres);
  if (intersects.length > 0) {
    const sphere = intersects[0].object;
    transformControls.attach(sphere);
    orbitControls.enabled = false;
  } else {
    const intersectsGround = raycaster.intersectObject(femur);
    if (intersectsGround.length > 0) {
      const sphere = addSphere(intersectsGround[0].point);
      transformControls.attach(sphere);
      orbitControls.enabled = false;
    }
  }
});

// Disable transform controls when clicking elsewhere
window.addEventListener("mousedown", (event) => {
  if (event.target.tagName !== "CANVAS") return;

  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(spheres);
  if (intersects.length === 0) {
    transformControls.detach();
    orbitControls.enabled = true;
  }
});

// Event listener for mouse click to add sphere at click
let checkboxIndex;

////////////////////////////////////////////////////////////////////////////////
//// CAMERA ANIMATION

//// camera animation function
function animateCamera(position, rotation) {
  new TWEEN.Tween(camera2.position)
    .to(position, 1800)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .start()
    .onComplete(function () {
      TWEEN.remove(this);
    });
  new TWEEN.Tween(camera2.rotation)
    .to(rotation, 1800)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .start()
    .onComplete(function () {
      TWEEN.remove(this);
    });
}
const zoomIn = document.getElementById("zoom-in");
const zoomOut = document.getElementById("zoom-out");
zoomIn.addEventListener("click", () => {
  animateCamera({ x: 2.8, y: -6, z: 30.7 }, { y: 0.2 });
});

zoomOut.addEventListener("click", () => {
  animateCamera({ x: -2.8, y: 0.1, z: 65.5 }, { y: 0.0 });
});

// -2.8, 0.8, 65.5

////////////////////////////////////////////////////////////////////////////////
//// GSAP
// document.getElementById("value-3").addEventListener("click", () => {
//   gsap.to(camera.position, { x: 0.3, y: 12, z: 14, duration: 2 });
//   gsap.to(camera.rotation, { x: 0.5, y: 1.2, z: 0, duration: 2 });
// });

////////////////////////////////////////////////////////////////////////////////
//// Mouse events

/**
 * Animate
 */
const clock = new THREE.Clock();
const viewHelper = new ViewHelper(camera, canvas);
function animate() {
  TWEEN.update();

  const elapsedTime = clock.getElapsedTime();

  if (sceneReady) {
    document.querySelector(".main-container").style.visibility = "visible";
    sceneReady = false;
  }
  // Update material
  holoMaterial.uniforms.uTime.value = elapsedTime;

  // Update controls
  // orbitControls.update();

  renderer.setViewport(0, 0, canvas?.offsetWidth, canvas?.offsetHeight);
  renderer.render(scene, camera);
  renderer.autoClear = false;
  viewHelper.render(renderer);
  renderer.autoClear = true;

  renderer2.render(scene, camera2);

  requestAnimationFrame(animate);
}

animate();

// Prevent OrbitControls from interfering with TransformControls
transformControls.addEventListener("dragging-changed", function (event) {
  orbitControls.enabled = !event.value;
});

// gui.add(camera.position, "x").min(-20).max(50).step(0.5).name("Dir X pos");
// gui.add(camera2.position, "y").min(-100).max(50).step(1).name("Dir Y pos");
// gui.add(camera.position, "z").min(-20).max(50).step(0.5).name("Dir Z pos");
// gui
//   .add(camera.rotation, "x")
//   .min(-Math.PI / 2)
//   .max(Math.PI / 2)
//   .step(0.02)
//   .name("ROT X pos");
// gui.add(camera.rotation, "y").step(0.1).name("Rot Y Cam3");
// gui.add(camera.rotation, "z").step(0.1).name("Rot Z Cam3");
// // gui.add(camera.position, "y").min(-20).max(20).step(0.1).name("elevation");

// gui
//   .add(testgeometry.position, "y")
//   .min(-20)
//   .max(50)
//   .step(0.5)
//   .name("Dir X pos");
