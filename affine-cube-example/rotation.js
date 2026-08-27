import * as THREE from 'three';

export function createRotationDemo({
  scene,
  cube,
  ui,
  formatNumber,
  setMatrix,
  projectLabel,
}) {
  const helpers = new THREE.Group();
  helpers.visible = false;
  scene.add(helpers);

  const yAxisGuide = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -0.49, 0),
      new THREE.Vector3(0, 1.55, 0),
    ]),
    new THREE.LineBasicMaterial({
      color: 0x12825d,
      transparent: true,
      opacity: 0.9,
    }),
  );
  helpers.add(yAxisGuide);

  function activate() {
    helpers.visible = true;
    ui.positionReadout.classList.add('is-rotation');
    ui.demoTitle.textContent = 'Обертання навколо осі Y';
    ui.demoDescription.innerHTML =
      'Куб із центром у <strong>O = (0, 0, 0)</strong> виконує повний оберт на <strong>360°</strong> навколо осі <strong>Y</strong>.';
    ui.demoLayout.setAttribute(
      'aria-label',
      'Демонстрація обертання куба навколо осі Y',
    );
    ui.mathPanel.setAttribute(
      'aria-label',
      'Математичний опис обертання навколо осі Y',
    );
    ui.parameterTitle.textContent = '01 · Кут обертання';
    ui.parameterSymbol.textContent = 'θ =';
    ui.progressTrack.setAttribute('aria-label', 'Прогрес повного оберту');
    ui.formulaTitle.textContent = '02 · Залежність кута від часу';
    ui.formula.textContent = 'θ(t) = 2πt';
    ui.formulaDetail.innerHTML = 'p′ = R<sub>y</sub>(θ) · p, &nbsp; t ∈ [0, 1]';
    ui.readoutTitle.textContent = '03 · Поточні значення';
    ui.valueLabels[0].textContent = 'θ';
    ui.valueLabels[1].textContent = 'sin';
    ui.valueLabels[2].textContent = 'cos';
    ui.matrixTitle.textContent = '04 · Матриця обертання Rᵧ(θ)';
    ui.matrixGrid.setAttribute(
      'aria-label',
      'Матриця обертання навколо осі Y чотири на чотири',
    );
    ui.matrixCaption.textContent = 'θ(t) = 2πt';
    ui.loopNote.textContent =
      'Після повного оберту анімація автоматично починається з кута 0°.';
  }

  function deactivate() {
    helpers.visible = false;
    ui.axisLabel.hidden = true;
  }

  function update(t) {
    const angle = t * Math.PI * 2;
    const angleDegrees = t * 360;
    const sine = Math.sin(angle);
    const cosine = Math.cos(angle);

    cube.matrixAutoUpdate = true;
    cube.position.set(0, 0, 0);
    cube.rotation.set(0, angle, 0);
    cube.scale.set(1, 1, 1);

    ui.parameterValue.value = `${formatNumber(angleDegrees)}°`;
    ui.values[0].value = `${formatNumber(angleDegrees)}°`;
    ui.values[1].value = formatNumber(sine);
    ui.values[2].value = formatNumber(cosine);
    setMatrix([
      [formatNumber(cosine), '0', formatNumber(sine), '0'],
      ['0', '1', '0', '0'],
      [formatNumber(-sine), '0', formatNumber(cosine), '0'],
      ['0', '0', '0', '1'],
    ]);
  }

  function updateLabels() {
    projectLabel(ui.axisLabel, new THREE.Vector3(0, 1.72, 0));
  }

  return {
    statusText: 'Куб обертається',
    activate,
    deactivate,
    update,
    updateLabels,
  };
}
