import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createRotationDemo } from './rotation.js';
import { createScaleDemo } from './scale.js';
import { createShearDemo } from './shear.js';
import { createTranslationDemo } from './translation.js';

const sceneHost = document.querySelector('#scene');

if (!sceneHost) {
  throw new Error('Контейнер Three.js-сцени не знайдено.');
}

const playButton = document.querySelector('#play-button');
const playIcon = playButton.querySelector('.button-icon');
const playLabel = playButton.querySelector('.button-label');
const restartButton = document.querySelector('#restart-button');
const panelToggleButton = document.querySelector('#panel-toggle-button');
const panelToggleLabel = panelToggleButton.querySelector('.panel-toggle-label');
const speedSelect = document.querySelector('#speed-select');
const status = document.querySelector('.status');
const statusText = document.querySelector('#status-text');
const exampleButtons = document.querySelectorAll('[data-example]');
const progressFill = document.querySelector('#progress-fill');

const matrixOutputs = Array.from({ length: 4 }, (_, row) =>
  Array.from({ length: 4 }, (_, column) =>
    document.querySelector(`#m${row}${column}`),
  ),
);

const ui = {
  demoTitle: document.querySelector('#demo-title'),
  demoDescription: document.querySelector('#demo-description'),
  demoLayout: document.querySelector('#demo-layout'),
  mathPanel: document.querySelector('#math-panel'),
  parameterTitle: document.querySelector('#parameter-title'),
  parameterSymbol: document.querySelector('#parameter-symbol'),
  parameterValue: document.querySelector('#t-value'),
  progressTrack: document.querySelector('.progress-track'),
  formulaTitle: document.querySelector('#formula-title'),
  formula: document.querySelector('#formula'),
  formulaDetail: document.querySelector('#formula-detail'),
  readoutTitle: document.querySelector('#readout-title'),
  positionReadout: document.querySelector('.position-readout'),
  valueLabels: [
    document.querySelector('#value-label-1'),
    document.querySelector('#value-label-2'),
    document.querySelector('#value-label-3'),
  ],
  values: [
    document.querySelector('#value-1'),
    document.querySelector('#value-2'),
    document.querySelector('#value-3'),
  ],
  matrixTitle: document.querySelector('#matrix-title'),
  matrixGrid: document.querySelector('#matrix-grid'),
  matrixCaption: document.querySelector('#matrix-caption'),
  loopNote: document.querySelector('#loop-note'),
  axisLabel: document.querySelector('#label-axis'),
};

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
camera.position.set(4.4, 3.4, 5.2);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
sceneHost.prepend(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.enablePan = false;
controls.minDistance = 4.5;
controls.maxDistance = 10;
controls.maxPolarAngle = Math.PI * 0.48;
controls.target.set(0, -0.12, 0);

scene.add(new THREE.HemisphereLight(0xb9caff, 0x111522, 2.1));

const keyLight = new THREE.DirectionalLight(0xffffff, 3.8);
keyLight.position.set(2.5, 5, 3.5);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(1024, 1024);
keyLight.shadow.camera.left = -4;
keyLight.shadow.camera.right = 4;
keyLight.shadow.camera.top = 4;
keyLight.shadow.camera.bottom = -4;
scene.add(keyLight);

const fillLight = new THREE.PointLight(0x5577ff, 8, 12, 2);
fillLight.position.set(-3, 2, -2);
scene.add(fillLight);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(9, 9),
  new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.24 }),
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.51;
floor.receiveShadow = true;
scene.add(floor);

const grid = new THREE.GridHelper(7, 14, 0x64748b, 0x7A8392);
grid.position.y = -0.5;
grid.material.transparent = true;
grid.material.opacity = 0.48;
scene.add(grid);

const axes = new THREE.AxesHelper(2.65);
axes.position.y = -0.485;
axes.material.transparent = true;
axes.material.opacity = 0.72;
scene.add(axes);

const cubeGeometry = new THREE.BoxGeometry(0.82, 0.82, 0.82);
const cubeMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x4f6fe8,
  metalness: 0.05,
  roughness: 0.16,
  transmission: 0.08,
  transparent: true,
  opacity: 0.52,
  side: THREE.DoubleSide,
  depthWrite: false,
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.castShadow = true;
scene.add(cube);

const cubeEdges = new THREE.LineSegments(
  new THREE.EdgesGeometry(cubeGeometry),
  new THREE.LineBasicMaterial({ color: 0x2949ad, transparent: true, opacity: 0.9 }),
);
cube.add(cubeEdges);

const formatter = new Intl.NumberFormat('uk-UA', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatNumber(value) {
  const normalizedValue = Math.abs(value) < 1e-10 ? 0 : value;
  return formatter.format(normalizedValue);
}

function setMatrix(rows) {
  rows.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      matrixOutputs[rowIndex][columnIndex].value = value;
    });
  });
}

function projectLabel(element, worldPosition) {
  const projected = worldPosition.clone().project(camera);
  const x = (projected.x * 0.5 + 0.5) * sceneHost.clientWidth;
  const y = (-projected.y * 0.5 + 0.5) * sceneHost.clientHeight;
  element.style.transform = `translate(-50%, calc(-100% - 0.8rem)) translate(${x}px, ${y}px)`;
  element.hidden = projected.z < -1 || projected.z > 1;
}

const demoContext = {
  scene,
  cube,
  ui,
  formatNumber,
  setMatrix,
  projectLabel,
};
const demos = {
  translation: createTranslationDemo(demoContext),
  rotation: createRotationDemo(demoContext),
  scale: createScaleDemo(demoContext),
  shear: createShearDemo(demoContext),
};

const animationDuration = 4;
const endPauseDuration = 0.85;
let activeDemo = null;
let elapsed = 0;
let speed = 1;
let isPlaying = true;
let isMathPanelHidden = false;
let previousTime = performance.now();

function setPlaybackState(playing) {
  isPlaying = playing;
  playIcon.textContent = playing ? 'Ⅱ' : '▶';
  playLabel.textContent = playing ? 'Пауза' : 'Продовжити';
  playButton.setAttribute('aria-pressed', String(!playing));
  status.classList.toggle('is-paused', !playing);
  statusText.textContent = playing
    ? activeDemo.statusText
    : 'Анімацію призупинено';
}

function updateReadout(t) {
  activeDemo.update(t);
  progressFill.style.width = `${t * 100}%`;
  ui.progressTrack.setAttribute('aria-valuenow', t.toFixed(2));
}

function setExample(example) {
  const nextDemo = demos[example];
  if (!nextDemo) return;

  activeDemo?.deactivate();
  activeDemo = nextDemo;
  elapsed = 0;
  activeDemo.activate();

  exampleButtons.forEach((button) => {
    const isActive = button.dataset.example === example;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  updateReadout(0);
  setPlaybackState(true);
}

function updateLabels() {
  activeDemo?.updateLabels();
}

function resizeRenderer() {
  const width = sceneHost.clientWidth;
  const height = sceneHost.clientHeight;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  updateLabels();
}

function setMathPanelVisibility(hidden) {
  isMathPanelHidden = hidden;
  ui.mathPanel.hidden = hidden;
  ui.demoLayout.classList.toggle('is-panel-hidden', hidden);
  panelToggleButton.setAttribute('aria-expanded', String(!hidden));
  panelToggleLabel.textContent = hidden ? 'Показати панель' : 'Сховати панель';
  requestAnimationFrame(resizeRenderer);
}

function animate(now) {
  const deltaSeconds = Math.min((now - previousTime) / 1000, 0.1);
  previousTime = now;

  if (isPlaying) {
    elapsed += deltaSeconds * speed;
    const cycleDuration = animationDuration + endPauseDuration;
    if (elapsed >= cycleDuration) elapsed %= cycleDuration;
  }

  const t = Math.min(elapsed / animationDuration, 1);
  updateReadout(t);
  controls.update();
  updateLabels();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

playButton.addEventListener('click', () => {
  setPlaybackState(!isPlaying);
});

restartButton.addEventListener('click', () => {
  elapsed = 0;
  setPlaybackState(true);
  updateReadout(0);
});

panelToggleButton.addEventListener('click', () => {
  setMathPanelVisibility(!isMathPanelHidden);
});

speedSelect.addEventListener('change', () => {
  speed = Number(speedSelect.value);
});

exampleButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setExample(button.dataset.example);
  });
});

window.addEventListener('keydown', (event) => {
  if (event.code === 'Space' && event.target === document.body) {
    event.preventDefault();
    setPlaybackState(!isPlaying);
  }
});

const resizeObserver = new ResizeObserver(resizeRenderer);
resizeObserver.observe(sceneHost);

setExample('translation');
resizeRenderer();
requestAnimationFrame(animate);
