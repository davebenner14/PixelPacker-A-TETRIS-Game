let isPaused = false;
let gameInterval;
let gameStarted = false;

document.addEventListener("DOMContentLoaded", function () {
  console.log("PixelPacker is initialized!");

  boardElement = document.getElementById("gameBoard"); // Replace 'gameBoard' with the actual ID of your game board element if it's different.

  // Initialize the game
  initGame();

  // Initialize controls
  initializeControls();

  // Attach event listener to start and pause buttons
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
  }, 1000);
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
