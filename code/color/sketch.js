const hues = [];
const sats = [];
const vals = [];

const hueSettings = [
  function () { return floor(random(0, 360)) },
  function () { return floor(random(0, 120)) },
  function () { return floor(random(120, 240)) },
  function () { return floor(random(240, 360)) },
]

const sbSettings = [
  function () { return floor(random(0, 100)) },
  function () { return floor(random(0, 50)) },
  function () { return floor(random(50, 100)) },
]

let h = 0, s = 0, b = 0;

const colorsW = 360;

let rows = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  setColors();
  noStroke();

  const maxRows = height / 20;

  for (let i = 0; i < maxRows; i++) {
    let xTiles = [];
    recurseFillX(0, width, xTiles);
    rows.push(xTiles);
  }
}

function draw() {

  if (frameCount % 30 == 0) {

    const tileYCount = floor(height / max(mouseY, 20));
    const rectH = height / tileYCount;

    let counter = 0;
    for (let y = 0; y < tileYCount; y++) {
      const row = rows[y];
      row.forEach(([x, w]) => {
        const i = counter % colorsW;
        fill(hues[i], sats[i], vals[i]);
        rect(x, y * rectH, w, rectH);
        counter++;
      })
    }
  }  
}

function recurseFillX(x, w, arr) {
  if (w <= 1 || floor(random(2))) {
    arr.push([x, w])
  } else {
    recurseFillX(x, w / 2, arr)
    recurseFillX(x + w / 2, w / 2, arr)
  }
}

function keyPressed() {

  switch (key) {
    case '1':
      h = (h + 1) % hueSettings.length;
      break;
    case '2':
      s = (s + 1) % sbSettings.length;
      break;
    case '3':
      b = (b + 1) % sbSettings.length;
      break;
  }
  setColors();
}

function setColors() {
  for (let i = 0; i < colorsW; i++) {
    hues[i] = hueSettings[h]();
    sats[i] = sbSettings[s]();
    vals[i] = sbSettings[b]();
  }
}
