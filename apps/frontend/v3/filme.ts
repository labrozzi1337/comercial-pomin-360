// Motor dos trailers: cada aplicação ganha um curta de 30 a 45 s com a tela do sistema recriada (1280×800),
// câmera, foco, cursor, digitação e números. O trailer (./trailers/<id>.ts) só descreve a tela e o roteiro.
import { gsap } from 'gsap';
import { svg } from '../src/data';
import { app, img, trailers as metas, mercadoDe } from './dados';

export interface Trailer {
  ui: string;                  // HTML da tela, desenhado para 1280×800 (use moldura())
  css?: string;                // CSS próprio, sempre começando por .t-<id>
  roteiro(f: Filme): void;     // monta a timeline: f.passo(1..4) + movimentos
}
type Pos = string | number | undefined;
export interface Cam { x?: number; y?: number; zoom?: number; rx?: number; ry?: number; rz?: number }

export const W = 1280, H = 800;
const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
const modulos = import.meta.glob<{ default: Trailer }>('./trailers/*.ts');
const estilos = new Set<string>();

export class Filme {
  tl = gsap.timeline({ paused: true });
  legendas: [number, string][] = [];
  constructor(public raiz: HTMLElement, public tela: HTMLElement, public cam: HTMLElement, public ponteiro: HTMLElement) {}
  $<T extends HTMLElement = HTMLElement>(s: string) { const el = this.tela.querySelector<T>(s); if (!el) throw new Error(`trailer: "${s}" não existe`); return el; }
  $$(s: string) { return [...this.tela.querySelectorAll<HTMLElement>(s)]; }
  // Posição de layout (ignora transformações), em pixels da tela 1280×800. Não use display:none em quem será medido.
  pos(s: string | HTMLElement) {
    let el: HTMLElement | null = typeof s === 'string' ? this.$(s) : s, x = 0, y = 0;
    const w = el.offsetWidth, h = el.offsetHeight;
    while (el && el !== this.tela) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent as HTMLElement | null; }
    return { x, y, w, h };
  }
  // instante (em s) de uma posição da timeline, como o GSAP a interpreta
  quando(at: Pos) { const m = gsap.to({}, { duration: 0.001 }); this.tl.add(m, at); return m.startTime(); }
  pausa(seg: number) { this.tl.to({}, { duration: seg }); return this; }
  // estados que valem a partir de um instante (reavaliados a cada quadro, então pular para trás também funciona)
  regras: (() => void)[] = [];
  classe(s: string, nome: string, at?: Pos) { const t = this.quando(at), els = this.$$(s); this.regras.push(() => { const on = this.tl.time() >= t; els.forEach(e => e.classList.toggle(nome, on)); }); return this; }
  texto(s: string, valor: string, at?: Pos) { const t = this.quando(at), el = this.$(s), antes = el.textContent ?? ''; this.regras.push(() => { const v = this.tl.time() >= t ? valor : antes; if (el.textContent !== v) el.textContent = v; }); return this; }

  passo(n: number, texto: string, at?: Pos) { const t = this.quando(at); this.tl.addLabel('p' + n, t); this.legendas.push([t, texto]); return this; }
  legenda(texto: string, at?: Pos) { this.legendas.push([this.quando(at), texto]); return this; }

  // Câmera virtual. x/y em % da tela, zoom 1 = tela inteira, rx/ry/rz em graus. O que não for dito volta ao neutro.
  camera(v: Cam, dur = 1.6, at?: Pos, ease = 'power3.inOut') {
    this.tl.to(this.cam, { xPercent: v.x ?? 0, yPercent: v.y ?? 0, scale: v.zoom ?? 1, rotationX: v.rx ?? 0, rotationY: v.ry ?? 0, rotationZ: v.rz ?? 0, duration: dur, ease }, at);
    return this;
  }
  // aproxima a câmera até o elemento ficar no centro
  olhar(s: string, zoom = 1.7, dur = 1.6, at?: Pos, ang: Cam = {}) {
    const p = this.pos(s), cx = p.x + p.w / 2, cy = p.y + p.h / 2;
    return this.camera({ ...ang, x: -(cx - W / 2) / W * 100 * zoom, y: -(cy - H / 2) / H * 100 * zoom, zoom }, dur, at);
  }
  geral(dur = 1.4, at?: Pos, ang: Cam = {}) { return this.camera(ang, dur, at); }
  // muda o foco: as regiões [data-r] que não contêm o alvo desfocam (null devolve o foco a todas)
  foco(s: string | null, at?: Pos, dur = .6) {
    const alvos = s ? this.$$(s) : [], regs = this.$$('[data-r]');
    const nitida = (r: HTMLElement) => !s || alvos.some(a => a === r || r.contains(a) || a.contains(r));
    const t = this.quando(at);
    const fora = regs.filter(r => !nitida(r)), dentro = regs.filter(nitida);
    if (fora.length) this.tl.to(fora, { filter: 'blur(3px)', opacity: .32, duration: dur }, t);
    if (dentro.length) this.tl.to(dentro, { filter: 'blur(0px)', opacity: 1, duration: dur }, t);
    return this;
  }
  // leva o cursor até o elemento e, se pedido, clica
  cursor(s: string, at?: Pos, clique = true, dur = .9) {
    const p = this.pos(s), t = this.quando(at);
    this.tl.to(this.ponteiro, { x: p.x + p.w * .5, y: p.y + p.h * .55, autoAlpha: 1, duration: dur, ease: 'power2.inOut' }, t);
    if (clique) this.tl.fromTo(this.ponteiro.querySelector('i'), { scale: .2, autoAlpha: .9 }, { scale: 2.6, autoAlpha: 0, duration: .5, ease: 'power2.out', immediateRender: false }, t + dur)
      .to(this.ponteiro.querySelector('svg'), { scale: .82, duration: .08, yoyo: true, repeat: 1, transformOrigin: '0 0' }, t + dur);
    return this;
  }
  esconderCursor(at?: Pos) { this.tl.to(this.ponteiro, { autoAlpha: 0, duration: .3 }, at); return this; }
  digitar(s: string, texto: string, at?: Pos, cps = 34) {
    const el = this.$(s), o = { n: 0 };
    this.tl.fromTo(o, { n: 0 }, { n: texto.length, duration: texto.length / cps, ease: 'none', immediateRender: false, onUpdate: () => { el.textContent = texto.slice(0, Math.round(o.n)); } }, at);
    return this;
  }
  contar(s: string, ate: number, at?: Pos, o: { de?: number; dur?: number; fmt?: (n: number) => string } = {}) {
    const el = this.$(s), v = { n: o.de ?? 0 }, fmt = o.fmt ?? ((n: number) => Math.round(n).toLocaleString('pt-BR'));
    this.tl.fromTo(v, { n: o.de ?? 0 }, { n: ate, duration: o.dur ?? 1.4, ease: 'power2.out', immediateRender: false, onUpdate: () => { el.textContent = fmt(v.n); } }, at);
    return this;
  }
  // revela elementos (entram de baixo, um depois do outro)
  entra(s: string, at?: Pos, vars: gsap.TweenVars = {}) { this.tl.from(this.$$(s), { autoAlpha: 0, y: 14, duration: .5, stagger: .08, ease: 'power2.out', ...vars }, at); return this; }
  // desenha linhas SVG (path/polyline) do começo ao fim
  desenhar(s: string, at?: Pos, dur = 1.2) {
    const linhas = [...this.tela.querySelectorAll<SVGGeometryElement>(s)];
    linhas.forEach(l => { const c = l.getTotalLength(); l.style.strokeDasharray = String(c); l.style.strokeDashoffset = String(c); });
    this.tl.to(linhas, { strokeDashoffset: 0, duration: dur, ease: 'power2.inOut', stagger: .1 }, at);
    return this;
  }
}

// ---------- Moldura padrão das telas Pomin (barra lateral, topo com busca) ----------
const p = {
  inicio: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  caixa: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  pessoas: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  grafico: '<path d="M3 3v18h18"/><path d="m7 14 4-4 3 3 6-6"/>',
  agenda: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  conversa: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  ajustes: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
  busca: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  sino: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  ok: '<path d="M20 6 9 17l-5-5"/>',
  ia: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
  doc: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4M10 9H8M16 13H8M16 17H8"/>',
  quadro: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 7v7M12 7v4M16 7v9"/>',
  relogio: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  alerta: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  seta: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  mais: '<path d="M12 5v14M5 12h14"/>',
  enviar: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
  video: '<path d="m22 8-6 4 6 4V8z"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
  escudo: '<path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z"/>',
  pasta: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  codigo: '<path d="m18 16 4-4-4-4M6 8l-4 4 4 4M14.5 4l-5 16"/>',
  coracao: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  imagem: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/>',
  telefone: '<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M11 18h2"/>'
};
export type Icone = keyof typeof p;
export const ic = (n: Icone) => svg(p[n]);

export function moldura(o: { app: string; escuro?: boolean; secao: string; sub?: string; nav?: Icone[]; ativo?: number; corpo: string; topo?: string }) {
  const a = app(o.app), nav = o.nav ?? ['inicio', 'caixa', 'pessoas', 'grafico', 'agenda'];
  return `<div class="ui${o.escuro ? ' escuro' : ''}" style="--c:${a.color}">
    <aside class="ui-lado"><span class="ui-logo">${a.icon}</span>${nav.map((n, i) => `<span class="ui-nav${i === (o.ativo ?? 0) ? ' ativo' : ''}">${ic(n)}</span>`).join('')}<span class="ui-nav fim">${ic('ajustes')}</span></aside>
    <header class="ui-topo"><div class="ui-trilha"><b>${o.secao}</b>${o.sub ? `<small>${o.sub}</small>` : ''}</div><div class="ui-busca">${ic('busca')}<span>Buscar…</span><kbd>Ctrl K</kbd></div><div class="ui-acoes">${o.topo ?? ''}<span class="ui-ico">${ic('sino')}</span><span class="ui-av" style="--a:#5b7cf0">DP</span></div></header>
    <main class="ui-corpo">${o.corpo}</main></div>`;
}

// ---------- Montagem ----------
export const temTrailer = (id: string) => `./trailers/${id}.ts` in modulos;

// O vídeo começa sozinho quando aparece na tela (a foto de abertura com o zoom lento e depois a tela do sistema).
// Um botão só: Repetir.
export async function montarFilme(el: HTMLElement, id: string, o: { aoTerminar?: () => void } = {}) {
  // sem o arquivo do trailer, mostra só a abertura e o fim (nunca quebra a página)
  const carregar = modulos[`./trailers/${id}.ts`], a = app(id), m = metas[id];
  const t: Trailer = carregar ? (await carregar()).default : { ui: '', roteiro: f => { f.tl.set(f.cam, { autoAlpha: 0 }, 'depois').to({}, { duration: 1 }); } };
  if (t.css && !estilos.has(id)) { estilos.add(id); document.head.insertAdjacentHTML('beforeend', `<style data-trailer="${id}">${t.css}</style>`); }
  const mercado = mercadoDe(id);
  el.classList.add('filme'); el.style.setProperty('--c', a.color);
  el.innerHTML = `
    <div class="f-palco"><div class="f-camera"><div class="f-tela t-${id}">${t.ui}<div class="f-ponteiro" aria-hidden="true"><i></i><svg viewBox="0 0 24 24"><path d="M4 2l16 9.5-7 1.6-3.6 6.4z" fill="#fff" stroke="#0E1A2B" stroke-width="1.4" stroke-linejoin="round"/></svg></div></div></div></div>
    <div class="f-abertura"><img src="${img('v3-t-' + id)}" alt="" /><div class="f-cartela"><small>${m.hora} · ${m.area}</small><p>${m.problema}</p></div></div>
    <p class="f-legenda" aria-live="polite"><span></span></p>
    <div class="f-final"><div>
      <small>${a.name}</small><h3>${m.frase}</h3>
      ${m.numero ? `<p class="f-numero"><b>${m.numero[0]}</b> ${m.numero[1]}</p>` : ''}
      ${mercado.length ? `<p class="f-mercado"><span>Quem cobra por isso hoje</span>${mercado.map(c => `<a href="${c.fonte}" target="_blank" rel="noopener">${c.nome} <em>${c.preco}</em></a>`).join('')}</p>` : ''}
      <div class="f-saida"><a class="f-entrar" href="https://${a.url}" target="_blank" rel="noopener">Entrar no ${a.name} ${ic('seta')}</a></div>
    </div></div>
    <button type="button" class="f-repetir" aria-label="Repetir o vídeo do ${a.name}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></svg><span>Repetir</span></button>
    <i class="f-progresso" aria-hidden="true"></i>`;
  const tela = el.querySelector<HTMLElement>('.f-tela')!, cam = el.querySelector<HTMLElement>('.f-camera')!, ponteiro = el.querySelector<HTMLElement>('.f-ponteiro')!;
  const palco = el.querySelector<HTMLElement>('.f-palco')!;
  // no celular o vídeo é quadrado e a tela do sistema fica maior (corta um pouco das bordas) para dar para ler
  const escala = () => { const r = palco.getBoundingClientRect(), estreito = r.width < 600; el.style.setProperty('--s', String(estreito ? Math.min(r.width * 1.4 / W, r.height * .96 / H) : Math.min(r.width * .84 / W, r.height * .84 / H))); };
  escala(); new ResizeObserver(escala).observe(palco);
  await document.fonts.load('600 14px Oxanium').catch(() => {});

  const f = new Filme(el, tela, cam, ponteiro), tl = f.tl;
  gsap.set(ponteiro, { x: W * .6, y: H * .7, autoAlpha: 0 });
  // Abertura: a foto do problema, e a tela do sistema entrando em perspectiva
  const foto = el.querySelector('.f-abertura')!;
  tl.addLabel('antes', 0)
    .fromTo(foto.querySelector('img'), { scale: 1.1 }, { scale: 1, duration: 4.6, ease: 'none' }, 0)
    .from(foto.querySelectorAll('.f-cartela > *'), { autoAlpha: 0, y: 18, duration: .9, stagger: .25, ease: 'power3.out' }, .3)
    .to(foto, { autoAlpha: 0, duration: .9, ease: 'power2.inOut' }, 3.9)
    .fromTo(cam, { rotationX: 24, rotationY: -20, yPercent: 14, scale: .78, autoAlpha: 0 }, { rotationX: 0, rotationY: 0, yPercent: 0, scale: 1, autoAlpha: 1, duration: 2, ease: 'power3.out' }, 3.9)
    .addLabel('depois', 4.4);
  t.roteiro(f);
  const fim = el.querySelector<HTMLElement>('.f-final')!;
  tl.to(ponteiro, { autoAlpha: 0, duration: .3 }, '+=0.8').to(cam, { xPercent: 0, yPercent: 0, scale: .92, rotationX: 0, rotationY: 0, rotationZ: 0, duration: 1.2, ease: 'power2.inOut' }, '<')
    .addLabel('fim')
    .fromTo(fim, { autoAlpha: 0 }, { autoAlpha: 1, duration: .7 }, 'fim')
    .from(fim.querySelectorAll('div > *'), { autoAlpha: 0, y: 16, duration: .6, stagger: .12, ease: 'power3.out' }, 'fim+=.2')
    .to({}, { duration: .4 });

  // Legenda e controles acompanham a timeline (também quando o comercial pula de um ponto a outro)
  const leg = el.querySelector<HTMLElement>('.f-legenda')!, legTxt = leg.querySelector('span')!;
  const progresso = el.querySelector<HTMLElement>('.f-progresso')!;
  f.legendas.sort((x, y) => x[0] - y[0]);
  let atual = '';
  tl.eventCallback('onUpdate', () => {
    f.regras.forEach(r => r());
    const tt = tl.time(), l = f.legendas.filter(x => x[0] <= tt).pop()?.[1] ?? '';
    const mostra = tt > tl.labels.depois && tt < tl.labels.fim;
    if (l !== atual) { atual = l; legTxt.textContent = l; }
    leg.classList.toggle('on', mostra && !!l);
    progresso.style.transform = `scaleX(${tl.progress()})`;
    el.classList.toggle('no-antes', tt < tl.labels.depois);
  });
  tl.eventCallback('onComplete', () => { el.classList.add('acabou'); o.aoTerminar?.(); });
  const tocar = (rodar = true) => { el.classList.toggle('rodando', rodar); el.classList.remove('acabou'); rodar ? tl.play() : tl.pause(); };
  const ir = (onde: string | number, rodar = true) => { tl.seek(onde, false); tocar(rodar); };
  el.querySelector('.f-repetir')!.addEventListener('click', () => ir(0));
  // começa quando aparece, pausa quando sai da tela e continua de onde parou quando volta
  if (calmo) tl.seek('fim', false);
  else new IntersectionObserver(es => { const v = es[0].isIntersecting; if (v && tl.progress() < 1) tocar(true); else if (!v && !tl.paused()) tocar(false); }, { threshold: .45 }).observe(el);
  return { f, ir, tocar, tl };
}
