import p5 from 'p5';

addEventListener('load', (event) => {
  const root = document.getElementById('bezier-p5');
  if (root) {
    init(root);
  }
});

function init(div) {
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

