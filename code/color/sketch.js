let img;
let colors = [];
let sortMode = null;
let ar;

function setup() {
  ar = img.width / img.height;

  let h = 350;
  createCanvas(floor(ar * h), 2 * h);
  noStroke();

  let tileXCount = floor(width / 1);
  let tileYCount = floor(ar * tileXCount / 2);
  console.log(ar, tileXCount, tileYCount)
  
  let imgRectSize = img.width / tileXCount;
  for (let gridY = 0; gridY < tileYCount; gridY++) {
    for (let gridX = 0; gridX < tileXCount; gridX++) {
      let px = floor(gridX * imgRectSize);
      let py = floor(gridY * imgRectSize);
      let i = (py * img.width + px) * 4;
      let c = color(img.pixels[i], img.pixels[i + 1], img.pixels[i + 2], img.pixels[i + 3]);
      colors.push(c);
    }
  }

  colorsDes = colors.map(a => {
    return color(...chroma(red(a), green(a), blue(a)).desaturate(4).rgb())
  });

  colorsGs = colors.map(a => {
    return color((red(a) * 0.222 + green(a) * 0.707 + blue(a) * 0.071));
  });

  let rectSize = width / tileXCount;
  let i = 0;
  for (let gridY = 0; gridY < tileYCount; gridY++) {
    for (let gridX = 0; gridX < tileXCount; gridX++) {
      fill(colorsDes[i]);
      rect(gridX * rectSize, gridY * rectSize, rectSize, rectSize);
      i++;
    }
  }

  i = 0;
  fill(color(255, 0, 0));
  rect(0, (tileYCount + 10) * rectSize, rectSize, rectSize);
  for (let gridY = 0; gridY < tileYCount; gridY++) {
    for (let gridX = 0; gridX < tileXCount; gridX++) {
      fill(colorsGs[i]);
      rect(gridX * rectSize, (height / 2) + gridY * rectSize, rectSize, rectSize);
      i++;
    }
  }
}

function preload() {
  loadImage('img.png', setImage);
}

function draw() {
}

function setImage(loadedImg) {
  img = loadedImg;
  img.loadPixels();
}