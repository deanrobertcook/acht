const RULE = 90;
let cellCount;
let size;
let memory = [];
let maxGens;
let ruleSet;

let colorFrom; 
let colorTo; 
let gen;

function setup() {
  createCanvas(640, 360);
  
  const urlParams = new URLSearchParams(location.search);
  let rule = urlParams.has('rule') ? parseInt(urlParams.get('rule')) : RULE;
  ruleSet = getRuleSet(rule);

  cellCount = width;
  size = width / cellCount;
  gen = Array(cellCount).fill(0);

  // for (let i = 0; i < gen1.length; i++) {
  //   gen1[i] = round(random(1));
  // }

  gen[floor(cellCount / 2)] = 1;

  memory.push(gen);
  maxGens = ceil(height / size);
  
  colorFrom = color(19, 70, 17); 
  colorTo = color(232, 252, 207); 
  background(51);
  fill(255);
  noStroke();
}

function draw() {
  drawOnce();
}

function drawScroll() {
  if (frameCount % 5 == 0) {
    background(51);
    for (let y = 0; y < memory.length; y++) {
      let gen = memory[y];
      
      let n = map(gen.filter(v => v).length, 0, gen.length, 0, 1);
      let c1 = lerpColor(colorFrom, colorTo, n);
      let c2 = color(n, 100, 50);
      fill(c1);
      for (let x = 0; x < cellCount; x++) {
        if (gen[x]) {
          rect(x * size, y * size, size);
        }
      }
    }
    
    memory.push(nextGen(memory[memory.length - 1], ruleSet));
    if (memory.length == maxGens) {
      memory.shift();
    }
  } 
}

let genCount = 0;
function drawOnce() {
  if (genCount >= height) {
    return;
  }
  if (frameCount % 5 == 0) {
    for (let x = 0; x < cellCount; x++) {
      if (gen[x]) {
        rect(x, genCount, 1);
      }
    }

    gen = nextGen(gen, ruleSet);
    genCount++;
  }
}

function nextGen(generation, ruleSet) {
  let len = generation.length;
  let nextGen = Array(len).fill(0);
  for (let i = 0; i < len; i++) {
    let l = generation[(i - 1) % len];
    let m = generation[(i) % len];
    let r = generation[(i + 1) % len];
    let ruleIdx = (l << 2) | (m << 1) | r;
    nextGen[i] = ruleSet[ruleIdx];
  }
  return nextGen;
}

function getRuleSet(num) {
  const bits = (num).toString(2).split('').map(c => parseInt(c));
  while (bits.length < 8) {
    bits.unshift(0);
  }
  return bits.reverse();
}

function intFromArray(arr) {
  return arr.reduce((acc, val) => {
    return (acc << 1) | val;
 });
}