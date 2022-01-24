
let particles = [];


function setup() {
  createCanvas(640, 360, WEBGL);  
}

function draw() {
  background(51);

  translate(-width / 2, -height / 2)


  if (frameCount % 10 == 0) {
    for (let i = 0; i < 1; i++) {
      let d = floor(randomGaussian(0, 50));
      let v = createVector(width/2, height/2).add(p5.Vector.random2D().mult(d))
      const p = random() < 0.5 ? 
            new Cube(v.x, v.y) :
            new Tetrahedron(v.x, v.y);
      
      particles.push(p);  
    }  
  }
  
  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i];   
    particle.applyForce(createVector(0, 0, 0.1));  


    let remove = particle.update();
    if (remove) {
      particles.splice(0, i);
      continue;
    }
    particle.show();  
  } 
}





