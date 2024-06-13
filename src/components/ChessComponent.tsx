import { useEffect, useRef, useState } from "react";
import { useDrop, useDrag } from "react-dnd";
import calculateAvailableMoves from "../utils";
import React from "react";
import CustomDragLayer from "./CustomDragLayer";
import { DndProvider } from "react-dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch";

interface SquareProps {
  black: boolean;
  children: React.ReactNode;
}

interface BoardSquareProps {
  x: number;
  y: number;
  children: React.ReactNode;
  setBoardState: React.Dispatch<React.SetStateAction<BoardPiece[]>>;
}

interface BoardPiece {
  id: string;
  name: string;
  position: [number, number];
  prevPosition: [number, number];
}

interface Piece {
  name: string;
  src: string;
  id: string;
}

interface PieceProps {
  piece: Piece;
  canDrag: boolean;
  availableMoves: [number, number];
  availableCaptures: [number, number, number?];
}

interface pieceRef {
  name: string;
  src: string;
}

const pieces: pieceRef[] = [
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

const testPosition: BoardPiece[] = [
  { id: "PB2", name: "PB", position: [1, 1], prevPosition: [1, 1] },
  { id: "PW3", name: "PW", position: [2, 6], prevPosition: [2, 6] },
];

const startingPositions: BoardPiece[] = [
  // Black pieces
  { id: "RB1", name: "RB", position: [0, 0], prevPosition: [0, 0] },
  { id: "NB1", name: "NB", position: [1, 0], prevPosition: [1, 0] },
  { id: "BB1", name: "BB", position: [2, 0], prevPosition: [2, 0] },
  { id: "QB1", name: "QB", position: [3, 0], prevPosition: [3, 0] },
  { id: "KB1", name: "KB", position: [4, 0], prevPosition: [4, 0] },
  { id: "BB2", name: "BB", position: [5, 0], prevPosition: [5, 0] },
  { id: "NB2", name: "NB", position: [6, 0], prevPosition: [6, 0] },
  { id: "RB2", name: "RB", position: [7, 0], prevPosition: [7, 0] },
  { id: "PB1", name: "PB", position: [0, 1], prevPosition: [0, 1] },
  { id: "PB2", name: "PB", position: [1, 1], prevPosition: [1, 1] },
  { id: "PB3", name: "PB", position: [2, 1], prevPosition: [2, 1] },
  { id: "PB4", name: "PB", position: [3, 1], prevPosition: [3, 1] },
  { id: "PB5", name: "PB", position: [4, 1], prevPosition: [4, 1] },
  { id: "PB6", name: "PB", position: [5, 1], prevPosition: [5, 1] },
  { id: "PB7", name: "PB", position: [6, 1], prevPosition: [6, 1] },
  { id: "PB8", name: "PB", position: [7, 1], prevPosition: [7, 1] },

  // White pieces
  { id: "RW1", name: "RW", position: [0, 7], prevPosition: [0, 7] },
  { id: "NW1", name: "NW", position: [1, 7], prevPosition: [1, 7] },
  { id: "BW1", name: "BW", position: [2, 7], prevPosition: [2, 7] },
  { id: "QW1", name: "QW", position: [3, 7], prevPosition: [3, 7] },
  { id: "KW1", name: "KW", position: [4, 7], prevPosition: [4, 7] },
  { id: "BW2", name: "BW", position: [5, 7], prevPosition: [5, 7] },
  { id: "NW2", name: "NW", position: [6, 7], prevPosition: [6, 7] },
  { id: "RW2", name: "RW", position: [7, 7], prevPosition: [7, 7] },
  { id: "PW1", name: "PW", position: [0, 6], prevPosition: [0, 6] },
  { id: "PW2", name: "PW", position: [1, 6], prevPosition: [1, 6] },
  { id: "PW3", name: "PW", position: [2, 6], prevPosition: [2, 6] },
  { id: "PW4", name: "PW", position: [3, 6], prevPosition: [3, 6] },
  { id: "PW5", name: "PW", position: [4, 6], prevPosition: [4, 6] },
  { id: "PW6", name: "PW", position: [5, 6], prevPosition: [5, 6] },
  { id: "PW7", name: "PW", position: [6, 6], prevPosition: [6, 6] },
  { id: "PW8", name: "PW", position: [7, 6], prevPosition: [7, 6] },
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

const ChessPiece: React.FC<PieceProps> = ({ piece, canDrag, availableMoves, availableCaptures }) => {
  const [{ isDragging }, drag, preview] = useDrag({
    type: "PIECE",
    item: { id: piece.id, availableMoves, availableCaptures, src: piece.src },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  useEffect(() => {
    if (preview) {
      const img = new Image();
      img.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
      preview(img);
    }
  }, [preview]);

  return (
    <img
      className="pieceImg"
      ref={canDrag ? drag : undefined} // Only attach the drag handler if canDrag is true
      src={piece.src}
      alt={piece.name}
      style={{
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        opacity: isDragging ? "0.5" : "1",
        transform: "translate(0,0)",
        cursor: canDrag ? "pointer" : "default", // Set cursor to pointer when dragging
      }}
    />
  );
};

const BoardSquare: React.FC<BoardSquareProps> = ({ x, y, children, setBoardState, boardState }) => {
  const [{}, drop] = useDrop({
    accept: "PIECE",
    drop: (item: { id: string; availableCaptures: [number, number, number?][]; availableMoves: [number, number][] }) => {
      console.log("this square is ", x, y);
      console.log("this is the checking available moves", item.availableMoves, "and", item.availableCaptures);

      setBoardState(() => {
        const piece = boardState.find((p) => p.id === item.id);

        if (!piece) {
          return boardState; // if the piece is not found, return the previous board state
        }

        // Check if the move is a valid non-capture move
        if (item.availableMoves.some((a) => a[0] === x && a[1] === y)) {
          return boardState.map((p) =>
            p.id === item.id ? { ...p, prevPosition: [...p.position], position: [x, y] } : { ...p, prevPosition: [...p.position] }
          );
        }

        // Check if the move is a valid capture move
        const captureMove = item.availableCaptures.find((a) => a[0] === x && a[1] === y);
        if (captureMove) {
          const isEnPassant = captureMove.length === 3;

          // Handle en passant capture
          if (isEnPassant) {
            const enPassantY = captureMove[2];
            return boardState
              .map((p) => (p.id === item.id ? { ...p, prevPosition: [...p.position], position: [x, y] } : { ...p, prevPosition: [...p.position] }))
              .filter((p) => !(p.position[0] === x && p.position[1] === enPassantY && p.id !== item.id));
          }

          // Handle normal capture
          return boardState
            .map((p) => (p.id === item.id ? { ...p, prevPosition: [...p.position], position: [x, y] } : { ...p, prevPosition: [...p.position] }))
            .filter((p) => !(p.position[0] === x && p.position[1] === y && p.id !== item.id));
        }

        return boardState;
      });

      console.log("after updated board", boardState);
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
  const [boardState, setBoardState] = useState<BoardPiece[]>(startingPositions);
  const [canDrag, setCanDrag] = useState<boolean>(true);
  const boardRef = useRef<HTMLDivElement>(null);
  const [boardOffset, setBoardOffset] = useState({ x: 0, y: 0 });
  const [containerDimensions, setContainerDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  useEffect(() => {
    const updateBoardOffset = () => {
      if (boardRef.current) {
        const rect = boardRef.current.getBoundingClientRect();
        const { width, height } = boardRef.current.getBoundingClientRect();
        setContainerDimensions({ width, height });
        setBoardOffset({ x: rect.left + window.scrollX, y: rect.top + window.scrollY });
      }
    };

    // Initial calculation
    updateBoardOffset();

    // Add event listener for window resize
    window.addEventListener("resize", updateBoardOffset);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", updateBoardOffset);
    };
  }, []);

  const renderPiece = (x: number, y: number) => {
    const piece = boardState.find((p) => p.position[0] === x && p.position[1] === y);
    if (!piece) return null; // Add null check here

    const [availableMoves, availableCaptures] = calculateAvailableMoves(piece, boardState);

    if (piece) {
      const pieceInfo = pieces.find((p) => p.name === piece.name);
      if (pieceInfo) {
        return <ChessPiece piece={{ ...piece, ...pieceInfo }} canDrag={canDrag} availableMoves={availableMoves} availableCaptures={availableCaptures} />;
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
          <BoardSquare x={x} y={y} setBoardState={setBoardState} boardState={boardState}>
            <Square black={black}>{renderPiece(x, y)}</Square>
          </BoardSquare>
        </div>
      );
    }
    return squares;
  };

  // console.log(boardState);

  return (
    <div ref={boardRef} className="chess__board size-[700px] mr-10">
      <DndProvider options={HTML5toTouch}>
        <div className="hover:cursor-pointer" style={{ width: "100%", height: "100%", display: "flex", flexWrap: "wrap" }}>
          {/* Render squares */}
          {renderSquares()}
          <CustomDragLayer boardOffset={boardOffset} containerDimensions={containerDimensions} />
        </div>
      </DndProvider>
    </div>
  );
}
