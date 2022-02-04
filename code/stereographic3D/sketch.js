let colorFrom;
let colorTo;

let pth = Math.PI / 4;
let pph = 0;
const delta_th = Math.PI/256;
const delta_ph = Math.PI/32;

function setup() {
  // createCanvas(640, 360, WEBGL);
  createCanvas(640, 360);

  colorFrom = color(128, 4, 251);
  colorTo = color(128, 251, 4);
}
function draw() {
  background(51);

  // stroke(255);

  // orbitControl();

  // const w = 10;
  // const scl = width / w;
  // scale(scl, scl, scl);

  const w = 8
  const [h, scl] = setupScale(w);

  stroke(255);    
  strokeWeight(1 / scl);

  // const axisLength = 5;
  // stroke(255, 0, 0);
  // line(-axisLength, 0, 0, axisLength, 0, 0);
  // stroke(0, 255, 0);
  // line(0, -axisLength, 0, 0, axisLength, 0);
  // stroke(0, 0, 255);
  // line(0, 0, -axisLength, 0, 0, axisLength);
  
  
  for (let th = 0; th <= PI; th += PI / 32) {
    const c = lerpColor(colorFrom, colorTo, map(th, 0, PI, 0, 1));
    push();
    stroke(c);
    beginShape();
    noFill();
    for (let ph = 0; ph <= TWO_PI; ph += PI/32) {
      let v = p5.Vector.fromAngles(th, ph, 1);

      const stX = v.x / (v.y + 1);
      const stY = v.z / (v.y + 1);


      vertex(stX, stY);

      // point(v.x, v.y, v.z);  
    }
    endShape();
    pop();
  }
  drawCartesianCoordinates(w, h, scl);

  {
    let x = cos(pph) * sin(pth);
    let y = sin(pph) * sin(pth);
    let z = cos(pth);

    const stX = x / (z + 1);
    const stY = y / (z + 1);
    push();
    stroke(255, 0, 0);
    strokeWeight(6 / scl);
    point(stX, stY);
    pop();
    pth += delta_th % TWO_PI;
    pph += delta_ph % TWO_PI;
    // logSecond(pth, pph, stX, stY);
  }

}



