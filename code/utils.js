function logSecond(...msg) {
  if (frameCount % 60 == 0 || frameCount == 1) {
    console.log(...msg);
  }
}