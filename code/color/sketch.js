let img;
let colors = [];
let sortMode = null;
let ar;

function setup() {
  ar = img.width / img.height;

  let h = 400;
  createCanvas(ar * h, 2 * h);
  noStroke();
}

function preload() {
  loadImage('img.png', setImage);
}

function draw() {
  background(51);
  colors = [];
  let tileXCount = floor(width / max(mouseX, 5));
  let tileYCount = floor(ar * tileXCount / 2);
  
  let imgRectSize = img.width / tileXCount;
  for (let gridY = 0; gridY < tileYCount; gridY++) {
    for (let gridX = 0; gridX < tileXCount; gridX++) {
      let px = floor(gridX * imgRectSize);
      let py = floor(gridY * imgRectSize);
      let i = (py * img.width + px) * 4;
      let c = color(img.pixels[i], img.pixels[i + 1], img.pixels[i + 2], img.pixels[i + 3]);
      colors.push(c);
    }
  }

  // sortColors(colors, sortMode)

  colors = colors.map(a => {
    return color(...chroma(red(a), green(a), blue(a)).desaturate(4).rgb())
    // return color((red(a) * 0.222 + green(a) * 0.707 + blue(a) * 0.071));
  })

  let rectSize = width / tileXCount;
  let i = 0;
  for (let gridY = 0; gridY < tileYCount; gridY++) {
    for (let gridX = 0; gridX < tileXCount; gridX++) {
      fill(colors[i]);
      rect(gridX * rectSize, gridY * rectSize, rectSize, rectSize);
      i++;
    }
  }
}

function keyReleased() {
  // if (key == 'c' || key == 'C') writeFile([gd.ase.encode(colors)], gd.timestamp(), 'ase');
  // if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');

  if (key == '1') loadImage('pic1.jpg', setImage);
  if (key == '2') loadImage('pic2.jpg', setImage);
  if (key == '3') loadImage('pic3.jpg', setImage);
  if (key == '4') loadImage('pic4.jpg', setImage);

  if (key == '5') sortMode = null;
  if (key == '6') sortMode = HUE;
  if (key == '7') sortMode = SATURATION;
  if (key == '8') sortMode = BRIGHTNESS;
  if (key == '9') sortMode = GRAYSCALE;
}

function setImage(loadedImg) {
  console.log('setImage', loadedImg);
  img = loadedImg;
  img.loadPixels();
}

/**
 * Color constant
 * @property {String}
 */
 var RED = "red";
 /**
  * Color constant
  * @property {String}
  */
 var GREEN = "green";
 /**
  * Color constant
  * @property {String}
  */
 var BLUE = "blue";
 /**
  * Color constant
  * @property {String}
  */
 var HUE = "hue";
 /**
  * Color constant
  * @property {String}
  */
 var SATURATION = "saturation";
 /**
  * Color constant
  * @property {String}
  */
 var BRIGHTNESS = "brightness";
 /**
  * Color constant
  * @property {String}
  */
 var GRAYSCALE = "grayscale";
 /**
  * Color constant
  * @property {String}
  */
 var ALPHA = "alpha";
 


/**
 * Sorts an array of colors according to the given method
 * (Taken from: https://cdn.jsdelivr.net/gh/generative-design/Code-Package-p5.js@master/libraries/gg-dep-bundle/gg-dep-bundle.js)
 *
 * @method sortColors
 * @param {Array} colors An array of colors.
 * @param {String} method Either gd.RED, gd.GREEN, gd.BLUE, gd.HUE, gd.SATURATION, gd.BRIGHTNESS, gd.GRAYSCALE or gd.ALPHA.
 * @return {String} formated timestamp as string
 */
var sortColors = function (colors, method) {

  // sort red
  if (method == RED) colors.sort(function (a, b) {
    if (red(a) < red(b)) return -1;
    if (red(a) > red(b)) return 1;
    return 0;
  });

  // sort green
  if (method == GREEN) colors.sort(function (a, b) {
    if (green(a) < green(b)) return -1;
    if (green(a) > green(b)) return 1;
    return 0;
  });

  // sort blue
  if (method == BLUE) colors.sort(function (a, b) {
    if (blue(a) < blue(b)) return -1;
    if (blue(a) > blue(b)) return 1;
    return 0;
  });

  // sort hue
  if (method == HUE) colors.sort(function (a, b) {
    //convert a and b from RGB to HSV
    var aHue = chroma(red(a), green(a), blue(a)).get('hsv.h');
    var bHue = chroma(red(b), green(b), blue(b)).get('hsv.h');

    if (aHue < bHue) return -1;
    if (aHue > bHue) return 1;
    return 0;
  });

  // sort saturation
  if (method == SATURATION) colors.sort(function (a, b) {
    //convert a and b from RGB to HSV
    var aSat = chroma(red(a), green(a), blue(a)).get('hsv.s');
    var bSat = chroma(red(b), green(b), blue(b)).get('hsv.s');

    if (aSat < bSat) return -1;
    if (aSat > bSat) return 1;
    return 0;
  });

  // sort brightness
  if (method == BRIGHTNESS) colors.sort(function (a, b) {
    //convert a and b from RGB to HSV
    var aBright = chroma(red(a), green(a), blue(a)).get('hsv.v');
    var bBright = chroma(red(b), green(b), blue(b)).get('hsv.v');

    if (aBright < bBright) return -1;
    if (aBright > bBright) return 1;
    return 0;
  });

  // sort grayscale
  if (method == GRAYSCALE) colors.sort(function (a, b) {
    var aGrey = (red(a) * 0.222 + green(a) * 0.707 + blue(a) * 0.071);
    var bGrey = (red(b) * 0.222 + green(b) * 0.707 + blue(b) * 0.071);

    if (aGrey < bGrey) return -1;
    if (aGrey > bGrey) return 1;
    return 0;
  });

  // sort alpha
  if (method == ALPHA) colors.sort(function (a, b) {
    if (alpha(a) < alpha(b)) return -1;
    if (alpha(a) > alpha(b)) return 1;
    return 0;
  });

  return colors;
};