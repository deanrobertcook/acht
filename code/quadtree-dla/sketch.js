let quadtree;
let points = [];

let tree = [];

const MAX_POINTS = 2500;
const POINT_R = 2;
const CIRC = 2 * POINT_R;
let speed = 5;

let colorFrom; 
let colorTo; 

let perim;
function setup() {
  createCanvas(640, 360);

  //snowflake
  // colorFrom = color(43, 65, 98); 
  // colorTo = color(245, 240, 246); 

  //leaf
  colorFrom = color(19, 70, 17); 
  colorTo = color(232, 252, 207); 

  let center = new BrownianPoint(width / 2, height / 2, POINT_R);
  center.setColor(colorFrom);
  tree.push(center);
  perim = center.getMinimalEnclosingBounds();
  quadtree = new QuadTree(0, 0, width, height, 4);
  quadtree.insert(center);
}

let walker;

function draw() {
  if (tree.length >= MAX_POINTS) {
    return;
  }
  if (!walker) {
    speed++;
    for (let p of tree) {
      let [x, y, w, h] = perim;
      if (p.x - p.r <= x) {
        perim[0] = p.x - p.r;
        perim[2] = w + x - (p.x - p.r);
      }

      if (p.x + p.r >= x + w) {
        perim[2] = p.x + p.r - x;
      }

      if (p.y - p.r <= y) {
        perim[1] = p.y - p.r;
        perim[3] = h + y - (p.y - p.r);
      }

      if (p.y + p.r >= y + h) {
        perim[3] = p.y + p.r - y;
      }
    }

    if (perim[2] >= width && perim[3] >= height) {
      return;
    }

    let v = randomPerimVector(...perim);
    walker = new BrownianPoint(v.x, v.y, POINT_R);
    walker.setBounds(...addPerimToBounds(...perim, CIRC));
  }

  let stuck = false;
  for (let i = 0; i < min(speed, 500) && !stuck; i++) {
    walker.move();

    let queryCirc = [walker.x, walker.y, 2*walker.r];
    let others = quadtree.queryCirc(...queryCirc);
    if (others.length > 0) {
      stuck = true;
    }
  }

  background(255);
  if (stuck) {
    let color = lerpColor(colorFrom, colorTo, map(tree.length, 0, MAX_POINTS, 0, 1));
    walker.setColor(color);
    tree.push(walker);
    quadtree.insert(walker);
    walker = null;
  } else {
    walker.draw();
  }

  for (let p of tree) {
    p.draw();
  }
  
  // push();
  // stroke(255);
  // strokeWeight(1);
  // noFill();
  // rect(...perim);
  // pop();

  // quadtree.draw();
}

function addPerimToBounds(x, y, w, h, perimWidth) {
  return [
    x - perimWidth,
    y - perimWidth,
    w + perimWidth * 2,
    h + perimWidth * 2,
  ]
}

class BrownianPoint extends p5.Vector {
  constructor(x, y, r, i) {
    super(x, y);
    this.r = r;
    this.i = i;

    this.setBounds(0, 0, width, height);
    this.setSpeed(1);
    this.setColor(color(255));
  }

  setColor(color) {
    this.color = color;
  }

  draw() {
    push();
    ellipseMode(RADIUS);
    noStroke();
    fill(this.color);
    circle(this.x, this.y, this.r);
    pop();

    if (this.i >= 0) {
      push();
      textAlign(CENTER, CENTER);
      text(this.i, this.x, this.y);
      pop();
    }
  }

  setSpeed(s) {
    this.speed = s;
  }

  getMinimalEnclosingBounds() {
    return [this.x - this.r, this.y - this.r, this.r * 2, this.r * 2];
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
  let xbar = p.x - x;
  let ybar = p.y - y;

  // let v = createVector(x, y);
  // let d = v.dist(p);
  // return d <= r;
  return xbar * xbar + ybar * ybar <= r * r;
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