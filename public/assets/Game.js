export default class Game {
  constructor(socket) {
    let container = document.getElementById('container');
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');

    let reset = document.getElementById('reset');
    let erase = document.getElementById('erase');
    let paint = document.getElementById('paint');
    let weight = document.getElementById('weight');
    let picker = document.getElementById('colorPicker');
    let bucket = document.getElementById('bucket');

    let brush = {
      x: 0,
      y: 0,
      col: picker.value,
      weight: weight.value,
      fill: false,
    }
    let filler = {
      col: picker.value,
    }
    let fill = false;

    // CONSTANTS
    const WIN_WIDTH = window.innerWidth;
    const WIN_HEIGHT = window.innerHeight;
    let SCR_WIDTH = 800;
    let SCR_HEIGHT = 400;
    const BG_COLOR = "#fff";
   

    // BACKGROUND WORK
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, SCR_WIDTH, SCR_HEIGHT);

    // SOCKET WORK
    socket.on('draw', function(data) {
      drawLine(data.x, data.y, data.type, data.brush);
    })
    socket.on('reset', function(data) {
      resetScr();
    });
    socket.on('fill', function(data){
      let img = ctx.getImageData(0, 0, SCR_WIDTH, SCR_HEIGHT)
      paintBucket([data.x, data.y], img, data.fill);
    })

    // EVENT LISTENERS 
    // window.addEventListener('resize', e => {
    //   canvas.width = container.clientWidth;
    //   canvas.height = container.clientHeight;
    //   SCR_WIDTH = canvas.width;
    //   SCR_HEIGHT = canvas.height;
    // })
    

    reset.addEventListener('click', e => {
      resetScr();
      socket.emit('reset', {});
    });

    erase.addEventListener('click', e => {
      brush.col = '#fff';
      fill = false;
    })

    paint.addEventListener('click', e => {
      brush.col = picker.value;
      fill = false;
    })

    weight.addEventListener('change', e => {
      brush.weight = weight.value;
      document.getElementById('w_label').innerHTML = "Brush Weight: " + weight.value + "px";
    });

    picker.addEventListener('change', e => {
      brush.col = picker.value;
      filler.col = picker.value;
    });

    bucket.addEventListener('click', e => {
      fill = fill ? false : true;
      console.log(fill);
    })

    // FILL ONLY WORKS FOR MOUSE DOWN !!!!!!!!!!!!!!
    canvas.addEventListener('mousedown', e => {
      if (fill) {
        let img = ctx.getImageData(0, 0, SCR_WIDTH, SCR_HEIGHT);
        let x = e.offsetX;
        let y = e.offsetY;
        console.log(x, y);
        socket.emit('fill', {
          x: x,
          y: y,
          fill: filler
        })
        paintBucket([x, y], img, filler);
      } else {
        socket.emit('draw', {
          x: e.offsetX,
          y: e.offsetY,
          type: 'down',
          brush: brush
        })
        drawLine(e.offsetX, e.offsetY, 'down', brush);
      };
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

    // FUNCTIONS 
    function resetScr() {
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, SCR_WIDTH, SCR_HEIGHT);
    }

    function drawLine(x, y, type, brush) {
      ctx.fillStyle = brush.col;
      ctx.strokeStyle = brush.col;
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


    //console.log(ctx.getImageData(0,0,SCR_WIDTH, SCR_HEIGHT).data.length);

    function paintBucket(stack, img, filler) {
      let imgData = img;
      let startPos = (stack[1] * SCR_WIDTH + stack[1])*4;
      let startR = img.data[startPos];
      let startG = img.data[startPos+1];
      let startB = img.data[startPos+2];
      let setCol = findRGB(filler.col);
      console.log("before if");
      console.log(setCol, startR, startG, startB);
      if (startR === setCol[0] && startG === setCol[1] && startB === setCol[2]) return;
      console.log('before while');
      let pixelStack = [stack];
      while (pixelStack.length > 0) {
        console.log("0th while");
        let newPos = pixelStack.pop();
        let x = newPos[0];
        let y = newPos[1];
        let pixelPos = (y * SCR_WIDTH + x) * 4;
        while (y >= 0 && matchStartCol(pixelPos)) {
          y -= 1;
          pixelPos -= SCR_WIDTH * 4;
        }
        pixelPos += SCR_WIDTH * 4;
        y += 1;
        let reachLeft = false;
        let reachRight = false;
        while (y < SCR_HEIGHT && matchStartCol(pixelPos)) {
          y += 1;
          imgData = paintPixel(pixelPos);

          // check left for fill
          if (x > 0) {
            if (matchStartCol(pixelPos - 4)) {
              if (!reachLeft) {
                pixelStack.push([x - 1, y]);
                reachLeft = true;
              }
            } else if (reachLeft) {
              reachLeft = false;
            }
          }

          // check right for fill
          if (x < SCR_WIDTH - 1) {
            if (matchStartCol(pixelPos + 4)) {
              if (!reachRight) {
                pixelStack.push([x + 1, y]);
                reachRight = true;
              }
            } else if (reachRight) {
              reachRight = false;
            }
          }
          pixelPos += SCR_WIDTH * 4;
        }
      }
      ctx.putImageData(imgData, 0, 0);

      function matchStartCol(pos) {
        let r = imgData.data[pos];
        let g = imgData.data[pos + 1];
        let b = imgData.data[pos + 2];

        return r === startR && g === startG && b === startB;
      }

      function paintPixel(pos) {
        imgData.data[pos] = setCol[0];
        imgData.data[pos + 1] = setCol[1];
        imgData.data[pos + 2] = setCol[2];
        imgData.data[pos + 3] = 255;
        return imgData;
      }
    }

    function findRGB(hex) {
      hex = hex.toLowerCase();
      let hexa = {
        "0": 0,
        "1": 1,
        "2": 2,
        "3": 3,
        "4": 4,
        "5": 5,
        "6": 6,
        "7": 7,
        "8": 8,
        "9": 9,
        "a": 10,
        "b": 11,
        "c": 12,
        "d": 13,
        "e": 14,
        "f": 15
      }

      let r2 = hex[1];
      let r1 = hex[2];
      let g2 = hex[3];
      let g1 = hex[4];
      let b2 = hex[5];
      let b1 = hex[6];

      let r = (hexa[r1]) + (hexa[r2] * 16);
      let g = (hexa[g1]) + (hexa[g2] * 16);
      let b = (hexa[b1]) + (hexa[b2] * 16);

      return [r, g, b];
    }
  }
}