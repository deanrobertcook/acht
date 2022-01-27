//STEP 1: draw complex numbers (addition + multiplication)
//STEP 2: manually draw the first few iterations of the mandelbrot set
//STEP 3: automate!

let prev;
let next;
let c;
const TOL = 0.001

let colorFrom; 
let colorTo; 

function setup() {
  createCanvas(640, 360);
  background(51);
  next = [0, 0];
  c = [random(2), random(2)];
}

function draw() {
  translate(width / 2, height / 2);
  scale(1, -1);
  scale(50);
  stroke(255);
  strokeWeight(0.1);

  let m = magC(next);
  logSecond(m, prev, next);
  if (m >= 2 || (m > 0 && prev && equalsC(next, prev))) {  
    next = [0, 0];
    c = [random(2), random(2)];
    return;
  }

  prev = next;
  next = iterMandelbrot(next, c);
  point(...next);
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

