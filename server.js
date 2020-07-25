let express = require('express');

let app = express();
let server = app.listen(3000);

app.use(express.static('public'));

console.log("Swiddle is running!");

let socket = require('socket.io');

let io = socket(server);

io.sockets.on('connection', newConnection);


function newConnection(socket) {
  console.log('New Connection: ' + socket.id);

  // socket.on('mousedown', mousedown);
  // socket.on('mousemove', mousemove);
  // socket.on('mouseup', mouseup);
  socket.on('mousedraw', mousedraw);

  function mousedraw(data) {
    socket.broadcast.emit('mousedraw', data);
  }

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