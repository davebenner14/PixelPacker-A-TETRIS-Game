function checkCollision(tetromino, board) {
  for (let y = 0; y < tetromino.shape.length; y++) {
    for (let x = 0; x < tetromino.shape[y].length; x++) {
      if (tetromino.shape[y][x]) {
        if (y + tetromino.posY >= board.length || y + tetromino.posY < 0) {
          return true;
        }

        if (x + tetromino.posX >= board[y].length || x + tetromino.posX < 0) {
          return true;
        }

        if (board[y + tetromino.posY][x + tetromino.posX] !== 0) {
          return true;
        }
      }
    }
  }
  return false;
}
