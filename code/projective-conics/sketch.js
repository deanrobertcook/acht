const r = 5;

let l1, l2, l3;
let o1, o2;

const draggables = [];


function setup() {
  createCanvas(500, 500);

  l1 = new Line(width / 4, 0, width / 2, height, "l1");
  l2 = new Line(width / 8, height, width / 4, height / 4, "l2");
  l3 = new Line(0, 2 * height / 3, width, height / 3, "l3");

  o1 = new DraggablePoint(width / 8, height / 8, r, "o1");
  o2 = new DraggablePoint(3 * width / 4, 3 * height / 4, r, "o2");

  draggables.push(o1, o2, l1, l2, l3);

  let pCount = 3
  let [p1s, p2s] = getPerspectiveRange(o1, l1, l2, pCount);
  let [_, p3s] = getPerspectiveRange(o2, l2, l3, p2s);

  console.log(p1s, p2s, p3s);

  for (let i = 0; i < pCount; i++) {
    let [x1, y1] = p1s[i];
    let [x2, y2] = p3s[i];
    line(x1, y1, x2, y2);
  }

  draggables.forEach(p => {
    // p.over();
    // p.update();
    p.draw();
  });

}

function draw() {
  background(255);

  let pCount = 100;
  let [p1s, p2s] = getPerspectiveRange(o1, l1, l2, pCount);
  let [_, p3s] = getPerspectiveRange(o2, l2, l3, p2s);

  for (let i = 0; i <= pCount; i++) {
    let [x1, y1] = p1s[i];
    let [x2, y2] = p3s[i];
    line(x1, y1, x2, y2);
  }

  draggables.forEach(p => {
    p.over();
    p.update();
    p.draw();
  });
}

function setLineDash(list) {
  drawingContext.setLineDash(list);
}

function mousePressed() {
  draggables.forEach(p => {
    p.pressed();
  })
}

function mouseReleased() {
  draggables.forEach(p => {
    p.released();
  })
}

function getPerspectiveRange(cp, lineFrom, lineTo, samples) {

  if (Number.isInteger(samples)) {
    let n = samples
    let lp1 = lineFrom.cp1;
    let lp2 = lineFrom.cp2;
    let dx = (lp2.x - lp1.x) / n;
    let dy = (lp2.y - lp1.y) / n;
    samples = [];
    for (let i = 0; i <= n; i++) {
      samples.push([lp1.x + i*dx, lp1.y + i*dy]);
    }
  }

  let projections = [];
  samples.forEach(p => {
    let [a1, b1, c1] = lineTo.getCoefficients()
    let [a2, b2, c2] = getLineEquationBetween(cp.x, cp.y, p[0], p[1]);
    let x = - (c1 * b2 - c2 * b1) / (a1 * b2 - a2 * b1);
    let y = - (a1 * c2 - a2 * c1) / (a1 * b2 - a2 * b1);
    projections.push([x, y]);
  })
  return [samples, projections];
}

// Click and Drag an object
// Inspired by Daniel Shiffman <http://www.shiffman.net>

class Point {
  constructor(x, y, r, i) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.i = i;
  }

  drawText() {
    if (this.i) {
      textSize(9);
      text(this.i, this.x + this.r, this.y - this.r);
    }
  }

  drawCircle() {
    fill(175, 200);
    circle(this.x, this.y, this.r * 2);
  }

  draw() {
    push()
    this.drawCircle();
    pop();
    push();
    this.drawText();
    pop();
  }
}
class DraggablePoint extends Point {
  constructor(x, y, r, i) {
    super(x, y, r, i);
    this.dragging = false; // Is the object being dragged?
    this.rollover = false; // Is the mouse over the ellipse?
    this.offsetX = 0;
    this.offsetY = 0;
  }

  over() {
    let r = this.r;

    let xdist = mouseX - this.x;
    let ydist = mouseY - this.y;

    // Is mouse over object
    if (r * r > xdist * xdist + ydist * ydist) {
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

  drawCircle() {
    if (this.dragging) {
      fill(50);
    } else if (this.rollover) {
      fill(100);
    } else {
      fill(175, 200);
    }
    circle(this.x, this.y, this.r * 2);
  }

  pressed() {
    let r = this.r;

    let xdist = mouseX - this.x;
    let ydist = mouseY - this.y;

    // Did I click on the object?
    if (r * r > xdist * xdist + ydist * ydist) {
      this.dragging = true;
      // If so, keep track of relative location of click to center of cirlce
      this.offsetX = this.x - mouseX;
      this.offsetY = this.y - mouseY;
    }
  }

  released() {
    // Quit dragging
    this.dragging = false;
  }
}

function getCoordsOfPointOnLineClosestTo(l, x0, y0) {
  let [a, b, c] = l.getCoefficients();
  let d = a * y0 - b * x0;
  let y = (a * d - b * c) / (a * a + b * b);
  let x = (-b * d - a * c) / (a * a + b * b);
  return [x, y];
}
class LineDraggablePoint extends DraggablePoint {
  constructor(l, r, i) {
    let [x, y] = getCoordsOfPointOnLineClosestTo(l, width / 2, height / 2);
    super(x, y, r, i);
    this.l = l;
  }

  update() {
    // Adjust location if being dragged
    if (this.dragging) {
      let [a, b, c] = this.l.getCoefficients();
      let [x, y] = [this.x, this.y];

      let dot = b * (mouseX - x) - a * (mouseY - y);
      let den = a * a + b * b;

      this.x = b * dot / den + x;
      this.y = -a * dot / den + y;
    } else { // ensure the point hugs the line:
      let [x, y] = getCoordsOfPointOnLineClosestTo(this.l, this.x, this.y);
      this.x = x;
      this.y = y;
    }
  }
}

function getLineEquationBetween(x1, y1, x2, y2) {
  let a = y1 - y2;
  let b = x2 - x1;
  let c = (x1 * y2) - (x2 * y1);
  return [a, b, c];
}

class Line {

  //TODO - figure out a better way of drawing points, some might be drawn twice
  //depending on how they are kept track of in the draw method
  constructor(x1, y1, x2, y2, i) {
    //TODO move this logic to points so that they are never drawn offscreen
    if (x1 <= 0)          { x1 = 10 }
    else if (x1 >= width) { x1 = width - 15 }
    if (x2 <= 0)          { x2 = 10 }
    else if (x2 >= width) { x2 = width - 15 }
    if (y1 <= 0)           { y1 = 10 }
    else if (y1 >= height) { y1 = height - 15 }
    if (y2 <= 0)           { y2 = 10 }
    else if (y2 >= height) { y2 = height - 15 }
    this.cp1 = new DraggablePoint(x1, y1, r, i);
    this.cp2 = new DraggablePoint(x2, y2, r, i);
    this.points = [];
    this.points.push(this.cp1, this.cp2);
  }

  addPoint(p) {
    this.points.push(p);
  }

  static fromPoints(p1, p2, i) {
    return new Line(p1.x, p1.y, p2.x, p2.y, i);
  }

  getCoefficients() {
    return getLineEquationBetween(this.cp1.x, this.cp1.y, this.cp2.x, this.cp2.y);
  }

  findIntersectsWithLine(l2) {
    let [a1, b1, c1] = this.getCoefficients();
    let [a2, b2, c2] = l2.getCoefficients();
    let x = - (c1 * b2 - c2 * b1) / (a1 * b2 - a2 * b1);
    let y = - (a1 * c2 - a2 * c1) / (a1 * b2 - a2 * b1);
    return new Point(x, y, r);
  }

  over() {
    this.points.forEach(p => {
      p.over();
    });
  }

  update() {
    this.points.forEach(p => {
      p.update();
    })
  }

  pressed() {
    this.points.forEach(p => {
      p.pressed();
    })
  }

  released() {
    this.points.forEach(p => {
      p.released();
    })
  }

  draw() {
    this.cp1.draw();
    this.cp2.draw();
    let [a, b, c] = this.getCoefficients();
    push();
    // Draw the line as far as possible on the canvas
    let x0 = 0;
    let y0 = (-a * x0 - c) / b

    let x1 = width;
    let y1 = (-a * x1 - c) / b
    line(x0, y0, x1, y1);
    pop();
  }
}