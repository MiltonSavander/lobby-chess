import { useState } from "react";
import { DndProvider, useDrop, useDrag } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import calculateAvailableMoves from "../utils";

interface SquareProps {
  black: boolean;
  children: React.ReactNode;
}

interface BoardSquareProps {
  x: number;
  y: number;
  children: React.ReactNode;
  setBoard: Function;
}

interface BoardPiece {
  id: string;
  name: string;
  position: [number, number];
}

interface Piece {
  name: string;
  src: string;
}

interface PieceProps {
  piece: Piece;
  isDragging: Boolean;
  canDrag: Boolean;
  availableMoves: number[][];
}

const pieces: Piece[] = [
  { name: "KB", src: "/assets/pieces/Chess_kdt45.svg" },
  { name: "QB", src: "/assets/pieces/Chess_qdt45.svg" },
  { name: "BB", src: "/assets/pieces/Chess_bdt45.svg" },
  { name: "NB", src: "/assets/pieces/Chess_ndt45.svg" },
  { name: "RB", src: "/assets/pieces/Chess_rdt45.svg" },
  { name: "PB", src: "/assets/pieces/Chess_pdt45.svg" },
  { name: "KW", src: "/assets/pieces/Chess_klt45.svg" },
  { name: "QW", src: "/assets/pieces/Chess_qlt45.svg" },
  { name: "BW", src: "/assets/pieces/Chess_blt45.svg" },
  { name: "NW", src: "/assets/pieces/Chess_nlt45.svg" },
  { name: "RW", src: "/assets/pieces/Chess_rlt45.svg" },
  { name: "PW", src: "/assets/pieces/Chess_plt45.svg" },
];

const testPosition: BoardPiece[] = [{ id: "KW1", name: "KW", position: [4, 7] }];

const startingPositions: BoardPiece[] = [
  // Black pieces
  { id: "RB1", name: "RB", position: [0, 0] },
  { id: "NB1", name: "NB", position: [1, 0] },
  { id: "BB1", name: "BB", position: [2, 0] },
  { id: "QB1", name: "QB", position: [3, 0] },
  { id: "KB1", name: "KB", position: [4, 0] },
  { id: "BB2", name: "BB", position: [5, 0] },
  { id: "NB2", name: "NB", position: [6, 0] },
  { id: "RB2", name: "RB", position: [7, 0] },
  { id: "PB1", name: "PB", position: [0, 1] },
  { id: "PB2", name: "PB", position: [1, 1] },
  { id: "PB3", name: "PB", position: [2, 1] },
  { id: "PB4", name: "PB", position: [3, 1] },
  { id: "PB5", name: "PB", position: [4, 1] },
  { id: "PB6", name: "PB", position: [5, 1] },
  { id: "PB7", name: "PB", position: [6, 1] },
  { id: "PB8", name: "PB", position: [7, 1] },

  // White pieces
  { id: "RW1", name: "RW", position: [0, 7] },
  { id: "NW1", name: "NW", position: [1, 7] },
  { id: "BW1", name: "BW", position: [2, 7] },
  { id: "QW1", name: "QW", position: [3, 7] },
  { id: "KW1", name: "KW", position: [4, 7] },
  { id: "BW2", name: "BW", position: [5, 7] },
  { id: "NW2", name: "NW", position: [6, 7] },
  { id: "RW2", name: "RW", position: [7, 7] },
  { id: "PW1", name: "PW", position: [0, 6] },
  { id: "PW2", name: "PW", position: [1, 6] },
  { id: "PW3", name: "PW", position: [2, 6] },
  { id: "PW4", name: "PW", position: [3, 6] },
  { id: "PW5", name: "PW", position: [4, 6] },
  { id: "PW6", name: "PW", position: [5, 6] },
  { id: "PW7", name: "PW", position: [6, 6] },
  { id: "PW8", name: "PW", position: [7, 6] },
];

const Square: React.FC<SquareProps> = ({ black, children }) => {
  const backgroundColor = black ? "#1E5128" : "#D8E9A8";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {children}
    </div>
  );
};

const ChessPiece: React.FC<PieceProps> = ({ piece, isDragging, canDrag, availableMoves }) => {
  const [, drag] = useDrag({
    type: "PIECE",
    item: { id: piece.id, availableMoves: availableMoves },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <img
      ref={canDrag ? drag : undefined} // Only attach the drag handler if canDrag is true
      src={piece.src}
      alt={piece.name}
      style={{
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        opacity: isDragging ? "0" : "1",
        transform: "translate(0,0)",
      }}
    />
  );
};

const BoardSquare: React.FC<BoardSquareProps> = ({ x, y, children, setBoard }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "PIECE",
    drop: (item: { id: string; availableMoves: number[] }, monitor) => {
      console.log("this square is ", x, y);
      console.log("this is the checking available moves", item.availableMoves);
      if (item.availableMoves.some((a) => a[0] === x && a[1] === y)) {
        setBoard((prevBoard) => prevBoard.map((piece) => (piece.id === item.id ? { ...piece, position: [x, y] } : piece)));
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver,
    }),
  });

  return (
    <div
      ref={drop}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {children}
    </div>
  );
};

export default function ChessComponent() {
  const [boardState, setBoardState] = useState<BoardPiece[]>(testPosition);
  const [draggingPieceId, setDraggingPieceId] = useState<string | null>(null);
  const [canDrag, setCanDrag] = useState<boolean>(true);

  const renderPiece = (x: number, y: number) => {
    const piece = boardState.find((p) => p.position[0] === x && p.position[1] === y);
    if (!piece) return null; // Add null check here

    const availableMoves = calculateAvailableMoves(piece);

    if (piece && piece.id !== draggingPieceId) {
      const pieceInfo = pieces.find((p) => p.name === piece.name);
      if (pieceInfo) {
        return <ChessPiece piece={{ ...piece, ...pieceInfo }} isDragging={piece.id === draggingPieceId} canDrag={canDrag} availableMoves={availableMoves} />;
      }
    }
    return null;
  };
  // Render squares on the board
  const renderSquares = () => {
    const squares: React.ReactNode[] = [];
    for (let i = 0; i < 64; i++) {
      const x = i % 8;
      const y = Math.floor(i / 8);
      const black = (x + y) % 2 === 1;

      squares.push(
        <div key={i} style={{ width: "12.5%", height: "12.5%" }}>
          <BoardSquare x={x} y={y} setBoard={setBoardState}>
            <Square black={black}>{renderPiece(x, y)}</Square>
          </BoardSquare>
        </div>
      );
    }
    return squares;
  };

  console.log(boardState);

  return (
    <div className="chess__board size-[500px] mr-10">
      <DndProvider backend={HTML5Backend}>
        <div className="hover:cursor-pointer" style={{ width: "100%", height: "100%", display: "flex", flexWrap: "wrap" }}>
          {/* Render squares */}
          {renderSquares()}
        </div>
      </DndProvider>
    </div>
  );
}
