const ITER = 10;

let fr;

const roots = [
  [Math.sqrt(2), 0],
  [-Math.sqrt(2), 0]
]

let rootColors;


function setup() {
  createCanvas(640, 360);
  pixelDensity(1);

  rootColors = [
    color('#2890F8'),
    color('#FF5907')
  ]
  
  fr = createP('');
  noLoop();
  colorMode(HSB);
}

function draw() {

  const w = 6;
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
      
      let x = y0; 
      let y = x0;
      if (equalsC([x, y], [0, 0])) {
        continue;
      }

      for (let it = 0; it < ITER; it++) {
        const z = addC(squareC([x, y]), [2, 0]);
        const w = [2 * x, 2 * y];
        [x, y] = divC(z, w);
      }

      const clIdx = closestRootIdx([x, y]);
      const col = rootColors[clIdx];
      const pix = (j * width + i) * 4;
      pixels[pix + 0] = red(col);
      pixels[pix + 1] = green(col);
      pixels[pix + 2] = blue(col);
      pixels[pix + 3] = 255;

      x0 += dx;
    }
    y0 += dy;
  }
  updatePixels();
  drawCartesianCoordinates(w, h, scl);
  showFrameRate(fr);
  noLoop();
}

function closestRootIdx(z) {

  let smallest = distCSquared(z, roots[0]);
  let closestIdx = 0;
  for (let i = 1; i < roots.length; i++) {
    const newDist = distCSquared(z, roots[i]);
    closestIdx = smallest <= newDist ? closestIdx : i
  }
  return closestIdx;
}
