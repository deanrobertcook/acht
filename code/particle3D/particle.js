class Particle extends p5.Vector {
  constructor(x, y, z) {
    super(x, y, z);
    this.vel = p5.Vector.random3D().mult(1.5);
    this.acc = createVector(0, 0, 0);
    this.lifetime = 255;
    this.color = color(random(255), random(255), random(255));
    this.rotationSpeed = random(0.1);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    //let mouse = createVector(mouseX, mouseY);
    //this.acc = p5.Vector.sub(mouse, this.pos);
    //this.acc.setMag(0.1);

    this.vel.add(this.acc);
    this.add(this.vel);
    this.acc.set(0, 0, 0);
    this.lifetime += -5;

    return this.lifetime <= 0;
  }

  show() {
    this.color.setAlpha(this.lifetime);
    push();
    translate(this.x, this.y, this.z);
    rotateZ(frameCount * this.rotationSpeed);
    rotateX(frameCount * this.rotationSpeed);
    rotateY(frameCount * this.rotationSpeed);
    stroke(255, this.lifetime);
    strokeWeight(2);
    fill(this.color);
    this.drawShape();
    pop();
  }

  drawShape() {
    box(16);
  }
}

class Cube extends Particle {
  constructor(x, y, z) {
    super(x, y, z);
  }

  drawShape() {
    box(16);
  }
}

class Tetrahedron extends Particle {
  constructor(x, y, z) {
    super(x, y, z);
  }

  drawShape() {
    let sideLength = 8;
    //1st triangle
    beginShape(TRIANGLES);
    vertex(sideLength, sideLength, sideLength);
    vertex(-sideLength, -sideLength, sideLength);
    vertex(sideLength, -sideLength, -sideLength);
    endShape();
    //2nd triangle
    beginShape(TRIANGLES);
    vertex(-sideLength, -sideLength, sideLength);
    vertex(sideLength, -sideLength, -sideLength);
    vertex(-sideLength, sideLength, -sideLength);
    endShape();
    //3rd triangle
    beginShape(TRIANGLES);
    vertex(sideLength, sideLength, sideLength);
    vertex(-sideLength, sideLength, -sideLength);
    vertex(-sideLength, -sideLength, sideLength);
    endShape();
    //4thtriangle
    beginShape(TRIANGLES);
    vertex(sideLength, sideLength, sideLength);
    vertex(sideLength, -sideLength, -sideLength);
    vertex(-sideLength, sideLength, -sideLength);
    endShape();
  }
}
