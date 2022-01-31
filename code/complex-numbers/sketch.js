function setup() {
  createCanvas(640, 360);
}

function draw() {
  noFill();
  background(51);
  stroke(255);

  let w = 32;
  let h = w * (height / width);
  let scl = width / w;

  setupCartesianCoordinates(w, h, scl);

  strokeWeight(1 / scl);
  stroke(255, 0, 0);

  let z1 = [4, 3];
  let [a, b] = z1;
  let z2 = [0, 1];
  let [c, d] = z1;

  drawZ(z1);
  drawZ(z2);

  drawZ(multC(z1, z2));
}

function setupCartesianCoordinates(w, h, scl) {
  strokeWeight(0.5);
  line(width / 2, 0, width / 2, height);
  line(0, height / 2, width, height / 2);

  translate(width / 2, height / 2);
  scale(scl, -scl);
  push();
  strokeWeight(2 / scl);
  for (let i = floor(-w / 2); i <= ceil(w / 2); i++) {
    point(i, 0);
  }
  for (let i = floor(-h / 2); i <= ceil(h / 2); i++) {
    point(0, i);
  }
  pop();

}

function drawZ(z) {
  let [a, b] = z;
  line(0, 0, a, b);
}
