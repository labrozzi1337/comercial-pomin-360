// PominCS · "O cancelamento que avisou antes". Tela recriada do Customer Success real (tema claro, Health Score em arco, botão Sofia no topo).
// Linguagem de câmera: mergulho no medidor de saúde e recuo até a carteira inteira, onde só um cliente entre dezenas fica vermelho.
import { ic, W, H, type Trailer, type Filme, type Cam } from '../filme';
import { svg } from '../../src/data';

const X = {
  painel: svg('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/>'),
  medidor: svg('<path d="m12 14 4-4"/><path d="M3.3 19a10 10 0 1 1 17.4 0"/>'),
  contato: svg('<rect x="3" y="4" width="18" height="18" rx="2"/><circle cx="12" cy="11" r="3"/><path d="M7 20a5 5 0 0 1 10 0M8 2v4M16 2v4"/>'),
  estrela: svg('<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>'),
  fluxo: svg('<circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="M9 6h6a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h6"/>'),
  prancheta: svg('<rect x="5" y="4" width="14" height="18" rx="2"/><path d="M9 2h6v4H9zM9 12h6M9 16h4"/>'),
  mail: svg('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>'),
  dolar: svg('<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>'),
  pulso: svg('<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>'),
  livro: svg('<path d="M2 4h7a3 3 0 0 1 3 3v14a2 2 0 0 0-2-2H2zM22 4h-7a3 3 0 0 0-3 3v14a2 2 0 0 1 2-2h8z"/>'),
  ajuda: svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="m5.6 5.6 3.6 3.6M14.8 14.8l3.6 3.6M14.8 9.2l3.6-3.6M5.6 18.4l3.6-3.6"/>'),
  grade: svg('<path d="M5 5h.01M12 5h.01M19 5h.01M5 12h.01M12 12h.01M19 12h.01M5 19h.01M12 19h.01M19 19h.01" stroke-width="3"/>'),
  baixo: svg('<path d="m6 9 6 6 6-6"/>'),
  info: svg('<circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/>'),
  sol: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  fechar: svg('<path d="M18 6 6 18M6 6l12 12"/>'),
  certo: svg('<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/>')
};

// A carteira (nomes fictícios). O índice 15 é a Transportes Serra Azul, o cliente da história.
const nomes = ['Construtora Aurora', 'Rede Bom Preço', 'Clínica Vida Plena', 'Padaria Trigo Bom', 'Auto Peças Rota 10', 'Hotel Mirante do Vale',
  'Farmácia São Bento', 'Metalúrgica Ipê', 'Colégio Novo Saber', 'Laticínios Campo Verde', 'Ótica Visão Clara', 'Agro Terra Fértil',
  'Pet Shop Amigo Fiel', 'Distribuidora Litoral', 'Academia Corpo em Forma', 'Transportes Serra Azul', 'Gráfica Ponto Final', 'Restaurante Sabor da Serra',
  'Móveis Carvalho', 'Odonto Sorriso', 'Supermercado Boa Safra', 'Café Montanha', 'Vidraçaria Cristal', 'Lima & Souza Advogados',
  'Lavanderia Bolha', 'Papelaria Estrela', 'Veterinária Bicho Bom', 'Engenharia Alicerce', 'Hortifruti Folha Verde', 'TecnoSul Sistemas',
  'Cerâmica Barro Fino', 'Construtora Horizonte', 'Mercado Vila Rica', 'Studio Bem Estar', 'Transportadora Rio Claro', 'Bistrô da Praça',
  'Contabilidade Exata', 'Elétrica Faísca', 'Floricultura Jardim', 'Fábrica de Gelo Polar', 'Livraria Página Viva', 'Imobiliária Casa Nova'];
const HERO = 15;
const hs = nomes.map((_, i) => i === HERO ? 82 : [91, 78, 86, 64, 88, 73, 95, 81, 69, 84, 90, 76, 87, 58, 79, 82, 92, 71, 85, 89][i % 20] - (i > 20 ? (i * 7) % 9 : 0));
const mrr = nomes.map((_, i) => i === HERO ? '18,4' : (((i * 37) % 23) + 2.4).toFixed(1).replace('.', ','));
const faixa = (v: number) => v >= 70 ? 'b' : v >= 50 ? 'm' : 'r';

function mira(f: Filme, s: string, zoom: number, dur: number, at: number, ang: Cam = {}) {
  const p = f.pos(s), hx = Math.min(W / 2, 880 / zoom), hy = Math.min(H / 2, 495 / zoom);
  const cx = Math.max(hx, Math.min(W - hx, p.x + p.w / 2)), cy = Math.max(hy, Math.min(H - hy, p.y + p.h / 2));
  return f.camera({ ...ang, x: -(cx - W / 2) / W * 100 * zoom, y: -(cy - H / 2) / H * 100 * zoom, zoom }, dur, at);
}

const t: Trailer = {
  ui: `<div class="cs">
    <aside class="cs-lado"><span class="cs-logo">${ic('coracao')}</span>${[ic('inicio'), X.medidor, '', ic('pessoas'), X.contato, ic('doc'), '', X.estrela, X.fluxo, X.prancheta, X.mail, ic('agenda'), '', X.dolar, X.ajuda, X.pulso, X.livro].map((s, i) => s ? `<span class="cs-nav${i === 3 ? ' on' : ''}">${s}</span>` : '<i></i>').join('')}<span class="cs-eu">R</span></aside>
    <header class="cs-topo"><span class="cs-tg">${X.painel}</span><div class="cs-busca">${ic('busca')}Pesquisar clientes ou telas…<kbd>⌘ K</kbd></div>
      <span class="cs-sel">Todas as carteiras${X.baixo}</span><span class="cs-sofia">${ic('ia')}Sofia</span><span class="cs-ib dot">${ic('sino')}</span><span class="cs-ib">${X.ajuda}</span><span class="cs-ib">${ic('conversa')}</span><span class="cs-ib">${X.grade}</span><span class="cs-tema"><i>${X.sol}</i></span></header>
    <main class="cs-main">
      <div class="cs-cab" data-r><span class="cs-tile-ic">${ic('pessoas')}</span><div><h1>Carteira</h1><p>Clientes, contratos e saúde de cada conta</p></div><span class="cs-sel">Últimos 12 meses${X.baixo}</span><span class="cs-bt">${ic('mais')}Novo cliente</span></div>
      <div class="cs-kpis" data-r>
        <div><small>Clientes ativos</small><b>231</b><em>de 248 na base</em></div>
        <div><small>MRR</small><b>R$ 1.418.300</b><em class="up">+3,2% no trimestre</em></div>
        <div><small>NPS da base</small><b class="cs-npsb">48</b><span class="cs-npsbar"><i></i><i></i><i></i><u style="left:74%"></u></span></div>
        <div><small>Média CSAT</small><b>4,4</b><em>escala de 1 a 5</em></div>
        <div><small>Churn (12 meses)</small><b>1,1%</b><em>3 clientes</em></div>
        <div><small>NRR · GRR</small><b>104% · 97%</b><em>retenção de receita</em></div>
      </div>
      <div class="cs-cart" data-r>
        <div class="cs-ch"><b>Clientes <em>231</em></b><span class="lg"><i class="b"></i>Saudável<i class="m"></i>Atenção<i class="r"></i>Risco</span><span class="cs-mini">${ic('busca')}Buscar cliente…</span><span class="cs-sel">Todos os CSMs${X.baixo}</span></div>
        <div class="cs-grid">${nomes.map((n, i) => `<div class="cs-tile ${faixa(hs[i])}${i === HERO ? ' h' : ''}" data-r><b>${n}</b><span class="pe"><small>R$ ${mrr[i]} mil/mês</small><em class="hs">${hs[i]}</em></span><i style="--v:${hs[i]}%"></i></div>`).join('')}</div>
      </div>
      <div class="cs-det" data-r>
        <div class="cs-resumo">
          <div class="cs-dt"><b>Saúde da carteira</b><small>231 clientes ativos · atualizado agora</small></div>
          <div class="cs-faixas"><div class="b"><b>196</b><small>Saudável</small></div><div class="m"><b>35</b><small>Atenção</small></div><div class="r"><b>0</b><small>Risco</small></div></div>
          <div class="cs-pilha"><i class="b" style="flex:196"></i><i class="m" style="flex:35"></i></div>
          <div class="cs-dt"><b>Contratos</b><small>MRR por status</small></div>
          ${([['Ativo', 'R$ 1.418.300', 94, '#16A34A'], ['Em renovação', 'R$ 76.200', 5, '#F59E0B'], ['Cancelado', 'R$ 15.100', 1, '#E5484D']] as const).map(([n, v, p, c]) => `<div class="cs-mrr"><span><i style="background:${c}"></i>${n}</span><b>${v}</b><em>${p}%</em><span class="br"><i style="width:${p}%;background:${c}"></i></span></div>`).join('')}
          <div class="cs-dt"><b>Renovam nos próximos 90 dias</b><small>14 contratos</small></div>
          ${[['Hotel Mirante do Vale', '04/11', 'R$ 9,1 mil'], ['Metalúrgica Ipê', '18/11', 'R$ 22,7 mil'], ['Colégio Novo Saber', '02/12', 'R$ 6,3 mil'], ['Agro Terra Fértil', '15/12', 'R$ 11,8 mil']].map(([n, d, v]) => `<div class="cs-ren"><b>${n}</b><span>${d}</span><em>${v}</em></div>`).join('')}
        </div>
        <div class="cs-cli">
          <div class="cs-dh"><span class="cs-av">TS</span><div><b>Transportes Serra Azul</b><small>12.345.678/0001-90 · Logística · CSM Júlia Mendes</small></div><span class="cs-st">Ativo</span></div>
          <div class="cs-saude">
            <div class="cs-g"><div class="cs-gt">${ic('coracao')}<span><b>Health Score</b><small>Saúde do cliente</small></span></div>
              <svg class="cs-arco" viewBox="0 0 200 112"><path class="tr" d="M20 100A80 80 0 0 1 180 100"/><path class="vl" d="M20 100A80 80 0 0 1 180 100"/></svg><span class="cs-gn"><b>0</b><small>de 100</small></span></div>
            <div class="cs-met"><div><small>MRR</small><b>R$ 18.400</b></div><div><small>Contrato até</small><b>03/2027</b></div><div><small>Uso (30 dias)</small><b class="neg">−38%</b></div><div><small>Chamados no SAC</small><b class="neg2">2 abertos</b></div></div>
          </div>
          <div class="cs-nps"><div class="cs-dt"><b>Última pesquisa NPS</b><small class="d0">12/07 · Paulo Henrique, diretor de operações</small><small class="d1">Hoje, 16:40 · Paulo Henrique, diretor de operações</small></div>
            <div class="cs-esc">${Array.from({ length: 11 }, (_, n) => `<span class="n${n}${n < 7 ? ' r' : n < 9 ? ' m' : ' b'}">${n}</span>`).join('')}</div>
            <p><span class="c0">“Atendimento excelente, entrega sempre no prazo.”</span><span class="c1">“A coleta atrasou três vezes este mês e ninguém avisou.”</span></p></div>
          <div class="cs-alerta">${ic('alerta')}${X.certo}<span class="a0"><b>Risco de cancelamento.</b> Saúde caiu de 82 para 41 em um dia.</span><span class="a1"><b>Saudável de novo.</b> Saúde voltou para 76.</span></div>
          <div class="cs-jor"><div class="cs-dt"><b>Jornada e tarefas</b><small>Transportes Serra Azul</small></div>
            <div class="cs-cols"><div class="cs-jc c1"><small>A fazer</small><div class="cs-tf nova"><b>Reunião com Paulo sobre a coleta</b><span><i class="av">JM</i>até 16/10<em class="ok">${X.certo}Feita</em></span></div><div class="cs-tf velha"><b>Proposta de renovação</b><span><i class="av">JM</i>até 01/2027</span></div></div>
              <div class="cs-jc"><small>Fazendo</small><div class="cs-tf"><b>Treinamento da equipe nova</b><span><i class="av">CF</i>até 22/10</span></div></div>
              <div class="cs-jc"><small>Concluído</small><div class="cs-tf feito"><b>QBR do 3º trimestre</b><span><i class="av">JM</i>30/09</span></div><div class="cs-tf feito"><b>Onboarding concluído</b><span><i class="av">JM</i>03/2025</span></div></div></div></div>
        </div>
      </div>
      <div class="cs-ia">
        <header><span class="cs-iai">${ic('ia')}</span><div><b>Sofia</b><small>Assistente do PominCS · conhece a carteira</small></div><span class="x">${X.fechar}</span></header>
        <span class="cs-ctx">Cliente: Transportes Serra Azul</span>
        <div class="cs-q"><span class="cs-qt"></span></div>
        <div class="cs-r"><span class="cs-rav">${ic('ia')}</span><div><p class="cs-rt"></p>
          <div class="cs-src"><i>PominSAC · 2 chamados</i><i>NPS · hoje</i><i>Uso · 60 dias</i></div>
          <div class="cs-acoes"><span class="cs-criar">${ic('mais')}Criar tarefa na jornada</span><span class="sec">${ic('agenda')}Agendar reunião</span></div></div></div>
        <div class="cs-in">Pergunte sobre a carteira…<span>${ic('enviar')}</span></div>
      </div>
    </main></div>`,
  css: `
.t-cs .cs { --borda: #E3E8EF; --texto: #13202F; --suave: #66768A; --azul: #1E5AA8; position: relative; width: 1280px; height: 800px; display: grid; grid-template-columns: 60px 1fr; grid-template-rows: 56px 1fr; background: #F5F7FA; color: var(--texto); font: 400 13px/1.4 Oxanium, system-ui, sans-serif; }
.t-cs .cs * { box-sizing: border-box; }
.t-cs svg { width: 16px; height: 16px; flex: none; }
.t-cs .cs-lado { grid-row: 1 / 3; display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 9px 0 12px; background: #fff; border-right: 1px solid var(--borda); color: #4A5A6E; }
.t-cs .cs-logo { width: 36px; height: 36px; border-radius: 9px; background: linear-gradient(160deg, #3B82F6, #1E40AF); color: #fff; display: grid; place-items: center; margin-bottom: 10px; } .t-cs .cs-logo svg { width: 19px; height: 19px; }
.t-cs .cs-nav { width: 36px; height: 30px; border-radius: 7px; display: grid; place-items: center; } .t-cs .cs-nav.on { background: #E6EFFA; color: var(--azul); box-shadow: inset 0 0 0 1px #C6DAF2; }
.t-cs .cs-lado > i { height: 10px; } .t-cs .cs-eu { margin-top: auto; width: 32px; height: 32px; border: 1.5px solid #1F3B5C; border-radius: 7px; display: grid; place-items: center; font-weight: 700; font-size: 12px; }
.t-cs .cs-topo { display: flex; align-items: center; gap: 8px; padding: 0 16px 0 20px; background: #fff; border-bottom: 1px solid var(--borda); color: #4A5A6E; }
.t-cs .cs-busca { margin: 0 auto 0 14px; width: 420px; height: 34px; display: flex; align-items: center; gap: 9px; padding: 0 9px 0 12px; border: 1px solid var(--borda); border-radius: 8px; color: #8795A8; font-size: 12.5px; }
.t-cs .cs-busca kbd { margin-left: auto; font: 500 10px 'JetBrains Mono', monospace; color: #8795A8; }
.t-cs .cs-sel { display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 0 10px; border: 1px solid var(--borda); border-radius: 8px; background: #fff; font-size: 12px; color: var(--texto); white-space: nowrap; } .t-cs .cs-sel svg { width: 14px; height: 14px; }
.t-cs .cs-sofia { display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 0 12px; border-radius: 8px; background: #E8F1FC; border: 1px solid #B9D3F3; color: var(--azul); font-weight: 600; font-size: 12.5px; }
.t-cs .cs-ib { position: relative; width: 32px; height: 32px; border: 1px solid var(--borda); border-radius: 8px; display: grid; place-items: center; } .t-cs .cs-ib.dot::after { content: ''; position: absolute; top: 6px; right: 7px; width: 6px; height: 6px; border-radius: 50%; background: var(--azul); }
.t-cs .cs-tema { width: 54px; height: 30px; border-radius: 99px; background: #EEF2F7; padding: 3px; } .t-cs .cs-tema i { width: 24px; height: 24px; border-radius: 50%; background: #2563EB; color: #fff; display: grid; place-items: center; } .t-cs .cs-tema svg { width: 13px; height: 13px; }

.t-cs .cs-main { position: relative; display: grid; grid-template-columns: 682px 1fr; grid-template-rows: 48px 62px minmax(0, 1fr); gap: 12px 14px; padding: 16px 22px; overflow: hidden; }
.t-cs .cs-cab { grid-column: 1 / -1; display: flex; align-items: center; gap: 12px; } .t-cs .cs-cab > div { margin-right: auto; }
.t-cs .cs-tile-ic { width: 40px; height: 40px; border-radius: 9px; background: #EAF1FA; border: 1px solid #CFE0F3; color: var(--azul); display: grid; place-items: center; } .t-cs .cs-tile-ic svg { width: 19px; height: 19px; }
.t-cs h1 { margin: 0; font-size: 21px; font-weight: 600; } .t-cs .cs-cab p { margin: 0; color: var(--suave); font-size: 12.5px; }
.t-cs .cs-bt { display: inline-flex; align-items: center; gap: 6px; height: 34px; padding: 0 14px; border-radius: 8px; background: linear-gradient(90deg, #1F5FAE, #5AA2E0); color: #fff; font-weight: 600; font-size: 12.5px; }
.t-cs .cs-kpis { grid-column: 1 / -1; display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; }
.t-cs .cs-kpis > div { background: #fff; border: 1px solid var(--borda); border-radius: 9px; padding: 8px 13px; display: flex; flex-direction: column; justify-content: center; }
.t-cs .cs-kpis small { font-size: 10px; letter-spacing: .06em; text-transform: uppercase; color: var(--suave); font-weight: 500; } .t-cs .cs-kpis b { font-size: 17px; font-weight: 600; line-height: 1.3; }
.t-cs .cs-kpis em { font-style: normal; font-size: 10.5px; color: var(--suave); } .t-cs .cs-kpis em.up { color: #15803D; }
.t-cs .cs-npsbar { position: relative; display: flex; height: 5px; margin-top: 4px; border-radius: 99px; overflow: visible; } .t-cs .cs-npsbar i { height: 100%; } .t-cs .cs-npsbar i:nth-child(1) { flex: 50; background: #E5484D; border-radius: 99px 0 0 99px; } .t-cs .cs-npsbar i:nth-child(2) { flex: 25; background: #F5B82E; } .t-cs .cs-npsbar i:nth-child(3) { flex: 25; background: #10B981; border-radius: 0 99px 99px 0; }
.t-cs .cs-npsbar u { position: absolute; top: -3px; width: 11px; height: 11px; margin-left: -5px; border-radius: 50%; background: #13202F; border: 2px solid #fff; }

.t-cs .cs-cart, .t-cs .cs-det { min-height: 0; background: #fff; border: 1px solid var(--borda); border-radius: 10px; }
.t-cs .cs-cart { padding: 12px 12px; display: flex; flex-direction: column; }
.t-cs .cs-ch { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; } .t-cs .cs-ch > b { font-size: 14px; font-weight: 600; margin-right: auto; } .t-cs .cs-ch > b em { font-style: normal; font-size: 11px; color: var(--suave); background: #EEF2F7; border-radius: 99px; padding: 1px 8px; margin-left: 4px; }
.t-cs .lg { display: flex; align-items: center; gap: 5px; font-size: 10.5px; color: var(--suave); } .t-cs .lg i { width: 7px; height: 7px; border-radius: 50%; margin-left: 6px; } .t-cs .lg .b, .t-cs .cs-faixas .b::before { background: #16A34A; } .t-cs .lg .m, .t-cs .cs-faixas .m::before { background: #F59E0B; } .t-cs .lg .r, .t-cs .cs-faixas .r::before { background: #E5484D; }
.t-cs .cs-mini { display: inline-flex; align-items: center; gap: 6px; height: 30px; width: 150px; padding: 0 9px; border: 1px solid var(--borda); border-radius: 7px; font-size: 11.5px; color: #8795A8; } .t-cs .cs-mini svg { width: 13px; height: 13px; }
.t-cs .cs-ch .cs-sel { height: 30px; font-size: 11.5px; }
.t-cs .cs-grid { flex: 1; display: grid; grid-template-columns: repeat(6, 1fr); grid-template-rows: repeat(7, 1fr); gap: 6px; }
.t-cs .cs-tile { position: relative; display: flex; flex-direction: column; justify-content: space-between; padding: 7px 8px 8px; border: 1px solid #E6EBF1; border-radius: 7px; background: #FBFCFE; overflow: hidden; }
.t-cs .cs-tile b { font-size: 10.5px; font-weight: 600; line-height: 1.25; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.t-cs .cs-tile .pe { display: flex; align-items: center; justify-content: space-between; } .t-cs .cs-tile small { font-size: 9.5px; color: var(--suave); }
.t-cs .cs-tile .hs { font-style: normal; font-size: 10px; font-weight: 700; min-width: 24px; text-align: center; padding: 1px 5px; border-radius: 99px; color: #15803D; background: #DCFCE7; }
.t-cs .cs-tile.m .hs { color: #B45309; background: #FEF3C7; }
.t-cs .cs-tile > i { position: absolute; left: 0; bottom: 0; height: 3px; width: var(--v); background: #16A34A; opacity: .55; } .t-cs .cs-tile.m > i { background: #F59E0B; }
.t-cs .cs-tile.h.sel { border-color: #1E5AA8; box-shadow: 0 0 0 2px rgba(30, 90, 168, .18); background: #F3F8FE; }
.t-cs .cs-tile.h.risco { border-color: #E5484D; background: #FEF2F2; box-shadow: 0 0 0 3px rgba(229, 72, 77, .2); } .t-cs .cs-tile.h.risco .hs { color: #fff; background: #E5484D; } .t-cs .cs-tile.h.risco > i { background: #E5484D; opacity: 1; width: 41%; }
.t-cs .cs-tile.h.rec { border-color: #1E5AA8; background: #F3F8FE; box-shadow: 0 0 0 2px rgba(30, 90, 168, .18); } .t-cs .cs-tile.h.rec .hs { color: #15803D; background: #DCFCE7; } .t-cs .cs-tile.h.rec > i { background: #16A34A; width: 76%; opacity: .55; }

.t-cs .cs-det { position: relative; overflow: hidden; }
.t-cs .cs-resumo, .t-cs .cs-cli { position: absolute; inset: 0; padding: 14px 16px; }
.t-cs .cs-dt { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; margin: 0 0 7px; } .t-cs .cs-dt b { font-weight: 600; font-size: 13px; } .t-cs .cs-dt small { font-size: 10.5px; color: var(--suave); white-space: nowrap; }
.t-cs .cs-faixas { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; } .t-cs .cs-faixas div { position: relative; padding: 8px 10px 8px 14px; border: 1px solid var(--borda); border-radius: 8px; }
.t-cs .cs-faixas div::before { content: ''; position: absolute; left: 0; top: 8px; bottom: 8px; width: 3px; border-radius: 0 3px 3px 0; } .t-cs .cs-faixas b { display: block; font-size: 20px; font-weight: 600; line-height: 1.2; } .t-cs .cs-faixas small { font-size: 10.5px; color: var(--suave); }
.t-cs .cs-pilha { display: flex; height: 8px; margin: 10px 0 18px; border-radius: 99px; overflow: hidden; gap: 2px; } .t-cs .cs-pilha .b { background: #16A34A; } .t-cs .cs-pilha .m { background: #F59E0B; }
.t-cs .cs-mrr { display: grid; grid-template-columns: 1fr auto 36px; align-items: center; gap: 2px 10px; margin-bottom: 9px; font-size: 11.5px; } .t-cs .cs-mrr span:first-child { display: flex; align-items: center; gap: 6px; } .t-cs .cs-mrr span i { width: 7px; height: 7px; border-radius: 50%; }
.t-cs .cs-mrr b { font-weight: 600; } .t-cs .cs-mrr em { font-style: normal; color: var(--suave); text-align: right; } .t-cs .cs-mrr .br { grid-column: 1 / -1; height: 5px; border-radius: 99px; background: #EEF2F7; overflow: hidden; } .t-cs .cs-mrr .br i { display: block; height: 100%; }
.t-cs .cs-resumo .cs-dt:nth-of-type(3) { margin-top: 16px; }
.t-cs .cs-ren { display: grid; grid-template-columns: 1fr 56px 74px; padding: 7px 0; border-top: 1px solid #EEF2F7; font-size: 11.5px; } .t-cs .cs-ren b { font-weight: 500; } .t-cs .cs-ren span { color: var(--suave); font-family: 'JetBrains Mono', monospace; font-size: 10.5px; } .t-cs .cs-ren em { font-style: normal; text-align: right; font-weight: 600; }

.t-cs .cs-dh { display: flex; align-items: center; gap: 10px; padding-bottom: 11px; border-bottom: 1px solid var(--borda); } .t-cs .cs-dh div { display: flex; flex-direction: column; margin-right: auto; } .t-cs .cs-dh b { font-weight: 600; font-size: 15px; } .t-cs .cs-dh small { font-size: 10.5px; color: var(--suave); }
.t-cs .cs-av { width: 38px; height: 38px; border-radius: 9px; background: #1E5AA8; color: #fff; display: grid; place-items: center; font-weight: 700; font-size: 13px; }
.t-cs .cs-st { font-size: 10.5px; font-weight: 600; color: #15803D; background: #DCFCE7; border-radius: 99px; padding: 2px 9px; }
.t-cs .cs-saude { display: grid; grid-template-columns: 206px 1fr; gap: 10px; margin-top: 11px; }
.t-cs .cs-g { position: relative; height: 140px; border: 1px solid var(--borda); border-radius: 9px; padding: 9px 10px; }
.t-cs .cs-gt { display: flex; align-items: center; gap: 8px; } .t-cs .cs-gt > svg { width: 26px; height: 26px; padding: 5px; border-radius: 7px; background: #EAF1FA; color: var(--azul); } .t-cs .cs-gt span { display: flex; flex-direction: column; line-height: 1.2; } .t-cs .cs-gt b { font-size: 12px; font-weight: 600; } .t-cs .cs-gt small { font-size: 9.5px; color: var(--suave); }
.t-cs .cs-arco { position: absolute; left: 22px; bottom: 6px; width: 162px; height: 91px; } .t-cs .cs-arco path { fill: none; stroke-width: 15; stroke-linecap: round; } .t-cs .cs-g .tr { stroke: #EEF1F5; } .t-cs .cs-g .vl { stroke: var(--azul); }
.t-cs .cs-gn { position: absolute; left: 0; right: 0; bottom: 8px; text-align: center; line-height: 1; } .t-cs .cs-gn b { display: block; font-size: 30px; font-weight: 600; } .t-cs .cs-gn small { font-size: 9.5px; color: var(--suave); }
.t-cs .cs-saude.risco .vl { stroke: #E5484D; } .t-cs .cs-saude.risco .cs-gn b { color: #DC2626; } .t-cs .cs-saude.rec .vl { stroke: var(--azul); } .t-cs .cs-saude.rec .cs-gn b { color: var(--texto); }
.t-cs .cs-met { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; } .t-cs .cs-met div { border: 1px solid var(--borda); border-radius: 9px; padding: 9px 11px; display: flex; flex-direction: column; justify-content: center; }
.t-cs .cs-met small { font-size: 9.5px; letter-spacing: .06em; text-transform: uppercase; color: var(--suave); } .t-cs .cs-met b { font-size: 14px; font-weight: 600; } .t-cs .cs-met .neg { color: #DC2626; } .t-cs .cs-met .neg2 { color: #B45309; font-size: 12.5px; }
.t-cs .cs-nps { margin-top: 10px; padding: 10px 12px; border: 1px solid var(--borda); border-radius: 9px; } .t-cs .cs-nps .cs-dt { margin-bottom: 8px; }
.t-cs .cs-nps .d1, .t-cs .cs-nps .c1, .t-cs .cs-nps.nova .d0, .t-cs .cs-nps.nova .c0 { display: none; } .t-cs .cs-nps.nova .d1, .t-cs .cs-nps.nova .c1 { display: inline; }
.t-cs .cs-esc { display: grid; grid-template-columns: repeat(11, 1fr); gap: 4px; } .t-cs .cs-esc span { height: 24px; border-radius: 5px; display: grid; place-items: center; font-size: 11px; font-weight: 600; background: #F3F5F8; color: #8795A8; border-top: 3px solid; }
.t-cs .cs-esc .r { border-color: #F3B4B6; } .t-cs .cs-esc .m { border-color: #F9DD9A; } .t-cs .cs-esc .b { border-color: #9EE2C3; }
.t-cs .cs-nps:not(.nova) .n9 { background: #10B981; color: #fff; border-color: #059669; } .t-cs .cs-nps.nova .n2 { background: #E5484D; color: #fff; border-color: #B91C1C; }
.t-cs .cs-nps p { margin: 8px 0 0; font-size: 12px; color: #33445A; }
.t-cs .cs-alerta { display: flex; align-items: center; gap: 9px; height: 40px; margin-top: 9px; padding: 0 12px; border-radius: 9px; background: #FEF2F2; border: 1px solid #FBC7C9; color: #991B1B; font-size: 12px; opacity: 0; }
.t-cs .cs-alerta svg { color: #DC2626; } .t-cs .cs-alerta svg + svg, .t-cs .cs-alerta.ok svg:first-child { display: none; } .t-cs .cs-alerta.ok svg + svg { display: block; } .t-cs .cs-alerta b { font-weight: 600; } .t-cs .cs-alerta .a1, .t-cs .cs-alerta.ok .a0 { display: none; } .t-cs .cs-alerta.ok .a1 { display: inline; }
.t-cs .cs-alerta.ok { background: #F0FDF4; border-color: #BBF7D0; color: #166534; } .t-cs .cs-alerta.ok svg { color: #16A34A; }
.t-cs .cs-jor { margin-top: 10px; } .t-cs .cs-cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.t-cs .cs-jc { position: relative; min-height: 150px; padding: 7px; border-radius: 8px; background: #F5F7FA; display: flex; flex-direction: column; gap: 6px; } .t-cs .cs-jc > small { font-size: 9.5px; font-weight: 600; letter-spacing: .07em; text-transform: uppercase; color: var(--suave); padding: 0 2px; }
.t-cs .cs-tf { padding: 7px 8px; background: #fff; border: 1px solid var(--borda); border-radius: 7px; } .t-cs .cs-tf b { display: block; font-size: 11px; font-weight: 600; line-height: 1.3; } .t-cs .cs-tf span { display: flex; align-items: center; gap: 5px; margin-top: 5px; font-size: 10px; color: var(--suave); }
.t-cs .cs-tf .av { font-style: normal; width: 17px; height: 17px; border-radius: 50%; background: #C2410C; color: #fff; display: grid; place-items: center; font-size: 7.5px; font-weight: 700; }
.t-cs .cs-tf.feito b { color: var(--suave); text-decoration: line-through; }
.t-cs .cs-tf.nova { position: absolute; left: 7px; right: 7px; top: 26px; z-index: 2; border-color: #E5484D; box-shadow: 0 6px 18px rgba(229, 72, 77, .16); }
.t-cs .cs-tf .ok { display: none; margin-left: auto; font-style: normal; font-weight: 600; color: #15803D; align-items: center; gap: 3px; } .t-cs .cs-tf .ok svg { width: 12px; height: 12px; }
.t-cs .cs-tf.nova.feita { border-color: #86EFAC; box-shadow: none; } .t-cs .cs-tf.nova.feita .ok { display: inline-flex; }

.t-cs .cs-ia { position: absolute; top: 16px; right: 22px; bottom: 16px; width: 430px; z-index: 6; display: flex; flex-direction: column; padding: 16px 18px; background: #fff; border: 1px solid var(--borda); border-radius: 12px; box-shadow: -30px 0 70px rgba(15, 30, 50, .2); }
.t-cs .cs-ia header { display: flex; align-items: center; gap: 10px; padding-bottom: 12px; border-bottom: 1px solid var(--borda); } .t-cs .cs-ia header div { display: flex; flex-direction: column; margin-right: auto; } .t-cs .cs-ia header b { font-size: 15px; font-weight: 600; } .t-cs .cs-ia header small { font-size: 11px; color: var(--suave); } .t-cs .cs-ia .x { color: var(--suave); }
.t-cs .cs-iai, .t-cs .cs-rav { width: 34px; height: 34px; border-radius: 9px; background: #E8F1FC; color: var(--azul); display: grid; place-items: center; flex: none; } .t-cs .cs-iai svg { width: 18px; height: 18px; }
.t-cs .cs-ctx { align-self: flex-start; margin: 12px 0; font-size: 11px; padding: 3px 10px; border-radius: 99px; background: #EEF2F7; color: #33445A; }
.t-cs .cs-q { align-self: flex-end; max-width: 80%; min-width: 60px; min-height: 36px; padding: 8px 13px; border-radius: 12px 12px 3px 12px; background: #1E5AA8; color: #fff; font-size: 13px; }
.t-cs .cs-r { display: flex; gap: 10px; margin-top: 14px; } .t-cs .cs-rav { width: 28px; height: 28px; border-radius: 50%; } .t-cs .cs-rav svg { width: 15px; height: 15px; }
.t-cs .cs-rt { margin: 0; min-height: 110px; font-size: 13px; line-height: 1.5; color: #1E2C3D; }
.t-cs .cs-src { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; } .t-cs .cs-src i { font-style: normal; font-size: 10.5px; padding: 2px 9px; border-radius: 6px; border: 1px solid #CFE0F3; background: #F3F8FE; color: var(--azul); }
.t-cs .cs-acoes { display: flex; gap: 8px; margin-top: 14px; } .t-cs .cs-acoes span { display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 0 12px; border-radius: 8px; font-size: 12px; font-weight: 600; }
.t-cs .cs-criar { background: linear-gradient(90deg, #1F5FAE, #5AA2E0); color: #fff; } .t-cs .cs-acoes .sec { border: 1px solid var(--borda); color: var(--texto); }
.t-cs .cs-in { margin-top: auto; display: flex; align-items: center; justify-content: space-between; height: 42px; padding: 0 6px 0 13px; border: 1px solid var(--borda); border-radius: 10px; color: #8795A8; font-size: 12.5px; } .t-cs .cs-in span { width: 30px; height: 30px; border-radius: 8px; background: #1E5AA8; color: #fff; display: grid; place-items: center; }
`,
  roteiro(f) {
    const tl = f.tl, heroi = '.cs-tile.h';
    const arco = f.$('.cs-g .vl') as unknown as SVGPathElement, L = arco.getTotalLength(), num = f.$('.cs-gn b');
    arco.style.strokeDasharray = String(L); arco.style.strokeDashoffset = String(L);
    const saude = (de: number, ate: number, at: number, dur: number) => {
      const o = { v: de };
      tl.fromTo(o, { v: de }, { v: ate, duration: dur, ease: 'power2.inOut', immediateRender: false, onUpdate: () => { arco.style.strokeDashoffset = String(L * (1 - o.v / 100)); num.textContent = String(Math.round(o.v)); } }, at);
    };
    tl.set(f.$('.cs-cli'), { autoAlpha: 0 }, 0).set(f.$('.cs-ia'), { x: 470, autoAlpha: 0 }, 0).set(f.$('.cs-tf.nova'), { autoAlpha: 0, y: -10 }, 0);

    // 1 · A carteira inteira chega em onda; a câmera desliza até o resumo de contratos
    f.passo(1, 'Os 231 clientes e os seus contratos, numa carteira só.', 'depois');
    mira(f, '.cs-grid', 1.6, 1.6, 4.4, { rx: 7 });
    tl.from(f.$$('.cs-tile'), { autoAlpha: 0, scale: .82, duration: .5, ease: 'power2.out', stagger: { grid: [7, 6], from: 0, amount: 1.4 } }, 4.7);
    tl.from(f.$$('.cs-faixas > div, .cs-mrr, .cs-ren'), { autoAlpha: 0, x: 14, duration: .45, stagger: .07, ease: 'power2.out' }, 6.2);
    tl.from(f.$$('.cs-pilha i, .cs-mrr .br i'), { scaleX: 0, transformOrigin: '0 50%', duration: .9, stagger: .08, ease: 'power3.out' }, 6.5);
    mira(f, '.cs-det', 1.4, 2.2, 6.2, { ry: -4 });

    // 2 · Um clique no cliente e a câmera mergulha no medidor de saúde
    f.cursor(heroi, 8.1);
    f.classe(heroi, 'sel', 9.02);
    f.passo(2, 'Cada cliente tem a sua nota de saúde. A Serra Azul está em 82.', 9.2);
    tl.to(f.$('.cs-resumo'), { autoAlpha: 0, duration: .35 }, 9.1).to(f.$('.cs-cli'), { autoAlpha: 1, duration: .45 }, 9.3);
    f.entra('.cs-dh, .cs-met > div, .cs-nps, .cs-jc', 9.4, { stagger: .05 });
    f.esconderCursor(9.6);
    mira(f, '.cs-g', 2.7, 1.7, 9.5, { rx: 8 });
    saude(0, 82, 10.3, 1.6);

    // 3 · A nota 2 chega, a saúde despenca e a câmera recua até a carteira inteira
    f.passo(3, 'Chega uma nota 2 no NPS. O alerta dispara antes do cancelamento.', 12.9);
    mira(f, '.cs-nps', 2.1, 1.3, 12.7, { rx: 4 });
    f.classe('.cs-nps', 'nova', 13.6);
    tl.fromTo(f.$('.cs-esc .n2'), { scale: 1 }, { scale: 1.35, duration: .2, yoyo: true, repeat: 1, immediateRender: false }, 13.6);
    mira(f, '.cs-nps', 1.85, 1.1, 14.4);
    saude(82, 41, 14.7, 1.1);
    f.classe('.cs-saude', 'risco', 14.9);
    tl.to(f.$('.cs-alerta'), { opacity: 1, duration: .4 }, 15.4);
    f.camera({ zoom: .97 }, 1.6, 16.1).camera({ zoom: 1.06 }, 1.5, 17.7, 'power1.inOut');
    f.foco(heroi, 16.6, .9);
    f.classe(heroi, 'risco', 17.1);
    f.contar(`${heroi} .hs`, 41, 17.1, { de: 82, dur: .6 }).contar('.cs-npsb', 47, 17.1, { de: 48, dur: .5 });
    tl.fromTo(f.$(heroi), { scale: 1 }, { scale: 1.12, duration: .3, yoyo: true, repeat: 1, ease: 'power2.inOut', immediateRender: false }, 17.1);

    // 4 · A Sofia explica, a tarefa entra na jornada e a saúde volta a subir
    f.passo(4, 'A Sofia junta os sinais. A tarefa entra na jornada e a saúde volta.', 19.2);
    f.foco(null, 19.2, .7);
    f.cursor('.cs-sofia', 19.2);
    tl.to(f.$('.cs-ia'), { x: 0, autoAlpha: 1, duration: .8, ease: 'power3.out' }, 20.2);
    mira(f, '.cs-ia', 1.4, 1.3, 20.2);
    f.esconderCursor(20.4);
    f.digitar('.cs-qt', 'O que mudou com esse cliente?', 20.6, 40);
    f.digitar('.cs-rt', 'Três sinais em 60 dias: o uso caiu 38%, a Serra Azul abriu 2 chamados sobre atraso na coleta e o NPS foi de 9 para 2. Sugiro uma reunião com o Paulo Henrique esta semana para rever a rota.', 21.6, 80);
    f.entra('.cs-src i, .cs-acoes span', 24.1, { stagger: .08 });
    f.cursor('.cs-criar', 24.4, true, .8);
    tl.to(f.$('.cs-ia'), { x: 470, autoAlpha: 0, duration: .6, ease: 'power2.in' }, 25.4);
    mira(f, '.cs-jor', 1.95, 1.3, 25.4);
    f.esconderCursor(25.6);
    tl.to(f.$('.cs-tf.velha'), { y: f.$('.cs-tf.nova').offsetHeight + 6, duration: .45, ease: 'power2.inOut' }, 25.8).to(f.$('.cs-tf.nova'), { autoAlpha: 1, y: 0, duration: .5, ease: 'back.out(1.6)' }, 26);
    f.legenda('Duas semanas depois: reunião feita, rota revista.', 27);
    f.classe('.cs-tf.nova', 'feita', 27.2);
    mira(f, '.cs-cli', 1.25, 1.4, 27.4);
    saude(41, 76, 27.8, 1.4);
    f.classe('.cs-saude', 'rec', 28.3).classe('.cs-alerta', 'ok', 28.6);
    f.camera({}, 1.6, 29.2);
    f.classe(heroi, 'rec', 29.6);
    f.contar(`${heroi} .hs`, 76, 29.6, { de: 41, dur: .6 });
    f.pausa(.8);
  }
};
export default t;
