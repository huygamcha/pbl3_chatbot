const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const historyRoutes = require("./routes/historyRoutes");
const passwordRoutes = require("./routes/passwordRoutes");
const morgan = require("morgan");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();

connectDB();

const app = express();
app.use(morgan("combined"));

app.use(express.json()); // to accept json data
// Add CORS here
app.use(
  cors({
    origin: "*",
  })
);
app.get("/", (req, res) => {
  res.send("API is running");
});
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/history", historyRoutes);
app.use("/api", passwordRoutes);
app.use(notFound);
app.use(errorHandler);
const Port = process.env.PORT || 2000;

// app.listen(`${Port}`, console.log(`server starting at ${Port}`));
const server = app.listen(
  Port,
  console.log(`Server running on PORT ${Port}...`)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://pbl3-chatbot.vercel.app",
    // credentials: true,
  },
});

let connectedUsers = {};

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("login", (data) => {
    io.emit("allLogins", data.name);
  });

  socket.on("logout", (user) => {
    console.log("Client disconnected:", user._id);
    io.emit("logout user", user.name);
  });

  socket.on("disconnect", () => {});
});
