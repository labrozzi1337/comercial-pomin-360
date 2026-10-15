import './estilo.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SplitText } from 'gsap/SplitText';
import { apps, guias, tools, provas, products, type App } from '../src/data';
import { dia, temporadas, razoes, concorrentes, cotacao, img, type Episodio } from './dados';
import { Palco, miniatura } from './demos';
import { iniciarUniverso } from './universo';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);
const $ = <T extends HTMLElement = HTMLElement>(s: string, el: ParentNode = document) => el.querySelector(s) as T;
const $$ = <T extends HTMLElement = HTMLElement>(s: string, el: ParentNode = document) => [...el.querySelectorAll(s)] as T[];
const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches, desk = matchMedia('(min-width: 900px)').matches;
const app = (id: string) => apps.find(a => a.id === id)!;
const brl = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const lista = new Intl.ListFormat('pt-BR', { type: 'conjunction' });
const nomeProduto: Record<string, string> = { report: 'PominReports', chat: 'PominChat', cfo: 'Reports CFO' };
const preco = (id: string) => products.find(p => p.name === (nomeProduto[id] ?? app(id).name))?.price ?? 0;
const episodio = (id: string) => temporadas.flatMap(t => t.episodios).find(e => e.app === id)!;

const smoother = calmo ? null : ScrollSmoother.create({ wrapper: '#smooth-wrapper', content: '#smooth-content', smooth: 1, effects: true, smoothTouch: .1 });
const caps = $$('.cap');
const ir = (i: number) => { const s = caps[Math.max(0, Math.min(caps.length - 1, i))]; if (smoother) smoother.scrollTo(s, true, 'top top'); else s.scrollIntoView({ behavior: calmo ? 'auto' : 'smooth' }); };

// ---------- Capítulos: sumário, controle e teclado (para apresentar) ----------
let atual = 0;
$('#sumario').innerHTML = caps.slice(1).map((c, i) => `<a href="#${c.id}" data-ir="${i + 1}"><span>${String(i + 1).padStart(2, '0')}</span>${c.dataset.nome}</a>`).join('');
caps.forEach((c, i) => ScrollTrigger.create({ trigger: c, start: 'top 55%', end: 'bottom 55%', onToggle: s => { if (!s.isActive) return; atual = i;
  $('#onde').innerHTML = `<b>${String(i).padStart(2, '0')}</b> ${c.dataset.nome}`; $$('#sumario a').forEach((a, k) => a.classList.toggle('ativo', k + 1 === i)); } }));
document.addEventListener('click', e => { const a = (e.target as HTMLElement).closest<HTMLElement>('[data-ir]'); if (a) { e.preventDefault(); ir(+a.dataset.ir!); } });
$('#ant').onclick = () => ir(atual - 1); $('#prox').onclick = () => ir(atual + 1);
document.addEventListener('keydown', e => {
  if ($<HTMLDialogElement>('#demo').open || (e.target as HTMLElement).matches('input,textarea')) return;
  if (['ArrowRight', 'PageDown'].includes(e.key)) { e.preventDefault(); ir(atual + 1); }
  if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); ir(atual - 1); }
  if (e.key.toLowerCase() === 'f') telaCheia();
});
const telaCheia = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(() => {});
$('#tela-cheia').onclick = telaCheia;

// ---------- 01 · Um dia comum ----------
$('#dia-trilho').innerHTML = dia.map((m, i) => { const a = app(m.app); return `<article class="momento" style="--c:${a.color}">
  <figure><img src="${img(m.foto)}" alt="" width="1600" height="1067" loading="lazy" /></figure>
  <div class="momento-texto"><p class="momento-hora"><span>${m.hora}</span>${m.area}</p>
    <blockquote>${m.fala}</blockquote><p>${m.conta}</p>
    <button type="button" class="quem" data-demo="${a.id}"><i aria-hidden="true">${a.icon}</i><span><small>Quem resolve</small>${a.name}</span><b aria-hidden="true">→</b></button></div>
  <span class="momento-n" aria-hidden="true">${i + 1}/${dia.length}</span></article>`; }).join('');

// ---------- 02 · A série (streaming) ----------
// Título em 3D: camadas empilhadas em profundidade, inclinadas pela rolagem e pelo mouse
$$('[data-t3d]').forEach(el => { el.innerHTML = `<div class="t3d-corpo">${Array.from({ length: 14 }, (_, k) => `<span style="--k:${k}">${el.dataset.t3d}</span>`).join('')}</div>`; });
const poster = (e: Episodio, n: string, top?: number) => { const a = app(e.app); return `<button type="button" class="poster${top ? ' com-numero' : ''}" data-demo="${a.id}" style="--c:${a.color}" aria-label="${e.titulo}: ver como o ${a.name} resolve">
  ${top ? `<span class="numero3d" aria-hidden="true">${Array.from({ length: 8 }, (_, k) => `<i style="--k:${k}">${top}</i>`).join('')}</span>` : ''}
  <span class="poster-img"><img src="${img(e.poster)}" alt="" width="1024" height="1536" loading="lazy" /><span class="poster-marca">P360</span><span class="poster-titulo">${e.titulo}</span></span>
  <span class="poster-info"><small>${n}</small><b>${e.titulo}</b><span>${e.sinopse}</span><em>Ver como o ${a.name} resolve →</em></span></button>`; };
$('#top').innerHTML = dia.map((m, i) => poster(episodio(m.app), 'Episódio do dia', i + 1)).join('');
$('#temporadas').innerHTML = temporadas.map((t, s) => `<div class="trilho-bloco"><h3 class="trilho-nome">Temporada ${s + 1} · ${t.nome}</h3><div class="trilho">${t.episodios.map((e, k) => poster(e, `T${s + 1} · E${k + 1}`)).join('')}</div></div>`).join('');
$('#agora').innerHTML = apps.map(a => `<button type="button" class="cena-card" data-demo="${a.id}" style="--c:${a.color}"><span class="cena-img"><img data-mini="${a.id}" alt="" width="640" height="440" /></span><span class="cena-txt"><b>${a.name}</b><span>${a.headline[0]} ${a.headline[1]}</span></span></button>`).join('');
$('#assistir').onclick = () => { const t = $('#top'); if (smoother) smoother.scrollTo(t.parentElement!, true, 'top 120px'); else t.scrollIntoView({ behavior: 'smooth' }); };

// ---------- 03 · O mercado ----------
const porApp = apps.map(a => ({ a, cs: concorrentes.filter(c => c.app === a.id) })).filter(x => x.cs.length);
$('#tabela-mercado').innerHTML = `<div class="tm-linha tm-cab"><span>Para resolver</span><span>O mercado cobra (preço de tabela)</span><span>No Pomin360</span></div>` + porApp.map(({ a, cs }) => `<div class="tm-linha" style="--c:${a.color}">
  <span class="tm-dor"><b>${episodio(a.id).titulo}</b><small>${a.category}</small></span>
  <span class="tm-mercado">${cs.map(c => `<a href="${c.fonte}" target="_blank" rel="noopener"><b>${c.nome}</b> ${c.plano ? `<small>${c.plano}</small>` : ''}<em>${c.texto ?? (c.usd != null ? `US$ ${c.usd.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} por ${c.cobranca.startsWith('por agente') ? 'agente' : c.cobranca.startsWith('por assento') ? 'assento' : 'usuário'}/mês` : c.cobranca)}</em></a>`).join('')}</span>
  <span class="tm-pomin"><i aria-hidden="true">${a.icon}</i><b>${a.name}</b><em>${preco(a.id) ? brl(preco(a.id)) + '/mês, para a empresa' : 'preço sob consulta'}</em></span></div>`).join('');
$('#nota-fontes').textContent = concorrentes.length ? `Preços de tabela públicos, sem promoções, consultados nos sites oficiais em ${cotacao.data}, plano anual. Cada nome leva à página de preços. Dólar pela ${cotacao.fonte} do mesmo dia (R$ ${cotacao.brl.toLocaleString('pt-BR')}). Não incluem impostos, implantação, integrações nem descontos negociados.` : '';
$('#conta-dolar').setAttribute('value', String(cotacao.brl));
const contaveis = concorrentes.filter(c => c.usd != null && c.porUsuario);
const padrao = ['Jira', 'Zendesk', 'Slack', 'Power BI', 'HubSpot']; // cenário típico de empresa com várias áreas
$('#conta-ferramentas').innerHTML = contaveis.map((c, i) => `<label class="ferr"><input type="checkbox" value="${i}" ${padrao.includes(c.nome) ? 'checked' : ''} /><span>${c.nome}</span></label>`).join('');
function conta() {
  const U = Math.max(1, +$<HTMLInputElement>('#conta-pessoas').value || 1), dolar = Math.max(1, +$<HTMLInputElement>('#conta-dolar').value || cotacao.brl);
  // Comparação justa: ferramenta cuja aplicação Pomin360 está sem preço sai dos dois lados da conta
  const marcadas = $$<HTMLInputElement>('#conta-ferramentas input:checked').map(i => contaveis[+i.value]);
  const sel = marcadas.filter(c => preco(c.app) > 0), fora = marcadas.filter(c => !preco(c.app));
  const porPessoa = sel.reduce((s, c) => s + (c.usd ?? 0) * dolar, 0), mercado = porPessoa * U;
  const comPreco = [...new Set(sel.map(c => c.app))], semPreco = [...new Set(fora.map(c => c.app))];
  const P = comPreco.reduce((s, id) => s + preco(id), 0), extra = .03 * P, fixo = P + 600, pomin = fixo + Math.max(0, U - 2) * extra;
  const virada = porPessoa > extra ? Math.ceil((fixo - 2 * extra) / (porPessoa - extra)) : 0;
  const ganha = mercado > pomin;
  $('#conta-saida').innerHTML = !marcadas.length ? '<p class="conta-vazia">Marque pelo menos uma ferramenta.</p>' : !sel.length ? '<p class="conta-vazia">As ferramentas marcadas correspondem a aplicações com preço sob consulta. Fale com o comercial para comparar.</p>' : `
    <div class="conta-col"><small>Hoje, no mercado</small><b>${brl(mercado)}<span>/mês</span></b><p>${lista.format(sel.map(c => c.nome))}, para ${U} ${U > 1 ? 'pessoas' : 'pessoa'}. ${brl(porPessoa)} por pessoa.</p></div>
    <div class="conta-col pomin"><small>Com o Pomin360</small><b>${brl(pomin)}<span>/mês</span></b><p>${comPreco.length ? lista.format(comPreco.map(id => app(id).name)) : 'Nenhuma aplicação com preço definido'}, 2 usuários inclusos, ${brl(extra)} por usuário extra e infraestrutura básica.</p></div>
    ${semPreco.length ? `<p class="nota">${lista.format(fora.map(c => c.nome))} ${fora.length > 1 ? 'ficaram' : 'ficou'} fora dos dois lados da conta: o ${lista.format(semPreco.map(id => app(id).name))} está com preço sob consulta.</p>` : ''}
    <p class="conta-veredito ${ganha ? 'bom' : ''}">${ganha ? `O Pomin360 sai ${brl(mercado - pomin)} mais barato por mês nesse cenário.` : `Nesse tamanho, o mercado sai ${brl(pomin - mercado)} mais barato por mês.`} ${virada > 0 ? `Com essas ferramentas, o Pomin360 fica mais barato a partir de ${virada} ${virada > 1 ? 'pessoas' : 'pessoa'}.` : ''}</p>
    <p class="nota">Estimativa simples: todas as ferramentas para o mesmo número de pessoas, sem impostos e sem desconto. A proposta oficial sai do simulador.</p>`;
}
$('#conta').addEventListener('input', conta); conta();

// ---------- 04 · Razões ----------
$('#razoes').innerHTML = razoes.map((r, i) => `<li><span>${String(i + 1).padStart(2, '0')}</span><h3>${r.titulo}</h3><p>${r.texto}</p></li>`).join('');

// ---------- 05 · Ecossistema ----------
const substitui = (id: string) => tools.filter(t => t.app === id).map(t => t.name);
const dica = $('#eco-dica');
iniciarUniverso($<HTMLCanvasElement>('#eco-canvas'), id => abrirDemo(id), (id, x, y) => {
  if (!id) { dica.classList.remove('on'); return; }
  const a = app(id), s = substitui(id), r = $('#ecossistema').getBoundingClientRect();
  dica.innerHTML = `<b style="color:${a.color}">${a.name}</b><span>${a.summary}</span>${s.length ? `<small>No lugar de ${lista.format(s)}</small>` : ''}`;
  dica.style.transform = `translate(${Math.min(x - r.left + 18, r.width - 300)}px, ${y - r.top + 18}px)`; dica.classList.add('on');
});
$('#eco-lista').innerHTML = apps.map(a => `<li><button type="button" data-demo="${a.id}" style="--c:${a.color}"><i aria-hidden="true">${a.icon}</i>${a.name}</button></li>`).join('');

// ---------- 06 · Grade de produtos com miniaturas das maquetes ----------
$('#grade-produtos').innerHTML = apps.map((a, i) => `<button type="button" class="produto" data-demo="${a.id}" style="--c:${a.color}">
  <span class="produto-img"><img data-mini="${a.id}" alt="" width="640" height="440" /><span class="produto-n">${String(i + 1).padStart(2, '0')}</span></span>
  <span class="produto-txt"><small>${a.category}</small><b>${a.name}</b><span>${episodio(a.id).sinopse}</span><em>Ver a demonstração →</em></span></button>`).join('');
// Miniaturas: uma "foto" de cada maquete no depois, feita quando aparece na tela
const fotos = new Map<string, string>();
const fila: HTMLImageElement[] = []; let fotografando = false;
const revelar = (im: HTMLImageElement) => { fila.push(im); if (!fotografando) proxima(); };
function proxima() {
  const im = fila.shift(); if (!im) { fotografando = false; return; } fotografando = true;
  const id = im.dataset.mini!; if (!fotos.has(id)) fotos.set(id, miniatura(id));
  im.src = fotos.get(id)!; im.classList.add('pronta'); requestAnimationFrame(proxima);
}
document.fonts.load('600 44px Montserrat').then(() => {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { io.unobserve(e.target); revelar(e.target as HTMLImageElement); } }), { rootMargin: '400px' });
  $$<HTMLImageElement>('img[data-mini]').forEach(i => io.observe(i));
});

// ---------- 07 · Prova ----------
$('#numeros').innerHTML = provas.map(([n, t]) => `<li><b data-conta="${n}">${n.toLocaleString('pt-BR')}</b><span>${t}</span></li>`).join('');

// ---------- Demonstração de cada aplicação ----------
const demo = $<HTMLDialogElement>('#demo'); let palco: Palco | null = null, appAtual: App | null = null, tween: gsap.core.Tween | null = null, auto: gsap.core.Tween | null = null;
function definirMix(m: number, dur = 1.6) {
  if (!palco) return; tween?.kill();
  tween = gsap.to(palco, { mix: m, duration: calmo ? 0 : dur, ease: 'power2.inOut', onUpdate: () => demo.classList.toggle('no-depois', palco!.mix > .5) });
  $$('[data-modo]', demo).forEach(b => b.setAttribute('aria-pressed', String((b.dataset.modo === 'depois') === (m === 1))));
}
function abrirDemo(id: string) {
  const a = app(id), i = apps.indexOf(a), g = guias[id], e = episodio(id), cs = concorrentes.filter(c => c.app === id), subs = substitui(id);
  appAtual = a; demo.style.setProperty('--c', a.color);
  demo.innerHTML = `<header class="demo-topo"><button type="button" class="voltar" data-fechar>← Voltar</button><span class="demo-onde">Por dentro · <b>${a.name}</b> · ${i + 1} de ${apps.length}</span>
    <span class="demo-setas"><button type="button" data-nav="-1" aria-label="Aplicação anterior">←</button><button type="button" data-nav="1" aria-label="Próxima aplicação">→</button><button type="button" data-fechar aria-label="Fechar">×</button></span></header>
  <div class="demo-corpo">
    <div class="demo-texto">
      <p class="rubrica" style="color:var(--c)">${a.category}</p>
      <h2>${a.headline[0]} ${a.headline[1]}</h2>
      <p class="demo-dor"><b>${e.titulo}.</b> ${e.sinopse}</p>
      ${cs.length || subs.length ? `<div class="demo-mercado"><small>Quem costuma resolver hoje</small><p>${cs.length ? cs.map(c => `<b>${c.nome}</b>${c.texto ? ` (${c.texto})` : c.usd != null && c.porUsuario ? ` (US$ ${c.usd.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} por mês cada)` : ''}`).join(', ') : lista.format(subs)}</p></div>` : ''}
      <div class="alterna" role="group" aria-label="Ver antes ou depois"><button type="button" data-modo="antes" aria-pressed="true">Antes</button><button type="button" data-modo="depois" aria-pressed="false">Depois</button></div>
      <ol class="demo-lista">${g.antes.map((x, k) => `<li><span class="la">${x}</span><span class="ld">${g.depois[k]}</span></li>`).join('')}</ol>
      ${g.prova ? `<p class="demo-prova"><b>${g.prova[0]}</b> ${g.prova[1]}</p>` : ''}
      <p class="demo-links"><a href="https://${a.url}" target="_blank" rel="noopener">Abrir o ${a.name} ↗</a> <span>${preco(id) ? `A partir de ${brl(preco(id))}/mês para a empresa` : 'Preço sob consulta'}</span></p>
    </div>
    <div class="demo-palco"><canvas id="palco" aria-label="Maquete 3D do ${a.name}: antes e depois"></canvas><span class="demo-estado"><b class="ea">Antes</b><b class="ed">Depois</b></span><p class="demo-dica">Arraste para girar</p></div>
  </div>`;
  if (!demo.open) { demo.showModal(); smoother?.paused(true); if (!calmo) gsap.fromTo(demo, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .6, ease: 'power3.out' }); }
  palco?.parar(); palco = new Palco($<HTMLCanvasElement>('#palco', demo), true, calmo);
  palco.mostrar(id); palco.rodar(); demo.classList.remove('no-depois');
  // clique do apresentador manda: cancela a passagem automática para o depois
  $$('[data-modo]', demo).forEach(b => b.onclick = () => { auto?.kill(); definirMix(b.dataset.modo === 'depois' ? 1 : 0); });
  $$('[data-nav]', demo).forEach(b => b.onclick = () => { abrirDemo(apps[(i + +b.dataset.nav! + apps.length) % apps.length].id); $(`[data-nav="${b.dataset.nav}"]`, demo).focus(); });
  // Começa no antes e passa sozinho para o depois: o cliente vê o problema antes da solução
  auto?.kill(); auto = gsap.delayedCall(calmo ? 0 : 1.8, () => { if (appAtual === a && palco?.mix === 0) definirMix(1, 2.4); });
}
demo.addEventListener('click', e => { const t = e.target as HTMLElement; if (t.closest('[data-fechar]') || t === demo) demo.close(); });
demo.addEventListener('close', () => { auto?.kill(); palco?.parar(); palco = null; appAtual = null; smoother?.paused(false); });
demo.addEventListener('keydown', e => { if (!appAtual || (e.target as HTMLElement).matches('input')) return; const i = apps.indexOf(appAtual);
  if (e.key === 'ArrowRight') abrirDemo(apps[(i + 1) % apps.length].id); if (e.key === 'ArrowLeft') abrirDemo(apps[(i - 1 + apps.length) % apps.length].id); });
addEventListener('resize', () => palco?.tamanho());
document.addEventListener('click', e => { const b = (e.target as HTMLElement).closest<HTMLElement>('[data-demo]'); if (b) abrirDemo(b.dataset.demo!); });

// ---------- Movimento ----------
if (!calmo) {
  gsap.from('.capa-texto > *', { y: 40, opacity: 0, duration: 1.1, stagger: .1, ease: 'power3.out', delay: .2 });
  $$('.linhas').forEach(el => { if (el.closest('.capa')) return; SplitText.create(el, { type: 'lines', mask: 'lines', autoSplit: true, onSplit: s => gsap.from(s.lines, { yPercent: 105, duration: 1, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } }) }); });
  // Um dia comum: trilho horizontal com o relógio acompanhando
  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px)', () => {
    const trilho = $('#dia-trilho'), rel = $('#relogio'), n = dia.length; let ultimo = -1;
    gsap.to(trilho, { xPercent: -100 * (n - 1) / n, ease: 'none', scrollTrigger: { trigger: '#dia', start: 'top top', end: () => '+=' + innerWidth * (n - 1) * .9, pin: true, scrub: .8, snap: { snapTo: 1 / (n - 1), duration: .5, ease: 'power2.inOut' }, invalidateOnRefresh: true,
      onUpdate: s => { const k = Math.round(s.progress * (n - 1)); if (k !== ultimo) { ultimo = k; gsap.fromTo(rel, { yPercent: 30, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .4 }); rel.textContent = dia[k].hora; } } } });
  });
  // Títulos 3D da série inclinam com a rolagem e com o mouse
  $$('.t3d-corpo').forEach(c => {
    gsap.fromTo(c, { rotateX: 34, rotateY: -16, yPercent: 14 }, { rotateX: 8, rotateY: -6, yPercent: -6, ease: 'none', scrollTrigger: { trigger: c.closest('.destaque')!, start: 'top bottom', end: 'bottom top', scrub: true } });
    const pai = c.closest<HTMLElement>('.destaque')!, rz = gsap.quickTo(c, 'rotateZ', { duration: .8 }), x = gsap.quickTo(c, 'x', { duration: .8 });
    pai.addEventListener('pointermove', e => { const r = pai.getBoundingClientRect(), f = (e.clientX - r.left) / r.width - .5; rz(f * -3); x(f * -40); });
  });
  $$('.trilho').forEach(t => gsap.from(t.children, { x: 80, opacity: 0, duration: .9, stagger: .05, ease: 'power3.out', scrollTrigger: { trigger: t, start: 'top 90%' } }));
  gsap.from('.tm-linha', { y: 24, opacity: 0, duration: .6, stagger: .04, ease: 'power2.out', scrollTrigger: { trigger: '#tabela-mercado', start: 'top 85%' } });
  gsap.from('.razoes li', { y: 50, opacity: 0, duration: .8, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: '.razoes', start: 'top 85%' } });
  gsap.from('.produto', { y: 50, opacity: 0, duration: .8, stagger: .05, ease: 'power3.out', scrollTrigger: { trigger: '.grade-produtos', start: 'top 85%' } });
  $$('[data-conta]').forEach(b => { const o = { v: 0 }; gsap.to(o, { v: +b.dataset.conta!, duration: 2, ease: 'power2.out', scrollTrigger: { trigger: b, start: 'top 90%' }, onUpdate: () => { b.textContent = Math.round(o.v).toLocaleString('pt-BR'); } }); });
}
addEventListener('load', () => ScrollTrigger.refresh());
