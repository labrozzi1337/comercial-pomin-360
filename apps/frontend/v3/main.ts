// Apresentação v3 · "O molho de chaves". 11 cenas: o molho no porta-chaves, as perguntas trancadas, o dia perdido,
// as chaves do cliente e o peso delas, a virada (tudo em um, uma chave só), o mapa do que sai, as aplicações e o placar.
// As chaves escolhidas pelo cliente (cena 3) personalizam a conta, o mapa, a vitrine e o fechamento.
import './base.css';
import './apresentacao.css';
import './simulador.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SplitText } from 'gsap/SplitText';
import { apps, categorias, dores, provas, tools } from '../src/data';
import { concorrentes, cotacao } from '../apresentacao/dados';
import { app, armarioDe, brl, brlc, chaves, exemplo, fluxo, img, logo, pergunta, rotas, trailers, type Chave } from './dados';
import { guiaApp, guiaCena, ligarCopiar } from './guia-conteudo';
import { mercadoDe, montarSimulador } from './simulador';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);
const $ = <T extends HTMLElement = HTMLElement>(s: string, el: ParentNode = document) => el.querySelector(s) as T;
const $$ = <T extends HTMLElement = HTMLElement>(s: string, el: ParentNode = document) => [...el.querySelectorAll(s)] as T[];
const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches, desk = matchMedia('(min-width: 981px)').matches;
const lista = new Intl.ListFormat('pt-BR', { type: 'conjunction' });
const guardar = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sem armazenamento: segue sem lembrar */ } };
const ler = <T>(k: string, padrao: T): T => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) as T : padrao; } catch { return padrao; } };
const canal = new BroadcastChannel('p360-v3');

// ---------- Estado: cliente, chaves escolhidas, pessoas ----------
let cliente = new URLSearchParams(location.search).get('cliente') ?? ler('p360-cliente', '');
const escolhidas = new Set<string>(ler<string[]>('p360-chaves', []));
let pessoas = ler('p360-pessoas', 50);
const doMolho = (): Chave[] => { const sel = chaves.filter(c => escolhidas.has(c.nome)); return sel.length ? sel : chaves.filter(c => exemplo.includes(c.nome)); };
const ehExemplo = () => !chaves.some(c => escolhidas.has(c.nome));
const appsDoMolho = () => [...new Set(doMolho().sort((a, b) => (b.porPessoa ?? 0) - (a.porPessoa ?? 0)).map(c => c.app))];
function definirCliente(nome: string, avisar = true) {
  cliente = nome.trim(); guardar('p360-cliente', cliente);
  $('#para-cliente').textContent = cliente ? `uma apresentação para ${cliente}` : 'apresentação comercial';
  if (avisar) canal.postMessage({ tipo: 'cliente', nome: cliente });
}
definirCliente(cliente, false);

// A chave de cada ferramenta, com o logo feito na própria chave (imagem do Codex)
const chaveHTML = (c: Chave) => `<span class="chave-obj"><img src="${img(c.imagem)}" alt="" loading="lazy" width="720" height="720" /></span>`;

// ---------- Rolagem suave e navegação por cenas ----------
const smoother = calmo ? null : ScrollSmoother.create({ wrapper: '#smooth-wrapper', content: '#smooth-content', smooth: 1.1, effects: true, smoothTouch: .1 });
const cenas = $$('.cena');
let atual = 0, appGuia: string | null = null;
const ir = (i: number) => { const s = cenas[Math.max(0, Math.min(cenas.length - 1, i))]; if (smoother) smoother.scrollTo(s, true, 'top top'); else s.scrollIntoView({ behavior: calmo ? 'auto' : 'smooth' }); };
// menu âncora: um nome curto por cena (o nome completo fica no title)
const curto: Record<string, string> = { molho: 'O molho', armarios: 'Armários', pergunta: 'O dia', chaves: 'As chaves', peso: 'A conta', virada: 'A virada', lugar: 'O lugar', nomes: 'Confrontos', aplicacoes: 'Aplicações', numeros: 'Uso real', fim: 'Fechamento' };
const ancoras = $('#ancoras');
ancoras.innerHTML = cenas.map((c, i) => `<a href="#${c.id}" data-cena-ir="${i}" title="${c.dataset.nome}">${curto[c.id] ?? c.dataset.nome}</a>`).join('');
document.addEventListener('click', e => { const b = (e.target as HTMLElement).closest<HTMLElement>('[data-cena-ir]'); if (b) { e.preventDefault(); ir(+b.dataset.cenaIr!); } });
$('#ant').addEventListener('click', () => ir(atual - 1)); $('#prox').addEventListener('click', () => ir(atual + 1));
function marcar(i: number) {
  if (i === atual && $('#onde').textContent) return;
  atual = i; $('#onde').textContent = `${String(i).padStart(2, '0')} · ${cenas[i].dataset.nome}`;
  $$('#ancoras a').forEach((a, k) => { a.classList.toggle('on', k === i); if (k === i) { a.setAttribute('aria-current', 'step'); ancoras.scrollTo({ left: a.offsetLeft - ancoras.clientWidth / 2 + a.offsetWidth / 2, behavior: calmo ? 'auto' : 'smooth' }); } else a.removeAttribute('aria-current'); });
  if (!appGuia) $('#guia').innerHTML = guiaCena(i);
  canal.postMessage({ tipo: 'cena', i, nome: cenas[i].dataset.nome });
}
// sobre as cenas claras, o menu transparente troca para texto escuro
const menu = $('#menu');
cenas.filter(c => c.classList.contains('papel')).forEach(c => ScrollTrigger.create({ trigger: c, start: 'top 40px', end: 'bottom 40px', refreshPriority: -1, onToggle: s => menu.classList.toggle('claro', s.isActive) }));
// refreshPriority -1: as marcas são medidas depois das cenas presas (pin), senão apontam para a cena errada
cenas.forEach((c, i) => ScrollTrigger.create({ trigger: c, start: 'top 55%', end: 'bottom 55%', refreshPriority: -1, onToggle: s => { if (s.isActive) { appGuia = null; marcar(i); } } }));

// ---------- Guia (gaveta G ou outra janela), preços (P, só comercial), tela cheia (F) ----------
const gaveta = $('#gaveta');
const guia = (abrir = !gaveta.classList.contains('aberta')) => { gaveta.classList.toggle('aberta', abrir); gaveta.setAttribute('aria-hidden', String(!abrir)); };
ligarCopiar(gaveta);
$('#bt-guia').addEventListener('click', () => guia()); $('#fechar-guia').addEventListener('click', () => guia(false));
$('#guia-janela').addEventListener('click', () => { window.open('/v3/guia/', 'p360-guia', 'width=520,height=920'); guia(false); setTimeout(() => canal.postMessage({ tipo: 'cena', i: atual, nome: cenas[atual].dataset.nome }), 900); });
const dlg = $<HTMLDialogElement>('#precos');
// o simulador já abre com as aplicações do molho do cliente, as pessoas e a comparação com o que ele paga hoje
const precos = () => { montarSimulador(dlg, { apps: appsDoMolho(), pessoas, cliente, mercado: mercadoDe(doMolho()) }); dlg.showModal(); };
document.addEventListener('click', e => { if ((e.target as HTMLElement).closest('[data-simulador]')) precos(); else if ((e.target as HTMLElement).closest('[data-abrir-guia]')) guia(true); });
dlg.addEventListener('click', e => { if ((e.target as HTMLElement).closest('[data-fechar]') || e.target === dlg) dlg.close(); });
$('#bt-precos').addEventListener('click', precos);
const telaCheia = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(() => {});
addEventListener('keydown', e => {
  if ((e.target as HTMLElement).closest('input, textarea, select') || dlg.open) return;
  const k = e.key;
  if (k === 'ArrowRight' || k === 'PageDown') { e.preventDefault(); ir(atual + 1); }
  else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); ir(atual - 1); }
  else if (k === 'g' || k === 'G') guia();
  else if (k === 'p' || k === 'P') precos();
  else if (k === 'f' || k === 'F') telaCheia();
  else if (k === 'Escape') guia(false);
});
canal.onmessage = ({ data: d }) => {
  if (d?.tipo === 'ir') ir(d.i);
  else if (d?.tipo === 'cliente') { definirCliente(d.nome, false); vitrine(); }
  else if (d?.tipo === 'rota') { guardar('p360-rota', d.rota); vitrine(); }
  else if (d?.tipo === 'ola') canal.postMessage({ tipo: 'cena', i: atual, nome: cenas[atual].dataset.nome, cliente, chaves: [...escolhidas], pessoas });
};

// ---------- 1 · Cada chave, um armário: as perguntas trancadas encontram a resposta ----------
const cadeado = (aberto: boolean) => `<svg class="cadeado" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="${aberto ? 'M8 11V7a4 4 0 0 1 7.6-1.8' : 'M8 11V8a4 4 0 0 1 8 0v3'}" /><circle cx="12" cy="16" r="1.3" /></svg>`;
// [x, y] no computador e [x, y] no celular (em duas colunas desencontradas, abaixo do título)
const posBalao = [[46, 14, 4, 37], [69, 22, 38, 46], [50, 38, 4, 55], [73, 47, 38, 64], [47, 62, 4, 73], [70, 72, 38, 82]];
$('#baloes').innerHTML = dores.map((d, k) => `<div class="balao" style="--x:${posBalao[k][0]}%;--y:${posBalao[k][1]}%;--mx:${posBalao[k][2]}%;--my:${posBalao[k][3]}%"><small>${cadeado(false)}${d.de} · trancado em: ${armarioDe[d.app]}</small>${d.fala}</div>`).join('');
$('#pg-cards').innerHTML = dores.map(d => { const a = app(d.app); return `<a class="pg-card" href="/v3/produto/?app=${a.id}" style="--c:${a.color}"><span class="pg-card-cab">${cadeado(true)}<s>${d.fala}</s></span><span class="pg-app"><i aria-hidden="true">${a.icon}</i>${a.name}</span><b>${d.resposta}</b></a>`; }).join('');

// ---------- 2 · A pergunta simples ----------
const fechadura = `<svg viewBox="0 0 100 160" aria-hidden="true"><circle cx="50" cy="48" r="36" /><path d="M31 66 L17 158 H83 L69 66 Z" /></svg>`;
$('#pergunta-trilho').innerHTML = pergunta.map(p => `<article class="parada${p.armario ? '' : ' marco'}">
    <div class="parada-foto"><img src="${img(p.foto)}" alt="" loading="lazy" /></div>
    <p class="parada-hora">${p.hora} <span>${p.quem}</span></p>
    <p class="parada-texto">${p.texto}</p>
    ${p.armario ? `<p class="parada-armario">${fechadura}Armário aberto: <b>${p.armario}</b></p>` : ''}
  </article>`).join('') + `<article class="parada-fim"><h2 class="titulo-m">A resposta existia. Estava <em>trancada em armários diferentes</em>.</h2></article>`;

// ---------- 3 · As chaves (com o logo de cada ferramenta) ----------
$('#galeria').innerHTML = chaves.map(c => `<button type="button" class="chave" data-nome="${c.nome}" aria-pressed="${escolhidas.has(c.nome)}" style="--giro:${c.giro}deg">
    ${chaveHTML(c)}<span class="etiqueta"><b>${c.nome}</b><small>${c.preco}</small></span>
  </button>`).join('');
$('#galeria').addEventListener('click', e => {
  const b = (e.target as HTMLElement).closest<HTMLButtonElement>('.chave'); if (!b) return;
  const n = b.dataset.nome!, on = !escolhidas.has(n); on ? escolhidas.add(n) : escolhidas.delete(n);
  b.setAttribute('aria-pressed', String(on));
  if (!calmo) gsap.fromTo(b.querySelector('.chave-obj'), { y: on ? 0 : -14 }, { y: on ? -14 : 0, rotation: on ? 8 : 0, duration: .5, ease: 'back.out(2)' });
  guardar('p360-chaves', [...escolhidas]); atualizarMolho();
});
function bolso() {
  const sel = chaves.filter(c => escolhidas.has(c.nome)), por = sel.reduce((s, c) => s + (c.porPessoa ?? 0), 0);
  $('#bolso').innerHTML = sel.length
    ? `<p><b>${sel.length} ${sel.length > 1 ? 'chaves' : 'chave'} no molho</b><span>${por ? `${brl(por)} por pessoa, todo mês, só nas que cobram por pessoa` : 'Nenhuma delas cobra por pessoa'}</span></p><span class="bolso-acoes"><button type="button" class="bt bt-linha bt-pequeno" id="limpar">Limpar</button><button type="button" class="bt bt-claro bt-pequeno" data-cena-ir="4">Pesar o molho →</button></span>`
    : `<p><b>Nenhuma chave escolhida</b><span>Sem escolha, a conta usa um exemplo: ${lista.format(exemplo)}.</span></p><span class="bolso-acoes"><button type="button" class="bt bt-linha bt-pequeno" data-cena-ir="4">Usar o exemplo →</button></span>`;
  $('#limpar')?.addEventListener('click', () => { escolhidas.clear(); guardar('p360-chaves', []); $$('.chave').forEach(b => b.setAttribute('aria-pressed', 'false')); atualizarMolho(); });
}

// ---------- 4 · O peso do molho ----------
const valor = { mes: 0 };
function peso() {
  const sel = doMolho(), cobra = sel.filter(c => c.porPessoa != null), fora = sel.filter(c => c.porPessoa == null);
  const n = sel.length, por = cobra.reduce((s, c) => s + c.porPessoa!, 0), mes = por * pessoas;
  const dolar = cobra.filter(c => { const k = concorrentes.find(x => x.nome === c.nome || x.nome.startsWith(c.nome)); return k && !k.texto; });
  $('#faturas').innerHTML = sel.map((c, i) => `<article class="fatura" style="--i:${i - (n - 1) / 2};--n:${n}">
      <p class="fatura-cab"><span>Fatura</span><span>${String(i + 1).padStart(2, '0')}/${String(n).padStart(2, '0')}</span></p>
      <h3><i aria-hidden="true">${logo(c.nome)}</i>${c.nome}</h3>
      ${c.porPessoa != null ? `<p class="fatura-conta">${brlc(c.porPessoa)} × ${pessoas.toLocaleString('pt-BR')} pessoas</p><p class="fatura-total">${brl(c.porPessoa * pessoas)}<small>/mês</small></p>` : `<p class="fatura-conta">${c.cobranca}</p><p class="fatura-total fora">fora da soma</p>`}
      ${c.fonte ? `<a href="${c.fonte}" target="_blank" rel="noopener">Preço de tabela no site oficial</a>` : '<span class="fatura-fonte">sem preço avulso</span>'}
    </article>`).join('');
  $('#peso-total').innerHTML = `
    <p class="rotulo">${ehExemplo() ? `Exemplo: ${lista.format(sel.map(c => c.nome))}` : 'O molho de ' + (cliente || 'vocês')}</p>
    <p class="peso-mes"><b id="peso-mes">${brl(valor.mes)}</b> por mês</p>
    <p class="peso-ano">${brl(mes * 12)} por ano.${dolar.length ? ' Boa parte em dólar, que muda todo dia.' : ''}</p>
    ${n > 1 ? `<p class="peso-oculto">E o que não aparece na fatura: <b>${n} senhas. ${n} contratos. ${n} lugares</b> onde a informação se perde. Nenhuma resposta que cruze os ${n}.</p>` : ''}
    ${fora.length ? `<p class="nota">${lista.format(fora.map(c => c.nome))} não ${fora.length > 1 ? 'cobram' : 'cobra'} por pessoa e ${fora.length > 1 ? 'ficaram' : 'ficou'} fora da soma.</p>` : ''}
    <p class="nota">Preço de tabela público, sem promoções, consultado em ${cotacao.data}. Dólar pela ${cotacao.fonte} do dia (R$ ${cotacao.brl.toLocaleString('pt-BR')}).</p>`;
  gsap.to(valor, { mes, duration: calmo ? 0 : 1.2, ease: 'power3.out', overwrite: true, onUpdate: () => { const el = document.getElementById('peso-mes'); if (el) el.textContent = brl(valor.mes); } });
}
$<HTMLInputElement>('#pessoas').value = String(pessoas);
const mudarPessoas = (n: number) => { pessoas = Math.max(1, Math.min(5000, Math.round(n) || 1)); $<HTMLInputElement>('#pessoas').value = String(pessoas); guardar('p360-pessoas', pessoas); peso(); };
$('#pessoas').addEventListener('change', e => mudarPessoas(+(e.target as HTMLInputElement).value));
$$('[data-mais]').forEach(b => b.addEventListener('click', () => mudarPessoas(pessoas + +b.dataset.mais!)));

// ---------- 5 · A virada: as chaves entram no aro, e o aro vira a chave P360 ----------
function viradaChaves() {
  const sel = doMolho().slice(0, 9), n = sel.length;
  $('#virada-chaves').innerHTML = sel.map((c, i) => {
    const g = n === 1 ? 90 : 62 + (56 / (n - 1)) * i, a = g * Math.PI / 180; // pontos na parte de baixo do aro
    return `<span class="vk" style="--x:${50 + Math.cos(a) * 32}%;--y:${50 + Math.sin(a) * 32}%;--r:${(90 - g) * -.6}deg">${chaveHTML(c)}</span>`;
  }).join('');
}

// ---------- 6 · O lugar: a planta do prédio ----------
const nomeCategoria: Record<string, string> = { 'IA & criação': 'Ala de IA e criação', 'Gestão & inteligência': 'Ala de gestão e inteligência', 'Operação & execução': 'Ala de operação', 'Relacionamento': 'Ala de relacionamento' };
$('#planta').insertAdjacentHTML('afterbegin', categorias.map((cat, k) => `<div class="ala ala-${k}"><p class="ala-nome">${nomeCategoria[cat]}</p><div class="salas">${apps.filter(a => a.category === cat).map(a => `<a class="sala" href="/v3/produto/?app=${a.id}" data-app="${a.id}" style="--c:${a.color}"><span class="sala-ico">${a.icon}</span><b>${a.name}</b><small>${a.summary}</small></a>`).join('')}</div></div>`).join('') + `<div class="atrio"><img src="/images/icone-p360.webp" alt="" width="64" height="64" /><span>Uma entrada</span></div>`);
$('#fluxo').innerHTML = fluxo.map((f, i) => `<li data-passo="${i}"><span>${String(i + 1).padStart(2, '0')}</span>${f.texto}</li>`).join('');
const svgPlanta = $('#planta-linhas') as unknown as SVGSVGElement;
svgPlanta.innerHTML = fluxo.map((_, i) => `<path data-passo="${i}" pathLength="1" />`).join('');
// posição de layout (sem transformações) do centro de um elemento, relativa a um ancestral
const centro = (el: HTMLElement | null, ate: HTMLElement) => { const w = el!.offsetWidth, h = el!.offsetHeight; let x = 0, y = 0; while (el && el !== ate) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent as HTMLElement | null; } return [x + w / 2, y + h / 2, w, h]; };
function linhasPlanta() {
  const p = $('#planta'); svgPlanta.setAttribute('viewBox', `0 0 ${p.offsetWidth} ${p.offsetHeight}`);
  svgPlanta.querySelectorAll('path').forEach((el, i) => { const f = fluxo[i], [x1, y1] = centro($(`.sala[data-app="${f.de}"]`), p), [x2, y2] = centro($(`.sala[data-app="${f.para}"]`), p), mx = (x1 + x2) / 2; el.setAttribute('d', `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`); });
}
$('#planta').addEventListener('pointerover', e => {
  const id = (e.target as HTMLElement).closest<HTMLElement>('.sala')?.dataset.app;
  const ligadas = id ? new Set(fluxo.filter(f => f.de === id || f.para === id).flatMap(f => [f.de, f.para])) : new Set<string>();
  $$('.sala').forEach(x => x.classList.toggle('ligada', !!id && ligadas.has(x.dataset.app!) && x.dataset.app !== id));
});

// ---------- 7 · Os confrontos: o mapa do que o Pomin360 substitui ----------
const precoDe = (nome: string) => chaves.find(c => c.nome === nome || (nome === 'Google Sheets' && c.nome === 'Planilhas'))?.preco ?? 'sem preço avulso';
const comFerramenta = apps.filter(a => tools.some(t => t.app === a.id)), semFerramenta = apps.filter(a => !tools.some(t => t.app === a.id));
const linhasMapa = [...comFerramenta, ...semFerramenta];
const mapa = $('#mapa'), svgMapa = $('#mapa-linhas') as unknown as SVGSVGElement;
// cada linha do grid: as ferramentas do mercado à esquerda e a aplicação que as substitui à direita (no celular, uma embaixo da outra)
mapa.insertAdjacentHTML('beforeend', `<button type="button" class="p360-tile" id="p360-tile" aria-expanded="false"><img src="/images/logo-p360.webp" alt="Pomin360" width="520" height="154" /><b>Entra no lugar de ${tools.length} ferramentas</b><small>Toque para ver as aplicações</small></button>` + linhasMapa.map((a, i) => `<div class="mapa-linha" data-app="${a.id}" style="--r:${i + 2}">${tools.filter(t => t.app === a.id).map(t => `<span class="logo-tile" data-app="${a.id}"><i aria-hidden="true">${logo(t.name)}</i><b>${t.name === 'Google Sheets' ? 'Planilhas' : t.name}</b><small>${precoDe(t.name)}</small></span>`).join('') || '<span class="logo-tile manual"><b>Planilha, e-mail e pasta</b><small>o custo vem em horas</small></span>'}</div><button type="button" class="app-tile" data-app="${a.id}" style="--c:${a.color};--r:${i + 2}" aria-pressed="false"><i aria-hidden="true">${a.icon}</i><b>${a.name}</b></button>`).join(''));
mapa.style.setProperty('--n', String(linhasMapa.length + 1));
svgMapa.innerHTML = linhasMapa.map(a => `<path data-app="${a.id}" pathLength="1" />`).join('');
let aberto = false, foco: string | null = null;
function linhasMapaDesenhar() {
  const W = mapa.offsetWidth, H = mapa.offsetHeight; svgMapa.setAttribute('viewBox', `0 0 ${W} ${H}`);
  const alvoP360 = centro($('#p360-tile'), mapa);
  svgMapa.querySelectorAll('path').forEach(p => {
    const id = p.dataset.app!, linha = $(`.mapa-linha[data-app="${id}"]`), [lx, ly, lw] = centro(linha, mapa);
    const ultimo = linha.lastElementChild as HTMLElement, [ux, , uw] = centro(ultimo, mapa);
    const x1 = Math.min(lx + lw / 2, ux + uw / 2) + 8, y1 = ly;
    const [tx, ty, tw] = aberto ? centro($(`.app-tile[data-app="${id}"]`), mapa) : alvoP360, x2 = tx - tw / 2 - 8, y2 = ty, mx = (x1 + x2) / 2;
    p.setAttribute('d', `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`);
  });
}
function resumoMapa() {
  const r = $('#mapa-resumo');
  if (!aberto) { r.innerHTML = `O Pomin360 entra no lugar de <b>${tools.length} ferramentas</b>: ${tools.length} faturas, ${tools.length} contratos e ${tools.length} senhas a menos.`; return; }
  if (!foco) { r.innerHTML = 'Toque numa aplicação para ver o que ela substitui.'; return; }
  const a = app(foco), ts = tools.filter(t => t.app === foco);
  r.innerHTML = ts.length ? `<b>${a.name}</b> substitui ${lista.format(ts.map(t => `${t.name === 'Google Sheets' ? 'as planilhas' : t.name} <span>(${precoDe(t.name)})</span>`))}.` : `<b>${a.name}</b> substitui o que hoje fica em planilha, e-mail e pasta compartilhada. O custo não vem em fatura: vem em horas.`;
}
function estadoMapa() {
  mapa.classList.toggle('aberto', aberto); mapa.classList.toggle('foco', !!foco);
  $('#p360-tile').setAttribute('aria-expanded', String(aberto)); $('#p360-tile small').textContent = aberto ? 'Toque para ver o Pomin360 inteiro' : 'Toque para ver as aplicações';
  $$('.app-tile').forEach(b => { const on = b.dataset.app === foco; b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); });
  $$('.mapa-linha').forEach(l => l.classList.toggle('on', l.dataset.app === foco));
  svgMapa.querySelectorAll('path').forEach(p => p.classList.toggle('on', p.dataset.app === foco));
  linhasMapaDesenhar(); resumoMapa();
}
$('#p360-tile').addEventListener('click', () => {
  aberto = !aberto; foco = null; estadoMapa();
  // fromTo explícito: o CSS faz transição de opacidade e o GSAP leria o valor do começo dela
  if (aberto && !calmo) gsap.fromTo('.app-tile', { autoAlpha: 0, x: 30 }, { autoAlpha: 1, x: 0, duration: .5, stagger: .035, ease: 'power3.out', clearProps: 'opacity,visibility,transform' });
  if (!calmo) gsap.fromTo('#mapa-linhas path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .8, stagger: .02, ease: 'power2.out' });
});
mapa.addEventListener('click', e => { const b = (e.target as HTMLElement).closest<HTMLElement>('.app-tile'); if (b) { foco = foco === b.dataset.app ? null : b.dataset.app!; estadoMapa(); } });
mapa.addEventListener('click', e => { const t = (e.target as HTMLElement).closest<HTMLElement>('.logo-tile'); if (t && aberto) { foco = foco === t.dataset.app ? null : t.dataset.app ?? null; estadoMapa(); } });
$('#nota-fontes').textContent = `Preços de tabela públicos, sem promoções, plano anual, consultados nos sites oficiais em ${cotacao.data}. Dólar pela ${cotacao.fonte} do dia (R$ ${cotacao.brl.toLocaleString('pt-BR')}). Os nomes e logos citados são marcas dos seus donos.`;

// ---------- 8 · As aplicações: o que cada uma faz, com a foto do "depois" ----------
function vitrine() {
  const doCliente = !ehExemplo(), rota = rotas[ler('p360-rota', 'completa')] ?? rotas.completa;
  const primeiro = doCliente ? appsDoMolho() : rota.apps, ordem = [...new Set([...primeiro, ...rota.apps, ...apps.map(a => a.id)])];
  const marcados = new Set(doCliente ? appsDoMolho() : []);
  $('#vitrine').innerHTML = ordem.map((id, i) => { const a = app(id), m = trailers[id]; return `<a class="app-card${i === 0 ? ' destaque' : ''}" href="/v3/produto/?app=${id}" style="--c:${a.color}">
      <img src="${img('v3-d-' + id)}" alt="" loading="lazy" width="1536" height="1024" />
      ${marcados.has(id) ? `<span class="app-selo">Para ${cliente || 'a sua empresa'}</span>` : ''}
      <span class="app-txt"><small><i aria-hidden="true">${a.icon}</i>${a.name}</small><b>${m.frase}</b><span>${a.summary}</span><em>Ver o vídeo e o antes e depois →</em></span></a>`; }).join('');
}

// ---------- 9 · O placar ----------
const appProva = ['chat', 'sac', 'cs', 'mkt', 'report'];
const odometro = (n: number) => n.toLocaleString('pt-BR').split('').map(ch => /\d/.test(ch) ? `<span class="dig" data-d="${ch}"><span class="fita">${'0123456789'.split('').map(d => `<span>${d}</span>`).join('')}</span></span>` : `<span class="sep">${ch}</span>`).join('');
$('#placar').innerHTML = provas.map(([n, t], i) => { const a = app(appProva[i]); return `<li style="--c:${a.color}"><span class="odo" aria-label="${n.toLocaleString('pt-BR')}">${odometro(n)}</span><span class="placar-rot"><b>${t.replace(/ no Pomin\w+$/, '')}</b><small><i aria-hidden="true">${a.icon}</i>${a.name}</small></span><i class="placar-linha" aria-hidden="true"></i></li>`; }).join('');

// ---------- 10 · Devolva o molho: as chaves velhas riscadas ----------
function lixo() {
  const sel = doMolho(), resto = chaves.filter(c => !sel.includes(c) && c.porPessoa != null), pilha = [...sel, ...resto].slice(0, Math.max(8, sel.length)).slice(0, 12);
  const pos = [[6, 8, -18], [36, 4, 12], [64, 12, -8], [14, 36, 24], [44, 32, -26], [72, 40, 16], [4, 62, 8], [32, 60, -14], [60, 66, 28], [20, 84, -6], [50, 86, 20], [78, 76, -22]];
  $('#fim-lixo').innerHTML = pilha.map((c, i) => `<span class="lixo" style="--x:${pos[i][0]}%;--y:${pos[i][1]}%;--r:${pos[i][2]}deg">${chaveHTML(c)}<span class="lixo-nome">${c.nome}</span><svg class="risco" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M8 78 C 30 66, 52 48, 92 22" pathLength="1" /><path d="M14 30 C 40 44, 62 58, 90 80" pathLength="1" /></svg></span>`).join('');
  const top = appsDoMolho()[0] ?? 'chat';
  $('#fim-acoes').innerHTML = `<a class="bt bt-marca" href="/v3/produto/?app=${top}">Começar pelo ${app(top).name}</a><button type="button" class="bt bt-linha" data-cena-ir="8">Ver as aplicações</button>`;
}

function atualizarMolho() { bolso(); peso(); viradaChaves(); vitrine(); lixo(); }
atualizarMolho(); estadoMapa();

// ---------- Movimento ----------
document.fonts.ready.then(() => {
  if (calmo) { gsap.set('.chave-p360, .virada-texto > *', { autoAlpha: 1 }); gsap.set('#virada-chaves, .aro', { autoAlpha: 0 }); gsap.set('.pg-depois', { clipPath: 'none' }); linhasPlanta(); linhasMapaDesenhar(); gsap.set('#planta-linhas path', { strokeDashoffset: 0 }); gsap.set('.risco path', { strokeDashoffset: 0 }); $$('.dig').forEach(d => { (d.firstElementChild as HTMLElement).style.transform = `translateY(-${+d.dataset.d! * 10}%)`; }); marcar(0); return; }

  gsap.from('.menu, .controle', { autoAlpha: 0, duration: .8, delay: .4 });
  // Linhas de texto entram em máscara
  $$('.linhas').forEach(el => {
    const sp = SplitText.create(el, { type: 'lines', mask: 'lines' });
    gsap.from(sp.lines, { yPercent: 105, duration: 1.1, stagger: .1, ease: 'power4.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
  });

  // 0 · Os molhos pendurados nos pinos: cada um balança no seu ritmo, mais com o mouse e com a rolagem (o pivô vem do CSS)
  const pendulos = $$('.molho-pendulo'), giros = pendulos.map((p, i) => gsap.quickTo(p, 'rotation', { duration: 1.6 + i * .25, ease: 'elastic.out(1, .3)' }));
  pendulos.forEach((p, i) => gsap.to(p.querySelector('img'), { rotation: 1.2 + (i % 3) * .5, duration: 2.4 + i * .35, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * .4 }));
  const girar = (v: number) => giros.forEach((g, i) => g(v * (pendulos[i].classList.contains('pequeno') ? 1.3 : 1)));
  $('#molho').addEventListener('pointermove', e => girar((e.clientX / innerWidth - .5) * 8));
  ScrollTrigger.create({ trigger: '#molho', start: 'top top', end: 'bottom top', onUpdate: s => girar(s.getVelocity() / -300) });
  gsap.from('.parede', { autoAlpha: 0, y: -20, duration: 1.2, ease: 'power3.out', delay: .2 });
  gsap.from('.molho-rotulo, .molho-sub, .molho-tags li, .molho-rolar', { autoAlpha: 0, y: 16, duration: .8, stagger: .06, ease: 'power3.out', delay: .6 });
  gsap.from(pendulos, { rotation: -14, duration: 2.4, ease: 'elastic.out(1, .25)', delay: .5, stagger: .15 });

  // 1 · As perguntas aparecem trancadas; a tela vira marca e elas viram respostas
  const bal = $$('.balao');
  gsap.timeline({ scrollTrigger: { trigger: '#armarios', start: 'top top', end: '+=300%', scrub: 1, pin: true } })
    .fromTo('.pg-antes', { scale: 1.15 }, { scale: 1, duration: 1.2, ease: 'none' }, 0)
    .from(bal, { scale: 0, autoAlpha: 0, rotation: () => gsap.utils.random(-12, 12), y: 40, duration: .5, stagger: .16, ease: 'back.out(2)' }, .1)
    .to(bal, { y: () => gsap.utils.random(-24, 24), x: () => gsap.utils.random(-24, 24), duration: .7, ease: 'sine.inOut' }, 1)
    .to('.pg-dica', { autoAlpha: 0, duration: .3 }, 1.3)
    .fromTo('.pg-depois', { clipPath: 'circle(0% at 74% 40%)' }, { clipPath: 'circle(130% at 74% 40%)', duration: 1.3, ease: 'power2.inOut' }, 1.5)
    .to(bal, { left: '74%', top: '40%', xPercent: -50, yPercent: -50, x: 0, y: 0, scale: .15, autoAlpha: 0, rotation: 0, duration: .9, stagger: .04, ease: 'power3.in' }, 1.5)
    .to('.pg-h.antes, .pg-tag.antes', { y: -40, autoAlpha: 0, duration: .5 }, 1.7)
    .fromTo('.pg-h.depois, .pg-tag.depois', { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .6 }, 2.1)
    .from('.pg-card', { y: 80, autoAlpha: 0, rotationX: -35, duration: .6, stagger: .12, ease: 'expo.out' }, 2.4)
    .to({}, { duration: .6 });

  // 2 · O dia anda na horizontal; o relógio acompanha
  const trilho = $('#pergunta-trilho'), relogio = $('#relogio');
  const minutos = (h: string) => { const [a, b] = h.split(':').map(Number); return a * 60 + b; }, ini = minutos(pergunta[0].hora), fim = minutos(pergunta.at(-1)!.hora);
  gsap.to(trilho, { x: () => -(trilho.scrollWidth - innerWidth), ease: 'none', scrollTrigger: { trigger: '#pergunta', start: 'top top', end: () => '+=' + (trilho.scrollWidth - innerWidth), scrub: 1, pin: true, invalidateOnRefresh: true,
    onUpdate: s => { const m = Math.round(ini + (fim - ini) * Math.min(1, s.progress * 1.18)); relogio.textContent = `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; } } });

  // 3 · As chaves entram na galeria
  gsap.from('.chave', { autoAlpha: 0, y: 40, rotation: -6, duration: .8, stagger: { each: .03, from: 'random' }, ease: 'power3.out', scrollTrigger: { trigger: '#galeria', start: 'top 80%' } });

  // 4 · As faturas abrem em leque
  ScrollTrigger.create({ trigger: '#faturas', start: 'top 75%', onEnter: () => { valor.mes = 0; peso(); gsap.from('.fatura', { y: 120, autoAlpha: 0, duration: 1, stagger: .07, ease: 'power3.out' }); } });

  // 5 · A virada: as chaves são puxadas para dentro do aro; o aro de aço vira o anel do P360 e a lâmina nasce dele
  gsap.set('.virada-texto > *', { autoAlpha: 0, y: 30 });
  gsap.set('.chave-p360', { autoAlpha: 0, clipPath: 'circle(24% at 26.04% 36.52%)' });
  const vt = gsap.timeline({ scrollTrigger: { trigger: '#virada', start: 'top top', end: '+=280%', scrub: 1, pin: true } });
  vt.to('.virada-0', { autoAlpha: 1, y: 0, duration: .15 })
    .to('.vk', { left: '50%', top: '50%', scale: .12, rotation: '+=160', autoAlpha: 0, duration: .55, stagger: .07, ease: 'power2.in' }, .1)
    .to('.aro', { scale: 1.06, duration: .12, yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, '>-.05')
    .to('.chave-p360', { autoAlpha: 1, duration: .3, ease: 'none' })
    .to('.aro', { autoAlpha: 0, duration: .3, ease: 'none' }, '<')
    .to('.chave-p360', { clipPath: 'circle(130% at 26.04% 36.52%)', duration: .5, ease: 'power2.inOut' })
    .fromTo('.brilho', { backgroundPosition: '120% 0' }, { backgroundPosition: '-60% 0', duration: .5, ease: 'none' }, '-=.2')
    .to('.chave-p360', { scale: desk ? .62 : .5, x: desk ? '-14%' : '-22%', y: '6%', rotation: -6, duration: .5, ease: 'power3.inOut' }, '-=.1')
    .to('.virada-1', { autoAlpha: 1, y: 0, duration: .25 }, '-=.25')
    .to('.virada-2', { autoAlpha: 1, y: 0, duration: .25 }, '+=.1')
    .to({}, { duration: .25 });
  const kx = gsap.quickTo('.chave-giro', 'rotationY', { duration: 1.2 }), ky = gsap.quickTo('.chave-giro', 'rotationX', { duration: 1.2 });
  $('#virada').addEventListener('pointermove', e => { kx((e.clientX / innerWidth - .5) * 22); ky((e.clientY / innerHeight - .5) * -14); });

  // 6 · A planta: as portas internas se acendem em sequência (no celular, sem prender a tela)
  linhasPlanta();
  const pt = gsap.timeline({ scrollTrigger: desk ? { trigger: '#lugar', start: 'top top', end: '+=220%', scrub: 1, pin: true } : { trigger: '#planta', start: 'top 70%', end: 'bottom 40%', scrub: 1 } });
  pt.from('.sala', { autoAlpha: 0, y: 20, stagger: .03, duration: .3 });
  fluxo.forEach((f, i) => {
    pt.to(`#planta-linhas path[data-passo="${i}"]`, { strokeDashoffset: 0, duration: .5, ease: 'none' })
      .to(`.sala[data-app="${f.de}"], .sala[data-app="${f.para}"]`, { '--aceso': 1, duration: .2 }, '<')
      .to(`#fluxo li[data-passo="${i}"]`, { opacity: 1, x: 0, duration: .25 }, '<');
  });
  pt.from('.lugar-fecho span', { autoAlpha: 0, y: 20, stagger: .08, duration: .3 });

  // 7 · O mapa entra com as linhas se desenhando até o Pomin360
  linhasMapaDesenhar();
  gsap.timeline({ scrollTrigger: { trigger: '#mapa', start: 'top 75%' } })
    .from('.logo-tile', { autoAlpha: 0, y: 16, duration: .5, stagger: .025, ease: 'power3.out' })
    .from('#p360-tile', { autoAlpha: 0, x: 40, duration: .7, ease: 'power3.out' }, '-=.4')
    .fromTo('#mapa-linhas path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1, stagger: .04, ease: 'power2.out' }, '-=.3');

  // 8 · Os cartões das aplicações
  gsap.from('.app-card', { autoAlpha: 0, y: 50, duration: .9, stagger: .06, ease: 'power3.out', scrollTrigger: { trigger: '#vitrine', start: 'top 80%' } });

  // 9 · O placar: os dígitos rolam como num marcador, coluna por coluna
  $$('.placar li').forEach(li => {
    const t = gsap.timeline({ scrollTrigger: { trigger: li, start: 'top 82%' } });
    t.from(li, { autoAlpha: 0, y: 30, duration: .6, ease: 'power3.out' })
      .from(li.querySelector('.placar-linha'), { scaleX: 0, transformOrigin: '0 50%', duration: 1.6, ease: 'power3.out' }, '<');
    $$('.dig', li).forEach((d, k, todos) => t.fromTo(d.firstElementChild, { yPercent: 0 }, { yPercent: -10 * +d.dataset.d!, duration: 1.4 + (todos.length - k) * .18, ease: 'power4.out' }, '<'));
  });

  // 10 · As chaves velhas são riscadas uma a uma; a chave P360 fica
  const ft = gsap.timeline({ scrollTrigger: { trigger: '#fim', start: 'top 60%' } });
  ft.from('.lixo', { autoAlpha: 0, y: -40, rotation: '-=30', duration: .7, stagger: .06, ease: 'power3.out' });
  $$('.lixo').forEach((l, i) => ft.to($$('.risco path', l), { strokeDashoffset: 0, duration: .22, stagger: .1, ease: 'power2.out' }, .8 + i * .14).to(l, { '--apaga': 1, duration: .3 }, '<+.15'));
  ft.from('.fim-chave', { autoAlpha: 0, x: 60, rotation: 10, duration: 1, ease: 'power3.out' }, '-=.6')
    .from('.fim-texto > *', { autoAlpha: 0, y: 30, duration: .8, stagger: .12, ease: 'power3.out' }, '-=.6');

  addEventListener('resize', () => { linhasPlanta(); linhasMapaDesenhar(); ScrollTrigger.refresh(); });
  ScrollTrigger.refresh(); marcar(0);
});

if (import.meta.env.DEV) Object.assign(window, { ir, ScrollTrigger });
