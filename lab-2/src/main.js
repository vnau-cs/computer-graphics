import './style.css';

const canvas = document.querySelector('#image-canvas');
const applyEffectButton = document.querySelector('#apply-effect-button');
const resetImageButton = document.querySelector('#reset-image-button');
const imageStatus = document.querySelector('#image-status');
const context = canvas.getContext('2d');

if (!context) {
  throw new Error('Не вдалося отримати двовимірний контекст Canvas.');
}

function drawInitialImage() {
  const { width, height } = canvas;
  const imageData = context.createImageData(width, height);
  const pixels = imageData.data;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const pixelIndex = 4 * (y * width + x);

      // TODO: обчисліть значення каналів відповідно до свого варіанта.
      // pixels[pixelIndex] = ...;     // R: змінюється вздовж осі x
      // pixels[pixelIndex + 1] = ...; // G: змінюється вздовж осі y
      // pixels[pixelIndex + 2] = ...; // B: власне правило
      // pixels[pixelIndex + 3] = ...; // A: 0–255, є прозора ділянка
    }
  }

  context.putImageData(imageData, 0, 0);
}

function applyEffect() {
  const { width, height } = canvas;
  const imageData = context.getImageData(0, 0, width, height);
  const pixels = imageData.data;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const pixelIndex = 4 * (y * width + x);

      // TODO: прочитайте поточні R, G, B, A та змініть потрібні канали.
      // const red = pixels[pixelIndex];
      // const green = pixels[pixelIndex + 1];
      // const blue = pixels[pixelIndex + 2];
      // const alpha = pixels[pixelIndex + 3];
    }
  }

  context.putImageData(imageData, 0, 0);
  imageStatus.textContent = 'Ефект застосовано.';
}

function resetImage() {
  drawInitialImage();
  imageStatus.textContent = 'Початкове зображення відновлено.';
}

applyEffectButton.addEventListener('click', applyEffect);
resetImageButton.addEventListener('click', resetImage);

drawInitialImage();
