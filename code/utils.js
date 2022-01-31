function logSecond(...msg) {
  if (frameCount % 60 == 0 || frameCount == 1) {
    console.log(...msg);
  }
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