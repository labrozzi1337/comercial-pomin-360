// PominBI · "A planilha de sexta". Tela recriada do PominBI real (tema claro): Integrações, Descoberta de Dados e painel.
// Câmera própria: mergulho para dentro da constelação de tabelas, viagem de nó em nó e recuo até o painel pronto.
import { ic, W, H, type Trailer, type Filme } from '../filme';
import { app } from '../dados';
import { svg } from '../../src/data';

const ico = {
  banco: svg('<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5"/><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"/>'),
  globo: svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'),
  grade: svg('<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'),
  modelo: svg('<rect x="3" y="3" width="18" height="7" rx="1.5"/><rect x="3" y="14" width="8" height="7" rx="1.5"/><rect x="15" y="14" width="6" height="7" rx="1.5"/>'),
  bussola: svg('<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>'),
  lua: svg('<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>'),
  boia: svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="m5.6 5.6 3.6 3.6M14.8 14.8l3.6 3.6M18.4 5.6l-3.6 3.6M9.2 14.8l-3.6 3.6"/>'),
  pontos: svg('<path d="M5 5h.01M12 5h.01M19 5h.01M5 12h.01M12 12h.01M19 12h.01M5 19h.01M12 19h.01M19 19h.01" stroke-width="3"/>'),
  painel: svg('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>'),
  tabela: svg('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 10v10"/>'),
  pega: svg('<path d="M9 5h.01M15 5h.01M9 12h.01M15 12h.01M9 19h.01M15 19h.01" stroke-width="3"/>'),
  compartilhar: svg('<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4"/>')
};

// ---------- A constelação: tabelas do ERP e suas colunas (posições em px dentro do mapa 762×626) ----------
type Tipo = 'med' | 'dim' | 'dat' | 'key';
const MAPA = { w: 762, h: 626 }, RAIO = 92;
const tabelas: { id: string; nome: string; linhas: string; x: number; y: number; cols: [string, Tipo, number][] }[] = [
  { id: 'ped', nome: 'pedidos', linhas: '1.284.330', x: 386, y: 298, cols: [['valor_total', 'med', -78], ['data_pedido', 'dat', 196], ['status', 'dim', 22], ['canal', 'dim', 128]] },
  { id: 'itn', nome: 'itens_pedido', linhas: '6.902.114', x: 606, y: 128, cols: [['quantidade', 'med', -34], ['preco_unit', 'med', 22], ['produto_id', 'key', -128]] },
  { id: 'pro', nome: 'produtos', linhas: '8.412', x: 612, y: 470, cols: [['categoria', 'dim', 20], ['marca', 'dim', 78], ['custo', 'med', -40]] },
  { id: 'cli', nome: 'clientes', linhas: '214.903', x: 158, y: 126, cols: [['cidade', 'dim', -140], ['segmento', 'dim', -62], ['criado_em', 'dat', 162]] },
  { id: 'loj', nome: 'lojas', linhas: '12', x: 146, y: 462, cols: [['nome', 'dim', 196], ['regiao', 'dim', 118], ['meta_mensal', 'med', 62]] },
  { id: 'pag', nome: 'pagamentos', linhas: '1.301.877', x: 404, y: 540, cols: [['forma', 'dim', 160], ['valor', 'med', 20]] }
];
const relacoes: [string, string][] = [['ped', 'itn'], ['itn', 'pro'], ['ped', 'cli'], ['ped', 'loj'], ['ped', 'pag']];
const rad = (a: number) => a * Math.PI / 180;
const rnd = (k: number) => { const v = Math.sin(k * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };

function mapa() {
  let linhas = '', nos = '';
  for (const t of tabelas) {
    nos += `<div class="bi-no t bi-t-${t.id}" style="left:${t.x}px;top:${t.y}px"><b>${ico.tabela}<span>${t.nome}<small>${t.linhas} linhas</small></span></b></div>`;
    for (const [n, tipo, a] of t.cols) {
      const x = t.x + RAIO * Math.cos(rad(a)), y = t.y + RAIO * Math.sin(rad(a));
      linhas += `<line class="bi-lc bi-l-${t.id}" x1="${t.x}" y1="${t.y}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/>`;
      nos += `<div class="bi-no c ${tipo} bi-c-${t.id}${Math.cos(rad(a)) < -.25 ? ' esq' : ''}" style="left:${x.toFixed(1)}px;top:${y.toFixed(1)}px"><i></i><span>${n}</span></div>`;
    }
  }
  const rels = relacoes.map(([a, b]) => {
    const p = tabelas.find(t => t.id === a)!, q = tabelas.find(t => t.id === b)!;
    const mx = (p.x + q.x) / 2 + (q.y - p.y) * .14, my = (p.y + q.y) / 2 - (q.x - p.x) * .14;
    return `<path class="bi-rel" d="M${p.x} ${p.y}Q${mx.toFixed(1)} ${my.toFixed(1)} ${q.x} ${q.y}"/>`;
  }).join('');
  const poeira = Array.from({ length: 26 }, (_, k) => `<i style="left:${(rnd(k) * 100).toFixed(1)}%;top:${(rnd(k + 40) * 100).toFixed(1)}%;--d:${(4 + rnd(k + 80) * 12).toFixed(0)}px"></i>`).join('');
  return `<svg class="bi-linhas" viewBox="0 0 ${MAPA.w} ${MAPA.h}" width="${MAPA.w}" height="${MAPA.h}">${rels}${linhas}</svg>${nos}
    <span class="bi-alvo a1" style="left:600px;top:300px"></span><span class="bi-alvo a2" style="left:160px;top:300px"></span>
    <div class="bi-poeira">${poeira}</div>`;
}

// ---------- Gráficos (SVG) ----------
const lojas: [string, number][] = [['Centro', 312], ['Jardins', 288], ['Vila Nova', 265], ['Norte', 251], ['Estação', 240], ['Lago', 229], ['Parque', 214], ['Sul', 205], ['Porto', 188], ['Serra', 171], ['Alto', 152], ['Praia', 133]];
const dias = [182, 176, 194, 201, 238, 296, 284, 190, 187, 205, 212, 251, 318, 301];
const mix: [string, number, string][] = [['Mercearia', 34, '#1F5FAE'], ['Hortifrúti', 22, '#49BDC6'], ['Bebidas', 18, '#8DB6E6'], ['Limpeza', 14, '#E0962B'], ['Outros', 12, '#CBD5E1']];
const arco = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const p = (a: number) => `${(cx + r * Math.cos(rad(a - 90))).toFixed(2)} ${(cy + r * Math.sin(rad(a - 90))).toFixed(2)}`;
  return `M${p(a0)}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${p(a1)}`;
};
const rosca = (cls: string, cx: number, cy: number, r: number, sw: number) => {
  let a = 0;
  return mix.map(([, v, c]) => { const a1 = a + v * 3.6, d = arco(cx, cy, r, a + 1.2, a1 - 1.2); a = a1; return `<path class="${cls}" d="${d}" stroke="${c}" stroke-width="${sw}" fill="none"/>`; }).join('');
};
const linha = (w: number, h: number, pad = 6) => dias.map((v, k) => `${(pad + k * (w - 2 * pad) / (dias.length - 1)).toFixed(1)},${(h - 4 - (v - 150) / 190 * (h - 14)).toFixed(1)}`).join(' ');

const barrasMini = `<svg viewBox="0 0 300 64" preserveAspectRatio="none">${lojas.map(([, v], k) => `<rect class="bi-bm" x="${4 + k * 24.6}" y="${64 - v / 330 * 60}" width="16" height="${v / 330 * 60}" rx="2"/>`).join('')}</svg>`;
const linhaMini = `<svg viewBox="0 0 300 64" preserveAspectRatio="none"><polyline class="bi-lm" points="${linha(300, 64)}"/></svg>`;
const roscaMini = `<svg viewBox="0 0 300 64"><g>${rosca('bi-am', 34, 32, 24, 10)}</g>${mix.slice(0, 4).map(([n, v, c], k) => `<g transform="translate(${84 + (k % 2) * 108} ${18 + Math.floor(k / 2) * 24})"><rect width="8" height="8" rx="2" fill="${c}"/><text x="13" y="8">${n} ${v}%</text></g>`).join('')}</svg>`;

const sug = (k: string, tipo: string, titulo: string, campos: string, g: string) => `<div class="bi-sug ${k}">
  <div class="bi-sh"><span class="bi-tag">${tipo}</span><em>Medida × Dimensão</em><span class="bi-pega">${ico.pega}</span></div>
  <b>${titulo}</b><code>${campos}</code><div class="bi-g">${g}</div>
  <div class="bi-sf"><span>${ic('mais')} Adicionar ao painel</span><small>Prévia com dados reais</small></div></div>`;

const barrasGrandes = `<svg viewBox="0 0 520 168">${[0, 1, 2, 3].map(k => `<line class="bi-grid" x1="0" x2="520" y1="${8 + k * 44}" y2="${8 + k * 44}"/>`).join('')}
  ${lojas.map(([n, v], k) => `<rect class="bi-bg" x="${8 + k * 42.5}" y="${140 - v / 330 * 130}" width="26" height="${v / 330 * 130}" rx="3"/><text x="${21 + k * 42.5}" y="160" text-anchor="middle">${n}</text>`).join('')}</svg>`;
const linhaGrande = `<svg viewBox="0 0 520 168">${[0, 1, 2, 3].map(k => `<line class="bi-grid" x1="0" x2="520" y1="${8 + k * 44}" y2="${8 + k * 44}"/>`).join('')}
  <polygon class="bi-area" points="6,152 ${linha(520, 152)} 514,152"/><polyline class="bi-lg" points="${linha(520, 152)}"/>
  ${['01/10', '04/10', '07/10', '10/10', '14/10'].map((d, k) => `<text x="${8 + k * 126}" y="166" text-anchor="${k === 4 ? 'end' : k ? 'middle' : 'start'}">${d}</text>`).join('')}</svg>`;

const kpis: [string, string, string, string][] = [
  ['Faturamento da semana', 'R$ 0,00 mi', '+6,2% vs semana anterior', 'up'],
  ['Pedidos', '0', '+3,9% vs semana anterior', 'up'],
  ['Ticket médio', 'R$ 0,00', '+2,2% vs semana anterior', 'up'],
  ['Lojas na meta', '0 de 12', 'Serra, Alto e Praia abaixo', 'down']
];
const produtos: [string, string, string, string][] = [
  ['Arroz tipo 1 5 kg', 'Mercearia', '9.812', 'R$ 264,9 mil'], ['Café torrado 500 g', 'Mercearia', '11.430', 'R$ 205,6 mil'],
  ['Cerveja lata 350 ml', 'Bebidas', '38.207', 'R$ 141,3 mil'], ['Banana prata kg', 'Hortifrúti', '21.996', 'R$ 128,5 mil'], ['Sabão líquido 3 L', 'Limpeza', '4.118', 'R$ 119,4 mil']
];
const formas: [string, number][] = [['Pix', 41], ['Crédito', 33], ['Débito', 19], ['Outros', 7]];
const tile = (cls: string, corpo: string) => `<div class="bi-tile ${cls}"><div class="bi-vazio">${ico.grade}<span>Arraste um gráfico aqui</span></div><div class="bi-cont">${corpo}</div></div>`;

const t: Trailer = {
  ui: `<div class="bi" style="--c:${app('bi').color}">
    <aside class="bi-lado"><span class="bi-logo">${app('bi').icon}</span>
      <span class="on">${ic('inicio')}</span><span>${ico.banco}</span><span>${ico.grade}</span><span>${ico.modelo}</span><span class="bi-eu">M</span></aside>
    <header class="bi-topo"><span class="bi-tg">${ico.painel}</span><div class="bi-busca">${ic('busca')}<span>Buscar páginas, dashboards ou ações…</span><kbd>Ctrl K</kbd></div>
      <div class="bi-acoes"><span class="sino">${ic('sino')}</span><span>${ico.boia}</span><span>${ic('conversa')}</span><span>${ico.lua}</span><span>${ico.pontos}</span></div></header>
    <main class="bi-folha">
      <section class="bi-int">
        <h1>Integrações</h1><p class="bi-sub">Conecte bancos de dados e APIs REST</p>
        <div class="bi-sec"><div><b>APIs REST</b><small>3 contas conectadas via API, alimentam os dashboards de BI</small></div><a>Abrir dashboard ${ic('seta')}</a></div>
        <div class="bi-apis">
          ${[['Atendimento · API', 'sac.interno', '18.442 chamados'], ['Ponto eletrônico · API', 'ponto.interno', '1.204 colaboradores'], ['Campanhas · API', 'campanhas.interno', '96 campanhas']].map(([n, h, q]) => `<div class="bi-api"><div><span class="bi-ic">${ico.globo}</span><span class="bi-ok">Conectado</span></div><b>${n}</b><small>${h}</small><p>${q}</p></div>`).join('')}
          <div class="bi-api nova">${ic('mais')}<b>Nova fonte</b><small>Banco relacional ou API REST</small></div>
        </div>
        <div class="bi-sec"><div><b>Bancos de dados</b><small>Conexão direta, somente leitura</small></div></div>
        <div class="bi-nova">
          <div class="bi-form">
            <div class="bi-tipos-db"><span class="on">${ico.banco} PostgreSQL</span><span>MySQL</span><span>SQL Server</span><span>${ico.globo} API REST</span></div>
            <label class="bi-campo largo"><small>Host</small><span class="bi-host"><i></i></span></label>
            <label class="bi-campo"><small>Porta</small><span>5432</span></label>
            <label class="bi-campo"><small>Banco</small><span>bompreco_erp</span></label>
            <label class="bi-campo"><small>Usuário</small><span>bi_leitura</span></label>
            <label class="bi-campo"><small>Senha</small><span>••••••••••••</span></label>
            <div class="bi-acao"><span class="bi-chk">${ic('ok')}</span>Somente leitura<span class="bi-btn bi-conectar"><b class="bi-gira"></b><span>Testar e conectar</span></span></div>
          </div>
          <div class="bi-status"><small>Status da conexão</small>
            <b><span class="bi-esp">Aguardando conexão</span><span class="bi-ok">Conectado</span></b>
            <ul><li>${ic('ok')} Servidor respondeu em 38 ms</li><li>${ic('ok')} Autenticado como bi_leitura</li><li>${ic('ok')} Esquema public lido</li></ul>
            <p><em class="bi-ntab">0</em> tabelas · <em class="bi-ncol">0</em> colunas encontradas</p></div>
        </div>
      </section>

      <section class="bi-desc">
        <header class="bi-dh">
          <div class="bi-dh1"><h1>${ico.bussola} Descoberta de Dados</h1><p class="bi-sub">Classificação automática de campos e sugestão de gráficos</p></div>
          <div class="bi-dh2"><div><h1>Vendas da semana · Rede Bom Preço</h1><p class="bi-sub">Painel montado a partir de bompreco_erp · 08 a 14 de outubro de 2026</p></div>
            <span class="bi-atual"><i></i>Atualizado às 17:32</span><span class="bi-btn">${ico.compartilhar} Compartilhar</span></div>
        </header>
        <div class="bi-mapa" data-r>${mapa()}<span class="bi-legenda">Mostrando 6 de 14 tabelas</span></div>
        <div class="bi-dash">
          ${kpis.map(([n, v, d, c], k) => tile(`k k${k + 1}`, `<small>${n}</small><b class="bi-kv${k + 1}">${v}</b><em class="${c}">${d}</em>`)).join('')}
          ${tile('tA', `<div class="bi-th"><b>Faturamento por loja</b><small>Semana · R$ mil</small></div><div class="bi-gg">${barrasGrandes}</div>`)}
          ${tile('tB', `<div class="bi-th"><b>Vendas por dia</b><small>Últimos 14 dias · R$ mil</small></div><div class="bi-gg">${linhaGrande}</div>`)}
          ${tile('tC', `<div class="bi-th"><b>Mix por categoria</b><small>% do faturamento</small></div><div class="bi-rosca"><svg viewBox="0 0 120 120">${rosca('bi-ag', 60, 60, 44, 16)}</svg><ul>${mix.map(([n, v, c]) => `<li><i style="background:${c}"></i>${n}<b>${v}%</b></li>`).join('')}</ul></div>`)}
          ${tile('tD', `<div class="bi-th"><b>Produtos mais vendidos</b><small>Semana</small></div><table><tr><th>Produto</th><th>Categoria</th><th>Qtd.</th><th>Faturamento</th></tr>${produtos.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`)}
          ${tile('tE', `<div class="bi-th"><b>Formas de pagamento</b><small>% dos pedidos</small></div>${formas.map(([n, v]) => `<div class="bi-fp"><span>${n}</span><div><i style="--w:${v * 2.2}%"></i></div><b>${v}%</b></div>`).join('')}`)}
        </div>
        <aside class="bi-painel" data-r>
          <div class="bi-abas"><span class="a1">Classificação</span><span class="a2">Sugestões <em>3</em></span></div>
          <div class="bi-classif">
            <div class="bi-fonte">${ico.banco}<div><b>bompreco_erp</b><small>PostgreSQL 15</small></div><span class="bi-lendo"><i></i><span class="bi-lt">Lendo estrutura…</span></span></div>
            <div class="bi-nums"><div><small>Tabelas</small><b class="bi-n1">0</b></div><div><small>Colunas</small><b class="bi-n2">0</b></div><div><small>Relações</small><b class="bi-n3">0</b></div></div>
            <p class="bi-rot">Campos classificados</p>
            <div class="bi-cls">${([['med', 'Medidas', 38], ['dim', 'Dimensões', 71], ['dat', 'Datas', 22], ['key', 'Chaves', 55]] as [Tipo, string, number][]).map(([k, n, v]) => `<div class="${k}"><i></i><span>${n}</span><div><em style="--w:${v / 71 * 100}%"></em></div><b>0</b></div>`).join('')}</div>
            <p class="bi-rot">Últimas classificações</p>
            <ul class="bi-ult">${([['pedidos.valor_total', 'med', 'Medida · R$'], ['pedidos.data_pedido', 'dat', 'Data · diária'], ['lojas.regiao', 'dim', 'Dimensão · 5 valores'], ['clientes.cidade', 'dim', 'Dimensão · cidade'], ['itens_pedido.quantidade', 'med', 'Medida · unidades']] as [string, Tipo, string][]).map(([c, k, d]) => `<li><code>${c}</code><span class="${k}">${d}</span></li>`).join('')}</ul>
          </div>
          <div class="bi-sugs">
            ${sug('s1', 'Barras', 'Faturamento por loja', 'SUM(pedidos.valor_total) × lojas.nome', barrasMini)}
            ${sug('s2', 'Linha', 'Vendas por dia', 'SUM(pedidos.valor_total) × data_pedido', linhaMini)}
            ${sug('s3', 'Rosca', 'Mix por categoria', 'SUM(itens.quantidade) × produtos.categoria', roscaMini)}
          </div>
        </aside>
        <div class="bi-fantasma">${sug('sg', 'Barras', 'Faturamento por loja', 'SUM(pedidos.valor_total) × lojas.nome', barrasMini)}</div>
      </section>
    </main></div>`,
  css: `
.t-bi .bi { width: 1280px; height: 800px; display: grid; grid-template-columns: 58px 1fr; grid-template-rows: 56px 1fr; background: #F4F6F9; color: #0F1B2D; font: 400 13px/1.4 Oxanium, sans-serif; }
.t-bi svg { width: 17px; height: 17px; flex: none; }
.t-bi .bi-lado { grid-row: 1 / 3; display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 10px 0 12px; background: #fff; border-right: 1px solid #E6EBF1; color: #66768B; }
.t-bi .bi-lado > span { width: 34px; height: 34px; display: grid; place-items: center; border-radius: 8px; }
.t-bi .bi-lado .on { background: #E1EDF9; color: #1D5FA6; box-shadow: inset 0 0 0 1px #C6DAF0; }
.t-bi .bi-lado .bi-logo { width: 36px; height: 36px; background: #2AA3AE; color: #fff; border-radius: 9px; margin-bottom: 12px; box-shadow: inset 0 0 0 2px #1D7C86; }
.t-bi .bi-logo svg { width: 21px; height: 21px; stroke-width: 2; }
.t-bi .bi-lado .bi-eu { margin-top: auto; width: 30px; height: 30px; border: 1.5px solid #1D5FA6; color: #1D5FA6; font-weight: 700; font-size: 11px; border-radius: 6px; }
.t-bi .bi-topo { display: flex; align-items: center; gap: 16px; padding: 0 18px 0 22px; color: #55657A; }
.t-bi .bi-busca { margin: 0 auto 0 300px; width: 400px; height: 34px; border: 1px solid #E1E7EE; border-radius: 8px; background: #fff; display: flex; align-items: center; gap: 9px; padding: 0 12px; font-size: 12px; color: #7B8899; }
.t-bi .bi-busca svg { width: 15px; height: 15px; } .t-bi .bi-busca span { flex: 1; }
.t-bi .bi-busca kbd { font: 500 9.5px 'JetBrains Mono', monospace; border: 1px solid #E1E7EE; border-radius: 4px; padding: 1px 5px; }
.t-bi .bi-acoes { display: flex; gap: 8px; } .t-bi .bi-acoes span { width: 32px; height: 32px; display: grid; place-items: center; border: 1px solid #E6EBF1; border-radius: 8px; background: #fff; position: relative; }
.t-bi .bi-acoes svg { width: 16px; height: 16px; } .t-bi .bi-acoes .sino::after { content: ''; position: absolute; top: 6px; right: 7px; width: 6px; height: 6px; border-radius: 50%; background: #1D5FA6; }
.t-bi .bi-folha { position: relative; margin: 4px 10px 10px 4px; background: #fff; border: 1px solid #E6EBF1; border-radius: 12px; overflow: hidden; }
.t-bi .bi-int, .t-bi .bi-desc { position: absolute; inset: 0; padding: 24px 34px; }
.t-bi h1 { margin: 0; font-size: 21px; font-weight: 600; letter-spacing: -.01em; display: flex; align-items: center; gap: 8px; } .t-bi h1 svg { width: 19px; height: 19px; color: #1D5FA6; }
.t-bi .bi-sub { margin: 2px 0 0; color: #5D6B7E; font-size: 12.5px; }
.t-bi .bi-sec { display: flex; justify-content: space-between; align-items: flex-end; margin: 20px 0 10px; } .t-bi .bi-sec b { font-weight: 600; font-size: 14px; } .t-bi .bi-sec small { display: block; color: #6B7A90; font-size: 11.5px; }
.t-bi .bi-sec a { color: #1D5FA6; font-size: 12px; display: flex; gap: 4px; align-items: center; } .t-bi .bi-sec a svg { width: 13px; height: 13px; }
.t-bi .bi-apis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.t-bi .bi-api { background: #F7F9FB; border: 1px solid #E3E9F0; border-radius: 10px; padding: 14px 16px; }
.t-bi .bi-api > div { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
.t-bi .bi-ic { width: 34px; height: 34px; border-radius: 8px; background: #E1EDF9; color: #1D5FA6; display: grid; place-items: center; }
.t-bi .bi-ok { font-size: 11px; font-weight: 600; color: #148A55; background: #DDF4E8; border-radius: 99px; padding: 2px 9px; }
.t-bi .bi-api b { display: block; font-weight: 600; font-size: 13px; } .t-bi .bi-api small { color: #6B7A90; font-size: 11px; }
.t-bi .bi-api p { margin: 10px 0 0; padding-top: 9px; border-top: 1px solid #E3E9F0; font-size: 11px; color: #4C5B6E; }
.t-bi .bi-api.nova { border: 1.5px dashed #C9D5E2; background: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: #1D5FA6; }
.t-bi .bi-api.nova b { color: #0F1B2D; margin-top: 6px; }
.t-bi .bi-nova { display: grid; grid-template-columns: 1fr 380px; gap: 18px; border: 1px solid #D4E2F1; border-radius: 12px; padding: 18px; background: #FBFCFE; }
.t-bi .bi-form { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 12px 12px; align-content: start; }
.t-bi .bi-tipos-db { grid-column: 1 / -1; display: flex; gap: 8px; }
.t-bi .bi-tipos-db span { display: flex; gap: 6px; align-items: center; height: 32px; padding: 0 13px; border: 1px solid #DCE4ED; border-radius: 8px; font-size: 12px; background: #fff; color: #4C5B6E; }
.t-bi .bi-tipos-db svg { width: 14px; height: 14px; } .t-bi .bi-tipos-db .on { border-color: #1D5FA6; color: #1D5FA6; background: #EAF2FB; font-weight: 600; }
.t-bi .bi-campo { display: flex; flex-direction: column; gap: 4px; } .t-bi .bi-campo.largo { grid-column: span 3; }
.t-bi .bi-campo small { font-size: 11px; color: #5D6B7E; font-weight: 500; }
.t-bi .bi-campo > span { height: 36px; border: 1px solid #DCE4ED; border-radius: 8px; background: #fff; display: flex; align-items: center; padding: 0 11px; font: 500 12px 'JetBrains Mono', monospace; color: #0F1B2D; }
.t-bi .bi-host i { font-style: normal; }
.t-bi .bi-host.foco { border-color: #1D5FA6; box-shadow: 0 0 0 3px #DCE9F7; }
.t-bi .bi-host.foco::after { content: ''; width: 1.5px; height: 15px; background: #1D5FA6; margin-left: 1px; }
.t-bi .bi-acao { grid-column: 1 / -1; display: flex; align-items: center; gap: 8px; font-size: 12px; color: #4C5B6E; margin-top: 2px; }
.t-bi .bi-chk { width: 17px; height: 17px; border-radius: 4px; background: #1D5FA6; color: #fff; display: grid; place-items: center; } .t-bi .bi-chk svg { width: 12px; height: 12px; stroke-width: 2.4; }
.t-bi .bi-btn { display: inline-flex; align-items: center; gap: 7px; height: 34px; padding: 0 16px; border-radius: 8px; background: #1559A6; color: #fff; font-weight: 600; font-size: 12.5px; white-space: nowrap; box-shadow: 0 4px 12px rgba(21,89,166,.22); }
.t-bi .bi-btn svg { width: 15px; height: 15px; } .t-bi .bi-conectar { margin-left: auto; }
.t-bi .bi-gira { display: none; width: 13px; height: 13px; border: 2px solid rgba(255,255,255,.35); border-top-color: #fff; border-radius: 50%; }
.t-bi .bi-conectar.carregando .bi-gira { display: block; animation: bi-gira .7s linear infinite; } .t-bi .bi-conectar.pronto { background: #148A55; } .t-bi .bi-conectar.pronto .bi-gira { display: none; }
@keyframes bi-gira { to { transform: rotate(360deg); } }
.t-bi .bi-status { background: #fff; border: 1px solid #E3E9F0; border-radius: 10px; padding: 14px 16px; }
.t-bi .bi-status > small { font-size: 10.5px; letter-spacing: .07em; text-transform: uppercase; color: #6B7A90; }
.t-bi .bi-status > b { display: block; margin: 6px 0 10px; font-size: 16px; font-weight: 600; } .t-bi .bi-status .bi-ok { display: none; font-size: 12px; }
.t-bi .bi-status.ok .bi-ok { display: inline-block; } .t-bi .bi-status.ok .bi-esp { display: none; } .t-bi .bi-esp { color: #8794A6; }
.t-bi .bi-status ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; font-size: 12px; color: #33445A; }
.t-bi .bi-status li { display: flex; gap: 7px; align-items: center; } .t-bi .bi-status li svg { width: 14px; height: 14px; color: #148A55; stroke-width: 2.2; }
.t-bi .bi-status p { margin: 12px 0 0; padding-top: 10px; border-top: 1px solid #E3E9F0; font-size: 12.5px; color: #33445A; } .t-bi .bi-status em { font-style: normal; font-weight: 700; color: #0F1B2D; }

.t-bi .bi-dh { position: relative; height: 50px; }
.t-bi .bi-dh1, .t-bi .bi-dh2 { position: absolute; inset: 0; }
.t-bi .bi-dh2 { display: flex; align-items: center; gap: 12px; } .t-bi .bi-dh2 > div { margin-right: auto; }
.t-bi .bi-atual { display: flex; align-items: center; gap: 6px; font-size: 11.5px; color: #4C5B6E; border: 1px solid #E3E9F0; border-radius: 99px; padding: 4px 11px; } .t-bi .bi-atual i { width: 7px; height: 7px; border-radius: 50%; background: #16A34A; }
.t-bi .bi-mapa { position: absolute; left: 34px; top: 92px; width: ${MAPA.w}px; height: ${MAPA.h}px; border-radius: 12px; background: #FAFBFD radial-gradient(#DCE3EC 1px, transparent 1.2px) 0 0 / 18px 18px; border: 1px solid #E8EDF3; }
.t-bi .bi-linhas { position: absolute; left: 0; top: 0; width: ${MAPA.w}px; height: ${MAPA.h}px; overflow: visible; }
.t-bi .bi-lc { stroke: #B9C6D5; stroke-width: 1.2; } .t-bi .bi-rel { fill: none; stroke: #1D5FA6; stroke-width: 1.6; stroke-opacity: .55; }
.t-bi .bi-no { position: absolute; width: 0; height: 0; }
.t-bi .bi-no.t b { position: absolute; transform: translate(-50%, -50%); display: flex; align-items: center; gap: 8px; padding: 7px 12px 7px 9px; background: #fff; border: 1px solid #CFDAE6; border-radius: 9px; box-shadow: 0 6px 16px rgba(15,40,70,.09); white-space: nowrap; font-weight: 600; font-size: 12.5px; }
.t-bi .bi-no.t b svg { color: #1F8C96; } .t-bi .bi-no.t small { display: block; font: 500 9.5px 'JetBrains Mono', monospace; color: #6B7A90; }
.t-bi .bi-no.c i { position: absolute; left: -5px; top: -5px; width: 10px; height: 10px; border-radius: 50%; background: var(--k); box-shadow: 0 0 0 3px #fff, 0 0 0 4px var(--k); }
.t-bi .bi-no.c span { position: absolute; left: 11px; top: -9px; font: 500 10.5px 'JetBrains Mono', monospace; white-space: nowrap; color: #2B3B50; background: #fff; border: 1px solid #E3E9F0; padding: 1px 5px; border-radius: 4px; }
.t-bi .bi-no.c.esq span { left: auto; right: 11px; }
.t-bi .med { --k: #1BA3AE; } .t-bi .dim { --k: #E0962B; } .t-bi .dat { --k: #5B6CF0; } .t-bi .key { --k: #9AA8BA; }
.t-bi .bi-alvo { position: absolute; width: 0; height: 0; }
.t-bi .bi-legenda { position: absolute; left: 14px; bottom: 12px; font-size: 11px; color: #6B7A90; background: #fff; border: 1px solid #E3E9F0; border-radius: 99px; padding: 3px 10px; }
.t-bi .bi-poeira { position: absolute; inset: -40px; pointer-events: none; transform-origin: 420px 340px; }
.t-bi .bi-poeira i { position: absolute; width: var(--d); height: var(--d); border-radius: 50%; background: #49BDC6; opacity: .45; filter: blur(1.5px); }

.t-bi .bi-painel { position: absolute; right: 34px; top: 92px; width: 360px; height: ${MAPA.h}px; background: #fff; border: 1px solid #E3E9F0; border-radius: 12px; padding: 0 16px; box-shadow: -18px 0 40px rgba(15,40,70,.06); }
.t-bi .bi-abas { display: flex; gap: 18px; border-bottom: 1px solid #E3E9F0; margin: 0 -16px 14px; padding: 0 16px; }
.t-bi .bi-abas span { padding: 13px 0 11px; font-size: 12.5px; color: #6B7A90; border-bottom: 2px solid transparent; } .t-bi .bi-abas .on { color: #1D5FA6; border-color: #1D5FA6; font-weight: 600; }
.t-bi .bi-abas em { font-style: normal; font-size: 10.5px; background: #E1EDF9; color: #1D5FA6; border-radius: 99px; padding: 1px 6px; margin-left: 3px; }
.t-bi .bi-classif, .t-bi .bi-sugs { position: absolute; left: 16px; right: 16px; top: 58px; }
.t-bi .bi-fonte { display: flex; gap: 10px; align-items: center; background: #F7F9FB; border: 1px solid #E3E9F0; border-radius: 9px; padding: 10px 12px; } .t-bi .bi-fonte > svg { color: #1D5FA6; }
.t-bi .bi-fonte b { display: block; font: 600 12px 'JetBrains Mono', monospace; } .t-bi .bi-fonte small { font-size: 10.5px; color: #6B7A90; }
.t-bi .bi-lendo { margin-left: auto; display: flex; gap: 5px; align-items: center; font-size: 10.5px; color: #B26B00; white-space: nowrap; } .t-bi .bi-lendo i { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
.t-bi .bi-lendo.ok { color: #148A55; }
.t-bi .bi-nums { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 12px 0 4px; }
.t-bi .bi-nums div { border: 1px solid #E3E9F0; border-radius: 9px; padding: 8px 11px; } .t-bi .bi-nums small { font-size: 10.5px; color: #6B7A90; } .t-bi .bi-nums b { display: block; font-size: 22px; font-weight: 600; }
.t-bi .bi-rot { margin: 14px 0 8px; font-size: 10.5px; letter-spacing: .07em; text-transform: uppercase; color: #6B7A90; font-weight: 500; }
.t-bi .bi-cls { display: grid; gap: 8px; } .t-bi .bi-cls > div { display: grid; grid-template-columns: 10px 76px 1fr 26px; gap: 8px; align-items: center; font-size: 12px; }
.t-bi .bi-cls i { width: 9px; height: 9px; border-radius: 50%; background: var(--k); } .t-bi .bi-cls > div > div { height: 6px; border-radius: 99px; background: #EEF2F6; overflow: hidden; }
.t-bi .bi-cls em { display: block; height: 100%; width: var(--w); background: var(--k); border-radius: inherit; transform-origin: 0 50%; } .t-bi .bi-cls b { text-align: right; font-weight: 600; }
.t-bi .bi-ult { list-style: none; margin: 0; padding: 0; } .t-bi .bi-ult li { display: flex; justify-content: space-between; align-items: center; padding: 7px 0; border-top: 1px solid #EEF2F6; }
.t-bi .bi-ult code { font: 500 10.5px 'JetBrains Mono', monospace; color: #2B3B50; } .t-bi .bi-ult span { font-size: 10.5px; font-weight: 600; color: var(--k); background: color-mix(in srgb, var(--k) 13%, transparent); border-radius: 99px; padding: 1px 8px; }
.t-bi .bi-sugs { display: grid; gap: 10px; }
.t-bi .bi-sug { background: #fff; border: 1px solid #DCE4ED; border-radius: 10px; padding: 11px 13px; box-shadow: 0 2px 6px rgba(15,40,70,.04); }
.t-bi .bi-sh { display: flex; align-items: center; gap: 8px; } .t-bi .bi-sh em { font-style: normal; font-size: 10.5px; color: #6B7A90; }
.t-bi .bi-tag { font-size: 10.5px; font-weight: 600; color: #1D5FA6; background: #E1EDF9; border-radius: 5px; padding: 1px 7px; }
.t-bi .bi-pega { margin-left: auto; color: #8C99AA; display: grid; place-items: center; width: 22px; height: 22px; border-radius: 5px; } .t-bi .bi-pega svg { width: 15px; height: 15px; }
.t-bi .bi-sug > b { display: block; margin-top: 6px; font-size: 13.5px; font-weight: 600; } .t-bi .bi-sug code { display: block; font: 500 10px 'JetBrains Mono', monospace; color: #6B7A90; margin: 1px 0 8px; white-space: nowrap; }
.t-bi .bi-g { height: 64px; } .t-bi .bi-g svg { width: 100%; height: 64px; display: block; overflow: visible; }
.t-bi .bi-bm { fill: #2F7BD0; } .t-bi .bi-lm { fill: none; stroke: #1BA3AE; stroke-width: 2.2; vector-effect: non-scaling-stroke; }
.t-bi .bi-g text { font: 500 10.5px Oxanium, sans-serif; fill: #33445A; }
.t-bi .bi-sf { display: flex; justify-content: space-between; align-items: center; margin-top: 9px; font-size: 11.5px; color: #1D5FA6; font-weight: 600; }
.t-bi .bi-sf span { display: flex; gap: 4px; align-items: center; } .t-bi .bi-sf svg { width: 13px; height: 13px; } .t-bi .bi-sf small { color: #8794A6; font-weight: 400; font-size: 10.5px; }
.t-bi .bi-fantasma { position: absolute; left: 0; top: 0; z-index: 5; }
.t-bi .bi-fantasma .bi-sug { height: 100%; box-shadow: 0 24px 50px rgba(15,40,70,.22); border-color: #1D5FA6; display: flex; flex-direction: column; }
.t-bi .bi-fantasma .bi-g { flex: 1; } .t-bi .bi-fantasma .bi-g svg { height: 100%; }

.t-bi .bi-dash { position: absolute; left: 34px; right: 34px; top: 92px; height: ${MAPA.h}px; display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: 94px 262px 1fr; gap: 12px; }
.t-bi .bi-tile { position: relative; border-radius: 11px; }
.t-bi .bi-vazio { position: absolute; inset: 0; border: 1.5px dashed #C9D5E2; border-radius: 11px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; color: #8C99AA; font-size: 11.5px; background: #FAFBFD; }
.t-bi .bi-cont { position: absolute; inset: 0; background: #fff; border: 1px solid #E3E9F0; border-radius: 11px; padding: 13px 15px; }
.t-bi .tA { grid-column: span 2; } .t-bi .tB { grid-column: span 2; } .t-bi .tD { grid-column: span 2; }
.t-bi .bi-tile.k small { font-size: 11px; color: #5D6B7E; } .t-bi .bi-tile.k b { display: block; font-size: 25px; font-weight: 600; margin: 2px 0 1px; letter-spacing: -.01em; }
.t-bi .bi-tile.k em { font-style: normal; font-size: 11px; } .t-bi em.up { color: #148A55; } .t-bi em.down { color: #B26B00; }
.t-bi .bi-th { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; } .t-bi .bi-th b { font-weight: 600; font-size: 13px; } .t-bi .bi-th small { font-size: 10.5px; color: #6B7A90; }
.t-bi .bi-gg svg { width: 100%; height: 200px; display: block; overflow: visible; }
.t-bi .bi-gg text { font: 500 10px Oxanium, sans-serif; fill: #6B7A90; }
.t-bi .bi-grid { stroke: #EEF2F6; } .t-bi .bi-bg { fill: #2F7BD0; } .t-bi .tA .bi-bg:nth-of-type(n+10) { fill: #8DB6E6; }
.t-bi .bi-area { fill: #49BDC6; fill-opacity: .12; } .t-bi .bi-lg { fill: none; stroke: #1BA3AE; stroke-width: 2.4; stroke-linejoin: round; }
.t-bi .bi-rosca { display: flex; align-items: center; gap: 14px; } .t-bi .bi-rosca svg { width: 116px; height: 116px; }
.t-bi .bi-rosca ul { list-style: none; margin: 0; padding: 0; flex: 1; display: grid; gap: 5px; font-size: 11.5px; } .t-bi .bi-rosca li { display: flex; align-items: center; gap: 6px; }
.t-bi .bi-rosca li i { width: 8px; height: 8px; border-radius: 2px; } .t-bi .bi-rosca li b { margin-left: auto; font-weight: 600; }
.t-bi .tD table { width: 100%; border-collapse: collapse; font-size: 11.5px; } .t-bi .tD th { text-align: left; font-weight: 500; font-size: 10px; letter-spacing: .06em; text-transform: uppercase; color: #6B7A90; padding: 0 6px 6px 0; border-bottom: 1px solid #E3E9F0; }
.t-bi .tD td { padding: 6px 6px 6px 0; border-bottom: 1px solid #F0F3F7; } .t-bi .tD td:nth-child(n+3), .t-bi .tD th:nth-child(n+3) { text-align: right; } .t-bi .tD td:last-child { font-weight: 600; }
.t-bi .bi-fp { display: grid; grid-template-columns: 52px 1fr 34px; gap: 8px; align-items: center; font-size: 11.5px; margin: 9px 0; }
.t-bi .bi-fp > div { height: 8px; border-radius: 99px; background: #EEF2F6; overflow: hidden; } .t-bi .bi-fp i { display: block; height: 100%; width: var(--w); background: #1F5FAE; border-radius: inherit; transform-origin: 0 50%; } .t-bi .bi-fp b { text-align: right; font-weight: 600; }
`,
  roteiro(f: Filme) {
    const tl = f.tl, D = (s: number) => `depois+=${s}`;
    // câmera que centraliza um elemento sem mostrar o fundo do palco (limita o centro às bordas da tela)
    // o palco (16:9) mostra 1693×952 px da tela em zoom 1; o centro fica limitado para não aparecer o fundo
    const miraXY = (x: number, y: number, zoom: number) => {
      const mx = 846 / zoom, my = 476 / zoom;
      const cx = mx >= W / 2 ? W / 2 : Math.min(Math.max(x, mx), W - mx), cy = my >= H / 2 ? H / 2 : Math.min(Math.max(y, my), H - my);
      return { x: -(cx - W / 2) / W * 100 * zoom, y: -(cy - H / 2) / H * 100 * zoom, zoom };
    };
    const mira = (s: string, zoom: number) => { const p = f.pos(s); return miraXY(p.x + p.w / 2, p.y + p.h / 2, zoom); };
    // classe que vale só entre dois instantes (também ao voltar a timeline)
    const entre = (s: string, cls: string, de: string | number, ate: string | number) => {
      const a = f.quando(de), b = f.quando(ate), els = f.$$(s);
      f.regras.push(() => { const t = tl.time(), on = t >= a && t < b; els.forEach(e => e.classList.toggle(cls, on)); });
    };
    const desc = f.$('.bi-desc'), int = f.$('.bi-int'), mapaEl = f.$('.bi-mapa'), painel = f.$('.bi-painel'), dash = f.$('.bi-dash');
    tl.set([desc, f.$('.bi-dh2'), dash, f.$('.bi-sugs'), f.$('.bi-fantasma')], { autoAlpha: 0 }, 0);
    tl.set(f.$$('.bi-tile .bi-cont'), { autoAlpha: 0 }, 0);
    entre('.bi-abas .a1', 'on', 0, D(12.3));

    // 1 · Conecte a fonte: o banco do ERP, com usuário somente leitura
    f.passo(1, 'Conecte o banco do ERP ou uma API REST. Nada de exportar planilha.', 'depois');
    f.camera(mira('.bi-nova', 1.42), 2, 'depois', 'power2.inOut');
    f.cursor('.bi-host', D(.5), true, .8);
    entre('.bi-host', 'foco', D(1.3), D(2.9)); f.digitar('.bi-host i', 'erp.bompreco.interno', D(1.35), 32);
    f.cursor('.bi-conectar', D(2.15), true, .8);
    f.classe('.bi-conectar', 'carregando', D(2.95));
    // uma regra só para o rótulo do botão (vários f.texto no mesmo elemento se anulam)
    const rotulo = f.$('.bi-conectar span'), t1 = f.quando(D(2.95)), t2 = f.quando(D(3.95));
    f.regras.push(() => { const t = tl.time(), v = t >= t2 ? 'Conectado' : t >= t1 ? 'Conectando…' : 'Testar e conectar'; if (rotulo.textContent !== v) rotulo.textContent = v; });
    f.camera(mira('.bi-status', 1.75), 1.2, D(2.6));
    f.entra('.bi-status li', D(3.1), { stagger: .3, x: -8, y: 0 });
    f.classe('.bi-status', 'ok', D(3.95)).classe('.bi-conectar', 'pronto', D(3.95));
    f.contar('.bi-ntab', 14, D(3.95), { dur: .6 }).contar('.bi-ncol', 186, D(3.95), { dur: .8 });

    // 2 · Leitura automática: mergulho na constelação de tabelas
    f.passo(2, 'Ele lê tabelas, colunas e relações sozinho, e classifica cada campo.', D(4.7));
    f.camera(mira('.bi-status p', 3.4), .9, D(4.7), 'power2.in');
    f.esconderCursor(D(4.7));
    tl.to(int, { autoAlpha: 0, duration: .35 }, D(5.5)).to(desc, { autoAlpha: 1, duration: .45 }, D(5.45));
    tl.fromTo(f.$('.bi-poeira'), { scale: .7, autoAlpha: 1 }, { scale: 2.8, autoAlpha: 0, duration: 1.8, ease: 'power2.out', immediateRender: false }, D(5.45));
    tl.set(f.$('.bi-poeira'), { autoAlpha: 0 }, 0);
    f.camera(mira('.bi-t-ped', 2.3), 1.3, D(5.6), 'power3.out');
    const nasce = (id: string, at: number) => {
      tl.from(f.$(`.bi-t-${id}`), { autoAlpha: 0, scale: .5, duration: .5, ease: 'back.out(2)' }, D(at));
      tl.from(f.$$(`.bi-c-${id}`), { x: (k: number) => (rnd(k + id.length * 7) - .5) * 520, y: (k: number) => (rnd(k + id.charCodeAt(0)) - .5) * 380, autoAlpha: 0, scale: .3, duration: 1.1, ease: 'power3.out', stagger: .07 }, D(at + .1));
      f.desenhar(`.bi-l-${id}`, D(at + .8), .6);
    };
    nasce('ped', 5.5);
    f.camera(mira('.bi-alvo.a1', 1.85), 1.6, D(6.9));
    nasce('itn', 6.9); nasce('pro', 7.2);
    f.camera(mira('.bi-alvo.a2', 1.85), 1.7, D(8.6));
    nasce('cli', 8.6); nasce('loj', 8.9); nasce('pag', 9.1);
    f.desenhar('.bi-rel', D(9.9), .9);
    f.camera({ zoom: 1 }, 1.8, D(10.4));
    f.contar('.bi-n1', 14, D(5.6), { dur: 4.4 }).contar('.bi-n2', 186, D(5.6), { dur: 4.6 }).contar('.bi-n3', 9, D(6), { dur: 4.2 });
    tl.from(f.$$('.bi-cls em'), { scaleX: 0, duration: 4, ease: 'power1.out', stagger: .15 }, D(5.7));
    f.contar('.bi-cls .med b', 38, D(5.7), { dur: 4 }).contar('.bi-cls .dim b', 71, D(5.85), { dur: 4 }).contar('.bi-cls .dat b', 22, D(6), { dur: 4 }).contar('.bi-cls .key b', 55, D(6.15), { dur: 4 });
    f.classe('.bi-lendo', 'ok', D(10.3)).texto('.bi-lt', 'Leitura concluída', D(10.3));
    f.entra('.bi-ult li', D(10.4), { stagger: .12, x: 10, y: 0 });

    // 3 · Gráficos sugeridos: o painel lateral troca de aba e desenha cada sugestão
    f.passo(3, 'Barras, linha, rosca: cada gráfico sugerido a partir dos campos lidos.', D(12.2));
    f.classe('.bi-abas .a2', 'on', D(12.3));
    f.cursor('.bi-abas .a2', D(11.6), true, .7);
    tl.to(f.$('.bi-classif'), { autoAlpha: 0, duration: .3 }, D(12.35)).to(f.$('.bi-sugs'), { autoAlpha: 1, duration: .1 }, D(12.4));
    f.entra('.bi-sugs .bi-sug', D(12.45), { stagger: .5, x: 24, y: 0, duration: .6 });
    f.foco('.bi-painel', D(12.4));
    f.camera(mira('.bi-painel', 1.5), 1.6, D(12.3));
    tl.from(f.$$('.bi-sugs .s1 .bi-bm'), { scaleY: 0, transformOrigin: '50% 100%', duration: .5, stagger: .04, ease: 'power2.out' }, D(12.9));
    f.desenhar('.bi-sugs .bi-lm', D(13.5), 1);
    f.desenhar('.bi-sugs .bi-am', D(14), .9);
    f.camera(mira('.bi-sugs .s1', 1.7), 1.6, D(14.7));

    // 4 · Monte o dashboard: arrasta a sugestão para o painel, que se completa
    f.passo(4, 'Arraste para o painel. Sexta, 17h32, e nenhuma planilha colada.', D(16.6));
    f.foco(null, D(16.4));
    tl.to(mapaEl, { autoAlpha: 0, duration: .5 }, D(16.4)).to(dash, { autoAlpha: 1, duration: .6 }, D(16.6));
    tl.to(f.$('.bi-dh1'), { autoAlpha: 0, duration: .4 }, D(16.6)).to(f.$('.bi-dh2'), { autoAlpha: 1, duration: .5 }, D(16.8));
    f.camera(miraXY(716, 330, 1.36), 1.5, D(16.5));
    f.cursor('.bi-sugs .s1 .bi-pega', D(16.9), true, .75);
    const base = f.pos('.bi-desc'), c1 = f.pos('.bi-sugs .s1'), alvo = f.pos('.bi-tile.tA'), pega = f.pos('.bi-sugs .s1 .bi-pega');
    const fant = f.$('.bi-fantasma'), s1 = f.$('.bi-sugs .s1');
    tl.set(fant, { left: c1.x - base.x, top: c1.y - base.y, width: c1.w, height: c1.h }, 0);
    tl.to(fant, { autoAlpha: 1, duration: .15 }, D(17.7)).to(s1, { opacity: .35, duration: .2 }, D(17.7));
    tl.to(fant, { left: alvo.x - base.x, top: alvo.y - base.y, width: alvo.w, height: alvo.h, duration: 1.3, ease: 'power2.inOut' }, D(17.8));
    tl.to(f.ponteiro, { x: alvo.x + alvo.w - (c1.x + c1.w - pega.x - pega.w / 2), y: alvo.y + (pega.y + pega.h * .55 - c1.y), duration: 1.3, ease: 'power2.inOut' }, D(17.8));
    tl.to(fant, { autoAlpha: 0, duration: .3 }, D(19.15));
    const enche = (sel: string, at: number) => tl.to(f.$(`${sel} .bi-vazio`), { autoAlpha: 0, duration: .3 }, D(at)).to(f.$(`${sel} .bi-cont`), { autoAlpha: 1, duration: .35 }, D(at));
    enche('.tA', 19.1);
    tl.from(f.$$('.tA .bi-bg'), { scaleY: 0, transformOrigin: '50% 100%', duration: .6, stagger: .035, ease: 'power3.out' }, D(19.2));
    tl.to(painel, { x: 420, autoAlpha: 0, duration: .8, ease: 'power3.in' }, D(19.5));
    f.esconderCursor(D(19.6));
    f.camera({ zoom: 1, rx: 4 }, 1.6, D(19.7)).camera({ zoom: 1 }, 1.4, D(21.6), 'power2.inOut');
    ['.k1', '.k2', '.k3', '.k4'].forEach((k, n) => enche(k, 19.8 + n * .12));
    f.contar('.bi-kv1', 2.84, D(19.9), { dur: 1.3, fmt: n => `R$ ${n.toFixed(2).replace('.', ',')} mi` });
    f.contar('.bi-kv2', 31406, D(20), { dur: 1.3 });
    f.contar('.bi-kv3', 90.43, D(20.1), { dur: 1.3, fmt: n => `R$ ${n.toFixed(2).replace('.', ',')}` });
    f.contar('.bi-kv4', 9, D(20.2), { dur: 1, fmt: n => `${Math.round(n)} de 12` });
    enche('.tB', 20.1); f.desenhar('.tB .bi-lg', D(20.2), 1.2); tl.from(f.$('.tB .bi-area'), { autoAlpha: 0, duration: .8 }, D(20.8));
    enche('.tC', 20.4); f.desenhar('.tC .bi-ag', D(20.5), .9);
    enche('.tD', 20.6); f.entra('.tD tr', D(20.65), { stagger: .07, y: 6 });
    enche('.tE', 20.8); tl.from(f.$$('.tE .bi-fp i'), { scaleX: 0, duration: .8, stagger: .08, ease: 'power2.out' }, D(20.9));
    tl.from(f.$('.bi-atual'), { autoAlpha: 0, x: 10, duration: .5 }, D(21.4));
    f.pausa(1.6);
  }
};
export default t;
