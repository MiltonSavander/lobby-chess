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
  hasMoved: boolean;
}

interface Piece {
  name: string;
  src: string;
  id: string;
}

interface PieceProps {
  piece: Piece;
  myTurn: boolean;
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
  { id: "PB2", name: "PB", position: [1, 1], prevPosition: [1, 1], hasMoved: false },
  { id: "PW3", name: "PW", position: [2, 6], prevPosition: [2, 6], hasMoved: false },
  { id: "KW1", name: "KW", position: [4, 7], prevPosition: [4, 7], hasMoved: false },
  { id: "RB1", name: "RB", position: [0, 0], prevPosition: [0, 0], hasMoved: false },
  { id: "RW1", name: "RW", position: [0, 7], prevPosition: [0, 7], hasMoved: false },
];

const startingPositions: BoardPiece[] = [
  // Black pieces
  { id: "RB1", name: "RB", position: [0, 0], prevPosition: [0, 0], hasMoved: false },
  { id: "NB1", name: "NB", position: [1, 0], prevPosition: [1, 0], hasMoved: false },
  { id: "BB1", name: "BB", position: [2, 0], prevPosition: [2, 0], hasMoved: false },
  { id: "QB1", name: "QB", position: [3, 0], prevPosition: [3, 0], hasMoved: false },
  { id: "KB1", name: "KB", position: [4, 0], prevPosition: [4, 0], hasMoved: false },
  { id: "BB2", name: "BB", position: [5, 0], prevPosition: [5, 0], hasMoved: false },
  { id: "NB2", name: "NB", position: [6, 0], prevPosition: [6, 0], hasMoved: false },
  { id: "RB2", name: "RB", position: [7, 0], prevPosition: [7, 0], hasMoved: false },
  { id: "PB1", name: "PB", position: [0, 1], prevPosition: [0, 1], hasMoved: false },
  { id: "PB2", name: "PB", position: [1, 1], prevPosition: [1, 1], hasMoved: false },
  { id: "PB3", name: "PB", position: [2, 1], prevPosition: [2, 1], hasMoved: false },
  { id: "PB4", name: "PB", position: [3, 1], prevPosition: [3, 1], hasMoved: false },
  { id: "PB5", name: "PB", position: [4, 1], prevPosition: [4, 1], hasMoved: false },
  { id: "PB6", name: "PB", position: [5, 1], prevPosition: [5, 1], hasMoved: false },
  { id: "PB7", name: "PB", position: [6, 1], prevPosition: [6, 1], hasMoved: false },
  { id: "PB8", name: "PB", position: [7, 1], prevPosition: [7, 1], hasMoved: false },

  // White pieces
  { id: "RW1", name: "RW", position: [0, 7], prevPosition: [0, 7], hasMoved: false },
  { id: "NW1", name: "NW", position: [1, 7], prevPosition: [1, 7], hasMoved: false },
  { id: "BW1", name: "BW", position: [2, 7], prevPosition: [2, 7], hasMoved: false },
  { id: "QW1", name: "QW", position: [3, 7], prevPosition: [3, 7], hasMoved: false },
  { id: "KW1", name: "KW", position: [4, 7], prevPosition: [4, 7], hasMoved: false },
  { id: "BW2", name: "BW", position: [5, 7], prevPosition: [5, 7], hasMoved: false },
  { id: "NW2", name: "NW", position: [6, 7], prevPosition: [6, 7], hasMoved: false },
  { id: "RW2", name: "RW", position: [7, 7], prevPosition: [7, 7], hasMoved: false },
  { id: "PW1", name: "PW", position: [0, 6], prevPosition: [0, 6], hasMoved: false },
  { id: "PW2", name: "PW", position: [1, 6], prevPosition: [1, 6], hasMoved: false },
  { id: "PW3", name: "PW", position: [2, 6], prevPosition: [2, 6], hasMoved: false },
  { id: "PW4", name: "PW", position: [3, 6], prevPosition: [3, 6], hasMoved: false },
  { id: "PW5", name: "PW", position: [4, 6], prevPosition: [4, 6], hasMoved: false },
  { id: "PW6", name: "PW", position: [5, 6], prevPosition: [5, 6], hasMoved: false },
  { id: "PW7", name: "PW", position: [6, 6], prevPosition: [6, 6], hasMoved: false },
  { id: "PW8", name: "PW", position: [7, 6], prevPosition: [7, 6], hasMoved: false },
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

const ChessPiece: React.FC<PieceProps> = ({ piece, myTurn, boardState }) => {
  const [availableMoves, setAvailableMoves] = useState<[number, number][]>([]);
  const [availableCaptures, setAvailableCaptures] = useState<[number, number, number?][]>([]);

  const [{ isDragging }, drag, preview] = useDrag({
    type: "PIECE",
    item: () => {
      // Calculate available moves and captures when dragging starts
      const [moves, captures] = calculateAvailableMoves(piece, boardState);
      setAvailableMoves(moves);
      setAvailableCaptures(captures);
      return { id: piece.id, availableMoves: moves, availableCaptures: captures, src: piece.src };
    },
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
      ref={myTurn ? drag : undefined} // Only attach the drag handler if canDrag is true
      src={piece.src}
      alt={piece.name}
      style={{
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        opacity: isDragging ? "0.5" : "1",
        transform: "translate(0,0)",
        cursor: myTurn ? "pointer" : "default", // Set cursor to pointer when dragging
      }}
    />
  );
};

const BoardSquare: React.FC<BoardSquareProps> = ({ x, y, children, setBoardState, boardState, socket }) => {
  const [{}, drop] = useDrop({
    accept: "PIECE",
    drop: (item: { id: string; availableCaptures: [number, number, number?][]; availableMoves: [number, number][] }) => {
      // console.log("this square is ", x, y);
      // console.log("this is the checking available moves", item.availableMoves, "and", item.availableCaptures);

      setBoardState(() => {
        const piece = boardState.find((p) => p.id === item.id);

        if (!piece) {
          return boardState; // if the piece is not found, return the previous board state
        }

        let newBoardState;

        // Check if the move is a valid non-capture move
        if (item.availableMoves.some((a) => a[0] === x && a[1] === y)) {
          newBoardState = boardState.map((p) =>
            p.id === item.id ? { ...p, prevPosition: [...p.position], position: [x, y], hasMoved: true } : { ...p, prevPosition: [...p.position] }
          );
        } else {
          // Check if the move is a valid capture move
          const captureMove = item.availableCaptures.find((a) => a[0] === x && a[1] === y);
          if (captureMove) {
            const isEnPassant = captureMove.length === 3;

            // Handle en passant capture
            if (isEnPassant) {
              const enPassantY = captureMove[2];
              newBoardState = boardState
                .map((p) =>
                  p.id === item.id ? { ...p, prevPosition: [...p.position], position: [x, y], hasMoved: true } : { ...p, prevPosition: [...p.position] }
                )
                .filter((p) => !(p.position[0] === x && p.position[1] === enPassantY && p.id !== item.id));
            } else {
              // Handle normal capture
              newBoardState = boardState
                .map((p) =>
                  p.id === item.id ? { ...p, prevPosition: [...p.position], position: [x, y], hasMoved: true } : { ...p, prevPosition: [...p.position] }
                )
                .filter((p) => !(p.position[0] === x && p.position[1] === y && p.id !== item.id));
            }
          } else {
            return boardState;
          }
        }

        // console.log("after updated board", newBoardState);

        // Emit the updated board state to the server
        socket.emit("move", newBoardState);

        return newBoardState;
      });

      // console.log("after updated board", boardState);
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
        cursor: "pointer",
      }}
    >
      {children}
    </div>
  );
};

export default function ChessComponent({ socket, players, setPlayers, serverBoardState }) {
  const [boardState, setBoardState] = useState<BoardPiece[]>(serverBoardState);
  const [myTurn, setMyTurn] = useState<boolean>(true);
  const boardRef = useRef<HTMLDivElement>(null);
  const [boardOffset, setBoardOffset] = useState({ x: 0, y: 0 });
  const [containerDimensions, setContainerDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [playing, setPlaying] = useState(false);

  // fix board if rezied
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

  useEffect(() => {
    socket.on("start game", () => {
      console.log("server says start game");
      setPlaying(true);
    });

    socket.on("turn", (players) => {
      setPlayers(players);
    });

    socket.on("updateBoard", (newBoard) => {
      console.log("updated board");
      setBoardState(newBoard);
    });
  }, [socket, serverBoardState, players]);

  useEffect(() => {
    console.log(players);
    console.log(socket);

    const currentPlayerColor = socket.id === players.white?.socketID ? "white" : socket.id === players.black?.socketID ? "black" : undefined;
    const canDragState = players.turn === currentPlayerColor;
    console.log(currentPlayerColor);
    console.log("players turn", players.turn);
    console.log("can drag", myTurn);

    setMyTurn(canDragState);
  }, [players, socket.id, serverBoardState, boardState]);

  const renderPiece = (x: number, y: number) => {
    const piece = boardState.find((p) => p.position[0] === x && p.position[1] === y);
    if (!piece) return null; // Add null check here

    if (piece) {
      const pieceInfo = pieces.find((p) => p.name === piece.name);
      if (pieceInfo) {
        return <ChessPiece piece={{ ...piece, ...pieceInfo }} myTurn={myTurn} boardState={boardState} />;
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
          <BoardSquare x={x} y={y} setBoardState={setBoardState} boardState={boardState} socket={socket}>
            <Square black={black}>{renderPiece(x, y)}</Square>
          </BoardSquare>
        </div>
      );
    }
    return squares;
  };

  const handleReady = () => {
    socket.emit("ready");
    console.log(players);
    console.log(`white is ready ${players.whiteReady}, black is ready ${players.blackReady}`);
  };

  return (
    <div ref={boardRef} className="chess__board size-[700px] mr-10 relative">
      <DndProvider options={HTML5toTouch}>
        <div className="hover:cursor-pointer" style={{ width: "100%", height: "100%", display: "flex", flexWrap: "wrap" }}>
          {renderSquares()}
          <CustomDragLayer boardOffset={boardOffset} containerDimensions={containerDimensions} />
        </div>
      </DndProvider>
      {!playing && (
        <div className="absolute top-0 left-0 bg-[#40404080]  w-full h-full z-10 flex justify-center items-center">
          <div className=" w-80 h-80 bg-white opacity-100 flex justify-center items-center">
            <button onClick={handleReady} className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md">
              start game
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
