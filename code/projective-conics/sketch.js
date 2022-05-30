const r = 5;

const lines = [];
const points = [];

function setup() {
  createCanvas(500, 500);


  let l = Line.fromPoints(new p5.Vector(0, height), new p5.Vector(width, 0));

  

  lines.push(l);
  let p = new LineDraggablePoint(l, r);

  points.push(p);

  
}

function draw() {
  background(255);

  points.forEach(p => {
    p.over();
    p.update();
    p.draw();
  });
  lines.forEach(l => { 
    l.draw(); 
  });
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

  draw() {
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
  }
}

class LineDraggablePoint extends DraggablePoint {
  constructor(l, r, i) {
    let x = width/2;
    let [a, b, c] = [l.a, l.b, l.c];
    let y = - c / b - (a / b) * x;
    super(x, y, r, i);
    this.l = l;
  }

  update() {
    // Adjust location if being dragged
    if (this.dragging) {
      let [a, b] = [this.l.a, this.l.b];
      let [x, y] = [this.x, this.y]
    
      let dot = b*(mouseX - x) - a*(mouseY - y);
      let den = a*a + b*b;

      this.x = b*dot/den + x;
      this.y = -a*dot/den + y;
    }
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