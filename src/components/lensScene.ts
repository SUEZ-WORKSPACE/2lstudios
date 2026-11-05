import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const BLADES = 9;
const IRIS_R = 1.04;
const IRIS_MIN = 0.035;
const IRIS_MAX = 0.7;

function ringLabel(text: string, color = "#ffffff") {
  const c = document.createElement("canvas");
  c.width = 4096;
  c.height = 128;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = color;
  ctx.textBaseline = "middle";
  ctx.font = "600 64px ui-monospace, Menlo, monospace";
  const w = ctx.measureText(text).width;
  const copies = Math.max(1, Math.floor(c.width / w));
  const step = c.width / copies;
  for (let i = 0; i < copies; i++) ctx.fillText(text, i * step + (step - w) / 2, 66);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function labelCylinder(radius: number, height: number, z: number, map: THREE.Texture) {
  const g = new THREE.CylinderGeometry(radius, radius, height, 128, 1, true);
  g.rotateX(Math.PI / 2);
  const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ map, transparent: true, depthWrite: false }));
  m.position.z = z;
  return m;
}

export function createLens(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.03);
  scene.environment = envRT.texture;

  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 60);
  camera.position.z = 13;

  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(-4, 5, 7);
  const rim = new THREE.DirectionalLight(0xffffff, 3.2);
  rim.position.set(6, -2, -5);
  scene.add(key, rim);

  const lens = new THREE.Group();
  scene.add(lens);

  const body = new THREE.MeshStandardMaterial({ color: 0x131112, metalness: 0.88, roughness: 0.36 });
  const satin = new THREE.MeshStandardMaterial({ color: 0x0a0909, metalness: 0.7, roughness: 0.55 });

  // Corpo: um único perfil rodado
  const profile = [
    [0.92, -2.62], [0.92, -2.36], [1.12, -2.32], [1.12, -2.02], [1.25, -1.97], [1.25, -1.02],
    [1.3, -0.97], [1.3, 0.08], [1.25, 0.13], [1.25, 0.42], [1.42, 0.52], [1.42, 1.46],
    [1.38, 1.5], [1.38, 1.62], [1.2, 1.66], [1.08, 1.22], [1.05, 0.72], [1.05, 0.3], [0, 0.3],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  const bodyGeo = new THREE.LatheGeometry(profile, 160);
  bodyGeo.rotateX(Math.PI / 2);
  const shell = new THREE.Mesh(bodyGeo, body);
  lens.add(shell);

  // Anel de foco com serrilha
  const focus = new THREE.Group();
  const ridgeGeo = new THREE.BoxGeometry(0.038, 0.05, 0.92);
  const RIDGES = 96;
  const ridges = new THREE.InstancedMesh(ridgeGeo, satin, RIDGES);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < RIDGES; i++) {
    const a = (i / RIDGES) * Math.PI * 2;
    dummy.position.set(Math.cos(a) * 1.305, Math.sin(a) * 1.305, -0.445);
    dummy.rotation.set(0, 0, a);
    dummy.updateMatrix();
    ridges.setMatrixAt(i, dummy.matrix);
  }
  focus.add(ridges);
  lens.add(focus);

  // Gravações no metal
  const textTop = ringLabel("2L STUDIO   35mm  1:1.4   ");
  const textScale = ringLabel("∞   10   5   3   2   1.5   1   0.7   m    ", "#d9d6d6");
  lens.add(labelCylinder(1.4235, 0.13, 1.02, textTop));
  lens.add(labelCylinder(1.2525, 0.11, -1.5, textScale));

  // O único vermelho do site além do REC
  const redRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.425, 0.011, 8, 180),
    new THREE.MeshStandardMaterial({ color: 0xe5352b, roughness: 0.4, metalness: 0.2, emissive: 0x3a0805 }),
  );
  redRing.position.z = 0.62;
  lens.add(redRing);

  // Elemento interno com revestimento
  const coatGeo = new THREE.SphereGeometry(1.5, 64, 24, 0, Math.PI * 2, 0, 0.72);
  coatGeo.rotateX(Math.PI / 2);
  const coat = new THREE.Mesh(
    coatGeo,
    new THREE.MeshPhysicalMaterial({
      color: 0x060606, metalness: 1, roughness: 0.06,
      iridescence: 0.75, iridescenceIOR: 1.35, iridescenceThicknessMinimum: 180, iridescenceThicknessMaximum: 420,
      envMapIntensity: 1.8,
    }),
  );
  coat.position.z = -0.85;
  lens.add(coat);

  // Diafragma: lâminas reconstruídas conforme abre
  const irisMat = new THREE.MeshStandardMaterial({ color: 0x070606, metalness: 0.95, roughness: 0.34, envMapIntensity: 0.55, side: THREE.DoubleSide });
  const iris = new THREE.Mesh(new THREE.BufferGeometry(), irisMat);
  iris.position.z = 0.74;
  lens.add(iris);
  const seamPositions = new Float32Array(BLADES * 6);
  const seamGeo = new THREE.BufferGeometry();
  seamGeo.setAttribute("position", new THREE.BufferAttribute(seamPositions, 3));
  const seams = new THREE.LineSegments(seamGeo, new THREE.LineBasicMaterial({ color: 0x4b4647 }));
  seams.position.z = 0.745;
  lens.add(seams);

  let lastD = -1;
  function setIris(d: number) {
    if (Math.abs(d - lastD) < 0.0015) return;
    lastD = d;
    const rot = 0.5 + (1 - d) * 1.5;
    const rv = d / Math.cos(Math.PI / BLADES);
    const verts: THREE.Vector2[] = [];
    for (let i = 0; i < BLADES; i++) {
      const a = rot + (i / BLADES) * Math.PI * 2;
      verts.push(new THREE.Vector2(Math.cos(a) * rv, Math.sin(a) * rv));
    }
    const shape = new THREE.Shape();
    shape.absarc(0, 0, IRIS_R, 0, Math.PI * 2, false);
    shape.holes.push(new THREE.Path([...verts].reverse()));
    iris.geometry.dispose();
    iris.geometry = new THREE.ShapeGeometry(shape, 72);

    for (let i = 0; i < BLADES; i++) {
      const v = verts[i];
      const dir = v.clone().sub(verts[(i + 1) % BLADES]).normalize();
      const b = v.dot(dir);
      const t = -b + Math.sqrt(Math.max(0, b * b - (v.lengthSq() - IRIS_R * IRIS_R)));
      seamPositions.set([v.x, v.y, 0, v.x + dir.x * t, v.y + dir.y * t, 0], i * 6);
    }
    seamGeo.attributes.position.needsUpdate = true;
  }

  // Vidro frontal
  const domeGeo = new THREE.SphereGeometry(1.85, 64, 24, 0, Math.PI * 2, 0, 0.62);
  domeGeo.rotateX(Math.PI / 2);
  const dome = new THREE.Mesh(
    domeGeo,
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff, transparent: true, opacity: 0.14, roughness: 0.02, metalness: 0,
      clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 2.6, depthWrite: false,
    }),
  );
  dome.position.z = -0.46;
  lens.add(dome);

  // Estado
  const state = { open: 0, progress: 0 };
  const pointer = { x: 0, y: 0, cx: 0, cy: 0 };
  let portrait = false;
  let visible = true;
  let raf = 0;

  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    portrait = w / h < 1;
    camera.position.z = portrait ? 17 : 13;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  const io = new IntersectionObserver(([e]) => {
    const was = visible;
    visible = e.isIntersecting;
    if (visible && !was) raf = requestAnimationFrame(tick);
  });
  io.observe(canvas);

  const t0 = performance.now();
  function tick() {
    if (!visible) return;
    raf = requestAnimationFrame(tick);
    const t = (performance.now() - t0) / 1000;
    pointer.cx += (pointer.x - pointer.cx) * 0.05;
    pointer.cy += (pointer.y - pointer.cy) * 0.05;

    const p = state.progress;
    const e = p * p * (3 - 2 * p);
    const intro = 1 - state.open;
    const baseY = (portrait ? -0.42 : -0.66) * (1 - e) - intro * 0.9;
    const baseX = 0.2 * (1 - e) + intro * 0.25;

    lens.rotation.y = baseY + pointer.cx * 0.26 * (1 - e) + Math.sin(t * 0.4) * 0.018;
    lens.rotation.x = baseX + pointer.cy * 0.18 * (1 - e) + Math.cos(t * 0.33) * 0.012;
    lens.position.x = (portrait ? 0 : 2.3) * (1 - e);
    lens.position.y = (portrait ? 1.3 : -0.1) * (1 - e);
    lens.position.z = e * 5.4 + intro * -3;

    focus.rotation.z = e * 1.4;
    setIris(IRIS_MIN + (IRIS_MAX - IRIS_MIN) * state.open * (1 - e));

    renderer.render(scene, camera);
  }
  raf = requestAnimationFrame(tick);

  return {
    state,
    setPointer(x: number, y: number) {
      pointer.x = x;
      pointer.y = y;
    },
    dispose() {
      cancelAnimationFrame(raf);
      visible = false;
      ro.disconnect();
      io.disconnect();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
        const mat = m.material as THREE.Material | undefined;
        mat?.dispose?.();
      });
      textTop.dispose();
      textScale.dispose();
      envRT.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
