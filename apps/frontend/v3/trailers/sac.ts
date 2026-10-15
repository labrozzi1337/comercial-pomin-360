// PominSAC · "O e-mail que ninguém viu". Tela recriada das Solicitações reais (tema escuro, botão azul-claro, KPIs em caixa alta).
// Linguagem de câmera: travelling lateral. A câmera corre pelos canais e depois acompanha o chamado de coluna em coluna no kanban.
import { ic, W, H, type Trailer, type Filme, type Cam } from '../filme';
import { app } from '../dados';
import { svg } from '../../src/data';

const X = {
  painel: svg('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/>'),
  dash: svg('<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>'),
  ticket: svg('<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2M13 17v2M13 11v2"/>'),
  mail: svg('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>'),
  lista: svg('<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>'),
  certo: svg('<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/>'),
  chama: svg('<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1-2.1-.2-4 2-6 .5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>'),
  carrinho: svg('<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2 2h2l2.7 12.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L22 7H5.1"/>'),
  dolar: svg('<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>'),
  caminhao: svg('<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2M15 18H9M19 18h2a1 1 0 0 0 1-1v-3.6a1 1 0 0 0-.2-.6l-3.5-4.4a1 1 0 0 0-.8-.4H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>'),
  lua: svg('<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>'),
  ajuda: svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="m5.6 5.6 3.6 3.6M14.8 14.8l3.6 3.6M14.8 9.2l3.6-3.6M5.6 18.4l3.6-3.6"/>'),
  capelo: svg('<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>'),
  grade: svg('<path d="M5 5h.01M12 5h.01M19 5h.01M5 12h.01M12 12h.01M19 12h.01M5 19h.01M12 19h.01M19 19h.01" stroke-width="3"/>'),
  clipe: svg('<path d="m21.4 11-9.2 9.2a6 6 0 0 1-8.5-8.5l8.6-8.6A4 4 0 1 1 18 8.8l-8.6 8.6a2 2 0 0 1-2.8-2.8l8.5-8.5"/>'),
  camadas: svg('<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>')
};

// Canais: um por área, cada um com o seu e-mail de entrada (domínio fictício)
const canais: [string, string, string, number, string, string][] = [
  ['Compras', 'compras', '#B794F6', 12, '48h', X.carrinho], ['Financeiro', 'financeiro', '#4ADE80', 9, '24h', X.dolar],
  ['TI', 'ti', '#5EB1EF', 14, '8h', ic('codigo')], ['RH', 'rh', '#F472B6', 4, '72h', ic('pessoas')], ['Logística', 'logistica', '#FBBF24', 7, '24h', X.caminhao]
];
type Card = [string, string, string, 'Alta' | 'Média' | 'Baixa', string, string, string];
// #, título, canal, prioridade, dono (iniciais|''), cor, prazo
const colunas: [string, string, string, Card[]][] = [
  ['Novo', 'Aguardando triagem', '#5EB1EF', [
    ['7090', 'Fornecedor de embalagens atrasou a entrega', 'Logística', 'Alta', '', '', 'Vence em 22h'],
    ['7089', 'Cotação de 40 cadeiras para a filial Sul', 'Compras', 'Média', '', '', 'Vence em 2d'],
    ['7087', 'Segunda via de boleto da Rede Bom Preço', 'Financeiro', 'Baixa', '', '', 'Vence em 1d']]],
  ['Em andamento', 'Com responsável', '#818CF8', [
    ['7081', 'Reembolso de viagem de setembro', 'Financeiro', 'Média', 'JM', '#C2410C', 'Vence em 1d'],
    ['7076', 'Acesso ao ERP para a nova analista', 'TI', 'Média', 'BA', '#7C3AED', 'Vence em 6h'],
    ['7072', 'Troca do fornecedor de café do escritório', 'Compras', 'Baixa', 'CF', '#0F766E', 'Vence em 3d']]],
  ['Aguardando solicitante', 'Falta resposta de quem pediu', '#FBBF24', [
    ['7068', 'Nota fiscal com CNPJ divergente', 'Financeiro', 'Alta', 'RN', '#1F5FAE', 'Pausado'],
    ['7061', 'Orçamento de manutenção do ar-condicionado', 'Compras', 'Baixa', 'CF', '#0F766E', 'Pausado']]],
  ['Resolvido', 'Últimos 30 dias', '#4ADE80', [
    ['7058', 'Impressora do 2º andar sem toner', 'TI', 'Baixa', 'BA', '#7C3AED', 'No prazo'],
    ['7055', 'Cadastro de novo fornecedor de frete', 'Compras', 'Média', 'CF', '#0F766E', 'No prazo'],
    ['7049', 'Dúvida no saldo de férias de novembro', 'RH', 'Baixa', 'MC', '#2E9E8F', 'No prazo']]]
];
const av = (i: string, c: string) => `<span class="av" style="--a:${c}">${i}</span>`;
const card = ([n, t, c, p, d, cor, pr]: Card, k: number) => `<div class="sc-card${pr === 'No prazo' ? ' ok' : ''}"><div class="l1"><span class="n">#${n}</span><span class="pri ${p === 'Alta' ? 'a' : p === 'Média' ? 'm' : 'b'}">${p}</span><span class="can">${c}</span>${k % 2 ? '' : `<span class="ori">${X.mail}</span>`}</div>
  <b>${t}</b><div class="l3">${d ? av(d, cor) : '<span class="semdono">Sem responsável</span>'}<span class="pz">${pr === 'No prazo' ? X.certo : ic('relogio')}${pr}</span></div></div>`;
const hms = (s: number) => [s / 3600, (s % 3600) / 60, s % 60].map(v => String(Math.floor(v)).padStart(2, '0')).join(':');

function mira(f: Filme, s: string | { x: number; y: number; w: number; h: number }, zoom: number, dur: number, at: number, ang: Cam = {}, ease?: string) {
  const p = typeof s === 'string' ? f.pos(s) : s, hx = Math.min(W / 2, 880 / zoom), hy = Math.min(H / 2, 495 / zoom);
  const cx = Math.max(hx, Math.min(W - hx, p.x + p.w / 2)), cy = Math.max(hy, Math.min(H - hy, p.y + p.h / 2));
  return f.camera({ ...ang, x: -(cx - W / 2) / W * 100 * zoom, y: -(cy - H / 2) / H * 100 * zoom, zoom }, dur, at, ease);
}

const t: Trailer = {
  ui: `<div class="sc">
    <aside class="sc-lado"><span class="sc-logo">${app('sac').icon}</span><span class="sc-nav">${X.dash}</span><span class="sc-nav">${X.ticket}</span><span class="sc-nav on">${X.mail}</span><i></i><span class="sc-nav">${ic('ajustes')}</span><span class="sc-eu">R</span></aside>
    <header class="sc-topo"><span class="sc-tg">${X.painel}</span><div class="sc-busca">${ic('busca')}Buscar solicitação, página ou ação…<kbd>Ctrl K</kbd></div>
      <div class="sc-ib">${ic('sino')}</div><div class="sc-ib">${X.ajuda}</div><div class="sc-ib">${X.capelo}</div><div class="sc-ib">${X.lua}</div><div class="sc-ib">${X.grade}</div></header>
    <main class="sc-main">
      <div class="sc-cab" data-r><div><h1>Solicitações</h1><p>Canais por área, cada um com o seu e-mail de entrada.</p></div>
        <div class="sc-modo"><span>${X.lista}Tabela</span><span class="on">${ic('quadro')}Kanban</span></div><span class="sc-nova">${ic('mais')}Nova solicitação</span></div>
      <div class="sc-canais" data-r>${canais.map(([n, e, c, q, sla, i], k) => `<div class="sc-canal c${k + 1}" style="--k:${c}"><div class="h"><span class="i">${i}</span><b>${n}</b><span class="at">Ativo</span></div>
        <small>E-mail de entrada</small><code>${e}@sac.exemplo.com.br</code><div class="p"><span><b class="q">${q}</b> abertos</span><span>SLA ${sla}</span></div>${k === 0 ? '<em class="sc-ping">+1</em>' : ''}</div>`).join('')}</div>
      <div class="sc-kpis" data-r>${([['Abertos', '#5EB1EF', ic('caixa'), '38', 'Aguardando triagem', 'k1'], ['Em andamento', '#818CF8', ic('relogio'), '21', 'Em desenvolvimento ou atendimento', 'k2'], ['Resolvidos (30d)', '#4ADE80', X.certo, '412', 'Últimos 30 dias', 'k3'], ['Urgentes / atrasados', '#F87171', X.chama, '3', 'Atenção imediata', 'k4']] as const).map(([n, c, i, v, s, k]) => `<div class="sc-kpi" style="--d:${c}"><div class="h"><i></i>${n}<span>${i}</span></div><b class="${k}">${v}</b><small>${s}</small></div>`).join('')}</div>
      <div class="sc-kanban" data-r>${colunas.map(([n, s, c, cs], k) => `<div class="sc-col c${k + 1}" style="--d:${c}"><div class="sc-ch"><i></i><b>${n}</b><em class="q${k + 1}">${cs.length}</em><small>${s}</small></div><div class="sc-cb">${cs.map(card).join('')}</div></div>`).join('')}
        <div class="sc-mail"><div class="mh">${X.mail}<b>Novo e-mail</b><span>para compras@sac.exemplo.com.br</span><time>10:03</time></div>
          <div class="md">${av('FL', '#D9822B')}<div><b>Fernanda Lima</b><small>fernanda.lima@exemplo.com.br</small></div></div>
          <b class="ms">Notebook do estoque chegou com a tela trincada</b><p>Bom dia! O notebook do pedido 4.518 chegou com a tela trincada. Segue a foto.</p><span class="ax">${X.clipe}foto_notebook.jpg</span></div>
        <div class="sc-heroi"><div class="l1"><span class="n">#7091</span><span class="st"><i></i><span class="s0">Novo</span><span class="s1">Em andamento</span><span class="s2">Resolvido</span></span><span class="pri a">Alta</span><span class="can">Compras</span></div>
          <b class="tt">Notebook do estoque chegou com a tela trincada</b>
          <small class="de">${X.mail}Fernanda Lima · Loja Centro · pedido 4.518</small>
          <div class="pe"><span class="sc-atribuir">${ic('mais')}Atribuir</span><span class="dono">${av('CF', '#0F766E')}<span class="tx"><b>Caio Ferreira</b><small>Compras</small></span></span>
            <span class="sc-prazo">${ic('relogio')}<span class="a">Vence em <b class="sc-cd">48:00:00</b></span><span class="b">No prazo · 6h12min</span></span></div>
          <div class="hist">${X.mail}<span class="h0">10:03 · Protocolo enviado à Fernanda</span><span class="h1">10:41 · Fernanda avisada: em andamento</span><span class="h2">16:15 · Fernanda avisada: resolvido</span></div></div>
        <div class="sc-resp"><div class="mh">${X.mail}<b>Para: fernanda.lima@exemplo.com.br</b><time>16:15</time></div><b class="ms">[#7091] Resolvido: Notebook do estoque chegou com a tela trincada</b>
          <p>Fernanda, a troca foi aprovada com o fornecedor. O notebook novo chega amanhã às 9h na Loja Centro.</p><small>Caio Ferreira · Compras · <u>Ver o histórico do chamado</u></small></div>
      </div>
    </main></div>`,
  css: `
.t-sac .sc { --borda: #1E2126; --texto: #E8EAED; --suave: #8A9099; --azul: #7CC8EE; position: relative; width: 1280px; height: 800px; display: grid; grid-template-columns: 60px 1fr; grid-template-rows: 56px 1fr; background: #08090A; color: var(--texto); font: 400 13px/1.4 Oxanium, system-ui, sans-serif; }
.t-sac .sc * { box-sizing: border-box; }
.t-sac svg { width: 16px; height: 16px; flex: none; }
.t-sac .av { width: 24px; height: 24px; border-radius: 50%; background: var(--a); color: #fff; display: inline-grid; place-items: center; font-size: 9px; font-weight: 700; flex: none; }
.t-sac .sc-lado { grid-row: 1 / 3; display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 10px 0 14px; background: #0B0C0E; border-right: 1px solid #17191C; color: #8A9099; }
.t-sac .sc-logo { width: 36px; height: 36px; border-radius: 9px; background: #7C4DDB; color: #fff; display: grid; place-items: center; margin-bottom: 12px; } .t-sac .sc-logo svg { width: 20px; height: 20px; }
.t-sac .sc-nav { width: 36px; height: 34px; border-radius: 7px; display: grid; place-items: center; } .t-sac .sc-nav.on { background: #1B2A33; color: #9BD3F5; }
.t-sac .sc-lado > i { width: 26px; height: 1px; background: #23262B; margin: 6px 0; } .t-sac .sc-eu { margin-top: auto; font-weight: 700; font-size: 12px; color: #E8EAED; }
.t-sac .sc-topo { display: flex; align-items: center; gap: 10px; padding: 0 18px 0 22px; color: #B4B9C0; }
.t-sac .sc-busca { margin: 0 auto 0 260px; width: 400px; height: 34px; display: flex; align-items: center; gap: 9px; padding: 0 9px 0 12px; background: #0F1113; border: 1px solid #23262B; border-radius: 8px; color: #8A9099; font-size: 12.5px; }
.t-sac .sc-busca kbd { margin-left: auto; font: 500 9.5px 'JetBrains Mono', monospace; border: 1px solid #2A2D32; border-radius: 4px; padding: 2px 5px; }
.t-sac .sc-ib { width: 32px; height: 32px; border-radius: 7px; background: #0F1113; border: 1px solid #1E2126; display: grid; place-items: center; }

.t-sac .sc-main { position: relative; margin: 2px 12px 12px 4px; padding: 20px 26px; border: 1px solid #1A1D21; border-radius: 10px; background: #0A0B0C; }
.t-sac .sc-cab { display: flex; align-items: center; gap: 12px; height: 50px; }
.t-sac .sc-cab > div:first-child { margin-right: auto; } .t-sac h1 { margin: 0; font-size: 25px; font-weight: 600; letter-spacing: -.01em; } .t-sac .sc-cab p { margin: 0; color: var(--suave); font-size: 12.5px; }
.t-sac .sc-modo { display: flex; padding: 3px; border: 1px solid var(--borda); border-radius: 8px; background: #0F1113; }
.t-sac .sc-modo span { display: flex; align-items: center; gap: 7px; padding: 6px 13px; border-radius: 6px; font-size: 11.5px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; color: var(--suave); }
.t-sac .sc-modo .on { background: #1C1F23; color: var(--texto); } .t-sac .sc-modo svg { width: 14px; height: 14px; }
.t-sac .sc-nova { display: flex; align-items: center; gap: 8px; height: 38px; padding: 0 16px; border-radius: 7px; background: var(--azul); color: #08202E; font-size: 12px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; }

.t-sac .sc-canais { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-top: 16px; }
.t-sac .sc-canal { position: relative; height: 76px; padding: 9px 12px; background: #111316; border: 1px solid var(--borda); border-radius: 7px; }
.t-sac .sc-canal .h { display: flex; align-items: center; gap: 8px; } .t-sac .sc-canal .h b { font-weight: 600; font-size: 13px; }
.t-sac .sc-canal .i { width: 22px; height: 22px; border-radius: 6px; display: grid; place-items: center; color: var(--k); background: color-mix(in srgb, var(--k) 16%, transparent); } .t-sac .sc-canal .i svg { width: 13px; height: 13px; }
.t-sac .sc-canal .at { margin-left: auto; font-size: 9.5px; color: #4ADE80; border: 1px solid #1F4D33; border-radius: 99px; padding: 0 7px; }
.t-sac .sc-canal small { display: none; } .t-sac .sc-canal code { display: block; margin-top: 7px; font: 500 10.5px 'JetBrains Mono', monospace; color: #C5CAD1; white-space: nowrap; }
.t-sac .sc-canal .p { display: flex; justify-content: space-between; margin-top: 4px; font-size: 10.5px; color: var(--suave); } .t-sac .sc-canal .p b { color: var(--texto); font-weight: 600; }
.t-sac .sc-ping { position: absolute; top: -8px; right: -8px; font-style: normal; font-size: 10.5px; font-weight: 700; color: #0B0C0E; background: var(--azul); border-radius: 99px; padding: 2px 7px; }

.t-sac .sc-kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 12px; }
.t-sac .sc-kpi { height: 64px; padding: 9px 14px; background: #111316; border: 1px solid var(--borda); border-radius: 7px; display: grid; grid-template-columns: auto 1fr; grid-template-rows: auto 1fr; column-gap: 14px; align-items: center; }
.t-sac .sc-kpi .h { grid-column: 1 / 3; display: flex; align-items: center; gap: 7px; font-size: 10px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: #B4B9C0; }
.t-sac .sc-kpi .h i { width: 6px; height: 6px; border-radius: 50%; background: var(--d); } .t-sac .sc-kpi .h span { margin-left: auto; color: var(--d); display: grid; } .t-sac .sc-kpi .h svg { width: 14px; height: 14px; }
.t-sac .sc-kpi b { font-size: 24px; font-weight: 600; line-height: 1; } .t-sac .sc-kpi small { font-size: 11px; color: var(--suave); }

.t-sac .sc-kanban { position: relative; display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 14px; height: 448px; }
.t-sac .sc-col { min-width: 0; display: flex; flex-direction: column; background: #0D0E10; border: 1px solid #16181B; border-radius: 8px; }
.t-sac .sc-ch { display: flex; align-items: center; gap: 7px; height: 36px; padding: 0 12px; border-bottom: 1px solid #16181B; font-size: 11px; white-space: nowrap; }
.t-sac .sc-ch i { width: 7px; height: 7px; border-radius: 50%; background: var(--d); } .t-sac .sc-ch b { font-weight: 600; letter-spacing: .08em; text-transform: uppercase; font-size: 10.5px; }
.t-sac .sc-ch em { font-style: normal; font-size: 10.5px; color: var(--texto); background: #1C1F23; border-radius: 99px; padding: 0 7px; } .t-sac .sc-ch small { margin-left: auto; color: #6B7178; font-size: 10px; overflow: hidden; text-overflow: ellipsis; }
.t-sac .sc-cb { flex: 1; min-height: 0; overflow: hidden; display: flex; flex-direction: column; gap: 8px; padding: 9px; }
.t-sac .sc-card, .t-sac .sc-heroi { flex: none; padding: 9px 11px; background: #131518; border: 1px solid #23262B; border-radius: 7px; }
.t-sac .sc-card.ok { opacity: .72; }
.t-sac .l1 { display: flex; align-items: center; gap: 6px; } .t-sac .l1 .n { font: 600 10.5px 'JetBrains Mono', monospace; color: var(--suave); }
.t-sac .pri { font-size: 9.5px; font-weight: 600; padding: 0 6px; border-radius: 4px; } .t-sac .pri.a { color: #F87171; background: #2A1517; } .t-sac .pri.m { color: #FBBF24; background: #2A2312; } .t-sac .pri.b { color: #9AA3AD; background: #1C1F23; }
.t-sac .can { font-size: 9.5px; color: #B4B9C0; border: 1px solid #2A2D32; border-radius: 4px; padding: 0 6px; } .t-sac .ori { margin-left: auto; color: #6B7178; display: grid; } .t-sac .ori svg { width: 13px; height: 13px; }
.t-sac .sc-card > b { display: block; margin: 6px 0 8px; font-weight: 500; font-size: 12.5px; line-height: 1.3; }
.t-sac .l3 { display: flex; align-items: center; justify-content: space-between; } .t-sac .semdono { font-size: 10.5px; color: #6B7178; }
.t-sac .pz { display: flex; align-items: center; gap: 4px; font-size: 10.5px; color: #B4B9C0; } .t-sac .pz svg { width: 12px; height: 12px; } .t-sac .ok .pz { color: #4ADE80; }

.t-sac .sc-heroi { position: absolute; z-index: 3; width: var(--w); left: var(--x); top: var(--y); padding: 11px 13px 10px; background: #15171B; border-color: #6D4AB8; box-shadow: 0 0 0 1px rgba(160, 102, 237, .25), 0 18px 40px rgba(0, 0, 0, .55); }
.t-sac .sc-heroi .st { display: inline-flex; align-items: center; gap: 5px; font-size: 9.5px; font-weight: 600; padding: 0 7px 0 6px; border-radius: 4px; color: #5EB1EF; background: #11222F; }
.t-sac .sc-heroi .st i { width: 6px; height: 6px; border-radius: 50%; background: currentColor; } .t-sac .sc-heroi .s1, .t-sac .sc-heroi .s2, .t-sac .sc-heroi.and .s0, .t-sac .sc-heroi.res .s1 { display: none; }
.t-sac .sc-heroi.and .s1 { display: inline; } .t-sac .sc-heroi.and .st { color: #A5B4FC; background: #1C1E36; } .t-sac .sc-heroi.res .s1 { display: none; } .t-sac .sc-heroi.res .s2 { display: inline; } .t-sac .sc-heroi.res .st { color: #4ADE80; background: #12261A; }
.t-sac .sc-heroi .can { margin-left: auto; }
.t-sac .sc-heroi .tt { display: block; margin: 7px 0 3px; font-weight: 600; font-size: 13.5px; line-height: 1.3; }
.t-sac .sc-heroi .de { display: flex; align-items: center; gap: 5px; font-size: 10.5px; color: var(--suave); } .t-sac .sc-heroi .de svg { width: 12px; height: 12px; }
.t-sac .sc-heroi .pe { display: flex; align-items: center; justify-content: space-between; gap: 6px; height: 32px; margin: 9px 0 8px; }
.t-sac .sc-atribuir { display: inline-flex; align-items: center; gap: 5px; height: 26px; padding: 0 10px 0 7px; border: 1px dashed #3A3F47; border-radius: 6px; font-size: 11px; color: #C5CAD1; } .t-sac .sc-atribuir svg { width: 13px; height: 13px; }
.t-sac .sc-heroi .dono { display: none; align-items: center; gap: 7px; } .t-sac .sc-heroi .dono .tx { white-space: nowrap; display: flex; flex-direction: column; line-height: 1.2; } .t-sac .sc-heroi .dono b { font-size: 11.5px; font-weight: 600; } .t-sac .sc-heroi .dono small { font-size: 9.5px; color: var(--suave); }
.t-sac .sc-heroi .dono .av { width: 26px; height: 26px; }
.t-sac .sc-heroi.dono .sc-atribuir { display: none; } .t-sac .sc-heroi.dono .dono { display: flex; }
.t-sac .sc-prazo { display: inline-flex; align-items: center; gap: 5px; height: 24px; padding: 0 8px; border-radius: 6px; font-size: 10.5px; color: #FBBF24; background: #2A2312; opacity: 0; white-space: nowrap; }
.t-sac .sc-prazo b { font: 600 11px 'JetBrains Mono', monospace; } .t-sac .sc-prazo svg { width: 12px; height: 12px; } .t-sac .sc-prazo .b { display: none; }
.t-sac .sc-heroi.prazo .sc-prazo { opacity: 1; } .t-sac .sc-heroi.res .sc-prazo { color: #4ADE80; background: #12261A; } .t-sac .sc-heroi.res .sc-prazo .a { display: none; } .t-sac .sc-heroi.res .sc-prazo .b { display: inline; font-weight: 600; }
.t-sac .hist { display: flex; align-items: center; gap: 6px; padding-top: 8px; border-top: 1px solid #23262B; font-size: 10.5px; color: #9BD3F5; white-space: nowrap; overflow: hidden; } .t-sac .hist svg { width: 12px; height: 12px; }
.t-sac .hist .h1, .t-sac .hist .h2, .t-sac .and .hist .h0, .t-sac .res .hist .h1 { display: none; } .t-sac .and .hist .h1, .t-sac .res .hist .h2 { display: inline; } .t-sac .res .hist .h1 { display: none; }

.t-sac .sc-mail, .t-sac .sc-resp { position: absolute; z-index: 4; padding: 11px 13px; background: #F7F8FA; color: #1B2430; border-radius: 8px; box-shadow: 0 24px 50px rgba(0, 0, 0, .6); font-size: 11.5px; }
.t-sac .sc-mail { width: var(--w); left: var(--x); top: var(--y); }
.t-sac .mh { display: flex; align-items: center; gap: 6px; padding-bottom: 7px; margin-bottom: 7px; border-bottom: 1px solid #E3E8EF; font-size: 10.5px; color: #6A7789; white-space: nowrap; }
.t-sac .mh svg { width: 14px; height: 14px; color: #7C4DDB; } .t-sac .mh b { color: #1B2430; font-weight: 600; } .t-sac .mh span { overflow: hidden; text-overflow: ellipsis; } .t-sac .mh time { margin-left: auto; }
.t-sac .md { display: flex; align-items: center; gap: 8px; } .t-sac .md div { display: flex; flex-direction: column; line-height: 1.25; } .t-sac .md b { font-weight: 600; } .t-sac .md small { color: #6A7789; font-size: 10px; }
.t-sac .ms { display: block; margin: 7px 0 3px; font-weight: 600; font-size: 12.5px; line-height: 1.3; } .t-sac .sc-mail p, .t-sac .sc-resp p { margin: 0 0 7px; color: #3B4B5F; line-height: 1.4; }
.t-sac .ax { display: inline-flex; align-items: center; gap: 5px; font-size: 10.5px; padding: 2px 8px; border-radius: 5px; background: #E9EDF3; } .t-sac .ax svg { width: 12px; height: 12px; }
.t-sac .sc-resp { width: 300px; left: var(--x); top: var(--y); border-left: 3px solid #16A34A; } .t-sac .sc-resp small { color: #6A7789; font-size: 10px; } .t-sac .sc-resp u { color: #1F5FAE; text-decoration: none; }
`,
  roteiro(f) {
    const tl = f.tl;
    // Geometria do kanban: o chamado vive por cima das colunas e anda de uma para a outra
    const kb = f.pos('.sc-kanban'), cols = [1, 2, 3, 4].map(k => f.pos(`.sc-col.c${k} .sc-cb`)), passo = cols[1].x - cols[0].x;
    const heroi = f.$('.sc-heroi'), mail = f.$('.sc-mail'), resp = f.$('.sc-resp');
    const x0 = cols[0].x - kb.x + 9, y0 = cols[0].y - kb.y + 9, w = cols[0].w - 18;
    [heroi, mail].forEach(e => { e.style.setProperty('--x', x0 + 'px'); e.style.setProperty('--y', y0 + 'px'); e.style.setProperty('--w', w + 'px'); });
    resp.style.setProperty('--x', x0 + passo * 2.62 + 'px'); resp.style.setProperty('--y', y0 + 196 + 'px');
    const hh = heroi.offsetHeight + 8, alvo = (k: number) => ({ x: cols[0].x + 9 + passo * k, y: cols[0].y + 9, w, h: hh });
    const cards = (k: number) => f.$$(`.sc-col.c${k} .sc-card`);
    const conta = (s: string, de: number, ate: number, at: number) => f.contar(s, ate, at, { de, dur: .35 });
    const relogio = (de: number, ate: number, at: number, dur: number) => {
      const el = f.$('.sc-cd'), o = { n: de };
      tl.fromTo(o, { n: de }, { n: ate, duration: dur, ease: 'none', immediateRender: false, onUpdate: () => { el.textContent = hms(o.n); } }, at);
    };
    tl.set(heroi, { autoAlpha: 0, rotationX: -90, transformPerspective: 900, transformOrigin: '50% 0' }, 0)
      .set(mail, { autoAlpha: 0, y: f.pos('.sc-canal.c1').y - kb.y - y0, scale: .55, transformOrigin: '50% 0' }, 0)
      .set(resp, { autoAlpha: 0, y: 24 }, 0).set(f.$('.sc-ping'), { autoAlpha: 0, scale: .4 }, 0);

    // 1 · Canais: travelling da direita para a esquerda, de Logística até Compras
    f.passo(1, 'Cada área tem o seu canal, com o seu próprio e-mail de entrada.', 'depois');
    f.foco('.sc-canais', 4.4, .8);
    mira(f, '.sc-canal.c5', 2.1, 1.6, 4.4, { ry: -7 });
    tl.from(f.$$('.sc-canal').reverse(), { autoAlpha: 0, x: -40, duration: .7, stagger: .55, ease: 'power3.out' }, 4.7);
    mira(f, '.sc-canal.c1', 2.1, 3.6, 6.1, { ry: 6 }, 'power1.inOut');

    // 2 · O e-mail chega ao canal de Compras e cai no kanban como chamado
    f.passo(2, 'Chegou um e-mail. Ele vira chamado, com número e histórico.', 9.7);
    tl.to(f.$('.sc-ping'), { autoAlpha: 1, scale: 1, duration: .4, ease: 'back.out(3)' }, 9.5);
    conta('.sc-canal.c1 .q', 12, 13, 9.5);
    tl.to(mail, { autoAlpha: 1, scale: .82, duration: .45, ease: 'power2.out' }, 9.9);
    f.foco('.sc-kanban', 10.2, .8);
    tl.to(mail, { y: 0, scale: 1, duration: 1.1, ease: 'power3.inOut' }, 10.35);
    mira(f, alvo(0), 2.2, 1.5, 10.1, { rx: 6 });
    tl.to(cards(1), { y: hh, duration: .6, ease: 'power2.inOut', stagger: .04 }, 10.9);
    tl.to(mail, { rotationX: 90, transformPerspective: 900, autoAlpha: 0, duration: .35, ease: 'power2.in' }, 11.9)
      .to(heroi, { rotationX: 0, autoAlpha: 1, duration: .45, ease: 'power2.out' }, 12.2);
    conta('.q1', 3, 4, 12.3); conta('.k1', 38, 39, 12.3);
    tl.to(f.$('.sc-ping'), { autoAlpha: 0, scale: .4, duration: .3 }, 12.4);

    // 3 · Dono e prazo
    f.passo(3, 'Ganha dono e prazo. Ninguém mais pergunta de quem é.', 13.2);
    mira(f, alvo(0), 2.75, 1.2, 13.1);
    f.cursor('.sc-atribuir', 13.4);
    f.classe('.sc-heroi', 'dono', 14.35);
    f.classe('.sc-heroi', 'prazo', 14.7);
    tl.from(f.$('.sc-prazo'), { x: 10, duration: .4, ease: 'power2.out' }, 14.7);
    relogio(172800, 172795, 14.7, 2);
    f.esconderCursor(15.2);

    // 4 · O chamado atravessa o kanban e a câmera vai junto
    f.passo(4, 'Novo, em andamento, resolvido. Quem pediu é avisado a cada passo.', 16.9);
    tl.to(heroi, { scale: 1.04, duration: .3, ease: 'power2.out' }, 16.8);
    tl.to(heroi, { x: passo, duration: 1.5, ease: 'power3.inOut' }, 17.1);
    mira(f, alvo(1), 2.3, 1.5, 17.1, { ry: -5 });
    tl.to(cards(1), { y: 0, duration: .55, ease: 'power2.inOut' }, 17.3).to(cards(2), { y: hh, duration: .55, ease: 'power2.inOut' }, 17.8);
    tl.to(heroi, { scale: 1, duration: .3 }, 18.6);
    f.classe('.sc-heroi', 'and', 18.5);
    conta('.q1', 4, 3, 18.5); conta('.q2', 3, 4, 18.5); conta('.k2', 21, 22, 18.5);
    relogio(172795, 150480, 16.9, 6.1);
    tl.to(heroi, { scale: 1.04, duration: .3 }, 19.9);
    tl.to(heroi, { x: passo * 3, duration: 2, ease: 'power3.inOut' }, 20.1);
    mira(f, alvo(3), 2.3, 2, 20.1, { ry: -6 });
    tl.to(cards(2), { y: 0, duration: .55, ease: 'power2.inOut' }, 20.4).to(cards(4), { y: hh, duration: .55, ease: 'power2.inOut' }, 21.3);
    tl.to(heroi, { scale: 1, duration: .3 }, 22.1);
    f.classe('.sc-heroi', 'res', 22);
    conta('.q2', 4, 3, 22); conta('.q4', 3, 4, 22); conta('.k2', 22, 21, 22); conta('.k1', 39, 38, 22); conta('.k3', 412, 413, 22);
    tl.to(resp, { autoAlpha: 1, y: 0, duration: .6, ease: 'power3.out' }, 22.5);
    mira(f, { x: alvo(3).x - 140, y: alvo(3).y + 40, w: w + 140, h: 300 }, 1.95, 1.2, 22.4, { ry: -2 });
    f.foco(null, 24.4, .8);
    f.camera({}, 2, 24.6);
    f.pausa(1.4);
  }
};
export default t;
