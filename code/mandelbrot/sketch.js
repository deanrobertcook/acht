const MAX_ITER = 100;
const SCALE = 50;

let colorFrom; 
let colorTo;

let fr;
function setup() {
  createCanvas(640, 360);
  pixelDensity(1);
  colorFrom = color(19, 70, 17); 
  colorTo = color(232, 252, 207);   
  fr = createP('');
  noLoop();
}

function draw() {

  const w = 4;
  stroke(0);
  const [h, scl] = setupScale(w);

  const [xmin, xmax] = [-w/2, w/2];
  const [ymin, ymax] = [-h/2, h/2];

  const dx = (xmax - xmin) / width;
  const dy = (ymax - ymin) / height;

  loadPixels();

  let y0 = ymin;
  for (let j = 0; j < height; j++) {
    let x0 = xmin;
    for (let i = 0; i < width; i++) {
      let x = 0;
      let y = 0;
      let x2 = 0;
      let y2 = 0;
      let n = 0;
      while (x2 + y2 < 4 && n < MAX_ITER) {
        y = 2 * x * y + y0;
        x = x2 - y2 + x0;
        x2 = x * x;
        y2 = y * y;
        n++;
      }

      const pix = (j * width + i) * 4;
      const norm = map(n, 0, MAX_ITER, 0, 1);
      // const bright = map(sqrt(norm), 0, 1, 0, 255);
      const col = lerpColor(colorFrom, colorTo, sqrt(norm));
      if (n < MAX_ITER) {
        pixels[pix + 0] = red(col);
        pixels[pix + 1] = green(col);
        pixels[pix + 2] = blue(col);
        pixels[pix + 3] = 255;
      }
      x0 += dx;
    }
    y0 += dy;
  }
  updatePixels();
  drawCartesianCoordinates(w, h, scl);
  showFrameRate(fr);
}

function iterMandelbrot(z, c) {
  return addC(multC(z, z), c);
}

