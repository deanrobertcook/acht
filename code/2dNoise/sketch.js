function setup() {
  createCanvas(400, 400);
  pixelDensity(1);
  
  noiseDetail(4, 0.8);
  
}

const INC = 0.01;
let start = 0
function draw() {
  background(51);
  loadPixels();

  let yoff = start;
  
  for (let y = 0; y < height; y++) {
    let xoff = start;
    for (let x = 0; x < width; x++) {
      const i = (x + y * width) * 4;
      const r = noise(xoff, yoff) * 255 - 100;    
      pixels[i] = r;
      pixels[i + 1] = r;
      pixels[i + 2] = r;
      pixels[i + 3] = 255;
      xoff += INC;
    }
    yoff += INC;
  }
  
  start += INC;
  updatePixels();

  
}