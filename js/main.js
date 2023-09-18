let isPaused = false;
let gameInterval;
let gameStarted = false;

document.addEventListener("DOMContentLoaded", function () {
  console.log("PixelPacker is initialized!");

  boardElement = document.getElementById("gameBoard");

  // Initialize the game
  initGame();

  // Initialize controls
  initializeControls();

  // Prevent spacebar default behavior when the startGame button is in focus
  document
    .getElementById("startGame")
    .addEventListener("keydown", function (event) {
      if (event.key === "Space") {
        event.preventDefault();
      }
    });

  // Add back the click event listener for the startGame function
  document.getElementById("startGame").addEventListener("click", startGame);

  document.getElementById("pausePlay").addEventListener("click", togglePause);
});

function initGame() {
  isPaused = true;
}

function startGame() {
  console.log("startGame function called");

  if (!gameStarted) {
    isPaused = false;
    startGameLoop();
    gameStarted = true;
    document.getElementById("pausePlay").innerText = "Pause";
  }
}

function startGameLoop() {
  console.log("startGameLoop function called");
  gameInterval = setInterval(function () {
    if (!isPaused) {
      updateGame();
    }
  }, 800);
}

function getGhostPiecePosition() {
  let ghostPosY = currentTetromino.posY;

  while (true) {
    ghostPosY++;
    if (checkCollisionWithBoard(currentTetromino, ghostPosY)) {
      ghostPosY--;
      break;
    }
  }

  return ghostPosY;
}

function checkCollisionWithBoard(tetromino, posY) {
  for (let y = 0; y < tetromino.shape.length; y++) {
    for (let x = 0; x < tetromino.shape[y].length; x++) {
      if (
        tetromino.shape[y][x] &&
        (gameBoard[y + posY] && gameBoard[y + posY][x + tetromino.posX]) !== 0
      ) {
        return true;
      }
    }
  }
  return false;
}

function togglePause() {
  if (!gameStarted) return;

  isPaused = !isPaused;
  if (isPaused) {
    clearInterval(gameInterval);
    document.getElementById("pausePlay").innerText = "Resume";
  } else {
    startGameLoop();
    document.getElementById("pausePlay").innerText = "Pause";
  }
}

function initializeControls() {}
