import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

let chatLog = [];

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.emit("chat history", chatLog);

  socket.on("chat message", (msg) => {
    chatLog.push(msg);
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
