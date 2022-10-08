const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http").Server(app);
const io = require("socket.io")(http);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname));

io.on("connection", () => {
  console.log("A user is connected.");
});

const dbUrl =
  "mongodb+srv://kathalice:YuPwhaKJGnSyxNWm@cluster0.8proyds.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(dbUrl, (err) => {
  console.log("MongoDB connected", err);
});

const Message = mongoose.model("Message", { name: String, message: String });

app
  .route("/messages")
  .get((req, res) => {
    Message.find({}, (err, messages) => {
      res.send(messages);
    });
  })
  .post((req, res) => {
    const message = new Message(req.body);
    message.save((err) => {
      if (err) sendStatus(500);
      io.emit("message", req.body);
      res.sendStatus(200);
    });
  });

const server = app.listen(3000, () => {
  console.log("server is running on port", server.address().port);
});
