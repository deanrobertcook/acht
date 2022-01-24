function setup() {
  createCanvas(640, 360);
}

const INC = 0.01;
let start = 0
function draw() {
  background(51);
  
  stroke(255);
  
  noFill();
  beginShape();
  let xoff = start;
  for (let x = 0; x < width; x++) {
    let y = noise(xoff) * height;
    vertex(x, y);  
    xoff += INC;
  }
  
  start += INC;
  endShape();

  
}