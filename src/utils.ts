interface BoardPiece {
  id: string;
  name: string;
  position: [number, number];
  prevPosition: [number, number];
}

const isMoveValid = (boardState: BoardPiece[], piece: BoardPiece, newX: number, newY: number, isEnPassant?: boolean) => {
  // move is on board check
  if (newX < 0 || newX > 8 || newY < 0 || newY > 8) {
    return false;
  }

  const targetPiece = boardState.find((p) => p.position[0] === newX && p.position[1] === newY);

  // can capture check
  if (squareOccupied(boardState, newX, newY)) {
    if (!canCapture(boardState, piece, newX, newY)) {
      return false;
    }
  }

  // modify boardstate to check if king is in check
  const newBoardState = boardState.map((p) => ({ ...p }));

  // Move the piece on the new board state
  const movingPiece = newBoardState.find((p) => p.id === piece.id);
  movingPiece.position = [newX, newY];

  // Temporarily remove the captured piece
  if (isEnPassant) {
    const direction = piece.name[1] === "W" ? -1 : 1;
    const capturedPawn = newBoardState.find((p) => p.position[0] === newX && p.position[1] === newY - direction);
    if (capturedPawn) {
      capturedPawn.position = [-1, -1];
    }
  } else if (targetPiece) {
    const capturedPiece = newBoardState.find((p) => p.id === targetPiece.id);
    capturedPiece.position = [-1, -1];
  }

  const isWhite = piece.name[1] === "W";
  const kingInCheck = isKingInCheck(newBoardState, isWhite);

  return !kingInCheck;
};

const isKingInCheck = (boardState, isWhite) => {
  const king = boardState.find((p) => p.name === `K${isWhite ? "W" : "B"}`);
  if (!king) {
    return false; // This should not happen in a valid chess game
  }

  const [kingX, kingY] = king.position;

  const S = 8; // Board size
  const attacks = {
    Q: {
      propagate: S,
      moves: [
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
        [0, 1],
        [0, -1],
        [-1, 0],
        [1, 0],
      ],
    },
    B: {
      propagate: S,
      moves: [
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ],
    },
    R: {
      propagate: S,
      moves: [
        [0, 1],
        [0, -1],
        [-1, 0],
        [1, 0],
      ],
    },
    N: {
      propagate: 1,
      moves: [
        [2, 1],
        [2, -1],
        [-2, 1],
        [-2, -1],
        [1, 2],
        [-1, 2],
        [1, -2],
        [-1, -2],
      ],
    },
    P: {
      propagate: 1,
      moves: [
        [1, isWhite ? 1 : -1],
        [-1, isWhite ? 1 : -1],
      ],
    }, // Adjust pawn direction based on color
  };

  const tsestRook = {
    R: {
      propagate: S,
      moves: [
        [0, 1],
        [0, -1],
        [-1, 0],
        [1, 0],
      ],
    },
  };

  const isOpponentPiece = (piece) => piece && piece.name[1] !== (isWhite ? "W" : "B");

  for (const piece of boardState) {
    if (isOpponentPiece(piece)) {
      const attackMoves = attacks[piece.name[0]];
      if (attackMoves) {
        for (const move of attackMoves.moves) {
          for (let i = 1; i <= attackMoves.propagate; i++) {
            const [dx, dy] = move;
            const x = piece.position[0] + dx * i;
            const y = piece.position[1] + dy * i;

            if (x < 0 || x >= S || y < 0 || y >= S) break;

            if (x === kingX && y === kingY) return true;

            const blockingPiece = boardState.find((p) => p.position[0] === x && p.position[1] === y);
            if (blockingPiece) break;
          }
        }
      }
    }
  }

  return false;
};

const squareOccupied = (boardState: BoardPiece[], newX: number, newY: number) => {
  return boardState.some((p) => p.position[0] === newX && p.position[1] === newY);
};

const canCapture = (boardState: BoardPiece[], piece: BoardPiece, newX: number, newY: number) => {
  const isWhite = piece.name[1] === "W";

  const foundPiece = boardState.find((p) => p.position[0] === newX && p.position[1] === newY);

  if (foundPiece) {
    return (foundPiece.name[1] === "W") !== isWhite;
  }
};

const canEnPassant = (boardState: BoardPiece[], piece: BoardPiece, newX: number, newY: number) => {
  const direction = piece.name[1] === "W" ? -1 : 1;

  const opponentPawn = boardState.find(
    (p) =>
      p.position[0] === newX &&
      p.position[1] === newY &&
      p.name[0] === "P" && // Ensure it's a pawn
      p.prevPosition[1] === newY + 2 * direction // Ensure the previous move was a two-square move
  );

  return !!opponentPawn;
};

const calculateAvailableMoves = (piece: BoardPiece, boardState: BoardPiece[]) => {
  const [x, y] = piece.position;
  const availableMoves: [number, number][] = [];
  const availableCaptures: [number, number, number?][] = [];

  const tryMove = (newX, newY) => {
    if (isMoveValid(boardState, piece, newX, newY)) {
      if (!squareOccupied(boardState, newX, newY)) {
        availableMoves.push([newX, newY]);
      } else if (canCapture(boardState, piece, newX, newY)) {
        availableCaptures.push([newX, newY]);
      }
    }
  };

  // Define movement rules based on the type of piece
  switch (piece.name) {
    case "KB":
    case "KW": // King can move one square in any direction
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx !== 0 || dy !== 0) {
            console.log("try this move", x + dx, y + dy);
            tryMove(x + dx, y + dy);
          }
        }
      }
      break;
    case "PB":
    case "PW": // Pawn can move one square forward
      const direction = piece.name[1] === "W" ? -1 : 1;
      const newY = y + direction;
      if (!squareOccupied(boardState, x, newY)) {
        if (isMoveValid(boardState, piece, x, newY)) {
          availableMoves.push([x, newY]);
        }
        if (piece.name[1] === "W" && piece.position[1] === 6) {
          if (isMoveValid(boardState, piece, x, newY)) {
            availableMoves.push([x, newY + direction]);
          }
        } else if (piece.name[1] === "B" && piece.position[1] === 1) {
          if (isMoveValid(boardState, piece, x, newY)) {
            availableMoves.push([x, newY + direction]);
          }
        }
      }
      // Capture moves for pawns
      if (canCapture(boardState, piece, x - 1, newY)) {
        if (isMoveValid(boardState, piece, x - 1, newY)) {
          availableCaptures.push([x - 1, newY]);
        }
      }
      if (canCapture(boardState, piece, x + 1, newY)) {
        if (isMoveValid(boardState, piece, x + 1, newY)) {
          availableCaptures.push([x + 1, newY]);
        }
      }
      // En passant capture
      if (canEnPassant(boardState, piece, x - 1, y)) {
        if (isMoveValid(boardState, piece, x - 1, newY, true)) {
          availableCaptures.push([x - 1, newY, y]);
        }
      }
      if (canEnPassant(boardState, piece, x + 1, y)) {
        if (isMoveValid(boardState, piece, x + 1, newY, true)) {
          availableCaptures.push([x + 1, newY, y]);
        }
      }
      break;
    case "RB":
    case "RW": // Rook can move horizontally or vertically until an occupied square or board edge is encountered
      // Horizontal movement (left and right)
      for (let i = x - 1; i >= 0; i--) {
        tryMove(i, y);
        if (squareOccupied(boardState, i, y)) break;
      }
      for (let i = x + 1; i < 8; i++) {
        tryMove(i, y);
        if (squareOccupied(boardState, i, y)) break;
      }
      // Vertical movement (up and down)
      for (let i = y - 1; i >= 0; i--) {
        tryMove(x, i);
        if (squareOccupied(boardState, x, i)) break;
      }
      for (let i = y + 1; i < 8; i++) {
        tryMove(x, i);
        if (squareOccupied(boardState, x, i)) break;
      }
      break;
    case "NB":
    case "NW": // Knight can move in L shape
      const knightMoves = [
        [2, 1],
        [2, -1],
        [-2, 1],
        [-2, -1],
        [1, 2],
        [-1, 2],
        [1, -2],
        [-1, -2],
      ];
      for (const [dx, dy] of knightMoves) {
        tryMove(x + dx, y + dy);
      }
      break;
    case "BB":
    case "BW": // Bishop can move diagonally until an occupied square or board edge is encountered
      for (let i = 1; i < 8; i++) {
        tryMove(x + i, y + i);
        if (squareOccupied(boardState, x + i, y + i)) break;
      }
      for (let i = 1; i < 8; i++) {
        tryMove(x + i, y - i);
        if (squareOccupied(boardState, x + i, y - i)) break;
      }
      for (let i = 1; i < 8; i++) {
        tryMove(x - i, y + i);
        if (squareOccupied(boardState, x - i, y + i)) break;
      }
      for (let i = 1; i < 8; i++) {
        tryMove(x - i, y - i);
        if (squareOccupied(boardState, x - i, y - i)) break;
      }
      break;
    case "QB":
    case "QW": // Queen can move horizontally, vertically, or diagonally
      // Horizontal movement (left and right)
      for (let i = x - 1; i >= 0; i--) {
        tryMove(i, y);
        if (squareOccupied(boardState, i, y)) break;
      }
      for (let i = x + 1; i < 8; i++) {
        tryMove(i, y);
        if (squareOccupied(boardState, i, y)) break;
      }
      // Vertical movement (up and down)
      for (let i = y - 1; i >= 0; i--) {
        tryMove(x, i);
        if (squareOccupied(boardState, x, i)) break;
      }
      for (let i = y + 1; i < 8; i++) {
        tryMove(x, i);
        if (squareOccupied(boardState, x, i)) break;
      }
      // Diagonal movement
      for (let i = 1; i < 8; i++) {
        tryMove(x + i, y + i);
        if (squareOccupied(boardState, x + i, y + i)) break;
      }
      for (let i = 1; i < 8; i++) {
        tryMove(x + i, y - i);
        if (squareOccupied(boardState, x + i, y - i)) break;
      }
      for (let i = 1; i < 8; i++) {
        tryMove(x - i, y + i);
        if (squareOccupied(boardState, x - i, y + i)) break;
      }
      for (let i = 1; i < 8; i++) {
        tryMove(x - i, y - i);
        if (squareOccupied(boardState, x - i, y - i)) break;
      }
      break;

    // Add movement rules for other pieces...

    default:
      break;
  }
  return [availableMoves, availableCaptures];
};

export default calculateAvailableMoves;
