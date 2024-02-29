const express = require("express");
const mongoose = require('mongoose');
const http = require("http");
const socketIO = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});
const cors = require("cors");
app.use(express.json());

async function startServer() {
  try {
    await mongoose.connect(
      `mongodb://localhost:27017/`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log("Connected to the database");
  } catch (error) {
    console.error("Database connection error:", error);
  }

  app.use(cors());
  app.use("/auth", require("./routes/user"));

  app.use(
    cors({
      origin: "http://localhost:3000",
    })
  );

  io.on("connection", (socket) => {});

  const port = 5000;
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

startServer();
