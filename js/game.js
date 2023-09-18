let boardElement = document.getElementById("gameBoard");
const gameBoard = Array(20)
  .fill(null)
  .map(() => Array(10).fill(0));

let currentTetromino = getRandomTetromino();
let nextTetromino = getRandomTetromino();

function moveDown() {
  console.log("moveDown function called");
  currentTetromino.posY++;
  if (hasCollision()) {
    console.log("Collision occurred on moveDown");
    currentTetromino.posY--;
    placeTetromino();
    currentTetromino = nextTetromino;
    nextTetromino = getRandomTetromino();
    if (hasCollision()) {
      console.log("Game Over");
      clearInterval(gameInterval);
    }
  }
  console.log("Current Tetromino Y position:", currentTetromino.posY);
}

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
  if (checkGameOver()) {
    console.log("Game Over");
    clearInterval(gameInterval);
  }
}
function checkGameOver() {
  for (let x = 0; x < gameBoard[0].length; x++) {
    if (gameBoard[0][x] !== 0) {
      return true;
    }
  }
  return false;
}

function hasCollision() {
  const collision = checkCollision(currentTetromino, gameBoard);
  if (collision) {
    console.log("Collision detected");
  }
  return collision;
}
// function moveDown() {
//   console.log("moveDown function called");
//   currentTetromino.posY++;
//   if (hasCollision()) {
//     console.log("Collision occurred on moveDown");
//     currentTetromino.posY--;
//     placeTetromino();
//     currentTetromino = getRandomTetromino(); // Set the new tetromino here
//   }
//   console.log("Current Tetromino Y position:", currentTetromino.posY);
// }

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
  console.log("rotateTetromino function called"); // add this line

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
        gameBoard[y + currentTetromino.posY][x + currentTetromino.posX] =
          currentTetromino.color;
      }
    }
  }
  clearLines();
  currentTetromino = getRandomTetromino();
  if (hasCollision()) {
    console.log("Game Over");
    clearInterval(gameInterval);
  }
}

function clearLines() {
  for (let y = 0; y < gameBoard.length; y++) {
    if (gameBoard[y].every((cell) => cell !== 0)) {
      flashAndRemoveRow(y);
      return;
    }
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

function updateGame() {
  console.log("updateGame function called");
  moveDown();
  render();
}
function render() {
  boardElement.innerHTML = "";

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
      } else if (gameBoard[y][x] !== 0) {
        cellElement.classList.add(gameBoard[y][x]);
      }

      columnElement.appendChild(cellElement);
    }

    boardElement.appendChild(columnElement);
  }
}

render();
