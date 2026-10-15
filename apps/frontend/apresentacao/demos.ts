import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Maquetes 3D de cada aplicação: o mesmo palco isométrico, uma cena diferente por produto.
// mix 0 = antes (o problema acontecendo), mix 1 = depois (a aplicação corrigindo). t = tempo, para o que fica em movimento.
const C = { piso: 0xF5F8FB, navy: 0x0C2438, noite: 0x071827, branco: 0xffffff, ice: 0xDCE7F2, azul: 0x00B8D4, turq: 0x00A99A, verde: 0x00C98F, coral: 0xFF6B4A, ambar: 0xFFA12B, cinza: 0x9FB6CE, papel: 0xFFFDF7, amarelo: 0xFFD66B, rosa: 0xFF9EC4 };
const sm = (x: number) => x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x);
const faixa = (m: number, a: number, b: number) => sm((m - a) / (b - a));
const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
function mostra(o: THREE.Object3D, m: number) {
  if (!o.userData.base) o.userData.base = o.scale.clone();
  o.visible = m > .01; o.scale.copy(o.userData.base).multiplyScalar(Math.max(m, .001));
}

const mats = new Map<number, THREE.MeshStandardMaterial>();
const mat = (cor: number) => { let m = mats.get(cor); if (!m) { m = new THREE.MeshStandardMaterial({ color: cor, roughness: .62, metalness: .04 }); mats.set(cor, m); } return m; };

export class Kit {
  g = new THREE.Group(); antes: THREE.Object3D[] = []; depois: THREE.Object3D[] = [];
  private pos<T extends THREE.Object3D>(o: T, x = 0, y = 0, z = 0, pai: THREE.Object3D = this.g) { o.position.set(x, y, z); o.traverse(c => { c.castShadow = true; c.receiveShadow = true; }); pai.add(o); return o; }
  caixa(w: number, h: number, d: number, cor: number, x = 0, y = h / 2, z = 0, r = Math.min(.06, w / 4, h / 4, d / 4)) { return this.pos(new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 2, r), mat(cor)), x, y, z); }
  cil(r: number, h: number, cor: number, x = 0, y = h / 2, z = 0, arco = Math.PI * 2) { return this.pos(new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 40, 1, false, 0, arco), mat(cor)), x, y, z); }
  esfera(r: number, cor: number, x = 0, y = r, z = 0) { return this.pos(new THREE.Mesh(new THREE.SphereGeometry(r, 28, 20), mat(cor)), x, y, z); }
  anel(r: number, cor: number, x = 0, y = .05, z = 0, tubo = .05, arco = Math.PI * 2) { const m = this.pos(new THREE.Mesh(new THREE.TorusGeometry(r, tubo, 12, 64, arco), mat(cor)), x, y, z); m.rotation.x = -Math.PI / 2; return m; }
  pessoa(cor: number, x = 0, z = 0) {
    const p = new THREE.Group();
    const corpo = new THREE.Mesh(new THREE.CapsuleGeometry(.2, .42, 6, 16), mat(cor)); corpo.position.y = .42;
    const cab = new THREE.Mesh(new THREE.SphereGeometry(.17, 20, 16), mat(0xF1C9A5)); cab.position.y = .98;
    p.add(corpo, cab); return this.pos(p, x, 0, z);
  }
  tubo(pts: THREE.Vector3[], cor: number, r = .035) { return this.pos(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 48, r, 8), mat(cor))); }
  arco(a: THREE.Vector3, b: THREE.Vector3, h: number, cor: number, r = .035) { const m = a.clone().lerp(b, .5); m.y += h; return this.tubo([a, m, b], cor, r); }
  // Etiqueta sempre legível; tipo decide se aparece no antes, no depois ou sempre
  rotulo(txt: string, x: number, y: number, z: number, tipo: 'antes' | 'depois' | 'neutro' = 'neutro') {
    const fundo = tipo === 'antes' ? '#FFE6E0' : tipo === 'depois' ? '#DDF7EE' : '#FFFFFF', tinta = tipo === 'antes' ? '#B4361C' : tipo === 'depois' ? '#04664C' : '#0C2438';
    const c = document.createElement('canvas'), g = c.getContext('2d')!, f = 44;
    g.font = `600 ${f}px Montserrat, sans-serif`;
    const w = Math.ceil(g.measureText(txt).width) + 56, h = f + 34; c.width = w; c.height = h;
    g.font = `600 ${f}px Montserrat, sans-serif`;
    g.fillStyle = fundo; g.strokeStyle = 'rgba(12,36,56,.18)'; g.lineWidth = 3;
    g.beginPath(); g.roundRect(2, 2, w - 4, h - 4, 14); g.fill(); g.stroke();
    g.fillStyle = tinta; g.textBaseline = 'middle'; g.fillText(txt, 28, h / 2 + 2);
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true }));
    s.renderOrder = 10; s.scale.set(w / 230, h / 230, 1); s.position.set(x, y, z); this.g.add(s);
    if (tipo === 'antes') this.antes.push(s); if (tipo === 'depois') this.depois.push(s);
    return s;
  }
  obj<T extends THREE.Object3D>(o: T, x = 0, y = 0, z = 0) { return this.pos(o, x, y, z); }
  so<T extends THREE.Object3D>(quando: 'antes' | 'depois', o: T) { (quando === 'antes' ? this.antes : this.depois).push(o); return o; }
  grupo(x = 0, y = 0, z = 0) { const gr = new THREE.Group(); gr.position.set(x, y, z); this.g.add(gr); return gr; }
}

type Cena = (k: Kit) => (t: number, mix: number) => void;
const rnd = (s: number) => { const x = Math.sin(s * 127.1) * 43758.5453; return x - Math.floor(x); }; // aleatório estável

export const cenas: Record<string, Cena> = {
  // PominAI: IA genérica e arquivos parados → assistente com a base da empresa e acesso controlado
  ai: k => {
    const pilar = k.cil(.6, 1.4, C.azul, 0, .7, 0), topo = k.esfera(.38, C.branco, 0, 1.75, 0);
    k.so('depois', pilar); k.so('depois', topo);
    const arm = k.caixa(1.3, 1.6, .9, C.cinza, -3.4, .8, -2.2); k.rotulo('Arquivos parados', -3.4, 2.1, -2.2, 'antes');
    const docs = Array.from({ length: 8 }, (_, i) => k.caixa(.55, .05, .72, C.papel, 0, 0, 0));
    const pessoas = [[-3.6, 1.2], [-2.4, 3], [2.4, 3], [3.7, 1], [3.4, -2.4]].map(([x, z], i) => k.pessoa(i < 3 ? C.navy : C.cinza, x, z));
    const cubos = pessoas.map(p => k.so('antes', k.caixa(.42, .42, .42, C.cinza, p.position.x, 1.55, p.position.z)));
    k.rotulo('Cada um com uma IA genérica', 0, 2.6, 3.2, 'antes');
    const linhas = pessoas.slice(0, 3).map(p => k.so('depois', k.arco(V(p.position.x, 1.1, p.position.z), V(0, 1.2, 0), .9, C.turq)));
    k.so('depois', k.anel(2.1, C.verde, 0, .03, 0, .04));
    k.rotulo('Assistente com a base da empresa', 0, 2.75, 0, 'depois'); k.rotulo('Acesso por área', 2.2, .5, 1.6, 'depois');
    void arm; void cubos; void linhas;
    return (t, m) => {
      docs.forEach((d, i) => {
        const a = i / docs.length * Math.PI * 2 + t * .35, antes = V(-3.4 + (i % 2) * .05, .25 + i * .17, -2.2), depois = V(Math.cos(a) * 1.25, 1.05 + Math.sin(t * 1.4 + i) * .08, Math.sin(a) * 1.25);
        d.position.lerpVectors(antes, depois, faixa(m, .2 + i * .03, .75 + i * .03)); d.rotation.y = m * a;
      });
      cubos.forEach((c, i) => { c.rotation.y = t * .6 + i; c.position.y = 1.55 + Math.sin(t * 2 + i) * .06; });
    };
  },
  // Pomiro: post-its espalhados → mapa mental montado no quadro
  pomiro: k => {
    const quadro = k.caixa(7, 3.3, .14, C.branco, 0, 1.75, -2.6); k.so('depois', quadro);
    const cores = [C.amarelo, C.rosa, C.amarelo, C.ice];
    const notas = Array.from({ length: 13 }, (_, i) => k.caixa(.62, .62, .05, i ? cores[i % 4] : C.azul, 0, 0, 0));
    const alvo = [V(-2.6, 1.75, -2.5)]; [2.75, 1.75, .75].forEach(y => { alvo.push(V(-.9, y, -2.5)); [.6, 1.6, 2.6].forEach(x => alvo.push(V(x, y, -2.5))); });
    const pai = (j: number) => (j - 1) % 4 === 0 ? 0 : j - 1;
    const ramos = alvo.slice(1).map((a, i) => k.so('depois', k.tubo([alvo[pai(i + 1)].clone().setZ(-2.55), a.clone().setZ(-2.55)], C.cinza, .025)));
    k.rotulo('Foto do quadro branco', -2.6, 1.3, 1.8, 'antes'); k.rotulo('Post-it perdido', 2.4, 1, 1.4, 'antes');
    k.rotulo('Rascunho do board montado pela IA', 0, 3.75, -2.4, 'depois');
    void ramos;
    return (t, m) => notas.forEach((n, i) => {
      const chao = V((rnd(i) - .5) * 8, .04 + rnd(i + 9) * .08, (rnd(i + 3) - .5) * 5 + .8), mm = faixa(m, .1 + i * .02, .7 + i * .02);
      n.position.lerpVectors(chao, alvo[i], mm);
      n.rotation.set((1 - mm) * (-Math.PI / 2), (1 - mm) * rnd(i) * 3, (1 - mm) * Math.sin(t + i) * .1);
    });
  },
  // PominMKT: a arte rodando entre três ferramentas → um fluxo só, do briefing ao resultado
  mkt: k => {
    const ilhas = [[-3, -1.6, 'Arte'], [2.8, -1.8, 'Aprovação por print'], [0, 2.2, 'Agendamento']] as const;
    ilhas.forEach(([x, z, n]) => { k.so('antes', k.cil(.9, .25, C.cinza, x, .12, z)); k.rotulo(n, x, 1, z, 'antes'); });
    const esteira = k.so('depois', k.caixa(8.4, .22, 1.2, C.navy, 0, .11, 0));
    const est = ['Criar com IA', 'Aprovar', 'Publicar', 'Resultado'];
    est.forEach((n, i) => { const x = -3.15 + i * 2.1; k.so('depois', k.caixa(.18, 1.2, .18, C.azul, x, .6, -.75)); k.rotulo(n, x, 1.55, -.75, 'depois'); });
    const barras = [0, 1, 2].map(i => k.caixa(.3, 1, .3, C.verde, 2.9 + i * .38, .5, 1.3));
    const pecas = Array.from({ length: 4 }, (_, i) => k.caixa(.8, .06, 1, [C.rosa, C.azul, C.ambar, C.verde][i]));
    const selo = k.so('depois', k.cil(.22, .06, C.verde, -1.05, .36, 0));
    return (t, m) => {
      pecas.forEach((p, i) => {
        const u = (t * .16 + i / 4) % 1, a = ilhas[Math.floor(u * 3)], b = ilhas[(Math.floor(u * 3) + 1) % 3], f = (u * 3) % 1;
        const antes = V(a[0] + (b[0] - a[0]) * f, .45 + Math.sin(f * Math.PI) * 1.4, a[1] + (b[1] - a[1]) * f);
        const depois = V(-4 + u * 8, .3, 0);
        p.position.lerpVectors(antes, depois, faixa(m, .3, .8)); p.rotation.y = (1 - m) * t * 2;
      });
      barras.forEach((b, i) => { b.scale.y = Math.max(.001, m * (.4 + .6 * (.5 + .5 * Math.sin(t * 1.3 + i)))); b.position.y = b.scale.y / 2; });
      selo.rotation.y = t * 2; void esteira;
    };
  },
  // PominPRD: requisito espalhado em conversas → PRD organizado indo para o PominDev
  prd: k => {
    [[-3, -1.5, 'Conversa'], [2.9, -1.7, 'Reunião'], [-2.6, 2, 'Documento solto']].forEach(([x, z, n]) => { k.so('antes', k.esfera(.45, C.cinza, x as number, .45, z as number)); k.rotulo(n as string, x as number, 1.3, z as number, 'antes'); });
    k.so('depois', k.caixa(8, .08, .5, C.cinza, 0, .04, 0));
    const portal = k.so('depois', k.grupo(3.6, 0, 0));
    [-.75, .75].forEach(z => portal.add(k.caixa(.2, 2, .2, C.azul, 0, 1, z))); portal.add(k.caixa(.2, .2, 1.7, C.azul, 0, 2, 0));
    k.rotulo('PominDev', 3.6, 2.6, 0, 'depois'); k.rotulo('PRD gerado e revisado', -.6, 2.2, 0, 'depois');
    const folhas = Array.from({ length: 9 }, (_, i) => k.caixa(.4 + rnd(i) * .6, .07, .5 + rnd(i + 2) * .4, C.papel));
    return (t, m) => {
      const ida = (t * .12) % 1, x = -1.2 + faixa(ida, .55, .95) * 4.6;
      folhas.forEach((f, i) => {
        const solto = V((rnd(i + 5) - .5) * 7, .6 + Math.sin(t * 1.2 + i) * .25 + rnd(i) * .8, (rnd(i + 7) - .5) * 4.4);
        const pilha = V(m > .95 ? x : -1.2, .12 + i * .08, 0), mm = faixa(m, .1 + i * .03, .7 + i * .03);
        f.position.lerpVectors(solto, pilha, mm); f.scale.set(1 + mm * (1.1 / (.4 + rnd(i) * .6) - 1), 1, 1 + mm * (1.3 / (.5 + rnd(i + 2) * .4) - 1));
        f.rotation.set((1 - mm) * rnd(i) * 1.2, (1 - mm) * t * .4, 0);
      });
    };
  },
  // PominReport: cada gestor manda de um jeito → todos no mesmo formato, com comparação de semanas
  report: k => {
    const mesa = k.caixa(2.4, .7, 1.2, C.navy, 0, .35, -2.2), dir = k.pessoa(C.azul, 0, -3.2);
    const mesas = [-3.6, -2.2, -.8, .8, 2.2, 3.6].map((x, i) => { k.caixa(.9, .5, .6, C.ice, x, .25, 2 - Math.abs(x) * .25); return k.pessoa(C.navy, x, 2.7 - Math.abs(x) * .25); });
    const geos = [new THREE.SphereGeometry(.2, 16, 12), new THREE.ConeGeometry(.22, .4, 16), new RoundedBoxGeometry(.4, .25, .3, 2, .04)];
    const cartao = new RoundedBoxGeometry(.5, .05, .36, 2, .02);
    const envios = mesas.map((p, i) => k.obj(new THREE.Mesh(geos[i % 3], mat([C.coral, C.ambar, C.rosa][i % 3]))));
    const pilha = Array.from({ length: 6 }, (_, i) => k.so('depois', k.caixa(.5, .05, .36, C.branco, -.6, .73 + i * .06, -2.1)));
    const graf = [0, 1, 2, 3].map(i => k.caixa(.3, 1, .3, i === 3 ? C.verde : C.azul, .3 + i * .42, .7, -2.25));
    k.rotulo('Planilha, slide e e-mail', 0, 2.3, -1.2, 'antes'); k.rotulo('Mesmo formato, semana a semana', 0, 2.5, -2.2, 'depois');
    void dir; void mesa;
    return (t, m) => {
      envios.forEach((e, i) => {
        const u = (t * .3 + i / 6) % 1, a = mesas[i].position, b = V(-.6, .9, -2.1);
        e.position.set(a.x + (b.x - a.x) * u, .9 + Math.sin(u * Math.PI) * 1.6, a.z + (b.z - a.z) * u);
        const cart = m > .5; e.geometry = cart ? cartao : geos[i % 3]; e.material = mat(cart ? C.branco : [C.coral, C.ambar, C.rosa][i % 3]);
        e.rotation.set(cart ? 0 : t * 2, cart ? 0 : t, 0);
      });
      graf.forEach((g, i) => { g.scale.y = Math.max(.001, m * (.5 + i * .25)); g.position.y = .7 + g.scale.y / 2; });
      void pilha;
    };
  },
  // PominBI: exportação manual para um gráfico velho → fontes ligadas e gráficos sugeridos
  bi: k => {
    [0, .45, .9].forEach(y => k.cil(.7, .38, C.navy, -3.4, y + .19, -1));
    k.rotulo('Banco relacional', -3.4, 1.9, -1); k.caixa(.9, .6, .9, C.ice, -3.4, .3, 1.8); k.rotulo('API REST', -3.4, 1.1, 1.8);
    const velho = [0, 1, 2].map(i => k.so('antes', k.caixa(.35, .35 + i * .12, .35, C.cinza, 2.4 + i * .5, (.35 + i * .12) / 2, 0)));
    k.rotulo('Exportação manual', 0, 1.9, 1.3, 'antes');
    const homem = k.so('antes', k.pessoa(C.navy)), caixa = k.so('antes', k.caixa(.4, .3, .4, C.papel, 0, 1.25, 0));
    const hub = k.so('depois', k.caixa(1, .8, 1, C.azul, -.6, .4, .3)); k.rotulo('Lê a estrutura dos dados', -.6, 1.6, .3, 'depois');
    const canos = [k.tubo([V(-2.7, .5, -1), V(-1.6, .5, -.6), V(-1.1, .5, .3)], C.cinza, .06), k.tubo([V(-2.9, .3, 1.8), V(-1.8, .3, 1.2), V(-1.1, .3, .4)], C.cinza, .06), k.tubo([V(-.1, .4, .3), V(1.5, .4, -1.4), V(2.3, .4, -1.6)], C.cinza, .06), k.tubo([V(-.1, .4, .4), V(1.5, .4, 1.4), V(2.3, .4, 1.6)], C.cinza, .06)].map(c => k.so('depois', c));
    const barras = [0, 1, 2, 3].map(i => k.caixa(.32, 1, .32, C.azul, 2.4 + i * .42, .5, -1.6));
    k.so('depois', k.cil(.75, .2, C.turq, 3, .1, 1.7, Math.PI * 1.3)); k.so('depois', k.cil(.75, .16, C.ice, 3, .08, 1.7));
    k.rotulo('Gráficos sugeridos', 3, 2.3, 0, 'depois');
    const gotas = Array.from({ length: 8 }, () => k.so('depois', k.esfera(.08, C.verde)));
    const curvas = [[V(-2.7, .5, -1), V(-1.6, .5, -.6), V(-1.1, .5, .3)], [V(-.1, .4, .3), V(1.5, .4, -1.4), V(2.3, .4, -1.6)], [V(-2.9, .3, 1.8), V(-1.8, .3, 1.2), V(-1.1, .3, .4)], [V(-.1, .4, .4), V(1.5, .4, 1.4), V(2.3, .4, 1.6)]].map(p => new THREE.CatmullRomCurve3(p));
    void velho; void hub; void canos;
    return (t, m) => {
      const u = (Math.sin(t * .9) + 1) / 2; homem.position.set(-2.6 + u * 4.4, 0, .9); caixa.position.set(homem.position.x, 1.25, .9);
      gotas.forEach((g, i) => g.position.copy(curvas[i % 4].getPoint((t * .45 + i * .13) % 1)));
      barras.forEach((b, i) => { b.scale.y = Math.max(.001, m * (.6 + i * .35)); b.position.y = b.scale.y / 2; });
    };
  },
  // PominGoverna: risco sem plano e pastas soltas → riscos acompanhados, com plano e histórico
  governa: k => {
    const pastas = Array.from({ length: 10 }, (_, i) => k.caixa(.18, .9, .7, [C.ambar, C.azul, C.ice][i % 3]));
    const estante = k.so('depois', k.caixa(3.4, .12, 1, C.navy, -1.8, 1.05, -2.2)); k.so('depois', k.caixa(3.4, .12, 1, C.navy, -1.8, .06, -2.2));
    const riscos = [0, 1, 2, 3].map(() => k.esfera(.3, C.coral));
    const planos = riscos.map(() => k.so('depois', k.caixa(.5, .06, .36, C.branco)));
    k.so('depois', k.caixa(5.6, .06, .14, C.cinza, .8, .03, 1.7)); [0, 1, 2, 3].forEach(i => k.so('depois', k.cil(.1, .2, C.azul, -1.4 + i * 1.5, .1, 1.7)));
    const auditor = k.pessoa(C.navy, 3.6, -1.8); k.rotulo('E o plano daquele risco?', 3.4, 1.7, -1.8, 'antes');
    k.rotulo('Risco sem plano de ação', -1, 2.6, .6, 'antes'); k.rotulo('Política, risco e plano com histórico', 0, 2.6, -1, 'depois');
    void estante; void auditor;
    return (t, m) => {
      pastas.forEach((p, i) => {
        const solta = V((rnd(i) - .5) * 7, .08, (rnd(i + 4) - .5) * 4), arrumada = V(-3.2 + i * .3, .58, -2.2), mm = faixa(m, .05 + i * .03, .6 + i * .03);
        p.position.lerpVectors(solta, arrumada, mm); p.rotation.set((1 - mm) * Math.PI / 2, (1 - mm) * rnd(i) * 3, 0);
      });
      riscos.forEach((r, i) => {
        const flut = V(-2 + i * 1.2 + Math.sin(t + i) * .2, 1.4 + Math.sin(t * 1.3 + i) * .25, .4 + Math.cos(t + i) * .3), trilho = V(-1.4 + i * 1.5, .5, 1.7), mm = faixa(m, .3 + i * .1, .7 + i * .08);
        r.position.lerpVectors(flut, trilho, mm); r.material = mat(mm > .9 ? C.verde : mm > .4 ? C.ambar : C.coral);
        planos[i].position.set(trilho.x, .95, trilho.z); planos[i].rotation.y = .3;
      });
    };
  },
  // Reports CFO: todas as áreas na meta e o resultado no vermelho → a causa ligada aos donos, com plano
  cfo: k => {
    const areas = Array.from({ length: 8 }, (_, i) => { const a = Math.PI * (.15 + i * .1), x = Math.cos(a) * 3.6, z = -Math.sin(a) * 2.6 + 1.2; const h = .8 + rnd(i) * .9; k.caixa(.5, h, .5, C.ice, x, h / 2, z); k.caixa(.52, .1, .52, C.verde, x, h + .05, z); return V(x, h, z); });
    const res = k.caixa(1, 1, 1, C.coral, 0, .5, 1.6);
    k.rotulo('Todas as áreas na meta', 0, 3, -1.5, 'antes'); k.rotulo('Resultado abaixo do previsto', 0, 1.6, 2.8, 'antes');
    const causa = [1, 4, 6].map(i => k.so('depois', k.arco(areas[i].clone(), V(0, 1, 1.6), 1.2, C.ambar, .04)));
    const donos = [1, 4, 6].map(i => k.so('depois', k.pessoa(C.navy, areas[i].x * 1.18, areas[i].z - .55)));
    const planos = [1, 4, 6].map(i => k.so('depois', k.caixa(.55, .06, .4, C.branco, areas[i].x * 1.18 + .5, .9, areas[i].z - .55)));
    k.rotulo('A causa estava entre três relatórios', 0, 3.3, -1.2, 'depois'); k.rotulo('Cada desvio com dono e plano', 0, 1.9, 2.9, 'depois');
    void causa; void donos;
    return (t, m) => {
      const h = 1.4 - faixa(m, .5, 1) * .8; res.scale.y = h; res.position.y = h / 2;
      res.material = mat(m > .8 ? C.ambar : C.coral);
      planos.forEach((p, i) => { p.position.y = .9 + Math.sin(t * 2 + i) * .05; });
    };
  },
  // PominSprint: tarefas em três ferramentas → um quadro com o trabalho andando até a entrega
  sprint: k => {
    const quadros = [[-3, -1, C.azul, 'Ferramenta A'], [0, 1.6, C.ice, 'Planilha'], [3, -1, C.verde, 'Ferramenta B']] as const;
    quadros.forEach(([x, z, c, n]) => { k.so('antes', k.caixa(2, .12, 1.6, c, x, .06, z)); k.rotulo(n, x, 1.3, z, 'antes'); });
    const col = ['A fazer', 'Fazendo', 'Feito'];
    col.forEach((n, i) => { k.so('depois', k.caixa(2.4, .12, 3.6, [C.ice, C.cinza, C.verde][i], -2.6 + i * 2.6, .06, 0)); k.rotulo(n, -2.6 + i * 2.6, .9, -2.3, 'depois'); });
    const tarefas = Array.from({ length: 9 }, (_, i) => k.caixa(.5, .32, .5, [C.navy, C.azul, C.turq][i % 3]));
    return (t, m) => tarefas.forEach((c, i) => {
      const q = quadros[i % 3], antes = V(q[0] + (rnd(i) - .5) * 1.5, .3 + Math.abs(Math.sin(t * 1.5 + i)) * .2, q[1] + (rnd(i + 2) - .5) * 1.1);
      const fase = (t * .12 + i / 9) % 1, coluna = Math.min(2, Math.floor(fase * 3)), dentro = (fase * 3) % 1;
      const x = -2.6 + coluna * 2.6 + sm(Math.max(0, dentro - .8) / .2) * 2.6 * (coluna < 2 ? 1 : 0), depois = V(x, .28, -1.3 + (i % 3) * 1.1);
      c.position.lerpVectors(antes, depois, faixa(m, .2, .7)); c.rotation.y = (1 - m) * (t + i);
    });
  },
  // PominDev: fila parada na frente do TI → esteira com agente, revisão, testes e aceite
  dev: k => {
    const ti = k.so('antes', k.caixa(1.4, 1.6, 1.4, C.navy, 3, .8, 0)); k.rotulo('Fila de TI', 3, 2.1, 0, 'antes');
    const etapas = ['Chamado', 'Agente de IA', 'Revisão', 'Testes', 'Produção'];
    const portais = etapas.map((n, i) => { const x = -3.6 + i * 1.8, gr = k.so('depois', k.grupo(x, 0, 0)); const cor = i === 4 ? C.navy : C.azul;
      [-.7, .7].forEach(z => gr.add(k.caixa(.16, 1.6, .16, cor, 0, .8, z))); gr.add(k.caixa(.16, .16, 1.56, cor, 0, 1.6, 0));
      k.rotulo(n, x, 2.2, 0, 'depois'); return gr; });
    k.so('depois', k.caixa(8, .08, 1, C.cinza, 0, .04, 0)); const aceite = k.so('depois', k.cil(.2, .1, C.verde, 2.7, .1, 1.1)); k.rotulo('Seu aceite', 2.7, .8, 1.5, 'depois');
    const tickets = Array.from({ length: 7 }, () => k.caixa(.42, .42, .42, C.ambar));
    void ti; void portais;
    return (t, m) => tickets.forEach((c, i) => {
      const fila = V(1.8 - i * .62 - (Math.sin(t * .5) + 1) * .03, .21, 0), u = (t * .1 + i / 7) % 1, esteira = V(-4 + u * 8, .29, 0);
      c.position.lerpVectors(fila, esteira, faixa(m, .25, .75));
      c.material = mat(m > .5 ? (u > .55 ? C.verde : C.azul) : C.ambar);
      aceite.rotation.y = t;
    });
  },
  // PominSAC: tudo numa caixa compartilhada → canais por área, com dono e prazo
  sac: k => {
    const caixa = k.so('antes', k.caixa(2.2, 1.1, 2.2, C.cinza, 0, .55, 0)); k.rotulo('Caixa compartilhada', 0, 2.4, 0, 'antes');
    const areas = ['TI', 'RH', 'Financeiro'];
    areas.forEach((n, i) => { const z = -1.8 + i * 1.8; k.so('depois', k.caixa(6.4, .1, .9, C.ice, -.4, .05, z)); k.so('depois', k.pessoa(C.navy, 3.4, z)); k.rotulo(n, -3.9, .7, z, 'depois'); });
    k.rotulo('Cada chamado com dono e prazo', 0, 2.6, -2.6, 'depois');
    const envs = Array.from({ length: 9 }, (_, i) => k.caixa(.5, .06, .36, C.papel));
    const prazos = envs.map(() => k.so('depois', k.anel(.24, C.verde, 0, 0, 0, .03, Math.PI * 1.5)));
    void caixa;
    return (t, m) => envs.forEach((e, i) => {
      const cai = ((t * .35 + i / 9) % 1), pilha = V((rnd(i) - .5) * 1.4, 2.6 - cai * 1.6 * (i < 5 ? 1 : .6), (rnd(i + 1) - .5) * 1.4);
      const u = (t * .1 + i / 9) % 1, z = -1.8 + (i % 3) * 1.8, faixaV = V(-3.4 + u * 6, .16, z);
      e.position.lerpVectors(pilha, faixaV, faixa(m, .2, .7)); e.rotation.y = (1 - m) * (t + i);
      prazos[i].position.set(faixaV.x, .5, z); prazos[i].rotation.z = t; prazos[i].material = mat(u > .8 ? C.ambar : C.verde);
    });
  },
  // PominCHAT: cada vendedor no próprio WhatsApp → filas com prazo de resposta e o time na mesma plataforma
  chat: k => {
    const fones = [-3.4, -1.2, 1.2, 3.4].map((x, i) => { const f = k.caixa(.5, .95, .08, C.navy, x, .48, 1.8); return f; });
    const baloes = Array.from({ length: 12 }, (_, i) => k.caixa(.42, .26, .1, i % 2 ? C.verde : C.branco, 0, 0, 0, .1));
    k.rotulo('Vendedor de férias', 3.4, 1.8, 1.8, 'antes'); k.rotulo('Histórico no celular de cada um', -1, 2.6, 1, 'antes');
    k.so('depois', k.caixa(6, .1, 1, C.ice, 0, .05, -.6)); k.so('depois', k.anel(.55, C.verde, -2.4, .12, -.6)); k.rotulo('Fila com prazo de resposta', 0, 1.2, -.6, 'depois');
    const agentes = [-1, 1].map(x => k.so('depois', k.pessoa(C.azul, x + 3, -2)));
    const sala = k.so('depois', k.caixa(1.6, 1, .1, C.navy, -3, .9, -2.6)); k.rotulo('Vídeo e reuniões do time', -3, 1.8, -2.6, 'depois');
    void agentes; void sala;
    return (t, m) => {
      fones[3].rotation.x = (1 - m) * faixa(Math.sin(t * .7), 0, 1) * 1.2;
      baloes.forEach((b, i) => {
        const f = fones[i % 4].position, empilhado = V(f.x + (i % 2 ? .1 : -.1), 1.15 + Math.floor(i / 4) * .32 + Math.sin(t * 2 + i) * .03, f.z);
        const u = (t * .14 + i / 12) % 1, fila = V(-3 + u * 6, .3, -.6);
        b.position.lerpVectors(empilhado, fila, faixa(m, .15 + (i % 4) * .05, .65 + (i % 4) * .05));
      });
    };
  },
  // PominCS: cliente cancela sem ninguém ver → saúde de cada cliente e tarefa antes do risco
  cs: k => {
    k.caixa(1.3, 1.2, 1.3, C.navy, 0, .6, 0); k.rotulo('Sua empresa', 0, 1.8, 0);
    k.so('depois', k.anel(3, C.cinza, 0, .02, 0, .02));
    const clientes = Array.from({ length: 7 }, (_, i) => k.esfera(.3, C.azul));
    const saude = clientes.map(() => k.so('depois', k.anel(.42, C.verde, 0, 0, 0, .035)));
    const csm = k.so('depois', k.pessoa(C.turq, 0, 0)), tarefa = k.so('depois', k.caixa(.5, .06, .36, C.branco));
    k.rotulo('Cancelou sem ninguém perceber', 3.2, 2.2, 2.4, 'antes'); k.rotulo('Tarefa criada antes do risco', 2.6, 2.4, 2.2, 'depois');
    return (t, m) => clientes.forEach((c, i) => {
      const a = i / 7 * Math.PI * 2 + t * .18, r = 3, risco = i === 2;
      const sai = risco ? faixa(Math.sin(t * .5), -.2, 1) * (1 - m) : 0, rr = r + sai * 2.5;
      c.position.set(Math.cos(a) * rr, .45 + (risco ? sai * .5 : 0), Math.sin(a) * rr);
      const alerta = risco && m > .5 ? .5 + .5 * Math.sin(t * 5) : 0;
      c.material = mat(risco ? (m > .5 ? (alerta > .5 ? C.ambar : C.verde) : C.coral) : C.azul);
      saude[i].position.set(c.position.x, .45, c.position.z); saude[i].material = mat(risco ? C.ambar : C.verde);
      if (risco) { csm.position.set(c.position.x * 1.25, 0, c.position.z * 1.25); tarefa.position.set(c.position.x, 1.05, c.position.z); }
    });
  }
};

// ---------- Palco: renderizador, câmera isométrica, luz e piso ----------
export class Palco {
  renderer: THREE.WebGLRenderer; cena = new THREE.Scene(); camera: THREE.OrthographicCamera; controles?: OrbitControls;
  mix = 0; private atual?: { k: Kit; up: (t: number, m: number) => void }; private relogio = new THREE.Timer(); private t = 0; private vivo = true;
  constructor(public canvas: HTMLCanvasElement, interativo = true, private calmo = false) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: !interativo });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true; this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, .1, 100);
    this.camera.position.set(11, 10, 12); this.camera.lookAt(0, .6, 0);
    this.cena.add(new THREE.HemisphereLight(0xffffff, 0xC9D6E3, 1.6));
    const sol = new THREE.DirectionalLight(0xffffff, 2.2); sol.position.set(5, 11, 6); sol.castShadow = true;
    sol.shadow.mapSize.set(1024, 1024); Object.assign(sol.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8 }); sol.shadow.radius = 6; sol.shadow.bias = -.0005;
    this.cena.add(sol);
    const piso = new THREE.Mesh(new RoundedBoxGeometry(10.5, .3, 7.5, 3, .12), mat(C.piso)); piso.position.y = -.15; piso.receiveShadow = true; this.cena.add(piso);
    if (interativo) {
      this.controles = new OrbitControls(this.camera, canvas);
      Object.assign(this.controles, { enableZoom: false, enablePan: false, enableDamping: true, minPolarAngle: .7, maxPolarAngle: 1.2, minAzimuthAngle: .25, maxAzimuthAngle: 1.3 });
      this.controles.target.set(0, .6, 0);
    }
    this.tamanho();
  }
  tamanho() {
    const w = this.canvas.clientWidth || 640, h = this.canvas.clientHeight || 420, a = w / h;
    const meiaAlt = a >= 1.45 ? 3.7 : 5.3 / a; // largura útil da maquete ~10.6
    this.renderer.setSize(w, h, false);
    Object.assign(this.camera, { left: -meiaAlt * a, right: meiaAlt * a, top: meiaAlt + .3, bottom: -meiaAlt + .3 });
    this.camera.updateProjectionMatrix();
  }
  mostrar(id: string) {
    if (this.atual) { this.cena.remove(this.atual.k.g); this.atual.k.g.traverse(o => { const m = o as THREE.Mesh; m.geometry?.dispose(); const s = o as THREE.Sprite; if (s.isSprite) { s.material.map?.dispose(); s.material.dispose(); } }); }
    const k = new Kit(); const up = cenas[id](k); this.cena.add(k.g); this.atual = { k, up }; this.quadro(0);
  }
  quadro(dt: number) {
    if (!this.calmo) this.t += dt;
    const a = this.atual; if (!a) return;
    a.up(this.t, this.mix);
    for (const o of a.k.antes) mostra(o, 1 - faixa(this.mix, 0, .45));
    for (const o of a.k.depois) mostra(o, faixa(this.mix, .55, 1));
    this.controles?.update();
    this.renderer.render(this.cena, this.camera);
  }
  rodar() { const loop = () => { if (!this.vivo) return; requestAnimationFrame(loop); if (document.hidden || !this.canvas.isConnected || !this.canvas.offsetParent) return; this.relogio.update(); this.quadro(Math.min(this.relogio.getDelta(), .05)); }; loop(); }
  parar() { this.vivo = false; }
}

// Miniaturas estáticas (uma foto de cada maquete no "depois") para a grade de produtos
let fotografo: Palco | null = null;
export function miniatura(id: string, mix = 1) {
  if (!fotografo) { const c = document.createElement('canvas'); c.style.cssText = 'position:fixed;left:-9999px;width:640px;height:440px'; document.body.appendChild(c); fotografo = new Palco(c, false, true); }
  fotografo.mix = mix; fotografo.mostrar(id); fotografo.quadro(0);
  return fotografo.canvas.toDataURL('image/webp', .86);
}
