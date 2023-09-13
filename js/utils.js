function checkCollision(tetromino, board) {
  for (let y = 0; y < tetromino.shape.length; y++) {
    for (let x = 0; x < tetromino.shape[y].length; x++) {
      if (tetromino.shape[y][x]) {
        // If there's a block in the tetromino shape here

        // Check if this block is outside the game board vertically
        if (y + tetromino.posY >= board.length || y + tetromino.posY < 0) {
          return true;
        }

        // Check if this block is outside the game board horizontally
        if (x + tetromino.posX >= board[y].length || x + tetromino.posX < 0) {
          return true;
        }

        // Check if this block collides with an already-placed block on the board
        if (board[y + tetromino.posY][x + tetromino.posX] !== 0) {
          return true;
        }
      }
    }
  }
  return false; // No collisions found
}
