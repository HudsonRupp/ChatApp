const { Server } = require("socket.io")
var jwt = require('jsonwebtoken');
require('dotenv').config()
var checkJwt = require('../middleware/jwt');
const { token } = require("morgan");
var cors = require('cors')


var clients = []
//db for messages later
var recentMessages = ["SERVER STARTED"]

function getConnectedUsers(arr) {
  var users = []
  arr.map(client => users.push(client.username))
  return users
}

module.exports = {
  getIo: (server) => {
    const io = new Server(server, {path: "/chat/", cors: {origin: "*"}});
    
    io.use((socket, next) => {
      var token = socket.handshake.auth.token;
      try {
          var decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      } catch(err) {
          next(new Error("Invalid token"))
      }
      if (getConnectedUsers(clients).find(x => x==decoded.username)) {
        next(new Error("Account already connected"))
        return
      }
      next()
    });

    io.on("connection", (socket) => {
      var tokenData = jwt.verify(socket.handshake.auth.token, process.env.TOKEN_SECRET)
      console.log("connection from:  " + tokenData.username)
      clients.push({username: tokenData.username})
      io.emit("user_connect", getConnectedUsers(clients));

      socket.on("ping", () => {
        io.emit("pong")
      })

      socket.on("chat_message", (msg) => {
        console.log(tokenData.username + ": " + msg )
        recentMessages.push(tokenData.username + ": " + msg)
        if (recentMessages.length > 10) {
          recentMessages.splice(0, 1)
        }
        io.emit("chat_message", {author: tokenData.username, message: msg})
      })

      socket.on("disconnect", () => {
        console.log("disconnection from:  " + tokenData.username)
        clients = clients.filter(client => client.username !== tokenData.username);
        io.emit("user_disconnect", getConnectedUsers(clients));
      })

      socket.on("setup", () => {
        socket.emit("setup", {online: getConnectedUsers(clients), messages: recentMessages})
      })
    })

    return io;
  }
}