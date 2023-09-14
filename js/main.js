// Declare these variables globally if they are being used in both main.js and control.js
let isPaused = false;
let gameInterval;

document.addEventListener("DOMContentLoaded", function () {
  console.log("PixelPacker is initialized!");

  // Initialize the game
  initGame();

  // Start the game loop
  startGameLoop();

  // Initialize controls
  initializeControls();
});

function initGame() {
  // Initialize the game state
  isPaused = false;

  // Assuming you want to set up the game board and maybe draw the initial state:
  // draw(gameBoard);
}

function startGameLoop() {
  gameInterval = setInterval(function () {
    if (!isPaused) {
      updateGame();
    }
  }, 1000);
}

function initializeControls() {
  // All controls are now in control.js.
}
