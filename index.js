const express = require("express");
const http = require("http");
const app = express();
const port = 8000;
const path = require("path");

const Server = http.createServer(app);
const io = require("socket.io")(Server, {
  cors: {
    origin: "http://localhost:8000",
    methods: ["GET", "POST"],
  },
});

app.use(express.static(path.join(__dirname, "public")));

Server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

let socketsConnected = new Set();

io.on("connection", (socket) => {
  socketsConnected.add(socket.id);

  io.emit("clients_total", socketsConnected.size);

  socket.on("disconnect", () => {
    socketsConnected.delete(socket.id);

    io.emit("clients_total", socketsConnected.size);
  });

  socket.on("new_message", (data) => {
    socket.broadcast.emit("chat_message", data);
  });
});
