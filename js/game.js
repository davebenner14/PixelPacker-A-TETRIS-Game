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
        gameBoard[y + currentTetromino.posY][x + currentTetromino.posX] = 1;
      }
    }
  }
  clearLines(); // Check for and clear any filled lines
  currentTetromino = getRandomTetromino(); // Spawn a new tetromino
}

function moveDown() {
  currentTetromino.posY++;
  if (hasCollision()) {
    currentTetromino.posY--;
    placeTetromino();
  }
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
    currentTetromino.shape = originalShape; // Revert if rotation causes a collision
  }
}

function hasCollision() {
  for (let y = 0; y < currentTetromino.shape.length; y++) {
    for (let x = 0; x < currentTetromino.shape[y].length; x++) {
      if (
        currentTetromino.shape[y][x] &&
        (gameBoard[y + currentTetromino.posY] &&
          gameBoard[y + currentTetromino.posY][x + currentTetromino.posX]) !== 0
      ) {
        return true;
      }
    }
  }
  return false;
}

function clearLines() {
  for (let y = gameBoard.length - 1; y >= 0; y--) {
    if (gameBoard[y].every((value) => value === 1)) {
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
  if (!isPaused) {
    moveDown();
  }
}

startDescent();
