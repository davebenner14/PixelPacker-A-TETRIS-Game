document.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "ArrowRight":
      if (!isPaused) moveRight();
      break;
    case "ArrowLeft":
      if (!isPaused) moveLeft();
      break;
    case "ArrowDown":
      if (!isPaused) moveDown(); // Renamed from speedUpDescent() to moveDown() to match the logic from the provided code.
      break;
    case "ArrowUp":
    case "Space":
      if (!isPaused) rotateTetromino();
      break;
    case "p":
    case "P":
      isPaused = !isPaused; // Toggle the game pause state
      if (isPaused) {
        clearInterval(gameInterval);
      } else {
        gameInterval = setInterval(function () {
          if (!isPaused) {
            updateGame();
          }
        }, 1000);
      }
      break;
    // If you wish to add more controls in the future,
    // you can add more cases here.
  }
});
