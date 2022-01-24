const STEPS = 10;

let ap1, ap2, cp;
function setup() {
  createCanvas(640, 360);
  ap1 = createVector(0, height / 2);
  ap2 = createVector(width, height / 2);
  cp = createVector(0, 0);
}

function draw() {
  background(51);  
  stroke(255);
  strokeWeight(2);

  push();
  stroke(255);
  strokeWeight(6);
  point(width / 2, height / 2);
  pop();
  
  line(width/2, height / 2, cp.x, cp.y);
  
  cp.set(mouseX, mouseY);
  
  let extT = findExtremum(ap1.y, cp.y, ap2.y);
  
  let extX = bezier1D(ap1.x, cp.x, ap2.x, extT);
  let extY = bezier1D(ap1.y, cp.y, ap2.y, extT);
  
  function labelPoint(x, y) {
    let px = constrain(x - 10, 0 + 10, width - 60);
    let py = constrain(y - 10, 0 + 10, height - 2);

    text(`(${round(x)}, ${round(y)})`, px, py);
  }
  
  push();
  strokeWeight(0);
  fill(255);
  labelPoint(extX, extY);
  labelPoint(cp.x, cp.y);
  pop();
  
  push();
  stroke(0, 255, 0);
  line(0, extY, width, extY);
  pop();
  
  for (let t = 0; t <= 1.00001; t += 1 / STEPS) {
    let p1 = p5.Vector.lerp(ap1, cp, t);
    let p2 = p5.Vector.lerp(cp, ap2, t);
    //line(p1.x, p1.y, p2.x, p2.y);
    
    let px = bezier1D(ap1.x, cp.x, ap2.x, t);
    let py = bezier1D(ap1.y, cp.y, ap2.y, t);
    
    push();
    stroke(255, 0, 0);
    strokeWeight(6);
    point(px, py);
    pop();

  }
}

function logSecond(...messages) {
  if (frameCount % 60 == 0) {
    console.log(messages);  
  }
  
}

function bezier1D(ap1, cp, ap2, t) {
  return ap1 + 2*t*(cp - ap1) + t*t*(ap2 - 2*cp + ap1);
}

//turns out it's always t = 0.5!
function findExtremum(a, b, c) {
  return (a - b) / (c - 2*b + a);
}

