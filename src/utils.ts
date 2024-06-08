const calculateAvailableMoves = (piece: BoardPiece): [number, number][] => {
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
              availableMoves.push([newX, newY]);
            }
          }
        }
      }
      break;
    case "PB":
    case "PW": // Pawn can move one square forward
      const direction = piece.name.startsWith("P") ? 1 : -1;
      const newY = y + direction;
      if (newY >= 0 && newY < 8) {
        availableMoves.push([x, newY]);
      }
      break;
    // Add movement rules for other pieces
    default:
      break;
  }
  return availableMoves;
};

export default calculateAvailableMoves