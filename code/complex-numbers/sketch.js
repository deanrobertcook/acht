function setup() {
  createCanvas(640, 360);
}

function draw() {
  noFill();
  background(51);
  stroke(255);
  
  let w = 32;
  let h = w * (width / height);
  let scl = width / w;

  setupCartesianCoordinates(w, h, scl);


  strokeWeight(2 / scl);

  point(0, 0);
  line(0, 0, 4, 3);
  // let x1 = createVector(width / 2, height / 2);
  // let x2 = createVector(mouseX, mouseY);



  // // this code is to make the arrow point
  // push() //start new drawing state
  // var angle = atan2(x1.y - x2.y, x1.x - x2.x); //gets the angle of the line
  // translate(x2.x, x2.y); //translates to the destination vertex
  // rotate(angle-HALF_PI); //rotates the arrow point
  // triangle(-offset*0.5, offset, offset*0.5, offset, 0, -offset/2); //draws the arrow point as a triangle
  // pop();

}

function setupCartesianCoordinates(w, h, scl) {
  strokeWeight(0.5);
  line(width / 2, 0, width / 2, height);
  line(0, height / 2, width, height / 2);

  const pointSize = 2;
  //draw x coordinate
  push();
  strokeWeight(pointSize);
  translate(0, height / 2);
  for (let i = 0; i <= w; i++) {
    point(i * scl, 0);
  }
  pop();

  //draw y coordinate
  push();
  strokeWeight(pointSize);
  translate(width / 2, 0);
  for (let i = 0; i <= h; i++) {
    point(0, (i - 0.5) * scl); //TODO make more generic in case of odd numbers
  }
  pop();

  translate(width / 2, height / 2);
  scale(scl, -scl);
}
