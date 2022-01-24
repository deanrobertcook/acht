let quadtree;
let points = [];

function setup() {
  createCanvas(640, 360);
  for (let i = 0; i < 100; i++) {
    let p = new BrownianPoint(random(width), random(height), 4);
    points.push(p);
  }
}

function draw() {
  background(51);

  quadtree = new QuadTree(0, 0, width, height, 4);
  points.forEach((p) => {
    p.move();
    p.highlight = false;
    quadtree.insert(p);
  });

  points.forEach((p) => {
    let queryCirc = [p.x, p.y, 2*p.r];
    let others = quadtree.queryCirc(...queryCirc);
    if (others.length > 1) {
      p.highlight = true;
    }
  });

  points.forEach((p) => {
    p.draw();
  });


  //quadtree.draw();
}

class BrownianPoint extends p5.Vector {
  constructor(x, y, r, i) {
    super(x, y);
    this.r = r;
    this.i = i;
  }

  draw() {
    push();
    ellipseMode(RADIUS);
    noStroke()
    if (!this.highlight) {
      fill(19, 111, 99);
    } else {
      fill(224, 202, 60);
    }
    circle(this.x, this.y, this.r);
    pop();

    push();
    textAlign(CENTER, CENTER);
    if (this.i >= 0) {
      text(this.i, this.x, this.y);
    }
    pop();
  }

  move() {
    this.add(p5.Vector.random2D().mult(2));
    let x = constrain(this.x, this.r, width - this.r);
    let y = constrain(this.y, this.r, height - this.r);
    this.set(x, y);
  }
}

class QuadTree {
  constructor(x, y, w, h, capacity) {
    this.capacity = capacity;
    this.points = [];
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  insert(p) {
    if (!this.contains(p)) {
      return;
    }

    if (this.points && this.points.length < this.capacity) {
      this.points.push(p);
      return;
    }

    if (!this.nw) {
      this.nw = new QuadTree(
        this.x,
        this.y,
        this.w / 2,
        this.h / 2,
        this.capacity
      );
      this.ne = new QuadTree(
        this.x + this.w / 2,
        this.y,
        this.w / 2,
        this.h / 2,
        this.capacity
      );
      this.sw = new QuadTree(
        this.x,
        this.y + this.h / 2,
        this.w / 2,
        this.h / 2,
        this.capacity
      );
      this.se = new QuadTree(
        this.x + this.w / 2,
        this.y + this.h / 2,
        this.w / 2,
        this.h / 2,
        this.capacity
      );
    }

    [...this.points ? this.points : [], p].forEach(p => {
      this.onChild(q => q.insert(p))
    });

    this.points = undefined;
  }

  queryRect(x, y, w, h, found) {
    found = found ? found : [];
    const contains = x <= this.x + this.w && x + w > this.x &&
      y <= this.y + this.h && y + h > this.y;

    if (!contains) {
      return found;
    }

    if (this.points) {
      return found.concat(this.points.filter(p => isInRect(p, x, y, w, h)));
    } else {
      this.onChild(q => found = q.queryRect(x, y, w, h, found));
    }
    return found;
  }

  queryCirc(x, y, r, found) {
    found = found ? found : [];

    //TODO - over-eagerly returns true - could be slightly smarter
    const contains = x - r <= this.x + this.w && x + r > this.x &&
      y - r <= this.y + this.h && y + r > this.y;

    if (!contains) {
      return found;
    }

    if (this.points) {
      return found.concat(this.points.filter(p => isInCirc(p, x, y, r)));
    } else {
      this.onChild(q => found = q.queryCirc(x, y, r, found));
    }
    return found;
  }

  contains(p) {
    return isInRect(p, this.x, this.y, this.w, this.h);
  }

  draw() {
    push();
    stroke(255);
    noFill();
    strokeWeight(0.25);
    rect(this.x, this.y, this.w, this.h);
    pop();

    if (this.nw) {
      this.onChild(q => q.draw());
    }
  }

  onChild(f) {
    [this.nw, this.ne, this.sw, this.se].forEach((q) => {
      f(q);
    });
  }
}

function isInRect(p, x, y, w, h) {
  return (
    p.x > x && p.x <= x + w &&
    p.y > y && p.y <= y + h
  );
}

function isInCirc(p, x, y, r) {
  let v = createVector(x, y);
  let d = v.dist(p);
  return d <= r;
}

function logSecond(...msg) {
  frameCount % 60 == 0 && console.log(...msg);
}