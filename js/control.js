document.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "ArrowRight":
      if (!isPaused) moveRight();
      break;
    case "ArrowLeft":
      if (!isPaused) moveLeft();
      break;
    case "ArrowDown":
      if (!isPaused) moveDown();
      break;
    case "z":
    case "Z":
      if (!isPaused) rotateTetromino();
      break;
    case "p":
    case "P":
      isPaused = !isPaused;
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
  }
});
