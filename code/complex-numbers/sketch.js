function setup() {
  createCanvas(640, 360);
}

function draw() {
  noFill();
  background(51);
  stroke(255);

  let w = 50;
  const [h, scl] = setupScale(w);
  drawCartesianCoordinates(w, h, scl);

  strokeWeight(1 / scl);
  stroke(255, 0, 0);

  let z1 = [3, 2];
  let [a, b] = z1;
  let z2 = [3, -2];
  let [c, d] = z1;

  drawZ(z1);
  drawZ(z2);

  drawZ(multC(z1, z2));
}

function drawZ(z) {
  let [a, b] = z;
  line(0, 0, a, b);
}
