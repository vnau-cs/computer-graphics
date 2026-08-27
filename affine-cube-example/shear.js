import * as THREE from 'three';

const MIN_SHEAR = 0;
const MAX_SHEAR = 1;

export function createShearDemo({
  cube,
  ui,
  formatNumber,
  setMatrix,
}) {
  const shearMatrix = new THREE.Matrix4();

  function activate() {
    ui.axisLabel.hidden = true;
    ui.positionReadout.classList.remove('is-rotation');
    ui.demoTitle.textContent = 'Скошування вздовж осі X';
    ui.demoDescription.innerHTML =
      'Координата <strong>X</strong> кожної вершини змінюється пропорційно її координаті <strong>Y</strong>: <strong>x′ = x + ky</strong>. Центр куба залишається в <strong>O = (0, 0, 0)</strong>.';
    ui.demoLayout.setAttribute(
      'aria-label',
      'Демонстрація скошування куба вздовж осі X',
    );
    ui.mathPanel.setAttribute(
      'aria-label',
      'Математичний опис скошування куба',
    );
    ui.parameterTitle.textContent = '01 · Коефіцієнт скошування';
    ui.parameterSymbol.textContent = 'k =';
    ui.progressTrack.setAttribute('aria-label', 'Прогрес скошування');
    ui.formulaTitle.textContent = '02 · Перетворення координат';
    ui.formula.textContent = 'x′ = x + ky';
    ui.formulaDetail.innerHTML = 'y′ = y, &nbsp; z′ = z, &nbsp; k ∈ [0; 1]';
    ui.readoutTitle.textContent = '03 · Коефіцієнти shear';
    ui.valueLabels[0].textContent = 'xy';
    ui.valueLabels[1].textContent = 'yz';
    ui.valueLabels[2].textContent = 'zx';
    ui.matrixTitle.textContent = '04 · Матриця скошування Hₓᵧ(k)';
    ui.matrixGrid.setAttribute(
      'aria-label',
      'Матриця скошування вздовж осі X чотири на чотири',
    );
    ui.matrixCaption.textContent = 'x′ = x + ky';
    ui.loopNote.textContent =
      'Після досягнення коефіцієнта 1 анімація автоматично починається з 0.';
  }

  function deactivate() {
    ui.axisLabel.hidden = true;
    cube.matrixAutoUpdate = true;
    cube.position.set(0, 0, 0);
    cube.rotation.set(0, 0, 0);
    cube.scale.set(1, 1, 1);
    cube.updateMatrix();
    cube.matrixWorldNeedsUpdate = true;
  }

  function update(t) {
    const shear = MIN_SHEAR + (MAX_SHEAR - MIN_SHEAR) * t;
    const formattedShear = formatNumber(shear);

    shearMatrix.set(
      1, shear, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    );
    cube.matrixAutoUpdate = false;
    cube.matrix.copy(shearMatrix);
    cube.matrixWorldNeedsUpdate = true;

    ui.parameterValue.value = formattedShear;
    ui.values[0].value = formattedShear;
    ui.values[1].value = formatNumber(0);
    ui.values[2].value = formatNumber(0);
    setMatrix([
      ['1', formattedShear, '0', '0'],
      ['0', '1', '0', '0'],
      ['0', '0', '1', '0'],
      ['0', '0', '0', '1'],
    ]);
  }

  function updateLabels() {
    ui.axisLabel.hidden = true;
  }

  return {
    statusText: 'Куб скошується',
    activate,
    deactivate,
    update,
    updateLabels,
  };
}
