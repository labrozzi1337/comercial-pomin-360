import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SplitText } from 'gsap/SplitText';
import type { Cena } from './scene';
import { $, $$, calmo } from './ui';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

// Toda a coreografia do scroll. A cena 3D só recebe números (mix, posição, escala, visibilidade).
export function iniciarMovimento(cena: Cena) {
  const e = cena.estado;
  const smoother = calmo ? null : ScrollSmoother.create({ wrapper: '#smooth-wrapper', content: '#smooth-content', smooth: 1.15, effects: true, smoothTouch: 0.1 });
  const goto = (alvo: string) => {
    const el = document.querySelector<HTMLElement>(alvo); if (!el) return;
    if (smoother) smoother.scrollTo(el, true, 'top top'); else el.scrollIntoView({ behavior: calmo ? 'auto' : 'smooth' });
  };
  const travar = (on: boolean) => { if (smoother) smoother.paused(on); else document.documentElement.style.overflow = on ? 'hidden' : ''; };
  const ganchos = { goto, travar, refresh: () => ScrollTrigger.refresh() };

  if (calmo) {
    document.documentElement.classList.add('calmo');
    Object.assign(e, { intro: 1, mix: 1, escala: 1, visivel: .5 });
    $('#preloader').remove();
    return ganchos;
  }

  // ---------- Pré-carregamento: o anel se forma quando a página abre ----------
  const pl = { v: 0 }, plNum = $('#pl-num'), plBar = $('.pl-bar i');
  const desenha = () => { plNum.textContent = String(Math.round(pl.v)); plBar.style.transform = `scaleX(${pl.v / 100})`; };
  gsap.to(pl, { v: 88, duration: 1.8, ease: 'power2.out', onUpdate: desenha });
  gsap.from('.pl-logo img', { yPercent: 110, duration: 1.1, ease: 'expo.out', delay: .1 });
  const fontes = Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 2500))]);
  Promise.all([fontes, new Promise(r => setTimeout(r, 1500))]).then(() => {
    gsap.timeline()
      .to(pl, { v: 100, duration: .35, ease: 'none', onUpdate: desenha })
      .to('.pl-logo img, .pl-count, .pl-line, .pl-bar', { yPercent: -120, opacity: 0, duration: .6, ease: 'expo.in', stagger: .04 })
      .to('#preloader', { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' }, '-=.15')
      .add(intro, '-=.65')
      .add(() => $('#preloader').remove());
  });

  function intro() {
    gsap.to(e, { intro: 1, duration: 3.2, ease: 'expo.out' });
    const h1 = SplitText.create('#hero-title', { type: 'lines', mask: 'lines' });
    gsap.timeline()
      .from(h1.lines, { yPercent: 120, rotate: 4, duration: 1.4, ease: 'expo.out', stagger: .12 })
      .from('.hero .eyebrow, .typing-line', { y: 24, opacity: 0, duration: 1, ease: 'expo.out', stagger: .08 }, '-=1.1')
      .from('.hero .reveal', { y: 34, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: .1 }, '-=.9')
      .from('.topo', { y: -40, opacity: 0, duration: 1, ease: 'expo.out' }, .2)
      .from('.scroll-cue', { opacity: 0, duration: 1 }, '-=.4');
  }

  // ---------- Títulos e textos ----------
  $$('.split').forEach(el => {
    if (el.id === 'hero-title') return;
    SplitText.create(el, { type: 'lines', mask: 'lines', autoSplit: true, onSplit: s => gsap.from(s.lines, { yPercent: 115, duration: 1.2, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: el, start: 'top 86%' } }) });
  });
  $$('.reveal').filter(el => !el.closest('.hero')).forEach(el => gsap.from(el, { y: 40, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } }));
  SplitText.create('#scrub', { type: 'words', onSplit: s => gsap.fromTo(s.words, { opacity: .12 }, { opacity: 1, stagger: .08, ease: 'none', scrollTrigger: { trigger: '#manifesto', start: 'top 65%', end: 'bottom 70%', scrub: true } }) });

  // ---------- Barra de progresso, topo que some ao descer ----------
  const topo = $('#topo'), barra = $('#progress');
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: s => {
    barra.style.transform = `scaleX(${s.progress})`;
    topo.classList.toggle('rolado', s.scroll() > 40);
    topo.classList.toggle('escondido', s.direction === 1 && s.scroll() > 600 && !document.body.classList.contains('menu-on'));
  } });

  // ---------- Cena 3D acompanhando o roteiro ----------
  // Um estado só, composto a partir do progresso de cada trecho (vários tweens no mesmo objeto brigam entre si).
  // Cada etapa leva o estado de onde a anterior parou até os seus valores, na ordem da página.
  const desk = matchMedia('(min-width: 900px)').matches;
  type K = Partial<Record<'mix' | 'x' | 'y' | 'escala' | 'visivel', number>>;
  const K0: Required<K> = { mix: 1, x: desk ? 4.4 : 0, y: desk ? .2 : 2.8, escala: desk ? 1 : .78, visivel: 1 };
  const suave = gsap.parseEase('power2.inOut');
  const etapas: [string, string, string, K, ((t: number) => number)?][] = [
    ['#inicio', 'top top', 'bottom top', { escala: desk ? 1.25 : .9, y: desk ? -1 : 1.4 }],              // o hero sai de cena
    ['#manifesto', 'top 80%', 'bottom top', { mix: 0, x: 0, y: 0, escala: 1 }],                         // o universo arrumado vira o caos do "antes"
    ['#convergencia', 'top top', '+=120%', { mix: 1, x: desk ? 4.6 : 0, y: desk ? 0 : 2.2, escala: desk ? .95 : .8 }, suave], // volta a formar o anel
    ['#aplicacoes', 'top bottom', 'top top', { x: desk ? 6.2 : 0, y: desk ? 2.4 : 3.4, escala: .5, visivel: .55 }],
    ['#substitui', 'top bottom', 'top 30%', { x: 0, y: 0, escala: 1.6, visivel: .22 }],                   // grande e discreto atrás do conteúdo
    ['#final', 'top bottom', 'center center', { escala: 1, visivel: .9 }]
  ];
  const prog = etapas.map(() => 0);
  const compor = () => {
    const s = { ...K0 };
    etapas.forEach(([, , , k, ease], i) => { const t = ease ? ease(prog[i]) : prog[i]; if (t) for (const p of Object.keys(k) as (keyof K)[]) s[p] += (k[p]! - s[p]) * t; });
    Object.assign(e, s);
  };
  etapas.forEach(([trigger, start, end], i) => ScrollTrigger.create({ trigger, start, end, refreshPriority: -1, onUpdate: st => { prog[i] = st.progress; compor(); }, onRefresh: st => { prog[i] = st.progress; compor(); } }));
  compor();
  gsap.to('.hero-inner, .hero-facts', { y: -140, opacity: 0, ease: 'none', scrollTrigger: { trigger: '#inicio', start: 'top top', end: 'bottom top', scrub: true } });
  ScrollTrigger.create({ trigger: '#inicio', start: 'top top', end: 'bottom 30%', onToggle: s => { e.interativo = s.isActive; } });

  // Antes × Depois: fica fixo enquanto as falas do caos encontram quem responde
  const bolhas = $$('.bubble'), cards = $$('.ad-card');
  const ad = gsap.timeline({ scrollTrigger: { trigger: '#antes-depois', start: 'top top', end: '+=320%', pin: true, scrub: 1, anticipatePin: 1 } });
  ad.from('.ad-antes', { scale: 1.15, duration: 1.2, ease: 'none' }, 0)
    .from(bolhas, { scale: 0, opacity: 0, rotate: () => gsap.utils.random(-14, 14), y: 40, duration: .5, stagger: .18, ease: 'back.out(2)' }, .1)
    .to(bolhas, { y: () => gsap.utils.random(-30, 30), x: () => gsap.utils.random(-30, 30), duration: .8, ease: 'sine.inOut' }, 1)
    .to('.ad-hint', { opacity: 0, duration: .3 }, 1.4)
    .fromTo('.ad-depois', { clipPath: 'circle(0% at 70% 50%)' }, { clipPath: 'circle(120% at 70% 50%)', duration: 1.3, ease: 'power2.inOut' }, 1.6)
    .to(bolhas, { left: '50%', top: '50%', xPercent: -50, yPercent: -50, x: 0, y: 0, scale: .2, opacity: 0, rotate: 0, duration: .9, stagger: .04, ease: 'power3.in' }, 1.6)
    .to('.ad-h-antes, .ad-tag-antes', { y: -40, opacity: 0, duration: .5 }, 1.8)
    .fromTo('.ad-h-depois, .ad-tag-depois', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .6 }, 2.2)
    .from(cards, { y: 80, opacity: 0, rotateX: -35, duration: .6, stagger: .14, ease: 'expo.out' }, 2.5)
    .to({}, { duration: .6 });

  // Convergência: fica fixa enquanto as partículas voltam a formar o anel do P360 (etapa da cena acima)
  gsap.timeline({ scrollTrigger: { trigger: '#convergencia', start: 'top top', end: '+=170%', pin: true, scrub: 1 } })
    .from('.conv-facts li', { y: 60, opacity: 0, duration: .5, stagger: .2, ease: 'expo.out' }, .8)
    .to({}, { duration: .4 });
  ScrollTrigger.create({ trigger: '#convergencia', start: 'top center', end: 'bottom top', onToggle: s => { e.interativo = s.isActive; } });

  // Aplicações: o trilho anda na horizontal
  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px)', () => {
    const track = $('#h-track'), wrap = $('.h-wrap');
    const dist = () => Math.max(0, track.scrollWidth - wrap.clientWidth);
    const visiveis = () => $$('.h-card', track).filter(c => !c.hidden);
    const h = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: {
      trigger: '#aplicacoes', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true,
      onUpdate: s => { const v = visiveis(); $('#h-bar').style.transform = `scaleX(${s.progress})`; $('#h-count').textContent = `${String(Math.min(v.length, Math.floor(s.progress * v.length) + 1)).padStart(2, '0')} / ${String(v.length).padStart(2, '0')}`; }
    } });
    $$('.h-art img').forEach(img => gsap.fromTo(img, { xPercent: 8 }, { xPercent: -8, ease: 'none', scrollTrigger: { trigger: img.closest('.h-cat')!, containerAnimation: h, start: 'left right', end: 'right left', scrub: true } }));
    $$('.h-card').forEach(c => gsap.from(c, { rotateY: -18, opacity: .3, ease: 'none', scrollTrigger: { trigger: c, containerAnimation: h, start: 'left 105%', end: 'left 65%', scrub: true } }));
  });
  mm.add('(max-width: 899px)', () => {
    $$('.h-card, .h-cat').forEach(c => gsap.from(c, { y: 50, opacity: 0, duration: .9, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 90%' } }));
  });

  ScrollTrigger.create({ trigger: '#final', start: 'top center', onToggle: s => { e.interativo = s.isActive; } });

  // ---------- O que substitui, marquee, provas ----------
  $$('#logos .col').forEach((c, k) => gsap.fromTo(c, { yPercent: k % 2 ? 12 : -6 }, { yPercent: k % 2 ? -12 : 6, ease: 'none', scrollTrigger: { trigger: '#substitui', start: 'top bottom', end: 'bottom top', scrub: true } }));
  const mq = gsap.to('#marquee', { xPercent: -50, repeat: -1, duration: 60, ease: 'none' });
  ScrollTrigger.create({ trigger: '.marquee', start: 'top bottom', end: 'bottom top', onUpdate: s => {
    const v = gsap.utils.clamp(-6, 6, s.getVelocity() / 300);
    gsap.to(mq, { timeScale: 1 + Math.abs(v), duration: .3, overwrite: true });
    gsap.to('#marquee', { skewX: -v * 1.2, duration: .4, overwrite: 'auto' });
  } });
  gsap.from('.why-card', { y: 70, opacity: 0, duration: 1, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: '.why-grid', start: 'top 85%' } });
  $$('[data-count]').forEach(b => {
    const alvo = Number(b.dataset.count), o = { v: 0 };
    gsap.to(o, { v: alvo, duration: 2.2, ease: 'expo.out', scrollTrigger: { trigger: b, start: 'top 90%' }, onUpdate: () => { b.textContent = Math.round(o.v).toLocaleString('pt-BR'); } });
  });
  gsap.from('.proof li', { y: 40, opacity: 0, stagger: .08, duration: .9, ease: 'expo.out', scrollTrigger: { trigger: '.proof', start: 'top 88%' } });
  gsap.fromTo('.tl-one', { scaleX: 0 }, { scaleX: 1 / 8, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.timeline', start: 'top 85%' } });
  gsap.fromTo('.tl-all', { scaleX: 0 }, { scaleX: 1, duration: 2.2, ease: 'expo.inOut', scrollTrigger: { trigger: '.timeline', start: 'top 85%' } });
  gsap.from('.calc-card, .summary', { y: 60, opacity: 0, duration: 1, stagger: .12, ease: 'expo.out', scrollTrigger: { trigger: '.calc-layout', start: 'top 85%' } });
  gsap.from('.video, .aux-card', { y: 60, opacity: 0, duration: 1, stagger: .12, ease: 'expo.out', scrollTrigger: { trigger: '.learn', start: 'top 85%' } });
  gsap.from('.ask-box', { y: 60, opacity: 0, scale: .97, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.ask-box', start: 'top 88%' } });

  // Resumo da calculadora acompanha a rolagem no desktop (sticky não funciona dentro do ScrollSmoother)
  mm.add('(min-width: 1080px)', () => {
    const resumo = $('#summary'), layout = $('.calc-layout');
    ScrollTrigger.create({ trigger: layout, start: 'top 96px', end: () => `+=${Math.max(0, layout.offsetHeight - resumo.offsetHeight)}`, pin: resumo, pinSpacing: false, invalidateOnRefresh: true });
  });

  // ---------- Cursor e botões magnéticos (só com mouse) ----------
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.body.classList.add('com-cursor');
    const dot = $('.c-dot'), ring = $('.c-ring'), label = $('.c-ring span');
    const dx = gsap.quickTo(dot, 'x', { duration: .08 }), dy = gsap.quickTo(dot, 'y', { duration: .08 });
    const rx = gsap.quickTo(ring, 'x', { duration: .45, ease: 'expo.out' }), ry = gsap.quickTo(ring, 'y', { duration: .45, ease: 'expo.out' });
    addEventListener('pointermove', ev => {
      dx(ev.clientX); dy(ev.clientY); rx(ev.clientX); ry(ev.clientY);
      const t = (ev.target as HTMLElement).closest<HTMLElement>('[data-cursor], a, button, input, label, summary');
      const txt = t?.dataset.cursor ?? (document.body.classList.contains('no-hover') ? 'Abrir' : '');
      document.body.classList.toggle('c-link', !!t || document.body.classList.contains('no-hover'));
      document.body.classList.toggle('c-label', !!txt); label.textContent = txt;
    }, { passive: true });
    $$('.magnetic').forEach(b => {
      const x = gsap.quickTo(b, 'x', { duration: .6, ease: 'elastic.out(1, .4)' }), y = gsap.quickTo(b, 'y', { duration: .6, ease: 'elastic.out(1, .4)' });
      b.addEventListener('pointermove', ev => { const r = b.getBoundingClientRect(); x((ev.clientX - r.left - r.width / 2) * .3); y((ev.clientY - r.top - r.height / 2) * .4); });
      b.addEventListener('pointerleave', () => { x(0); y(0); });
    });
  }

  addEventListener('load', () => ScrollTrigger.refresh());
  return ganchos;
}
