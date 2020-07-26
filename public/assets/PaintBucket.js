export function paintBucket(stack, img, ctx, WIDTH, HEIGHT) {
  let imgData = img;
  let pixelStack = [stack];
  console.log(pixelStack.length);

  while (pixelStack.length > 0) {
    let newPos = pixelStack.pop();
    let x = newPos[0];
    let y = newPos[1];
    let pixelPos = (y * WIDTH + x) * 4;
    while (y >= 0 && matchStartCol(pixelPos)) {
      y -= 1;
      pixelPos -= WIDTH * 4;
    }
    pixelPos += WIDTH * 4;
    ++y;
    let reachLeft = false;
    let reachRight = false;
    while (y < HEIGHT && matchStartCol(pixelPos)) {
      y += 1;
      paintPixel(pixelPos);

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
      if (x < WIDTH - 1) {
        if (matchStartCol(pixelPos + 4)) {
          if (!reachRight) {
            pixelStack.push([x + 1, y]);
            reachRight = true;
          }
        } else if (reachRight) {
          reachRight = false;
        }
      }
      pixelPos += WIDTH * 4;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  function matchStartCol(pos) {
    let r = imgData.data[pos];
    let g = imgData.data[pos + 1];
    let b = imgData.data[pos + 2];

    return r === 255 && g === 255 && b === 255;
  }

  function paintPixel(pos) {
    imgData.data[pos] = 45;
    imgData.data[pos + 1] = 167;
    imgData.data[pos + 2] = 93;
    imgData.data[pos + 3] = 255;
  }
}