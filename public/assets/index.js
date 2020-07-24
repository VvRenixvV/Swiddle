let socket;
socket = io.connect('http://localhost:3000');

socket.on('mousedown', function(data) {
  console.log('receiveing');
  console.log(data.e);
  mousedown(data.e, data.brush);
});
socket.on('mousemove', function(data) {
  console.log('receiveing');
  mousemove(data.e, data.brush);
});
socket.on('mouseup', function(data) {
  console.log('receiveing');
  mouseup(data.e, data.brush);
});

let canvas = document.getElementById('screen');
let ctx = canvas.getContext('2d');

let reset = document.getElementById('reset');
let erase = document.getElementById('erase');
let paint = document.getElementById('paint');
let weight = document.getElementById('weight');
let picker = document.getElementById('color');

const SCR_WIDTH = 800;
const SCR_HEIGHT = 600;
const BG_COLOR = "#fff";

ctx.fillStyle = BG_COLOR;
ctx.fillRect(0, 0, SCR_WIDTH, SCR_HEIGHT);

let brush = {
  x: 0,
  y: 0,
  col: "#000",
  weight: 5,
  fill: false,
}


canvas.addEventListener('mousedown', e => {
  mousedown(e, brush);
  let eve = {
    offsetX: e.offsetX,
    offsetY: e.offsetY
  }
  let data = {
    e: eve,
    brush: brush
  }
  socket.emit('mousedown', data);
})

canvas.addEventListener("mousemove", e => {
  mousemove(e, brush);
  let eve = {
    offsetX: e.offsetX,
    offsetY: e.offsetY
  }
  let data = {
    e: eve,
    brush: brush
  }
  if (brush.fill) socket.emit('mousemove', data);
})

canvas.addEventListener('mouseup', e => {
  mouseup(e, brush);
  let eve = {
    offsetX: e.offsetX,
    offsetY: e.offsetY
  }
  let data = {
    e: eve,
    brush: brush
  }
  socket.emit('mouseup', data);
})

reset.addEventListener('click', e => {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, SCR_WIDTH, SCR_HEIGHT);
});

erase.addEventListener('click', e => {
  brush.color = '#fff';
})

paint.addEventListener('click', e => {
  brush.color = picker.value;
})

weight.addEventListener('change', e => {
  brush.weight = weight.value;
  document.getElementById('w_label').innerHTML = "Brush Weight: " + weight.value + "px";
});

picker.addEventListener('change', e => {
  brush.color = picker.value;
});


function mousedown(e, stroke) {
  stroke.x = e.offsetX;
  stroke.y = e.offsetY;
  stroke.fill = true;
}

function mousemove(e, stroke) {
  if (stroke.fill) {
    drawLine(stroke.x, stroke.y, e.offsetX, e.offsetY, stroke);
    stroke.x = e.offsetX;
    stroke.y = e.offsetY;
  }
}

function mouseup(e, stroke) {
  if (stroke.fill) {
    drawLine(stroke.x, stroke.y, e.offsetX, e.offsetY, stroke);
    stroke.x = 0;
    stroke.y = 0;
    stroke.fill = false;
  }
}

function drawLine(x1, y1, x2, y2, stroke) {
  ctx.fillStyle = stroke.color;
  ctx.strokeStyle = stroke.color;
  ctx.lineWidth = stroke.weight;
  ctx.beginPath();
  ctx.lineCap = "round";
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}