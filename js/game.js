let boardElement = document.getElementById("gameBoard");
const gameBoard = Array(20)
  .fill(null)
  .map(() => Array(10).fill(0));

let currentTetromino = getRandomTetromino();

function getRandomTetromino() {
  const tetrominoes = "IOTSZJL";
  const randomTetromino =
    TETROMINOES[tetrominoes[Math.floor(Math.random() * tetrominoes.length)]];

  return {
    ...randomTetromino,
    posX:
      Math.floor(gameBoard[0].length / 2) -
      Math.ceil(randomTetromino.shape[0].length / 2),
    posY: 0,
  };
}

function placeTetromino() {
  for (let y = 0; y < currentTetromino.shape.length; y++) {
    for (let x = 0; x < currentTetromino.shape[y].length; x++) {
      if (currentTetromino.shape[y][x]) {
        gameBoard[y + currentTetromino.posY][x + currentTetromino.posX] =
          currentTetromino.color;
      }
    }
  }
  clearLines();
  currentTetromino = getRandomTetromino();
}

function hasCollision() {
  const collision = checkCollision(currentTetromino, gameBoard);
  if (collision) {
    console.log("Collision detected");
  }
  return collision;
}

function moveDown() {
  console.log("moveDown function called");
  currentTetromino.posY++;
  if (hasCollision()) {
    console.log("Collision occurred on moveDown");
    currentTetromino.posY--;
    placeTetromino();
  }
  console.log("Current Tetromino Y position:", currentTetromino.posY);
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
  const originalShape = currentTetromino.shape;
  currentTetromino.shape = currentTetromino.shape[0]
    .map((_, index) => currentTetromino.shape.map((row) => row[index]))
    .reverse();

  if (hasCollision()) {
    currentTetromino.shape = originalShape;
  }
}

function clearLines() {
  for (let y = gameBoard.length - 1; y >= 0; y--) {
    if (gameBoard[y].every((value) => value !== 0)) {
      gameBoard.splice(y, 1);
      gameBoard.unshift(Array(gameBoard[0].length).fill(0));
      y++;
    }
  }
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

function updateGame() {
  console.log("updateGame function called");
  moveDown();
  render();
}

function render() {
  boardElement.innerHTML = "";

  for (let y = 0; y < gameBoard.length; y++) {
    const rowElement = document.createElement("div");

    for (let x = 0; x < gameBoard[y].length; x++) {
      const cellElement = document.createElement("div");
      cellElement.classList.add("cell");

      if (
        y >= currentTetromino.posY &&
        y < currentTetromino.posY + currentTetromino.shape.length &&
        x >= currentTetromino.posX &&
        x < currentTetromino.posX + currentTetromino.shape[0].length &&
        currentTetromino.shape[y - currentTetromino.posY][
          x - currentTetromino.posX
        ]
      ) {
        cellElement.classList.add(currentTetromino.color);
      } else if (gameBoard[y][x] !== 0) {
        cellElement.classList.add(gameBoard[y][x]);
      }

      rowElement.appendChild(cellElement);
    }

    boardElement.appendChild(rowElement);
  }
}

render();
