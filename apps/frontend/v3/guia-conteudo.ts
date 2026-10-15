// O que só o comercial vê: o guia de cada cena e de cada aplicação, o acesso interno aos sistemas
// e a tabela de preços. Usado pela gaveta (tecla G), pela janela do guia e pelo botão "Preços".
import { guias } from '../src/data';
import { app, notas } from './dados';

export const esc = (s: string) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));

// Acesso de demonstração: vem do .env.local (fora do git). Sem ele, o guia só mostra o endereço.
const env = import.meta.env;
const soMicrosoft = ['prd', 'report'];
export function acesso(id: string) {
  const a = app(id), cfo = id === 'cfo';
  const email = cfo ? env.VITE_DEMO_CFO_EMAIL : env.VITE_DEMO_EMAIL, senha = cfo ? env.VITE_DEMO_CFO_SENHA : env.VITE_DEMO_SENHA;
  const linha = (rot: string, v: string) => `<div><span><small>${rot}</small><br><code>${esc(v)}</code></span><button type="button" data-copiar="${esc(v)}">Copiar</button></div>`;
  return `<div class="acesso">
    <div><span><small>Endereço</small><br><code>${a.url}</code></span><a class="bt bt-claro bt-pequeno" href="https://${a.url}" target="_blank" rel="noopener">Entrar</a></div>
    ${soMicrosoft.includes(id) ? '<small>Este sistema só aceita login com a conta Microsoft da empresa.</small>'
      : email && senha ? linha('E-mail de demonstração', email) + linha('Senha', senha)
      : '<small>Acesso de demonstração não configurado neste computador (VITE_DEMO_EMAIL e VITE_DEMO_SENHA no .env.local).</small>'}
  </div>`;
}

export function guiaApp(id: string) {
  const a = app(id), g = guias[id];
  return `<div class="guia">
    <p class="rotulo">${a.category}</p><h2>${a.name}</h2>
    <p class="fala">${esc(g.pitch)}</p>
    <h3>Demonstração ao vivo</h3>
    <ol>${a.steps.map((s, i) => `<li><b>${esc(s[0])}.</b> ${esc(g.falas[i] ?? s[1])}</li>`).join('')}</ol>
    <h3>Perguntas para o cliente</h3><ul>${g.descoberta.map(q => `<li>${esc(q)}</li>`).join('')}</ul>
    <h3>Se o cliente disser</h3>${g.objecoes.map(([o, r]) => `<p class="objecao"><b>“${esc(o)}”</b>${esc(r)}</p>`).join('')}
    ${g.prova ? `<h3>Prova</h3><p><b>${g.prova[0]}</b> ${esc(g.prova[1])}</p>` : ''}
    <h3>Acesso interno</h3>${acesso(id)}
  </div>`;
}

export function guiaCena(i: number) {
  const n = notas[i]; if (!n) return '';
  return `<div class="guia">
    <p class="rotulo">Cena ${i} de ${notas.length - 1} · ${n.minutos} min</p><h2>${esc(n.nome)}</h2>
    <p>${esc(n.objetivo)}</p>
    <h3>O que falar</h3><p class="fala">${esc(n.fala)}</p>
    ${n.pergunta ? `<h3>Pergunta para o cliente</h3><p>${esc(n.pergunta)}</p>` : ''}
    ${n.objecoes?.length ? `<h3>Se o cliente disser</h3>${n.objecoes.map(([o, r]) => `<p class="objecao"><b>“${esc(o)}”</b>${esc(r)}</p>`).join('')}` : ''}
  </div>`;
}

// Copiar com fallback (navegadores sem permissão de área de transferência)
export function ligarCopiar(raiz: ParentNode = document) {
  raiz.addEventListener('click', async e => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-copiar]'); if (!b) return;
    const v = b.dataset.copiar!;
    try { await navigator.clipboard.writeText(v); } catch { const t = document.createElement('textarea'); t.value = v; document.body.append(t); t.select(); document.execCommand('copy'); t.remove(); }
    const antes = b.textContent; b.textContent = 'Copiado'; setTimeout(() => { b.textContent = antes; }, 1400);
  });
}
