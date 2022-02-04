let colorFrom;
let colorTo;

let pth = Math.PI / 4;
let pph = 0;
const delta_th = Math.PI / 256;
const delta_ph = Math.PI / 32;

const sphereDetail = 16;
let sphere = [];
let colors = [];
function setup() {
  createCanvas(640, 360, WEBGL);

  colorFrom = color(128, 4, 251);
  colorTo = color(128, 251, 4);

  for (let lat = 0; lat < sphereDetail + 1; lat++) {
    const th = map(lat, 0, sphereDetail, 0, PI);
    const c = lerpColor(colorFrom, colorTo, map(th, 0, PI, 0, 1));
    colors[lat] = c;
    for (let long = 0; long < sphereDetail + 1; long++) {
      const ph = map(long, 0, sphereDetail, 0, TWO_PI);
      let v = p5.Vector.fromAngles(th, ph, 100);
      sphere[lat * sphereDetail + long] = v;
    }
  }
}



function draw() {
  background(51);
  orbitControl();


  strokeWeight(1);

  const axisLength = 110;
  stroke(255, 0, 0);
  line(-axisLength, 0, 0, axisLength, 0, 0);
  stroke(0, 255, 0);
  line(0, -axisLength, 0, 0, axisLength, 0);
  stroke(0, 0, 255);
  line(0, 0, -axisLength, 0, 0, axisLength);


  stroke(0);

  // let lat = 10;
  // let long = 0;
  // let p1 = sphere[lat + long * sphereDetail];
  // let p2 = sphere[lat + (long + 1) * sphereDetail];
  // let p3 = sphere[lat + 1 + long * sphereDetail];
  // point(p1);
  // point(p2);
  // point(p3);
  // beginShape(TRIANGLE_STRIP);
  // vertex(p1.x, p1.y, p1.z);
  // vertex(p2.x, p2.y, p2.z);
  // vertex(p3.x, p3.y, p3.z);
  // endShape();

  // beginShape(TRIANGLE_STRIP);
  // vertex(0, 75, 10);
  // vertex(10, 20, -10);
  // vertex(20, 75, -10);
  // vertex(30, 20, 10);
  // vertex(40, 75, -10);
  // vertex(50, 20, -10);
  // vertex(60, 75, 10);
  // endShape();

  for (let lat = 0; lat < sphereDetail; lat++) {
    let c = colors[lat];
    fill(c);
    beginShape(TRIANGLE_STRIP);
    for (let long = 0; long < sphereDetail + 1; long++) {
      let i1 = lat * sphereDetail + long
      let i2 = (lat + 1) * sphereDetail + long;
      let p1 = sphere[i1];
      let p2 = sphere[i2];
      vertex(p1.x, p1.y, p1.z);
      vertex(p2.x, p2.y, p2.z);
    }
    endShape();
  }

  // sphere.forEach(([v, c]) => {
  //   stroke(c);
  //   point(v)
  // });

}



