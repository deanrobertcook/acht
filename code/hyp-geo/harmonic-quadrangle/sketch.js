const r = 5;

let points;
let abad;
let bcbd;

function setup() {
  createCanvas(500, 500);

  points = [
    new DraggablePoint(231, 237, r, "1"),
    new DraggablePoint(253, 269, r, "2"),
    new DraggablePoint(346, 208, r, "3"),
    new DraggablePoint(260, 168, r, "4"),
  ];

  abad = createP('');
  bcbd = createP('')
}

function draw() {
  background(255);

  points.forEach(p => {
    p.over();
    p.update();
    p.show();
  });

  let [p1, p2, p3, p4] = points;

  line(p1.x, p1.y, p2.x, p2.y)
  line(p2.x, p2.y, p3.x, p3.y)
  line(p3.x, p3.y, p4.x, p4.y)
  line(p4.x, p4.y, p1.x, p1.y)

  push();
  setLineDash([5, 5])
  let l12 = Line.fromPoints(p1, p2);
  let l34 = Line.fromPoints(p3, p4);
  l12.draw()
  l34.draw();
  
  let l41 = Line.fromPoints(p4, p1);
  let l23 = Line.fromPoints(p2, p3);
  l41.draw();
  l23.draw();

  let l31 = Line.fromPoints(p3, p1);
  let l42 = Line.fromPoints(p4, p2);
  l31.draw();
  l42.draw();
  pop();

  let a = l12.findIntersectsWithLine(l34);
  let c = l41.findIntersectsWithLine(l23);

  let lac = Line.fromPoints(a, c);

  let b = l31.findIntersectsWithLine(lac);
  let d = l42.findIntersectsWithLine(lac);

  circle(a.x, a.y, r)
  text('a', a.x, a.y)
  circle(b.x, b.y, r)
  text('b', b.x, b.y)
  circle(c.x, c.y, r)
  text('c', c.x, c.y)
  circle(d.x, d.y, r)
  text('d', d.x, d.y)

  let distAB = Math.sqrt(Math.pow(a.x - b.x, 2), Math.pow(a.y, - b.y, 2))
  let distAD = Math.sqrt(Math.pow(a.x - d.x, 2), Math.pow(a.y, - d.y, 2))
  let distCB = Math.sqrt(Math.pow(c.x - b.x, 2), Math.pow(c.y, - d.y, 2))
  let distCD = Math.sqrt(Math.pow(c.x - d.x, 2), Math.pow(c.y, - d.y, 2))

  abad.html(distAB / distAD)
  bcbd.html(distCB / distCD)

  let rangeLine = Line.fromPoints(b, d);
  rangeLine.draw();
}

function setLineDash(list) {
  drawingContext.setLineDash(list);
}

function mousePressed() {
  points.forEach(p => {
    p.pressed();
  })
}

function mouseReleased() {
  points.forEach(p => {
    p.released();
  })
}

// Click and Drag an object
// Inspired by Daniel Shiffman <http://www.shiffman.net>

class DraggablePoint {
  constructor(x, y, r, i) {
    this.dragging = false; // Is the object being dragged?
    this.rollover = false; // Is the mouse over the ellipse?
    this.x = x;
    this.y = y;
    this.r = r;
    this.i = i;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  over() {    
    let r = this.r;

    let xdist = mouseX - this.x;
    let ydist = mouseY - this.y;

    // Is mouse over object
    if (r*r > xdist*xdist + ydist*ydist) {
      this.rollover = true;
    } else {
      this.rollover = false;
    }
  }

  update() {
    // Adjust location if being dragged
    if (this.dragging) {
      this.x = mouseX + this.offsetX;
      this.y = mouseY + this.offsetY;
    }
  }

  show() {
    // Different fill based on state
    push()
    if (this.dragging) {
      fill(50);
    } else if (this.rollover) {
      fill(100);
    } else {
      fill(175, 200);
    }
    circle(this.x, this.y, this.r * 2);
    pop();
    if (this.i) {

      text(this.i, this.x, this.y)
    }
    
  }

  pressed() {
    let r = this.r;

    let xdist = mouseX - this.x;
    let ydist = mouseY - this.y;

    // Did I click on the object?
    if (r*r > xdist*xdist + ydist*ydist) {
      this.dragging = true;
      // If so, keep track of relative location of click to center of cirlce
      this.offsetX = this.x - mouseX;
      this.offsetY = this.y - mouseY;
    }
  }

  released() {
    // Quit dragging
    this.dragging = false;
    console.log(this.x, this.y)
  }
}

class Line {
  constructor(a, b, c) {
    this.a = a;
    this.b = b;
    this.c = c;
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
    let x0 = 0;
    let y0 = (-this.a * x0 - this.c) / this.b

    let x1 = width;
    let y1 = (-this.a * x1 - this.c) / this.b
    line(x0, y0, x1, y1);
    pop();
  }
}