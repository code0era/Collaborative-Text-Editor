// backend/index.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

let content = "";

io.on("connection", socket => {
  console.log("User connected:", socket.id);
  socket.emit("load-document", content);

  socket.on("send-changes", delta => {
    socket.broadcast.emit("receive-changes", delta);
  });

  socket.on("send-cursor", data => {
    socket.broadcast.emit("receive-cursor", data);
  });

  socket.on("save-document", newContent => {
    content = newContent;
  });
});

server.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
