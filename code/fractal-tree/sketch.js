const LEN_SCALE = 0.64;
const ANGLE_DELTA = (Math.PI / 16);

let fr;
let colorFrom; 
let colorTo;
let startLength;
function setup() {
  createCanvas(640, 360);
  colorFrom = color(85, 139, 110); 
  colorTo = color(160, 155, 231);   
  fr = createP('');
  startLength = height * 1/3;
  background(51);
  scale(1, -1);
  drawBranch(width/2, -height, 0, startLength);
}

function draw() {
  // background(51);
  // scale(1, -1);
  // drawBranch(width/2, -height, 0, startLength);
  // showFrameRate(fr);
}

function drawBranch(startX, startY, angle, length) {

  if (length <= 1) {
    return;
  }
  push();
  const cNorm = map(length, startLength, 1, 0, 1);
  const c = lerpColor(colorFrom, colorTo, cNorm);
  stroke(c);
  const wNorm = map(length, 1, startLength, 1, 4);
  strokeWeight(wNorm);
  translate(startX, startY);
  rotate(angle);
  line(0, 0, 0, length);
  drawBranch(0, length, angle + ANGLE_DELTA, length * LEN_SCALE);
  drawBranch(0, length, angle - ANGLE_DELTA, length * LEN_SCALE);
  pop();

}

