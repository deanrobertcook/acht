import p5 from 'p5';

addEventListener('load', (event) => {
  const bezierP5 = document.getElementById('bezier-p5');
  if (bezierP5) {
    bezierP5Init(bezierP5);
  }

  const bezierExtremum = document.getElementById('bezier-extremum');
  if (bezierExtremum) {
    bezierExtremumInit(bezierExtremum);
  }
});

function bezierP5Init(div) {
  new p5((/** @type {p5} */s) => {

    let p0, p1, cp1, cp2;

    const w = div.offsetWidth;
    const h = div.offsetHeight;
  
    s.setup = () => {
      //TODO how to resize a p5 canvas?
      s.createCanvas(w, h);
      p0 = s.createVector(0, h / 2);
      p1 = s.createVector(w, h / 2);
      cp1 = s.createVector(w / 4, 0);
      cp2 = s.createVector(3 * (w / 4), h);
    };
  
    const POINTS = 10;
    s.draw = () => {
      s.clear();
      s.stroke(0);
      s.strokeWeight(2);

      cp1.x = s.mouseX;
      cp1.y = s.mouseY;

      s.noFill();
      s.beginShape();
      for (let t = 0; t <= 1; t += 1 / POINTS) {
        const x0 = s.lerp(p0.x, cp1.x, t);
        const y0 = s.lerp(p0.y, cp1.y, t);
        const x1 = s.lerp(cp1.x, p1.x, t);
        const y1 = s.lerp(cp1.y, p1.y, t);
        s.line(x0, y0, x1, y1);
        const x = s.lerp(x0, x1, t);
        const y = s.lerp(y0, y1, t);
        s.point(x, y);
      }
      s.endShape();
    };
  }, 'bezier-p5');
}

function bezierExtremumInit(div) {
  new p5((/** @type {p5} */s) => {
    const STEPS = 10;

    let ap1, ap2, cp;
  
    s.setup = () => {
      s.createCanvas(div.offsetWidth, div.offsetHeight);
      ap1 = s.createVector(3, s.height / 2);
      ap2 = s.createVector(s.width - 3, s.height / 2);
      cp = s.createVector(0, 0);
    };
  
    const POINTS = 10;
    s.draw = () => {
      s.clear();
      s.stroke(0);
      s.strokeWeight(2);

      s.push();
      s.stroke(0);
      s.strokeWeight(6);
      s.point(s.width / 2, s.height / 2);
      s.pop();
      
      s.line(s.width/2, s.height / 2, cp.x, cp.y);
      
      cp.set(s.mouseX, s.mouseY);
      
      let extT = findExtremum(ap1.y, cp.y, ap2.y);
      
      let extX = bezier1D(ap1.x, cp.x, ap2.x, extT);
      let extY = bezier1D(ap1.y, cp.y, ap2.y, extT);

      s.push();
      s.strokeWeight(0);
      function labelPoint(x, y) {
        let px = s.constrain(x - 10, 0 + 10, s.width - 60);
        let py = s.constrain(y - 10, 0 + 10, s.height - 2);
        
        s.text(`(${s.round(x)}, ${s.round(y)})`, px, py);
      }

      labelPoint(extX, extY);
      labelPoint(cp.x, cp.y);
      s.pop();

      s.push();
      s.stroke(0, 255, 0);
      s.line(0, extY, s.width, extY);
      s.pop();
      
      for (let t = 0; t <= 1.00001; t += 1 / STEPS) {
        let p1 = p5.Vector.lerp(ap1, cp, t);
        let p2 = p5.Vector.lerp(cp, ap2, t);
        //line(p1.x, p1.y, p2.x, p2.y);
        
        let px = bezier1D(ap1.x, cp.x, ap2.x, t);
        let py = bezier1D(ap1.y, cp.y, ap2.y, t);
        
        s.push();
        s.stroke(255, 0, 0);
        s.strokeWeight(6);
        s.point(px, py);
        s.pop();

      }
    };
  }, 'bezier-extremum');
}

function bezier1D(ap1, cp, ap2, t) {
  return ap1 + 2*t*(cp - ap1) + t*t*(ap2 - 2*cp + ap1);
}

//turns out it's always t = 0.5!
function findExtremum(a, b, c) {
  return (a - b) / (c - 2*b + a);
}

