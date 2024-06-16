import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

let chatLog = [];
let connectedUsers = {}; // Store connected users

let players = {
  white: null,
  black: null,
  spectating: [],
};

io.on("connection", (socket) => {
  console.log("a user connected");

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
      }
      console.log("Players updated:", players);
      io.emit("updatePlayers", players);
    }
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
