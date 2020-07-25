let socket;
socket = io.connect('http://localhost:3000');

socket.on('draw', function(data) {
  drawLine(data.x, data.y, data.type, data.brush);
})
socket.on('reset', resetScr);

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
  col: picker.value,
  weight: weight.value,
  fill: false,
}

reset.addEventListener('click', e => {
  resetScr();
  socket.emit('reset', {});
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


function resetScr() {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, SCR_WIDTH, SCR_HEIGHT);
}

canvas.addEventListener('pointerdown', e => {
  socket.emit('draw', {
    x: e.offsetX,
    y: e.offsetY,
    type: 'down',
    brush: brush
  })
  drawLine(e.offsetX, e.offsetY, 'down', brush);
})

canvas.addEventListener('pointermove', e => {
  socket.emit('draw', {
    x: e.offsetX,
    y: e.offsetY,
    type: 'drag',
    brush: brush
  })
  drawLine(e.offsetX, e.offsetY, 'drag', brush);
})

document.addEventListener('pointerup', e => {
  socket.emit('draw', {
    x: e.offsetX,
    y: e.offsetY,
    type: 'up',
    brush: brush
  })
  drawLine(e.offsetX, e.offsetY, 'up', brush);
})

function drawLine(x, y, type, brush) {
  ctx.fillStyle = brush.color;
  ctx.strokeStyle = brush.color;
  ctx.lineWidth = brush.weight;
  ctx.lineCap = "round";
  switch (type) {
    case 'down':
      ctx.beginPath();
      ctx.moveTo(x,y);
      brush.fill = true;
      break;
    case 'drag':
      if (brush.fill) {
        ctx.lineTo(x,y);
        ctx.stroke();
      }
      break;
    case 'up':
      if (brush.fill) {
        ctx.lineTo(x,y);
        ctx.stroke();
        ctx.closePath();
      }
      brush.fill = false;
      break;
  }
}



//previous draw line function using 2 co-ords
// function drawLine(x1, y1, x2, y2, stroke) {
//   ctx.fillStyle = stroke.color;
//   ctx.strokeStyle = stroke.color;
//   ctx.lineWidth = stroke.weight;
//   ctx.beginPath();
//   ctx.lineCap = "round";
//   ctx.moveTo(x1, y1);
//   ctx.lineTo(x2, y2);
//   ctx.stroke();
// }

// previous event listeners
// canvas.addEventListener('mousedown', e => {
//   let xy = {
//     offsetX: e.offsetX,
//     offsetY: e.offsetY
//   }
//   let data = {
//      e: xy,
//      brush: brush
//   }
//   socket.emit('mousedown', data);
//   mousedown(e, brush);
// })

// canvas.addEventListener("mousemove", e => {
//   let xy = {
//     offsetX: e.offsetX,
//     offsetY: e.offsetY
//   }
//   let data = {
//     e: xy,
//     brush: brush
//   }
//   socket.emit('mousemove', data);
//   if (brush.fill) mousemove(e, brush);
// })


// document.addEventListener('mouseup', e => {
//   let xy = {
//     offsetX: e.offsetX,
//     offsetY: e.offsetY
//   }
//   let data = {
//     e: xy,
//     brush: brush
//   }
//   socket.emit('mousedraw', data);
//   mouseup(e, brush);
// })

// previous socket listen functions
// socket.on('mousedown', function(data) {
//   console.log('receiveing');
//   console.log(data.e);
//   mousedown(data.e, data.brush);
// });
// socket.on('mousemove', function(data) {
//   console.log('receiveing');
//   mousemove(data.e, data.brush);
// });
// socket.on('mouseup', function(data) {
//   console.log('receiveing');
//   mouseup(data.e, data.brush);
// });


// previous mouse functions
// function mousedown(e, stroke) {
//   stroke.x = e.offsetX;
//   stroke.y = e.offsetY;
//   stroke.fill = true;
// }

// function mousemove(e, stroke) {
//   if (stroke.fill) {
//     drawLine(stroke.x, stroke.y, e.offsetX, e.offsetY, stroke);
//     stroke.x = e.offsetX;
//     stroke.y = e.offsetY;
//   }
// }

// function mouseup(e, stroke) {
//   if (stroke.fill) {
//     drawLine(stroke.x, stroke.y, e.offsetX, e.offsetY, stroke);
//     stroke.x = 0;
//     stroke.y = 0;
//     stroke.fill = false;
//   }
// }
