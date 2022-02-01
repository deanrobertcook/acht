const LEN_SCALE = 0.64;
const ANGLE_DELTA = (Math.PI / 16);

let fr;
let colorFrom; 
let colorTo;
let startLength;
// function setup() {
//   createCanvas(640, 360);
  // colorFrom = color(85, 139, 110); 
  // colorTo = color(160, 155, 231);   
  // fr = createP('');
  // startLength = height * 1/3;
  // background(51);
  // scale(1, -1);
  // drawBranch(width/2, -height, 0, startLength);
// }

function draw() {
  // background(51);
  // scale(1, -1);
  // drawBranch(width/2, -height, 0, startLength);
  // showFrameRate(fr);
}

function drawBranch(startX, startY, angle, length) {

  if (length <= 1) {
    return;
  }
  push();
  const cNorm = map(length, startLength, 1, 0, 1);
  const c = lerpColor(colorFrom, colorTo, cNorm);
  stroke(c);
  const wNorm = map(length, 1, startLength, 1, 4);
  strokeWeight(wNorm);
  translate(startX, startY);
  rotate(angle);
  line(0, 0, 0, length);
  drawBranch(0, length, angle + ANGLE_DELTA, length * LEN_SCALE);
  drawBranch(0, length, angle - ANGLE_DELTA, length * LEN_SCALE);
  pop();

}

/**
 * L-SYSTEM TREE
 */

const axiom = 'F';
let sentence = axiom;
let length = 5;
// const rules = [
//   ['F', 'FF+[+F-F-F]-[-F+F+F]'],
//   // ['B', 'A']
// ];
const rules = [
  ['F', 'F+G'],
  ['G', 'F-G'],
  // ['B', 'A']
];
const ANGLE = Math.PI / 2;

function setup() {
  createCanvas(640, 360);
  turtle(sentence);
  var button = createButton('generate');
  button.mousePressed(generate);
}

function generate() {
  sentence = lSystem(sentence, rules);
  turtle(sentence);
}


function turtle(sentence) {
  background(51);
  stroke(255);
  resetMatrix();
  translate(2* width / 3, height / 3);
  for (let i = 0; i < sentence.length; i++) {
    switch (sentence.charAt(i)) {
      case 'F':
        line(0, 0, 0, -length);
        translate(0, -length);
        break;
      case 'G':
        line(0, 0, 0, -length);
        translate(0, -length);
        break;
      case '+':
        rotate(ANGLE);
        break;
      case '-':
        rotate(-ANGLE);
        break;
      case '[':
        push();
        break;
      case ']':
        pop();
        break;
    }
  }
  // length = length / 2;
}

function lSystem(sentence, rules) {
  let nextSentence = '';
  for (let i = 0; i < sentence.length; i++) {
    const c = sentence.charAt(i);
    const r = rules.find(r => r[0] == c);
    nextSentence += r ? r[1] : c;
  }
  return nextSentence;
}
