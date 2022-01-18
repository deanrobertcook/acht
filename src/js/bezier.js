import * as THREE from 'three';

addEventListener('load', (event) => {
  const root = document.getElementById('bezier');
  if (root) {
    main(root)
  }
});

function main(div) {

  const w = div.offsetWidth;
  const h = div.offsetHeight;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf8fafc);

  const fov = 75;
  const camera = new THREE.PerspectiveCamera(fov, w / h, 0.1, 1000);
  camera.position.z = 7;

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(w, h);
  div.appendChild(renderer.domElement);

  function addLight(x, y, z) {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(x, y, z);
    scene.add(light);
  }
  addLight(-1, 2, 4);
  addLight(1, -2, -4);

  const p0 = new THREE.Vector2(-7, 0);
  const p1 = new THREE.Vector2(7, 0);
  const cp = new THREE.Vector2(0, 5);

  const points = [];
  const MAX_POINTS = 10;

  const lines = [new THREE.BufferGeometry().setFromPoints([p0, cp])];

  const box = new THREE.BoxGeometry();
  console.log(box.attributes.position);

  for (let t = 0; t <= 1; t += (1 / MAX_POINTS)) {
    let x0 = lerp(p0.x, cp.x, t);
    let y0 = lerp(p0.y, cp.y, t);

    let x1 = lerp(cp.x, p1.x, t);
    let y1 = lerp(cp.y, p1.y, t);

    lines.push(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector2(x0, y0),
      new THREE.Vector2(x1, y1)
    ]));

    let x = lerp(x0, x1, t);
    let y = lerp(y0, y1, t);
    points.push(new THREE.Vector2(x, y));
  }

  const curve = new THREE.BufferGeometry().setFromPoints(points);
  console.log(curve.attributes.position);
  lines.push(curve);

  const material = new THREE.LineBasicMaterial({ color: 0x000000 });
  lines.forEach(l => {
    const line = new THREE.Line(l, material);
    scene.add(line);
  });

  function animate(time) {
    time *= 0.001 //convert to seconds
    resizeIfNecessary(div, renderer, camera);

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

function resizeIfNecessary(div, renderer, camera) {
  const w = div.offsetWidth;
  const h = div.offsetHeight;
  const canvas = renderer.domElement;
  if (w != canvas.clientWidth || h != canvas.clientHeight) {
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

