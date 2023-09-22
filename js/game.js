let boardElement = document.getElementById("gameBoard");
const gameBoard = Array(20)
  .fill(null)
  .map(() => Array(10).fill(0));

let currentTetromino = getRandomTetromino();
let nextTetromino = getRandomTetromino();
displayNextTetromino(nextTetromino);

function moveDown() {
  console.log("Before moveDown");
  console.log("currentTetromino: ", JSON.stringify(currentTetromino));
  console.log("nextTetromino: ", JSON.stringify(nextTetromino));

  console.log("moveDown function called");
  currentTetromino.posY++;

  if (hasCollision()) {
    console.log("Collision occurred on moveDown");
    currentTetromino.posY--;
    placeTetromino();

    currentTetromino = JSON.parse(JSON.stringify(nextTetromino));
    nextTetromino = getRandomTetromino();
    displayNextTetromino(nextTetromino);

    if (checkGameOver()) {
      return;
    }
  }

  console.log("Current Tetromino Y position:", currentTetromino.posY);

  console.log("After moveDown");
  console.log("new currentTetromino: ", JSON.stringify(currentTetromino));
  console.log("new nextTetromino: ", JSON.stringify(nextTetromino));
}
function rotateShape(shape) {
  return shape[0].map((_, index) => shape.map((row) => row[index])).reverse();
}

function displayNextTetromino(tetromino) {
  const nextPieceContainer = document.getElementById("nextPiecePreview");
  const offsetX = 2 - Math.ceil(tetromino.shape.length / 2);
  const offsetY = 2 - Math.ceil(tetromino.shape[0].length / 2);

  nextPieceContainer.innerHTML = "";

  for (let y = 0; y < 4; y++) {
    const row = document.createElement("div");
    for (let x = 0; x < 4; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      if (
        tetromino.shape[x - offsetX] &&
        tetromino.shape[x - offsetX][y - offsetY]
      ) {
        cell.classList.add(tetromino.color);
      }
      row.appendChild(cell);
    }
    nextPieceContainer.appendChild(row);
  }
}

function deepCloneArray(arr) {
  return JSON.parse(JSON.stringify(arr));
}

function getRandomTetromino() {
  const tetrominoes = "IOTSZJL";
  const randomTetromino =
    TETROMINOES[tetrominoes[Math.floor(Math.random() * tetrominoes.length)]];

  const newShape = deepCloneArray(randomTetromino.shape);

  return {
    shape: rotateShape(newShape),
    color: randomTetromino.color,
    posX:
      Math.floor(gameBoard[0].length / 2) - Math.ceil(newShape[0].length / 2),
    posY: 0
  };
}

// function checkGameOver() {
//   for (let x = 0; x < gameBoard[0].length; x++) {
//     if (gameBoard[0][x] !== 0) {
//       return true;
//     }
//   }
//   return false;
// }

function hasCollision() {
  const collision = checkCollision(currentTetromino, gameBoard);
  if (collision) {
    console.log("Collision detected");
  }
  return collision;
}

function moveRight() {
  currentTetromino.posX++;
  if (hasCollision()) {
    currentTetromino.posX--;
  }
}

function moveLeft() {
  currentTetromino.posX--;
  if (hasCollision()) {
    currentTetromino.posX++;
  }
}

function rotateTetromino() {
  console.log("rotateTetromino function called");

  const originalShape = [...currentTetromino.shape];
  const originalPosX = currentTetromino.posX;
  const originalPosY = currentTetromino.posY;

  currentTetromino.shape = currentTetromino.shape[0]
    .map((_, index) => currentTetromino.shape.map((row) => row[index]))
    .reverse();

  if (hasCollision()) {
    currentTetromino.shape = originalShape;
    currentTetromino.posX = originalPosX;
    currentTetromino.posY = originalPosY;
  }
}

function placeTetromino() {
  for (let y = 0; y < currentTetromino.shape.length; y++) {
    for (let x = 0; x < currentTetromino.shape[y].length; x++) {
      if (currentTetromino.shape[y][x]) {
        if (y + currentTetromino.posY < 0) {
          console.log("Game Over");
          clearInterval(gameInterval);
          return;
        }
        gameBoard[y + currentTetromino.posY][x + currentTetromino.posX] =
          currentTetromino.color;
      }
    }
  }

  clearLines();

  if (gameBoard[0].some((cell) => cell !== 0)) {
    console.log("Game Over");
    clearInterval(gameInterval);
  }
}

function checkGameOver() {
  for (let x = 0; x < gameBoard[0].length; x++) {
    if (gameBoard[0][x] !== 0) {
      triggerGameOver();
      return true;
    }
  }
  return false;
}

function triggerGameOver() {
  console.log("Unified Game Over");
  clearInterval(gameInterval);
  document.getElementById("gameOverMessage").style.display = "flex";

  setTimeout(() => {
    const tryAgainButton = document.getElementById("tryAgainButton");
    tryAgainButton.style.display = "block";
    tryAgainButton.setAttribute("href", window.location.href);
  }, 5000);
}

let linesCleared = 0;
let level = 1;
let score = 0;

function clearLines() {
  const rowsToRemove = getRowsToRemove();

  if (rowsToRemove.length > 0) {
    updateLinesScoreAndLevel(rowsToRemove.length);
    clearAndRenderRows(rowsToRemove);
    shiftRowsAfterDelay(rowsToRemove);
  }
}

function getRowsToRemove() {
  let rowsToRemove = [];
  for (let y = 0; y < gameBoard.length; y++) {
    if (gameBoard[y].every((cell) => cell !== 0)) {
      rowsToRemove.push(y);
    }
  }
  return rowsToRemove;
}

function updateLinesScoreAndLevel(linesRemovedCount) {
  linesCleared += linesRemovedCount;

  const pointsEarned = getPoints(level, linesRemovedCount);
  updateScoreDisplay(pointsEarned);

  if (score >= level * 100) {
    levelUp();
  }
}

function getPoints(level, linesCleared) {
  let points;

  if (level >= 0 && level <= 1) {
    points = [100, 400, 900, 2000];
  } else if (level >= 2 && level <= 3) {
    points = [200, 800, 1800, 4000];
  } else if (level >= 4 && level <= 5) {
    points = [300, 1200, 2700, 6000];
  } else if (level >= 6 && level <= 7) {
    points = [400, 1600, 3600, 8000];
  } else if (level == 8 || level == 9) {
    points = [500, 2000, 4500, 10000];
  } else if (level == 10) {
    points = [10000, 20000, 30000, 50000];
  }

  return points[linesCleared - 1];
}

function clearAndRenderRows(rowsToRemove) {
  rowsToRemove.forEach((rowIndex) => {
    for (let x = 0; x < gameBoard[rowIndex].length; x++) {
      gameBoard[rowIndex][x] = "WHITE";
    }
  });
  render();
}
function updateScoreDisplay(pointsEarned) {
  const scoreElem = document.getElementById("score");
  score += pointsEarned;
  scoreElem.textContent = score;

  const scoreAnimElem = document.createElement("span");
  scoreAnimElem.textContent = `+${pointsEarned}`;
  scoreAnimElem.className = "score-animation";
  scoreAnimElem.setAttribute("data-points", pointsEarned);

  scoreElem.parentElement.appendChild(scoreAnimElem);

  setTimeout(() => {
    scoreAnimElem.remove();
  }, 1000);
}

function updateLinesAndLevel(linesRemovedCount) {
  linesCleared += linesRemovedCount;
  updateScoreDisplay();
  if (linesCleared >= level) {
    levelUp();
  }
}

function shiftRowsAfterDelay(rowsToRemove) {
  setTimeout(() => {
    for (let i = rowsToRemove.length - 1; i >= 0; i--) {
      gameBoard.splice(rowsToRemove[i], 1);
    }
    for (let i = 0; i < rowsToRemove.length; i++) {
      gameBoard.unshift(new Array(gameBoard[0].length).fill(0));
    }
    render();
  }, 400);
}

function levelUp() {
  console.log("levelUp called");
  level++;

  let levelElement = document.getElementById("level");
  levelElement.innerHTML = `Level: ${level}`;

  let streakElement = document.querySelector(".streak");
  console.log(streakElement);
  streakElement.classList.add("active");

  streakElement.addEventListener(
    "animationend",
    function () {
      streakElement.classList.remove("active");
    },
    { once: true }
  );

  levelElement.classList.add("level-number-yellow");
  setTimeout(() => {
    levelElement.classList.remove("level-number-yellow");
  }, 5000);

  if (level > 10) {
    level = 10;
  }
}

function flashAndRemoveRow(rowIndex) {
  for (let x = 0; x < gameBoard[rowIndex].length; x++) {
    gameBoard[rowIndex][x] = "WHITE";
  }
  render();

  setTimeout(function () {
    gameBoard.splice(rowIndex, 1);
    gameBoard.unshift(new Array(gameBoard[0].length).fill(0));
    render();
  }, 400);
}

function pauseGame() {
  if (isPaused) {
    startDescent();
    isPaused = false;
  } else {
    clearInterval(descentInterval);
    isPaused = true;
  }
}
// function dropTetrominoFast() {
//   currentTetromino.posY = getGhostPiecePosition();
// }

boardElement.addEventListener("click", handleBoardClick);

function handleBoardClick(event) {
  const rect = boardElement.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;
  const cellWidth = boardElement.offsetWidth / 10;

  const tetrominoLeft = currentTetromino.posX * cellWidth;
  const tetrominoRight =
    (currentTetromino.posX + currentTetromino.shape[0].length) * cellWidth;
  const tetrominoTop = currentTetromino.posY * cellWidth;
  const tetrominoBottom =
    (currentTetromino.posY + currentTetromino.shape.length) * cellWidth;

  const ghostPosY = getGhostPiecePosition();
  const ghostTop = ghostPosY * cellWidth;
  const ghostBottom = (ghostPosY + currentTetromino.shape.length) * cellWidth;

  if (
    clickX >= tetrominoLeft &&
    clickX <= tetrominoRight &&
    clickY >= tetrominoTop &&
    clickY <= tetrominoBottom
  ) {
    rotateTetromino();
  } else if (
    clickX >= tetrominoLeft &&
    clickX <= tetrominoRight &&
    clickY >= ghostTop &&
    clickY <= ghostBottom
  ) {
    dropTetrominoFast();
  } else {
    const blockCenterX = tetrominoLeft + (tetrominoRight - tetrominoLeft) / 2;

    if (clickX < blockCenterX) {
      moveLeft();
    } else {
      moveRight();
    }
  }

  render();
}

document.getElementById("restartGame").addEventListener("click", restartGame);

function restartGame() {
  for (let row of gameBoard) {
    row.fill(0);
  }

  currentTetromino = getRandomTetromino();
  nextTetromino = getRandomTetromino();
  displayNextTetromino(nextTetromino);
  score = 0;
  level = 1;

  document.getElementById("score").innerText = score;
  document.getElementById("level").innerText = `Level: ${level}`;

  clearInterval(gameInterval);

  const gameRestartedEvent = new Event("gameRestarted");
  document.dispatchEvent(gameRestartedEvent);
}

let lastDropFastTime = 0;

function dropTetrominoFast() {
  const currentTime = new Date().getTime();

  if (currentTime - lastDropFastTime >= 2000) {
    lastDropFastTime = currentTime;

    const dropInterval = setInterval(() => {
      currentTetromino.posY++;
      if (hasCollision()) {
        currentTetromino.posY--;
        placeTetromino();
        clearInterval(dropInterval);
        updateGame();
      }
      render();
    }, 50);
  }
}

function updateNextPiecePreview() {
  let previewElement = document.getElementById("nextPiecePreview");
  previewElement.innerHTML = "";

  for (let y = 0; y < nextTetromino.shape.length; y++) {
    let rowElement = document.createElement("div");
    for (let x = 0; x < nextTetromino.shape[y].length; x++) {
      let cellElement = document.createElement("div");
      cellElement.classList.add("cell");
      if (nextTetromino.shape[y][x]) {
        cellElement.classList.add(nextTetromino.color);
      }
      rowElement.appendChild(cellElement);
    }
    previewElement.appendChild(rowElement);
  }
}

function updateGame() {
  console.log("updateGame function called");
  moveDown();
  render();
}
function render() {
  boardElement.innerHTML = "";

  const ghostPosY = getGhostPiecePosition();

  for (let x = 0; x < gameBoard[0].length; x++) {
    const columnElement = document.createElement("div");

    for (let y = 0; y < gameBoard.length; y++) {
      const cellElement = document.createElement("div");
      cellElement.classList.add("cell");

      if (
        x >= currentTetromino.posX &&
        x < currentTetromino.posX + currentTetromino.shape[0].length &&
        y >= currentTetromino.posY &&
        y < currentTetromino.posY + currentTetromino.shape.length &&
        currentTetromino.shape[y - currentTetromino.posY][
          x - currentTetromino.posX
        ]
      ) {
        cellElement.classList.add(currentTetromino.color);
      } else if (
        x >= currentTetromino.posX &&
        x < currentTetromino.posX + currentTetromino.shape[0].length &&
        y >= ghostPosY &&
        y < ghostPosY + currentTetromino.shape.length &&
        currentTetromino.shape[y - ghostPosY][x - currentTetromino.posX]
      ) {
        cellElement.classList.add(currentTetromino.color);
        cellElement.classList.add("ghost"); // you will need a .ghost CSS class to make it look fainter
      } else if (gameBoard[y][x] !== 0) {
        cellElement.classList.add(gameBoard[y][x]);
      }

      columnElement.appendChild(cellElement);
    }

    boardElement.appendChild(columnElement);
  }
}

render();
