const MIN_SCALE = 0.5;
const MAX_SCALE = 1.5;

export function createScaleDemo({
  cube,
  ui,
  formatNumber,
  setMatrix,
}) {
  function activate() {
    ui.axisLabel.hidden = true;
    ui.positionReadout.classList.remove('is-rotation');
    ui.demoTitle.textContent = 'Масштабування відносно початку координат';
    ui.demoDescription.innerHTML =
      'Центр куба залишається в точці <strong>O = (0, 0, 0)</strong>, а рівномірний масштаб змінюється від <strong>0,5</strong> до <strong>1,5</strong>.';
    ui.demoLayout.setAttribute(
      'aria-label',
      'Демонстрація рівномірного масштабування куба',
    );
    ui.mathPanel.setAttribute(
      'aria-label',
      'Математичний опис рівномірного масштабування',
    );
    ui.parameterTitle.textContent = '01 · Коефіцієнт масштабу';
    ui.parameterSymbol.textContent = 's =';
    ui.progressTrack.setAttribute('aria-label', 'Прогрес масштабування');
    ui.formulaTitle.textContent = '02 · Залежність масштабу від часу';
    ui.formula.textContent = 's(t) = 0,5 + t';
    ui.formulaDetail.innerHTML = 'p′ = S(s) · p, &nbsp; s ∈ [0,5; 1,5]';
    ui.readoutTitle.textContent = '03 · Масштаб уздовж осей';
    ui.valueLabels[0].textContent = 'x';
    ui.valueLabels[1].textContent = 'y';
    ui.valueLabels[2].textContent = 'z';
    ui.matrixTitle.textContent = '04 · Матриця масштабування S(s)';
    ui.matrixGrid.setAttribute(
      'aria-label',
      'Матриця рівномірного масштабування чотири на чотири',
    );
    ui.matrixCaption.textContent = 's(t) = 0,5 + t';
    ui.loopNote.textContent =
      'Після досягнення масштабу 1,5 анімація автоматично починається з 0,5.';
  }

  function deactivate() {
    ui.axisLabel.hidden = true;
  }

  function update(t) {
    const scale = MIN_SCALE + (MAX_SCALE - MIN_SCALE) * t;
    const formattedScale = formatNumber(scale);

    cube.matrixAutoUpdate = true;
    cube.position.set(0, 0, 0);
    cube.rotation.set(0, 0, 0);
    cube.scale.setScalar(scale);

    ui.parameterValue.value = formattedScale;
    ui.values[0].value = formattedScale;
    ui.values[1].value = formattedScale;
    ui.values[2].value = formattedScale;
    setMatrix([
      [formattedScale, '0', '0', '0'],
      ['0', formattedScale, '0', '0'],
      ['0', '0', formattedScale, '0'],
      ['0', '0', '0', '1'],
    ]);
  }

  function updateLabels() {
    ui.axisLabel.hidden = true;
  }

  return {
    statusText: 'Куб масштабується',
    activate,
    deactivate,
    update,
    updateLabels,
  };
}
