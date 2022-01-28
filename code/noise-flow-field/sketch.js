const scale = 20;
let cols, rows;
let particles = [];

let fr;

function setup() {
  createCanvas(400, 400);

  cols = floor(width / scale);
  rows = floor(height / scale);

  for (let i = 0; i < 1000; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
  fr = createP('');

  noiseDetail(10, 0.05);
}

const INC = 0.1;
let zoff = 0;
function draw() {
  background(255);

  // let yoff = 0;
  // for (let y = 0; y < rows; y++) {
  //   let xoff = 0;
  //   for (let x = 0; x < cols; x++) {

  //     const angle = noise(xoff, yoff, zoff) * TWO_PI;    
  //     const v = p5.Vector.fromAngle(angle);
      
  //     push();
  //     translate(x * scale, y * scale);
  //     rotate(v.heading());
  //     stroke(0, 50);
  //     line(0, 0, scale, 0);
  //     pop();

  //     xoff += INC;
  //   }
  //   yoff += INC;
  // }
  
  

  for (let p of particles) {
    let x = p.x / scale * INC;
    let y = p.y / scale * INC;
    const angle = noise(x, y, zoff) * TWO_PI;    
    const force = p5.Vector.fromAngle(angle);
    // force.setMag(5);
    p.applyForce(force);
    p.update();
    p.show();
  }

  // zoff += INC;

  if (frameCount % 60 == 0) {
    fr.html(floor(frameRate()));
  }
}

class Particle extends p5.Vector {
  constructor(x, y) {
    super(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 4
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.add(this.vel);
    this.x = (this.x + width) % width;
    this.y = (this.y + height) % height;
    this.acc.mult(0);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  show() {
    push();
    stroke(0);
    strokeWeight(2);
    point(this.x, this.y);
    pop();
  }
}
