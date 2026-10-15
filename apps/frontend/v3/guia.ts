// Guia do apresentador em outra janela (o notebook do comercial). Conversa com a apresentação pelo BroadcastChannel:
// recebe a cena e a aplicação abertas, e manda trocar de cena, o nome do cliente e a rota.
import './base.css';
import './guia.css';
import { apps } from '../src/data';
import { chaves, notas, rotas } from './dados';
import { acesso, guiaApp, guiaCena, ligarCopiar } from './guia-conteudo';
import { mercadoDe, montarSimulador } from './simulador';
import './simulador.css';

const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector(s) as T;
const canal = new BroadcastChannel('p360-v3');
const ler = (k: string, p: string) => { try { return JSON.parse(localStorage.getItem(k) ?? 'null') ?? p; } catch { return p; } };
let cena = 0;

// Abas
const aba = (n: string) => {
  document.querySelectorAll<HTMLElement>('[role=tab]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.aba === n)));
  document.querySelectorAll<HTMLElement>('[data-painel]').forEach(p => { p.hidden = p.dataset.painel !== n; });
};
document.querySelectorAll<HTMLElement>('[role=tab]').forEach(b => b.addEventListener('click', () => aba(b.dataset.aba!)));

// Cena atual
function mostrarCena(i: number) {
  cena = i; $('#g-cena').innerHTML = guiaCena(i); $('#g-onde').textContent = `${String(i).padStart(2, '0')} · ${notas[i]?.nome ?? ''}`;
  document.querySelectorAll('#g-cenas li').forEach((li, k) => li.classList.toggle('on', k === i));
}
$('#g-cenas').innerHTML = notas.map((n, i) => `<li><button type="button" data-ir="${i}"><span>${String(i).padStart(2, '0')}</span>${n.nome}<small>${n.minutos} min</small></button></li>`).join('');
$('#g-cenas').addEventListener('click', e => { const b = (e.target as HTMLElement).closest<HTMLElement>('[data-ir]'); if (b) canal.postMessage({ tipo: 'ir', i: +b.dataset.ir! }); });
$('#g-ant').addEventListener('click', () => canal.postMessage({ tipo: 'ir', i: Math.max(0, cena - 1) }));
$('#g-prox').addEventListener('click', () => canal.postMessage({ tipo: 'ir', i: Math.min(notas.length - 1, cena + 1) }));
mostrarCena(0);

// Aplicações: o roteiro da demonstração ao vivo de cada uma
const mostrarApp = (id: string) => { $('#g-app').innerHTML = guiaApp(id); document.querySelectorAll('#g-apps button').forEach(b => b.classList.toggle('on', (b as HTMLElement).dataset.app === id)); };
$('#g-apps').innerHTML = apps.map(a => `<button type="button" data-app="${a.id}" style="--c:${a.color}">${a.name}</button>`).join('');
$('#g-apps').addEventListener('click', e => { const b = (e.target as HTMLElement).closest<HTMLElement>('[data-app]'); if (b) mostrarApp(b.dataset.app!); });
mostrarApp(new URLSearchParams(location.search).get('app') ?? apps[0].id);
if (new URLSearchParams(location.search).get('app')) aba('apps');

// Preços (com as aplicações ligadas às chaves que o cliente escolheu) e acessos
const precos = montarSimulador($('#g-precos'), { fechar: false });
$('#g-acessos').innerHTML = apps.map(a => `<h3 class="g-h">${a.name}</h3>${acesso(a.id)}`).join('');
ligarCopiar(document);

// Reunião: cliente, rota e cronômetro
$<HTMLInputElement>('#cliente').value = ler('p360-cliente', '');
$('#cliente').addEventListener('input', e => canal.postMessage({ tipo: 'cliente', nome: (e.target as HTMLInputElement).value }));
$('#rota').innerHTML = Object.entries(rotas).map(([k, r]) => `<option value="${k}">${r.nome}</option>`).join('');
$<HTMLSelectElement>('#rota').value = ler('p360-rota', 'completa');
$('#rota').addEventListener('change', e => canal.postMessage({ tipo: 'rota', rota: (e.target as HTMLSelectElement).value }));
let inicio = 0, gasto = 0, relogio = 0;
const mostrarTempo = () => { const s = Math.floor((gasto + (inicio ? Date.now() - inicio : 0)) / 1000); $('#tempo').textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; };
$('#tempo-bt').addEventListener('click', () => {
  if (inicio) { gasto += Date.now() - inicio; inicio = 0; clearInterval(relogio); $('#tempo-bt').textContent = 'Continuar'; }
  else { inicio = Date.now(); relogio = window.setInterval(mostrarTempo, 500); $('#tempo-bt').textContent = 'Pausar'; }
});
$('#tempo-zerar').addEventListener('click', () => { gasto = 0; inicio = inicio ? Date.now() : 0; mostrarTempo(); });

canal.onmessage = ({ data: d }) => {
  if (d?.tipo === 'cena') { mostrarCena(d.i); if (d.chaves) { const cs = chaves.filter(c => d.chaves.includes(c.nome)); precos.marcar([...new Set(cs.map(c => c.app))]); precos.pessoas(d.pessoas ?? 20); precos.mercado(mercadoDe(cs)); } }
  else if (d?.tipo === 'app') { mostrarApp(d.id); aba('apps'); }
  else if (d?.tipo === 'cliente') $<HTMLInputElement>('#cliente').value = d.nome;
};
canal.postMessage({ tipo: 'ola' });
