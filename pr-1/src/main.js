import './style.css';

const canvas = document.querySelector('#scene-canvas');
const context = canvas.getContext('2d');

if (!context) {
  throw new Error('Не вдалося отримати двовимірний контекст Canvas.');
}

function drawScene(ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // TODO: намалюйте фон.
  // TODO: додайте два прямокутники різних кольорів.
  // TODO: додайте коло або дугу.
  // TODO: створіть замкнений контур із трьох або більше відрізків.
  // TODO: додайте заповнений та обведений об’єкти.
  // TODO: виведіть текстовий підпис із номером варіанта.
}

drawScene(context);
