

function setup() {
  createCanvas(500, 500);

  background(51);

  noFill();
  stroke(255);
  circle(width/2, height/2, 200);

  push();
  strokeWeight(4)
  point(width/2 + 150, height/2)
  pop();

  // let l = new Line(1, 1, -3);
  // l.draw();

  let p1 = new p5.Vector(width/2 + 150, height/2);
  let p2 = new p5.Vector(width/2, height/2 - 150);

  push();
  strokeWeight(4)
  stroke(255, 204, 0)
  point(p1.x, p1.y)
  point(p2.x, p2.y)
  pop();

  let l2 = Line.fromPoints(p1, p2);
  l2.draw();
  
}

/**
 * Expected in general form: ax + by + c = 0
 */
class Line {
  constructor(a, b, c) {
    this.a = a;
    this.b = b;
    this.c = c;
    console.log(a, b, c)
  }

  static fromPoints(p1, p2) {
    let a = p1.y - p2.y;
    let b = p2.x - p1.x;
    let c = (p1.x * p2.y) - (p2.x * p1.y);
    return new Line(a, b, c);
  }

  /**
   * Draw the line as far as possible on the canvas
   */
  draw() {
    push();
    // translate(width / 2, height / 2);
    // scale(1, -1);
    let x0 = 0;
    let y0 = (-this.a * x0 - this.c) / this.b

    let x1 = width;
    let y1 = (-this.a * x1 - this.c) / this.b
    line(x0, y0, x1, y1);
    pop();
  }
}