import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

let boardState = [
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
let chatLog = [];
let connectedUsers = {}; // Store connected users

let players = {
  white: null,
  black: null,
  spectating: [],
  turn: "white",
  whiteReady: false,
  blackReady: false,
};

const toggleTurn = () => {
  players.turn = players.turn === "white" ? "black" : "white";
  io.emit("turn", players);
};

const startGame = () => {
  console.log("game starts");
  // players.turn = 'white'
  // io.emit("startGame", )
};

io.on("connection", (socket) => {
  console.log("a user connected");

  // Handle the request for the current board state
  socket.on("request board state", () => {
    console.log("Board state requested by client.");
    socket.emit("board state", boardState);
  });

  //update board
  socket.on("update board", (newBoardState) => {});

  //handle set username
  socket.on("set username", (username) => {
    connectedUsers[socket.id] = { socketID: socket.id, username }; // Store socketID along with username
    players.spectating.push({ socketID: socket.id, username });
    io.emit("user list", Object.values(connectedUsers)); // Broadcast the list of users with socket IDs
    console.log("User set username:", username);
    console.log("Current connected users:", Object.values(connectedUsers));
    io.emit("updatePlayers", players);
  });

  // Handle choose side
  socket.on("chooseSide", (side) => {
    const player =
      players.spectating.find((p) => p.socketID === socket.id) ||
      (players.white?.socketID === socket.id ? players.white : null) ||
      (players.black?.socketID === socket.id ? players.black : null);

    if (player) {
      if (side === "white" && !players.white) {
        if (players.black?.socketID === socket.id) {
          players.black = null;
        }
        players.white = player;
        players.spectating = players.spectating.filter((p) => p.socketID !== socket.id);
      } else if (side === "black" && !players.black) {
        if (players.white?.socketID === socket.id) {
          players.white = null;
        }
        players.black = player;
        players.spectating = players.spectating.filter((p) => p.socketID !== socket.id);
      } else if (side === "leave white" && players.white) {
        if (players.white?.socketID === socket.id) {
          players.white = null;
          players.spectating.push(player);
        }
      } else if (side === "leave black" && players.black?.socketID === socket.id) {
        players.black = null;
        players.spectating.push(player);
      }

      console.log("Players updated:", players);
      io.emit("updatePlayers", players);
    }
  });

  //handle ready
  socket.on("ready", () => {
    if (players.white?.socketID === socket.id) {
      players.whiteReady = true;
    } else if (players.black?.socketID === socket.id) {
      players.blackReady = true;
    }
    io.emit("updatePlayers", players);

    if (players.whiteReady && players.blackReady) {
      io.emit("start game");
    }
    console.log(players);
  });

  //handle move
  socket.on("move", (updatedBoard) => {
    console.log(socket.id, "moved");
    if ((players.turn === "white" && players.white?.socketID === socket.id) || (players.turn === "black" && players.black?.socketID === socket.id)) {
      io.emit("updateBoard", updatedBoard);
      toggleTurn();
    } else {
      socket.emit("error", "It's not your turn!");
    }
    console.log("move happend", players);
  });

  //handle chat log
  socket.emit("chat history", chatLog);

  socket.on("chat message", (data) => {
    const { username, message } = data;
    const messageWithUsername = { username, message };
    chatLog.push(messageWithUsername);
    io.emit("chat message", messageWithUsername);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    const user = connectedUsers[socket.id];
    if (user) {
      players.spectating = players.spectating.filter((p) => p.socketID !== socket.id);
      if (players.white?.socketID === socket.id) players.white = null;
      if (players.black?.socketID === socket.id) players.black = null;
      delete connectedUsers[socket.id];
      io.emit("user list", Object.values(connectedUsers)); // Broadcast the updated list of usernames
      io.emit("updatePlayers", players); // Update players on disconnection
      console.log("user disconnected");
    }
  });
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
