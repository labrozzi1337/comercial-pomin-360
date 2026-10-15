// PominAI · "A IA que não conhece a empresa". Editor de agente recriado do PominAI real (tema claro, Orquestrador).
// Linguagem de câmera: a conversa fica sempre em primeiro plano; os documentos esperam atrás, desfocados,
// e entram em foco no instante em que são citados. No fim, o mesmo assistente atende dentro do PominSAC.
import { ic, type Trailer } from '../filme';
import { svg } from '../../src/data';
import { app } from '../dados';

const i = {
  bot: svg('<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4M9.5 13.5v1M14.5 13.5v1M2 13v3M22 13v3"/>'),
  cpu: svg('<rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>'),
  lapis: svg('<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>'),
  plug: svg('<path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0zM12 18v4"/>'),
  mapa: svg('<rect x="9" y="2" width="6" height="5" rx="1"/><rect x="2" y="16" width="6" height="5" rx="1"/><rect x="16" y="16" width="6" height="5" rx="1"/><path d="M12 7v4M5 16v-2a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v2"/>'),
  painel: svg('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>'),
  boia: svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="m5.6 5.6 3.6 3.6M14.8 14.8l3.6 3.6M14.8 9.2l3.6-3.6M5.6 18.4l3.6-3.6"/>'),
  lua: svg('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>'),
  grade: svg('<circle cx="5" cy="5" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="19" cy="5" r="1"/><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="19" r="1"/><circle cx="12" cy="19" r="1"/><circle cx="19" cy="19" r="1"/>'),
  baixo: svg('<path d="m6 9 6 6 6-6"/>'),
  subir: svg('<path d="M12 15V4M7 9l5-5 5 5"/><path d="M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4"/>'),
  fechar: svg('<path d="M18 6 6 18M6 6l12 12"/>'),
  ticket: svg('<path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z"/>')
};

const docs: [string, number][] = [['Política de férias 2026.pdf', 24], ['Manual do colaborador.pdf', 61], ['Benefícios 2026.pdf', 18], ['Código de conduta.pdf', 28]];
const grupos: [string, string, boolean][] = [['Pessoal / RH', '14 pessoas', true], ['Diretoria', '6 pessoas', true], ['Operacional', '186 pessoas', false], ['Comercial', '42 pessoas', false], ['Terceirizados', '61 pessoas', false]];
const chip = (pag: string) => `<span class="ai-fonte"><i>PDF</i>Política de férias 2026.pdf <b>· pág. ${pag}</b></span>`;

const t: Trailer = {
  ui: `<div class="ai">
    <aside class="ai-lado"><span class="ai-logo">${app('ai').icon}</span>
      ${[ic('inicio'), i.bot, i.cpu, i.lapis].map((s, k) => `<span class="${k === 1 ? 'on' : ''}">${s}</span>`).join('')}<hr />${[i.plug, i.mapa].map(s => `<span>${s}</span>`).join('')}<b class="ai-eu">MC</b></aside>
    <header class="ai-topo"><span class="ai-tg">${i.painel}</span><div class="ai-busca">${ic('busca')}<span>Buscar páginas, agentes ou ações…</span><kbd>Ctrl Q</kbd></div>
      <div class="ai-acoes"><span class="sino">${ic('sino')}</span><span>${ic('ia')}</span><span>${i.boia}</span><span>${ic('conversa')}</span><span>${i.lua}</span><em>${i.grade}</em></div></header>
    <main class="ai-pn">
      <div class="ai-cab" data-r>
        <div><span class="ai-chip">${ic('ia')} ORQUESTRADOR</span><h1><span class="ai-tit">Novo agente</span><span class="ai-st">Draft</span><span class="ai-st ok">Trained</span></h1><p>Agentes › Pessoal / RH · Construtora Aurora · rascunho salvo às 14:01</p></div>
        <div class="ai-cab-bt"><span class="ai-bt sec">Cancelar</span><span class="ai-bt ai-pub">${ic('ok')} Publicar agente</span></div>
      </div>
      <div class="ai-grade">
        <div class="ai-col">
          <section class="ai-card ai-ident" data-r>
            <h3>Identidade <small>Como o agente se apresenta e se comporta</small></h3>
            <label><span>Nome</span><span class="ai-in"><em class="ai-nome"></em></span></label>
            <div class="ai-2"><label><span>Modelo</span><span class="ai-in sel">GPT-4o ${i.baixo}</span></label><label><span>Área</span><span class="ai-in sel"><b class="ai-tag">Pessoal / RH</b>${i.baixo}</span></label></div>
            <label><span>Papel</span><span class="ai-in"><em class="ai-papel"></em></span></label>
            <label><span>Instruções</span><span class="ai-in ai-ta"><em class="ai-instr"></em></span></label>
          </section>
          <section class="ai-card ai-acesso" data-r>
            <h3>Quem pode usar <small class="ai-qtd"><b class="ai-pess">20</b> pessoas liberadas</small></h3>
            ${grupos.map(([n, q, on], k) => `<div class="ai-gr g${k}"><span class="ai-sw${on ? ' on' : ''}"><i></i></span><b>${n}</b><span>${q}</span></div>`).join('')}
          </section>
        </div>
        <section class="ai-card ai-kb" data-r>
          <h3>Base de conhecimento <small class="ai-kbq"><b class="ai-narq">0</b> arquivos · <b class="ai-npag">0</b> págs</small></h3>
          <p class="ai-kbsub">O agente só responde com o que está aqui.</p>
          <div class="ai-drop">${i.subir}<span>Arraste PDFs, DOCX ou planilhas<small>ou procure no computador</small></span></div>
          <div class="ai-docs">${docs.map(([n, p], k) => `<div class="ai-doc d${k}"><div class="ai-th"><i>PDF</i></div><b>${n}</b><span class="ai-dst"><span class="ai-prog"><i></i></span><em>${ic('ok')} Indexado · ${p} págs</em></span></div>`).join('')}</div>
        </section>
        <div class="ai-pagina" data-r>
          <div class="ai-pg-cab"><i>PDF</i><b>Política de férias 2026.pdf</b><em>pág. 7 de 24</em></div>
          <div class="ai-pg"><small>CONSTRUTORA AURORA · RH · REV. 03/2026</small>
            <h4>4. Abono pecuniário</h4>
            <p>4.1 A conversão de parte das férias em dinheiro é opcional e depende de pedido do colaborador.</p>
            <p><mark class="m1">4.2 O colaborador pode converter até 1/3 do período de férias, o equivalente a 10 dias, em abono pecuniário.</mark></p>
            <p><mark class="m2">4.3 O pedido deve ser feito até 15 dias antes do término do período aquisitivo, por solicitação no PominSAC.</mark></p>
            <p>4.4 O valor do abono é pago junto com a remuneração das férias, até 2 dias antes do início do descanso.</p>
            <h4 class="h5">5. Férias coletivas</h4><div class="ai-linhas"></div><p class="ai-rod">Política de férias 2026 · 7</p></div>
        </div>
        <section class="ai-card ai-chat" data-r>
          <div class="ai-ch-cab"><span class="ai-av">${i.bot}</span><div><b class="ai-ch-nome">Novo agente</b><small>GPT-4o · Pré-visualização</small></div><span class="ai-teste">Teste</span></div>
          <div class="ai-msgs">
            <p class="ai-div">Hoje, 14:02</p>
            <div class="ai-msg bot ai-oi">Oi! Sou o assistente de RH da Construtora Aurora. Pergunte sobre férias, benefícios ou ponto.</div>
            <div class="ai-msg eu ai-q">Posso vender 10 dias de férias?</div>
            <p class="ai-busca-doc"><span class="ai-pts"><i></i><i></i><i></i></span><span class="ai-cons">Consultando 4 documentos…</span></p>
            <div class="ai-msg bot ai-r"><p class="ai-rtxt"></p>${chip('7')}</div>
          </div>
          <div class="ai-entrada"><span class="ai-campo"><em class="ai-digita"></em><span class="ai-ph">Pergunte algo ao assistente…</span></span><span class="ai-env">${ic('enviar')}</span></div>
        </section>
      </div>
    </main>
    <div class="ai-sac">
      <aside class="sac-lado"><span class="sac-logo">${app('sac').icon}</span><span class="on">${i.grade}</span><span>${i.ticket}</span><span>${ic('caixa')}</span><span>${ic('ajustes')}</span><b>CF</b></aside>
      <header class="sac-topo"><span class="ai-tg">${i.painel}</span><div class="sac-busca">${ic('busca')}<span>Buscar solicitação, página ou ação…</span><kbd>Ctrl K</kbd></div><div class="sac-ic"><span>${ic('sino')}</span><span>${i.boia}</span><span>${i.lua}</span></div></header>
      <main class="sac-corpo">
        <div class="sac-cab"><div><h2>Olá, Caio</h2><p>Acompanhe suas solicitações e abra novas quando precisar.</p></div><span class="sac-bt">${ic('mais')} NOVA SOLICITAÇÃO</span></div>
        <div class="sac-kpis">${[['ABERTOS', '2', 'Aguardando triagem', '#7CC4F0'], ['EM ANDAMENTO', '1', 'Em atendimento', '#7CC4F0'], ['RESOLVIDOS (14)', '14', 'Últimos 30 dias', '#4ADE80'], ['URGENTES / ATRASADOS', '0', 'Atenção imediata', '#F87171']].map(([a, b, c, d]) => `<div class="sac-kpi"><small><i style="background:${d}"></i>${a}</small><b>${b}</b><span>${c}</span></div>`).join('')}</div>
        <div class="sac-baixo"><div class="sac-rec"><b>Solicitações recentes</b><small>Últimas atividades</small>
          ${[['#7.214', 'Ajuste de ponto · setembro', 'Em andamento', 'a'], ['#7.198', 'Reembolso de quilometragem', 'Resolvido', 'r'], ['#7.163', 'Troca de dependente no plano', 'Resolvido', 'r'], ['#7.120', 'Segunda via do informe de rendimentos', 'Resolvido', 'r']].map(([n, d, s, c]) => `<div class="sac-lin"><em>${n}</em><span>${d}</span><i class="${c}">${s}</i></div>`).join('')}</div>
          <div class="sac-res"><small>RESUMO</small><b>Total de solicitações</b><p><span>Total</span><em>17</em></p><p><span>Resolvidos</span><em>14</em></p><p><span>Atrasados</span><em>0</em></p></div></div>
        <p class="sac-rt">Abrir por assunto</p>
        <div class="sac-tipos">${[['agenda', 'Férias', 'Pedidos, abono e remarcação'], ['relogio', 'Ponto e jornada', 'Ajustes e banco de horas'], ['coracao', 'Benefícios', 'Plano de saúde e auxílios'], ['doc', 'Folha de pagamento', 'Holerite e informe de rendimentos']].map(([n, a, b]) => `<div>${ic(n as 'doc')}<b>${a}</b><span>${b}</span></div>`).join('')}</div>
      </main>
      <span class="ai-lanc">${i.bot}</span>
      <div class="ai-wid">
        <div class="ai-ch-cab"><span class="ai-av">${i.bot}</span><div><b>Assistente de RH</b><small>PominAI · mesma conversa</small></div><span class="ai-x">${i.fechar}</span></div>
        <div class="ai-msgs">
          <p class="ai-div">Hoje, 14:02 · no PominAI</p>
          <div class="ai-msg eu">Posso vender 10 dias de férias?</div>
          <div class="ai-msg bot">Pode, sim. Até 10 dias viram abono pecuniário.${chip('7')}</div>
          <p class="ai-div">Agora · no PominSAC</p>
          <div class="ai-msg eu ai-q2">E até quando eu preciso pedir?</div>
          <div class="ai-msg bot ai-r2"><p class="ai-rtxt2"></p>${chip('7')}</div>
        </div>
        <div class="ai-entrada"><span class="ai-campo"><em class="ai-digita2"></em><span class="ai-ph">Pergunte algo ao assistente…</span></span><span class="ai-env ai-env2">${ic('enviar')}</span></div>
      </div>
    </div>
  </div>`,
  css: `
.t-ai .ai { position: relative; width: 1280px; height: 800px; display: grid; grid-template-columns: 58px 1fr; grid-template-rows: 56px 1fr; background: #F6F8FB; color: #0F1B2D; font: 400 13px/1.4 Oxanium, sans-serif; overflow: hidden; }
.t-ai .ai svg { width: 17px; height: 17px; flex: none; }
.t-ai .ai-lado { grid-row: 1 / 3; display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 10px 0 14px; background: #fff; border-right: 1px solid #E6EBF2; color: #5F6E83; }
.t-ai .ai-logo { width: 34px; height: 34px; border-radius: 9px; background: linear-gradient(160deg, #4C8FF0, #1D5FB8); color: #fff; display: grid; place-items: center; margin-bottom: 12px; box-shadow: inset 0 0 0 1px rgba(255,255,255,.25); }
.t-ai .ai-logo svg { width: 20px; height: 20px; }
.t-ai .ai-lado > span { width: 34px; height: 34px; border-radius: 8px; display: grid; place-items: center; }
.t-ai .ai-lado > span.on { background: #E6EFFB; color: #1A5DAB; box-shadow: inset 0 0 0 1px #C9DBF3; }
.t-ai .ai-lado hr { width: 22px; border: 0; border-top: 1px solid #E6EBF2; margin: 8px 0; }
.t-ai .ai-eu { margin-top: auto; width: 32px; height: 32px; border: 1.5px solid #1A5DAB; border-radius: 7px; display: grid; place-items: center; font-size: 10.5px; color: #1A5DAB; }
.t-ai .ai-topo { display: flex; align-items: center; gap: 16px; padding: 0 18px 0 16px; background: #fff; border-bottom: 1px solid #E6EBF2; }
.t-ai .ai-tg { color: #5F6E83; display: grid; }
.t-ai .ai-busca { margin: 0 auto; width: 400px; height: 34px; border: 1px solid #E1E7EF; border-radius: 8px; display: flex; align-items: center; gap: 9px; padding: 0 10px; color: #6B7A90; font-size: 12px; background: #FAFBFD; }
.t-ai .ai-busca svg { width: 14px; height: 14px; } .t-ai .ai-busca span { flex: 1; }
.t-ai .ai kbd { font: 500 9.5px 'JetBrains Mono', monospace; border: 1px solid #DCE3EC; border-radius: 4px; padding: 1px 5px; color: #6B7A90; }
.t-ai .ai-acoes { display: flex; gap: 8px; color: #5F6E83; }
.t-ai .ai-acoes > * { width: 32px; height: 32px; border: 1px solid #E1E7EF; border-radius: 8px; display: grid; place-items: center; position: relative; }
.t-ai .ai-acoes svg { width: 15px; height: 15px; } .t-ai .ai-acoes em { border: 0; }
.t-ai .ai-acoes .sino::after { content: ''; position: absolute; top: 6px; right: 7px; width: 6px; height: 6px; border-radius: 50%; background: #1A5DAB; border: 1.5px solid #fff; }
.t-ai .ai-pn { position: relative; margin: 7px 8px 8px 7px; background: #fff; border: 1px solid #E6EBF2; border-radius: 12px; padding: 20px 34px 20px; }
.t-ai .ai-cab { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 16px; }
.t-ai .ai-chip { display: inline-flex; align-items: center; gap: 5px; font-size: 9.5px; letter-spacing: .16em; color: #4C5D74; border: 1px solid #D9E2EE; background: #F6F9FD; border-radius: 99px; padding: 2px 10px 2px 8px; }
.t-ai .ai-chip svg { width: 11px; height: 11px; color: #1A5DAB; }
.t-ai .ai h1 { display: flex; align-items: center; gap: 8px; margin: 6px 0 2px; font-size: 23px; font-weight: 600; letter-spacing: -.01em; }
.t-ai .ai-st { font-size: 10.5px; font-weight: 500; border-radius: 99px; padding: 1px 9px; color: #C27A0E; background: #FFF4DF; border: 1px solid #F6DDAA; }
.t-ai .ai-st.ok { color: #15803D; background: #E9F8EF; border-color: #B9E7C9; position: absolute; opacity: 0; }
.t-ai .ai-cab.publicado .ai-st { display: none; } .t-ai .ai-cab.publicado .ai-st.ok { display: inline-block; position: static; opacity: 1; }
.t-ai .ai-cab p { margin: 0; color: #66758A; font-size: 12.5px; }
.t-ai .ai-cab-bt { display: flex; gap: 10px; }
.t-ai .ai-bt { display: inline-flex; align-items: center; gap: 7px; height: 38px; padding: 0 18px; border-radius: 6px; background: #1A5DAB; color: #fff; font-weight: 500; font-size: 13px; }
.t-ai .ai-bt.sec { background: #fff; color: #0F1B2D; border: 1px solid #DCE3EC; }
.t-ai .ai-bt svg { width: 15px; height: 15px; }
.t-ai .ai-grade { position: relative; display: grid; grid-template-columns: 372px 1fr 392px; gap: 16px; height: 578px; }
.t-ai .ai-col { display: flex; flex-direction: column; gap: 14px; min-height: 0; }
.t-ai .ai-card { position: relative; background: #fff; border: 1px solid #E3E9F1; border-radius: 10px; padding: 14px 16px; }
.t-ai .ai-card h3 { display: flex; justify-content: space-between; align-items: baseline; margin: 0 0 10px; font-size: 13.5px; font-weight: 600; }
.t-ai .ai-card h3 small { font-weight: 400; font-size: 11px; color: #7A889C; }
.t-ai .ai-ident { flex: 1; display: flex; flex-direction: column; gap: 9px; }
.t-ai .ai-ident h3 { margin-bottom: 2px; }
.t-ai .ai-ident label { display: flex; flex-direction: column; gap: 4px; }
.t-ai .ai-ident label > span:first-child { font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: #6B7A90; font-weight: 500; }
.t-ai .ai-in { display: flex; align-items: center; gap: 8px; min-height: 34px; border: 1px solid #DCE3EC; border-radius: 7px; padding: 6px 10px; font-size: 12.5px; background: #fff; }
.t-ai .ai-in em { font-style: normal; }
.t-ai .ai-in.sel { justify-content: space-between; } .t-ai .ai-in.sel svg { width: 14px; height: 14px; color: #6B7A90; }
.t-ai .ai-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.t-ai .ai-tag { font-weight: 500; font-size: 11px; color: #C2337A; background: #FDEBF4; border: 1px solid #F7CFE2; border-radius: 99px; padding: 0 8px; }
.t-ai .ai-ta { align-items: flex-start; height: 92px; line-height: 1.5; color: #24344B; }
.t-ai .ai-in.foco:not(.solto) { border-color: #1A5DAB; box-shadow: 0 0 0 3px #E2EDFA; }
.t-ai .cur::after { content: ''; display: inline-block; width: 1.5px; height: 1.05em; background: #1A5DAB; margin-left: 1px; vertical-align: -2px; }
.t-ai .cur.feito::after { display: none; }
.t-ai .ai-acesso { flex: none; padding-bottom: 8px; }
.t-ai .ai-qtd b { color: #1A5DAB; font-weight: 600; }
.t-ai .ai-gr { display: grid; grid-template-columns: 34px 1fr auto; align-items: center; gap: 10px; padding: 5px 0; border-top: 1px solid #EEF2F7; font-size: 12.5px; }
.t-ai .ai-gr b { font-weight: 500; } .t-ai .ai-gr > span:last-child { color: #7A889C; font-size: 11.5px; }
.t-ai .ai-sw { position: relative; width: 30px; height: 17px; border-radius: 99px; background: #D5DDE8; transition: background .25s; }
.t-ai .ai-sw i { position: absolute; top: 2px; left: 2px; width: 13px; height: 13px; border-radius: 50%; background: #fff; box-shadow: 0 1px 2px rgba(15,27,45,.3); transition: transform .25s; }
.t-ai .ai-sw.on { background: #1A5DAB; } .t-ai .ai-sw.on i { transform: translateX(13px); }
.t-ai .ai-kb { display: flex; flex-direction: column; }
.t-ai .ai-kb h3 { margin-bottom: 0; }
.t-ai .ai-kbq b { color: #0F1B2D; font-weight: 600; }
.t-ai .ai-kbsub { margin: 2px 0 10px; color: #7A889C; font-size: 11.5px; }
.t-ai .ai-drop { display: flex; align-items: center; gap: 12px; border: 1.5px dashed #C9D6E6; background: #F7FAFE; border-radius: 9px; padding: 10px 14px; color: #1A5DAB; font-size: 12px; font-weight: 500; }
.t-ai .ai-drop svg { width: 20px; height: 20px; } .t-ai .ai-drop small { display: block; color: #7A889C; font-weight: 400; font-size: 11px; }
.t-ai .ai-docs { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px; }
.t-ai .ai-doc { border: 1px solid #E3E9F1; border-radius: 9px; padding: 8px; background: #fff; }
.t-ai .ai-th { position: relative; height: 132px; border-radius: 5px; background: #F2F5F9; overflow: hidden; }
.t-ai .ai-th::before { content: ''; position: absolute; left: 16px; right: 16px; top: 12px; bottom: 0; background: #fff; box-shadow: 0 2px 6px rgba(15,27,45,.12); }
.t-ai .ai-th::after { content: ''; position: absolute; left: 24px; right: 30px; top: 24px; bottom: 0; background: linear-gradient(#0F1B2D 0 0) 0 0 / 55% 4px no-repeat, repeating-linear-gradient(#fff 0 9px, #D8DEE7 9px 12px) 0 12px / 100% 100% no-repeat; }
.t-ai .ai-doc.d1 .ai-th::after { right: 22px; } .t-ai .ai-doc.d2 .ai-th::after { right: 38px; } .t-ai .ai-doc.d3 .ai-th::after { right: 26px; }
.t-ai .ai-th i, .t-ai .ai-pg-cab i, .t-ai .ai-fonte i { font-style: normal; font: 700 8.5px 'JetBrains Mono', monospace; color: #fff; background: #D9363E; border-radius: 3px; padding: 1px 4px; letter-spacing: .04em; }
.t-ai .ai-th i { position: absolute; left: 8px; bottom: 8px; z-index: 1; }
.t-ai .ai-doc > b { display: block; margin: 7px 2px 3px; font-size: 11.5px; font-weight: 500; line-height: 1.3; height: 30px; }
.t-ai .ai-dst { position: relative; display: block; height: 16px; margin: 0 2px; }
.t-ai .ai-prog { position: absolute; left: 0; right: 0; top: 6px; height: 4px; border-radius: 9px; background: #E6ECF3; overflow: hidden; }
.t-ai .ai-prog i { display: block; height: 100%; width: 100%; background: #1A5DAB; transform-origin: 0 50%; }
.t-ai .ai-dst em { position: absolute; inset: 0; display: flex; align-items: center; gap: 4px; font-style: normal; font-size: 10.5px; color: #15803D; }
.t-ai .ai-dst em svg { width: 12px; height: 12px; }
.t-ai .ai-pagina { position: absolute; left: 402px; top: 26px; width: 352px; height: 470px; z-index: 2; background: #fff; border-radius: 6px; box-shadow: 0 30px 60px -18px rgba(15,27,45,.35), 0 0 0 1px #E3E9F1; overflow: hidden; }
.t-ai .ai-pg-cab { display: flex; align-items: center; gap: 8px; padding: 9px 12px; background: #F4F6FA; border-bottom: 1px solid #E3E9F1; font-size: 11.5px; }
.t-ai .ai-pg-cab b { font-weight: 500; flex: 1; } .t-ai .ai-pg-cab em { font-style: normal; color: #1A5DAB; font-weight: 600; }
.t-ai .ai-pg { padding: 20px 26px; font-size: 11.5px; line-height: 1.6; color: #3B4A60; }
.t-ai .ai-pg small { font-size: 8.5px; letter-spacing: .14em; color: #8A97A8; }
.t-ai .ai-pg h4 { margin: 12px 0 8px; font-size: 14.5px; color: #0F1B2D; font-weight: 600; } .t-ai .ai-pg h4.h5 { font-size: 12.5px; margin-top: 14px; }
.t-ai .ai-pg p { margin: 0 0 8px; }
.t-ai .ai-pg mark { color: #0F1B2D; background: linear-gradient(#FFE27A, #FFE27A) 0 0 / 0% 100% no-repeat; padding: 1px 0; }
.t-ai .ai-rod { margin: 14px 0 0; text-align: right; font-size: 9.5px; color: #9AA6B6; }
.t-ai .ai-linhas { height: 74px; background: repeating-linear-gradient(#fff 0 10px, #E1E6EE 10px 13px); }
.t-ai .ai-chat { display: flex; flex-direction: column; padding: 0; z-index: 3; box-shadow: 0 26px 50px -20px rgba(15,27,45,.28); border-color: #DCE4EE; }
.t-ai .ai-ch-cab { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-bottom: 1px solid #EEF2F7; }
.t-ai .ai-ch-cab b { display: block; font-weight: 600; font-size: 13.5px; } .t-ai .ai-ch-cab small { color: #7A889C; font-size: 11px; }
.t-ai .ai-ch-cab > div { flex: 1; }
.t-ai .ai-av { width: 34px; height: 34px; border-radius: 9px; background: #E6EFFB; color: #1A5DAB; display: grid; place-items: center; box-shadow: inset 0 0 0 1px #C9DBF3; }
.t-ai .ai-teste { font-size: 10.5px; color: #1A5DAB; border: 1px solid #C9DBF3; border-radius: 99px; padding: 1px 9px; }
.t-ai .ai-msgs { flex: 1; display: flex; flex-direction: column; gap: 10px; padding: 12px 14px; overflow: hidden; }
.t-ai .ai-div { margin: 0; text-align: center; font-size: 10.5px; color: #8A97A8; }
.t-ai .ai-msg { max-width: 88%; padding: 9px 12px; border-radius: 12px; font-size: 12.5px; line-height: 1.5; }
.t-ai .ai-msg.bot { align-self: flex-start; background: #F3F6FA; border: 1px solid #E6ECF3; border-top-left-radius: 4px; }
.t-ai .ai-msg.eu { align-self: flex-end; background: #1A5DAB; color: #fff; border-top-right-radius: 4px; }
.t-ai .ai-msg p { margin: 0; min-height: 19px; }
.t-ai .ai-r { max-width: 94%; }
.t-ai .ai-busca-doc { display: flex; align-items: center; gap: 8px; margin: 0; font-size: 11px; color: #6B7A90; }
.t-ai .ai-pts { display: inline-flex; gap: 3px; } .t-ai .ai-pts i { width: 5px; height: 5px; border-radius: 50%; background: #1A5DAB; opacity: .35; }
.t-ai .ai-busca-doc.ok .ai-pts { display: none; } .t-ai .ai-busca-doc.ok::before { content: '✓'; color: #15803D; font-weight: 700; }
.t-ai .ai-fonte { display: inline-flex; align-items: center; gap: 6px; margin-top: 9px; padding: 4px 9px 4px 5px; background: #fff; border: 1px solid #C9DBF3; border-radius: 7px; font-size: 11px; color: #24344B; white-space: nowrap; box-shadow: 0 1px 2px rgba(15,27,45,.06); }
.t-ai .ai-fonte b { color: #1A5DAB; font-weight: 600; }
.t-ai .ai-r .ai-fonte, .t-ai .ai-r2 .ai-fonte { display: none; } .t-ai .ai-r.cita .ai-fonte, .t-ai .ai-r2.cita .ai-fonte { display: inline-flex; }
.t-ai .ai-entrada { display: flex; gap: 8px; align-items: center; padding: 10px 12px 12px; border-top: 1px solid #EEF2F7; }
.t-ai .ai-campo { position: relative; flex: 1; height: 38px; border: 1px solid #DCE3EC; border-radius: 9px; display: flex; align-items: center; padding: 0 12px; font-size: 12.5px; }
.t-ai .ai-campo em { font-style: normal; position: relative; z-index: 1; }
.t-ai .ai-ph { position: absolute; left: 12px; color: #9AA6B6; }
.t-ai .ai-campo.tem .ai-ph { opacity: 0; } .t-ai .ai-campo.saiu em { opacity: 0; } .t-ai .ai-campo.saiu .ai-ph { opacity: 1; }
.t-ai .ai-env { width: 38px; height: 38px; border-radius: 9px; background: #1A5DAB; color: #fff; display: grid; place-items: center; }
.t-ai .ai-env svg { width: 16px; height: 16px; }
.t-ai .ai-sac { position: absolute; inset: 0; z-index: 10; display: grid; grid-template-columns: 58px 1fr; grid-template-rows: 56px 1fr; background: #0B0C0F; color: #E8EAED; }
.t-ai .sac-lado { grid-row: 1 / 3; display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 10px 0 14px; color: #6F7680; border-right: 1px solid #1B1E23; }
.t-ai .sac-lado > span { width: 32px; height: 32px; border-radius: 8px; display: grid; place-items: center; }
.t-ai .sac-lado .on { background: #1A2533; color: #7CC4F0; }
.t-ai .sac-logo { background: linear-gradient(160deg, #A06CF0, #6D3FD1); color: #fff !important; margin-bottom: 10px; }
.t-ai .sac-lado b { margin-top: auto; font-size: 10px; color: #C9CDD3; border: 1px solid #2B3038; border-radius: 7px; width: 30px; height: 30px; display: grid; place-items: center; }
.t-ai .sac-topo { display: flex; align-items: center; gap: 16px; padding: 0 18px; border-bottom: 1px solid #1B1E23; color: #8A9099; }
.t-ai .sac-busca { margin: 0 auto; width: 400px; height: 34px; border-radius: 8px; background: #121418; border: 1px solid #1F2329; display: flex; align-items: center; gap: 9px; padding: 0 10px; font-size: 12px; }
.t-ai .sac-busca span { flex: 1; } .t-ai .sac-busca svg { width: 14px; height: 14px; } .t-ai .sac-busca kbd { border-color: #2B3038; color: #8A9099; }
.t-ai .sac-ic { display: flex; gap: 8px; } .t-ai .sac-ic span { width: 32px; height: 32px; border: 1px solid #22262C; border-radius: 8px; display: grid; place-items: center; } .t-ai .sac-ic svg { width: 15px; height: 15px; }
.t-ai .sac-corpo { padding: 26px 40px; }
.t-ai .sac-cab { display: flex; justify-content: space-between; align-items: flex-start; }
.t-ai .sac-cab h2 { margin: 0; font-size: 24px; font-weight: 600; } .t-ai .sac-cab p { margin: 2px 0 0; color: #8A9099; font-size: 12.5px; }
.t-ai .sac-bt { display: inline-flex; align-items: center; gap: 6px; height: 34px; padding: 0 14px; border-radius: 6px; background: #7CC4F0; color: #08223A; font-weight: 600; font-size: 11.5px; letter-spacing: .04em; }
.t-ai .sac-bt svg { width: 14px; height: 14px; }
.t-ai .sac-kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 22px; }
.t-ai .sac-kpi { background: #121418; border: 1px solid #1E2228; border-radius: 8px; padding: 14px 16px; }
.t-ai .sac-kpi small { display: flex; align-items: center; gap: 6px; font-size: 10px; letter-spacing: .08em; color: #8A9099; } .t-ai .sac-kpi small i { width: 6px; height: 6px; border-radius: 50%; }
.t-ai .sac-kpi b { display: block; font-size: 26px; font-weight: 600; margin: 8px 0 4px; } .t-ai .sac-kpi span { font-size: 11px; color: #6F7680; }
.t-ai .sac-baixo { display: grid; grid-template-columns: 1.6fr 1fr; gap: 12px; margin-top: 12px; }
.t-ai .sac-rec, .t-ai .sac-res { background: #121418; border: 1px solid #1E2228; border-radius: 8px; padding: 16px 18px; }
.t-ai .sac-rec > b, .t-ai .sac-res > b { display: block; font-weight: 600; font-size: 13.5px; } .t-ai .sac-rec > small { color: #6F7680; font-size: 11px; }
.t-ai .sac-lin { display: grid; grid-template-columns: 62px 1fr auto; gap: 10px; align-items: center; padding: 10px 0; border-bottom: 1px solid #1E2228; font-size: 12.5px; }
.t-ai .sac-lin em { font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #8A9099; }
.t-ai .sac-lin i { font-style: normal; font-size: 10.5px; border-radius: 99px; padding: 1px 8px; } .t-ai .sac-lin i.a { color: #FBBF24; background: #33290F; } .t-ai .sac-lin i.r { color: #4ADE80; background: #12301F; }
.t-ai .sac-res small { font-size: 10px; letter-spacing: .1em; color: #7CC4F0; } .t-ai .sac-res > b { margin: 2px 0 12px; }
.t-ai .sac-res p { display: flex; justify-content: space-between; margin: 0 0 8px; padding: 9px 12px; background: #0D0F12; border-radius: 6px; font-size: 12px; color: #A7ADB5; } .t-ai .sac-res p em { font-style: normal; color: #E8EAED; }
.t-ai .sac-rt { margin: 22px 0 10px; font-size: 13.5px; font-weight: 600; }
.t-ai .sac-tipos { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.t-ai .sac-tipos div { display: grid; grid-template-columns: 34px 1fr; column-gap: 10px; align-items: center; background: #121418; border: 1px solid #1E2228; border-radius: 8px; padding: 14px; }
.t-ai .sac-tipos svg { grid-row: span 2; width: 34px; height: 34px; padding: 8px; border-radius: 8px; background: #172230; color: #7CC4F0; }
.t-ai .sac-tipos b { font-weight: 600; font-size: 12.5px; } .t-ai .sac-tipos span { font-size: 11px; color: #6F7680; }
.t-ai .ai-lanc { position: absolute; right: 26px; bottom: 24px; width: 54px; height: 54px; border-radius: 50%; background: linear-gradient(160deg, #4C8FF0, #1D5FB8); color: #fff; display: grid; place-items: center; box-shadow: 0 12px 26px -8px rgba(0,0,0,.6); }
.t-ai .ai-lanc svg { width: 24px; height: 24px; }
.t-ai .ai-wid { position: absolute; right: 26px; bottom: 92px; width: 380px; height: 470px; display: flex; flex-direction: column; background: #fff; color: #0F1B2D; border-radius: 14px; overflow: hidden; box-shadow: 0 40px 80px -20px rgba(0,0,0,.75), 0 0 0 1px rgba(255,255,255,.08); transform-origin: 100% 100%; }
.t-ai .ai-x { color: #7A889C; }
.t-ai .ai-wid .ai-msgs { gap: 8px; }
.t-ai .ai-wid .ai-msg { font-size: 12px; padding: 8px 11px; }
`,
  roteiro(f) {
    const tl = f.tl, W = 1280, H = 800;
    // câmera que nunca mostra a borda da tela: 846×476 é meia janela visível (em px da tela) no zoom 1
    const mira = (x: number, y: number, zoom: number, ang: { rx?: number; ry?: number } = {}) => {
      const hw = 846 / zoom, hh = 476 / zoom;
      const cx = hw * 2 >= W ? W / 2 : Math.min(Math.max(x, hw), W - hw), cy = hh * 2 >= H ? H / 2 : Math.min(Math.max(y, hh), H - hh);
      return { ...ang, x: -(cx - W / 2) / W * 100 * zoom, y: -(cy - H / 2) / H * 100 * zoom, zoom };
    };
    const d = (s: number) => `depois+=${s}`;
    const ch = f.pos('.ai-chat'), pg = f.pos('.ai-pagina'), d0 = f.pos('.ai-doc.d0');

    // estados iniciais
    tl.set(f.$('.ai-pagina'), { autoAlpha: 0 }, 0).set(f.$('.ai-sac'), { xPercent: 100 }, 0).set(f.$('.ai-wid'), { autoAlpha: 0, scale: .6 }, 0);
    tl.set(f.$$('.ai-prog i'), { scaleX: 0 }, 0).set(f.$$('.ai-dst em'), { autoAlpha: 0 }, 0).set(f.$$('.ai-pts i'), { opacity: .35 }, 0);
    tl.set(f.$$('.ai-oi, .ai-q, .ai-busca-doc, .ai-r, .ai-q2, .ai-r2'), { autoAlpha: 0 }, 0);

    // 1 · Crie o assistente: nome, papel e instruções digitados; o chat de teste já assume a identidade
    f.passo(1, 'Primeiro, o assistente ganha nome, papel e as regras que deve seguir.', 'depois');
    f.camera(mira(300, 330, 1.85, { ry: 4 }), 1.8, d(.1));
    const campo = (sel: string, txt: string, at: number, cps: number) => {
      const fim = at + txt.length / cps;
      f.classe(`.ai-in:has(${sel})`, 'foco', d(at - .1)).classe(sel, 'cur', d(at - .1)).digitar(sel, txt, d(at), cps)
        .classe(sel, 'feito', d(fim + .2)).classe(`.ai-in:has(${sel})`, 'solto', d(fim + .2));
    };
    campo('.ai-nome', 'Assistente de RH', .7, 24);
    f.texto('.ai-tit', 'Assistente de RH', d(1.4)).texto('.ai-ch-nome', 'Assistente de RH', d(1.4));
    campo('.ai-papel', 'Tira dúvidas dos colaboradores sobre políticas de pessoas', 1.6, 52);
    f.camera(mira(300, 420, 1.85, { ry: 3 }), 1.6, d(2.3));
    campo('.ai-instr', 'Responda só com base nos documentos da base. Cite sempre o arquivo e a página. Se não encontrar, oriente a pessoa a abrir uma solicitação no PominSAC.', 2.9, 72);
    tl.to(f.$('.ai-oi'), { autoAlpha: 1, duration: .5 }, d(5));

    // 2 · Conecte o conhecimento: os PDFs caem na base e são indexados
    f.passo(2, 'Depois, os documentos da empresa. É neles que ele procura a resposta.', d(5.6));
    f.camera(mira(640, 470, 1.45, { ry: -3 }), 1.6, d(5.6));
    f.foco('.ai-kb', d(5.8));
    tl.from(f.$$('.ai-doc'), { autoAlpha: 0, y: -46, rotation: (k: number) => [-6, 5, -4, 6][k], duration: .7, stagger: .16, ease: 'back.out(1.4)' }, d(6.2));
    tl.to(f.$$('.ai-prog i'), { scaleX: 1, duration: .8, stagger: .16, ease: 'power1.inOut' }, d(6.7));
    tl.to(f.$$('.ai-prog'), { autoAlpha: 0, duration: .2, stagger: .16 }, d(7.5)).to(f.$$('.ai-dst em'), { autoAlpha: 1, duration: .3, stagger: .16 }, d(7.55));
    f.contar('.ai-narq', 4, d(6.3), { dur: .8 }).contar('.ai-npag', 131, d(6.7), { dur: 1.4 });

    // O momento: a pergunta, a busca nos documentos e a resposta citando a página
    f.camera(mira(1000, ch.y + ch.h / 2, 1.6), 1.7, d(8.4));
    f.foco('.ai-chat', d(8.5), .8);
    f.classe('.ai-chat .ai-campo', 'tem', d(9)).digitar('.ai-digita', 'Posso vender 10 dias de férias?', d(9), 32);
    f.cursor('.ai-chat .ai-env', d(9.3), true, .7);
    f.classe('.ai-chat .ai-campo', 'saiu', d(10.05));
    tl.fromTo(f.$('.ai-q'), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .35, immediateRender: false }, d(10.1));
    tl.to(f.$('.ai-busca-doc'), { autoAlpha: 1, duration: .3 }, d(10.4));
    tl.to(f.$$('.ai-pts i'), { opacity: 1, duration: .2, stagger: { each: .1, repeat: 3, yoyo: true } }, d(10.4));
    f.esconderCursor(d(10.5));
    f.texto('.ai-cons', 'Consultou 4 documentos · 131 páginas', d(11.3)).classe('.ai-busca-doc', 'ok', d(11.3));
    tl.to(f.$('.ai-r'), { autoAlpha: 1, duration: .3 }, d(11.3));
    f.digitar('.ai-rtxt', 'Pode, sim. Até 10 dias das suas férias, ou 1/3 do período, podem virar abono pecuniário. O pedido vai até 15 dias antes do fim do período aquisitivo.', d(11.4), 80);
    f.classe('.ai-r', 'cita', d(13.4)).legenda('A resposta vem com o documento e a página. Dá para conferir.', d(13.4));
    tl.fromTo(f.$('.ai-r .ai-fonte'), { autoAlpha: 0, scale: .8 }, { autoAlpha: 1, scale: 1, duration: .4, ease: 'back.out(2)', immediateRender: false }, d(13.4));
    // a página citada sai da base (desfocada, atrás) e entra em foco ao lado da conversa
    tl.fromTo(f.$('.ai-pagina'), { autoAlpha: 0, x: d0.x - pg.x, y: d0.y - pg.y, scale: d0.w / pg.w, transformOrigin: '0 0' }, { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 1, ease: 'power3.inOut', immediateRender: false }, d(13.7));
    f.foco('.ai-chat, .ai-pagina', d(13.7), .8);
    f.camera(mira(860, pg.y + pg.h / 2, 1.6), 1.6, d(13.8));
    tl.to(f.$('.ai-pg .m1'), { backgroundSize: '100% 100%', duration: .8, ease: 'power1.inOut' }, d(14.8))
      .to(f.$('.ai-pg .m2'), { backgroundSize: '100% 100%', duration: .8, ease: 'power1.inOut' }, d(15.5));

    // 3 · Controle quem acessa
    f.passo(3, 'O assistente do RH só aparece para quem você liberar.', d(16.9));
    tl.to(f.$('.ai-pagina'), { autoAlpha: 0, scale: .96, duration: .5 }, d(16.9));
    f.camera(mira(300, 700, 2, { ry: 3 }), 1.5, d(16.9));
    f.foco('.ai-acesso', d(17.1));
    f.cursor('.ai-gr.g2 .ai-sw', d(17.6), true, .7).classe('.ai-gr.g2 .ai-sw', 'on', d(18.3));
    f.contar('.ai-pess', 206, d(18.3), { de: 20, dur: .6 });
    f.cursor('.ai-gr.g3 .ai-sw', d(18.6), true, .45).classe('.ai-gr.g3 .ai-sw', 'on', d(19.05));
    f.contar('.ai-pess', 248, d(19.05), { de: 206, dur: .5 });
    f.camera(mira(640, 400, 1.2), 1.2, d(19.6));
    f.foco(null, d(19.6));
    f.cursor('.ai-pub', d(19.8), true, .8).classe('.ai-cab', 'publicado', d(20.6));

    // 4 · Leve para os sistemas: o mesmo assistente, como widget, dentro do PominSAC
    f.passo(4, 'E ele atende dentro dos outros sistemas, com a mesma conversa.', d(21.2));
    f.esconderCursor(d(21.2));
    f.geral(1.1, d(21.2));
    tl.to(f.$('.ai-pn'), { xPercent: -18, autoAlpha: .2, duration: 1.1, ease: 'power3.inOut' }, d(21.2))
      .to(f.$('.ai-sac'), { xPercent: 0, duration: 1.1, ease: 'power3.inOut' }, d(21.2));
    f.entra('.sac-kpi', d(21.9), { stagger: .06 });
    tl.fromTo(f.$('.ai-lanc'), { scale: 0 }, { scale: 1, duration: .5, ease: 'back.out(2)', immediateRender: false }, d(22.1));
    f.cursor('.ai-lanc', d(22.3), true, .7);
    tl.to(f.$('.ai-wid'), { autoAlpha: 1, scale: 1, duration: .45, ease: 'power3.out' }, d(23.05));
    f.esconderCursor(d(23.3));
    f.camera(mira(1060, 520, 1.65), 1.4, d(23.1));
    f.classe('.ai-wid .ai-campo', 'tem', d(23.6)).digitar('.ai-digita2', 'E até quando eu preciso pedir?', d(23.6), 34);
    f.classe('.ai-wid .ai-campo', 'saiu', d(24.6));
    tl.fromTo(f.$('.ai-q2'), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .35, immediateRender: false }, d(24.6));
    tl.to(f.$('.ai-r2'), { autoAlpha: 1, duration: .3 }, d(25));
    f.digitar('.ai-rtxt2', 'Até 15 dias antes do fim do período aquisitivo. Dá para pedir aqui mesmo: Nova solicitação › Férias.', d(25.1), 75);
    f.classe('.ai-r2', 'cita', d(26.5));
    tl.fromTo(f.$('.ai-r2 .ai-fonte'), { autoAlpha: 0, scale: .8 }, { autoAlpha: 1, scale: 1, duration: .4, ease: 'back.out(2)', immediateRender: false }, d(26.5));
    f.pausa(1.4);
  }
};
export default t;
