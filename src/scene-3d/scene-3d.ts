import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import type { Mesh, Intersection } from 'three';

const container = document.getElementById('scene-3d');
if (!container) throw new Error('#scene-3d not found');

function getSize(): { w: number; h: number } {
  const w = container!.clientWidth || 640;
  const h = container!.clientHeight || 480;
  return { w, h };
}

let containerW: number;
let containerH: number;

container.addEventListener('contextmenu', (e) => e.preventDefault());
container.addEventListener('mousedown', onDocumentMouseDown, false);
container.addEventListener('mousemove', onDocumentMouseMove, false);
container.addEventListener('mouseup', onDocumentMouseUp, false);
container.addEventListener('touchstart', onDocumentMouseDown as EventListener, false);
container.addEventListener('touchmove', onDocumentMouseMove as EventListener, false);
container.addEventListener('touchend', onDocumentMouseUp as EventListener, false);

const shadowExtent = 5;

const canvas = document.createElement('canvas');
const context = canvas.getContext('webgl2', { antialias: true });
if (!context) throw new Error('WebGL2 not supported');

const renderer = new THREE.WebGLRenderer({
  canvas,
  context,
  preserveDrawingBuffer: true,
});
renderer.localClippingEnabled = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setPixelRatio(window.devicePixelRatio);

container.appendChild(renderer.domElement);

const fallback = container.querySelector('.scene-3d-fallback');
if (fallback) fallback.remove();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const light_1 = new THREE.AmbientLight(0xffffff, 4.7);
scene.add(light_1);

const light_2 = new THREE.DirectionalLight(0xffffff, 6.3);
light_2.position.set(0, 10, 0);
light_2.lookAt(0, 0, 0);
light_2.castShadow = true;
light_2.shadow.mapSize.width = 2048;
light_2.shadow.mapSize.height = 2048;
light_2.shadow.camera.left = -shadowExtent;
light_2.shadow.camera.right = shadowExtent;
light_2.shadow.camera.top = shadowExtent;
light_2.shadow.camera.bottom = -shadowExtent;
light_2.shadow.camera.near = 0;
light_2.shadow.camera.far = 3500;
scene.add(light_2);

const { w: initW, h: initH } = getSize();
containerW = initW;
containerH = initH;
const camera = new THREE.PerspectiveCamera(65, containerW / containerH || 4 / 3, 0.2, 1000);
(camera.rotation as THREE.Euler).order = 'YZX';
camera.position.set(8, 6, 8);
const centerCam = new THREE.Vector3(0, 2, -2);
camera.lookAt(centerCam);

function resize(): void {
  const { w, h } = getSize();
  containerW = w;
  containerH = h;
  renderer.setSize(w, h);
  camera.aspect = w / h || 1;
  camera.updateProjectionMatrix();
}
resize();
new ResizeObserver(resize).observe(container);

let theta = 45;
const radius = 14;

function createGrid(): void {
  const count_grid1 = 100;
  const count_grid2 = count_grid1 / 2;
  const linesMaterial = new THREE.LineBasicMaterial({
    color: 0xd6d6d6,
    opacity: 1,
  });

  for (let i = 0; i <= count_grid1; i++) {
    const points1 = [
      new THREE.Vector3(-count_grid2, 0, 0),
      new THREE.Vector3(count_grid2, 0, 0),
    ];
    const geom1 = new THREE.BufferGeometry().setFromPoints(points1);
    const line1 = new THREE.Line(geom1, linesMaterial);
    line1.position.z = i - count_grid2;
    line1.position.y = -0.01;
    scene.add(line1);

    const points2 = [
      new THREE.Vector3(-count_grid2, 0, 0),
      new THREE.Vector3(count_grid2, 0, 0),
    ];
    const geom2 = new THREE.BufferGeometry().setFromPoints(points2);
    const line2 = new THREE.Line(geom2, linesMaterial);
    line2.position.x = i - count_grid2;
    line2.position.y = -0.01;
    line2.rotation.y = (90 * Math.PI) / 180;
    scene.add(line2);
  }
}

createGrid();

new MTLLoader().load('/js/house_2.mtl', (materials) => {
  materials.preload();
  new OBJLoader()
    .setMaterials(materials)
    .load('/js/house_2.obj', (object) => {
      object.position.set(-7, 0, 4);
      scene.add(object);
    });
});

let isMouseDown2 = false;
let isMouseDown3 = false;
const planeMath = createPlaneMath();
const onMouseDownPosition = { x: 0, y: 0 };
let onMouseDownPhi = 0;
let onMouseDownTheta = 0;
const raycaster = new THREE.Raycaster();
let clickPos: THREE.Vector3 | null = null;

function createPlaneMath(): Mesh {
  const geometry = new THREE.PlaneGeometry(10000, 10000);
  const mat_pm = new THREE.MeshLambertMaterial({
    color: 0xffff00,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
  });
  mat_pm.visible = false;
  const plane = new THREE.Mesh(geometry, mat_pm);
  plane.rotation.set(-Math.PI / 2, 0, 0);
  scene.add(plane);
  return plane;
}

function rayIntersect(
  event: MouseEvent | TouchEvent,
  obj: THREE.Object3D,
  mode: 'single' | 'recursive'
): Intersection[] {
  const ev = 'clientX' in event ? event : (event as TouchEvent).changedTouches[0];
  const rect = container!.getBoundingClientRect();
  const mouse = new THREE.Vector2(
    ((ev.clientX - rect.left) / rect.width) * 2 - 1,
    -((ev.clientY - rect.top) / rect.height) * 2 + 1
  );
  raycaster.setFromCamera(mouse, camera);
  return mode === 'single'
    ? raycaster.intersectObject(obj)
    : raycaster.intersectObjects([obj], true);
}

function onDocumentMouseDown(event: MouseEvent | TouchEvent): void {
  const ev = event as MouseEvent & { changedTouches?: TouchList };
  const clientX = ev.changedTouches ? ev.changedTouches[0].clientX : ev.clientX;
  const clientY = ev.changedTouches ? ev.changedTouches[0].clientY : ev.clientY;
  const button = ev.changedTouches ? 0 : ev.button;

  let mouseBtn = 'left';
  if (button === 1 || button === 2) mouseBtn = 'right';

  onMouseDownPosition.x = clientX;
  onMouseDownPosition.y = clientY;

  if (mouseBtn === 'left') {
    const dir = new THREE.Vector3()
      .subVectors(centerCam, camera.position)
      .normalize();
    let degree =
      THREE.MathUtils.radToDeg(
        dir.angleTo(new THREE.Vector3(dir.x, 0, dir.z))
      ) * 2;
    if (dir.y > 0) degree *= -1;
    onMouseDownPhi = degree;

    dir.y = 0;
    dir.normalize();
    onMouseDownTheta =
      THREE.MathUtils.radToDeg(Math.atan2(dir.x, dir.z) - Math.PI) * 2;

    isMouseDown2 = true;
  } else if (mouseBtn === 'right') {
    isMouseDown3 = true;
    planeMath.position.copy(centerCam);
    planeMath.rotation.copy(camera.rotation);
    planeMath.updateMatrixWorld();

    const intersects = rayIntersect(event, planeMath, 'single');
    if (intersects.length > 0) {
      clickPos = intersects[0].point.clone();
    }
  }
}

function onDocumentMouseMove(event: MouseEvent | TouchEvent): void {
  const ev = event as MouseEvent & { changedTouches?: TouchList };
  if (ev.changedTouches) {
    isMouseDown2 = true;
  }
  cameraMove3D(event);
}

function onDocumentMouseUp(): void {
  isMouseDown2 = false;
  isMouseDown3 = false;
}

function cameraMove3D(event: MouseEvent | TouchEvent): void {
  const ev = event as MouseEvent & { changedTouches?: TouchList };
  const clientX = ev.changedTouches ? ev.changedTouches[0].clientX : ev.clientX;
  const clientY = ev.changedTouches ? ev.changedTouches[0].clientY : ev.clientY;

  if (isMouseDown2) {
    const distance = centerCam.distanceTo(camera.position);
    theta = -(clientX - onMouseDownPosition.x) * 0.5 + onMouseDownTheta;
    let phi = (clientY - onMouseDownPosition.y) * 0.5 + onMouseDownPhi;
    phi = Math.min(180, Math.max(-80, phi));

    camera.position.x =
      distance *
      Math.sin((theta * Math.PI) / 360) *
      Math.cos((phi * Math.PI) / 360);
    camera.position.y = distance * Math.sin((phi * Math.PI) / 360);
    camera.position.z =
      distance *
      Math.cos((theta * Math.PI) / 360) *
      Math.cos((phi * Math.PI) / 360);

    camera.position.add(centerCam);
    camera.lookAt(centerCam);
  }
  if (isMouseDown3 && clickPos) {
    const intersects = rayIntersect(event, planeMath, 'single');
    if (intersects.length > 0) {
      const offset = new THREE.Vector3().subVectors(
        clickPos,
        intersects[0].point
      );
      camera.position.add(offset);
      centerCam.add(offset);
      clickPos.copy(intersects[0].point);
    }
  }
}

function animate(): void {
  requestAnimationFrame(animate);
  if (!isMouseDown2 && !isMouseDown3) {
    theta += 0.1;
    camera.position.x = radius * Math.sin(THREE.MathUtils.degToRad(theta));
    camera.position.z = radius * Math.cos(THREE.MathUtils.degToRad(theta));
    camera.lookAt(centerCam);
  }
  renderer.render(scene, camera);
}

animate();
