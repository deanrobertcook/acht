function logSecond(...msg) {
  frameCount % 60 == 0 && console.log(...msg);
}