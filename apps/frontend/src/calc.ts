import gsap from 'gsap';
import { apps, svg, products } from './data';
import { $, $$, abrir } from './ui';

// Calculadora comercial (antiga calculadora.html), agora nativa da página e explicando cada número.
// A conta é a mesma: produtos + usuários extras + IA + infraestrutura + suporte − desconto = mensalidade.
const planos: { nome: string; titulo: string; info: string; opcoes: [string, number, string][] }[] = [
  { nome: 'tokenPlan', titulo: 'IA / Tokens', info: 'tokens', opcoes: [['Start', 0, '1k tokens · Grátis'], ['Medium', 500, '20k tokens · R$ 500/mês'], ['Advanced', 1000, '50k tokens · R$ 1.000/mês']] },
  { nome: 'infraPlan', titulo: 'Infraestrutura', info: 'infra', opcoes: [['Básica', 600, 'R$ 600/mês'], ['Intermediária', 2000, 'R$ 2.000/mês'], ['Profissional', 5000, 'R$ 5.000/mês']] },
  { nome: 'supportPlan', titulo: 'Suporte', info: 'support', opcoes: [['FAQ', 0, 'Grátis'], ['Automatizado com IA', 1000, 'R$ 1.000/mês'], ['E-mail e Ticket', 2000, 'R$ 2.000/mês'], ['Suporte Humanizado', 3000, 'R$ 3.000/mês']] }
];
const infoContent: Record<string, { title: string; description: string; items: [string, string][] }> = {
  usuarios: { title: 'Quantidade de usuários', description: 'Total de pessoas que vão usar os sistemas. Só o que passa da franquia é cobrado: usuários extras = quantidade de usuários − usuários inclusos (nunca abaixo de zero).', items: [['Fator', 'Cada usuário acima da franquia acrescenta o fator por usuário extra sobre o total dos produtos.'], ['Exemplo', '20 usuários com 2 inclusos = 18 extras. Com R$ 5.480 em produtos e fator de 3%: 18 × 3% × R$ 5.480 = R$ 2.959,20/mês.']] },
  inclusos: { title: 'Usuários inclusos', description: 'Franquia de usuários que já vem no preço dos produtos, sem custo adicional.', items: [['Fator', 'Abate da quantidade de usuários antes da multiplicação: quanto maior a franquia, menos usuários extras são cobrados.'], ['Exemplo', '20 usuários com 10 inclusos = 10 extras. Com R$ 5.480 em produtos e fator de 3%: 10 × 3% × R$ 5.480 = R$ 1.644/mês.']] },
  extra: { title: 'Fator por usuário extra (%)', description: 'O usuário extra não tem preço fixo: ele custa um percentual do total dos produtos contratados. Quem contrata mais sistemas paga mais por usuário, porque cada usuário usa mais coisa.', items: [['Fator', 'Usuários adicionais = usuários extras × total dos produtos × fator ÷ 100.'], ['Exemplo', '18 extras, R$ 5.480 em produtos, fator de 3% = R$ 2.959,20/mês. Com fator de 2%, os mesmos 18 extras custam R$ 1.972,80/mês.'], ['Referência', 'Com 3%, cada usuário extra custa R$ 164,40 numa conta de R$ 5.480 em produtos e R$ 74,70 numa conta só com o PominAI (R$ 2.490).']] },
  desconto: { title: 'Desconto comercial (%)', description: 'Percentual aplicado no fim, sobre a soma de tudo: produtos + usuários extras + IA + infraestrutura + suporte.', items: [['Fator', 'Mensalidade = subtotal × (1 − desconto ÷ 100). O desconto vai de 0% a 100%.'], ['Exemplo', 'Subtotal de R$ 6.815 com 10% de desconto = R$ 6.133,50/mês. O custo interno não muda, então a margem cai junto.']] },
  tokens: { title: 'IA / Tokens', description: 'Define a franquia mensal de uso de inteligência artificial. Quanto maior a franquia, maior a capacidade para automações, agentes, análises e geração de conteúdo.', items: [['Start • 1k tokens • Grátis', 'Para uso inicial, testes e pequenas automações com baixa frequência.'], ['Medium • 20k tokens • R$ 500/mês', 'Para equipes que utilizam IA durante a rotina, com volume moderado de análises e automações.'], ['Advanced • 50k tokens • R$ 1.000/mês', 'Para operação intensiva de IA, maior volume de agentes, análises e automações recorrentes.']] },
  infra: { title: 'Infraestrutura', description: 'Define a capacidade técnica reservada para a conta. O valor cobre recursos de aplicação, banco de dados, storage, backup, observabilidade e capacidade de crescimento.', items: [['Básica • R$ 600/mês', 'Máquina AWS EC2 c6i.large: 2 vCPU, 4 GB de RAM e 500 GB de armazenamento. Indicada para operações menores, menor concorrência de usuários e uso padrão dos produtos.'], ['Intermediária • R$ 2.000/mês', 'Máquina AWS EC2 c6i.xlarge: 4 vCPU, 8 GB de RAM e 1 TB de armazenamento. Indicada para operações em crescimento, maior volume de acessos, integrações e processamento.'], ['Profissional • R$ 5.000/mês', 'Máquina AWS EC2 c6i.2xlarge: 8 vCPU, 16 GB de RAM e 2 TB de armazenamento. Indicada para ambientes críticos, maior escala, maior disponibilidade e cargas mais intensas.']] },
  support: { title: 'Suporte', description: 'Define como o cliente será atendido quando precisar de ajuda, dúvidas ou acompanhamento da operação.', items: [['FAQ • Grátis', 'Base de conhecimento e materiais de autoatendimento.'], ['Automatizado com IA • R$ 1.000/mês', 'Atendimento automatizado por IA para dúvidas, orientações e triagem inicial.'], ['E-mail e Ticket • R$ 2.000/mês', 'Canal estruturado por e-mail e abertura de tickets para acompanhamento das solicitações.'], ['Suporte Humanizado • R$ 3.000/mês', 'Atendimento com pessoas, acompanhamento próximo e tratamento de situações que exigem interação humana.']] }
};
const PRICE_PASSWORD = 'comercial'; // ponytail: senha no navegador só evita clique acidental; trava de verdade é a calculadora atrás do login (servir.py)
const nomeApp: Record<string, string> = { PominReports: 'report', PominChat: 'chat' };
const appDe = (n: string) => apps.find(a => a.id === nomeApp[n] || a.name === n);
const generico = svg('<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 12h8M12 8v8"/>');
const fmt = (n: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n || 0);
const pct = (n: number) => n.toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '%';
const CORES = ['#00D9F5', '#00C9B4', '#00E3A4', '#5FD0FF', '#9E8BFF'];

const selected = new Set(['PominAI', 'PominDev']);
let mensalidade = 0;
const num = (id: string) => Math.max(0, Number($<HTMLInputElement>('#' + id).value || 0));
const plano = (n: string) => document.querySelector<HTMLInputElement>(`input[name="${n}"]:checked`)!;
const mostrado = { v: 0 };

function renderProducts() {
  $('#products').innerHTML = products.map((p, i) => {
    const a = appDe(p.name);
    return `<article class="product ${selected.has(p.name) ? 'selected' : ''}" data-name="${p.name}" style="--c:${a?.color ?? '#64809B'}">
      <button type="button" class="p-toggle" data-toggle="${p.name}" aria-pressed="${selected.has(p.name)}" aria-label="${selected.has(p.name) ? 'Remover' : 'Adicionar'} ${p.name}"></button>
      <span class="p-top"><span class="p-icon" aria-hidden="true">${a?.icon ?? generico}</span><span class="check" aria-hidden="true">✓</span></span>
      <strong>${p.name}</strong><span class="tag">${p.level}</span><span class="p-desc">${p.desc}</span>
      <span class="price-editor" data-editor-index="${i}"><small>Preço-base mensal</small>
        <button type="button" class="price-view" data-price-lock="${i}" aria-label="Editar preço de ${p.name} (pede senha)"><span class="price-display">${fmt(p.price)}</span><span aria-hidden="true">🔒</span></button>
        <input class="product-price-input" type="number" min="0" step="10" value="${p.price}" data-index="${i}" aria-label="Preço-base de ${p.name}" /></span>
    </article>`;
  }).join('');
}

function calc() {
  const sel = products.filter(p => selected.has(p.name));
  const productsTotal = sel.reduce((s, p) => s + p.price, 0);
  const users = Math.max(1, num('users')), included = num('includedUsers'), extraUsers = Math.max(0, users - included), factor = Math.min(100, num('userFactor'));
  // Usuário extra não tem preço fixo: custa um % do total dos produtos contratados
  const usersTotal = extraUsers * productsTotal * factor / 100;
  const tk = plano('tokenPlan'), inf = plano('infraPlan'), sup = plano('supportPlan');
  const tokenSell = +tk.value, infraSell = +inf.value, supportSell = +sup.value;
  const subtotal = productsTotal + usersTotal + tokenSell + infraSell + supportSell;
  const discountPct = Math.min(100, num('discount')), discountValue = subtotal * discountPct / 100, finalTotal = subtotal - discountValue;
  const internalCost = tokenSell + infraSell + supportSell, marginValue = finalTotal - internalCost, marginPct = finalTotal > 0 ? marginValue / finalTotal * 100 : 0;
  mensalidade = finalTotal;

  gsap.to(mostrado, { v: finalTotal, duration: .7, ease: 'expo.out', onUpdate: () => { $('#total').textContent = fmt(mostrado.v); } });
  $('#perUser').textContent = `${fmt(finalTotal / users)} por usuário`;
  const partes: [string, number, string][] = [['Aplicações', productsTotal, `${sel.length} selecionadas`], ['Usuários extras', usersTotal, `${extraUsers} acima da franquia`], ['IA / Tokens', tokenSell, tk.dataset.nome!], ['Infraestrutura', infraSell, inf.dataset.nome!], ['Suporte', supportSell, sup.dataset.nome!]];
  $('#stack').innerHTML = partes.map(([n, v], k) => `<i style="--w:${subtotal ? v / subtotal * 100 : 0}%;--cor:${CORES[k]}" title="${n}: ${fmt(v)}"></i>`).join('') + (discountValue ? `<i class="desc" style="--w:${discountPct}%"></i>` : '');
  $('#rows').innerHTML = partes.map(([n, v, s], k) => `<li style="--cor:${CORES[k]}"><span><b>${n}</b><small>${s}</small></span><strong>${fmt(v)}</strong></li>`).join('') + `<li class="minus"><span><b>Desconto</b><small>${pct(discountPct)} sobre o subtotal</small></span><strong>− ${fmt(discountValue)}</strong></li>`;
  $('#how').innerHTML = [
    `<b>Aplicações:</b> soma dos preços-base de ${sel.length} ${sel.length === 1 ? 'aplicação' : 'aplicações'} = <em>${fmt(productsTotal)}</em>`,
    `<b>Usuários extras:</b> ${users} − ${included} inclusos = ${extraUsers} × ${pct(factor)} × ${fmt(productsTotal)} = <em>${fmt(usersTotal)}</em>`,
    `<b>Serviço:</b> IA ${tk.dataset.nome} ${fmt(tokenSell)} + infraestrutura ${inf.dataset.nome} ${fmt(infraSell)} + suporte ${sup.dataset.nome} ${fmt(supportSell)}`,
    `<b>Subtotal</b> ${fmt(subtotal)} − desconto de ${pct(discountPct)} (${fmt(discountValue)}) = <em>${fmt(finalTotal)}/mês</em>`
  ].map(l => `<li>${l}</li>`).join('');
  const n = sel.length;
  $('#deploy').innerHTML = n ? `<span class="dl-ico" aria-hidden="true">◷</span><span><b>Implantação</b> ${n >= 13 ? 'até 2 meses, como pacote completo' : `estimada em ${n} ${n === 1 ? 'semana' : 'semanas'} (1 por sistema)`}</span>` : '';
  $('#costTotal').textContent = fmt(internalCost);
  $('#marginValue').textContent = fmt(marginValue);
  $('#marginPct').textContent = marginPct.toFixed(1).replace('.', ',') + '%';
  $('#selectedCount').textContent = String(n);
}

function modal(id: string) { abrir($<HTMLDialogElement>('#' + id)); }
function openInfo(type: string) {
  const data = infoContent[type]; if (!data) return;
  $('#modalTitle').textContent = data.title; $('#modalDescription').textContent = data.description;
  $('#modalList').innerHTML = data.items.map(([b, s]) => `<div class="modal-item"><b>${b}</b><span>${s}</span></div>`).join('');
  modal('infoModal');
}

let pendingPriceIndex: number | null = null;
function confirmPricePassword() {
  if ($<HTMLInputElement>('#pricePassword').value !== PRICE_PASSWORD) { $('#passwordError').textContent = 'Senha incorreta.'; $<HTMLInputElement>('#pricePassword').select(); return; }
  const idx = pendingPriceIndex; $<HTMLDialogElement>('#passwordModal').close();
  const editor = document.querySelector(`[data-editor-index="${idx}"]`), input = document.querySelector<HTMLInputElement>(`.product-price-input[data-index="${idx}"]`);
  if (editor && input) { editor.classList.add('editing'); input.focus(); input.select(); }
}

export function iniciarCalc() {
  $('#plans').innerHTML = planos.map(g => `<fieldset class="plan-group"><legend>${g.titulo} <button class="info" type="button" data-info="${g.info}" aria-label="Saiba mais sobre ${g.titulo}">i</button></legend>
    ${g.opcoes.map(([n, v, s], k) => `<label class="plan"><input type="radio" name="${g.nome}" value="${v}" data-nome="${n}" ${k === 0 ? 'checked' : ''} /><span><b>${n}</b><small>${s}</small></span></label>`).join('')}</fieldset>`).join('');
  renderProducts(); calc();

  const grid = $('#products');
  grid.addEventListener('click', e => {
    const t = e.target as HTMLElement;
    const lockBtn = t.closest<HTMLElement>('[data-price-lock]');
    if (lockBtn) { pendingPriceIndex = Number(lockBtn.dataset.priceLock); $<HTMLInputElement>('#pricePassword').value = ''; $('#passwordError').textContent = ''; modal('passwordModal'); setTimeout(() => $('#pricePassword').focus(), 30); return; }
    if (t.closest('.product-price-input')) return;
    const card = t.closest<HTMLElement>('.product'); if (!card) return;
    const name = card.dataset.name!; if (selected.has(name)) selected.delete(name); else selected.add(name);
    card.classList.toggle('selected', selected.has(name));
    const b = $('.p-toggle', card); b.setAttribute('aria-pressed', String(selected.has(name))); b.setAttribute('aria-label', (selected.has(name) ? 'Remover ' : 'Adicionar ') + name);
    gsap.fromTo(card, { scale: .97 }, { scale: 1, duration: .5, ease: 'back.out(3)' });
    calc();
  });
  grid.addEventListener('input', e => {
    const t = e.target as HTMLInputElement; if (!t.matches('.product-price-input')) return;
    const idx = Number(t.dataset.index); products[idx].price = Math.max(0, Number(t.value || 0));
    $(`[data-price-lock="${idx}"] .price-display`).textContent = fmt(products[idx].price); calc();
  });
  grid.addEventListener('focusout', e => { const t = e.target as HTMLElement; if (t.matches('.product-price-input')) t.closest('.price-editor')?.classList.remove('editing'); });

  $$<HTMLInputElement>('#users, #includedUsers, #userFactor, #discount, #plans input').forEach(i => { i.addEventListener('input', calc); i.addEventListener('change', calc); });
  // − e + respeitando min/max (o fator anda de 0,5 em 0,5)
  $$('.stepper').forEach(s => {
    const input = $<HTMLInputElement>('input', s), passo = Number(s.dataset.step);
    $$('button', s).forEach((b, k) => b.onclick = () => {
      const min = input.min === '' ? -Infinity : Number(input.min), max = input.max === '' ? Infinity : Number(input.max);
      input.value = String(Math.min(max, Math.max(min, Math.round(((Number(input.value) || 0) + (k ? passo : -passo)) * 10) / 10)));
      input.dispatchEvent(new Event('input'));
    });
  });
  document.addEventListener('click', e => { const b = (e.target as HTMLElement).closest<HTMLElement>('.info[data-info]'); if (b) { e.preventDefault(); openInfo(b.dataset.info!); } });
  $('#selectAll').onclick = () => { products.forEach(p => selected.add(p.name)); renderProducts(); calc(); };
  $('#clearAll').onclick = () => { selected.clear(); renderProducts(); calc(); };

  $('#passwordCancel').onclick = () => $<HTMLDialogElement>('#passwordModal').close();
  $('#passwordConfirm').onclick = confirmPricePassword;
  $('#pricePassword').addEventListener('keydown', e => { if (e.key === 'Enter') confirmPricePassword(); });

  // Contratar: servidor cria a assinatura mensal no Mercado Pago e devolve o link
  $('#hireBtn').onclick = () => {
    $('#hireValue').textContent = fmt(mensalidade);
    $('#hireError').textContent = mensalidade > 0 ? '' : 'Marque ao menos uma aplicação: a mensalidade está zerada.';
    $('#hireLink').hidden = true; $<HTMLButtonElement>('#hireSubmit').disabled = false;
    modal('hireModal'); setTimeout(() => $('#hireName').focus(), 30);
  };
  $('#hireCancel').onclick = () => $<HTMLDialogElement>('#hireModal').close();
  $<HTMLFormElement>('#hireForm').addEventListener('submit', async e => {
    e.preventDefault();
    const f = new FormData(e.target as HTMLFormElement), doc = String(f.get('doc')).replace(/\D/g, ''), erro = (t: string) => { $('#hireError').textContent = t; };
    if (String(f.get('nome')).trim().length < 3) return erro('Informe o nome do responsável.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(f.get('email')).trim())) return erro('Informe um e-mail válido.');
    const fone = String(f.get('fone')).replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '');
    if (fone.length < 10 || fone.length > 11) return erro('Informe o WhatsApp ou telefone com DDD.');
    if (doc.length !== 11 && doc.length !== 14) return erro('CPF tem 11 dígitos e CNPJ tem 14.');
    if (mensalidade <= 0) return erro('Marque ao menos uma aplicação: a mensalidade está zerada.');
    erro('');
    const aba = window.open('', '_blank'); // abre no clique (senão o navegador bloqueia); o link entra quando o servidor responder
    const btn = $<HTMLButtonElement>('#hireSubmit'); btn.disabled = true; $('span', btn).textContent = 'Gerando link…';
    try {
      const r = await fetch('/api/contratar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nome: String(f.get('nome')).trim(), email: String(f.get('email')).trim(), fone, doc, valor: Math.round(mensalidade * 100) / 100, sistemas: [...selected] }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.link) throw new Error(d.erro || 'Não foi possível gerar o link de pagamento.');
      if (aba) aba.location = d.link;
      const link = $('#hireLink'); link.hidden = false; link.textContent = 'Link de pagamento (envie ao cliente se precisar): ';
      const a = link.appendChild(document.createElement('a')); a.href = d.link; a.target = '_blank'; a.rel = 'noopener'; a.textContent = d.link;
    } catch (err) { aba?.close(); erro((err as Error).message); }
    finally { btn.disabled = false; $('span', btn).textContent = 'Gerar link de pagamento'; }
  });

  return {
    // Vem marcado o que foi escolhido nas aplicações; sem seleção fica o padrão
    aplicar(nomes: string[]) { const ok = nomes.filter(n => products.some(p => p.name === n)); if (!ok.length) return; selected.clear(); ok.forEach(n => selected.add(n)); renderProducts(); calc(); }
  };
}
