import * as THREE from 'three';
import { apps } from './data';

// Universo 3D de fundo. O scroll (motion.ts) só mexe em `estado`; o loop aqui lê e desenha.
// mix 0 = caos (partículas soltas, tons quentes do "antes"); mix 1 = ordem (o anel do "0" do logo P360).
export interface Estado { intro: number; mix: number; x: number; y: number; escala: number; visivel: number; interativo: boolean }
export interface Cena { estado: Estado; destacar(id: string | null): void; aoClicar(fn: (id: string) => void): void }

const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
const R = 3.2; // raio do anel

export function iniciarCena(canvas: HTMLCanvasElement): Cena {
  const estado: Estado = { intro: 0, mix: 1, x: 0, y: 0, escala: 1, visivel: 1, interativo: true };
  let renderer: THREE.WebGLRenderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' }); }
  catch { document.body.classList.add('sem-3d'); return { estado, destacar() {}, aoClicar() {} }; }

  const pequeno = innerWidth < 760;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, pequeno ? 1.5 : 1.75));
  const cena = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200);
  camera.position.set(0, 0, 17);
  const grupo = new THREE.Group();
  cena.add(grupo);

  // Estrelas ao fundo
  const nEst = pequeno ? 900 : 1800, est = new Float32Array(nEst * 3);
  for (let i = 0; i < nEst; i++) {
    const v = new THREE.Vector3().randomDirection().multiplyScalar(40 + Math.random() * 60);
    est.set([v.x, v.y, v.z], i * 3);
  }
  const gEst = new THREE.BufferGeometry(); gEst.setAttribute('position', new THREE.BufferAttribute(est, 3));
  const estrelas = new THREE.Points(gEst, new THREE.PointsMaterial({ color: 0xcfe6ff, size: 0.14, transparent: true, opacity: 0.7, depthWrite: false }));
  cena.add(estrelas);

  // Partículas: cada uma tem posição de ordem (anel + órbitas) e de caos (aglomerados soltos)
  const N = pequeno ? 2600 : 5200;
  const ordem = new Float32Array(N * 3), caos = new Float32Array(N * 3), rnd = new Float32Array(N), ang = new Float32Array(N);
  const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
  const centros = Array.from({ length: 9 }, () => [(Math.random() - 0.5) * 26, (Math.random() - 0.5) * 14, -6 + Math.random() * 8]);
  const gap0 = -1.02, gap1 = -0.5; // abertura do "0" embaixo à direita, onde nasce o rabinho do balão
  for (let i = 0; i < N; i++) {
    const r = Math.random();
    let x: number, y: number, z: number;
    if (r < 0.74) {        // anel com espessura
      let t = Math.random() * Math.PI * 2 - Math.PI;
      if (t > gap0 && t < gap1) t = t < (gap0 + gap1) / 2 ? gap0 - Math.random() * 0.06 : gap1 + Math.random() * 0.06;
      const rr = R + gauss() * 0.22, zz = gauss() * 0.22;
      x = Math.cos(t) * rr; y = Math.sin(t) * rr; z = zz;
    } else if (r < 0.8) {  // rabinho do balão
      const s = Math.random(), base = (gap0 + gap1) / 2;
      const bx = Math.cos(base) * R, by = Math.sin(base) * R;
      x = bx + s * 0.95 + gauss() * 0.12 * (1 - s); y = by - s * 0.75 + gauss() * 0.12 * (1 - s); z = gauss() * 0.1;
    } else {               // halo em disco fino (as órbitas)
      const t = Math.random() * Math.PI * 2, rr = 4.4 + Math.random() * 3.2;
      x = Math.cos(t) * rr; y = Math.sin(t) * rr * 0.9; z = gauss() * 0.35;
    }
    ordem.set([x, y, z], i * 3);
    ang[i] = THREE.MathUtils.clamp((x + R * 1.25) / (R * 2.5), 0, 1);
    rnd[i] = Math.random();
    const c = centros[i % centros.length];
    if (Math.random() < 0.72) caos.set([c[0] + gauss() * 2.2, c[1] + gauss() * 1.6, c[2] + gauss() * 1.6], i * 3);
    else caos.set([(Math.random() - 0.5) * 34, (Math.random() - 0.5) * 20, -10 + Math.random() * 14], i * 3);
  }
  const gPart = new THREE.BufferGeometry();
  gPart.setAttribute('position', new THREE.BufferAttribute(ordem, 3));
  gPart.setAttribute('aCaos', new THREE.BufferAttribute(caos, 3));
  gPart.setAttribute('aRand', new THREE.BufferAttribute(rnd, 1));
  gPart.setAttribute('aAng', new THREE.BufferAttribute(ang, 1));
  const uni = { uMix: { value: 0 }, uTime: { value: 0 }, uPix: { value: renderer.getPixelRatio() }, uSize: { value: pequeno ? 46 : 38 } };
  const matPart = new THREE.ShaderMaterial({
    uniforms: uni, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */`
      uniform float uMix, uTime, uPix, uSize;
      attribute vec3 aCaos; attribute float aRand; attribute float aAng;
      varying vec3 vCor; varying float vA;
      vec3 marca(float a){
        vec3 c1 = vec3(.92,.95,1.), c2 = vec3(0.,.85,.96), c3 = vec3(0.,.79,.71), c4 = vec3(0.,.89,.64);
        return mix(mix(c1, c2, smoothstep(0., .33, a)), mix(c3, c4, smoothstep(.66, 1., a)), smoothstep(.33, .66, a));
      }
      void main(){
        float t = clamp(uMix * 1.45 - aRand * .45, 0., 1.);
        t = t * t * (3. - 2. * t);
        vec3 deriva = vec3(sin(uTime * .3 + aRand * 20.), cos(uTime * .25 + aRand * 15.), sin(uTime * .2 + aRand * 9.)) * .45;
        vec3 p = mix(aCaos + deriva, position, t);
        p += normalize(position + .0001) * sin(uTime * 1.3 + aRand * 6.283) * .05 * t;
        vec4 mv = modelViewMatrix * vec4(p, 1.);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = uSize * (.55 + aRand * 1.1) * uPix / -mv.z;
        vec3 quente = mix(vec3(1., .63, .17), vec3(1., .42, .29), aRand);
        vCor = mix(quente, marca(aAng), t);
        vA = mix(.55 + .3 * sin(uTime * 2. + aRand * 30.), .9, t);
      }`,
    fragmentShader: /* glsl */`
      varying vec3 vCor; varying float vA;
      void main(){ float d = length(gl_PointCoord - .5); float a = smoothstep(.5, 0., d); gl_FragColor = vec4(vCor, a * a * vA); }`
  });
  grupo.add(new THREE.Points(gPart, matPart));

  // Traço fino do anel, com o mesmo degradê do logo (ciano à esquerda, verde à direita)
  const arco = Math.PI * 2 - (gap1 - gap0);
  const gAnel = new THREE.TorusGeometry(R, 0.035, 12, 320, arco);
  const matAnel = new THREE.ShaderMaterial({
    uniforms: { uOp: { value: 0 } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `varying float vX; void main(){ vX = position.x; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
    fragmentShader: `uniform float uOp; varying float vX; void main(){ float a = clamp((vX + 3.2) / 6.4, 0., 1.); gl_FragColor = vec4(mix(vec3(0.,.85,.96), vec3(0.,.89,.64), a), uOp); }`
  });
  const anel = new THREE.Mesh(gAnel, matAnel);
  anel.rotation.z = gap1; // o arco começa logo depois da abertura
  grupo.add(anel);

  // Brilho reaproveitado pelos nós e pelo centro
  const tex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const g = c.getContext('2d')!, rg = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    rg.addColorStop(0, 'rgba(255,255,255,1)'); rg.addColorStop(.25, 'rgba(255,255,255,.45)'); rg.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = rg; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c);
  })();
  const nucleo = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color: 0x00d9f5, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
  nucleo.scale.setScalar(9);
  grupo.add(nucleo);

  // As 13 aplicações em três órbitas inclinadas
  const orbitas = [{ r: 4.7, inc: 0.32, giro: 0.12 }, { r: 5.7, inc: -0.42, giro: -0.09 }, { r: 6.7, inc: 0.18, giro: 0.07 }];
  for (const o of orbitas) {
    const pts = new THREE.EllipseCurve(0, 0, o.r, o.r * 0.92).getPoints(160).map(p => new THREE.Vector3(p.x, p.y, 0));
    const linha = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x9fd8ff, transparent: true, opacity: 0 }));
    linha.rotation.x = o.inc; linha.userData.orbita = true;
    grupo.add(linha);
  }
  const geoNo = new THREE.SphereGeometry(0.15, 20, 20);
  const nos = apps.map((a, i) => {
    const cor = new THREE.Color(a.color);
    const m = new THREE.Mesh(geoNo, new THREE.MeshBasicMaterial({ color: cor, transparent: true }));
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color: cor, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    halo.scale.setScalar(1.3); m.add(halo);
    m.userData = { id: a.id, o: orbitas[i % 3], fase: (i / apps.length) * Math.PI * 2 + i * 0.7, alvo: 1, s: 1 };
    grupo.add(m); return m;
  });
  let destaque: string | null = null;

  // Mouse: paralaxe suave e clique nos nós
  const mouse = new THREE.Vector2(), alvoCam = new THREE.Vector2(), ray = new THREE.Raycaster();
  let sobre: THREE.Mesh | null = null, clicou: (id: string) => void = () => {};
  const tip = document.getElementById('node-tip');
  addEventListener('pointermove', e => {
    mouse.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    alvoCam.set(mouse.x, mouse.y);
    if (!estado.interativo || estado.mix * estado.intro < .8 || (e.target as Element).closest('a,button,input,textarea,label,dialog,.h-card')) { soltar(); return; }
    ray.setFromCamera(mouse, camera);
    const hit = ray.intersectObjects(nos, false)[0]?.object as THREE.Mesh | undefined;
    if (hit !== sobre) { soltar(); if (hit) { sobre = hit; document.body.classList.add('no-hover'); if (tip) { const a = apps.find(x => x.id === hit.userData.id)!; tip.textContent = `${a.name} · ${a.category}`; tip.classList.add('on'); } } }
    if (tip && sobre) tip.style.transform = `translate(${e.clientX + 18}px, ${e.clientY + 14}px)`;
  }, { passive: true });
  function soltar() { if (!sobre) return; sobre = null; document.body.classList.remove('no-hover'); tip?.classList.remove('on'); }
  addEventListener('click', e => { if (sobre && !(e.target as Element).closest('a,button,input,dialog')) clicou(sobre.userData.id); });

  function tamanho() {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    camera.position.z = w < 760 ? 24 : w < 1100 ? 19.5 : 17;
    camera.updateProjectionMatrix();
  }
  addEventListener('resize', tamanho); tamanho();

  const relogio = new THREE.Timer(); let t = 0;
  function quadro() {
    requestAnimationFrame(quadro);
    relogio.update(); const dt = Math.min(relogio.getDelta(), 0.05);
    canvas.style.opacity = String(estado.visivel);
    if (estado.visivel < 0.01 || document.hidden) return;
    if (!calmo) t += dt;
    const mix = estado.mix * estado.intro;
    uni.uTime.value = t; uni.uMix.value = mix;
    const ord = THREE.MathUtils.smoothstep(mix, 0.55, 1);
    matAnel.uniforms.uOp.value = ord * 0.85;
    nucleo.material.opacity = ord * 0.22;
    grupo.children.forEach(c => { if (c.userData.orbita) ((c as THREE.LineLoop).material as THREE.LineBasicMaterial).opacity = ord * 0.12; });
    for (const n of nos) {
      const d = n.userData, a = d.fase + t * d.o.giro;
      n.position.set(Math.cos(a) * d.o.r, Math.sin(a) * d.o.r * 0.92 * Math.cos(d.o.inc), Math.sin(a) * d.o.r * Math.sin(d.o.inc));
      d.alvo = (destaque ? (d.id === destaque ? 2.4 : 0.6) : 1) * (n === sobre ? 1.8 : 1) * ord;
      d.s += (d.alvo - d.s) * 0.12; n.scale.setScalar(Math.max(d.s, 0.0001));
    }
    camera.position.x += (alvoCam.x * 1.1 - camera.position.x) * 0.04;
    camera.position.y += (alvoCam.y * 0.7 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
    grupo.position.set(estado.x, estado.y, 0);
    grupo.scale.setScalar(estado.escala * (0.55 + 0.45 * estado.intro));
    grupo.rotation.set(-0.22 + Math.sin(t * 0.17) * 0.06, Math.sin(t * 0.21) * 0.22, Math.sin(t * 0.11) * 0.04);
    estrelas.rotation.y = t * 0.008;
    renderer.render(cena, camera);
  }
  quadro();

  return { estado, destacar(id) { destaque = id; }, aoClicar(fn) { clicou = fn; } };
}
