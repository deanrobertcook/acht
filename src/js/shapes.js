import * as THREE from 'three';

addEventListener('load', (event) => {
  const root = document.getElementById('shapes');
  if (root) {
    main(root)
  }
});

function main(div) {

  const w = div.offsetWidth;
  const h = div.offsetHeight;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf8fafc);

  const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
  camera.position.z = 10;

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

  const objects = [];
  const spread = 3;

  function addObject(x, y, obj) {
    obj.position.x = x * spread;
    obj.position.y = y * spread;

    scene.add(obj);
    objects.push(obj);
  }

  function addSolidGeometry(x, y, geometry) {
    const mesh = new THREE.Mesh(geometry, createMaterial());
    addObject(x, y, mesh);
  }

  function createMaterial() {
    const material = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
    });

    const hue = Math.random();
    const saturation = 1;
    const luminance = .5;
    material.color.setHSL(hue, saturation, luminance);

    return material;
  }

  const ROWS = 4;
  const COLS = 6;
  for (var i = 0; i < ROWS * COLS; i++) {
    const x = (i % COLS) - (COLS / 2) + 0.5;
    const y = (ROWS / 2) - Math.floor(i / COLS) % ROWS - 0.5;
    addSolidGeometry(x, y, new THREE.BoxGeometry());
  }

  const rates = objects.map(v => {
    const x = Math.floor(Math.random() * 5);
    const y = Math.floor(Math.random() * 5);
    return [x, y];
  });

  const RATE_ML = 0.01;
  function animate() {
    requestAnimationFrame(animate);

    objects.forEach((obj, idx) => {
      obj.rotation.x += RATE_ML * rates[idx][0];
      obj.rotation.y += RATE_ML * rates[idx][1];
    })
    renderer.render(scene, camera);
  }
  animate();
}
