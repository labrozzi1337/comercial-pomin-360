import gsap from 'gsap';
import { apps, tools, guias, fichaExtra, provas, dores, categorias, arteCategoria, fraseCategoria, type App } from './data';
import type { Cena } from './scene';

export const $ = <T extends HTMLElement = HTMLElement>(s: string, el: ParentNode = document) => el.querySelector(s) as T;
export const $$ = <T extends HTMLElement = HTMLElement>(s: string, el: ParentNode = document) => [...el.querySelectorAll(s)] as T[];
export const esc = (s: unknown) => String(s).replace(/[&<>"']/g, c => '&#' + c.charCodeAt(0) + ';');
export const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
const listPt = new Intl.ListFormat('pt-BR', { type: 'conjunction' });
const plural = (n: number, um: string, varios: string) => n + ' ' + (n > 1 ? varios : um);
const pad = (n: number) => String(n).padStart(2, '0');

export interface Ganchos { goto(alvo: string): void; travar(on: boolean): void; refresh(): void; cena: Cena; calc: { aplicar(nomes: string[]): void } }

export const selection = new Map<string, string[]>();
let g: Ganchos;

export function toast(s: string) {
  const t = $('#toast'); t.textContent = s; t.classList.add('show');
  clearTimeout((window as unknown as { tt: number }).tt);
  (window as unknown as { tt: number }).tt = window.setTimeout(() => t.classList.remove('show'), 2600);
}
function sync() {
  $('#count').textContent = String(selection.size);
  $$('.h-card').forEach(n => n.classList.toggle('selected', selection.has(n.dataset.id!)));
  gsap.fromTo('#count', { scale: 1.6 }, { scale: 1, duration: .5, ease: 'back.out(3)' });
}
function selectApp(a: App, on: boolean) { if (on) selection.set(a.id, [...a.modules]); else selection.delete(a.id); sync(); }

// Diálogos: abrir trava a rolagem suave da página; fechar libera
// empilhar: a demonstração abre por cima do capítulo e, ao fechar, volta para ele
export function abrir(d: HTMLDialogElement, empilhar = false) { if (!empilhar) $$<HTMLDialogElement>('dialog[open]').forEach(x => x !== d && x.close()); if (!d.open) d.showModal(); d.scrollTop = 0; g.travar(true); }
document.addEventListener('close', () => { if (!document.querySelector('dialog[open]')) g.travar(false); }, true);
document.addEventListener('click', e => {
  const t = e.target as HTMLElement;
  if (t.closest('.close')) t.closest('dialog')?.close();
  if (t.tagName === 'DIALOG') { const r = t.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) (t as HTMLDialogElement).close(); }
});

const substitui = (id: string) => tools.filter(t => t.app === id).map(t => t.name);

// ---------- Trilho horizontal das aplicações ----------
function trilho() {
  $('#filters').innerHTML = ['Todos', ...categorias].map((c, i) => `<button type="button" class="${i ? '' : 'active'}" data-filter="${c}" aria-pressed="${!i}">${c}</button>`).join('');
  $('#h-track').innerHTML = categorias.map(cat => {
    const lista = apps.filter(a => a.category === cat);
    return `<article class="h-cat" data-cat="${cat}"><div class="h-art"><img src="${arteCategoria[cat]}" alt="" width="960" height="960" loading="lazy" data-speed="0.92" /></div><div class="h-cat-copy"><span class="eyebrow">${plural(lista.length, 'aplicação', 'aplicações')}</span><h3>${cat}</h3><p>${fraseCategoria[cat]}</p></div></article>` +
      lista.map(a => {
        const i = apps.indexOf(a), subs = substitui(a.id);
        return `<button type="button" class="h-card" data-id="${a.id}" data-cat="${cat}" data-cursor="Explorar" style="--c:${a.color}" aria-label="Explorar ${a.name}">
          <span class="h-ghost" aria-hidden="true">${a.icon}</span><span class="h-top"><span class="h-num">${pad(i + 1)}</span><span class="h-icon">${a.icon}</span></span>
          <span class="h-chips">${a.chips.slice(0, 4).map(c => `<i>${c}</i>`).join('')}</span>
          <span class="h-label">${a.category}</span>
          <strong>${a.name}</strong>
          <span class="h-head">${a.headline[0]} <em>${a.headline[1]}</em></span>
          <span class="h-sum">${a.summary}</span>
          ${subs.length ? `<span class="h-subs">No lugar de ${listPt.format(subs)}</span>` : '<span class="h-subs">Nasce dentro do ecossistema</span>'}
          <span class="h-go">Explorar <i aria-hidden="true">→</i></span><span class="h-sel">✓ Na seleção</span></button>`;
      }).join('');
  }).join('');
  $('#h-track').addEventListener('click', e => { const c = (e.target as HTMLElement).closest<HTMLElement>('.h-card'); if (c) openApp(c.dataset.id!, e); });
  $('#h-track').addEventListener('pointerover', e => { const c = (e.target as HTMLElement).closest<HTMLElement>('.h-card'); g.cena.destacar(c ? c.dataset.id! : null); });
  $('#h-track').addEventListener('pointerleave', () => g.cena.destacar(null));
  $('#filters').addEventListener('click', e => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-filter]'); if (!b) return;
    const f = b.dataset.filter!;
    $$('#filters button').forEach(x => { x.classList.toggle('active', x === b); x.setAttribute('aria-pressed', String(x === b)); });
    $$('.h-cat, .h-card').forEach(el => el.hidden = f !== 'Todos' && el.dataset.cat !== f);
    g.refresh(); g.goto('#aplicacoes');
  });
}

// ---------- Capítulo de cada aplicação ----------
let atual: App | null = null;
function openApp(id: string, ev?: MouseEvent | Event) {
  const a = apps.find(x => x.id === id)!, i = apps.indexOf(a), gd = guias[a.id], d = $<HTMLDialogElement>('#chapter');
  atual = a; g.cena.destacar(a.id);
  const subs = substitui(a.id);
  d.style.setProperty('--c', a.color);
  d.innerHTML = `<div class="ch-glow" aria-hidden="true"></div>
  <header class="ch-nav"><button type="button" class="ch-back close"><i aria-hidden="true">←</i> Voltar</button><span class="ch-pos">${pad(i + 1)} / ${apps.length} · ${a.category.toUpperCase()}</span>
    <div class="ch-arrows"><button type="button" data-nav="-1" aria-label="Aplicação anterior">←</button><button type="button" data-nav="1" aria-label="Próxima aplicação">→</button><button type="button" class="close" aria-label="Fechar">×</button></div></header>
  <div class="ch-body">
    <section class="ch-hero">
      <span class="ch-icon" aria-hidden="true">${a.icon}</span>
      <p class="eyebrow">${a.category.toUpperCase()} · ${a.name.toUpperCase()}</p>
      <h2 class="ch-title">${a.headline[0]}<br /><em>${a.headline[1]}</em></h2>
      <p class="lead">${a.description}</p>
      <blockquote class="ch-pitch">${gd.pitch}</blockquote>
      <div class="ch-actions"><button type="button" class="btn primary" data-act="live"><span>Ver funcionando ao vivo</span><i aria-hidden="true">▶</i></button><button type="button" class="btn ghost" data-act="add"><span>${selection.has(a.id) ? '✓ Na seleção' : 'Adicionar à seleção'}</span></button><a class="link" href="https://${a.url}" target="_blank" rel="noopener">Abrir em nova aba ↗</a></div>
    </section>
    <section class="ch-cmp" aria-labelledby="cmp-t">
      <h3 id="cmp-t">O que muda quando o ${a.name} entra</h3>
      <ol class="cmp">${gd.antes.map((x, k) => `<li style="--k:${k}"><span class="cmp-a"><small>ANTES</small>${x}</span><i class="cmp-arrow" aria-hidden="true"></i><span class="cmp-d"><small>DEPOIS</small>${gd.depois[k]}</span></li>`).join('')}</ol>
      ${subs.length ? `<p class="cmp-subs">Substitui <b>${listPt.format(subs)}</b></p>` : ''}
      ${gd.prova ? `<p class="ch-prova"><b>${gd.prova[0]}</b><span>${gd.prova[1]}</span></p>` : ''}
    </section>
    <section class="ch-how" aria-labelledby="how-t">
      <h3 id="how-t">Como funciona, em 4 passos</h3>
      <ol class="ch-steps">${a.steps.map(([t, s], k) => `<li style="--k:${k}"><b>${k + 1}</b><h4>${t}</h4><p>${s}</p></li>`).join('')}</ol>
      <div class="ch-orbit" aria-hidden="true"><div class="ch-core">${a.icon}</div>${a.chips.map((c, k) => `<span class="ch-chip" style="--k:${k};--n:${a.chips.length}"><em>✓</em>${c}</span>`).join('')}</div>
    </section>
    <section class="ch-fit">
      <div><h3>O que faz sentido para sua empresa?</h3><div class="modules">${a.modules.map((m, k) => `<label class="module"><input type="checkbox" data-module="${k}" ${selection.get(a.id)?.includes(m) ? 'checked' : ''} /><span>${m}</span></label>`).join('')}</div></div>
      <p class="note">PARA QUEM · ${a.audience}</p>
    </section>
  </div>`;
  abrir(d);
  const boxes = $$<HTMLInputElement>('[data-module]', d), addBtn = $('[data-act="add"] span', d);
  $('[data-act="add"]', d).onclick = () => { selectApp(a, true); boxes.forEach(c => c.checked = true); addBtn.textContent = '✓ Na seleção'; toast(a.name + ' adicionado à seleção'); };
  boxes.forEach(c => c.onchange = () => { const chosen = boxes.filter(x => x.checked).map(x => a.modules[+x.dataset.module!]); if (chosen.length) selection.set(a.id, chosen); else selection.delete(a.id); sync(); });
  $('[data-act="live"]', d).onclick = () => openDemo(a);
  // o capítulo é redesenhado: devolve o foco à mesma seta para o teclado seguir funcionando
  $$('[data-nav]', d).forEach(b => b.onclick = () => { openApp(apps[(i + +b.dataset.nav! + apps.length) % apps.length].id); $(`[data-nav="${b.dataset.nav}"]`, d).focus(); });
  if (calmo) return;
  const e = ev as MouseEvent | undefined, x = e?.clientX ?? innerWidth / 2, y = e?.clientY ?? innerHeight / 2;
  gsap.timeline()
    .fromTo(d, { clipPath: `circle(0% at ${x}px ${y}px)` }, { clipPath: `circle(150% at ${x}px ${y}px)`, duration: ev ? .9 : .5, ease: 'expo.inOut' })
    .from($$('.ch-hero > *', d), { y: 40, opacity: 0, stagger: .06, duration: .8, ease: 'expo.out' }, '-=.45')
    .from($$('.cmp li', d), { x: -30, opacity: 0, stagger: .1, duration: .7, ease: 'expo.out' }, '-=.6')
    .from($$('.cmp-d', d), { clipPath: 'inset(0 100% 0 0)', stagger: .12, duration: .8, ease: 'expo.inOut' }, '-=.5')
    .from($$('.ch-steps li', d), { y: 30, opacity: 0, stagger: .08, duration: .6, ease: 'expo.out' }, '-=.6');
}
$('#chapter').addEventListener('close', () => g.cena.destacar(null));
document.addEventListener('keydown', e => {
  if (!atual || !$<HTMLDialogElement>('#chapter').open || $<HTMLDialogElement>('#demo').open || (e.target as HTMLElement).matches('input,textarea')) return;
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const i = apps.indexOf(atual); openApp(apps[(i + (e.key === 'ArrowRight' ? 1 : -1) + apps.length) % apps.length].id); }
});
// Área de transferência com plano B (sem permissão ou fora de contexto seguro)
async function copiar(texto: string) {
  try { await navigator.clipboard.writeText(texto); }
  catch { const t = document.body.appendChild(document.createElement('textarea')); t.value = texto; t.style.cssText = 'position:fixed;opacity:0'; t.select(); const ok = document.execCommand('copy'); t.remove(); if (!ok) { toast('Não foi possível copiar'); return false; } }
  toast('Resumo copiado'); return true;
}

// ---------- Demonstração ao vivo + guia do consultor (a antiga COLINHA) ----------
const lock = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
function guia(a: App) {
  const gd = guias[a.id], subs = substitui(a.id);
  const ficha = [['Recursos', a.chips], ['Módulos', a.modules], ...(fichaExtra[a.id] ?? [])] as [string, string[]][];
  return `<aside class="guide" aria-label="Guia de demonstração do ${a.name}">
    <header class="g-head"><span class="g-icon" aria-hidden="true">${a.icon}</span><div><span class="tag">GUIA DE DEMONSTRAÇÃO</span><h3>${a.name}</h3></div></header>
    <div class="g-pitch"><small>EM UMA FRASE</small><p>${gd.pitch}</p></div>
    <div class="g-tabs" role="tablist" aria-label="Partes do guia">${['Roteiro', 'Descoberta', 'Objeções', 'Ficha'].map((t, k) => `<button type="button" role="tab" id="gt-${k}" aria-controls="gp-${k}" aria-selected="${!k}" tabindex="${k ? -1 : 0}">${t}</button>`).join('')}</div>
    <div class="g-panel" role="tabpanel" id="gp-0" aria-labelledby="gt-0">
      <div class="g-progress"><i></i><span>0 de ${a.steps.length} mostrados</span></div>
      <ol class="g-steps">${a.steps.map(([t, s], k) => `<li><label><input type="checkbox" /><span class="g-n">${k + 1}</span><span class="g-txt"><b>${t}</b><span>${s}</span><q>${gd.falas[k]}</q></span></label></li>`).join('')}</ol>
      <p class="g-tip">Marque cada passo ao mostrar. No fim, pergunte qual deles resolve a dor mais urgente.</p>
    </div>
    <div class="g-panel" role="tabpanel" id="gp-1" aria-labelledby="gt-1" hidden>
      <p class="g-tip">Pergunte antes de mostrar. As respostas dizem por onde começar.</p>
      <ol class="g-q">${gd.descoberta.map(q => `<li>${q}</li>`).join('')}</ol>
    </div>
    <div class="g-panel" role="tabpanel" id="gp-2" aria-labelledby="gt-2" hidden>
      ${gd.objecoes.map(([q, r]) => `<details class="g-obj"><summary>“${q}”</summary><p>${r}</p></details>`).join('')}
    </div>
    <div class="g-panel" role="tabpanel" id="gp-3" aria-labelledby="gt-3" hidden>
      ${gd.prova ? `<p class="g-prova"><b>${gd.prova[0]}</b> ${gd.prova[1]}</p>` : ''}
      ${ficha.map(([h, l]) => `<h4>${h}</h4><ul class="g-chips">${l.map(x => `<li>${x}</li>`).join('')}</ul>`).join('')}
      <h4>Para quem</h4><p>${a.audience}</p>
      ${subs.length ? `<h4>No lugar de</h4><p>${listPt.format(subs)}</p>` : ''}
      <h4>Implantação</h4><p>Cerca de uma semana por sistema avulso. Pacote completo em até dois meses.</p>
    </div>
    <footer class="g-foot"><button type="button" class="btn ghost sm" data-g="copiar"><span>Copiar resumo para o cliente</span></button><button type="button" class="btn primary sm" data-g="add"><span>${selection.has(a.id) ? '✓ Na seleção' : 'Adicionar à seleção'}</span></button></footer>
  </aside>`;
}
function openDemo(a: App) {
  const d = $<HTMLDialogElement>('#demo');
  if (d.dataset.app !== a.id) {
    d.dataset.app = a.id; d.style.setProperty('--c', a.color);
    d.innerHTML = `<div class="bar"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="url">${lock}${a.url}</span>
      <button type="button" data-d="guia" aria-pressed="true" title="Mostrar ou ocultar o guia (tecla G)">Guia</button><button type="button" data-d="reload" aria-label="Recarregar ${a.name}">↻</button><a href="https://${a.url}" target="_blank" rel="noopener">Nova aba ↗</a><button type="button" class="close" aria-label="Fechar">×</button></div>
      <div class="demo-body"><iframe title="${a.name} ao vivo" src="https://${a.url}" allow="fullscreen; clipboard-write"></iframe>${guia(a)}</div>
      <p class="note">Entre com o seu usuário para demonstrar. Se o login não se mantiver aqui dentro, use Nova aba. O guia fica só na sua tela: oculte com G antes de compartilhar.</p>`;
    $('[data-d="reload"]', d).onclick = () => { d.dataset.app = ''; openDemo(a); };
    const alterna = () => { const on = d.classList.toggle('sem-guia'); $('[data-d="guia"]', d).setAttribute('aria-pressed', String(!on)); };
    $('[data-d="guia"]', d).onclick = alterna;
    d.onkeydown = e => { if (e.key.toLowerCase() === 'g' && !(e.target as HTMLElement).matches('input,textarea')) alterna(); };
    const tabs = $$('[role="tab"]', d), painéis = $$('[role="tabpanel"]', d);
    const ativa = (k: number) => { tabs.forEach((t, j) => { t.setAttribute('aria-selected', String(j === k)); t.tabIndex = j === k ? 0 : -1; }); painéis.forEach((p, j) => p.hidden = j !== k); tabs[k].focus(); };
    tabs.forEach((t, k) => { t.onclick = () => ativa(k); t.onkeydown = e => { if (e.key === 'ArrowRight') ativa((k + 1) % tabs.length); if (e.key === 'ArrowLeft') ativa((k - 1 + tabs.length) % tabs.length); }; });
    const marcas = $$<HTMLInputElement>('.g-steps input', d);
    marcas.forEach(c => c.onchange = () => { const n = marcas.filter(x => x.checked).length; $('.g-progress i', d).style.width = n / marcas.length * 100 + '%'; $('.g-progress span', d).textContent = `${n} de ${marcas.length} mostrados`; });
    $('[data-g="add"]', d).onclick = () => { selectApp(a, true); $('[data-g="add"] span', d).textContent = '✓ Na seleção'; toast(a.name + ' adicionado à seleção'); };
    $('[data-g="copiar"]', d).onclick = async () => {
      const gd = guias[a.id], texto = [`${a.name} · Pomin360`, gd.pitch, '', 'O que muda:', ...gd.depois.map(x => '• ' + x), '', 'Implantação: cerca de uma semana por sistema avulso.', `https://${a.url}`].join('\n');
      copiar(texto);
    };
  }
  abrir(d, true);
}
// Onde a página não pode embutir outros sites, troca o erro do navegador por um aviso com o link
document.addEventListener('securitypolicyviolation', e => {
  const f = $<HTMLIFrameElement>('#demo iframe');
  if (e.effectiveDirective !== 'frame-src' || !f || !e.blockedURI.startsWith(new URL(f.src).origin)) return;
  f.outerHTML = `<div class="blocked"><p>Esta página não permite abrir o sistema aqui dentro.<br />Na versão publicada no domínio da empresa ele abre normalmente.</p><a class="btn primary" href="${f.src}" target="_blank" rel="noopener"><span>Abrir em nova aba ↗</span></a></div>`;
});

// ---------- Antes × Depois: falas do caos e quem responde no Pomin360 ----------
function antesDepois() {
  const pos = [[50, 10, 4, 46], [72, 22, 44, 52], [54, 36, 6, 60], [76, 50, 42, 68], [50, 64, 4, 78], [72, 78, 40, 86]];
  $('#ad-bubbles').innerHTML = dores.map((d, k) => `<div class="bubble" style="--x:${pos[k][0]}%;--y:${pos[k][1]}%;--mx:${pos[k][2]}%;--my:${pos[k][3]}%"><small>${d.de}</small>${d.fala}</div>`).join('');
  $('#ad-cards').innerHTML = dores.map(d => { const a = apps.find(x => x.id === d.app)!; return `<button type="button" class="ad-card" data-id="${a.id}" style="--c:${a.color}"><s>${d.fala}</s><span class="ad-app"><i aria-hidden="true">${a.icon}</i>${a.name}</span><b>${d.resposta}</b></button>`; }).join('');
  $('#ad-cards').addEventListener('click', e => { const c = (e.target as HTMLElement).closest<HTMLElement>('.ad-card'); if (c) openApp(c.dataset.id!, e); });
}

// ---------- O que substitui ----------
function logo(t: typeof tools[number]) { return t.svg ? `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${t.svg}</svg>` : `<span class="word" aria-hidden="true">${t.name.toLowerCase()}</span>`; }
let shown = '';
function swap(name: string) {
  if (name === shown) return; shown = name;
  const t = tools.find(t => t.name === name)!, a = apps.find(a => a.id === t.app)!, kin = tools.filter(x => x.app === a.id && x !== t).map(x => x.name);
  $$('.tile').forEach(b => { b.classList.toggle('on', b.dataset.tool === name); b.classList.toggle('kin', kin.includes(b.dataset.tool!)); });
  $('#swap').innerHTML = `<div class="swap-row"><span class="from" style="--brand:#${t.hex}">${logo(t)}</span><span class="arrow" aria-hidden="true"></span><span class="to" style="--c:${a.color}">${a.icon}</span><div><small>No lugar de ${t.name}</small><strong>${a.name}</strong></div></div><p>${a.summary}</p>${kin.length ? `<p class="note">${a.name} também substitui ${listPt.format(kin)}.</p>` : ''}<button type="button" class="btn ghost sm" data-open="${a.id}"><span>Conhecer ${a.name} →</span></button>`;
}
function substituicoes() {
  let from = 0;
  $('#logos').innerHTML = [4, 5, 4, 5, 4].map((n, c) => { const col = tools.slice(from, from + n); from += n; return `<div class="col" data-col="${c}">${col.map(t => `<button type="button" class="tile" data-tool="${t.name}" style="--brand:#${t.hex}" aria-label="${t.name}">${logo(t)}</button>`).join('')}</div>`; }).join('');
  const pick = (e: Event) => { const b = (e.target as HTMLElement).closest<HTMLElement>('.tile'); if (b) swap(b.dataset.tool!); };
  ['pointerover', 'focusin', 'click'].forEach(ev => $('#logos').addEventListener(ev, pick));
  $('#swap').onclick = e => { const b = (e.target as HTMLElement).closest<HTMLElement>('[data-open]'); if (b) openApp(b.dataset.open!, e); };
  swap('WhatsApp Business');
  // Caixa com a altura da ferramenta de texto mais longo: o hover não mexe na rolagem
  const fit = () => { const s = $('#swap'), keep = shown; s.style.minHeight = ''; let m = 0; for (const t of tools) { swap(t.name); m = Math.max(m, s.offsetHeight); } s.style.minHeight = m + 'px'; swap(keep); };
  let tm = 0; fit(); document.fonts.ready.then(fit); addEventListener('resize', () => { clearTimeout(tm); tm = window.setTimeout(fit, 150); });
  $('#marquee').innerHTML = [...tools, ...tools].map(t => `<span>${t.name}</span><i aria-hidden="true">✦</i>`).join('');
}

// ---------- Seleção, pacotes e calculadora ----------
const calcNome: Record<string, string> = { report: 'PominReports', chat: 'PominChat' };
function irParaSimulador() {
  if (selection.size) g.calc.aplicar(apps.filter(a => selection.has(a.id)).map(a => calcNome[a.id] || a.name));
  $$<HTMLDialogElement>('dialog[open]').forEach(x => x.close());
  g.goto('#simulador');
}
function cart() {
  const sel = apps.filter(a => selection.has(a.id)), d = $<HTMLDialogElement>('#cart');
  d.innerHTML = `<button class="close" type="button" aria-label="Fechar">×</button><span class="tag">SEU POMIN360</span><h2>Uma combinação sua.</h2>
  <p>${sel.length ? plural(sel.length, 'aplicação', 'aplicações') + ' na sua seleção. Ajuste os módulos ou avance para a proposta.' : 'Escolha as soluções para começar. Você também pode partir de uma combinação pronta.'}</p>
  <div class="packs"><button type="button" data-pack="all">Pacote completo · ${apps.length} apps</button><button type="button" data-pack="customer">Relacionamento · SAC + CHAT + CS</button><button type="button" data-pack="management">Gestão · Report + BI + Governa</button></div>
  ${sel.map(a => `<div class="cart-row" style="--c:${a.color}"><span class="cr-icon" aria-hidden="true">${a.icon}</span><div><strong>${a.name}</strong><small>${selection.get(a.id)!.join(' · ')}</small></div><button type="button" data-remove="${a.id}" aria-label="Remover ${a.name}">Remover</button></div>`).join('')}
  ${sel.length ? `<p class="deadline-mini">${prazo(sel.length)}</p>` : ''}
  <p class="note">Seleção de interesse, sem cobrança. Valores e disponibilidade dos módulos são confirmados na proposta.</p>
  <div class="actions"><button type="button" class="btn ghost" id="back"><span>Continuar explorando</span></button><button type="button" class="btn primary" id="next"><span>Calcular proposta</span><i aria-hidden="true">→</i></button></div>`;
  abrir(d);
  $('#back', d).onclick = () => d.close(); $('#next', d).onclick = irParaSimulador;
  $$('[data-remove]', d).forEach(b => b.onclick = () => { selection.delete(b.dataset.remove!); sync(); cart(); });
  $$('[data-pack]', d).forEach(b => b.onclick = () => { const ids = b.dataset.pack === 'customer' ? ['sac', 'chat', 'cs'] : b.dataset.pack === 'management' ? ['report', 'bi', 'governa'] : apps.map(a => a.id); ids.forEach(id => selectApp(apps.find(a => a.id === id)!, true)); cart(); toast('Combinação adicionada'); });
}
function prazo(n: number) { return n === apps.length ? 'Pacote completo · implantação em até 2 meses' : `${plural(n, 'sistema', 'sistemas')} · implantação estimada em ${plural(n, 'semana', 'semanas')} (1 por sistema)`; }

// ---------- Link do cliente: questionário que volta por e-mail ou WhatsApp ----------
let seller = { v: '', w: '', e: '' }; const draft: Record<string, string> = {};
function questionnaire() {
  const q = $<HTMLDialogElement>('#questionnaire');
  q.innerHTML = `<button class="close" type="button" aria-label="Fechar">×</button><span class="tag">MONTE SUA SOLUÇÃO POMIN360</span><h2>Escolha os sistemas${seller.e ? ' da ' + esc(seller.e) : ''}.</h2><p>Marque o que faz sentido, informe quantas pessoas vão usar cada sistema e veja o prazo de implantação.</p>
  <form id="qform"><div class="question-heading"><b>1</b><h3>Quais sistemas você quer usar?</h3></div><button type="button" class="pack-all" id="q-all">Quero o pacote completo · ${apps.length} sistemas</button>
  <div class="modules">${apps.map(a => `<div class="module pick"><label><input type="checkbox" name="app" value="${a.id}" ${selection.has(a.id) ? 'checked' : ''} /><span><strong>${a.name}</strong><small>${a.summary}</small></span></label><span class="qty"><input type="number" name="u-${a.id}" min="1" max="100000" inputmode="numeric" placeholder="Qtd" aria-label="Usuários no ${a.name}" /></span></div>`).join('')}</div>
  <div class="deadline" id="deadline" aria-live="polite"></div>
  <div class="question-heading"><b>2</b><h3>Seus dados</h3></div>
  <label class="field-label" for="company">Empresa</label><input class="input" id="company" name="company" required maxlength="150" autocomplete="organization" />
  <label class="field-label" for="contact">Seu nome</label><input class="input" id="contact" name="contact" required maxlength="120" autocomplete="name" />
  <label class="field-label" for="email">E-mail</label><input class="input" id="email" name="email" type="email" required maxlength="200" autocomplete="email" placeholder="nome@empresa.com.br" />
  <label class="field-label" for="phone">Telefone ou WhatsApp <small>(opcional)</small></label><input class="input" id="phone" name="phone" type="tel" maxlength="30" autocomplete="tel" />
  <label class="field-label" for="challenge">Algo mais que o comercial deve saber? <small>(opcional)</small></label><textarea class="input" id="challenge" name="challenge" maxlength="2500"></textarea>
  <div class="actions"><button type="submit" class="btn primary"><span>Concluir minha escolha</span></button></div><p id="formstatus" role="status" class="note"></p></form>`;
  abrir(q);
  if (!draft.company && seller.e) draft.company = seller.e;
  for (const [k, v] of Object.entries(draft)) { const el = q.querySelector<HTMLInputElement>(`[name="${k}"]`); if (el) el.value = v; }
  const boxes = $$<HTMLInputElement>('[name=app]', q), qty = (id: string) => q.querySelector<HTMLInputElement>(`[name="u-${id}"]`)!;
  const refresh = () => {
    let n = 0, total = 0;
    boxes.forEach(c => { qty(c.value).required = c.checked; if (c.checked) { n++; total += +qty(c.value).value || 0; } });
    $('#deadline').innerHTML = n ? `<strong>${prazo(n)}</strong>${n < apps.length ? `<span>Pacote completo, com os ${apps.length} sistemas: implantação em até 2 meses.</span>` : ''}${total ? `<span>${plural(total, 'usuário', 'usuários')} no total.</span>` : ''}` : '<span>Marque os sistemas para ver o prazo de implantação.</span>';
    $('#q-all').classList.toggle('on', n === apps.length);
  };
  q.oninput = e => { const t = e.target as HTMLInputElement; if (t.name && t.type !== 'checkbox') draft[t.name] = t.value; refresh(); };
  boxes.forEach(c => c.onchange = () => { selectApp(apps.find(a => a.id === c.value)!, c.checked); refresh(); });
  $('#q-all').onclick = () => { const all = boxes.some(c => !c.checked); boxes.forEach(c => { c.checked = all; selectApp(apps.find(a => a.id === c.value)!, all); }); refresh(); }; refresh();
  $<HTMLFormElement>('#qform').onsubmit = e => {
    e.preventDefault();
    const f = new FormData(e.target as HTMLFormElement), picked = apps.filter(a => selection.has(a.id));
    if (!picked.length) { $('#formstatus').textContent = 'Marque pelo menos um sistema.'; return; }
    const total = picked.reduce((t, a) => t + (+(f.get('u-' + a.id) ?? 0) || 0), 0), lines = ['Pomin360 · Solução escolhida pelo cliente', '', 'Empresa: ' + f.get('company'), 'Responsável: ' + f.get('contact'), 'E-mail: ' + f.get('email')];
    if (f.get('phone')) lines.push('Telefone: ' + f.get('phone'));
    lines.push('', 'Sistemas e usuários:', ...picked.map(a => `• ${a.name}: ${plural(+(f.get('u-' + a.id) ?? 0), 'usuário', 'usuários')}`), 'Total: ' + plural(total, 'usuário', 'usuários'), '', 'Implantação: ' + prazo(picked.length));
    if (f.get('challenge')) lines.push('', 'Observações: ' + f.get('challenge'));
    const text = lines.join('\n'), wa = seller.w && `https://wa.me/${seller.w.length <= 11 ? '55' : ''}${seller.w}?text=${encodeURIComponent(text)}`, mail = `mailto:${encodeURIComponent(seller.v)}?subject=${encodeURIComponent('Pomin360 · Solução escolhida por ' + f.get('company'))}&body=${encodeURIComponent(text)}`;
    q.innerHTML = `<button class="close" type="button" aria-label="Fechar">×</button><span class="tag">TUDO PRONTO</span><h2>Sua escolha está pronta.</h2><p>Envie para o comercial${seller.v ? ' (' + esc(seller.v) + ')' : ''} pelo canal que preferir.</p><pre class="summary-pre">${esc(text)}</pre><div class="actions">${wa ? `<a class="btn primary" href="${wa}" target="_blank" rel="noopener"><span>Enviar pelo WhatsApp</span></a>` : ''}<a class="btn ${wa ? 'ghost' : 'primary'}" href="${mail}"><span>Enviar por e-mail</span></a><button type="button" class="btn ghost" id="q-copy"><span>Copiar resumo</span></button></div><p class="note">Se o e-mail não abrir, copie o resumo e envie para ${seller.v ? esc(seller.v) : 'o comercial'}. Nada fica salvo nesta página: seus dados vão só na mensagem que você enviar.</p><button type="button" class="linkish" id="q-edit">← Ajustar minha escolha</button>`;
    q.scrollTop = 0;
    $('#q-copy').onclick = async () => { if (!await copiar(text)) getSelection()?.selectAllChildren($('.summary-pre', q)); };
    $('#q-edit').onclick = questionnaire;
  };
}
function fromLink() {
  if (location.hash !== '#questionario') return;
  const p = new URLSearchParams(location.search), v = p.get('v') || '';
  seller = { v: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? v : '', w: (p.get('w') || '').replace(/\D/g, ''), e: (p.get('e') || '').slice(0, 150) };
  apps.forEach(a => { if (p.has(a.id)) { const mods = p.get(a.id)!.split(',').map(i => a.modules[Number(i)]).filter(Boolean); if (mods.length) selection.set(a.id, mods); } });
  sync(); questionnaire();
}

// ---------- IA da página (servir.py, POST /api/perguntar) ----------
function perguntas() {
  const log = $('#ask-log'), form = $<HTMLFormElement>('#ask-form'), q = $<HTMLInputElement>('#ask-q'), conversa: { role: string; content: string }[] = [], fora = 'A IA responde na página publicada no servidor do Pomin360.';
  const md = (t: string) => esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/^- (.*)$/gm, '<li>$1</li>').replace(/(<li>.*<\/li>\n?)+/g, m => '<ul>' + m.replace(/\n/g, '') + '</ul>').replace(/\n/g, '<br>');
  const add = (quem: string, html: string) => { log.insertAdjacentHTML('beforeend', `<div class="msg ${quem}">${html}</div>`); log.scrollTop = log.scrollHeight; return log.lastElementChild as HTMLElement; };
  async function perguntar(texto: string) {
    texto = texto.trim().slice(0, 2000); if (!texto || form.classList.contains('busy')) return;
    add('eu', esc(texto)); conversa.push({ role: 'user', content: texto }); form.classList.add('busy'); q.value = '';
    const espera = add('ia', '<span class="dots-typing" aria-label="A IA está escrevendo"><i></i><i></i><i></i></span>');
    try {
      const r = await fetch('/api/perguntar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ historico: conversa.slice(-11) }) }), d = await r.json().catch(() => ({}));
      if (!r.ok || !d.resposta) throw new Error(d.erro || fora);
      espera.innerHTML = md(d.resposta); conversa.push({ role: 'assistant', content: d.resposta.slice(0, 8000) });
    } catch (e) { espera.classList.add('erro'); espera.textContent = e instanceof TypeError ? fora : (e as Error).message; conversa.pop(); }
    finally { form.classList.remove('busy'); log.scrollTop = log.scrollHeight; q.focus({ preventScroll: true }); }
  }
  form.onsubmit = e => { e.preventDefault(); perguntar(q.value); };
  $('#ask-chips').onclick = e => { const b = (e.target as HTMLElement).closest('button'); if (b) perguntar(b.textContent ?? ''); };
}

// ---------- Pequenos ----------
function video() {
  const f = $<HTMLIFrameElement>('.video iframe');
  const poster = () => { f.parentElement!.innerHTML = '<a class="poster" href="https://www.youtube.com/watch?v=blEte36ldaA" target="_blank" rel="noopener"><img src="https://i.ytimg.com/vi/blEte36ldaA/maxresdefault.jpg" alt="" loading="lazy" onerror="this.remove()"><span>▶ Assistir no YouTube</span></a>'; };
  if (location.protocol === 'file:') return poster();
  document.addEventListener('securitypolicyviolation', e => { if (e.effectiveDirective === 'frame-src' && f.isConnected && e.blockedURI.includes('youtube')) poster(); });
  new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { f.src = f.dataset.src!; o.disconnect(); } }, { rootMargin: '600px' }).observe(f);
}
function digitando() {
  const el = $('.typing'), words = ['Em todas as direções.', 'Para a liderança.', 'Na gestão de equipes.', 'Controlando a tecnologia.', 'Com a IA a seu favor.', 'Com os números na mão.', 'Perto de cada cliente.'];
  if (calmo) return;
  let w = 0, i = words[0].length, del = true;
  const tick = () => { const s = words[w]; i += del ? -1 : 1; el.textContent = s.slice(0, i); let wait = del ? 35 : 75; if (!del && i === s.length) { del = true; wait = 2200; } else if (del && !i) { del = false; w = (w + 1) % words.length; wait = 400; } setTimeout(tick, wait); };
  setTimeout(tick, 4200);
}

export function iniciarUI(ganchos: Ganchos) {
  g = ganchos;
  trilho(); antesDepois(); substituicoes(); perguntas(); video(); digitando();
  $('#proof').innerHTML = provas.map(([n, t]) => `<li><b data-count="${n}">${n.toLocaleString('pt-BR')}</b><span>${t}</span></li>`).join('');
  g.cena.aoClicar(id => openApp(id));
  $('#basket').onclick = cart;
  $('#configure').onclick = irParaSimulador;
  $('#all').onclick = () => { apps.forEach(a => selectApp(a, true)); cart(); };
  $('#presentation').onclick = async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch { toast('Use a tela cheia do seu navegador para apresentar.'); } };
  const menu = $('#menu-mobile'), mb = $('#menu-btn');
  mb.onclick = () => { const on = menu.hidden; menu.hidden = !on; mb.setAttribute('aria-expanded', String(on)); document.body.classList.toggle('menu-on', on); };
  document.addEventListener('click', e => {
    const a = (e.target as HTMLElement).closest<HTMLElement>('[data-goto]'); if (!a) return;
    e.preventDefault(); menu.hidden = true; mb.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-on'); g.goto(a.dataset.goto!);
  });
  fromLink(); addEventListener('hashchange', fromLink);
}
