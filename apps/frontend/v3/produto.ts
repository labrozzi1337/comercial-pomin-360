// Página de cada aplicação (/v3/produto/?app=<id>): o vídeo, o botão para abrir a aplicação na reunião,
// o antes e depois (arrastável, com os pontos que melhoram), o que tem dentro (recursos reais),
// quem cobra hoje e o guia do apresentador com o acesso interno.
import './base.css';
import './filme.css';
import './produto.css';
import './simulador.css';
import { gsap } from 'gsap';
import { apps, guias, fichaExtra } from '../src/data';
import { app, chaves, img, trailers, mercadoDe } from './dados';
import { montarFilme } from './filme';
import { guiaApp, ligarCopiar, esc } from './guia-conteudo';
import { recursos } from './recursos';
import { mercadoDe as mercadoDoMolho, montarSimulador } from './simulador';

const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector(s) as T;
const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
const id = new URLSearchParams(location.search).get('app') ?? 'chat';
const a = apps.find(x => x.id === id) ?? app('chat'), g = guias[a.id], m = trailers[a.id];
const i = apps.indexOf(a), ant = apps[(i + apps.length - 1) % apps.length], prox = apps[(i + 1) % apps.length];
const url = (x: string) => `/v3/produto/?app=${x}`;
document.title = `${a.name} · Pomin360`;
document.documentElement.style.setProperty('--c', a.color);

$('#anterior').setAttribute('href', url(ant.id)); $('#proxima').setAttribute('href', url(prox.id));
$('#entrar').setAttribute('href', `https://${a.url}`); $('#entrar').textContent = `Abrir o ${a.name}`;

// Recursos reais levantados nos sistemas (recursos.ts); sem eles, a ficha do catálogo ou os módulos
const grupos: [string, string[]][] = recursos[a.id] ?? fichaExtra[a.id] ?? [['Módulos', a.modules], ['Destaques', a.chips]];
const mercado = mercadoDe(a.id);
$('#produto').innerHTML = `
  <section class="pr-capa">
    <div class="pr-cab">
      <p class="rotulo"><span class="pr-ico" aria-hidden="true">${a.icon}</span>${a.category}</p>
      <h1 class="titulo">${a.name}</h1>
      <p class="texto">${esc(g.pitch)}</p>
    </div>
    <div class="pr-filme" id="filme" aria-label="Vídeo: ${esc(m.titulo)}"></div>
    <div class="pr-acoes">
      <span class="pr-botoes"><button type="button" class="bt bt-linha" data-guia>Roteiro da demonstração</button><a class="bt bt-marca" href="https://${a.url}" target="_blank" rel="noopener" data-abrir>Abrir o ${a.name} para apresentar ↗</a></span>
    </div>
  </section>

  <section class="papel pr-comp">
    <div class="pr-comp-cab"><p class="rotulo">O antes e o depois</p><h2 class="titulo-m">O mesmo lugar, <em>com o ${a.name}</em>.</h2><p class="texto">Arraste a linha para comparar.</p></div>
    <div class="comparar" id="comparar" style="--corte:50%">
      <figure class="cmp-lado antes"><img src="${img('v3-t-' + a.id)}" alt="Antes: ${esc(m.problema)}" width="1536" height="1024" />
        <figcaption><span class="cmp-tag">Antes</span><ul>${g.antes.map(x => `<li>${esc(x)}</li>`).join('')}</ul></figcaption></figure>
      <figure class="cmp-lado depois"><img src="${img('v3-d-' + a.id)}" alt="Depois: ${esc(m.frase)}" width="1536" height="1024" />
        <figcaption><span class="cmp-tag">Com o ${a.name}</span><ul>${g.depois.map(x => `<li>${esc(x)}</li>`).join('')}</ul></figcaption></figure>
      <span class="cmp-linha" aria-hidden="true"><i>⟷</i></span>
      <input class="cmp-barra" type="range" min="0" max="100" value="50" aria-label="Comparar antes e depois" />
    </div>
  </section>

  <section class="papel pr-dentro">
    <div class="pr-dentro-cab"><h2 class="titulo-m">O que tem <em>dentro</em>.</h2><p class="pr-conta"><b>${grupos.reduce((s, [, i]) => s + i.length, 0)}</b> recursos em <b>${grupos.length}</b> frentes</p></div>
    <ul class="pr-modulos">${a.modules.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
    <div class="pr-recursos">${grupos.map(([t, itens], k) => `<div class="pr-grupo"><h3><span>${String(k + 1).padStart(2, '0')}</span>${esc(t)}</h3><ul>${itens.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join('')}</div>
  </section>

  <section class="pr-mercado">
    <div>
      <p class="rotulo">Quem cobra por isso hoje</p>
      ${mercado.length ? `<ul class="pr-conc">${mercado.map(c => `<li><a href="${c.fonte}" target="_blank" rel="noopener"><b>${c.nome}</b><span>${c.preco}</span></a></li>`).join('')}</ul>
      <p class="pr-nota">Preço de tabela no site oficial de cada empresa, sem promoções. Cada nome leva à página de preços.</p>` : '<p class="texto">Hoje isso costuma ficar em planilhas, e-mails e pastas compartilhadas. O custo aparece em horas, não em fatura.</p>'}
    </div>
    <div class="pr-nosso">
      <p class="rotulo">No Pomin360</p>
      <p class="pr-grande">O investimento é desenhado para cada projeto.</p>
      <p class="pr-promessa">Do tamanho da sua operação, e com um compromisso: a conta final fica abaixo do que você gasta hoje, seja em assinaturas de várias ferramentas, seja em horas de trabalho feito na mão.</p>
      ${g.prova ? `<p class="pr-prova"><b>${g.prova[0]}</b>${esc(g.prova[1])}</p>` : ''}
    </div>
  </section>

  <nav class="pr-outros" aria-label="Outras aplicações">
    ${[ant, prox].map((x, k) => `<a href="${url(x.id)}" style="--c:${x.color}"><img src="${img('v3-d-' + x.id)}" alt="" loading="lazy" /><span><small class="rotulo">${k ? 'Próxima' : 'Anterior'}</small><b>${x.name}</b><em>${esc(trailers[x.id].frase)}</em></span></a>`).join('')}
  </nav>`;

// O vídeo espera na foto de abertura até o comercial clicar em Assistir
montarFilme($('#filme'), a.id).then(filme => { if (import.meta.env.DEV) Object.assign(window, { filme }); });

// Antes e depois: a linha acompanha o arraste (e faz uma demonstração na primeira vez que aparece)
const cmp = $('#comparar'), barra = cmp.querySelector<HTMLInputElement>('.cmp-barra')!;
const corte = (v: number) => { cmp.style.setProperty('--corte', v + '%'); barra.value = String(Math.round(v)); };
barra.addEventListener('input', () => corte(+barra.value));
if (!calmo) {
  const v = { p: 50 };
  new IntersectionObserver((es, o) => { if (!es[0].isIntersecting) return; o.disconnect();
    gsap.timeline({ defaults: { ease: 'power2.inOut' }, onUpdate: () => corte(v.p) }).to(v, { p: 88, duration: 1 }).to(v, { p: 14, duration: 1.6 }).to(v, { p: 50, duration: 1 });
  }, { threshold: .55 }).observe(cmp);
}

// Guia do apresentador (gaveta com G, ou outra janela sincronizada)
const gaveta = $('#gaveta'), canal = new BroadcastChannel('p360-v3');
$('#guia').innerHTML = guiaApp(a.id); ligarCopiar(gaveta);
const guia = (abrir = !gaveta.classList.contains('aberta')) => { gaveta.classList.toggle('aberta', abrir); gaveta.setAttribute('aria-hidden', String(!abrir)); };
$('#abrir-guia').addEventListener('click', () => guia()); $('#fechar-guia').addEventListener('click', () => guia(false));
document.querySelectorAll('[data-guia]').forEach(b => b.addEventListener('click', () => guia(true)));
// Simulador: abre com esta aplicação e, se o cliente já escolheu as chaves na apresentação, compara com o molho dele
const dlg = $<HTMLDialogElement>('#precos'), ler = <T>(k: string, p: T): T => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) as T : p; } catch { return p; } };
document.querySelector('[data-simulador]')!.addEventListener('click', () => {
  montarSimulador(dlg, { apps: [a.id], pessoas: ler('p360-pessoas', 20), cliente: ler('p360-cliente', ''), mercado: mercadoDoMolho(chaves.filter(c => ler<string[]>('p360-chaves', []).includes(c.nome))) });
  dlg.showModal();
});
dlg.addEventListener('click', e => { if ((e.target as HTMLElement).closest('[data-fechar]') || e.target === dlg) dlg.close(); });
document.querySelectorAll('[data-abrir], #entrar').forEach(b => b.addEventListener('click', () => canal.postMessage({ tipo: 'app', id: a.id })));
$('#guia-janela').addEventListener('click', () => { window.open(`/v3/guia/?app=${a.id}`, 'p360-guia', 'width=520,height=920'); guia(false); });
addEventListener('keydown', e => {
  if ((e.target as HTMLElement).closest('input, textarea')) return;
  if (e.key === 'g' || e.key === 'G') guia();
  else if (e.key === 'Escape') guia(false);
  else if (e.key === 'ArrowRight' && e.altKey) location.href = url(prox.id);
  else if (e.key === 'ArrowLeft' && e.altKey) location.href = url(ant.id);
});
canal.postMessage({ tipo: 'app', id: a.id });
canal.onmessage = e => { if (e.data?.tipo === 'ir-app') location.href = url(e.data.id); };

// Entrada das seções
if (!calmo) {
  gsap.from('.pr-cab > *', { autoAlpha: 0, y: 30, duration: 1, stagger: .12, ease: 'power3.out' });
}
