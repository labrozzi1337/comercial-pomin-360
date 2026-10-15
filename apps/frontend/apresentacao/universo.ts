import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { apps } from '../src/data';

// O ecossistema: o anel do logo P360 e as 13 aplicações como peças físicas, cada uma com o próprio ícone e nome.
export function iniciarUniverso(canvas: HTMLCanvasElement, aoEscolher: (id: string) => void, aoPassar: (id: string | null, x: number, y: number) => void) {
  let renderer: THREE.WebGLRenderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch { canvas.hidden = true; return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2)); renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  const cena = new THREE.Scene(), camera = new THREE.PerspectiveCamera(34, 1, .1, 100);
  cena.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), .04).texture;
  const sol = new THREE.DirectionalLight(0xffffff, 1.4); sol.position.set(4, 8, 6); cena.add(sol, new THREE.AmbientLight(0x9fd8ff, .35));

  // Anel do "0" com o degradê da marca (ciano → turquesa → verde), aberto embaixo à direita como no logo
  const arco = Math.PI * 2 * .9, anelGeo = new THREE.TorusGeometry(1.7, .26, 40, 220, arco);
  const pos = anelGeo.attributes.position, cores: number[] = [], c1 = new THREE.Color(0x00D9F5), c2 = new THREE.Color(0x00C9B4), c3 = new THREE.Color(0x00E3A4), tmp = new THREE.Color();
  for (let i = 0; i < pos.count; i++) { const f = (Math.atan2(pos.getY(i), pos.getX(i)) / (Math.PI * 2) + 1) % 1 / .9; tmp.copy(f < .5 ? c1 : c2).lerp(f < .5 ? c2 : c3, (f % .5) * 2); cores.push(tmp.r, tmp.g, tmp.b); }
  anelGeo.setAttribute('color', new THREE.Float32BufferAttribute(cores, 3));
  const anel = new THREE.Mesh(anelGeo, new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: .28, metalness: .15, clearcoat: .6 }));
  anel.rotation.z = -Math.PI * .28;
  const rabo = new THREE.Mesh(new THREE.ConeGeometry(.24, .7, 24), new THREE.MeshPhysicalMaterial({ color: 0x00E3A4, roughness: .28, clearcoat: .6 }));
  rabo.position.set(1.32, -1.32, 0); rabo.rotation.z = Math.PI * .78;
  const centro = new THREE.Group(); centro.add(anel, rabo); cena.add(centro);

  // Peças das aplicações
  const geo = new RoundedBoxGeometry(1.15, 1.15, .2, 4, .16), corpo = new THREE.MeshPhysicalMaterial({ color: 0xF5F8FB, roughness: .4, clearcoat: .4 });
  const pecas = apps.map((a, i) => {
    const g = new THREE.Group(), base = new THREE.Mesh(geo, corpo);
    const face = new THREE.Mesh(new THREE.PlaneGeometry(1.02, 1.02), new THREE.MeshBasicMaterial({ transparent: true }));
    face.position.z = .105; g.add(base, face);
    const nome = rotulo(a.name); nome.position.y = -.98; g.add(nome);
    desenharIcone(a.icon, a.color).then(t => { (face.material as THREE.MeshBasicMaterial).map = t; (face.material as THREE.MeshBasicMaterial).needsUpdate = true; });
    const orbita = i % 2, n = orbita ? 6 : 7, k = Math.floor(i / 2);
    g.userData = { id: a.id, r: orbita ? 5.3 : 3.4, fase: k / n * Math.PI * 2 + orbita * .45, vel: orbita ? -.045 : .06, s: 1 };
    base.userData.id = a.id; cena.add(g); return g;
  });
  const alvos = pecas.map(p => p.children[0]);

  const mouse = new THREE.Vector2(), alvo = new THREE.Vector2(), ray = new THREE.Raycaster(); let sobre: string | null = null, visivel = false;
  canvas.addEventListener('pointermove', e => {
    const r = canvas.getBoundingClientRect(); mouse.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); alvo.copy(mouse);
    ray.setFromCamera(mouse, camera); const hit = ray.intersectObjects(alvos)[0];
    sobre = hit ? hit.object.userData.id : null; canvas.style.cursor = sobre ? 'pointer' : ''; aoPassar(sobre, e.clientX, e.clientY);
  });
  canvas.addEventListener('pointerleave', () => { sobre = null; aoPassar(null, 0, 0); });
  canvas.addEventListener('click', () => { if (sobre) aoEscolher(sobre); });
  new IntersectionObserver(es => { visivel = es[0].isIntersecting; }).observe(canvas);

  // a câmera recua o quanto for preciso para a órbita inteira caber em qualquer largura
  function tamanho() { const w = canvas.clientWidth, h = canvas.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.position.set(0, 1.2, Math.max(w / h < 1.4 ? 19.5 : 16, 6.2 / (Math.tan(17 * Math.PI / 180) * w / h))); camera.lookAt(0, 0, 0); camera.updateProjectionMatrix(); }
  addEventListener('resize', tamanho); tamanho();
  const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches, relogio = new THREE.Timer(); let t = 0;
  (function loop() {
    requestAnimationFrame(loop); if (!visivel || document.hidden) return;
    relogio.update(); if (!calmo) t += Math.min(relogio.getDelta(), .05);
    centro.rotation.y = Math.sin(t * .4) * .35 + alvo.x * .25; centro.rotation.x = alvo.y * -.15;
    for (const p of pecas) {
      const d = p.userData, a = d.fase + t * d.vel;
      p.position.set(Math.cos(a) * d.r, Math.sin(a) * d.r * .82, Math.sin(a) * d.r * .32); // órbita quase de frente, como um relógio
      p.lookAt(camera.position); d.s += ((sobre === d.id ? 1.3 : 1) - d.s) * .15; p.scale.setScalar(d.s);
    }
    camera.position.x += (alvo.x * 1.2 - camera.position.x) * .04; camera.lookAt(0, 0, 0);
    renderer.render(cena, camera);
  })();
}

function rotulo(txt: string) {
  const c = document.createElement('canvas'), g = c.getContext('2d')!; c.width = 512; c.height = 96;
  g.font = '700 54px Montserrat, sans-serif'; g.fillStyle = '#EAF3FF'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, 256, 50);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true })); s.scale.set(1.9, .36, 1); return s;
}
function desenharIcone(svg: string, cor: string) {
  const src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" ').replace('stroke="currentColor"', `stroke="${cor}"`));
  return new Promise<THREE.Texture>(ok => {
    const img = new Image(); img.onload = () => {
      const c = document.createElement('canvas'); c.width = c.height = 512; const g = c.getContext('2d')!;
      g.fillStyle = cor + '1F'; g.beginPath(); g.roundRect(56, 56, 400, 400, 90); g.fill();
      g.drawImage(img, 136, 136, 240, 240); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; ok(t);
    }; img.src = src;
  });
}
