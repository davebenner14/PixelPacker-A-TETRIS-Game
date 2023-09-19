let boardElement = document.getElementById("gameBoard");
const gameBoard = Array(20)
  .fill(null)
  .map(() => Array(10).fill(0));

let currentTetromino = getRandomTetromino();
let nextTetromino = getRandomTetromino();
displayNextTetromino(nextTetromino);

function moveDown() {
  console.log("moveDown function called");
  currentTetromino.posY++;
  if (hasCollision()) {
    console.log("Collision occurred on moveDown");
    currentTetromino.posY--;
    placeTetromino();

    currentTetromino = nextTetromino;

    nextTetromino = getRandomTetromino();
    displayNextTetromino(nextTetromino);

    if (hasCollision()) {
      console.log("Game Over");
      clearInterval(gameInterval);
    }
  }
  console.log("Current Tetromino Y position:", currentTetromino.posY);
}

function displayNextTetromino(tetromino) {
  const nextPieceContainer = document.getElementById("nextPiecePreview");
  const offsetX = 2 - Math.ceil(tetromino.shape[0].length / 2);
  const offsetY = 2 - Math.ceil(tetromino.shape.length / 2);

  nextPieceContainer.innerHTML = "";

  for (let y = 0; y < 4; y++) {
    const row = document.createElement("div");
    for (let x = 0; x < 4; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      if (
        tetromino.shape[y - offsetY] &&
        tetromino.shape[y - offsetY][x - offsetX]
      ) {
        cell.classList.add(tetromino.color);
      }
      row.appendChild(cell);
    }
    nextPieceContainer.appendChild(row);
  }
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
  let rowsToRemove = [];

  for (let y = 0; y < gameBoard.length; y++) {
    if (gameBoard[y].every((cell) => cell !== 0)) {
      rowsToRemove.push(y);
    }
  }

  rowsToRemove.forEach((rowIndex) => {
    for (let x = 0; x < gameBoard[rowIndex].length; x++) {
      gameBoard[rowIndex][x] = "WHITE";
    }
  });

  render();

  setTimeout(function () {
    for (let i = rowsToRemove.length - 1; i >= 0; i--) {
      gameBoard.splice(rowsToRemove[i], 1);
    }

    for (let i = 0; i < rowsToRemove.length; i++) {
      gameBoard.unshift(new Array(gameBoard[0].length).fill(0));
    }

    render();
  }, 400);
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
