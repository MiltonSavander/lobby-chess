interface BoardPiece {
  id: string;
  name: string;
  position: [number, number];
}

const squareOccupied = (boardState: BoardPiece[], newX: number, newY: number) => {
  return boardState.some((p) => p.position[0] === newX && p.position[1] === newY);
};

const calculateAvailableMoves = (piece: BoardPiece, boardState: BoardPiece[]) => {
  const [x, y] = piece.position;
  const availableMoves: [number, number][] = [];

  // Define movement rules based on the type of piece
  switch (piece.name) {
    case "KB":
    case "KW": // King can move one square in any direction
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx !== 0 || dy !== 0) {
            const newX = x + dx;
            const newY = y + dy;
            if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
              if (!squareOccupied(boardState, newX, newY)) {
                availableMoves.push([newX, newY]);
              }
            }
          }
        }
      }
      break;
    case "PB":
    case "PW": // Pawn can move one square forward
      const direction = piece.name[1] === "W" ? -1 : 1;
      const newY = y + direction;
      if (!squareOccupied(boardState, x, newY)) {
        if (newY >= 0 && newY < 8) {
          availableMoves.push([x, newY]);
        }
        if (piece.name[1] === "W" && piece.position[1] === 6) {
          availableMoves.push([x, newY + direction]);
        } else if (piece.name[1] === "B" && piece.position[1] === 1) {
          availableMoves.push([x, newY + direction]);
        }
        break;
      }
    case "RB":
    case "RW": // Rook can move horizontally or vertically until an occupied square or board edge is encountered
      // Horizontal movement (left and right)
      for (let i = x - 1; i >= 0; i--) {
        if (squareOccupied(boardState, i, y)) break;
        availableMoves.push([i, y]);
      }
      for (let i = x + 1; i < 8; i++) {
        if (squareOccupied(boardState, i, y)) break;
        availableMoves.push([i, y]);
      }
      // Vertical movement (up and down)
      for (let i = y - 1; i >= 0; i--) {
        if (squareOccupied(boardState, x, i)) break;
        availableMoves.push([x, i]);
      }
      for (let i = y + 1; i < 8; i++) {
        if (squareOccupied(boardState, x, i)) break;
        availableMoves.push([x, i]);
      }
      break;
    case "NB":
    case "NW": // Knight can move in an "L" shape
      const knightMoves: [number, number][] = [
        [x + 2, y + 1],
        [x + 2, y - 1],
        [x - 2, y + 1],
        [x - 2, y - 1],
        [x + 1, y + 2],
        [x + 1, y - 2],
        [x - 1, y + 2],
        [x - 1, y - 2],
      ];

      for (const [newX, newY] of knightMoves) {
        if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8 && !squareOccupied(boardState, newX, newY)) {
          availableMoves.push([newX, newY]);
        }
      }
      break;
    case "BB":
    case "BW": // Bishop can move diagonally until an occupied square or board edge is encountered
      // Diagonal movement (top-left to bottom-right)
      for (let i = 1; i < 8; i++) {
        const newX = x + i;
        const newY = y + i;
        if (newX >= 8 || newY >= 8 || squareOccupied(boardState, newX, newY)) break;
        availableMoves.push([newX, newY]);
      }
      for (let i = 1; i < 8; i++) {
        const newX = x - i;
        const newY = y - i;
        if (newX < 0 || newY < 0 || squareOccupied(boardState, newX, newY)) break;
        availableMoves.push([newX, newY]);
      }
      // Diagonal movement (top-right to bottom-left)
      for (let i = 1; i < 8; i++) {
        const newX = x + i;
        const newY = y - i;
        if (newX >= 8 || newY < 0 || squareOccupied(boardState, newX, newY)) break;
        availableMoves.push([newX, newY]);
      }
      for (let i = 1; i < 8; i++) {
        const newX = x - i;
        const newY = y + i;
        if (newX < 0 || newY >= 8 || squareOccupied(boardState, newX, newY)) break;
        availableMoves.push([newX, newY]);
      }
      break;
    case "QB":
    case "QW": // Queen can move like both a rook and a bishop
      // Rook-like movement (horizontal and vertical)
      // Horizontal movement (left and right)
      for (let i = x - 1; i >= 0; i--) {
        if (squareOccupied(boardState, i, y)) break;
        availableMoves.push([i, y]);
      }
      for (let i = x + 1; i < 8; i++) {
        if (squareOccupied(boardState, i, y)) break;
        availableMoves.push([i, y]);
      }
      // Vertical movement (up and down)
      for (let i = y - 1; i >= 0; i--) {
        if (squareOccupied(boardState, x, i)) break;
        availableMoves.push([x, i]);
      }
      for (let i = y + 1; i < 8; i++) {
        if (squareOccupied(boardState, x, i)) break;
        availableMoves.push([x, i]);
      }
      // Bishop-like movement (diagonal)
      // Diagonal movement (top-left to bottom-right)
      for (let i = 1; i < 8; i++) {
        const newX = x + i;
        const newY = y + i;
        if (newX >= 8 || newY >= 8 || squareOccupied(boardState, newX, newY)) break;
        availableMoves.push([newX, newY]);
      }
      for (let i = 1; i < 8; i++) {
        const newX = x - i;
        const newY = y - i;
        if (newX < 0 || newY < 0 || squareOccupied(boardState, newX, newY)) break;
        availableMoves.push([newX, newY]);
      }
      // Diagonal movement (top-right to bottom-left)
      for (let i = 1; i < 8; i++) {
        const newX = x + i;
        const newY = y - i;
        if (newX >= 8 || newY < 0 || squareOccupied(boardState, newX, newY)) break;
        availableMoves.push([newX, newY]);
      }
      for (let i = 1; i < 8; i++) {
        const newX = x - i;
        const newY = y + i;
        if (newX < 0 || newY >= 8 || squareOccupied(boardState, newX, newY)) break;
        availableMoves.push([newX, newY]);
      }
      break;

    // Add movement rules for other pieces...

    default:
      break;
  }
  return availableMoves;
};

export default calculateAvailableMoves;
