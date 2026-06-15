import app from "./app.js";
import http from "http";
import "dotenv/config";
import { Server } from "socket.io";
import cookie from "cookie-parser";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import ProjectModul from "./src/modules/Project.module.js";

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.split(" ")[1];
    const projectId = socket.handshake.query.projectId;
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return next(new Error("Invalid project ID"));
    }

    socket.projectId = await ProjectModul.findById(projectId);

    if (!token) {
      return next(new Error("Authentication error: Token missing"));
    }

    // 4. Verify the token (ensure you pass your secret key)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Attach user data to the socket for later use
    socket.user = decoded;

    next();
  } catch (error) {
    next(new Error("Authentication error: Invalid token"));
  }
});

io.on("connection", (socket) => {
  console.log("socket io is connect");
  socket.roomid=socket.projectId._id.toString()
  console.log(socket.projectId._id.toString());

  socket.join(socket.roomid);
  socket.on("porject-message", (data) => {
    console.log(data);

    socket.broadcast
      .to(socket.roomid)
      .emit("receive_message", data);
  });

  socket.on("event", (data) => {
    /* … */
  });
  socket.on("disconnect", () => {
    /* … */
  });
});

server.listen(PORT, () => {
  console.log(`server on port number:${PORT}`);
});
