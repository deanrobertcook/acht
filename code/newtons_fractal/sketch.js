const MAX_ITER = 20;

let fr;

let roots = [];
let rootColors;

let w, h, scl;

let xmin, xmax, ymin, ymax;

let dx, dy;

function setup() {

  createCanvas(640, 360);
  pixelDensity(1);

  w = 6;
  [h, scl] = setupScale(w);

  [xmin, xmax] = [-w / 2, w / 2];
  [ymin, ymax] = [-h / 2, h / 2];

  dx = (xmax - xmin) / width;
  dy = (ymax - ymin) / height;

  // let x = random(xmin, xmax);
  // let y = random(ymin, ymax);
  // while (roots.length < 3) {
  //   if (equalsC([x, y], [0, 0])) {
  //     x = random(xmin, xmax);
  //     y = random(ymin, ymax);
  //     continue;
  //   }
  //   const [xN, yN] = iteration(x, y);
  //   const rootFound = distCSquared([xN, yN], [x, y]) < 0.0001;
  //   [x, y] = [xN, yN];
  //   if (rootFound) {
  //     const root = roots.find(r => distCSquared(r, [x, y]) < 0.01);
  //     if (!root) {
  //       roots.push([x, y]);
  //     }
  //     x = random(xmin, xmax);
  //     y = random(ymin, ymax);
  //     continue;
  //   }
  // }

  roots = [
    [
      0.8774275489403877,
      0.744831412276122
    ],
    [
        -0.7548624758907448,
        0.000018084013353027693
    ],
    
    [
        0.8774387194093253,
        -0.7448617065795554
    ]
]

  // roots.sort(([a, b], [c, d]) => a - c + (d - b));
  // console.log(roots);
  rootColors = [
    color('#2d87d6'),
    color('#87d62c'),
    color('#d62c86'),
  ]

  fr = createP('');
  noLoop();
}

function draw() {
  background(255);
  loadPixels();
  [h, scl] = setupScale(w);

  let y0 = ymin;
  for (let j = 0; j < height; j++) {
    let x0 = xmin;
    for (let i = 0; i < width; i++) {
      if (equalsC([x0, y0], [0, 0])) {
        x0 += dx;
        continue;
      }
      let [x, y] = [x0, y0];
      for (let it = 0; it < MAX_ITER; it++) {
        [x, y] = iteration(x, y);
      }

      const col = rootColors[closestRootIdx([x, y])];
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

  push();
  noFill();
  stroke(0);
  strokeWeight(4 / scl);
  roots.forEach(([x, y], i) => {
    point(x, y);    
  });
  pop();

  drawCartesianCoordinates(w, h, scl);
  
  showFrameRate(fr);
}

function iteration(x, y) {
  const x2 = squareC([x, y]);
  const x3 = multC(x2, [x, y]);
  const fx = addC(subC(x3, x2), [1, 0]);

  const dfx = subC(multC(x2, [3, 0]), [2 * x, 2 * y]);

  return subC([x, y], divC(fx, dfx));
  // return divC(fx, dfx);
}

function closestRootIdx(z) {
  let closestIdx = 0;
  let smallest = distCSquared(z, roots[closestIdx]);
  for (let i = 1; i < roots.length; i++) {
    const newDist = distCSquared(z, roots[i]);
    closestIdx = smallest <= newDist ? closestIdx : i
  }
  return closestIdx;
}
