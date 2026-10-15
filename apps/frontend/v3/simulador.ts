// Simulador de investimento (uso interno do comercial). Mesma conta da calculadora antiga:
// aplicações + pessoas além das incluídas (% sobre as aplicações) + infraestrutura + suporte + IA − desconto.
// A mais: atalhos de seleção, composição visual, implantação estimada, comparação honesta com o molho do cliente
// e um resumo pronto para copiar. Custo e margem ficam recolhidos em "Visão interna".
import { gsap } from 'gsap';
import { apps, products, svg } from '../src/data';
import { brl, type Chave } from './dados';

const INCLUSOS = 2, FATOR = .03;
type Plano = { nome: string; valor: number; detalhe: string };
const planos: Record<'infra' | 'suporte' | 'ia', { titulo: string; opcoes: Plano[] }> = {
  infra: { titulo: 'Infraestrutura dedicada', opcoes: [
    { nome: 'Básica', valor: 600, detalhe: '2 vCPU, 4 GB de RAM e 500 GB. Para operações menores.' },
    { nome: 'Intermediária', valor: 2000, detalhe: '4 vCPU, 8 GB de RAM e 1 TB. Para operações em crescimento e integrações.' },
    { nome: 'Profissional', valor: 5000, detalhe: '8 vCPU, 16 GB de RAM e 2 TB. Para ambientes críticos e maior escala.' }] },
  suporte: { titulo: 'Suporte', opcoes: [
    { nome: 'FAQ', valor: 0, detalhe: 'Base de conhecimento e autoatendimento.' },
    { nome: 'Automatizado com IA', valor: 1000, detalhe: 'Dúvidas, orientações e triagem inicial por IA.' },
    { nome: 'E-mail e Ticket', valor: 2000, detalhe: 'Canal por e-mail e chamados com acompanhamento.' },
    { nome: 'Humanizado', valor: 3000, detalhe: 'Atendimento com pessoas e acompanhamento próximo.' }] },
  ia: { titulo: 'IA / Tokens', opcoes: [
    { nome: 'Start', valor: 0, detalhe: '1 mil tokens. Testes e pequenas automações.' },
    { nome: 'Medium', valor: 500, detalhe: '20 mil tokens. IA na rotina, volume moderado.' },
    { nome: 'Advanced', valor: 1000, detalhe: '50 mil tokens. Uso intensivo, agentes e automações.' }] }
};
const niveis = ['Estratégico', 'Gestão', 'Operacional', 'Financeiro', 'Crítico'];
const nomeProduto: Record<string, string> = { report: 'PominReports', chat: 'PominChat', cfo: 'Reports CFO' };
const produtoDe = (id: string) => products.find(p => p.name === (nomeProduto[id] ?? apps.find(a => a.id === id)?.name));
const appDoProduto = (nome: string) => apps.find(a => (nomeProduto[a.id] ?? a.name) === nome);
const generico = svg('<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 12h8M12 8v8"/>');
const CORES = ['#00E3A4', '#00D9F5', '#5B7CF0', '#F5B544', '#A066ED'];

// ferramentas que o cliente paga hoje (preço de tabela por pessoa) e a aplicação Pomin360 que entra no lugar de cada uma
export interface Mercado { itens: { nome: string; app: string; porPessoa: number }[] }
export const mercadoDe = (cs: Chave[]): Mercado | undefined => { const m = cs.filter(c => c.porPessoa); return m.length ? { itens: m.map(c => ({ nome: c.nome, app: c.app, porPessoa: c.porPessoa! })) } : undefined; };
export function montarSimulador(el: HTMLElement, o: { apps?: string[]; pessoas?: number; mercado?: Mercado; cliente?: string; fechar?: boolean } = {}) {
  const ecossistema = apps.map(a => produtoDe(a.id)?.name).filter(Boolean) as string[];
  const sel = new Set<string>((o.apps ?? []).map(id => produtoDe(id)?.name).filter(Boolean) as string[]);
  let mercado = o.mercado;
  el.innerHTML = `<div class="sim">
    <header class="sim-cab">
      <div><p class="rotulo">Uso interno do comercial</p><h2>Simulador de investimento</h2><p class="sim-sub">Preços-base do catálogo. A proposta final é desenhada para cada projeto.</p></div>
      <div class="sim-cab-acoes"><button type="button" class="bt bt-linha bt-pequeno" data-copiar-resumo>Copiar resumo</button>${o.fechar === false ? '' : '<button type="button" class="bt bt-linha bt-pequeno" data-fechar>Fechar</button>'}</div>
    </header>
    <div class="sim-corpo">
      <div class="sim-escolhas">
        <section><h4><span>1</span>Aplicações</h4>
          <p class="sim-atalhos">${o.apps?.length ? '<button type="button" data-atalho="molho">As do molho do cliente</button>' : ''}<button type="button" data-atalho="tudo">Ecossistema completo</button><button type="button" data-atalho="limpar">Limpar</button></p>
          ${niveis.map(n => { const ps = products.filter(p => p.level === n); return ps.length ? `<p class="sim-nivel">${n}</p><div class="sim-produtos">${ps.map(p => { const a = appDoProduto(p.name); return `<label class="sim-prod${p.price ? '' : ' sem-preco'}" style="--c:${a?.color ?? '#8FA3B8'}"><input type="checkbox" value="${p.name}" ${sel.has(p.name) ? 'checked' : ''} ${p.price ? '' : 'disabled'} /><i aria-hidden="true">${a?.icon ?? generico}</i><span><b>${p.name}</b><small>${p.desc}</small></span><em>${p.price ? brl(p.price) : 'a definir'}</em></label>`; }).join('')}</div>` : ''; }).join('')}
        </section>
        <section><h4><span>2</span>Pessoas</h4>
          <div class="sim-pessoas"><input type="range" min="1" max="500" value="${o.pessoas ?? 20}" data-pessoas-faixa aria-label="Pessoas" /><input type="number" min="1" max="5000" value="${o.pessoas ?? 20}" data-pessoas aria-label="Quantidade de pessoas" /></div>
          <p class="sim-ajuda">${INCLUSOS} pessoas já incluídas. Cada pessoa a mais acrescenta ${FATOR * 100}% sobre o total das aplicações.</p>
        </section>
        ${(['infra', 'suporte', 'ia'] as const).map((k, i) => `<section><h4><span>${i + 3}</span>${planos[k].titulo}</h4><div class="sim-planos">${planos[k].opcoes.map((p, j) => `<label class="sim-plano"><input type="radio" name="sim-${k}" value="${j}" ${j === 0 ? 'checked' : ''} /><b>${p.nome}</b><em>${p.valor ? brl(p.valor) + '/mês' : 'Grátis'}</em><small>${p.detalhe}</small></label>`).join('')}</div></section>`).join('')}
        <section><h4><span>6</span>Desconto comercial</h4><div class="sim-pessoas"><input type="range" min="0" max="30" value="0" data-desconto aria-label="Desconto em %" /><output data-desconto-ver>0%</output></div></section>
      </div>
      <aside class="sim-resumo" aria-live="polite">
        <p class="rotulo">Mensalidade estimada</p>
        <p class="sim-total"><b data-total>R$ 0</b><span>/mês</span></p>
        <p class="sim-linha2" data-linha2></p>
        <div class="sim-barra" data-barra></div>
        <ul class="sim-partes" data-partes></ul>
        <div class="sim-mercado" data-mercado></div>
        <p class="sim-implantacao" data-implantacao></p>
        <details class="sim-interna"><summary>Visão interna (não mostrar ao cliente)</summary><p data-interna></p></details>
      </aside>
    </div>
  </div>`;
  const $ = <T extends HTMLElement = HTMLElement>(s: string) => el.querySelector(s) as T;
  const mostrado = { v: 0 };
  let resumo = '';
  const plano = (k: keyof typeof planos) => planos[k].opcoes[+$<HTMLInputElement>(`input[name="sim-${k}"]:checked`).value];
  function conta() {
    const escolhidos = products.filter(p => sel.has(p.name) && p.price), P = escolhidos.reduce((s, p) => s + p.price, 0);
    const U = Math.max(1, Math.round(+$<HTMLInputElement>('[data-pessoas]').value || 1)), extras = Math.max(0, U - INCLUSOS), pessoasV = extras * FATOR * P;
    const [inf, sup, ia] = [plano('infra'), plano('suporte'), plano('ia')], d = +$<HTMLInputElement>('[data-desconto]').value / 100;
    const subtotal = P + pessoasV + inf.valor + sup.valor + ia.valor, desconto = subtotal * d, total = subtotal - desconto;
    const partes: [string, number, string][] = [[`${escolhidos.length} ${escolhidos.length === 1 ? 'aplicação' : 'aplicações'}`, P, escolhidos.map(p => p.name).join(', ') || 'nenhuma escolhida'], [`${extras} ${extras === 1 ? 'pessoa' : 'pessoas'} além das ${INCLUSOS}`, pessoasV, `${extras} × ${FATOR * 100}% × ${brl(P)}`], [`Infraestrutura ${inf.nome}`, inf.valor, inf.detalhe], [`Suporte ${sup.nome}`, sup.valor, sup.detalhe], [`IA ${ia.nome}`, ia.valor, ia.detalhe]];
    gsap.to(mostrado, { v: total, duration: .6, ease: 'expo.out', overwrite: true, onUpdate: () => { $('[data-total]').textContent = brl(mostrado.v); } });
    $('[data-linha2]').innerHTML = `${brl(total * 12)} por ano · ${brl(total / U)} por pessoa${d ? ` · desconto de ${Math.round(d * 100)}% (− ${brl(desconto)})` : ''}`;
    $('[data-barra]').innerHTML = partes.map(([n, v], k) => `<i style="--w:${subtotal ? v / subtotal * 100 : 0}%;--cor:${CORES[k]}" title="${n}: ${brl(v)}"></i>`).join('');
    $('[data-partes]').innerHTML = partes.map(([n, v, s], k) => `<li style="--cor:${CORES[k]}"><span><b>${n}</b><small>${s}</small></span><strong>${brl(v)}</strong></li>`).join('');
    // comparação com o molho do cliente (preço de tabela por pessoa × pessoas), sempre honesta
    // comparação justa: ferramenta cuja aplicação ainda está sem preço sai dos dois lados da conta
    const valem = (mercado?.itens ?? []).filter(i => produtoDe(i.app)?.price), fora = (mercado?.itens ?? []).filter(i => !produtoDe(i.app)?.price);
    const porPessoaM = valem.reduce((s, i) => s + i.porPessoa, 0);
    if (porPessoaM) {
      const m = porPessoaM * U, dif = m - total;
      let virada = 0; for (let n = 1; n <= 3000; n++) { const t = (P + Math.max(0, n - INCLUSOS) * FATOR * P + inf.valor + sup.valor + ia.valor) * (1 - d); if (porPessoaM * n > t) { virada = n; break; } }
      $('[data-mercado]').innerHTML = `<p class="rotulo">Contra o molho de hoje</p><p><b>${brl(m)}</b>/mês no mercado (${valem.map(i => i.nome).join(', ')}, ${U} ${U === 1 ? 'pessoa' : 'pessoas'})</p>
        <p class="sim-dif ${dif >= 0 ? 'bom' : ''}">${dif >= 0 ? `${brl(dif)} a menos por mês com o Pomin360` : `Nesse tamanho, o mercado sai ${brl(-dif)} mais barato por mês`}</p>${virada > 1 ? `<small>Com essas escolhas, o Pomin360 fica abaixo desse molho a partir de ${virada} pessoas.</small>` : ''}${fora.length ? `<small class="sim-fora">${fora.map(i => i.nome).join(', ')} ficou fora da comparação: a aplicação equivalente ainda está com preço a definir.</small>` : ''}`;
    } else $('[data-mercado]').innerHTML = '';
    const n = escolhidos.length;
    $('[data-implantacao]').innerHTML = n ? `<b>Implantação:</b> ${n >= 13 ? 'até 2 meses, como pacote completo' : `cerca de ${n} ${n === 1 ? 'semana' : 'semanas'} (uma por sistema)`}.` : '';
    const custo = inf.valor + sup.valor + ia.valor, margem = total - custo;
    $('[data-interna]').innerHTML = `Custo de serviço (infraestrutura, suporte e IA): <b>${brl(custo)}</b>. Margem: <b>${brl(margem)}</b> (${total > 0 ? (margem / total * 100).toFixed(1).replace('.', ',') : '0'}%).`;
    resumo = [`Simulação Pomin360${o.cliente ? ' · ' + o.cliente : ''} · ${new Date().toLocaleDateString('pt-BR')}`, ...partes.map(([n, v]) => `${n}: ${brl(v)}`), d ? `Desconto ${Math.round(d * 100)}%: − ${brl(desconto)}` : '', `Mensalidade estimada: ${brl(total)} (${brl(total * 12)} por ano)`, n ? $('[data-implantacao]').textContent! : '', 'Valores de referência do catálogo. A proposta final é desenhada para o projeto.'].filter(Boolean).join('\n');
  }
  const pessoas = (v: number) => { const n = String(Math.max(1, Math.round(v) || 1)); $<HTMLInputElement>('[data-pessoas]').value = n; $<HTMLInputElement>('[data-pessoas-faixa]').value = n; conta(); };
  const marcar = (nomes: string[]) => { sel.clear(); nomes.forEach(n => sel.add(n)); el.querySelectorAll<HTMLInputElement>('.sim-prod input').forEach(i => { i.checked = sel.has(i.value); }); conta(); };
  el.addEventListener('input', e => {
    const t = e.target as HTMLInputElement;
    if (t.matches('.sim-prod input')) { t.checked ? sel.add(t.value) : sel.delete(t.value); conta(); }
    else if (t.matches('[data-pessoas-faixa]')) pessoas(+t.value);
    else if (t.matches('[data-pessoas]')) { $<HTMLInputElement>('[data-pessoas-faixa]').value = t.value; conta(); }
    else if (t.matches('[data-desconto]')) { $('[data-desconto-ver]').textContent = t.value + '%'; conta(); }
    else conta();
  });
  el.addEventListener('click', async e => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-atalho], [data-copiar-resumo]'); if (!b) return;
    if (b.dataset.atalho === 'molho') marcar((o.apps ?? []).map(id => produtoDe(id)?.name).filter(Boolean) as string[]);
    else if (b.dataset.atalho === 'tudo') marcar(ecossistema);
    else if (b.dataset.atalho === 'limpar') marcar([]);
    else if ('copiarResumo' in b.dataset) {
      try { await navigator.clipboard.writeText(resumo); } catch { const t = document.createElement('textarea'); t.value = resumo; document.body.append(t); t.select(); document.execCommand('copy'); t.remove(); }
      const antes = b.textContent; b.textContent = 'Resumo copiado'; setTimeout(() => { b.textContent = antes; }, 1500);
    }
  });
  conta();
  return {
    marcar: (ids: string[]) => marcar(ids.map(id => produtoDe(id)?.name).filter(Boolean) as string[]),
    pessoas, mercado: (m?: Mercado) => { mercado = m; conta(); }, resumo: () => resumo
  };
}
