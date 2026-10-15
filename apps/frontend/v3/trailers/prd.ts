// PominPRD · "A ideia no corredor". Tela desenhada na família visual Pomin (tema claro, Oxanium, azul).
// Linguagem de câmera: travelling vertical. A câmera acompanha o cursor que escreve o PRD e desce
// junto com o texto, seção por seção; no fim, o documento vira demanda no PominDev.
import { ic, type Trailer } from '../filme';
import { svg } from '../../src/data';
import { app } from '../dados';

const i = {
  ideia: svg('<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V17h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z"/>'),
  lista: svg('<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>'),
  ramo: svg('<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="8" r="2.5"/><path d="M6 8.5v7M18 10.5c0 4-6 3-11.5 5.5"/>'),
  painel: svg('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>'),
  baixo: svg('<path d="m6 9 6 6 6-6"/>'),
  clipe: svg('<path d="m21 11-8.6 8.6a5 5 0 0 1-7-7l8.5-8.6a3.3 3.3 0 0 1 4.7 4.7l-8.6 8.6a1.7 1.7 0 0 1-2.3-2.4l7.9-7.9"/>'),
  coment: svg('<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.8-.9L3 21l1.9-5.7A8.4 8.4 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5z"/>'),
  fila: svg('<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>')
};

// texto digitado sobre um "fantasma" invisível que já ocupa o espaço final (assim nada pula durante a escrita)
let n = 0;
const tx = (s: string, cls = '') => `<p class="pd-t ${cls}" data-t="${++n}"><span class="g">${s}</span><em class="pd-ty pd-ty${n}"></em></p>`;
const secoes: [string, string][] = [
  ['Objetivo', tx('Permitir que o cliente da Rede Bom Preço acompanhe o status do pedido pelo WhatsApp, sem precisar ligar para a loja.')
    + '<p class="pd-meta">Meta: reduzir em <span class="pd-ed"><s>40%</s><ins>30%</ins></span> as ligações de “onde está meu pedido?” em 90 dias.</p>'],
  ['Usuários', `<ul class="pd-ul">${['<b>Cliente final</b> recebe os avisos e consulta o status pelo WhatsApp.', '<b>Atendente da loja</b> vê o histórico de mensagens de cada pedido.', '<b>Gestor de logística</b> acompanha atrasos e o volume de consultas.'].map(x => `<li>${x}</li>`).join('')}</ul>`],
  ['Requisitos funcionais', `<ol class="pd-rf">${['Enviar mensagem automática quando o pedido for confirmado.', 'Avisar cada mudança de status: separado, em rota e entregue.', 'Responder “status” com a etapa atual e a previsão de entrega.', 'Incluir o link de rastreio da transportadora.', 'Permitir que o cliente pare de receber avisos quando quiser.'].map((x, k) => `<li><b>RF-0${k + 1}</b>${tx(x)}</li>`).join('')}
    <li class="pd-novo"><b>RF-06</b><p>Avisar o cliente quando a entrega atrasar, com a nova previsão. <span class="pd-sug">Sugestão aceita</span></p></li></ol>`],
  ['Critérios de aceite', `<ul class="pd-ca">${['A confirmação chega em até 1 minuto depois do pedido.', 'Toda mudança de status gera um aviso, sem exceção.', 'Modelos de mensagem aprovados pela Meta antes do lançamento.', 'O painel mostra mensagens enviadas, lidas e respondidas.'].map(x => `<li>${ic('ok')}${tx(x)}</li>`).join('')}</ul>`],
  ['Fora do escopo', `<ul class="pd-ul fora">${['Pagamento pelo WhatsApp (fica para a fase 2).', 'Atendimento humano dentro do fluxo automático.'].map(x => `<li>${x}</li>`).join('')}</ul>`]
];
const demandas: [string, string, string, string, string, string][] = [
  ['DEV-479', 'Ajuste no cálculo de frete por região', 'App Bom Preço', 'Análise', 'a', 'RN'],
  ['DEV-475', 'Relatório de vendas por loja', 'Portal de lojas', 'Backlog', 'b', 'MC'],
  ['DEV-471', 'Login com CPF no app', 'App Bom Preço', 'Backlog', 'b', 'JM'],
  ['DEV-468', 'Exportar pedidos para o ERP', 'Portal de lojas', 'Backlog', 'b', 'RN'],
  ['DEV-466', 'Cupom de primeira compra', 'App Bom Preço', 'Análise', 'a', 'MC']
];

const t: Trailer = {
  ui: `<div class="pd">
    <aside class="pd-lado"><span class="pd-logo">${app('prd').icon}</span>${[ic('inicio'), ic('pasta'), ic('doc'), i.ramo, ic('pessoas')].map((s, k) => `<span class="${k === 1 ? 'on' : ''}">${s}</span>`).join('')}<b class="pd-eu">CF</b></aside>
    <header class="pd-topo"><span class="pd-tg">${i.painel}</span><div class="pd-trilha"><small>Projetos /</small><b>Acompanhamento de pedidos pelo WhatsApp</b></div>
      <div class="pd-acoes"><span class="pd-st"><i></i><em class="pd-st-txt">Rascunho</em></span><span class="pd-bt pd-dev-bt">${ic('codigo')} Levar ao PominDev</span></div></header>
    <aside class="pd-esq">
      <section class="pd-card pd-ideia"><p class="pd-rot">${i.ideia} NOVA IDEIA</p>
        <p class="pd-frase"><em class="pd-ideia-txt"></em></p>
        <dl class="pd-campos"><div><dt>Solicitante</dt><dd><span class="pd-av" style="--a:#0E9F6E">CF</span>Caio Ferreira · Comercial</dd></div><div><dt>Cliente</dt><dd>Rede Bom Preço</dd></div><div><dt>Prioridade</dt><dd><span class="pd-pri">Alta</span></dd></div><div><dt>Projeto</dt><dd>PRD-031 · 14/10/2026</dd></div></dl>
        <span class="pd-bt pd-gerar">${ic('ia')} <em class="pd-gerar-txt">Gerar PRD</em></span></section>
      <section class="pd-card pd-toc"><p class="pd-rot">${i.lista} ESTRUTURA DO PRD</p>
        ${secoes.map(([s], k) => `<p class="pd-ti ti${k}"><i></i>${k + 1}. ${s}<span class="pd-ti-ok">${ic('ok')}</span></p>`).join('')}</section>
    </aside>
    <main class="pd-centro"><div class="pd-doc">
      <div class="pd-pagina">
        <p class="pd-rot">PRD · DOCUMENTO DE REQUISITOS DO PRODUTO</p>
        <h1>Acompanhamento de pedidos pelo WhatsApp</h1>
        <p class="pd-sub"><span class="pd-ver"><em class="pd-ver-txt">Rascunho vazio</em></span>Rede Bom Preço · Caio Ferreira, Rafael Nogueira</p>
        ${secoes.map(([s, c], k) => `<section class="pd-sec s${k}"><h2><span>${k + 1}</span>${s}</h2>${c}</section>`).join('')}
      </div></div></main>
    <aside class="pd-dir">
      <div class="pd-tabs"><b>${i.coment} Comentários <em class="pd-ncom">0</em></b><span>Histórico</span></div>
      <p class="pd-vazio">Nenhum comentário ainda. Selecione um trecho do documento para comentar.</p>
      <div class="pd-com c1"><span class="pd-av" style="--a:#DB2777">JM</span><div><b>Júlia Mendes <small>15:31</small></b><span class="pd-anc">Objetivo</span><p>Meta de 40% em 90 dias é agressiva. Proponho 30%.</p><em class="pd-feito">${ic('ok')} Ajuste aplicado</em></div></div>
      <div class="pd-com c2"><span class="pd-av" style="--a:#2563EB">RN</span><div><b>Rafael Nogueira <small>15:33</small></b><span class="pd-anc">Requisitos funcionais</span><p>Faltou avisar o cliente quando a entrega atrasar.</p><em class="pd-feito">${ic('ok')} Virou o RF-06</em></div></div>
      <div class="pd-hist"><p class="pd-rot">HISTÓRICO</p><p class="h1"><i></i>v1 gerado pela IA · 15:22</p><p class="h2"><i></i>v1.1 · 2 ajustes de Júlia e Rafael · 15:34</p></div>
    </aside>
    <div class="pd-devtela">
      <aside class="pd-lado"><span class="pd-logo dv">${app('dev').icon}</span>${[ic('grafico'), ic('quadro'), i.fila, ic('codigo'), ic('pasta')].map((s, k) => `<span class="${k === 2 ? 'on' : ''}">${s}</span>`).join('')}<b class="pd-eu">CF</b></aside>
      <header class="pd-topo"><span class="pd-tg">${i.painel}</span><div class="pd-trilha"><b>Demandas</b></div><div class="pd-busca">${ic('busca')}Buscar páginas ou ações…<kbd>⌘K</kbd></div></header>
      <main class="dv-corpo">
        <div class="dv-cab">${i.fila}<div><b>Fila de demandas</b><p>Tudo que está no backlog aparece aqui. Pegue uma demanda para analisá-la: ela vai para a sua Esteira, na coluna Análise.</p></div></div>
        <div class="dv-filtros"><span>${ic('busca')} Buscar por título, DEV-, SAC ou solicitante</span><span>Todos os sistemas ${i.baixo}</span><small><b class="dv-qtd">5</b> demandas</small></div>
        <div class="dv-lista">
          <div class="dv-lin dv-nova"><em>DEV-482</em><div><b>Acompanhamento de pedidos pelo WhatsApp</b><p><span class="dv-prd">${ic('doc')} PRD v1.1 anexado</span><span>6 requisitos · 4 critérios de aceite</span><span>Origem: PominPRD · PRD-031</span></p></div><span class="dv-sis">App Bom Preço</span><span class="dv-pri">Alta</span><span class="dv-etapa n"><em class="dv-etapa-txt">Novo</em></span><span class="pd-av" style="--a:#0E9F6E">CF</span></div>
          ${demandas.map(([id, ti, si, et, c, av]) => `<div class="dv-lin"><em>${id}</em><div><b>${ti}</b><p><span>${si === 'App Bom Preço' ? 'Melhoria' : 'Nova funcionalidade'}</span></p></div><span class="dv-sis">${si}</span><span class="dv-pri m">Média</span><span class="dv-etapa ${c}">${et}</span><span class="pd-av" style="--a:#64748B">${av}</span></div>`).join('')}
        </div>
      </main>
    </div>
  </div>`,
  css: `
.t-prd .pd { position: relative; width: 1280px; height: 800px; overflow: hidden; background: #F4F7FB; color: #0F1B2D; font: 400 13px/1.45 Oxanium, sans-serif; }
.t-prd .pd svg { width: 16px; height: 16px; flex: none; }
.t-prd .pd-lado { position: absolute; left: 0; top: 0; bottom: 0; width: 56px; display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 12px 0; background: #fff; border-right: 1px solid #E3E9F1; color: #64748B; z-index: 3; }
.t-prd .pd-logo { width: 34px; height: 34px; border-radius: 9px; background: linear-gradient(160deg, #6CB5EC, #2C7CC4); color: #fff !important; display: grid; place-items: center; margin-bottom: 12px; }
.t-prd .pd-logo.dv { background: linear-gradient(160deg, #6F8EF5, #3B5BD9); } .t-prd .pd-logo svg { width: 19px; height: 19px; }
.t-prd .pd-lado > span { width: 34px; height: 34px; border-radius: 8px; display: grid; place-items: center; } .t-prd .pd-lado > span.on { background: #E5F0FB; color: #1F6FB5; box-shadow: inset 0 0 0 1px #C8DDF2; }
.t-prd .pd-eu { margin-top: auto; width: 30px; height: 30px; border: 1.5px solid #1F6FB5; border-radius: 7px; display: grid; place-items: center; font-size: 10px; color: #1F6FB5; }
.t-prd .pd-topo { position: absolute; left: 56px; right: 0; top: 0; height: 56px; display: flex; align-items: center; gap: 14px; padding: 0 18px; background: #fff; border-bottom: 1px solid #E3E9F1; z-index: 3; }
.t-prd .pd-tg { display: grid; color: #64748B; }
.t-prd .pd-trilha small { color: #7A889C; font-size: 12.5px; margin-right: 6px; } .t-prd .pd-trilha b { font-weight: 600; font-size: 13.5px; }
.t-prd .pd-acoes { margin-left: auto; display: flex; align-items: center; gap: 12px; }
.t-prd .pd-st { display: inline-flex; align-items: center; gap: 6px; font-size: 11.5px; color: #64748B; border: 1px solid #DCE3EC; border-radius: 99px; padding: 3px 11px; } .t-prd .pd-st i { width: 7px; height: 7px; border-radius: 50%; background: #94A3B8; }
.t-prd .pd-st em { font-style: normal; } .t-prd .pd-st.rev i { background: #F59E0B; } .t-prd .pd-st.ok { color: #15803D; border-color: #B9E7C9; background: #EFFAF3; } .t-prd .pd-st.ok i { background: #16A34A; }
.t-prd .pd-bt { display: inline-flex; align-items: center; gap: 7px; height: 36px; padding: 0 16px; border-radius: 7px; background: #1F6FB5; color: #fff; font-weight: 600; font-size: 12.5px; white-space: nowrap; }
.t-prd .pd-bt em { font-style: normal; } .t-prd .pd-bt svg { width: 15px; height: 15px; }
.t-prd .pd-esq { position: absolute; left: 72px; top: 72px; width: 280px; bottom: 16px; display: flex; flex-direction: column; gap: 14px; }
.t-prd .pd-card { background: #fff; border: 1px solid #E3E9F1; border-radius: 10px; padding: 14px 16px; }
.t-prd .pd-rot { display: flex; align-items: center; gap: 6px; margin: 0; font-size: 10px; letter-spacing: .12em; color: #64748B; font-weight: 600; } .t-prd .pd-rot svg { width: 13px; height: 13px; color: #1F6FB5; }
.t-prd .pd-frase { margin: 10px 0 12px; min-height: 66px; font-size: 16px; line-height: 1.38; font-weight: 600; color: #0F1B2D; } .t-prd .pd-frase em { font-style: normal; }
.t-prd .pd-frase.cur em::after, .t-prd .pd-ty.cur::after { content: ''; display: inline-block; width: 2px; height: 1.05em; margin-left: 1px; vertical-align: -2px; background: #1F6FB5; }
.t-prd .pd-frase.cur.feito em::after, .t-prd .pd-ty.cur.feito::after { display: none; }
.t-prd .pd-campos { margin: 0 0 14px; display: grid; gap: 7px; } .t-prd .pd-campos div { display: grid; grid-template-columns: 78px 1fr; align-items: center; font-size: 12px; }
.t-prd .pd-campos dt { color: #7A889C; font-size: 11px; } .t-prd .pd-campos dd { margin: 0; display: flex; align-items: center; gap: 6px; }
.t-prd .pd-pri { color: #B91C1C; background: #FDECEC; border-radius: 99px; padding: 0 9px; font-size: 11px; font-weight: 600; }
.t-prd .pd-gerar { width: 100%; justify-content: center; } .t-prd .pd-gerar.vai { background: #2C7CC4; }
.t-prd .pd-av { width: 24px; height: 24px; border-radius: 50%; background: var(--a); color: #fff; display: inline-grid; place-items: center; font-size: 9.5px; font-weight: 700; flex: none; }
.t-prd .pd-toc { flex: 1; }
.t-prd .pd-ti { display: flex; align-items: center; gap: 9px; margin: 10px 0 0; font-size: 12.5px; color: #94A3B8; }
.t-prd .pd-ti i { width: 8px; height: 8px; border-radius: 50%; border: 1.5px solid #CBD5E1; }
.t-prd .pd-ti-ok { margin-left: auto; color: #16A34A; opacity: 0; } .t-prd .pd-ti-ok svg { width: 14px; height: 14px; }
.t-prd .pd-ti.on { color: #0F1B2D; font-weight: 600; } .t-prd .pd-ti.on i { border-color: #1F6FB5; background: #1F6FB5; box-shadow: 0 0 0 3px #DCEBFA; }
.t-prd .pd-ti.ok { color: #334155; font-weight: 400; } .t-prd .pd-ti.ok i { border-color: #16A34A; background: #16A34A; box-shadow: none; } .t-prd .pd-ti.ok .pd-ti-ok { opacity: 1; }
.t-prd .pd-centro { position: absolute; left: 368px; top: 72px; width: 560px; bottom: 0; overflow: hidden; }
.t-prd .pd-doc { position: relative; }
.t-prd .pd-pagina { background: #fff; border: 1px solid #E3E9F1; border-radius: 10px 10px 0 0; padding: 26px 34px 40px; box-shadow: 0 20px 40px -24px rgba(15,27,45,.25); }
.t-prd .pd h1 { margin: 6px 0 6px; font-size: 21px; line-height: 1.25; font-weight: 600; letter-spacing: -.01em; }
.t-prd .pd-sub { display: flex; align-items: center; gap: 10px; margin: 0 0 6px; color: #64748B; font-size: 11.5px; padding-bottom: 14px; border-bottom: 1px solid #EEF2F7; }
.t-prd .pd-ver { font-size: 10.5px; font-weight: 600; color: #1F6FB5; background: #E5F0FB; border-radius: 99px; padding: 1px 9px; } .t-prd .pd-ver em { font-style: normal; }
.t-prd .pd-sec { position: relative; padding: 14px 0 4px; }
.t-prd .pd-sec::before { content: ''; position: absolute; left: -34px; top: 14px; bottom: 4px; width: 3px; border-radius: 0 3px 3px 0; background: #1F6FB5; opacity: 0; transition: opacity .3s; }
.t-prd .pd-sec.on::before { opacity: 1; } .t-prd .pd-sec.ok::before { opacity: 0; }
.t-prd .pd h2 { display: flex; align-items: center; gap: 9px; margin: 0 0 8px; font-size: 14.5px; font-weight: 600; }
.t-prd .pd h2 span { width: 21px; height: 21px; border-radius: 6px; background: #EEF4FB; color: #1F6FB5; display: grid; place-items: center; font-size: 11px; }
.t-prd .pd-t { position: relative; margin: 0; font-size: 12.5px; line-height: 1.6; color: #334155; }
.t-prd .pd-t .g { visibility: hidden; } .t-prd .pd-t em { position: absolute; inset: 0; font-style: normal; }
.t-prd .pd-meta { margin: 6px 0 0; font-size: 12.5px; line-height: 1.6; color: #334155; padding: 2px 6px; margin-left: -6px; border-radius: 5px; transition: background .3s; }
.t-prd .pd-meta.marca { background: #FFF4C7; }
.t-prd .pd-ed ins { display: none; text-decoration: none; } .t-prd .pd-ed.on s { color: #B91C1C; background: #FDECEC; } .t-prd .pd-ed.on ins { display: inline; margin-left: 4px; color: #15803D; background: #E3F7EA; font-weight: 600; padding: 0 3px; border-radius: 3px; }
.t-prd .pd-ed s { text-decoration: none; } .t-prd .pd-ed.on s { text-decoration: line-through; }
.t-prd .pd-ul { margin: 0; padding-left: 18px; font-size: 12.5px; line-height: 1.6; color: #334155; } .t-prd .pd-ul li { margin-bottom: 3px; } .t-prd .pd-ul b { font-weight: 600; color: #0F1B2D; }
.t-prd .pd-ul.fora li::marker { content: '×  '; color: #94A3B8; }
.t-prd .pd-rf { list-style: none; margin: 0; padding: 0; } .t-prd .pd-rf li { display: grid; grid-template-columns: 52px 1fr; align-items: start; padding: 4px 0; border-top: 1px dashed #E8EDF3; }
.t-prd .pd-rf li:first-child { border-top: 0; }
.t-prd .pd-rf b { font: 600 10.5px/2.05 'JetBrains Mono', monospace; color: #1F6FB5; } .t-prd .pd-rf p { margin: 0; font-size: 12.5px; line-height: 1.6; color: #334155; }
.t-prd .pd-novo { height: 0; overflow: hidden; opacity: 0; padding: 0 !important; } .t-prd .pd-novo p { color: #14532D !important; }
.t-prd .pd-novo.ve { background: #EAF8EF; border-radius: 6px; margin: 2px -8px 0; padding: 4px 8px !important; border-top: 0 !important; }
.t-prd .pd-sug { font-size: 10px; font-weight: 600; color: #15803D; border: 1px solid #B9E7C9; border-radius: 99px; padding: 0 7px; margin-left: 4px; white-space: nowrap; }
.t-prd .pd-ca { list-style: none; margin: 0; padding: 0; } .t-prd .pd-ca li { display: grid; grid-template-columns: 22px 1fr; align-items: start; padding: 2px 0; }
.t-prd .pd-ca svg { width: 14px; height: 14px; margin-top: 4px; color: #16A34A; }
.t-prd .pd-sec.s2.marca { background: linear-gradient(90deg, #EAF3FC, transparent 85%); margin: 0 -34px; padding-left: 34px; padding-right: 34px; }
.t-prd .pd-dir { position: absolute; left: 944px; top: 72px; right: 16px; bottom: 16px; background: #fff; border: 1px solid #E3E9F1; border-radius: 10px; padding: 14px 16px; }
.t-prd .pd-tabs { display: flex; gap: 16px; align-items: center; padding-bottom: 10px; border-bottom: 1px solid #EEF2F7; font-size: 12.5px; color: #7A889C; }
.t-prd .pd-tabs b { display: inline-flex; align-items: center; gap: 6px; color: #0F1B2D; font-weight: 600; } .t-prd .pd-tabs b em { font-style: normal; font-size: 10.5px; background: #EEF4FB; color: #1F6FB5; border-radius: 99px; padding: 0 7px; }
.t-prd .pd-vazio { margin: 18px 4px; color: #94A3B8; font-size: 12px; text-align: center; }
.t-prd .pd-com { position: absolute; left: 16px; right: 16px; display: flex; gap: 10px; padding: 12px; border: 1px solid #E3E9F1; border-radius: 10px; background: #fff; box-shadow: 0 10px 24px -16px rgba(15,27,45,.35); }
.t-prd .pd-com.c1 { top: 58px; } .t-prd .pd-com.c2 { top: 196px; }
.t-prd .pd-com b { display: block; font-size: 12.5px; font-weight: 600; } .t-prd .pd-com b small { font-weight: 400; color: #94A3B8; margin-left: 4px; }
.t-prd .pd-anc { display: inline-block; margin: 3px 0 4px; font-size: 10.5px; color: #1F6FB5; background: #EEF4FB; border-radius: 4px; padding: 0 6px; }
.t-prd .pd-com p { margin: 0 0 6px; font-size: 12px; line-height: 1.45; color: #334155; }
.t-prd .pd-feito { display: inline-flex; align-items: center; gap: 4px; font-style: normal; font-size: 11px; color: #15803D; } .t-prd .pd-feito svg { width: 13px; height: 13px; }
.t-prd .pd-hist { position: absolute; left: 16px; right: 16px; bottom: 16px; padding-top: 12px; border-top: 1px solid #EEF2F7; }
.t-prd .pd-hist p:not(.pd-rot) { display: flex; align-items: center; gap: 8px; margin: 8px 0 0; font-size: 11.5px; color: #475569; } .t-prd .pd-hist i { width: 7px; height: 7px; border-radius: 50%; background: #1F6FB5; }
.t-prd .pd-devtela { position: absolute; inset: 0; z-index: 8; background: #F6F8FB; }
.t-prd .pd-busca { margin: 0 auto; width: 380px; height: 34px; border: 1px solid #E1E7EF; border-radius: 8px; display: flex; align-items: center; gap: 9px; padding: 0 10px; color: #7A889C; font-size: 12px; }
.t-prd .pd-busca kbd { margin-left: auto; font: 500 9.5px 'JetBrains Mono', monospace; border: 1px solid #DCE3EC; border-radius: 4px; padding: 1px 5px; } .t-prd .pd-busca svg { width: 14px; height: 14px; }
.t-prd .dv-corpo { position: absolute; left: 56px; top: 56px; right: 0; bottom: 0; padding: 26px 90px; }
.t-prd .dv-cab { display: flex; gap: 12px; align-items: flex-start; background: #fff; border: 1px solid #E3E9F1; border-radius: 10px; padding: 14px 16px; }
.t-prd .dv-cab > svg { width: 34px; height: 34px; padding: 8px; border-radius: 8px; background: #EEF2FD; color: #3B5BD9; } .t-prd .dv-cab b { font-weight: 600; font-size: 14px; } .t-prd .dv-cab p { margin: 2px 0 0; color: #64748B; font-size: 12px; }
.t-prd .dv-filtros { display: flex; gap: 10px; align-items: center; margin: 16px 0 12px; font-size: 12px; color: #7A889C; }
.t-prd .dv-filtros span { display: inline-flex; align-items: center; gap: 8px; height: 34px; padding: 0 12px; background: #fff; border: 1px solid #E1E7EF; border-radius: 8px; } .t-prd .dv-filtros span:first-child { width: 340px; } .t-prd .dv-filtros svg { width: 14px; height: 14px; }
.t-prd .dv-filtros small b { color: #0F1B2D; }
.t-prd .dv-lista { background: #fff; border: 1px solid #E3E9F1; border-radius: 10px; overflow: hidden; }
.t-prd .dv-lin { display: grid; grid-template-columns: 74px 1fr 120px 64px 90px 28px; gap: 12px; align-items: center; padding: 14px 18px; border-top: 1px solid #EEF2F7; font-size: 12.5px; }
.t-prd .dv-lin:first-child { border-top: 0; }
.t-prd .dv-lin > em { font: 600 11px 'JetBrains Mono', monospace; font-style: normal; color: #3B5BD9; }
.t-prd .dv-lin b { font-weight: 600; } .t-prd .dv-lin p { display: flex; flex-wrap: wrap; gap: 6px 12px; margin: 3px 0 0; font-size: 11px; color: #7A889C; }
.t-prd .dv-prd { display: inline-flex; align-items: center; gap: 4px; color: #1F6FB5; font-weight: 600; } .t-prd .dv-prd svg { width: 13px; height: 13px; }
.t-prd .dv-sis { font-size: 11.5px; color: #475569; }
.t-prd .dv-pri { font-size: 10.5px; font-weight: 600; color: #B91C1C; background: #FDECEC; border-radius: 99px; padding: 1px 0; text-align: center; } .t-prd .dv-pri.m { color: #B45309; background: #FEF3E2; }
.t-prd .dv-etapa { font-size: 10.5px; font-weight: 600; border-radius: 99px; padding: 2px 0; text-align: center; color: #475569; background: #EEF2F7; } .t-prd .dv-etapa.a { color: #3B5BD9; background: #EEF2FD; }
.t-prd .dv-etapa em { font-style: normal; } .t-prd .dv-etapa.n { color: #fff; background: #3B5BD9; }
.t-prd .dv-nova { background: #F3F7FF; box-shadow: inset 3px 0 0 #3B5BD9; }
`,
  roteiro(f) {
    const tl = f.tl, W = 1280, H = 800;
    const mira = (x: number, y: number, zoom: number, ang: { rx?: number; ry?: number; rz?: number } = {}) => {
      const hw = 846 / zoom, hh = 476 / zoom;
      const cx = hw * 2 >= W ? W / 2 : Math.min(Math.max(x, hw), W - hw), cy = hh * 2 >= H ? H / 2 : Math.min(Math.max(y, hh), H - hh);
      return { ...ang, x: -(cx - W / 2) / W * 100 * zoom, y: -(cy - H / 2) / H * 100 * zoom, zoom };
    };
    const d = (s: number) => `depois+=${s}`;
    const doc = f.$('.pd-doc'), ZD = 1.75, CX = 648;
    const VIS = 800 - 72, alto = f.$('.pd-pagina').offsetHeight, maxRol = Math.max(0, alto - VIS + 30);
    // rolagem do documento + câmera: a linha que está sendo escrita fica sempre no quadro
    let rol = 0;
    const seguir = (sel: string, at: number, dur = 1) => {
      const p = f.pos(sel), alvo = Math.max(-maxRol, Math.min(0, 300 - p.y));
      if (alvo !== rol) { tl.to(doc, { y: alvo, duration: dur, ease: 'power2.inOut' }, d(at)); rol = alvo; }
      f.camera(mira(CX, p.y + rol + 70, ZD, { rx: 3 }), dur + .2, d(at), 'power2.inOut');
    };
    const escrever = (sel: string, at: number, cps = 110) => {
      const el = f.$(sel), txt = el.parentElement!.querySelector('.g')!.textContent!, fim = at + txt.length / cps;
      f.classe(sel, 'cur', d(at)).digitar(sel, txt, d(at), cps).classe(sel, 'feito', d(fim + .05));
      return fim;
    };
    // vários textos ao longo do tempo no mesmo elemento (f.texto guarda um só "antes", e duas regras no mesmo elemento brigam)
    const textos = (sel: string, passos: [number, string][]) => {
      const el = f.$(sel), antes = el.textContent ?? '', ts = passos.map(([s, v]) => [f.quando(d(s)), v] as const);
      f.regras.push(() => { const v = ts.filter(([t]) => tl.time() >= t).pop()?.[1] ?? antes; if (el.textContent !== v) el.textContent = v; });
    };

    // estados iniciais
    tl.set(doc, { y: 0 }, 0).set(f.$('.pd-devtela'), { xPercent: 100 }, 0);
    tl.set(f.$$('.pd-sec h2, .pd-meta, .pd-ul li, .pd-rf li:not(.pd-novo), .pd-ca li, .pd-com, .pd-hist .h1, .pd-hist .h2'), { autoAlpha: 0 }, 0);

    // 1 · Registre a ideia: a frase do corredor vira projeto
    f.passo(1, 'A ideia sai do corredor e vira projeto, com dono e prioridade.', 'depois');
    f.camera(mira(330, 250, 1.9), 1.8, d(.1));
    f.classe('.pd-frase', 'cur', d(.5)).digitar('.pd-ideia-txt', 'Quero que o cliente acompanhe o pedido pelo WhatsApp.', d(.6), 30).classe('.pd-frase', 'feito', d(2.5));
    f.entra('.pd-campos div', d(2.1), { x: -8, y: 0, stagger: .1 });
    f.cursor('.pd-gerar', d(2.6), true, .8);
    f.classe('.pd-gerar', 'vai', d(3.4));
    f.esconderCursor(d(3.7));

    // 2 · Gere o PRD: as seções se escrevem e a câmera desce junto com o texto
    f.passo(2, 'O PRD se escreve sozinho, seção por seção.', d(4.1));
    let at = 4.6;
    const secoesEl = f.$$('.pd-sec');
    secoesEl.forEach((s, k) => {
      const sel = `.pd-sec.s${k}`;
      seguir(`${sel} h2`, at - .3, k === 0 ? .8 : .9);
      f.classe(sel, 'on', d(at)).classe(`.ti${k}`, 'on', d(at));
      tl.fromTo(f.$(`${sel} h2`), { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: .3, immediateRender: false }, d(at));
      let t2 = at + .3;
      if (k === 0) { t2 = escrever(`${sel} .pd-ty`, t2, 95); tl.fromTo(f.$('.pd-meta'), { autoAlpha: 0 }, { autoAlpha: 1, duration: .3, immediateRender: false }, d(t2 + .05)); t2 += .45; }
      if (k === 1 || k === 4) { tl.fromTo(f.$$(`${sel} li`), { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: .3, stagger: .22, immediateRender: false }, d(t2)); t2 += s.querySelectorAll('li').length * .22 + .3; }
      if (k === 2 || k === 3) {
        f.$$(`${sel} .pd-ty`).forEach((el, j) => {
          if (j === 2 && k === 2) seguir(`${sel} li:nth-child(3)`, t2, .9);
          tl.fromTo(el.closest('li')!, { autoAlpha: 0 }, { autoAlpha: 1, duration: .2, immediateRender: false }, d(t2));
          t2 = escrever(`.pd-ty${el.parentElement!.dataset.t}`, t2 + .05, 150) + .06;
        });
      }
      f.classe(sel, 'ok', d(t2)).classe(`.ti${k}`, 'ok', d(t2));
      at = t2 + .15;
    });
    f.classe('.pd-st', 'rev', d(at));
    textos('.pd-gerar-txt', [[3.4, 'Gerando PRD…'], [at, 'PRD gerado']]);

    // 3 · Revise o documento: comentários, uma meta ajustada, um requisito novo
    const r = at + .4;
    f.passo(3, 'O time revisa no próprio documento. Cada ajuste fica registrado.', d(r));
    tl.to(doc, { y: -60, duration: 1.2, ease: 'power2.inOut' }, d(r));
    f.camera(mira(940, 330, 1.45), 1.4, d(r));
    tl.to(f.$('.pd-vazio'), { autoAlpha: 0, duration: .3 }, d(r + .3));
    tl.fromTo(f.$('.pd-com.c1'), { autoAlpha: 0, x: 24 }, { autoAlpha: 1, x: 0, duration: .5, ease: 'power2.out', immediateRender: false }, d(r + .5));
    f.contar('.pd-ncom', 1, d(r + .5), { dur: .1 });
    f.classe('.pd-meta', 'marca', d(r + 1)).classe('.pd-ed', 'on', d(r + 1.6));
    tl.fromTo(f.$('.pd-com.c2'), { autoAlpha: 0, x: 24 }, { autoAlpha: 1, x: 0, duration: .5, ease: 'power2.out', immediateRender: false }, d(r + 2.2));
    f.contar('.pd-ncom', 2, d(r + 2.2), { de: 1, dur: .1 });
    f.classe('.pd-sec.s2', 'marca', d(r + 2.6)).classe('.pd-novo', 've', d(r + 2.9));
    tl.fromTo(f.$('.pd-novo'), { height: 0, autoAlpha: 0 }, { height: 'auto', autoAlpha: 1, duration: .6, ease: 'power2.out', immediateRender: false }, d(r + 2.9));
    tl.fromTo(f.$('.pd-hist .h2'), { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: .4, immediateRender: false }, d(r + 3.6));
    textos('.pd-ver-txt', [[3.4, 'v1 · gerando…'], [at, 'v1 · gerado pela IA'], [r + 3.6, 'v1.1 · revisado']]);
    textos('.pd-st-txt', [[at, 'Em revisão'], [r + 3.8, 'Pronto para desenvolver']]);
    tl.fromTo(f.$('.pd-hist .h1'), { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: .4, immediateRender: false }, d(at));
    f.classe('.pd-st', 'ok', d(r + 3.8));

    // 4 · Leve ao PominDev: um clique e o PRD vira demanda na fila do desenvolvimento
    const q = r + 5;
    f.passo(4, 'Revisado, ele vai para o PominDev como demanda. Sem copiar e colar.', d(q));
    f.camera(mira(1000, 0, 1.4), 1.2, d(q));
    f.cursor('.pd-dev-bt', d(q + .3), true, .8);
    tl.to(f.$('.pd-pagina'), { scale: .2, x: 300, y: -220, autoAlpha: 0, transformOrigin: '50% 0', duration: .8, ease: 'power3.in' }, d(q + 1.2));
    f.esconderCursor(d(q + 1.2));
    f.geral(1.2, d(q + 1.6));
    tl.to(f.$('.pd-devtela'), { xPercent: 0, duration: 1.1, ease: 'power3.inOut' }, d(q + 1.6));
    tl.fromTo(f.$('.dv-nova'), { autoAlpha: 0, y: -16 }, { autoAlpha: 1, y: 0, duration: .5, ease: 'power2.out', immediateRender: false }, d(q + 2.7));
    f.contar('.dv-qtd', 6, d(q + 2.7), { de: 5, dur: .1 });
    const nv = f.pos('.dv-nova');
    f.camera(mira(nv.x + nv.w / 2, nv.y + 90, 1.5, { rx: 4 }), 1.5, d(q + 3));
    f.pausa(1.6);
  }
};
export default t;
