const r = 5;

let l1;
let l2;
let l3;

const draggables = [];
let p1
let p2
let p3

let o1;

lastLines = [];


function setup() {
  createCanvas(500, 500);

  l1 = new Line(width / 4, 0, width / 2, height, "l1");
  l2 = new Line(width / 8, height, width / 4, height / 4, "l2");
  l3 = new Line(0, 2 * height / 3, width, height / 3, "l3");


  p1 = new LineDraggablePoint(l1, r, "p1");

  o1 = new DraggablePoint(width / 8, height / 8, r, "o1");
  o2 = new DraggablePoint(3 * width / 4, 3 * height / 4, r, "o2");

  draggables.push(p1, o1, o2, l1, l2, l3);

}

function draw() {
  background(255);

  let m1 = Line.fromPoints(o1, p1);
  let p2 = l2.findIntersectsWithLine(m1);
  p2.i = "p2";
  p2.draw();

  let m2 = Line.fromPoints(o2, p2);
  let p3 = l3.findIntersectsWithLine(m2);
  p3.i = "p3";
  p3.draw();

  let m3 = Line.fromPoints(p1, p3);
  if (frameCount % 5 == 0) {
    lastLines.push(m3);
    if (lastLines.length > 40) {
      lastLines.shift();
    }
  }

  [m1, m2, m3].forEach(l => { 
    push();
    setLineDash([5, 5])
    l.draw(); 
    pop();
  });

  lastLines.forEach(l => { 
    push();
    stroke(255, 0, 0);
    strokeWeight(1);
    l.draw(); 
    pop();
  });

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
    let [cp1, cp2] = [this.cp1, this.cp2];
    let a = cp1.y - cp2.y;
    let b = cp2.x - cp1.x;
    let c = (cp1.x * cp2.y) - (cp2.x * cp1.y);
    return [a, b, c];
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