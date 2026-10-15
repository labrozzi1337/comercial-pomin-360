// PominReport · "Segunda, 8h". Sem captura do sistema (login Microsoft): desenhado na mesma família visual (tema claro, Oxanium, botões azuis).
// Linguagem de câmera: vista de cima, inclinada sobre a mesa. Os relatórios caem e empilham, depois se abrem em leque e a câmera endireita.
import { ic, W, H, type Trailer, type Filme, type Cam } from '../filme';
import { app } from '../dados';
import { svg } from '../../src/data';

const X = {
  painel: svg('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/>'),
  alvo: svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>'),
  baixo: svg('<path d="m6 9 6 6 6-6"/>'),
  sobe: svg('<path d="M12 19V5M5 12l7-7 7 7"/>'),
  desce: svg('<path d="M12 5v14M19 12l-7 7-7-7"/>'),
  certo: svg('<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/>'),
  baixar: svg('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>')
};

type Ind = [string, string, number]; // indicador, valor, % da meta (barra)
// área, gestor, iniciais, cor, hora da entrega, 3 indicadores, comentário, bateu a meta
const rel: [string, string, string, string, string, Ind[], string, boolean][] = [
  ['Comercial', 'Bruno Almeida', 'BA', '#7C3AED', '07:41', [['Receita fechada', 'R$ 1,31 mi', 109], ['Novos clientes', '21 de 18', 117], ['Conversão', '27% de 30%', 90]], 'Fechamos a Aurora. Feriado pesou na conversão.', true],
  ['Operações', 'Caio Ferreira', 'CF', '#0F766E', '07:44', [['Pedidos expedidos', '4.820', 107], ['Prazo cumprido', '96% de 95%', 101], ['Retrabalho', '2,1% (máx. 3%)', 100]], 'Linha 2 voltou ao ritmo depois da manutenção.', true],
  ['Financeiro', 'Marina Castro', 'MC', '#2E9E8F', '07:48', [['Recebido', 'R$ 2,8 mi', 93], ['Inadimplência', '4,1% (máx. 5%)', 100], ['Despesas', 'R$ 910 mil', 100]], 'Dois clientes grandes pagam na terça.', true],
  ['Logística', 'Júlia Mendes', 'JM', '#C2410C', '07:50', [['Entregas no prazo', '91% de 95%', 96], ['Custo por entrega', 'R$ 38 (meta 35)', 92], ['Avarias', '0,4% (máx. 0,5%)', 100]], 'Chuva travou duas rotas. Plano de rota B aprovado.', false],
  ['Marketing', 'Rafael Nogueira', 'RN', '#1F5FAE', '07:52', [['Leads', '412 de 380', 108], ['Custo por lead', 'R$ 41 (meta 45)', 100], ['MQL', '128 de 120', 107]], 'Campanha de outubro trouxe 97 respostas.', true],
  ['RH', 'Patrícia Souza', 'PS', '#DB2777', '07:55', [['Vagas fechadas', '6 de 8', 75], ['Turnover', '1,2% (máx. 1,5%)', 100], ['Treinamento', '14h de 12h', 117]], 'Duas vagas de TI seguem abertas.', false],
  ['TI', 'Diego Martins', 'DM', '#0369A1', '07:57', [['Chamados resolvidos', '182 de 170', 107], ['Disponibilidade', '99,9%', 100], ['Projetos no prazo', '4 de 5', 80]], 'Migração do ERP segue no cronograma.', true],
  ['Compras', 'Aline Rocha', 'AR', '#B45309', '07:58', [['Economia', 'R$ 86 mil de 70', 123], ['Pedidos no prazo', '94% de 95%', 99], ['Novos fornecedores', '3 de 2', 150]], 'Renegociamos o frete com dois fornecedores.', true],
  ['Atendimento', 'Sérgio Tavares', 'ST', '#4F46E5', '08:00', [['NPS', '62 (meta 60)', 103], ['1ª resposta', '4 min (meta 5)', 100], ['Resolvidos', '1.204 de 1.100', 109]], 'Fila do WhatsApp zerada todos os dias.', true]
];
// Semana 41 x 42, em % da meta, para o gráfico de comparação
const comp: [string, number, number][] = [['Comercial', 92, 100], ['Operações', 98, 101], ['Financeiro', 96, 98], ['Logística', 99, 96], ['Marketing', 89, 100], ['RH', 91, 90], ['TI', 96, 100], ['Compras', 94, 100], ['Atendimento', 97, 100]];
const metas: [string, string][] = [['Receita fechada', 'R$ 1,2 mi'], ['Novos clientes', '18'], ['Propostas enviadas', '60'], ['Taxa de conversão', '30%'], ['Ticket médio', 'R$ 66 mil']];
// leve bagunça da pilha: deslocamento x, y e giro de cada folha
const jit: [number, number, number][] = [[-14, 6, -5], [10, -8, 4], [-6, -4, -2], [16, 10, 6], [-10, 12, -4], [6, -12, 3], [-16, -2, -6], [12, 4, 2], [0, 0, -1]];

function mira(f: Filme, s: string, zoom: number, dur: number, at: number, ang: Cam = {}) {
  const p = f.pos(s), hx = Math.min(W / 2, 880 / zoom), hy = Math.min(H / 2, 495 / zoom);
  const cx = Math.max(hx, Math.min(W - hx, p.x + p.w / 2)), cy = Math.max(hy, Math.min(H - hy, p.y + p.h / 2));
  return f.camera({ ...ang, x: -(cx - W / 2) / W * 100 * zoom, y: -(cy - H / 2) / H * 100 * zoom, zoom }, dur, at);
}

const t: Trailer = {
  ui: `<div class="rp">
    <aside class="rp-lado"><span class="rp-logo">${app('report').icon}</span>${[ic('inicio'), ic('doc'), X.alvo, ic('conversa'), ic('grafico'), ic('pessoas'), ic('agenda')].map((s, i) => `<span class="rp-nav${i === 1 ? ' on' : ''}">${s}</span>`).join('')}<span class="rp-nav fim">${ic('ajustes')}</span><span class="rp-eu">R</span></aside>
    <header class="rp-topo"><span class="rp-tg">${X.painel}</span><div class="rp-marca"><b>Relatórios <em>Grupo Pomin</em></b><small>Liderança · semanal</small></div>
      <div class="rp-busca">${ic('busca')}Buscar gestor, área ou indicador…<kbd>Ctrl K</kbd></div><span class="rp-sel">Semana 42 · 12 a 16/10${X.baixo}</span><span class="rp-ib">${ic('sino')}</span><span class="rp-av" style="--a:#16324F">DR</span></header>
    <main class="rp-main">
      <div class="rp-cab" data-r><div><small>Segunda-feira, 19 de outubro</small><h1>Semana 42 · 12 a 16 de outubro</h1></div>
        <div class="rp-seg"><span class="s1">Entregas</span><span class="s2">Painel</span><span class="s3">${ic('grafico')}Comparar</span></div><span class="rp-bt sec">${X.baixar}Exportar PDF</span></div>
      <div class="rp-esq" data-r>
        <div class="rp-card rp-ind"><div class="rp-ct"><span class="i">${X.alvo}</span><div><b>Indicadores e metas</b><small>Comercial · Bruno Almeida</small></div></div>
          <div class="rp-th"><span>Indicador</span><span>Meta da semana</span></div>
          ${metas.map(([n], i) => `<div class="rp-tr m${i + 1}"><span>${n}</span><span class="rp-in"><b></b></span></div>`).join('')}
          <div class="rp-tf"><span class="rp-sw"><i></i>Repete toda semana</span><span class="rp-salvar"><span class="a">Salvar metas</span><span class="b">${X.certo}Metas salvas</span></span></div></div>
        <div class="rp-card rp-cmp"><div class="rp-ct"><span class="i">${ic('grafico')}</span><div><b>Semana 42 x semana 41</b><small>% da meta de cada área</small></div></div>
          <div class="rp-leg"><span><i class="a"></i>Semana 41</span><span><i class="b"></i>Semana 42</span></div>
          ${comp.map(([n, a, b]) => `<div class="rp-cr"><span>${n}</span><div class="rp-bars"><i class="a" style="width:${a * .88}%"></i><i class="b${b < 98 ? ' r' : ''}" style="width:${b * .88}%"></i><u></u></div><em class="${b >= a ? 'up' : 'dn'}">${b >= a ? '▲' : '▼'} ${Math.abs(b - a)} p.p.</em></div>`).join('')}</div>
      </div>
      <div class="rp-card rp-centro" data-r><div class="rp-mh"><b>Relatórios da semana</b><small>mesmo modelo para os nove gestores</small><span class="rp-placar">${X.alvo}<b class="rp-n">0</b> de 9 áreas na meta</span></div>
        <div class="rp-mesa"><p class="rp-vazio">Aguardando os relatórios · prazo segunda, 9h</p>
          ${rel.map(([a, g, i, c, h, ind, com, ok], k) => { const d = comp[k][2] - comp[k][1]; return `<div class="rp-doc${ok ? '' : ' fora'}" style="--k:${c}"><div class="rp-dh"><span class="rp-av" style="--a:${c}">${i}</span><div><b>${g}</b><small>${a}</small></div><time>${h}</time></div>
            <small class="rp-sem">Semana 42 · 12 a 16/10</small>
            ${ind.map(([n, v, p]) => `<div class="rp-di"><span>${n}</span><b>${v}</b><span class="rp-db"><i style="width:${Math.min(p, 100)}%" class="${p >= 100 ? 'ok' : p >= 95 ? 'q' : 'r'}"></i></span></div>`).join('')}
            <p>${com}</p><div class="rp-df"><span class="rp-st">${ok ? `${X.certo}Meta batida` : `${ic('alerta')}Abaixo da meta`}</span><span class="rp-dl ${d >= 0 ? 'up' : 'dn'}">${d >= 0 ? X.sobe : X.desce}${d >= 0 ? '+' : '−'}${Math.abs(d)} p.p. vs S41</span></div></div>`; }).join('')}
        </div></div>
      <div class="rp-card rp-dir" data-r><div class="rp-ct"><span class="i">${ic('doc')}</span><div><b>Entregas da semana</b><small>prazo: segunda, 9h</small></div></div>
        <div class="rp-prog"><b class="rp-ne">0</b><span>de 9 entregues</span></div><div class="rp-pb"><i></i></div>
        <ul class="rp-ent">${rel.map(([a, g, i, c, h]) => `<li><span class="rp-av" style="--a:${c}">${i}</span><div><b>${g}</b><small>${a}</small></div><em class="w">${ic('relogio')}</em><em class="k">${X.certo}${h}</em></li>`).join('')}</ul>
        <div class="rp-reu">${ic('agenda')}<div><b>Reunião de diretoria</b><small>Hoje, 10h · pauta pronta</small></div></div></div>
    </main></div>`,
  css: `
.t-report .rp { --borda: #E3E8EF; --texto: #13202F; --suave: #66768A; --azul: #1F5FAE; position: relative; width: 1280px; height: 800px; display: grid; grid-template-columns: 60px 1fr; grid-template-rows: 56px 1fr; background: #F4F6F9; color: var(--texto); font: 400 13px/1.4 Oxanium, system-ui, sans-serif; }
.t-report .rp * { box-sizing: border-box; }
.t-report svg { width: 16px; height: 16px; flex: none; }
.t-report .rp-av { width: 26px; height: 26px; border-radius: 50%; background: var(--a); color: #fff; display: inline-grid; place-items: center; font-size: 9.5px; font-weight: 700; flex: none; }
.t-report .rp-lado { grid-row: 1 / 3; display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 10px 0 12px; background: #fff; border-right: 1px solid var(--borda); color: #4A5A6E; }
.t-report .rp-logo { width: 36px; height: 36px; border-radius: 9px; background: linear-gradient(160deg, #23476F, #0F2238); color: #fff; display: grid; place-items: center; margin-bottom: 12px; } .t-report .rp-logo svg { width: 19px; height: 19px; }
.t-report .rp-nav { width: 36px; height: 34px; border-radius: 8px; display: grid; place-items: center; } .t-report .rp-nav.on { background: #E6EFFA; color: var(--azul); box-shadow: inset 0 0 0 1px #C6DAF2; } .t-report .rp-nav.fim { margin-top: auto; }
.t-report .rp-eu { margin-top: 8px; width: 32px; height: 32px; border: 1.5px solid #1F3B5C; border-radius: 7px; display: grid; place-items: center; font-weight: 700; font-size: 12px; }
.t-report .rp-topo { display: flex; align-items: center; gap: 12px; padding: 0 18px 0 20px; background: #fff; border-bottom: 1px solid var(--borda); color: #4A5A6E; }
.t-report .rp-marca { display: flex; flex-direction: column; line-height: 1.2; margin-right: auto; } .t-report .rp-marca b { font-weight: 600; font-size: 14px; color: var(--texto); } .t-report .rp-marca em { font-style: normal; color: var(--azul); } .t-report .rp-marca small { font-size: 9.5px; letter-spacing: .14em; text-transform: uppercase; color: var(--suave); }
.t-report .rp-busca { width: 360px; height: 34px; display: flex; align-items: center; gap: 9px; padding: 0 9px 0 12px; border: 1px solid var(--borda); border-radius: 8px; color: #8795A8; font-size: 12.5px; } .t-report .rp-busca kbd { margin-left: auto; font: 500 9.5px 'JetBrains Mono', monospace; border: 1px solid var(--borda); border-radius: 4px; padding: 2px 5px; }
.t-report .rp-sel { display: inline-flex; align-items: center; gap: 6px; height: 34px; padding: 0 11px; border: 1px solid var(--borda); border-radius: 8px; font-size: 12px; color: var(--texto); } .t-report .rp-sel svg { width: 14px; height: 14px; }
.t-report .rp-ib { width: 34px; height: 34px; border: 1px solid var(--borda); border-radius: 8px; display: grid; place-items: center; } .t-report .rp-topo > .rp-av { width: 32px; height: 32px; font-size: 10.5px; }

.t-report .rp-main { position: relative; display: grid; grid-template-columns: 300px 1fr 250px; grid-template-rows: 52px minmax(0, 1fr); gap: 14px; padding: 16px 22px 18px; overflow: hidden; }
.t-report .rp-cab { grid-column: 1 / -1; display: flex; align-items: center; gap: 12px; } .t-report .rp-cab > div { margin-right: auto; }
.t-report .rp-cab small { font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: #B7791F; font-weight: 600; } .t-report h1 { margin: 0; font-size: 22px; font-weight: 600; letter-spacing: -.01em; }
.t-report .rp-seg { display: flex; padding: 3px; border: 1px solid var(--borda); border-radius: 9px; background: #fff; }
.t-report .rp-seg span { display: flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 7px; font-size: 12px; color: var(--suave); } .t-report .rp-seg svg { width: 14px; height: 14px; }
.t-report .rp-seg .s1, .t-report .rp-seg.p .s2, .t-report .rp-seg.c .s3 { background: #E6EFFA; color: var(--azul); font-weight: 600; } .t-report .rp-seg.p .s1, .t-report .rp-seg.c .s2 { background: none; color: var(--suave); font-weight: 400; }
.t-report .rp-bt { display: inline-flex; align-items: center; gap: 7px; height: 34px; padding: 0 14px; border-radius: 8px; font-size: 12.5px; font-weight: 600; } .t-report .rp-bt.sec { background: #fff; border: 1px solid var(--borda); }

.t-report .rp-card { background: #fff; border: 1px solid var(--borda); border-radius: 10px; padding: 13px 14px; min-height: 0; }
.t-report .rp-ct { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; } .t-report .rp-ct div { display: flex; flex-direction: column; line-height: 1.25; } .t-report .rp-ct b { font-weight: 600; font-size: 13.5px; } .t-report .rp-ct small { font-size: 11px; color: var(--suave); }
.t-report .rp-ct .i { width: 30px; height: 30px; border-radius: 8px; background: #FDF3E1; color: #B7791F; display: grid; place-items: center; }
.t-report .rp-esq { display: flex; flex-direction: column; gap: 14px; min-height: 0; }
.t-report .rp-th { display: flex; justify-content: space-between; padding: 0 2px 6px; border-bottom: 1px solid var(--borda); font-size: 9.5px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--suave); }
.t-report .rp-tr { display: flex; align-items: center; justify-content: space-between; height: 33px; border-bottom: 1px solid #EEF2F6; font-size: 12px; }
.t-report .rp-in { width: 98px; height: 25px; display: flex; align-items: center; padding: 0 8px; border: 1px solid var(--borda); border-radius: 6px; font-size: 12px; }
.t-report .rp-in b { font-weight: 600; } .t-report .rp-tr.m5 .rp-in { border-color: #EEA139; }
.t-report .rp-tf { display: flex; align-items: center; justify-content: space-between; margin-top: 10px; }
.t-report .rp-sw { display: flex; align-items: center; gap: 7px; font-size: 11px; color: var(--suave); } .t-report .rp-sw i { width: 26px; height: 15px; border-radius: 99px; background: #1F5FAE; position: relative; } .t-report .rp-sw i::after { content: ''; position: absolute; right: 2px; top: 2px; width: 11px; height: 11px; border-radius: 50%; background: #fff; }
.t-report .rp-salvar { display: inline-flex; align-items: center; height: 30px; padding: 0 13px; border-radius: 7px; background: linear-gradient(90deg, #1F5FAE, #5AA2E0); color: #fff; font-size: 12px; font-weight: 600; }
.t-report .rp-salvar .b { display: none; align-items: center; gap: 5px; } .t-report .rp-salvar svg { width: 14px; height: 14px; } .t-report .rp-salvar.ok { background: #DCFCE7; color: #166534; } .t-report .rp-salvar.ok .a { display: none; } .t-report .rp-salvar.ok .b { display: inline-flex; }
.t-report .rp-cmp { flex: 1; }
.t-report .rp-leg { display: flex; gap: 14px; margin: -2px 0 8px; font-size: 10.5px; color: var(--suave); } .t-report .rp-leg span { display: flex; align-items: center; gap: 5px; } .t-report .rp-leg i { width: 10px; height: 6px; border-radius: 2px; } .t-report .rp-leg .a { background: #CBD5E1; } .t-report .rp-leg .b { background: #1F5FAE; }
.t-report .rp-cr { display: grid; grid-template-columns: 74px 1fr 56px; align-items: center; gap: 8px; height: 25px; font-size: 11px; }
.t-report .rp-bars { position: relative; display: flex; flex-direction: column; gap: 2px; } .t-report .rp-bars i { display: block; height: 5px; border-radius: 3px; } .t-report .rp-bars .a { background: #CBD5E1; } .t-report .rp-bars .b { background: #1F5FAE; transform-origin: 0 50%; } .t-report .rp-bars .b.r { background: #EEA139; }
.t-report .rp-bars u { position: absolute; left: 88%; top: -3px; bottom: -3px; width: 1.5px; background: #13202F; opacity: .45; }
.t-report .rp-cr em { font-style: normal; font-size: 10.5px; font-weight: 600; text-align: right; white-space: nowrap; } .t-report .rp-cr .up, .t-report .rp-dl.up { color: #15803D; } .t-report .rp-cr .dn, .t-report .rp-dl.dn { color: #DC2626; }

.t-report .rp-centro { display: flex; flex-direction: column; padding: 12px 14px 14px; background: #EEF2F6; }
.t-report .rp-mh { display: flex; align-items: baseline; gap: 10px; margin-bottom: 10px; } .t-report .rp-mh > b { font-weight: 600; font-size: 13.5px; } .t-report .rp-mh small { font-size: 11px; color: var(--suave); }
.t-report .rp-placar { margin-left: auto; align-self: center; display: inline-flex; align-items: center; gap: 6px; height: 26px; padding: 0 10px; border-radius: 99px; background: #fff; border: 1px solid var(--borda); font-size: 11.5px; } .t-report .rp-placar svg { width: 14px; height: 14px; color: #B7791F; } .t-report .rp-placar b { font-weight: 700; }
.t-report .rp-mesa { position: relative; flex: 1; display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr); gap: 12px; border-radius: 8px; background-color: #E6EBF1; background-image: radial-gradient(#D3DAE3 1px, transparent 1px); background-size: 14px 14px; padding: 0; }
.t-report .rp-vazio { position: absolute; left: 0; right: 0; top: 46%; margin: 0; text-align: center; font-size: 12px; color: #8795A8; }
.t-report .rp-doc { position: relative; display: flex; flex-direction: column; padding: 9px 10px 8px; background: #fff; border-radius: 6px; box-shadow: 0 1px 2px rgba(15, 30, 50, .08), 0 8px 18px rgba(15, 30, 50, .1); overflow: hidden; }
.t-report .rp-doc::before { content: ''; position: absolute; left: 0; top: 0; right: 0; height: 3px; background: var(--k); }
.t-report .rp-dh { display: flex; align-items: center; gap: 7px; } .t-report .rp-dh .rp-av { width: 22px; height: 22px; font-size: 8px; } .t-report .rp-dh div { display: flex; flex-direction: column; line-height: 1.15; margin-right: auto; min-width: 0; }
.t-report .rp-dh b { font-size: 10.5px; font-weight: 600; white-space: nowrap; } .t-report .rp-dh small { font-size: 9px; color: var(--suave); } .t-report .rp-dh time { font: 500 9px 'JetBrains Mono', monospace; color: var(--suave); }
.t-report .rp-sem { margin: 5px 0 3px; font-size: 8px; letter-spacing: .1em; text-transform: uppercase; color: #B7791F; font-weight: 600; }
.t-report .rp-di { display: grid; grid-template-columns: 1fr auto; gap: 1px 6px; padding: 2px 0 3px; font-size: 9.5px; } .t-report .rp-di > span:first-child { color: #44546A; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } .t-report .rp-di b { font-weight: 600; font-size: 9.5px; white-space: nowrap; }
.t-report .rp-db { grid-column: 1 / -1; height: 3px; border-radius: 2px; background: #EEF2F6; overflow: hidden; } .t-report .rp-db i { display: block; height: 100%; border-radius: inherit; } .t-report .rp-db .ok { background: #16A34A; } .t-report .rp-db .q { background: #EEA139; } .t-report .rp-db .r { background: #DC2626; }
.t-report .rp-doc p { margin: 4px 0 0; font-size: 9px; line-height: 1.3; color: var(--suave); overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.t-report .rp-df { display: flex; align-items: center; justify-content: space-between; margin-top: auto; padding-top: 5px; }
.t-report .rp-st { white-space: nowrap; display: inline-flex; align-items: center; gap: 4px; font-size: 9px; font-weight: 600; padding: 1px 7px 1px 4px; border-radius: 99px; color: #15803D; background: #DCFCE7; } .t-report .rp-st svg, .t-report .rp-dl svg { width: 11px; height: 11px; }
.t-report .fora .rp-st { color: #B91C1C; background: #FEE2E2; } .t-report .rp-doc.fora { box-shadow: 0 0 0 1.5px #F2A7A7, 0 8px 18px rgba(15, 30, 50, .1); }
.t-report .rp-dl { display: inline-flex; align-items: center; gap: 2px; font-size: 9.5px; font-weight: 700; white-space: nowrap; }

.t-report .rp-dir { display: flex; flex-direction: column; }
.t-report .rp-prog { display: flex; align-items: baseline; gap: 6px; } .t-report .rp-prog b { font-size: 26px; font-weight: 600; line-height: 1; } .t-report .rp-prog span { font-size: 12px; color: var(--suave); }
.t-report .rp-pb { height: 6px; margin: 8px 0 10px; border-radius: 99px; background: #EEF2F6; overflow: hidden; } .t-report .rp-pb i { display: block; height: 100%; width: 100%; background: #16A34A; border-radius: inherit; transform-origin: 0 50%; }
.t-report .rp-ent { list-style: none; margin: 0; padding: 0; } .t-report .rp-ent li { display: flex; align-items: center; gap: 8px; height: 37px; border-top: 1px solid #EEF2F6; }
.t-report .rp-ent li div { display: flex; flex-direction: column; line-height: 1.2; margin-right: auto; } .t-report .rp-ent b { font-size: 11.5px; font-weight: 600; } .t-report .rp-ent small { font-size: 10px; color: var(--suave); }
.t-report .rp-ent em { font-style: normal; display: inline-flex; align-items: center; gap: 4px; font-size: 10.5px; } .t-report .rp-ent .w { color: #A3AFBF; } .t-report .rp-ent .k { display: none; color: #15803D; font-weight: 600; font-family: 'JetBrains Mono', monospace; } .t-report .rp-ent svg { width: 13px; height: 13px; }
.t-report .rp-ent li.ok .w { display: none; } .t-report .rp-ent li.ok .k { display: inline-flex; }
.t-report .rp-reu { display: flex; align-items: center; gap: 9px; margin-top: auto; padding: 9px 10px; border-radius: 8px; background: #FDF3E1; color: #8A5A12; } .t-report .rp-reu div { display: flex; flex-direction: column; line-height: 1.25; } .t-report .rp-reu b { font-size: 12px; } .t-report .rp-reu small { font-size: 10.5px; }
`,
  roteiro(f) {
    const tl = f.tl, docs = f.$$('.rp-doc'), meio = f.pos(docs[4]);
    // Na pilha, cada folha sai do seu lugar no grid para o centro da mesa
    const pilha = docs.map((d, i) => { const p = f.pos(d); return { x: meio.x - p.x + jit[i][0], y: meio.y - p.y + jit[i][1], rotation: jit[i][2], scale: 1.3 }; });
    docs.forEach((d, i) => tl.set(d, { ...pilha[i], autoAlpha: 0, transformPerspective: 1100 }, 0));
    tl.set(f.$$('.rp-placar, .rp-tr.m5'), { autoAlpha: 0 }, 0).set(f.$$('.rp-bars .b'), { scaleX: 0 }, 0);

    // 1 · Metas digitadas no modelo do Comercial
    f.passo(1, 'Cada área define os seus números e as metas da semana.', 'depois');
    mira(f, '.rp-ind', 1.85, 1.7, 4.4, { rx: 5, ry: 7 });
    metas.forEach(([, v], i) => {
      const at = 5.3 + i * .55;
      if (i === 4) tl.to(f.$('.rp-tr.m5'), { autoAlpha: 1, duration: .35 }, at - .3).from(f.$('.rp-tr.m5'), { y: -8, duration: .35 }, at - .3);
      f.digitar(`.rp-tr.m${i + 1} b`, v, at, 30);
    });
    f.cursor('.rp-salvar', 7.7, true, .8);
    f.classe('.rp-salvar', 'ok', 8.55);

    // 2 · Segunda, 8h: os relatórios caem na mesa e empilham (câmera de cima, inclinada)
    f.passo(2, 'Segunda, 8h: os nove gestores entregam a semana no mesmo formato.', 9.4);
    f.esconderCursor(9);
    mira(f, '.rp-mesa', 1.45, 1.9, 9.1, { rx: 18, rz: -2 });
    f.camera({ zoom: 1.55, x: -3, y: 4, rx: 15, rz: 1 }, 4.4, 11, 'power1.inOut');
    tl.to(f.$('.rp-vazio'), { autoAlpha: 0, duration: .4 }, 10.2);
    docs.forEach((d, i) => {
      const at = 10.1 + i * .48, p = pilha[i];
      tl.fromTo(d, { x: p.x + jit[i][1] * 3, y: p.y - 70, z: 520, rotation: p.rotation + jit[i][0] * .6, autoAlpha: 0 },
        { x: p.x, y: p.y, z: 0, rotation: p.rotation, autoAlpha: 1, duration: .5, ease: 'power3.in', immediateRender: false }, at);
      f.classe(`.rp-ent li:nth-child(${i + 1})`, 'ok', at + .5);
    });
    const ne = f.$('.rp-ne'), o = { n: 0 };
    tl.fromTo(o, { n: 0 }, { n: 9, duration: 9 * .48, ease: 'none', immediateRender: false, onUpdate: () => { ne.textContent = String(Math.min(9, Math.floor(o.n + .001))); } }, 10.12);
    tl.fromTo(f.$('.rp-pb i'), { scaleX: 0 }, { scaleX: 1, duration: 9 * .48, ease: 'none' }, 10.12);

    // 3 · O leque se abre e a câmera endireita: o painel da diretoria
    f.passo(3, 'A diretoria lê tudo num lugar só: meta contra realizado, área por área.', 15.4);
    tl.to(docs, { x: 0, y: 0, rotation: 0, scale: 1, duration: 1.1, ease: 'power3.inOut', stagger: { each: .05, from: 'end' } }, 15.1);
    mira(f, '.rp-mesa', 1.12, 1.7, 15.1, { rx: 0 });
    tl.set(docs, { transformPerspective: 0, z: 0, force3D: false }, 16.7); // folhas planas de novo: 3D dentro de região com filtro falha no Chrome
    f.classe('.rp-seg', 'p', 15.5);
    f.foco('.rp-centro', 16.7);
    f.entra('.rp-st', 16.6, { stagger: .05, y: 6 });
    tl.to(f.$('.rp-placar'), { autoAlpha: 1, duration: .4 }, 16.7);
    f.contar('.rp-n', 7, 16.8, { dur: 1 });
    mira(f, '.rp-doc.fora', 2.05, 1.5, 17.7, { rx: 4 });
    mira(f, '.rp-mesa', 1.2, 1.5, 19.9);

    // 4 · Comparar com a semana passada
    f.passo(4, 'E a comparação com a semana passada já vem pronta.', 21.4);
    f.cursor('.rp-seg .s3', 20.4);
    f.classe('.rp-seg', 'c', 21.32);
    f.foco(null, 21.4);
    f.entra('.rp-dl', 21.5, { stagger: .06, y: 6 });
    mira(f, '.rp-cmp', 1.75, 1.5, 22.1, { ry: 6 });
    f.esconderCursor(22.2);
    tl.to(f.$$('.rp-bars .b'), { scaleX: 1, duration: .8, ease: 'power3.out', stagger: .09 }, 22.7);
    f.entra('.rp-cr em', 23.1, { stagger: .09, x: -6, y: 0 });
    f.camera({ zoom: 1.02 }, 1.9, 25);
    f.pausa(1.2);
  }
};
export default t;
