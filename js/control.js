document.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "ArrowRight":
      if (!isPaused) moveRight();
      break;
    case "ArrowLeft":
      if (!isPaused) moveLeft();
      break;
    case "ArrowDown":
      if (!isPaused) speedUpDescent();
      break;
    case "ArrowUp":
    case "Space":
      if (!isPaused) rotateTetromino();
      break;
    case "p":
    case "P":
      pauseGame();
      break;
    // If you wish to add more controls in the future,
    // you can add more cases here.
  }
});
