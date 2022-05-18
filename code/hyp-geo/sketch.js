
const w = 50;

const r = 10;

const EPS = 1e-9;

function setup() {
  createCanvas(500, 500);
  
  const [h, scl] = setupScale(w);
  drawCartesianCoordinates(w, h, scl);
  strokeWeight(1 / scl);

  noFill();
  circle(0, 0, r * 2);

  push();
  point(width/2 + 150, height/2)
  pop();


  let a = new p5.Vector(20, 3);
  let a2 = new p5.Vector(0, r);
  let a3 = new p5.Vector(0, -r + 6);

  let l1 = Line.fromPoints(a, a2);
  let l2 = Line.fromPoints(a, a3);
  
  l1.draw();
  l2.draw();

  let [alpha, beta] = l1.findIntersectsWithCircle(r);
  let [gamma, delta] = l2.findIntersectsWithCircle(r);

  let l3 = Line.fromPoints(alpha, delta);
  let l4 = Line.fromPoints(beta, gamma);
  let b = l3.findIntersectsWithLine(l4);

  let l5 = Line.fromPoints(alpha, gamma);
  let l6 = Line.fromPoints(beta, delta);
  let c = l5.findIntersectsWithLine(l6);

  [alpha, beta, gamma, delta, b, c].forEach(p => {
    push();
    strokeWeight(4 / scl)
    stroke(255, 0, 0)
    point(p.x, p.y)
    pop();
  });

  let A = Line.fromPoints(c, b);
  console.log(A)
  A.draw();
  
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

  findIntersectsWithCircle(r) {
    let a = this.a;
    let b = this.b;
    let c = this.c;

    let x0 = -a*c / (a*a + b*b)
    let y0 = -b*c / (a*a + b*b)
  
    if (c*c > r*r * (a*a + b*b) + EPS) {
      return [];
    } else if (Math.abs(c*c - r*r * (a*a + b*b)) < EPS) {
      return [new p5.Vector(x0, y0)]
    } else {
      let d = r*r - c*c/(a*a+b*b);
      let mult = Math.sqrt (d / (a*a+b*b));
      let ax = x0 + b * mult;
      let bx = x0 - b * mult;
      let ay = y0 - a * mult;
      let by = y0 + a * mult;
      return [new p5.Vector(ax, ay), new p5.Vector(bx, by)]
    }
  }

  findIntersectsWithLine(l2) {
    let l1 = this;
    let x = - (l1.c * l2.b - l2.c * l1.b) / (l1.a * l2.b - l2.a * l1.b);
    let y = - (l1.a * l2.c - l2.a * l1.c) / (l1.a * l2.b - l2.a * l1.b);
    return new p5.Vector(x, y)
  }

  /**
   * Draw the line as far as possible on the canvas
   */
  draw() {
    push();
    // translate(width / 2, height / 2);
    // scale(1, -1);
    let x0 = -w / 2;
    let y0 = (-this.a * x0 - this.c) / this.b

    let x1 = w / 2;
    let y1 = (-this.a * x1 - this.c) / this.b
    line(x0, y0, x1, y1);
    pop();
  }
}