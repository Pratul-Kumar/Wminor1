const express = require("express");
const cors = require("cors");
const path = require("path");
require('dotenv').config();


const app = express();

const mongoose = require("mongoose");

const userRouter = require("./routes/userRoutes");
const chatRouter = require("./routes/chatRoutes");
const msgRoute = require("./routes/msgRoutes.js");
const connectionToDB = require("./utils/connectionToDB");

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({extended :false})); // pro
//connection to Db
connectionToDB();
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", msgRoute);

//-------------------Deployment--------------------------
const __dirname1 = path.resolve();
if (process.env.MODE === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Welcome To Whatsapp Clone Backend");
  });
}

//-------------------Deployment--------------------------

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Server is running on ${port}`);
  //connection to Db
  //connectionToDB();
});

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});
io.on("connection", (socket) => {
  console.log("Connected at socket id ", socket.id);

  socket.on("setUp", (userData) => {
    console.log("User Room", userData?._id);
    socket.join(userData?._id);
    socket.emit("connected");
  });

  socket.on("joinChat", (room) => {
    socket.join(room);
    console.log("join room ", room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("newMessage", (msg) => {
    let chat = msg.chat;
    if (!chat.users) return console.log("user not found");
    chat?.users?.forEach((user) => {
      if (String(user._id) == String(msg.sender._id)) return;
      socket.to(user._id).emit("msg received", msg);
    });
  });

  socket.off("setUp", () => {
    socket.leave(userData._id);
    console.log("user disconnected");
  });

  socket.on("disconnect", () => {
    console.log("disconnected at ", socket.id);
  });

  // socket.on('isActive',(data)=>{
  //   console.log("Login",data);
  // })
  // console.log(socket);
});
