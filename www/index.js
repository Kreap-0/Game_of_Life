import { Universe, Cell } from "game-of-life";
import { memory } from 'game-of-life/game_of_life_bg.wasm'

const CELL_SIZE = 15;
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";

const universe = Universe.new(64, 64);
const height = universe.height();
const width = universe.width();

const canvas = document.getElementById("game-of-life-canvas");

canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;

const ctx = canvas.getContext('2d');

canvas.addEventListener('click', function(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  const row = Math.floor(y / (CELL_SIZE + 1));
  const column = Math.floor(x / (CELL_SIZE + 1));

  if (row < height && column < width) {
    universe.flip(row, column);
    drawCellAt(row, column);
    console.log(`flip cell at (${row}, ${column})`);
  }
});

const drawGrid = () => {
  ctx.beginPath();
  ctx.strokeStyle = GRID_COLOR;

  for (let i = 0; i <= width; i++) {
    ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
    ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
  }

  for (let j = 0; j <= height; j++) {
    ctx.moveTo(0,                           j * (CELL_SIZE + 1) + 1);
    ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
  }

  ctx.stroke();
};

const getIndex = (row, column) => {
  return row * width + column;
};

const drawCellAt = (row, col) => {
  const cellsPtr = universe.cells();
  const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);

  ctx.beginPath();

  const idx = getIndex(row, col);
  ctx.fillStyle = cells[idx] === Cell.Dead
    ? DEAD_COLOR
    : ALIVE_COLOR;

  ctx.fillRect(
    col * (CELL_SIZE + 1) + 1,
    row * (CELL_SIZE + 1) + 1,
    CELL_SIZE,
    CELL_SIZE
  );

  ctx.stroke();
}

const drawCells = () => {
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      drawCellAt(row, col);
    }
  }
};

let lastTime = performance.now();

let animationId = null;

const playPauseButton = document.getElementById("play-pause");
playPauseButton.textContent = "⏸";

playPauseButton.addEventListener("click", event => {
  if (animationId === null) {
    playPauseButton.textContent = "⏸";
    animationId = requestAnimationFrame(renderLoop);
  } else {
    playPauseButton.textContent = "▶";
    cancelAnimationFrame(animationId);
    animationId = null;
  }
});

const targetFpsRange = document.getElementById("fps_range");
const fpsValue = document.getElementById("fps_value");
fpsValue.textContent = targetFpsRange.value;
targetFpsRange.addEventListener("input", (event) => {
  fpsValue.textContent = event.target.value;
});

const renderLoop = (currentTime) => {
  const targetFps = targetFpsRange.value;
  const delta = currentTime - lastTime;
  if (delta >= 1000 / targetFps) {
        universe.tick();
        drawCells();
        lastTime = currentTime;
    }
  animationId = requestAnimationFrame(renderLoop);
};

drawGrid();
drawCells();
requestAnimationFrame(renderLoop);