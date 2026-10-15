// PominSprint · "O quadro que mente". Tela recriada do PominSprint real (tema claro, barra lateral larga "AGILE DELIVERY").
// Câmera própria: começa no alto, quase de cima (rx 46), e desce em ângulo até ficar na altura dos cards do quadro.
import { ic, W, H, type Trailer, type Filme } from '../filme';
import { svg } from '../../src/data';

const ico = {
  painel: svg('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>'),
  boia: svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="m5.6 5.6 3.6 3.6M14.8 14.8l3.6 3.6M18.4 5.6l-3.6 3.6M9.2 14.8l-3.6 3.6"/>'),
  tarefas: svg('<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 11h6M9 15h4"/>'),
  bandeja: svg('<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>'),
  sair: svg('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>'),
  estrela: svg('<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>'),
  menu: svg('<path d="M12 5h.01M12 12h.01M12 19h.01" stroke-width="3"/>'),
  sol: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  x: svg('<path d="M18 6 6 18M6 6l12 12"/>'),
  raio: svg('<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>')
};

const pessoas: Record<string, [string, string]> = { RN: ['Rafael Nogueira', '#5B4BD6'], MC: ['Marina Castro', '#0E8A7E'], JM: ['Júlia Mendes', '#D9622B'], CF: ['Caio Ferreira', '#2F6FD0'], BL: ['Bruno Lima', '#B0367C'], AP: ['Ana Prado', '#6B8E23'] };
// [chave, título, pontos, épico, responsável]
const backlog: [string, string, number, string, string][] = [
  ['MOT-12', 'Rastreio da entrega em tempo real', 8, 'ras', 'MC'], ['MOT-14', 'Assinatura digital na entrega', 5, 'ent', 'RN'],
  ['MOT-15', 'Foto do canhoto pelo app', 3, 'ent', 'JM'], ['MOT-18', 'Roteiro do dia com paradas', 5, 'ras', 'JM'],
  ['MOT-19', 'Aviso de atraso ao cliente', 3, 'ras', 'CF'], ['MOT-21', 'Login com CPF e senha', 2, 'ace', 'CF'],
  ['MOT-22', 'Modo offline sem sinal', 8, 'ent', 'BL'], ['MOT-25', 'Relatório de quilometragem', 3, 'ace', ''], ['MOT-27', 'Chat com a central', 5, 'ent', '']
];
const colunas = ['A fazer', 'Em andamento', 'Em revisão', 'Concluído'];
type Lista = 'bl' | 'c0' | 'c1' | 'c2' | 'c3';
const PASSO = 71;
const slot = (l: Lista, k: number) => l === 'bl' ? { left: 10, top: 46 + k * PASSO, width: 216 } : { left: 258 + +l[1] * 188, top: 88 + k * PASSO, width: 162 };
const cls = (k: string) => 'm' + k.slice(4);

// burndown: 34 pontos em 10 dias; o real vai até o dia 7
const real = [34, 34, 32, 32, 29, 26, 21];
const bx = (d: number) => 34 + d * 39, by = (p: number) => 12 + (34 - p) / 34 * 140;
const marcos: [string, string, string, string][] = [
  ['Sprint 12', 'Login e cadastro', '03/10', 'ok'], ['Sprint 13', 'Roteiro do dia', '13/10', 'ok'], ['Sprint 14', 'Rastreio em tempo real', '25/10', 'agora'],
  ['Sprint 15', 'Modo offline', '08/11', ''], ['v1.0', 'App nas lojas', '21/11', '']
];

const t: Trailer = {
  ui: `<div class="sp">
    <aside class="sp-lado">
      <div class="sp-marca"><span class="sp-logo">${ic('quadro')}</span><div><b>Pomin<em>Sprint</em></b><small>AGILE DELIVERY</small></div></div>
      <small class="sp-rot">WORKSPACE</small>
      <span class="sp-nav on">${ic('inicio')} Projetos</span><span class="sp-nav">${ico.tarefas} Minhas Tarefas</span><span class="sp-nav">${ico.bandeja} Backlog</span>
      <small class="sp-rot">PROJETOS</small>
      <span class="sp-pj novo"><i style="--a:#6D5AE6"></i>App do Motorista</span><span class="sp-pj"><i style="--a:#0E8A7E"></i>Portal do Cliente</span><span class="sp-pj"><i style="--a:#D9822B"></i>Integração ERP</span>
      <div class="sp-promo"><span>${ico.raio} SPRINT</span><p>Planeje, execute e meça suas sprints com governança.</p></div>
      <div class="sp-eu"><span class="sp-av g" style="--a:#5B4BD6">RN</span><div><b>Rafael Nogueira</b><small>Tech lead · Serra Azul</small></div>${ico.sair}</div>
    </aside>
    <header class="sp-topo"><span>${ico.painel}</span><span class="sp-trilha">Projetos<span class="sp-tr2"> / App do Motorista</span></span>
      <div class="sp-acoes"><span>${ico.boia}</span><span>${ic('sino')}</span><span>${ic('conversa')}</span><span class="sp-tema"><i>${ico.sol}</i></span></div></header>
    <main class="sp-folha">
      <section class="sp-lista">
        <div class="sp-lh"><div><h1>Projetos</h1><p>Gerencie seus projetos ágeis</p></div><span class="sp-btn sp-novo">${ic('mais')} Novo Projeto</span></div>
        <div class="sp-pjs">
          ${[['Portal do Cliente', 'PCL', 'Sprint 9 em andamento · 64%'], ['Integração ERP', 'ERP', 'Sprint 4 em andamento · 38%']].map(([n, k, d], i) => `<div class="sp-pjc"><div><b>${n}</b>${i ? '' : '<span class="sp-pad">Padrão</span>'}${ico.estrela}${ico.menu}</div><code>${k}</code><p>${d}</p></div>`).join('')}
        </div>
      </section>

      <section class="sp-proj">
        <header class="sp-ph"><span class="sp-pic">M</span><div><h1>App do Motorista <code>MOT</code></h1><p>Transportes Serra Azul · 6 pessoas · Scrum</p></div>
          <div class="sp-time">${Object.entries(pessoas).map(([k, [, c]]) => `<span class="sp-av" style="--a:${c}">${k}</span>`).join('')}</div>
          <span class="sp-chip">Sprint 14 · 14 a 25 de out.</span><span class="sp-btn sp-iniciar"><span>Iniciar sprint</span></span></header>
        <nav class="sp-abas"><span class="on">Quadro</span><span>Backlog</span><span>Sprints</span><span>Entregas</span><span>Membros</span></nav>
        <div class="sp-area">
          <div class="sp-bl"><div class="sp-blh"><b>Backlog</b><span class="sp-blq">9 itens · 42 pts</span></div></div>
          <div class="sp-board">
            <div class="sp-sbar"><div><b>Sprint 14</b><span>Meta: rastreio da entrega em tempo real</span></div><span class="sp-vivo"><i></i>Ao vivo · 6 no quadro</span>
              <div class="sp-cap"><span><b class="sp-pts">0</b> / 40 pts</span><div class="sp-capbar"><i></i></div></div></div>
            <div class="sp-cols">${colunas.map((c, k) => `<div class="sp-col k${k}"><div class="sp-colh"><b>${c}</b><span class="sp-n">0</span></div></div>`).join('')}</div>
          </div>
          ${backlog.map(([k, n, p, e, a], i) => { const s = slot('bl', i); return `<div class="sp-card ${cls(k)} ${e}" style="left:${s.left}px;top:${s.top}px;width:${s.width}px"><b>${n}</b><div class="sp-cr"><code>${k}</code><em>${p} pts</em>${a ? `<span class="sp-av s" style="--a:${pessoas[a][1]}">${a}</span>` : ''}<span class="sp-sem"></span></div></div>`; }).join('')}
        </div>
        <div class="sp-gaveta">
          <div class="sp-gh"><b>Entregas · Sprint 14</b><span class="sp-chip">Dia 7 de 10</span>
            <div class="sp-gk"><span>Concluído <b><em class="sp-feito">0</em> de 34 pts</b></span><span>Velocidade média <b>31 pts</b></span><span>Previsão de fechamento <b>24/10</b></span></div></div>
          <div class="sp-gc">
            <div class="sp-burn"><small>Burndown</small>
              <svg viewBox="0 0 430 176"><g class="sp-eixos">${[0, 1, 2, 3].map(k => `<line x1="34" x2="424" y1="${12 + k * 46.7}" y2="${12 + k * 46.7}"/>`).join('')}${[34, 23, 11, 0].map((v, k) => `<text x="26" y="${16 + k * 46.7}" text-anchor="end">${v}</text>`).join('')}${[0, 2, 4, 6, 8, 10].map(d => `<text x="${bx(d)}" y="172" text-anchor="middle">D${d}</text>`).join('')}</g>
                <line class="sp-ideal" x1="${bx(0)}" y1="${by(34)}" x2="${bx(10)}" y2="${by(0)}"/>
                <polyline class="sp-real" points="${real.map((p, d) => `${bx(d)},${by(p).toFixed(1)}`).join(' ')}"/>
                ${real.map((p, d) => `<circle class="sp-pt" cx="${bx(d)}" cy="${by(p).toFixed(1)}" r="3.2"/>`).join('')}
                <line class="sp-hoje" x1="${bx(6)}" x2="${bx(6)}" y1="8" y2="156"/><text class="sp-hojet" x="${bx(6) + 5}" y="20">hoje · 21 pts restantes</text></svg>
              <p><span class="ideal"></span>Ideal <span class="real"></span>Real</p></div>
            <div class="sp-linha"><small>Linha de entregas</small>
              <div class="sp-trilho"><i class="sp-fill"></i>${marcos.map(([s, n, d, st], k) => `<div class="sp-mc ${st} k${k}" style="left:${k * 25}%"><span class="sp-mp">${st === 'ok' ? ic('ok') : ''}</span><b>${s}</b><small>${n}</small><em>${d}</em></div>`).join('')}<span class="sp-hojem">hoje</span></div></div>
          </div>
        </div>
      </section>

      <div class="sp-fundo"></div>
      <div class="sp-modal">
        <div class="sp-mh"><b>Novo projeto</b>${ico.x}</div>
        <label class="sp-f"><small>Nome</small><span class="sp-nome"><i></i></span></label>
        <div class="sp-f2"><label class="sp-f"><small>Chave</small><span class="sp-chave"></span></label><label class="sp-f"><small>Cliente</small><span>Transportes Serra Azul</span></label></div>
        <label class="sp-f"><small>Metodologia</small></label>
        <div class="sp-met"><span class="on"><b>Scrum</b>Sprints com prazo e meta</span><span><b>Kanban</b>Fluxo contínuo</span></div>
        <label class="sp-f"><small>Time</small></label>
        <div class="sp-mt">${Object.entries(pessoas).map(([k, [, c]]) => `<span class="sp-av" style="--a:${c}">${k}</span>`).join('')}<em>6 pessoas</em></div>
        <div class="sp-mf"><span class="sp-btn sec">Cancelar</span><span class="sp-btn sp-criar">Criar projeto</span></div>
      </div>
    </main></div>`,
  css: `
.t-sprint .sp { width: 1280px; height: 800px; display: grid; grid-template-columns: 220px 1fr; grid-template-rows: 56px 1fr; background: #F5F7FA; color: #0F1B2D; font: 400 13px/1.4 Oxanium, sans-serif; }
.t-sprint svg { width: 16px; height: 16px; flex: none; }
.t-sprint .sp-lado { grid-row: 1 / 3; display: flex; flex-direction: column; gap: 3px; padding: 14px 12px; background: #F8FAFC; border-right: 1px solid #E6EBF1; color: #33445A; }
.t-sprint .sp-marca { display: flex; gap: 10px; align-items: center; padding: 0 4px 16px; } .t-sprint .sp-marca b { display: block; font-size: 14.5px; font-weight: 700; } .t-sprint .sp-marca b em { font-style: normal; color: #5B4BD6; }
.t-sprint .sp-marca small { font-size: 9px; letter-spacing: .14em; color: #6B7A90; }
.t-sprint .sp-logo { width: 34px; height: 34px; border-radius: 9px; background: #6D5AE6; color: #fff; display: grid; place-items: center; box-shadow: inset 0 0 0 2px #5340C9; } .t-sprint .sp-logo svg { width: 19px; height: 19px; stroke-width: 2; }
.t-sprint .sp-rot { font-size: 9.5px; letter-spacing: .14em; color: #7B8899; padding: 10px 8px 4px; }
.t-sprint .sp-nav { display: flex; gap: 9px; align-items: center; height: 32px; padding: 0 10px; border-radius: 7px; font-size: 12.5px; }
.t-sprint .sp-nav.on { background: #DCE9F7; box-shadow: inset 0 0 0 1px #B9D1EE; color: #12457F; }
.t-sprint .sp-pj { display: flex; gap: 9px; align-items: center; height: 29px; padding: 0 10px; border-radius: 7px; font-size: 12px; } .t-sprint .sp-pj i { width: 8px; height: 8px; border-radius: 3px; background: var(--a); }
.t-sprint .sp-pj.novo { background: #EEEBFC; color: #3F2FB0; font-weight: 600; }
.t-sprint .sp-promo { margin-top: 14px; border: 1px solid #DCE4ED; background: #EEF4FB; border-radius: 9px; padding: 10px 12px; }
.t-sprint .sp-promo span { display: inline-flex; gap: 4px; align-items: center; font-size: 9.5px; font-weight: 600; letter-spacing: .08em; color: #1D5FA6; background: #DCE9F7; border-radius: 4px; padding: 2px 6px; } .t-sprint .sp-promo svg { width: 11px; height: 11px; }
.t-sprint .sp-promo p { margin: 6px 0 0; font-size: 11.5px; line-height: 1.35; }
.t-sprint .sp-eu { margin-top: auto; display: flex; align-items: center; gap: 9px; padding: 12px 4px 0; border-top: 1px solid #E6EBF1; } .t-sprint .sp-eu b { display: block; font-size: 12px; font-weight: 600; } .t-sprint .sp-eu small { font-size: 10px; color: #6B7A90; } .t-sprint .sp-eu > svg { margin-left: auto; color: #6B7A90; }
.t-sprint .sp-av { width: 26px; height: 26px; border-radius: 50%; background: var(--a); color: #fff; display: inline-grid; place-items: center; font-size: 9.5px; font-weight: 700; flex: none; box-shadow: 0 0 0 2px #fff; }
.t-sprint .sp-av.g { background: #fff; color: var(--a); box-shadow: inset 0 0 0 1.5px var(--a); width: 30px; height: 30px; }
.t-sprint .sp-av.s { width: 20px; height: 20px; font-size: 7.5px; box-shadow: none; }
.t-sprint .sp-topo { display: flex; align-items: center; gap: 14px; padding: 0 18px 0 22px; color: #55657A; }
.t-sprint .sp-trilha { font-size: 13px; color: #6B7A90; } .t-sprint .sp-tr2 { color: #0F1B2D; font-weight: 600; }
.t-sprint .sp-acoes { margin-left: auto; display: flex; gap: 8px; } .t-sprint .sp-acoes > span { width: 32px; height: 32px; display: grid; place-items: center; border: 1px solid #E6EBF1; border-radius: 8px; background: #fff; }
.t-sprint .sp-acoes .sp-tema { width: 54px; border-radius: 99px; justify-content: start; padding-left: 3px; } .t-sprint .sp-tema i { width: 24px; height: 24px; border-radius: 50%; background: #1D5FA6; color: #fff; display: grid; place-items: center; } .t-sprint .sp-tema svg { width: 14px; height: 14px; }
.t-sprint .sp-folha { position: relative; margin: 8px 8px 8px 8px; background: #fff; border: 1px solid #E6EBF1; border-radius: 12px; overflow: hidden; }
.t-sprint .sp-lista, .t-sprint .sp-proj { position: absolute; inset: 0; padding: 20px 26px; }
.t-sprint .sp-lh { display: flex; justify-content: space-between; align-items: flex-start; } .t-sprint h1 { margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -.01em; } .t-sprint .sp-lh p { margin: 2px 0 0; color: #5D6B7E; font-size: 13.5px; }
.t-sprint .sp-btn { display: inline-flex; align-items: center; gap: 7px; height: 36px; padding: 0 16px; border-radius: 8px; background: #1558A6; color: #fff; font-weight: 600; font-size: 12.5px; white-space: nowrap; }
.t-sprint .sp-btn svg { width: 15px; height: 15px; } .t-sprint .sp-btn.sec { background: #fff; color: #0F1B2D; box-shadow: inset 0 0 0 1px #DCE4ED; }
.t-sprint .sp-pjs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 26px; }
.t-sprint .sp-pjc { border: 1px solid #E3E9F0; background: #F8FAFC; border-radius: 10px; padding: 16px 18px; } .t-sprint .sp-pjc > div { display: flex; gap: 8px; align-items: center; } .t-sprint .sp-pjc b { font-weight: 600; font-size: 15px; margin-right: auto; }
.t-sprint .sp-pad { font-size: 11px; font-weight: 600; background: #EEF2F6; border-radius: 99px; padding: 2px 9px; } .t-sprint .sp-pjc code { font: 500 10.5px 'JetBrains Mono', monospace; color: #6B7A90; } .t-sprint .sp-pjc p { margin: 6px 0 0; font-size: 12px; color: #5D6B7E; }
.t-sprint .sp-fundo { position: absolute; inset: 0; background: rgba(15,27,45,.32); }
.t-sprint .sp-modal { position: absolute; left: 50%; top: 92px; width: 470px; margin-left: -235px; background: #fff; border-radius: 14px; padding: 18px 20px; box-shadow: 0 30px 70px rgba(15,27,45,.3); }
.t-sprint .sp-mh { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; } .t-sprint .sp-mh b { font-size: 17px; font-weight: 700; } .t-sprint .sp-mh svg { color: #6B7A90; }
.t-sprint .sp-f { display: flex; flex-direction: column; gap: 4px; margin-top: 10px; } .t-sprint .sp-f small { font-size: 11px; font-weight: 600; color: #4C5B6E; }
.t-sprint .sp-f > span { height: 38px; border: 1px solid #DCE4ED; border-radius: 8px; display: flex; align-items: center; padding: 0 12px; font-size: 13px; }
.t-sprint .sp-nome.foco { border-color: #5B4BD6; box-shadow: 0 0 0 3px #E6E2FB; } .t-sprint .sp-nome i { font-style: normal; } .t-sprint .sp-nome.foco::after { content: ''; width: 1.5px; height: 16px; background: #5B4BD6; margin-left: 1px; }
.t-sprint .sp-chave { font: 600 12.5px 'JetBrains Mono', monospace !important; color: #5B4BD6; }
.t-sprint .sp-f2 { display: grid; grid-template-columns: 120px 1fr; gap: 10px; }
.t-sprint .sp-met { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; } .t-sprint .sp-met span { border: 1px solid #DCE4ED; border-radius: 9px; padding: 9px 12px; font-size: 11.5px; color: #5D6B7E; } .t-sprint .sp-met b { display: block; color: #0F1B2D; font-size: 13px; }
.t-sprint .sp-met .on { border-color: #5B4BD6; background: #F3F1FD; box-shadow: inset 0 0 0 1px #5B4BD6; }
.t-sprint .sp-mt { display: flex; align-items: center; gap: 4px; } .t-sprint .sp-mt em { font-style: normal; font-size: 12px; color: #5D6B7E; margin-left: 8px; }
.t-sprint .sp-mf { display: flex; justify-content: flex-end; gap: 8px; margin-top: 18px; } .t-sprint .sp-criar { background: #5B4BD6; }
.t-sprint .sp-ph { display: flex; align-items: center; gap: 12px; height: 50px; } .t-sprint .sp-ph h1 { font-size: 21px; display: flex; align-items: center; gap: 8px; }
.t-sprint .sp-ph h1 code { font: 600 10.5px 'JetBrains Mono', monospace; color: #5B4BD6; background: #EEEBFC; border-radius: 5px; padding: 2px 6px; } .t-sprint .sp-ph p { margin: 0; font-size: 12px; color: #5D6B7E; }
.t-sprint .sp-ph > div:nth-child(2) { margin-right: auto; }
.t-sprint .sp-pic { width: 38px; height: 38px; border-radius: 10px; background: #6D5AE6; color: #fff; display: grid; place-items: center; font-weight: 700; font-size: 16px; }
.t-sprint .sp-time { display: flex; } .t-sprint .sp-time .sp-av { margin-left: -6px; }
.t-sprint .sp-chip { font-size: 11.5px; color: #33445A; background: #F0F4F8; border-radius: 99px; padding: 4px 11px; white-space: nowrap; }
.t-sprint .sp-iniciar.ativa { background: #148A55; }
.t-sprint .sp-abas { display: flex; gap: 22px; height: 32px; border-bottom: 1px solid #E3E9F0; margin-bottom: 8px; } .t-sprint .sp-abas span { font-size: 12.5px; color: #6B7A90; padding-top: 6px; } .t-sprint .sp-abas .on { color: #3F2FB0; font-weight: 600; border-bottom: 2px solid #5B4BD6; }
.t-sprint .sp-area { position: relative; height: 594px; overflow: hidden; }
.t-sprint .sp-bl { position: absolute; left: 0; top: 0; bottom: 0; width: 236px; background: #F6F8FB; border: 1px solid #E8EDF3; border-radius: 10px; }
.t-sprint .sp-blh { display: flex; justify-content: space-between; align-items: center; padding: 11px 12px; } .t-sprint .sp-blh b { font-weight: 600; } .t-sprint .sp-blh span { font-size: 11px; color: #6B7A90; }
.t-sprint .sp-board { position: absolute; left: 250px; right: 0; top: 0; bottom: 0; }
.t-sprint .sp-sbar { height: 44px; display: flex; align-items: center; gap: 14px; padding: 0 12px; border: 1px solid #E3E9F0; border-radius: 10px; }
.t-sprint .sp-sbar b { font-weight: 600; margin-right: 8px; } .t-sprint .sp-sbar > div:first-child { font-size: 12px; color: #5D6B7E; margin-right: auto; }
.t-sprint .sp-vivo { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #148A55; } .t-sprint .sp-vivo i { width: 7px; height: 7px; border-radius: 50%; background: #16A34A; }
.t-sprint .sp-cap { display: flex; align-items: center; gap: 8px; font-size: 11.5px; color: #5D6B7E; } .t-sprint .sp-cap b { color: #0F1B2D; margin: 0; font-size: 13px; }
.t-sprint .sp-capbar { width: 110px; height: 7px; border-radius: 99px; background: #EEF2F6; overflow: hidden; } .t-sprint .sp-capbar i { display: block; height: 100%; width: 0; background: #5B4BD6; border-radius: inherit; }
.t-sprint .sp-cols { position: absolute; left: 0; right: 0; top: 52px; bottom: 0; display: grid; grid-template-columns: repeat(4, 178px); gap: 10px; }
.t-sprint .sp-col { background: #F4F6FA; border-radius: 10px; } .t-sprint .sp-colh { display: flex; justify-content: space-between; align-items: center; height: 30px; padding: 0 10px; font-size: 12px; }
.t-sprint .sp-colh b { font-weight: 600; } .t-sprint .sp-n { font: 600 10.5px 'JetBrains Mono', monospace; background: #E4E9F0; border-radius: 99px; padding: 1px 7px; }
.t-sprint .k3 .sp-colh b { color: #148A55; }
.t-sprint .sp-card { position: absolute; height: 64px; padding-top: 7px !important; background: #fff; border: 1px solid #DFE6EE; border-left: 3px solid var(--e); border-radius: 8px; padding: 6px 9px 6px 9px; box-shadow: 0 1px 2px rgba(15,27,45,.05); z-index: 1; }
.t-sprint .sp-card.ras { --e: #6D5AE6; } .t-sprint .sp-card.ent { --e: #0E9AA5; } .t-sprint .sp-card.ace { --e: #D9822B; }
.t-sprint .sp-card.movendo { z-index: 3; box-shadow: 0 14px 28px rgba(15,27,45,.2); border-color: #5B4BD6; border-left-color: var(--e); }
.t-sprint .sp-card > b { display: block; font-weight: 500; font-size: 11.5px; line-height: 1.24; margin-top: 1px; height: 29px; overflow: hidden; }
.t-sprint .sp-cr { position: absolute; left: 9px; right: 7px; bottom: 6px; display: flex; gap: 6px; align-items: center; } .t-sprint .sp-cr code { font: 600 9.5px 'JetBrains Mono', monospace; color: #6B7A90; margin-right: auto; } .t-sprint .sp-cr em { font-style: normal; font: 600 9.5px 'JetBrains Mono', monospace; background: #EEEBFC; color: #3F2FB0; border-radius: 4px; padding: 1px 5px; }
.t-sprint .sp-cr .sp-av { display: none; } .t-sprint .sp-sem { width: 18px; height: 18px; border-radius: 50%; border: 1.5px dashed #C9D5E2; }
.t-sprint .sp-card.dono .sp-av { display: inline-grid; } .t-sprint .sp-card.dono .sp-sem { display: none; }
.t-sprint .sp-card.feito > b { color: #6B7A90; } .t-sprint .sp-card.feito .sp-cr code { text-decoration: line-through; }
.t-sprint .sp-gaveta { position: absolute; left: 0; right: 0; bottom: 0; height: 330px; background: #fff; border-top: 1px solid #DCE4ED; border-radius: 16px 16px 0 0; box-shadow: 0 -24px 50px rgba(15,27,45,.14); padding: 16px 26px; z-index: 5; }
.t-sprint .sp-gh { display: flex; align-items: center; gap: 10px; } .t-sprint .sp-gh > b { font-size: 16px; font-weight: 700; }
.t-sprint .sp-gk { margin-left: auto; display: flex; gap: 24px; font-size: 11px; color: #6B7A90; } .t-sprint .sp-gk b { display: block; font-size: 15px; color: #0F1B2D; font-weight: 600; } .t-sprint .sp-gk em { font-style: normal; }
.t-sprint .sp-gc { display: grid; grid-template-columns: 450px 1fr; gap: 26px; margin-top: 12px; }
.t-sprint .sp-gc small { font-size: 10.5px; letter-spacing: .08em; text-transform: uppercase; color: #6B7A90; }
.t-sprint .sp-burn svg { width: 430px; height: 176px; display: block; margin-top: 6px; overflow: visible; }
.t-sprint .sp-eixos line { stroke: #EEF2F6; } .t-sprint .sp-eixos text, .t-sprint .sp-hojet { font: 500 10px Oxanium, sans-serif; fill: #8794A6; }
.t-sprint .sp-ideal { stroke: #A4AFBD; stroke-width: 1.5; stroke-dasharray: 5 5; } .t-sprint .sp-real { fill: none; stroke: #5B4BD6; stroke-width: 2.6; stroke-linejoin: round; } .t-sprint .sp-pt { fill: #fff; stroke: #5B4BD6; stroke-width: 2; }
.t-sprint .sp-hoje { stroke: #D9622B; stroke-width: 1.5; } .t-sprint .sp-hojet { fill: #D9622B; font-weight: 600; }
.t-sprint .sp-burn p { margin: 4px 0 0; display: flex; align-items: center; gap: 6px; font-size: 11px; color: #5D6B7E; } .t-sprint .sp-burn p span { width: 16px; height: 0; border-top: 2px dashed #A4AFBD; } .t-sprint .sp-burn p .real { border-top: 2.6px solid #5B4BD6; margin-left: 10px; }
.t-sprint .sp-trilho { position: relative; height: 4px; background: #EEF2F6; border-radius: 99px; margin: 44px 96px 0 10px; }
.t-sprint .sp-fill { position: absolute; left: 0; top: 0; bottom: 0; width: 59%; background: #5B4BD6; border-radius: inherit; transform-origin: 0 50%; }
.t-sprint .sp-mc { position: absolute; top: -9px; width: 104px; margin-left: -11px; }
.t-sprint .sp-mp { width: 22px; height: 22px; border-radius: 50%; background: #fff; border: 2px solid #C9D5E2; display: grid; place-items: center; color: #fff; } .t-sprint .sp-mp svg { width: 12px; height: 12px; stroke-width: 2.8; }
.t-sprint .sp-mc.ok .sp-mp { background: #16A34A; border-color: #16A34A; } .t-sprint .sp-mc.agora .sp-mp { border-color: #5B4BD6; box-shadow: inset 0 0 0 4px #fff, inset 0 0 0 10px #5B4BD6; }
.t-sprint .sp-mc b { display: block; margin-top: 10px; font-size: 12.5px; font-weight: 600; } .t-sprint .sp-mc small { display: block; text-transform: none; letter-spacing: 0; font-size: 11.5px; color: #33445A; } .t-sprint .sp-mc em { font-style: normal; font: 500 10.5px 'JetBrains Mono', monospace; color: #6B7A90; }
.t-sprint .sp-mc.k4 b { color: #5B4BD6; }
.t-sprint .sp-hojem { position: absolute; left: 59%; top: -30px; transform: translateX(-50%); font-size: 10.5px; font-weight: 600; color: #fff; background: #D9622B; border-radius: 5px; padding: 1px 7px; }
.t-sprint .sp-hojem::after { content: ''; position: absolute; left: 50%; top: 100%; margin-left: -4px; border: 4px solid transparent; border-top-color: #D9622B; }
`,
  roteiro(f: Filme) {
    const tl = f.tl, D = (s: number) => `depois+=${s}`;
    const rad = (a: number) => a * Math.PI / 180;
    // câmera em perspectiva: centraliza o ponto mesmo com rx (o deslocamento vertical encolhe com cos rx)
    const cam = (cx: number, cy: number, zoom: number, ang: { rx?: number; ry?: number; rz?: number } = {}) => {
      const mx = 846 / zoom, my = 476 / zoom;
      const x = mx >= W / 2 ? W / 2 : Math.min(Math.max(cx, mx), W - mx), y = my >= H / 2 ? H / 2 : Math.min(Math.max(cy, my), H - my);
      return { ...ang, x: -(x - W / 2) / W * 100 * zoom, y: -(y - H / 2) / H * 100 * zoom * Math.cos(rad(ang.rx ?? 0)), zoom };
    };
    // Vários f.texto/f.classe no mesmo elemento brigam entre si (cada regra devolve o valor do início).
    // Aqui cada elemento ganha uma regra só: a série de textos e as janelas de classe.
    const textos = new Map<string, [number, string][]>(), janelas = new Map<string, [number, number][]>();
    const texto = (s: string, v: string, at: number) => textos.set(s, [...(textos.get(s) ?? []), [f.quando(D(at)), v]]);
    const janela = (s: string, de: number, ate: number) => janelas.set(s, [...(janelas.get(s) ?? []), [f.quando(D(de)), f.quando(D(ate))]]);
    const aplicar = () => {
      textos.forEach((ps, s) => { const el = f.$(s), ini = el.textContent ?? ''; ps.sort((a, b) => a[0] - b[0]); f.regras.push(() => { const t = tl.time(); let v = ini; for (const [a, x] of ps) if (t >= a) v = x; if (el.textContent !== v) el.textContent = v; }); });
      janelas.forEach((js, s) => { const el = f.$(s); f.regras.push(() => { const t = tl.time(); el.classList.toggle('movendo', js.some(([a, b]) => t >= a && t < b)); }); });
    };
    const area = f.pos('.sp-area');
    const card = (k: string) => f.$(`.sp-card.${cls(k)}`);
    const estado: Record<Lista, string[]> = { bl: backlog.map(b => b[0]), c0: [], c1: [], c2: [], c3: [] };
    // move um card de uma lista para o fim de outra; os de baixo sobem para fechar o espaço
    const mover = (k: string, para: Lista, at: number, dur = .55) => {
      const de = (Object.keys(estado) as Lista[]).find(l => estado[l].includes(k))!, i = estado[de].indexOf(k);
      estado[de].splice(i, 1); estado[para].push(k);
      const alvo = slot(para, estado[para].length - 1);
      tl.to(card(k), { ...alvo, duration: dur, ease: 'power3.inOut' }, D(at));
      estado[de].slice(i).forEach((o, j) => tl.to(card(o), { top: slot(de, i + j).top, duration: .4, ease: 'power2.out' }, D(at + .15)));
      janela(`.sp-card.${cls(k)}`, at, at + dur);
      for (const l of [de, para]) if (l !== 'bl') texto(`.sp-col.k${l[1]} .sp-n`, String(estado[l].length), at + dur * .6);
      return { x: area.x + alvo.left + alvo.width - 26, y: area.y + alvo.top + 18 };
    };
    const entre = (s: string, c: string, de: number, ate: number) => {
      const a = f.quando(D(de)), b = f.quando(D(ate)), els = f.$$(s);
      f.regras.push(() => { const t = tl.time(), on = t >= a && t < b; els.forEach(e => e.classList.toggle(c, on)); });
    };

    tl.set(f.$$('.sp-proj, .sp-modal, .sp-fundo, .sp-tr2, .sp-pj.novo'), { autoAlpha: 0 }, 0);
    tl.set(f.$('.sp-gaveta'), { yPercent: 104 }, 0);

    // 1 · Crie o projeto (vista do alto, quase de cima)
    f.passo(1, 'Um projeto novo em segundos: nome, método e o time.', 'depois');
    f.camera(cam(750, 360, 1.62, { rx: 46, rz: -5 }), 2.2, 'depois', 'power2.inOut');
    f.cursor('.sp-novo', D(.2), true, .8);
    tl.to(f.$$('.sp-fundo'), { autoAlpha: 1, duration: .3 }, D(1.05)).fromTo(f.$('.sp-modal'), { autoAlpha: 0, scale: .95, y: 10 }, { autoAlpha: 1, scale: 1, y: 0, duration: .4, ease: 'power3.out', immediateRender: false }, D(1.05));
    entre('.sp-nome', 'foco', 1.4, 3.3);
    f.digitar('.sp-nome i', 'App do Motorista', D(1.45), 30);
    f.texto('.sp-chave', 'MOT', D(2.05));
    tl.from(f.$$('.sp-mt .sp-av'), { scale: 0, duration: .3, stagger: .06, ease: 'back.out(2.5)' }, D(2.1));
    f.cursor('.sp-criar', D(2.5), true, .8);
    tl.to(f.$$('.sp-modal, .sp-fundo'), { autoAlpha: 0, duration: .3 }, D(3.4));
    tl.to(f.$('.sp-lista'), { autoAlpha: 0, duration: .3 }, D(3.45)).to(f.$('.sp-proj'), { autoAlpha: 1, duration: .45 }, D(3.5));
    tl.to(f.$$('.sp-tr2, .sp-pj.novo'), { autoAlpha: 1, duration: .4 }, D(3.6));
    f.entra('.sp-card', D(3.7), { stagger: .04, y: 10 });

    // 2 · Planeje a sprint: os itens do backlog vão para a sprint, com pontos
    f.passo(2, 'Arraste do backlog para a sprint. Os pontos somam até a capacidade do time.', D(4.6));
    f.camera(cam(560, 470, 1.62, { rx: 40, rz: -3 }), 2, D(4.3));
    const plano = ['MOT-12', 'MOT-14', 'MOT-15', 'MOT-18', 'MOT-19', 'MOT-21', 'MOT-22'];
    let soma = 0, t0 = 5;
    plano.forEach((k, n) => {
      const i = estado.bl.indexOf(k), s = slot('bl', i), at = t0 + n * .62;
      tl.to(f.ponteiro, { x: area.x + s.left + s.width - 30, y: area.y + s.top + 18, autoAlpha: 1, duration: .22, ease: 'power2.out' }, D(at - .24));
      const fim = mover(k, 'c0', at, .42);
      tl.to(f.ponteiro, { x: fim.x, y: fim.y, duration: .42, ease: 'power3.inOut' }, D(at));
      soma += backlog.find(b => b[0] === k)![2];
      texto('.sp-pts', String(soma), at + .42);
      tl.to(f.$('.sp-capbar i'), { width: `${soma / 40 * 100}%`, duration: .3 }, D(at + .42));
    });
    f.texto('.sp-blq', '2 itens · 8 pts', D(t0 + 7 * .62));
    f.camera(cam(700, 430, 1.5, { rx: 32, rz: -1 }), 1.8, D(8.6), 'power1.inOut');
    f.cursor('.sp-iniciar', D(9.2), true, .7);
    f.classe('.sp-iniciar', 'ativa', D(9.9)).texto('.sp-iniciar span', 'Sprint ativa', D(9.9));
    plano.forEach((k, n) => f.classe(`.sp-card.${cls(k)}`, 'dono', D(10 + n * .06)));

    // 3 · Acompanhe o quadro: a câmera desce até a altura dos cards, que andam sozinhos
    f.passo(3, 'Cada um move o próprio card. O quadro mostra o que acontece agora.', D(10.6));
    f.esconderCursor(D(10.2));
    f.camera(cam(area.x + 250 + 188 + 178, area.y + 250, 1.75, { rx: 8, ry: -5 }), 2.4, D(10.3), 'power2.inOut');
    const passos: [string, Lista][] = [['MOT-21', 'c1'], ['MOT-12', 'c1'], ['MOT-15', 'c1'], ['MOT-21', 'c2'], ['MOT-14', 'c1'], ['MOT-15', 'c2'], ['MOT-21', 'c3'],
      ['MOT-19', 'c1'], ['MOT-15', 'c3'], ['MOT-14', 'c2'], ['MOT-19', 'c2'], ['MOT-14', 'c3'], ['MOT-19', 'c3'], ['MOT-18', 'c1']];
    let feito = 0;
    passos.forEach(([k, l], n) => {
      const at = 11 + n * .42;
      mover(k, l, at, .55);
      if (l === 'c3') { feito += backlog.find(b => b[0] === k)![2]; f.classe(`.sp-card.${cls(k)}`, 'feito', D(at + .5)); }
    });
    f.camera(cam(area.x + 250 + 2 * 188 + 178, area.y + 230, 1.8, { rx: 0, ry: 3 }), 3.2, D(12.8), 'power1.inOut');
    aplicar();

    // 4 · Visualize as entregas: burndown e linha de entregas
    f.passo(4, 'O burndown e a linha de entregas contam a verdade da sprint.', D(17.2));
    tl.to(f.$('.sp-gaveta'), { yPercent: 0, duration: .9, ease: 'power3.out' }, D(17));
    f.camera(cam(750, 590, 1.35, { rx: -6 }), 1.8, D(16.9));
    f.contar('.sp-feito', feito, D(17.6), { dur: 1 });
    f.desenhar('.sp-real', D(17.8), 1.6);
    tl.from(f.$$('.sp-pt'), { scale: 0, transformOrigin: '50% 50%', duration: .25, stagger: .22, ease: 'back.out(3)' }, D(17.85));
    tl.from(f.$$('.sp-hoje, .sp-hojet'), { autoAlpha: 0, duration: .4 }, D(19.4));
    tl.from(f.$('.sp-fill'), { scaleX: 0, duration: 2, ease: 'power2.inOut' }, D(19.2));
    tl.from(f.$('.sp-hojem'), { left: '0%', autoAlpha: 0, duration: 2, ease: 'power2.inOut' }, D(19.2));
    f.entra('.sp-mc', D(19.2), { stagger: .3, y: 8 });
    f.camera(cam(980, 600, 1.45, { rx: -4 }), 2, D(19.3), 'power1.inOut');
    f.camera({ zoom: 1 }, 2, D(21.8));
    f.pausa(1.4);
  }
};
export default t;
