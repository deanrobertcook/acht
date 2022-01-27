const MAX_ITER = 10;
const SCALE = 50;
let colorFrom; 
let colorTo; 


function setup() {
  createCanvas(640, 360);
  background(51);
}

function draw() {

  translate(width / 2, height / 2);
  scale(1, -1);
  scale(SCALE);
  stroke(255);
  strokeWeight(0.1);

  
  
  for (let x = 0; x < width; x += 2) {
    for (let y = 0; y < height; y += 2) {
      let z = [0, 0];
      let c = [(x - width/2) / SCALE, -(y - height/2) / SCALE];
      for (let i = 0; i < MAX_ITER && magC(z) < 10; i++) {
        z = iterMandelbrot(z, c);
      }

      if (magC(z) < 10) {
        point(...c);
      }
    }  
  }
}

function iterMandelbrot(z, c) {
  return addC(multC(z, z), c);
}

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

