const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, "/public/index2.html"));
});

// router.get('/old', function(req, res) {
//   res.sendFile(path.join(__dirname, "/public/index.html"));
//   // __dirname = directory name
// });

// add the router
app.use(express.static('public'));
app.use('/', router);
console.log("Swiddle is running!");

// app is listening to port
let server = app.listen(process.env.PORT || 3000);

// setup socket io
let socket = require('socket.io');
let io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket) {
  console.log('New Connection: ' + socket.id);

  // socket.on('mousedown', mousedown);
  // socket.on('mousemove', mousemove);
  // socket.on('mouseup', mouseup);
  socket.on('draw', mousedraw);
  socket.on('newMsg', sendMsg);
  socket.on('reset', reset);

  function mousedraw(data) {
    socket.broadcast.emit('draw', data);
  }

  function sendMsg(data) {
    socket.broadcast.emit('newMsg', data);
  }

  function reset(data) {
    socket.broadcast.emit('reset', data);
  }
  // socket.on('mousedraw', mousedraw);

  // function mousedraw(data) {
  //   socket.broadcast.emit('mousedraw', data);
  // }

  // io.sockets.emit('moouse', data) - includes sending client
  // function mousedown(data) {
  //   console.log(data);
  //   socket.broadcast.emit('mousedown', data);
  // }
  // function mousemove(data) {
  //   console.log(data);
  //   socket.broadcast.emit('mousemove', data);
  // }
  // function mouseup(data) {
  //   console.log(data);
  //   socket.broadcast.emit('mouseup', data);
  // }
  
}