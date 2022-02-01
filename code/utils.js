function logSecond(...msg) {
  if (frameCount % 60 == 0 || frameCount == 1) {
    console.log(...msg);
  }
}

function showFrameRate(fr) {
  if (frameCount % 60 == 0) {
    fr.html(floor(frameRate()));
  }
}

function setupScale(w) {
  const h = (w * height) / width;
  const scl = width / w;
  translate(width / 2, height / 2);
  scale(scl, -scl);
  return [h, scl];
}

function drawCartesianCoordinates(w, h, scl) {
  push();
  strokeWeight(0.5 / scl);
  line(0, -h / 2, 0, h / 2);
  line(-w/2, 0, w/2, 0);
  strokeWeight(2 / scl);
  for (let i = floor(-w / 2); i <= ceil(w / 2); i++) {
    point(i, 0);
  }
  for (let i = floor(-h / 2); i <= ceil(h / 2); i++) {
    point(0, i);
  }
  pop();
}


/**********************
 * COMPLEX ARITHMETIC
 **********************/

const TOL = 0.0001;
function equalsC(z1, z2, tol = TOL) {
  const [a, b] = z1;
  const [c, d] = z2;
  return abs(a - c) < tol && abs(b - d) < tol;
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