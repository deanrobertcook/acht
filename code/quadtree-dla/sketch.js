let quadtree;
let points = [];

let tree = [];

const MAX_POINTS = 100;
const POINT_R = 10;

function setup() {
  createCanvas(640, 360);

  tree.push(new BrownianPoint(width / 2, height / 2, POINT_R));

  // for (let i = 0; i < 4; i++) {
  //   let p = new BrownianPoint(random(width), random(height), 25, i);
  //   points.push(p);
  // }
}

let walker;
let perim;
function draw() {
  if (!walker) {
    let closest = ((tree.length + 2) * POINT_R) / 2;

    let w = min(closest, width);
    let h = min(closest, height);

    perim = [width/2 - w/2, height/2 - h/2, w, h]

    if (w >= width && h >= height) {
      return;
    }

    let v = randomPerimVector(...perim);
    walker = new BrownianPoint(v.x, v.y, POINT_R);
    walker.setBounds(...perim);
    walker.setSpeed(2 + tree.length / 8);
  } else {
    walker.move();
  }
  background(51);

  push();
  stroke(255);
  strokeWeight(1);
  noFill();
  rect(...perim);
  pop();
  walker.draw();
  

  let stuck = false;
  for (let p of tree) {
    if (isInCirc(p, walker.x, walker.y, p.r * 2)) {
      stuck = true
    }
  }

  if (stuck) {
    tree.push(walker);
    walker = null;
  }
  
  for (let p of tree) {
    p.draw();
  }

  // quadtree = new QuadTree(0, 0, width, height, 4);
  // points.forEach((p) => {
  //   p.move();
  //   p.highlight = false;
  //   quadtree.insert(p);
  // });

  // points.forEach((p) => {
  //   let queryCirc = [p.x, p.y, 2*p.r];
  //   let others = quadtree.queryCirc(...queryCirc);
  //   if (others.length > 1) {
  //     p.highlight = true;
  //   }
  // });

  // points.forEach((p) => {
  //   p.draw();
  // });


  //quadtree.draw();
}

class BrownianPoint extends p5.Vector {
  constructor(x, y, r, i) {
    super(x, y);
    this.r = r;
    this.i = i;

    this.setBounds(0, 0, width, height);
    this.setSpeed(1);
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

  setSpeed(s) {
    this.speed = s;
  }

  setBounds(x, y, w, h) {
    this.minX = x;
    this.minY = y;
    this.boundsW = w;
    this.boundsH = h;
  }

  move() {
    this.add(p5.Vector.random2D().mult(this.speed));
    let x = constrain(this.x, this.minX + this.r, this.minX + this.boundsW - this.r);
    let y = constrain(this.y, this.minY + this.r, this.minY + this.boundsH - this.r);
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

function randomPerimVector(x, y, w, h) {
  let a = random(2*(w + h));
  let v;
  if (a < w) {
    v = createVector(a, 0);
  } else if(a >= w && a < w + h) {
    v = createVector(w, a - w);
  } else if(a >= w + h && a < 2*w + h) {
    v = createVector(2*w + h - a, h);
  } else { // a > w + h && a <= 2*w + h) {
    v = createVector(0, 2*(w+h) - a);
  }
  return v.add(x, y);
}