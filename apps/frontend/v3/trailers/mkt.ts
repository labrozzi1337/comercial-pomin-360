// PominMKT · "O post que passou por quatro aplicativos". Tela no estilo do MKT Pomin real (tema escuro, chat primeiro).
// Linguagem de câmera: linha de produção. A peça atravessa as estações da esquerda para a direita
// (criar, aprovar, publicar, medir) e a câmera viaja junto com ela, num travelling lateral.
import { ic, type Trailer } from '../filme';
import { svg } from '../../src/data';

const i = {
  chat: svg('<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.8-.9L3 21l1.9-5.7A8.4 8.4 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5z"/>'),
  varinha: svg('<path d="m15 4 5 5L9 20H4v-5z"/><path d="m13 6 5 5"/>'),
  marca: svg('<circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/><path d="M12 2a10 10 0 1 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.3A5.6 5.6 0 0 0 22 9.8C22 5.5 17.5 2 12 2z"/>'),
  globo: svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'),
  clipe: svg('<path d="m21 11-8.6 8.6a5 5 0 0 1-7-7l8.5-8.6a3.3 3.3 0 0 1 4.7 4.7l-8.6 8.6a1.7 1.7 0 0 1-2.3-2.4l7.9-7.9"/>'),
  coment: svg('<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.8-.9L3 21l1.9-5.7A8.4 8.4 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5z"/>'),
  salvar: svg('<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>'),
  insta: svg('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8"/>'),
  face: svg('<path d="M15 3h-2a4 4 0 0 0-4 4v3H7v4h2v7h4v-7h2.5l.5-4h-3V7.5a.5.5 0 0 1 .5-.5H16V3z"/>'),
  olho: svg('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
  link: svg('<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>')
};
const logo = '<svg class="mk-logo" viewBox="0 0 24 24"><path d="M12 2l2.2 6.8L21 6l-4.3 6L21 18l-6.8-2.8L12 22l-2.2-6.8L3 18l4.3-6L3 6l6.8 2.8z" fill="#F472B6"/><path d="M12 6.5l1.2 3.7 3.8-1.5-2.4 3.3 2.4 3.3-3.8-1.5L12 17.5l-1.2-3.7-3.8 1.5 2.4-3.3-2.4-3.3 3.8 1.5z" fill="#60A5FA"/></svg>';

const ST = 900, SX = 232;                                     // distância entre estações e posição da primeira
const etapas = ['Criar', 'Aprovar', 'Publicar', 'Resultados'];
const dias = Array.from({ length: 35 }, (_, k) => k - 3);      // out./2026 começa numa quinta (D S T Q Q S S)
const kpis: [string, string, number, string][] = [['olho', 'Alcance', 18420, '+38% vs. média'], ['coracao', 'Curtidas', 1236, '+52%'], ['salvar', 'Salvamentos', 312, '+71%'], ['link', 'Cliques no link', 214, '+24%']];
const ico = (n: string) => (n in i ? i[n as keyof typeof i] : ic(n as 'coracao'));

const t: Trailer = {
  ui: `<div class="mk">
    <aside class="mk-lado">${logo}${[i.chat, i.varinha, ic('imagem'), i.marca, ic('grafico'), i.globo].map((s, k) => `<span class="${k === 1 ? 'on' : ''}">${s}</span>`).join('')}<b class="mk-eu"></b></aside>
    <header class="mk-topo"><div><small>Campanhas /</small><b>Aurora Office · lançamento</b></div><span class="mk-marca"><i>A</i>Construtora Aurora</span>
      <div class="mk-topo-d"><span class="mk-kit">${i.marca} Kit de marca ativo</span><span class="mk-av" style="--a:#7C3AED">MC</span></div></header>
    <nav class="mk-etapas">${etapas.map((e, k) => `<span class="e${k}"><b>${k + 1}</b>${e}</span>${k < 3 ? '<i></i>' : ''}`).join('')}</nav>
    <div class="mk-janela"><div class="mk-linha">
      ${[0, 1, 2, 3].map(k => `<div class="mk-trilho" style="left:${SX + 760 + k * ST}px"><i></i></div>`).join('')}
      <div class="mk-prox" style="left:${SX + 3 * ST + 900}px">${ic('mais')}<b>Próxima peça</b><span>Black Friday · Construtora Aurora<br />rascunho no chat</span></div>
      <section class="mk-st s1" style="left:${SX}px">
        <div class="mk-slot"><div class="mk-gera"><span class="mk-pct">Gerando imagem… <b class="mk-n">0%</b></span></div></div>
        <div class="mk-chat">
          <p class="mk-rot">CHAT · CRIAÇÃO</p><h3>O que você quer fazer hoje?</h3>
          <div class="mk-sug">${[["#FBBF24", "Divulgar um produto", "Uma peça com o seu destaque"], ["#F472B6", "Post de engajamento", "Dica, curiosidade ou bastidor"], ["#60A5FA", "Lançamento", "Imagem, legenda e agenda"], ["#4ADE80", "Data comemorativa", "No tom da sua marca"]].map(([c, a, b]) => `<div><i style="background:${c}"></i><b>${a}</b><small>${b}</small></div>`).join("")}</div>
          <div class="mk-msgs">
            <div class="mk-eu-msg">Post para o lançamento do Aurora Office: salas com vista para o parque. Tom sofisticado, cores da marca.</div>
            <div class="mk-ia-msg"><span class="mk-ia-av">${logo}</span><div><p>Pronto. Usei o kit da Construtora Aurora: cores, fonte e logo.</p>
              <div class="mk-tags"><span>Imagem 4:5</span><span>Legenda</span><span>#AuroraOffice</span></div>
              <p class="mk-leg"><small>LEGENDA</small><em class="mk-leg-txt"></em></p></div></div>
          </div>
          <div class="mk-in"><span class="mk-clip">${i.clipe}</span><span class="mk-campo"><em class="mk-digita"></em><span class="mk-ph">Descreva o post…</span></span><span class="mk-env">${ic('enviar')}</span></div>
        </div>
      </section>
      <section class="mk-st s2" style="left:${SX + ST}px">
        <div class="mk-slot"></div>
        <div class="mk-painel">
          <p class="mk-rot">FLUXO DE APROVAÇÃO</p><h3>Aprovação da peça <span class="mk-st-chip"><em class="mk-st-txt">Aguardando Júlia</em></span></h3>
          <ul class="mk-check">${['Kit de marca conferido · cores, fonte e logo', 'Texto revisado · sem erros', 'Formato do Instagram · 1080 × 1350'].map(c => `<li>${ic('ok')}<span>${c}</span></li>`).join('')}</ul>
          <div class="mk-rev"><span class="mk-av" style="--a:#DB2777">JM</span><div><b>Júlia Mendes <small>Coordenadora de marketing</small></b><p>Ficou ótimo. Pode agendar para amanhã, 18h30.</p></div></div>
          <div class="mk-bts"><span class="mk-bt sec">Pedir ajuste</span><span class="mk-bt mk-aprovar">${ic('ok')} Aprovar</span></div>
          <p class="mk-hist">Criado por Marina Castro às 14:08 · versão 1</p>
        </div>
      </section>
      <section class="mk-st s3" style="left:${SX + ST * 2}px">
        <div class="mk-cel"><div class="mk-cel-tela"><p class="mk-sb"><b>18:30</b><span>●●● ▮</span></p>
          <div class="mk-ig-cab"><span class="mk-ig-av"><i>A</i></span><b>construtoraaurora</b><em>···</em></div>
          <div class="mk-ig-img"></div>
          <div class="mk-ig-acoes">${ic('coracao')}${i.coment}${ic('enviar')}<span>${i.salvar}</span></div>
          <p class="mk-ig-leg"><b>construtoraaurora</b> Sua empresa com vista para o parque. Salas de 38 a 220 m² no Aurora Office. #AuroraOffice</p></div></div>
        <div class="mk-painel">
          <p class="mk-rot">AGENDAMENTO</p><h3>Quando publicar</h3>
          <div class="mk-cal"><p><b>Outubro 2026</b><span>‹ ›</span></p><div class="mk-sem">${'DSTQQSS'.split('').map(x => `<i>${x}</i>`).join('')}</div>
            <div class="mk-dias">${dias.map(n => `<span class="${n < 1 || n > 31 ? 'fora' : ''}${[2, 6, 9, 13, 20].includes(n) ? ' tem' : ''}${n === 14 ? ' hoje' : ''}${n === 15 ? ' d15' : ''}">${n < 1 ? 27 + n + 3 : n > 31 ? n - 31 : n}</span>`).join('')}</div></div>
          <div class="mk-hora"><span class="mk-h">${ic('relogio')} 18:30</span><small>Melhor horário para o seu público</small></div>
          <div class="mk-canais"><span>${i.insta} Instagram <i class="sw on"></i></span><span>${i.face} Facebook <i class="sw on"></i></span></div>
          <span class="mk-bt mk-agendar"><em class="mk-ag-txt">Agendar publicação</em></span>
          <p class="mk-ag-st"><em class="mk-ag-st-txt">Agendado · qui., 15/10, 18:30</em></p>
        </div>
      </section>
      <section class="mk-st s4" style="left:${SX + ST * 3}px">
        <div class="mk-slot"><div class="mk-sobre"><span>${ic('coracao')}<b class="mk-c1">0</b></span><span>${i.salvar}<b class="mk-c2">0</b></span></div></div>
        <div class="mk-painel">
          <p class="mk-rot">ANALYTICS · 7 DIAS</p><h3>Resultado do post <span class="mk-top">Melhor post do mês</span></h3>
          <div class="mk-kpis">${kpis.map(([n, r, , v], k) => `<div class="mk-kpi"><small>${ico(n)} ${r}</small><b class="mk-k${k}">0</b><em>${v}</em></div>`).join('')}</div>
          <div class="mk-graf"><p><b>Alcance por dia</b><span>15/10 a 21/10</span></p>
            <svg viewBox="0 0 330 120" preserveAspectRatio="none"><g class="mk-gr">${[30, 60, 90].map(y => `<line x1="0" x2="330" y1="${y}" y2="${y}"/>`).join('')}</g>
              <path class="mk-area" d="M0 96 L55 40 L110 22 L165 48 L220 66 L275 74 L330 80 L330 120 L0 120 Z"/>
              <polyline class="mk-lin" points="0,96 55,40 110,22 165,48 220,66 275,74 330,80"/></svg>
            <div class="mk-eixo">${['qui.', 'sex.', 'sáb.', 'dom.', 'seg.', 'ter.', 'qua.'].map(x => `<span>${x}</span>`).join('')}</div></div>
        </div>
      </section>
      <div class="mk-peca"><img src="/images/ap-capa.webp" alt="" /><div class="mk-arte"><span class="mk-wm"><i>A</i>AURORA</span><div><b>Sua empresa com vista para o parque.</b><small>Aurora Office · salas de 38 a 220 m²</small><em>Agende sua visita</em></div></div>
        <div class="mk-selo"><b>${ic('ok')} APROVADO</b><small>Júlia Mendes · 14/10, 14:12</small></div></div>
    </div></div>
  </div>`,
  css: `
.t-mkt .mk { position: relative; width: 1280px; height: 800px; overflow: hidden; background: #09090B; color: #EDEDEF; font: 400 13px/1.45 Montserrat, sans-serif; }
.t-mkt .mk svg { width: 16px; height: 16px; flex: none; }
.t-mkt .mk-lado { position: absolute; left: 0; top: 0; bottom: 0; width: 56px; z-index: 6; display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 14px 0; background: #09090B; border-right: 1px solid #18181B; color: #71717A; }
.t-mkt .mk-lado .mk-logo { width: 26px; height: 26px; margin-bottom: 14px; }
.t-mkt .mk-lado > span { width: 34px; height: 34px; border-radius: 9px; display: grid; place-items: center; } .t-mkt .mk-lado > span.on { background: #1C1C20; color: #FAFAFA; }
.t-mkt .mk-eu { margin-top: auto; width: 30px; height: 30px; border-radius: 50%; background: conic-gradient(from 200deg, #60A5FA, #F472B6, #FBBF24, #60A5FA); }
.t-mkt .mk-topo { position: absolute; left: 56px; right: 0; top: 0; height: 52px; z-index: 6; display: flex; align-items: center; gap: 14px; padding: 0 20px; background: #09090B; border-bottom: 1px solid #18181B; }
.t-mkt .mk-topo small { color: #71717A; margin-right: 6px; font-size: 12.5px; } .t-mkt .mk-topo b { font-weight: 600; font-size: 13px; }
.t-mkt .mk-marca { display: inline-flex; align-items: center; gap: 7px; font-size: 12px; color: #D4D4D8; background: #141417; border: 1px solid #222226; border-radius: 99px; padding: 3px 10px 3px 4px; }
.t-mkt .mk-marca i, .t-mkt .mk-ig-av i, .t-mkt .mk-wm i { font-style: normal; width: 20px; height: 20px; border-radius: 50%; display: inline-grid; place-items: center; background: #0F3D3E; color: #E9D8A6; font: 700 10px Montserrat, sans-serif; }
.t-mkt .mk-topo-d { margin-left: auto; display: flex; align-items: center; gap: 12px; }
.t-mkt .mk-kit { display: inline-flex; align-items: center; gap: 6px; font-size: 11.5px; color: #A1A1AA; } .t-mkt .mk-kit svg { color: #F472B6; width: 14px; height: 14px; }
.t-mkt .mk-av { width: 28px; height: 28px; border-radius: 50%; background: var(--a); color: #fff; display: inline-grid; place-items: center; font-size: 10px; font-weight: 700; flex: none; }
.t-mkt .mk-etapas { position: absolute; left: 56px; right: 0; top: 52px; height: 50px; z-index: 6; display: flex; align-items: center; justify-content: center; gap: 12px; background: #09090B; border-bottom: 1px solid #18181B; font-size: 12.5px; color: #71717A; }
.t-mkt .mk-etapas span { display: inline-flex; align-items: center; gap: 8px; padding: 5px 12px 5px 5px; border-radius: 99px; transition: background .3s, color .3s; }
.t-mkt .mk-etapas span b { width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; font-size: 11px; border: 1px solid #2A2A30; }
.t-mkt .mk-etapas span.on { background: #16161A; color: #FAFAFA; box-shadow: inset 0 0 0 1px #2A2A30; } .t-mkt .mk-etapas span.on b { background: #2E8BFF; border-color: #2E8BFF; color: #fff; }
.t-mkt .mk-etapas span.ok { background: none; box-shadow: none; color: #D4D4D8; } .t-mkt .mk-etapas span.ok b { background: #14532D; border-color: #166534; color: #4ADE80; }
.t-mkt .mk-etapas > i { width: 48px; height: 1px; background: #27272A; }
.t-mkt .mk-janela { position: absolute; left: 56px; right: 0; top: 102px; bottom: 0; overflow: hidden; background: radial-gradient(#141418 1px, transparent 1.5px) 0 0 / 22px 22px; }
.t-mkt .mk-linha { position: absolute; left: 0; top: 0; width: 4400px; height: 698px; }
.t-mkt .mk-st { position: absolute; top: 34px; width: 760px; height: 620px; background: #0F0F12; border: 1px solid #1E1E23; border-radius: 18px; }
.t-mkt .mk-trilho { position: absolute; top: 290px; width: 140px; height: 2px; background: repeating-linear-gradient(90deg, #2A2A30 0 8px, transparent 8px 14px); }
.t-mkt .mk-trilho i { position: absolute; right: -2px; top: -4px; width: 10px; height: 10px; border-top: 2px solid #3F3F46; border-right: 2px solid #3F3F46; rotate: 45deg; }
.t-mkt .mk-slot { position: absolute; left: 40px; top: 70px; width: 300px; height: 375px; border-radius: 14px; border: 1px dashed #26262B; }
.t-mkt .mk-gera { position: absolute; inset: 0; border-radius: 14px; background: linear-gradient(110deg, #141418 30%, #1D1D23 50%, #141418 70%) 0 0 / 300% 100%; display: grid; place-items: end start; padding: 14px; }
.t-mkt .mk-pct { font-size: 11.5px; color: #A1A1AA; background: rgba(9,9,11,.7); border-radius: 99px; padding: 4px 10px; } .t-mkt .mk-pct b { color: #FAFAFA; font-variant-numeric: tabular-nums; }
.t-mkt .mk-chat, .t-mkt .mk-painel { position: absolute; left: 380px; top: 30px; right: 30px; bottom: 30px; display: flex; flex-direction: column; }
.t-mkt .mk-rot { margin: 0; font-size: 10px; letter-spacing: .14em; color: #71717A; font-weight: 600; }
.t-mkt .mk h3 { display: flex; align-items: center; gap: 10px; margin: 4px 0 16px; font-size: 19px; font-weight: 700; letter-spacing: -.02em; }
.t-mkt .mk-msgs { flex: 1; display: flex; flex-direction: column; gap: 14px; }
.t-mkt .mk-eu-msg { align-self: flex-end; max-width: 92%; background: #1C1C21; border-radius: 16px 16px 4px 16px; padding: 10px 13px; font-size: 12.5px; color: #E4E4E7; }
.t-mkt .mk-ia-msg { display: flex; gap: 10px; font-size: 12.5px; color: #D4D4D8; } .t-mkt .mk-ia-msg p { margin: 2px 0 8px; }
.t-mkt .mk-ia-av { width: 26px; height: 26px; border-radius: 8px; background: #16161A; display: grid; place-items: center; flex: none; box-shadow: inset 0 0 0 1px #26262B; } .t-mkt .mk-ia-av svg { width: 16px; height: 16px; }
.t-mkt .mk-tags { display: flex; gap: 6px; flex-wrap: wrap; } .t-mkt .mk-tags span { font-size: 11px; color: #A1A1AA; border: 1px solid #27272A; border-radius: 99px; padding: 2px 9px; }
.t-mkt .mk-leg { margin-top: 10px !important; background: #131316; border: 1px solid #222226; border-radius: 10px; padding: 9px 11px; min-height: 74px; line-height: 1.5; }
.t-mkt .mk-leg small { display: block; font-size: 9.5px; letter-spacing: .12em; color: #71717A; font-weight: 600; } .t-mkt .mk-leg em { font-style: normal; }
.t-mkt .mk-in { display: flex; align-items: flex-end; gap: 8px; min-height: 50px; padding: 8px; background: #131316; border: 1px solid #26262B; border-radius: 14px; }
.t-mkt .mk-clip { color: #71717A; display: grid; padding: 0 4px 9px; }
.t-mkt .mk-campo { position: relative; flex: 1; align-self: center; font-size: 12.5px; line-height: 1.45; min-height: 18px; } .t-mkt .mk-campo em { font-style: normal; }
.t-mkt .mk-ph { position: absolute; left: 0; top: 0; color: #52525B; } .t-mkt .mk-campo.tem .mk-ph { opacity: 0; } .t-mkt .mk-campo.saiu em { display: none; } .t-mkt .mk-campo.saiu .mk-ph { opacity: 1; }
.t-mkt .mk-env { width: 34px; height: 34px; border-radius: 10px; background: #2E8BFF; color: #fff; display: grid; place-items: center; }
.t-mkt .mk-st-chip { font-size: 11px; font-weight: 600; letter-spacing: 0; color: #FBBF24; background: #2A2109; border: 1px solid #3F300C; border-radius: 99px; padding: 2px 10px; }
.t-mkt .mk-st-chip.ok { color: #4ADE80; background: #0D2A1A; border-color: #14532D; } .t-mkt .mk-st-chip em { font-style: normal; }
.t-mkt .mk-check { list-style: none; margin: 0 0 16px; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.t-mkt .mk-check li { display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: #131316; border: 1px solid #1F1F24; border-radius: 10px; font-size: 12.5px; color: #D4D4D8; }
.t-mkt .mk-check svg { width: 15px; height: 15px; color: #4ADE80; padding: 2px; border-radius: 50%; background: #0D2A1A; box-sizing: content-box; }
.t-mkt .mk-rev { display: flex; gap: 12px; padding: 14px; background: #131316; border: 1px solid #1F1F24; border-radius: 12px; }
.t-mkt .mk-rev b { display: block; font-size: 13px; font-weight: 600; } .t-mkt .mk-rev b small { font-weight: 400; color: #71717A; font-size: 11.5px; margin-left: 6px; }
.t-mkt .mk-rev p { margin: 4px 0 0; color: #D4D4D8; font-size: 12.5px; }
.t-mkt .mk-bts { display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px; }
.t-mkt .mk-bt { display: inline-flex; align-items: center; justify-content: center; gap: 7px; height: 40px; padding: 0 20px; border-radius: 11px; background: #2E8BFF; color: #fff; font-weight: 600; font-size: 13px; }
.t-mkt .mk-bt.sec { background: #18181B; color: #E4E4E7; box-shadow: inset 0 0 0 1px #27272A; } .t-mkt .mk-bt em { font-style: normal; }
.t-mkt .mk-aprovar.feito { background: #16A34A; }
.t-mkt .mk-hist { margin: auto 0 0; font-size: 11px; color: #52525B; }
.t-mkt .mk-cel { position: absolute; left: 20px; top: 10px; width: 340px; height: 600px; border-radius: 38px; background: #050506; box-shadow: 0 0 0 2px #2A2A30, 0 30px 60px -20px rgba(0,0,0,.8); padding: 8px; }
.t-mkt .mk-cel-tela { position: relative; height: 100%; border-radius: 31px; background: #000; overflow: hidden; }
.t-mkt .mk-sb { display: flex; justify-content: space-between; margin: 0; padding: 8px 22px 0; height: 26px; font-size: 11px; } .t-mkt .mk-sb span { font-size: 8px; letter-spacing: 1px; color: #D4D4D8; }
.t-mkt .mk-ig-cab { display: flex; align-items: center; gap: 8px; height: 44px; padding: 0 12px; font-size: 12px; } .t-mkt .mk-ig-cab b { flex: 1; font-weight: 600; } .t-mkt .mk-ig-cab em { font-style: normal; color: #D4D4D8; }
.t-mkt .mk-ig-av { width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; background: conic-gradient(#FBBF24, #F43F5E, #A855F7, #FBBF24); } .t-mkt .mk-ig-av i { width: 26px; height: 26px; box-shadow: 0 0 0 2px #000; }
.t-mkt .mk-ig-img { height: 405px; background: #0B0B0D; }
.t-mkt .mk-ig-acoes { display: flex; gap: 14px; padding: 10px 12px 4px; } .t-mkt .mk-ig-acoes svg { width: 21px; height: 21px; } .t-mkt .mk-ig-acoes span { margin-left: auto; display: grid; }
.t-mkt .mk-ig-leg { margin: 0; padding: 2px 12px; font-size: 11px; line-height: 1.45; color: #E4E4E7; } .t-mkt .mk-ig-leg b { font-weight: 600; }
.t-mkt .mk-cal { background: #131316; border: 1px solid #1F1F24; border-radius: 12px; padding: 12px 14px; }
.t-mkt .mk-cal > p { display: flex; justify-content: space-between; margin: 0 0 8px; font-size: 13px; } .t-mkt .mk-cal > p span { color: #71717A; letter-spacing: 6px; }
.t-mkt .mk-sem, .t-mkt .mk-dias { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; gap: 3px; }
.t-mkt .mk-sem i { font-style: normal; font-size: 10px; color: #52525B; font-weight: 600; }
.t-mkt .mk-dias span { position: relative; height: 30px; display: grid; place-items: center; border-radius: 8px; font-size: 12px; color: #D4D4D8; font-variant-numeric: tabular-nums; }
.t-mkt .mk-dias .fora { color: #3F3F46; } .t-mkt .mk-dias .hoje { box-shadow: inset 0 0 0 1px #3F3F46; }
.t-mkt .mk-dias .tem::after { content: ''; position: absolute; bottom: 3px; width: 4px; height: 4px; border-radius: 50%; background: #F472B6; }
.t-mkt .mk-dias .d15.on { background: #2E8BFF; color: #fff; font-weight: 700; }
.t-mkt .mk-hora { display: flex; align-items: center; gap: 12px; margin: 12px 0 10px; } .t-mkt .mk-hora small { color: #71717A; font-size: 11.5px; }
.t-mkt .mk-h { display: inline-flex; align-items: center; gap: 6px; font-weight: 600; background: #131316; border: 1px solid #2A2A30; border-radius: 9px; padding: 6px 11px; } .t-mkt .mk-h svg { width: 14px; height: 14px; color: #A1A1AA; }
.t-mkt .mk-canais { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 14px; }
.t-mkt .mk-canais span { display: flex; align-items: center; gap: 8px; padding: 9px 11px; background: #131316; border: 1px solid #1F1F24; border-radius: 10px; font-size: 12.5px; }
.t-mkt .sw { position: relative; margin-left: auto; width: 28px; height: 16px; border-radius: 99px; background: #2E8BFF; } .t-mkt .sw::after { content: ''; position: absolute; right: 2px; top: 2px; width: 12px; height: 12px; border-radius: 50%; background: #fff; }
.t-mkt .mk-agendar.feito { background: #16A34A; }
.t-mkt .mk-ag-st { margin: 10px 0 0; text-align: center; font-size: 12px; color: #4ADE80; }
.t-mkt .mk-ag-st em { font-style: normal; }
.t-mkt .mk-top { font-size: 11px; font-weight: 600; letter-spacing: 0; color: #F9A8D4; background: #2A0F1F; border: 1px solid #4A1636; border-radius: 99px; padding: 2px 10px; }
.t-mkt .mk-kpis { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.t-mkt .mk-kpi { background: #131316; border: 1px solid #1F1F24; border-radius: 12px; padding: 12px 14px; }
.t-mkt .mk-kpi small { display: flex; align-items: center; gap: 6px; color: #A1A1AA; font-size: 11.5px; } .t-mkt .mk-kpi small svg { width: 14px; height: 14px; }
.t-mkt .mk-kpi b { display: block; font-size: 26px; font-weight: 700; letter-spacing: -.02em; margin: 4px 0 0; font-variant-numeric: tabular-nums; }
.t-mkt .mk-kpi em { font-style: normal; font-size: 11px; color: #4ADE80; }
.t-mkt .mk-graf { margin-top: 12px; background: #131316; border: 1px solid #1F1F24; border-radius: 12px; padding: 12px 14px 10px; }
.t-mkt .mk-graf > p { display: flex; justify-content: space-between; margin: 0 0 8px; font-size: 12.5px; } .t-mkt .mk-graf > p span { color: #71717A; font-size: 11px; }
.t-mkt .mk-graf svg { display: block; width: 100%; height: 112px; overflow: visible; }
.t-mkt .mk-gr line { stroke: #222226; stroke-width: 1; vector-effect: non-scaling-stroke; }
.t-mkt .mk-lin { fill: none; stroke: #F472B6; stroke-width: 2.5; stroke-linejoin: round; }
.t-mkt .mk-area { fill: rgba(244,114,182,.12); }
.t-mkt .mk-eixo { display: flex; justify-content: space-between; margin-top: 6px; font-size: 10px; color: #52525B; }
.t-mkt .mk-peca { position: absolute; left: ${SX + 40}px; top: 104px; width: 300px; height: 375px; border-radius: 14px; overflow: hidden; transform-origin: 0 0; box-shadow: 0 24px 50px -18px rgba(0,0,0,.85); z-index: 2; }
.t-mkt .mk-peca img { position: absolute; left: 0; top: -20px; width: 750px; max-width: none; height: 500px; object-fit: cover; display: block; }
.t-mkt .mk-peca.ig { border-radius: 0; } .t-mkt .mk-peca.ig.sai { border-radius: 14px; }
.t-mkt .mk-chat .mk-sug { position: absolute; left: 0; right: 0; top: 74px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.t-mkt .mk-sug div { background: #131316; border: 1px solid #1F1F24; border-radius: 12px; padding: 12px 13px; }
.t-mkt .mk-sug i { display: block; width: 22px; height: 22px; border-radius: 7px; opacity: .85; margin-bottom: 10px; }
.t-mkt .mk-sug b { display: block; font-size: 12.5px; font-weight: 600; } .t-mkt .mk-sug small { color: #71717A; font-size: 11px; }
.t-mkt .mk-prox { position: absolute; top: 104px; width: 300px; height: 375px; border: 1.5px dashed #2A2A30; border-radius: 14px; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 6px; color: #71717A; font-size: 12.5px; text-align: center; }
.t-mkt .mk-prox b { color: #D4D4D8; font-weight: 600; font-size: 13.5px; } .t-mkt .mk-prox svg { width: 26px; height: 26px; color: #52525B; margin-bottom: 4px; }
.t-mkt .mk-arte { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: space-between; padding: 18px; background: linear-gradient(180deg, rgba(6,20,22,.35) 0%, transparent 30%, transparent 45%, rgba(6,20,22,.86) 100%); }
.t-mkt .mk-wm { display: inline-flex; align-items: center; gap: 7px; font: 700 11px Montserrat, sans-serif; letter-spacing: .28em; color: #fff; }
.t-mkt .mk-arte b { display: block; font-size: 25px; line-height: 1.08; font-weight: 800; letter-spacing: -.02em; color: #fff; }
.t-mkt .mk-arte small { display: block; margin: 8px 0 12px; font-size: 11.5px; color: #E9D8A6; font-weight: 500; }
.t-mkt .mk-arte em { display: inline-block; font-style: normal; font-size: 11px; font-weight: 700; color: #0F3D3E; background: #E9D8A6; border-radius: 99px; padding: 5px 12px; }
.t-mkt .mk-selo { position: absolute; right: 14px; top: 56px; padding: 8px 12px; border: 2px solid #4ADE80; border-radius: 10px; background: rgba(5,20,12,.88); color: #4ADE80; rotate: -7deg; }
.t-mkt .mk-selo b { display: flex; align-items: center; gap: 6px; font-size: 15px; font-weight: 800; letter-spacing: .12em; } .t-mkt .mk-selo b svg { width: 16px; height: 16px; }
.t-mkt .mk-selo small { display: block; font-size: 10px; color: #BBF7D0; margin-top: 2px; }
.t-mkt .mk-sobre { position: absolute; left: 0; right: 0; bottom: -46px; display: flex; gap: 10px; }
.t-mkt .mk-sobre span { display: inline-flex; align-items: center; gap: 6px; background: #131316; border: 1px solid #1F1F24; border-radius: 99px; padding: 6px 12px; font-size: 12.5px; } .t-mkt .mk-sobre svg { width: 15px; height: 15px; color: #F472B6; }
.t-mkt .mk-sobre b { font-variant-numeric: tabular-nums; }
`,
  roteiro(f) {
    const tl = f.tl, W = 1280, H = 800;
    const mira = (x: number, y: number, zoom: number, ang: { rx?: number; ry?: number; rz?: number } = {}) => {
      const hw = 846 / zoom, hh = 476 / zoom;
      const cx = hw * 2 >= W ? W / 2 : Math.min(Math.max(x, hw), W - hw), cy = hh * 2 >= H ? H / 2 : Math.min(Math.max(y, hh), H - hh);
      return { ...ang, x: -(cx - W / 2) / W * 100 * zoom, y: -(cy - H / 2) / H * 100 * zoom, zoom };
    };
    const d = (s: number) => `depois+=${s}`;
    const linha = f.$('.mk-linha'), peca = f.$('.mk-peca');
    // posição na tela de um elemento da linha, com a linha deslocada em -k estações
    const alvo = (sel: string, k: number) => { const p = f.pos(sel); return { x: p.x + p.w / 2 - k * ST, y: p.y + p.h * .55 }; };
    const clicar = (sel: string, k: number, at: number, dur = .8) => {
      const a = alvo(sel, k);
      tl.to(f.ponteiro, { x: a.x, y: a.y, autoAlpha: 1, duration: dur, ease: 'power2.inOut' }, d(at));
      tl.fromTo(f.ponteiro.querySelector('i'), { scale: .2, autoAlpha: .9 }, { scale: 2.6, autoAlpha: 0, duration: .5, ease: 'power2.out', immediateRender: false }, d(at + dur))
        .to(f.ponteiro.querySelector('svg'), { scale: .82, duration: .08, yoyo: true, repeat: 1, transformOrigin: '0 0' }, d(at + dur));
    };
    // a peça viaja para a próxima estação e a linha corre junto (travelling)
    const viajar = (k: number, at: number, peca2: gsap.TweenVars = {}) => {
      tl.to(linha, { x: -k * ST, duration: 1.7, ease: 'power3.inOut' }, d(at));
      tl.to(peca, { x: k * ST, duration: 1.7, ease: 'power3.inOut', ...peca2 }, d(at));
      tl.to(peca, { boxShadow: '0 50px 80px -24px rgba(0,0,0,.95)', duration: .5, yoyo: true, repeat: 1, repeatDelay: .7 }, d(at));
      f.camera(mira(640, 440, 1.3, { ry: -6 }), .85, d(at), 'power2.in').camera(mira(640, 440, 1.36), .85, d(at + .85), 'power2.out');
      f.classe(`.mk-etapas .e${k - 1}`, 'ok', d(at + .4)).classe(`.mk-etapas .e${k}`, 'on', d(at + .4));
    };
    // centro na tela da peça (posição de layout) quando a linha está na estação k
    const pc = f.pos('.mk-peca'), pecaC = (dx = 0, dy = 0) => ({ x: pc.x + pc.w / 2 + dx, y: pc.y + pc.h / 2 + dy });

    // estados iniciais
    tl.set(linha, { x: 0 }, 0).set(peca, { x: 0, y: 0, scale: 1, autoAlpha: 0 }, 0);
    tl.set(f.$$('.mk-eu-msg, .mk-ia-msg, .mk-selo, .mk-arte, .mk-ag-st, .mk-sobre'), { autoAlpha: 0 }, 0);
    tl.set(f.$('.mk-peca img'), { filter: 'blur(22px) saturate(.3) brightness(.7)', scale: 1.15 }, 0);
    tl.set(f.$$('.mk-check li, .mk-rev'), { autoAlpha: 0 }, 0).set(f.$('.mk-area'), { autoAlpha: 0 }, 0);
    f.classe('.mk-etapas .e0', 'on', 0);

    // 1 · Crie com IA: o pedido no chat e a imagem nascendo, do borrão ao nítido
    f.passo(1, 'O post nasce no chat, já com as cores e a fonte da marca.', 'depois');
    f.camera(mira(760, 470, 1.55), 1.8, d(.1));
    f.classe('.s1 .mk-campo', 'tem', d(.4)).digitar('.mk-digita', 'Post para o lançamento do Aurora Office: salas com vista para o parque. Tom sofisticado, cores da marca.', d(.4), 44);
    clicar('.s1 .mk-env', 0, 2.2, .7);
    f.classe('.s1 .mk-campo', 'saiu', d(2.95));
    tl.to(f.$('.mk-sug'), { autoAlpha: 0, y: -10, duration: .35 }, d(2.9));
    tl.fromTo(f.$('.mk-eu-msg'), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .4, immediateRender: false }, d(3));
    f.esconderCursor(d(3.2));
    tl.to(f.$('.mk-gera'), { backgroundPosition: '-150% 0', duration: 1.6, ease: 'none' }, d(3.1));
    f.contar('.mk-n', 100, d(3.2), { dur: 2, fmt: n => `${Math.round(n)}%` });
    tl.to(peca, { autoAlpha: 1, duration: .6 }, d(3.4));
    const p0 = pecaC();
    f.camera(mira(p0.x + 120, p0.y + 40, 1.75), 1.8, d(3.2));
    tl.to(f.$('.mk-peca img'), { filter: 'blur(0px) saturate(1) brightness(1)', scale: 1, duration: 2.1, ease: 'power2.inOut' }, d(3.6));
    tl.to(f.$('.mk-gera'), { autoAlpha: 0, duration: .3 }, d(5.3));
    tl.fromTo(f.$('.mk-arte'), { autoAlpha: 0 }, { autoAlpha: 1, duration: .5, immediateRender: false }, d(5.4));
    tl.from(f.$$('.mk-arte > div > *'), { y: 14, autoAlpha: 0, duration: .45, stagger: .1, ease: 'power2.out' }, d(5.5));
    tl.fromTo(f.$('.mk-ia-msg'), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .4, immediateRender: false }, d(5.2));
    f.digitar('.mk-leg-txt', 'Sua empresa com vista para o parque. Salas de 38 a 220 m² no Aurora Office. Agende uma visita.', d(5.6), 70);
    f.camera(mira(640, 440, 1.36), 1.4, d(6.4));

    // 2 · Aprove o conteúdo: a peça segue para a estação de aprovação
    f.passo(2, 'A aprovação acontece aqui. Sem print no WhatsApp.', d(7.6));
    viajar(1, 7.6);
    tl.fromTo(f.$$('.mk-check li'), { autoAlpha: 0, x: 16 }, { autoAlpha: 1, x: 0, duration: .4, stagger: .15, immediateRender: false }, d(9.1));
    tl.fromTo(f.$('.mk-rev'), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .45, immediateRender: false }, d(9.7));
    clicar('.mk-aprovar', 1, 10.3, .8);
    f.classe('.mk-aprovar', 'feito', d(11.1)).texto('.mk-st-txt', 'Aprovado', d(11.1)).classe('.mk-st-chip', 'ok', d(11.1));
    tl.fromTo(f.$('.mk-selo'), { autoAlpha: 0, scale: 1.9 }, { autoAlpha: 1, scale: 1, duration: .35, ease: 'power4.in', immediateRender: false }, d(11.2));
    tl.fromTo(peca, { rotation: 0 }, { rotation: -1.2, duration: .08, yoyo: true, repeat: 3, immediateRender: false }, d(11.55));
    f.esconderCursor(d(11.5));
    f.camera(mira(p0.x + 150, p0.y - 40, 1.8, { ry: 4 }), 1.4, d(11.2));

    // 3 · Publique no Instagram: a peça entra no celular, a data é marcada e o post é agendado
    f.passo(3, 'Aprovada, a peça vai para a agenda do Instagram.', d(13.4));
    tl.to(f.$('.mk-selo'), { autoAlpha: 0, duration: .3 }, d(13.4));
    viajar(2, 13.4, { y: 18, scale: 1.08, x: 2 * ST - 12 });
    tl.from(f.$('.mk-cel'), { scale: .94, autoAlpha: .4, duration: 1.2, ease: 'power2.out' }, d(14.2));
    f.classe('.mk-peca', 'ig', d(14.7)).classe('.mk-peca', 'sai', d(19.4));
    clicar('.mk-dias .d15', 2, 15.2, .8);
    f.classe('.mk-dias .d15', 'on', d(16));
    clicar('.mk-agendar', 2, 16.3, .6);
    f.classe('.mk-agendar', 'feito', d(16.9)).texto('.mk-ag-txt', 'Agendado', d(16.9));
    tl.fromTo(f.$('.mk-ag-st'), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .4, immediateRender: false }, d(17));
    f.esconderCursor(d(17.3));
    f.texto('.mk-ag-st-txt', 'Publicado no Instagram e no Facebook · 15/10, 18:30', d(18.2));
    tl.fromTo(f.$('.mk-ag-st'), { scale: 1 }, { scale: 1.06, duration: .2, yoyo: true, repeat: 1, immediateRender: false }, d(18.2));

    // 4 · Acompanhe os resultados: os números sobem e o gráfico se desenha
    f.passo(4, 'E o resultado de cada post aparece no mesmo lugar.', d(19.2));
    viajar(3, 19.2, { y: 0, scale: 1, x: 3 * ST });
    tl.fromTo(f.$('.mk-sobre'), { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, duration: .4, immediateRender: false }, d(20.8));
    kpis.forEach(([, , v], k) => f.contar(`.mk-k${k}`, v, d(21 + k * .12), { dur: 1.8 }));
    f.contar('.mk-c1', 1236, d(21.1), { dur: 1.8 }).contar('.mk-c2', 312, d(21.2), { dur: 1.8 });
    f.desenhar('.mk-lin', d(21.2), 1.6);
    tl.to(f.$('.mk-area'), { autoAlpha: 1, duration: .8 }, d(22.2));

    f.camera(mira(668, 430, 1.9, { ry: -3 }), 1.8, d(22.4));
    // a linha segue: a próxima peça já espera na estação seguinte
    tl.to(linha, { x: -3 * ST - 260, duration: 2.4, ease: 'power2.inOut' }, d(24.8));
    f.camera(mira(640, 440, 1.3), 2.2, d(24.8));
    f.pausa(.6);
  }
};
export default t;
