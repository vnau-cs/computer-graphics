import * as THREE from 'three';

const START = new THREE.Vector3(-1, 0, -1);
const END = new THREE.Vector3(1, 0, 1);

function createEndpoint(position, color) {
  const group = new THREE.Group();
  group.position.copy(position);

  const dot = new THREE.Mesh(
    new THREE.SphereGeometry(0.075, 24, 16),
    new THREE.MeshBasicMaterial({ color }),
  );
  group.add(dot);

  const stemGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, -0.49, 0),
    new THREE.Vector3(0, -0.08, 0),
  ]);
  const stem = new THREE.Line(
    stemGeometry,
    new THREE.LineDashedMaterial({
      color,
      dashSize: 0.055,
      gapSize: 0.035,
      transparent: true,
      opacity: 0.52,
    }),
  );
  stem.computeLineDistances();
  group.add(stem);

  return group;
}

export function createTranslationDemo({
  scene,
  cube,
  ui,
  formatNumber,
  setMatrix,
  projectLabel,
}) {
  const helpers = new THREE.Group();
  helpers.add(createEndpoint(START, 0xd96520));
  helpers.add(createEndpoint(END, 0x12825d));
  helpers.visible = false;
  scene.add(helpers);

  const currentPosition = new THREE.Vector3();
  const labels = [
    {
      element: document.querySelector('#label-start'),
      position: new THREE.Vector3(-1, 0.62, -1),
    },
    {
      element: document.querySelector('#label-end'),
      position: new THREE.Vector3(1, 0.62, 1),
    },
  ];

  function activate() {
    helpers.visible = true;
    ui.positionReadout.classList.remove('is-rotation');
    ui.demoTitle.textContent = 'Перенесення у просторі';
    ui.demoDescription.innerHTML =
      'Центр куба рухається вздовж відрізка від <strong>P₀ = (−1, 0, −1)</strong> до <strong>P₁ = (1, 0, 1)</strong>.';
    ui.demoLayout.setAttribute('aria-label', 'Демонстрація перенесення куба');
    ui.mathPanel.setAttribute('aria-label', 'Математичний опис перенесення');
    ui.parameterTitle.textContent = '01 · Параметр руху';
    ui.parameterSymbol.textContent = 't =';
    ui.progressTrack.setAttribute('aria-label', 'Прогрес перенесення');
    ui.formulaTitle.textContent = '02 · Лінійна інтерполяція';
    ui.formula.textContent = 'P(t) = P₀ + t(P₁ − P₀)';
    ui.formulaDetail.innerHTML =
      'P(t) = (−1 + 2t, <span class="muted">0</span>, −1 + 2t)';
    ui.readoutTitle.textContent = '03 · Поточна позиція';
    ui.valueLabels[0].textContent = 'x';
    ui.valueLabels[1].textContent = 'y';
    ui.valueLabels[2].textContent = 'z';
    ui.matrixTitle.textContent = '04 · Матриця перенесення T(Δ)';
    ui.matrixGrid.setAttribute(
      'aria-label',
      'Матриця перенесення чотири на чотири',
    );
    ui.matrixCaption.textContent = 'Δ(t) = (2t, 0, 2t)';
    ui.loopNote.textContent =
      'Після досягнення P₁ анімація автоматично починається з P₀.';
  }

  function deactivate() {
    helpers.visible = false;
    labels.forEach(({ element }) => {
      element.hidden = true;
    });
  }

  function update(t) {
    cube.matrixAutoUpdate = true;
    currentPosition.lerpVectors(START, END, t);
    cube.position.copy(currentPosition);
    cube.rotation.set(0, 0, 0);
    cube.scale.set(1, 1, 1);

    const delta = 2 * t;
    ui.parameterValue.value = formatNumber(t);
    ui.values[0].value = formatNumber(currentPosition.x);
    ui.values[1].value = formatNumber(currentPosition.y);
    ui.values[2].value = formatNumber(currentPosition.z);
    setMatrix([
      ['1', '0', '0', formatNumber(delta)],
      ['0', '1', '0', '0'],
      ['0', '0', '1', formatNumber(delta)],
      ['0', '0', '0', '1'],
    ]);
  }

  function updateLabels() {
    labels.forEach(({ element, position }) => projectLabel(element, position));
    ui.axisLabel.hidden = true;
  }

  return {
    statusText: 'Куб переміщується',
    activate,
    deactivate,
    update,
    updateLabels,
  };
}
