const MAX_ITER = 100;
const SCALE = 50;

let colorFrom; 
let colorTo;

function setup() {
  createCanvas(640, 360);
  pixelDensity(1);
  colorFrom = color(19, 70, 17); 
  colorTo = color(232, 252, 207);   
}

function draw() {

  // translate(width / 2, height / 2);
  // scale(1, -1);
  // scale(SCALE);
  // stroke(255);
  // strokeWeight(0.1);

  const w = 4;
  const h = (w * height) / width;

  const xmin = -w/2;
  const ymin = -h/2;

  const xmax = xmin + w;
  const ymax = ymin + h;

  const dx = (xmax - xmin) / width;
  const dy = (ymax - ymin) / height;

  loadPixels();

  let y = ymin;
  for (let j = 0; j < height; j++) {
    let x = xmin;
    for (let i = 0; i < width; i++) {
      
      let z = [0, 0];
      let c = [x, y];
      let n = 0;
      while (n < MAX_ITER) {
        z = iterMandelbrot(z, c);
        if (magC(z) > 16) {
          break;
        }
        n++;
      }

      const pix = (j * width + i) * 4;
      const norm = map(n, 0, MAX_ITER, 0, 1);
      // const bright = map(sqrt(norm), 0, 1, 0, 255);
      const col = lerpColor(colorFrom, colorTo, norm);
      if (n < MAX_ITER) {
        pixels[pix + 0] = red(col);
        pixels[pix + 1] = green(col);
        pixels[pix + 2] = blue(col);
        pixels[pix + 3] = 255;
      }
      x += dx;
    }
    y += dy;
  }
  updatePixels();
}

function iterMandelbrot(z, c) {
  return addC(multC(z, z), c);
}

const TOL = 0.0001;
function equalsC(z1, z2) {
  const [a, b] = z1;
  const [c, d] = z2;
  return abs(a - c) < TOL && abs(b - d) < TOL;
}

function magC(z) {
  const [a, b] = z;
  return sqrt(a * a + b * b)
}

function multC(z1, z2) {
  const [a, b] = z1;
  const [c, d] = z2;
  return [a * c - (b * d), a * d + b * c];
}

function addC(z1, z2) {
  const [a, b] = z1;
  const [c, d] = z2;
  return [a + c, b + d];
}

