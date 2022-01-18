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

  const ROWS = 4;
  const COLS = 6;
  for (var i = 0; i < ROWS * COLS; i++) {
    const x = (i % COLS) - (COLS / 2) + 0.5;
    const y = (ROWS / 2) - Math.floor(i / COLS) % ROWS - 0.5;
    addSolidGeometry(x, y, selectShape());
  }

  function selectShape() {
    switch (Math.floor(Math.random() * 5)) {
      case 0:
        return new THREE.BoxGeometry();
      case 1:
        return new THREE.ConeGeometry(0.5);
      case 2:
        return new THREE.CylinderGeometry(0.5, 0.5);
      case 3:
        return buildHeartGeometry();
      case 4:
        return new THREE.TetrahedronGeometry();
    }
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

  function addObject(x, y, obj) {
    obj.position.x = x * spread;
    obj.position.y = y * spread;

    scene.add(obj);
    objects.push(obj);
  }

  const rates = objects.map(v => {
    const x = Math.floor(Math.random() * 5);
    const y = Math.floor(Math.random() * 5);
    const z = Math.floor(Math.random() * 5);
    return [x, y, z];
  });

  const RATE_MULT = 0.5;
  function animate(time) {
    time *= 0.001 //convert to seconds

    const w = div.offsetWidth;
    const h = div.offsetHeight;
    
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    
    if (1 - time % 1 < 0.01) {
      console.log("second elapsed", w, h);
    }

    objects.forEach((obj, idx) => {
      obj.rotation.x = time * RATE_MULT * rates[idx][0];
      obj.rotation.y = time * RATE_MULT * rates[idx][1];
      obj.rotation.z = time * RATE_MULT * rates[idx][2];
    })
    renderer.render(scene, camera);

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

function buildHeartGeometry() {
  const shape = new THREE.Shape();
  const x = -2.5;
  const y = -5;
  shape.moveTo(x + 2.5, y + 2.5);
  shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
  shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
  shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
  shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
  shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
  shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

  const extrudeSettings = {
    steps: 2,  // ui: steps
    depth: 2,  // ui: depth
    bevelEnabled: true,  // ui: bevelEnabled
    bevelThickness: 1,  // ui: bevelThickness
    bevelSize: 1,  // ui: bevelSize
    bevelSegments: 2,  // ui: bevelSegments
  };

  const heart = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  
  heart.scale(0.0909, 0.105, 0.1);
  heart.rotateZ(Math.PI);
  return heart;
}