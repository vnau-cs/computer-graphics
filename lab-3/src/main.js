import './style.css';

const canvas = document.querySelector('#raster-canvas');
const exampleSelect = document.querySelector('#example-select');
const rasterizeButton = document.querySelector('#rasterize-button');
const overlayToggle = document.querySelector('#overlay-toggle');
const renderStatus = document.querySelector('#render-status');
const verticesValue = document.querySelector('#vertices-value');
const boundsValue = document.querySelector('#bounds-value');
const coveredPixelsValue = document.querySelector('#covered-pixels-value');
const context = canvas.getContext('2d');

if (!context) {
  throw new Error('Не вдалося отримати двовимірний контекст Canvas.');
}

// TODO: замініть номер, координати й кольори відповідно до таблиці варіантів
// у файлі lab-3.md. Усі контрольні приклади використовують ці налаштування.
const VARIANT = {
  number: 1,
  backgroundColor: [241, 245, 249, 255],
  triangleColor: [37, 99, 235, 255],
  vertices: [
    { x: 110, y: 90 },
    { x: 530, y: 150 },
    { x: 250, y: 410 },
  ],
};

const BACKGROUND_COLOR = VARIANT.backgroundColor;
const TRIANGLE_COLOR = VARIANT.triangleColor;

const examples = {
  regular: {
    label: 'Звичайний трикутник',
    vertices: VARIANT.vertices,
  },
  reversed: {
    label: 'Зворотний порядок вершин',
    vertices: [
      VARIANT.vertices[0],
      VARIANT.vertices[2],
      VARIANT.vertices[1],
    ],
  },
  clipped: {
    label: 'Частково поза межами Canvas',
    vertices: [
      { x: -80, y: 120 },
      { x: 360, y: -60 },
      { x: 700, y: 420 },
    ],
  },
  degenerate: {
    label: 'Вироджений трикутник',
    vertices: [
      { x: 100, y: 100 },
      { x: 320, y: 240 },
      { x: 540, y: 380 },
    ],
  },
};

function fillImageData(imageData, color) {
  const pixels = imageData.data;

  for (let pixelIndex = 0; pixelIndex < pixels.length; pixelIndex += 4) {
    pixels[pixelIndex] = color[0];
    pixels[pixelIndex + 1] = color[1];
    pixels[pixelIndex + 2] = color[2];
    pixels[pixelIndex + 3] = color[3];
  }
}

function setPixel(imageData, x, y, color) {
  const { width, height, data: pixels } = imageData;

  if (x < 0 || x >= width || y < 0 || y >= height) {
    return;
  }

  const pixelIndex = 4 * (y * width + x);
  pixels[pixelIndex] = color[0];
  pixels[pixelIndex + 1] = color[1];
  pixels[pixelIndex + 2] = color[2];
  pixels[pixelIndex + 3] = color[3];
}

function edgeFunction(start, end, point) {
  // TODO: поверніть орієнтовану площу паралелограма для трьох точок.
  // Функція потрібна для площі трикутника та coverage test.
}

function getClampedBoundingBox(vertices, width, height) {
  // TODO: знайдіть minX, minY, maxX і maxY для трьох вершин.
  // Округліть межі та обмежте їх діапазонами 0..width-1 і 0..height-1.
}

function isPointInsideTriangle(point, vertices, signedArea) {
  // TODO: обчисліть три барицентричні координати або значення ребер.
  // Перевірка має працювати для обох порядків обходу вершин і для межі.
}

function rasterizeTriangle(vertices) {
  const { width, height } = canvas;
  const imageData = context.createImageData(width, height);
  fillImageData(imageData, BACKGROUND_COLOR);

  // TODO: обчисліть орієнтовану площу трикутника.
  // TODO: якщо трикутник вироджений, не запускайте цикл растеризації.
  // TODO: обчисліть обмежувальний прямокутник.
  // TODO: обійдіть його пікселі подвійним циклом.
  // TODO: перевіряйте точки (x + 0.5, y + 0.5).
  // TODO: для покритих пікселів викликайте setPixel з TRIANGLE_COLOR.
  // TODO: поверніть фактичні boundingBox, coveredPixels і isDegenerate.

  context.putImageData(imageData, 0, 0);

  return {
    state: 'not-implemented',
    boundingBox: null,
    coveredPixels: null,
    isDegenerate: null,
  };
}

function drawValidationOverlay(vertices) {
  context.save();
  context.strokeStyle = '#dc2626';
  context.fillStyle = '#dc2626';
  context.lineWidth = 2;
  context.setLineDash([7, 5]);

  context.beginPath();
  context.moveTo(vertices[0].x, vertices[0].y);
  context.lineTo(vertices[1].x, vertices[1].y);
  context.lineTo(vertices[2].x, vertices[2].y);
  context.closePath();
  context.stroke();

  context.setLineDash([]);

  for (const vertex of vertices) {
    context.beginPath();
    context.arc(vertex.x, vertex.y, 5, 0, Math.PI * 2);
    context.fill();
  }

  context.restore();
}

function formatVertices(vertices) {
  return vertices
    .map((vertex, index) => {
      const name = String.fromCharCode(65 + index);
      return `${name}(${vertex.x}, ${vertex.y})`;
    })
    .join(', ');
}

function formatBoundingBox(boundingBox) {
  if (!boundingBox) {
    return '—';
  }

  const { minX, minY, maxX, maxY } = boundingBox;
  return `x: ${minX}…${maxX}, y: ${minY}…${maxY}`;
}

function updateStatus(example, result) {
  if (result.state === 'not-implemented') {
    renderStatus.textContent =
      `Варіант ${VARIANT.number}. Обрано «${example.label}». ` +
      'Завершіть TODO в src/main.js.';
    return;
  }

  if (result.isDegenerate) {
    renderStatus.textContent =
      `Варіант ${VARIANT.number}. Трикутник вироджений: ` +
      'растеризацію безпечно пропущено.';
    return;
  }

  renderStatus.textContent =
    `Варіант ${VARIANT.number}. Растеризацію завершено. ` +
    `Покрито пікселів: ${result.coveredPixels}.`;
}

function renderSelectedExample() {
  const example = examples[exampleSelect.value];
  const result = rasterizeTriangle(example.vertices);

  if (overlayToggle.checked) {
    drawValidationOverlay(example.vertices);
  }

  verticesValue.textContent = formatVertices(example.vertices);
  boundsValue.textContent = formatBoundingBox(result.boundingBox);
  coveredPixelsValue.textContent = result.coveredPixels ?? '—';
  updateStatus(example, result);
}

rasterizeButton.addEventListener('click', renderSelectedExample);
exampleSelect.addEventListener('change', renderSelectedExample);
overlayToggle.addEventListener('change', renderSelectedExample);

renderSelectedExample();
