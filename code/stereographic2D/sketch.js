let colorFrom; 
let colorTo;

function setup() {
  createCanvas(640, 360);

  colorFrom = color(128, 4, 251); 
  colorTo = color(128, 251, 4);   
}

function draw() {
  background(51);
  stroke(255);
  noFill();



  const w = 6
  const [h, scl] = setupScale(w);
  drawCartesianCoordinates(w, h, scl);
  strokeWeight(1 / scl);

  line(2, -height / scl, 2, height / scl);
  ellipse(0, 0, 2);

  strokeWeight(6 / scl);
  const div = 30;
  for (let i = 0; i <= div; i++) {
    let angle = i * PI / div;
    let v1 = p5.Vector.fromAngle(angle);
    let v2 = p5.Vector.fromAngle(-angle);
    const c = lerpColor(colorFrom, colorTo, map(i, 0, div, 0, 1));

    let y1 = v1.y / (v1.x + 1);
    let y2 = v2.y / (v2.x + 1);

    stroke(c);
    point(v1);
    point(v2);
    
    point(2, y1);
    point(2, y2);
  }

  stroke(255, 0, 0);
  let angle = atan2((height / 2 - mouseY) / scl, (mouseX - width/2) / scl); 
  let v = p5.Vector.fromAngle(angle);
  point(v);

  let y = v.y / (v.x + 1); 
  //logistic function to stretch y out a bit
  // let y2 = h * (Math.pow(Math.E, y) / (Math.pow(Math.E, y) + 1) - 0.5)
  point(2, y);
}



