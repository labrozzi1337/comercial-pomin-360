// PominGoverna · "A auditoria chega amanhã". Tela recriada da Central de Governança real (tema claro, herói azulado).
// Câmera própria: sobrevoo inclinado da matriz de riscos (rx forte), que se aplaina quando os riscos saem do vermelho.
import { ic, W, H, type Trailer, type Filme } from '../filme';
import { svg } from '../../src/data';

const ico = {
  pontos: svg('<path d="M5 5h.01M12 5h.01M19 5h.01M5 12h.01M12 12h.01M19 12h.01M5 19h.01M12 19h.01M19 19h.01" stroke-width="3"/>'),
  painel: svg('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>'),
  livros: svg('<path d="M4 4v16M8 4v16M12 4l4 16M17 4l3 15"/>'),
  boia: svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="m5.6 5.6 3.6 3.6M14.8 14.8l3.6 3.6M18.4 5.6l-3.6 3.6M9.2 14.8l-3.6 3.6"/>'),
  lua: svg('<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>'),
  clipe: svg('<path d="m21 11-8.5 8.5a5 5 0 0 1-7-7L14 4a3.3 3.3 0 0 1 4.7 4.7L10.2 17a1.7 1.7 0 0 1-2.4-2.4L15.5 7"/>'),
  x: svg('<path d="M18 6 6 18M6 6l12 12"/>'),
  grade: svg('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>'),
  brilho: svg('<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/>'),
  prancheta: svg('<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 11h6M9 15h4"/>')
};

// ---------- Riscos: [código, probabilidade, impacto, deslocamento no quadrado] ----------
type Risco = [string, number, number, number, number];
const riscos: Risco[] = [
  ['R-07', 4, 5, 0, 0], ['R-11', 5, 4, 0, 0], ['R-03', 4, 4, 0, 0],
  ['R-02', 3, 4, -14, -10], ['R-16', 3, 4, 14, 10], ['R-09', 4, 3, 0, 0], ['R-14', 2, 5, 0, 0], ['R-05', 5, 2, 0, 0],
  ['R-01', 3, 3, 0, 0], ['R-06', 2, 4, 0, 0], ['R-12', 3, 2, 0, 0], ['R-18', 2, 3, 0, 0], ['R-20', 1, 5, 0, 0], ['R-04', 4, 2, 0, 0],
  ['R-08', 1, 2, 0, 0], ['R-10', 2, 2, -16, -12], ['R-22', 2, 2, 16, -12], ['R-13', 1, 3, -14, 0], ['R-15', 1, 1, 0, 0], ['R-17', 2, 1, 0, 0], ['R-19', 1, 4, -14, 0], ['R-21', 3, 1, 0, 0]
];
// para onde cada risco crítico vai depois de tratado
const destino: Record<string, [number, number, number, number]> = { 'R-07': [1, 4, 14, 0], 'R-11': [2, 2, 0, 14], 'R-03': [1, 3, 14, 0] };
const CEL = 80, GAP = 4, PASSO = CEL + GAP, R = 13;
const px = (p: number, i: number, dx: number, dy: number) => ({ left: (i - 1) * PASSO + CEL / 2 + dx - R, top: (5 - p) * PASSO + CEL / 2 + dy - R });
const zona = (s: number) => s >= 15 ? 'cri' : s >= 10 ? 'alt' : s >= 5 ? 'mod' : 'bai';

const politicas: [string, string, string, string][] = [
  ['Código de Conduta', 'v2.1 · Marina Castro · revisada 02/10', 'Vigente', 'ok'],
  ['Gestão de Fornecedores', 'v2.0 · Rafael Nogueira · revisão em 20/10', 'Revisar', 'al']
];
const itens: [string, string][] = [
  ['Lista mestra atualizada', 'lista_mestra.pdf'], ['Treinamentos registrados', 'treinos_set.xlsx'], ['Fornecedores avaliados', 'avaliacao_q3.pdf'],
  ['Acessos revisados', 'acessos_out.csv'], ['Restauração de backup', ''], ['Calibração em dia', 'certificados.pdf']
];
const historico: [string, string, string, string][] = [
  ['21:12', 'JM', '#2F6FD0', 'Publicou a Política de Segurança v4.0. A v3.2 fica arquivada.'],
  ['21:14', 'JM', '#2F6FD0', 'Auditoria interna: restauração de backup não conforme, ligada ao R-07.'],
  ['21:16', 'JM', '#2F6FD0', 'Criou o PA-031 para o R-07. Dono: Caio Ferreira.'],
  ['21:48', 'CF', '#0E8A7E', 'Concluiu o PA-031 e anexou restauracao_14-10.pdf.'],
  ['21:50', 'JM', '#2F6FD0', 'Reavaliou R-07, R-11 e R-03: os três saíram do vermelho.']
];

const t: Trailer = {
  ui: `<div class="gv">
    <aside class="gv-lado"><span class="gv-logo">${ic('escudo')}</span><span class="on">${ic('inicio')}</span><span>${ico.livros}</span></aside>
    <header class="gv-topo"><span>${ico.pontos}</span><span>${ico.painel}</span><b>Central de Governança</b>
      <div class="gv-busca">${ic('busca')}<span>Buscar páginas, planos ou ações…</span><kbd>Ctrl Q</kbd></div>
      <div class="gv-acoes">${ic('sino')}${ico.boia}${ico.lua}<span class="gv-av">JM</span><div><b>Júlia Mendes</b><small>Compliance · Construtora Aurora</small></div></div></header>
    <main class="gv-corpo">
      <section class="gv-heroi" data-r>
        <div><small>Quarta-feira, 14 de outubro</small><h1>Boa noite, Júlia</h1><p>Acompanhe o SGI, seus compromissos e os recursos de governança.</p></div>
        <div class="gv-hbt"><span class="gv-btn">${ic('ok')}<span class="gv-pend">3 pendências</span></span><span class="gv-btn">${ico.brilho} Resumo semanal do SGI</span><span class="gv-btn sec">${ic('alerta')} Meus riscos</span></div>
        <div class="gv-aud"><small>AUDITORIA EXTERNA · ISO 9001</small><b>Amanhã, 15/10, às 9h</b><span>Riscos críticos abertos: <em class="gv-abertos">3</em></span></div>
      </section>

      <section class="gv-card gv-pol" data-r>
        <div class="gv-ch">${ic('doc')}<b>Políticas</b><span class="gv-chip">12 vigentes</span><a>Ver todas</a></div>
        <div class="gv-p1"><div class="gv-pl"><b>Segurança da Informação</b><span class="gv-st al gv-pst">Em aprovação</span></div>
          <div class="gv-vers"><span class="v4"><i></i><b>v4.0</b><span class="gv-v4t">rascunho</span></span><span class="v3"><i></i><b>v3.2</b><span class="gv-v3t">vigente desde 03/2025</span></span><span class="gv-btn pub">Publicar v4.0</span></div>
          <small>Dono: Júlia Mendes · aprovação de Rafael Nogueira</small></div>
        ${politicas.map(([n, d, s, c]) => `<div class="gv-pr"><div><b>${n}</b><small>${d}</small></div><span class="gv-st ${c}">${s}</span></div>`).join('')}
      </section>

      <section class="gv-card gv-audi" data-r>
        <div class="gv-ch">${ico.prancheta}<b>Auditoria interna · ISO 9001</b><span class="gv-chip"><em class="gv-feitos">0</em> de 6</span></div>
        <p class="gv-asub">Preparação para a auditoria externa · checklist com evidências</p>
        ${itens.map(([n, e], k) => `<div class="gv-it i${k + 1}"><span class="gv-ck">${e ? ic('ok') : ico.x}</span><b>${n}</b>${e ? `<span class="gv-ev">${ico.clipe}${e}</span>` : `<span class="gv-nc">Não conforme · R-07</span>`}</div>`).join('')}
      </section>

      <section class="gv-card gv-mat" data-r>
        <div class="gv-ch">${ico.grade}<b>Matriz de riscos</b><span class="gv-chip">22 ativos</span><span class="gv-filtros"><span class="on">Todos</span><span>Acessos</span><span>Fornecedores</span><span>TI</span></span></div>
        <div class="gv-mbox">
          <span class="gv-eixo y">Probabilidade</span><div class="gv-ny">${[5, 4, 3, 2, 1].map(n => `<span>${n}</span>`).join('')}</div>
          <div class="gv-grade">
            ${[5, 4, 3, 2, 1].map(p => [1, 2, 3, 4, 5].map(i => `<span class="gv-cel ${zona(p * i)}"></span>`).join('')).join('')}
            ${Object.keys(destino).map(c => { const q = riscos.find(r => r[0] === c)!, o = px(q[1], q[2], q[3], q[4]); return `<span class="gv-rastro r${c.slice(2)}" style="left:${o.left}px;top:${o.top}px"></span>`; }).join('')}
            ${riscos.map(([c, p, i, dx, dy]) => { const o = px(p, i, dx, dy); return `<span class="gv-dot ${zona(p * i)} r${c.slice(2)}" style="left:${o.left}px;top:${o.top}px"><i></i>${c.slice(2)}</span>`; }).join('')}
            <div class="gv-dica"><small>R-07 · TI</small><b>Backup sem teste de restauração</b><span>Probabilidade 4 × Impacto 5 = <em>20</em></span><span class="gv-semplano">${ic('alerta')} Sem plano de ação</span></div>
          </div>
          <div class="gv-nx">${[1, 2, 3, 4, 5].map(n => `<span>${n}</span>`).join('')}</div><span class="gv-eixo x">Impacto</span>
        </div>
        <div class="gv-resumo"><span class="cri"><i></i>Crítico <b class="gv-ncri">0</b></span><span class="alt"><i></i>Alto <b class="gv-nalt">0</b></span><span class="mod"><i></i>Moderado <b class="gv-nmod">0</b></span><span class="bai"><i></i>Baixo <b class="gv-nbai">0</b></span></div>
      </section>

      <section class="gv-card gv-plano" data-r>
        <div class="gv-ch">${ic('ok')}<b>Plano de ação</b><span class="gv-chip gv-pa">PA-031</span><span class="gv-st al gv-pst2">Em andamento</span></div>
        <p class="gv-vazio">Escolha um risco crítico para criar o plano.</p>
        <div class="gv-pcorpo">
          <div class="gv-prisco"><span class="gv-dot cri mini">07</span><b>Backup sem teste de restauração</b><em>Crítico 20</em></div>
          <small class="gv-rot">Ação</small><p class="gv-acao"></p>
          <div class="gv-pdados"><span><small class="gv-rot">Dono</small><b><i class="gv-av s" style="--a:#0E8A7E">CF</i>Caio Ferreira</b></span><span><small class="gv-rot">Prazo</small><b>14/10, 22h</b></span><span><small class="gv-rot">Residual</small><b class="gv-res">—</b></span></div>
          <div class="gv-prog"><i></i></div>
          <div class="gv-outros">
            <div><b>PA-032</b><span>Revogar 4 acessos de desligados</span><i class="gv-av s" style="--a:#7C5CE0">RN</i><em>Concluído</em></div>
            <div><b>PA-033</b><span>Atualizar cadastro do fornecedor de aço</span><i class="gv-av s" style="--a:#D9822B">MC</i><em>Concluído</em></div>
          </div>
        </div>
      </section>

      <section class="gv-card gv-hist" data-r>
        <div class="gv-ch">${ic('relogio')}<b>Histórico</b><span class="gv-chip">trilha de auditoria</span></div>
        ${historico.map(([h, a, c, txt]) => `<div class="gv-h"><code>${h}</code><i class="gv-av s" style="--a:${c}">${a}</i><span>${txt}</span></div>`).join('')}
      </section>
    </main></div>`,
  css: `
.t-governa .gv { width: 1280px; height: 800px; display: grid; grid-template-columns: 48px 1fr; grid-template-rows: 56px 1fr; background: #F6F8FB; color: #0F1B2D; font: 400 13px/1.4 Oxanium, sans-serif; }
.t-governa svg { width: 17px; height: 17px; flex: none; }
.t-governa .gv-lado { grid-row: 1 / 3; display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 10px 0; background: #fff; border-right: 1px solid #E6EBF1; color: #4C5B6E; }
.t-governa .gv-lado > span { width: 32px; height: 32px; display: grid; place-items: center; border-radius: 8px; }
.t-governa .gv-lado .on { background: #E4EEF9; color: #1D5FA6; }
.t-governa .gv-lado .gv-logo { background: #1F6FD0; color: #fff; margin-bottom: 14px; box-shadow: inset 0 0 0 2px #1857A6; } .t-governa .gv-logo svg { stroke-width: 2; }
.t-governa .gv-topo { display: flex; align-items: center; gap: 16px; padding: 0 20px 0 22px; background: #fff; border-bottom: 1px solid #E6EBF1; color: #55657A; }
.t-governa .gv-topo > b { color: #0F1B2D; font-weight: 600; font-size: 13.5px; }
.t-governa .gv-busca { margin-left: 110px; width: 420px; height: 34px; border: 1px solid #E1E7EE; border-radius: 9px; display: flex; align-items: center; gap: 9px; padding: 0 12px; font-size: 12.5px; color: #7B8899; }
.t-governa .gv-busca svg { width: 15px; height: 15px; } .t-governa .gv-busca span { flex: 1; } .t-governa .gv-busca kbd { font: 500 9.5px 'JetBrains Mono', monospace; border: 1px solid #E1E7EE; border-radius: 4px; padding: 1px 5px; }
.t-governa .gv-acoes { margin-left: auto; display: flex; align-items: center; gap: 16px; } .t-governa .gv-acoes b { display: block; color: #0F1B2D; font-size: 12px; font-weight: 600; } .t-governa .gv-acoes small { font-size: 10.5px; }
.t-governa .gv-av { width: 30px; height: 30px; border-radius: 50%; background: var(--a, #2F6FD0); color: #fff; display: inline-grid; place-items: center; font-size: 10.5px; font-weight: 700; font-style: normal; flex: none; }
.t-governa .gv-av.s { width: 20px; height: 20px; font-size: 8px; }
.t-governa .gv-corpo { position: relative; display: grid; grid-template-columns: 330px 488px 1fr; grid-template-rows: 96px 284px 1fr; gap: 14px; padding: 18px 22px; }
.t-governa .gv-heroi { grid-column: 1 / -1; display: flex; align-items: center; gap: 22px; padding: 0 26px; border-radius: 16px; background: linear-gradient(100deg, #DDEAF8 0%, #EAF2FB 55%, #E2EDF9 100%); }
.t-governa .gv-heroi > div:first-child { flex: 1; } .t-governa .gv-heroi small { color: #1D5FA6; font-size: 12px; }
.t-governa .gv-heroi h1 { margin: 0; font-size: 25px; font-weight: 700; letter-spacing: -.01em; } .t-governa .gv-heroi p { margin: 1px 0 0; color: #4C5B6E; font-size: 12px; }
.t-governa .gv-hbt { display: flex; gap: 8px; }
.t-governa .gv-btn { display: inline-flex; align-items: center; gap: 7px; height: 34px; padding: 0 15px; border-radius: 99px; background: #1C5FAE; color: #fff; font-weight: 600; font-size: 12px; white-space: nowrap; box-shadow: 0 4px 10px rgba(28,95,174,.2); }
.t-governa .gv-btn svg { width: 14px; height: 14px; } .t-governa .gv-btn.sec { background: #fff; color: #0F1B2D; box-shadow: inset 0 0 0 1px #DCE4ED; }
.t-governa .gv-aud { border-left: 1px solid #C9DAEE; padding-left: 20px; min-width: 230px; } .t-governa .gv-aud small { display: block; color: #4C5B6E; font-size: 10px; letter-spacing: .1em; }
.t-governa .gv-aud b { display: block; font-size: 18px; font-weight: 500; margin: 2px 0; } .t-governa .gv-aud span { font-size: 12px; color: #4C5B6E; } .t-governa .gv-aud em { font-style: normal; font-weight: 700; color: #C42020; }
.t-governa .gv-aud.ok em { color: #148A55; }
.t-governa .gv-card { position: relative; background: #fff; border: 1px solid #E3E9F0; border-radius: 14px; padding: 14px 16px; }
.t-governa .gv-ch { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; } .t-governa .gv-ch > svg { color: #1D5FA6; } .t-governa .gv-ch b { font-weight: 600; font-size: 14px; }
.t-governa .gv-ch a { margin-left: auto; color: #1D5FA6; font-size: 11.5px; }
.t-governa .gv-chip { font-size: 10.5px; color: #4C5B6E; background: #F0F4F8; border-radius: 99px; padding: 1px 8px; white-space: nowrap; } .t-governa .gv-chip em { font-style: normal; font-weight: 700; }
.t-governa .gv-st { margin-left: auto; font-size: 10.5px; font-weight: 600; border-radius: 99px; padding: 2px 9px; white-space: nowrap; }
.t-governa .gv-st.ok { color: #148A55; background: #DDF4E8; } .t-governa .gv-st.al { color: #B26B00; background: #FDF0D9; }
.t-governa .gv-pol { grid-column: 1; grid-row: 2; }
.t-governa .gv-p1 { border: 1px solid #D4E2F1; background: #F7FAFE; border-radius: 10px; padding: 9px 11px; margin-bottom: 4px; }
.t-governa .gv-pl { display: flex; align-items: center; } .t-governa .gv-pl b { font-weight: 600; font-size: 12.5px; }
.t-governa .gv-p1 > small { display: block; margin-top: 6px; color: #6B7A90; font-size: 10.5px; }
.t-governa .gv-vers { display: flex; gap: 6px; align-items: center; margin-top: 7px; }
.t-governa .gv-vers > span:not(.gv-btn) { display: flex; gap: 5px; align-items: center; font-size: 10.5px; color: #4C5B6E; background: #fff; border: 1px solid #E3E9F0; border-radius: 6px; padding: 2px 7px; white-space: nowrap; }
.t-governa .gv-vers i { width: 6px; height: 6px; border-radius: 50%; background: #B26B00; } .t-governa .gv-vers .v3 i { background: #148A55; }
.t-governa .gv-vers b { font: 600 10.5px 'JetBrains Mono', monospace; color: #0F1B2D; }
.t-governa .gv-btn.pub { height: 26px; padding: 0 11px; margin-left: auto; font-size: 11px; border-radius: 7px; }
.t-governa .gv-p1.pronto .v4 i { background: #148A55; } .t-governa .gv-p1.pronto .v3 i { background: #A4AFBD; } .t-governa .gv-p1.pronto .v3 { opacity: .6; text-decoration: line-through; }
.t-governa .gv-p1.pronto .gv-pst { color: #148A55; background: #DDF4E8; } .t-governa .gv-p1.pronto .pub { background: #148A55; }
.t-governa .gv-pr { display: flex; align-items: center; gap: 8px; padding: 8px 2px; border-top: 1px solid #EEF2F6; }
.t-governa .gv-pr b { display: block; font-weight: 600; font-size: 12.5px; } .t-governa .gv-pr small { color: #6B7A90; font-size: 10.5px; }
.t-governa .gv-audi { grid-column: 1; grid-row: 3; }
.t-governa .gv-asub { margin: -6px 0 8px; color: #6B7A90; font-size: 11px; }
.t-governa .gv-it { display: flex; align-items: center; gap: 9px; padding: 7px 0; border-top: 1px solid #EEF2F6; font-size: 12px; }
.t-governa .gv-it b { font-weight: 500; flex: 1; white-space: nowrap; }
.t-governa .gv-ck { width: 19px; height: 19px; border-radius: 50%; border: 1.5px solid #C9D5E2; display: grid; place-items: center; color: transparent; }
.t-governa .gv-ck svg { width: 12px; height: 12px; stroke-width: 2.6; }
.t-governa .gv-it.ok .gv-ck { background: #16A34A; border-color: #16A34A; color: #fff; } .t-governa .gv-it.nc .gv-ck { background: #DC2626; border-color: #DC2626; color: #fff; }
.t-governa .gv-ev { display: flex; align-items: center; gap: 4px; font: 500 10px 'JetBrains Mono', monospace; color: #1D5FA6; background: #EAF2FB; border-radius: 5px; padding: 2px 6px; } .t-governa .gv-ev svg { width: 11px; height: 11px; }
.t-governa .gv-nc { font-size: 10.5px; font-weight: 600; color: #C42020; background: #FDE3E3; border-radius: 5px; padding: 2px 7px; }
.t-governa .gv-mat { grid-column: 2; grid-row: 2 / 4; overflow: visible; z-index: 3; }
.t-governa .gv-filtros { margin-left: auto; display: flex; gap: 4px; } .t-governa .gv-filtros span { font-size: 10.5px; color: #4C5B6E; border: 1px solid #E3E9F0; border-radius: 99px; padding: 1px 7px; } .t-governa .gv-filtros .on { background: #1C5FAE; border-color: #1C5FAE; color: #fff; }
.t-governa .gv-mbox { position: relative; display: grid; grid-template-columns: 18px 22px 416px; grid-template-rows: 416px 22px 18px; margin-top: 14px; }
.t-governa .gv-eixo { font-size: 10.5px; letter-spacing: .08em; text-transform: uppercase; color: #6B7A90; display: grid; place-items: center; }
.t-governa .gv-eixo.y { grid-row: 1; grid-column: 1; writing-mode: vertical-rl; transform: rotate(180deg); } .t-governa .gv-eixo.x { grid-row: 3; grid-column: 3; }
.t-governa .gv-ny { grid-row: 1; grid-column: 2; display: grid; grid-template-rows: repeat(5, ${CEL}px); gap: ${GAP}px; } .t-governa .gv-nx { grid-row: 2; grid-column: 3; display: grid; grid-template-columns: repeat(5, ${CEL}px); gap: ${GAP}px; }
.t-governa .gv-ny span, .t-governa .gv-nx span { display: grid; place-items: center; font: 600 11px 'JetBrains Mono', monospace; color: #8794A6; }
.t-governa .gv-grade { position: relative; grid-row: 1; grid-column: 3; display: grid; grid-template-columns: repeat(5, ${CEL}px); grid-template-rows: repeat(5, ${CEL}px); gap: ${GAP}px; }
.t-governa .gv-cel { border-radius: 8px; } .t-governa .gv-cel.cri { background: #FAD4D4; } .t-governa .gv-cel.alt { background: #FCE3C9; } .t-governa .gv-cel.mod { background: #FBF1C7; } .t-governa .gv-cel.bai { background: #D8F1E2; }
.t-governa .gv-dot { position: absolute; width: ${2 * R}px; height: ${2 * R}px; border-radius: 50%; display: grid; place-items: center; font: 700 9.5px 'JetBrains Mono', monospace; color: #fff; background: var(--z); box-shadow: 0 0 0 2px #fff, 0 3px 8px rgba(15,27,45,.22); z-index: 2; transition: background-color .4s; }
.t-governa .gv-dot.cri { --z: #D92D2D; } .t-governa .gv-dot.alt { --z: #E07A12; } .t-governa .gv-dot.mod { --z: #C99A06; } .t-governa .gv-dot.bai, .t-governa .gv-dot.tratado { --z: #16A34A; }
.t-governa .gv-dot i { position: absolute; inset: -2px; border-radius: 50%; border: 2px solid var(--z); opacity: 0; }
.t-governa .gv-dot.mini { position: static; width: 22px; height: 22px; font-size: 8.5px; box-shadow: none; }
.t-governa .gv-rastro { position: absolute; width: ${2 * R}px; height: ${2 * R}px; border-radius: 50%; border: 1.5px dashed #C42020; opacity: 0; }
.t-governa .gv-dica { position: absolute; left: ${4 * PASSO + CEL / 2 + 20}px; top: ${PASSO + CEL / 2 - 30}px; z-index: 4; width: 240px; background: #0F1B2D; color: #E8EEF6; border-radius: 10px; padding: 10px 12px; box-shadow: 0 16px 34px rgba(15,27,45,.3); }
.t-governa .gv-dica small { color: #F59E9E; font-size: 10.5px; font-weight: 600; } .t-governa .gv-dica b { display: block; font-size: 13px; font-weight: 600; margin: 1px 0 4px; }
.t-governa .gv-dica span { display: flex; align-items: center; gap: 5px; font-size: 11px; color: #AFC0D3; } .t-governa .gv-dica em { font-style: normal; color: #fff; font-weight: 700; }
.t-governa .gv-semplano { margin-top: 5px; color: #FBBF24 !important; } .t-governa .gv-semplano svg { width: 13px; height: 13px; }
.t-governa .gv-resumo { display: flex; gap: 16px; margin-top: 12px; padding-top: 11px; border-top: 1px solid #EEF2F6; font-size: 12px; color: #4C5B6E; }
.t-governa .gv-resumo span { display: flex; align-items: center; gap: 6px; } .t-governa .gv-resumo i { width: 9px; height: 9px; border-radius: 50%; background: var(--z); } .t-governa .gv-resumo b { color: #0F1B2D; font-size: 14px; }
.t-governa .gv-resumo .cri { --z: #D92D2D; } .t-governa .gv-resumo .alt { --z: #E07A12; } .t-governa .gv-resumo .mod { --z: #C99A06; } .t-governa .gv-resumo .bai { --z: #16A34A; }
.t-governa .gv-plano { grid-column: 3; grid-row: 2; }
.t-governa .gv-vazio { position: absolute; left: 16px; right: 16px; top: 52px; bottom: 16px; margin: 0; display: grid; place-items: center; border: 1.5px dashed #D5DEE8; border-radius: 10px; color: #8794A6; font-size: 12px; }
.t-governa .gv-plano.ok .gv-pst2 { color: #148A55; background: #DDF4E8; }
.t-governa .gv-prisco { display: flex; align-items: center; gap: 8px; } .t-governa .gv-prisco b { font-weight: 600; font-size: 12.5px; flex: 1; }
.t-governa .gv-prisco em { font-style: normal; font-size: 10.5px; font-weight: 600; color: #C42020; background: #FDE3E3; border-radius: 99px; padding: 2px 8px; white-space: nowrap; }
.t-governa .gv-rot { display: block; font-size: 10px; letter-spacing: .07em; text-transform: uppercase; color: #6B7A90; margin-top: 8px; }
.t-governa .gv-acao { margin: 1px 0 0; min-height: 18px; font-size: 12.5px; }
.t-governa .gv-pdados { display: grid; grid-template-columns: 1.3fr 1fr 1fr; gap: 6px; } .t-governa .gv-pdados b { display: flex; align-items: center; gap: 5px; font-weight: 600; font-size: 12px; margin-top: 2px; white-space: nowrap; }
.t-governa .gv-res.ok { color: #148A55; }
.t-governa .gv-prog { height: 6px; border-radius: 99px; background: #EEF2F6; overflow: hidden; margin: 10px 0 8px; } .t-governa .gv-prog i { display: block; height: 100%; width: 100%; background: #16A34A; border-radius: inherit; transform-origin: 0 50%; }
.t-governa .gv-evid { display: inline-flex; align-items: center; gap: 4px; font: 500 10.5px 'JetBrains Mono', monospace; color: #1D5FA6; background: #EAF2FB; border-radius: 5px; padding: 2px 7px; } .t-governa .gv-evid svg { width: 12px; height: 12px; }
.t-governa .gv-outros { margin-top: 8px; } .t-governa .gv-outros div { display: flex; align-items: center; gap: 7px; padding: 5px 0; border-top: 1px solid #EEF2F6; font-size: 11px; }
.t-governa .gv-outros b { font: 600 10.5px 'JetBrains Mono', monospace; } .t-governa .gv-outros span { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #33445A; }
.t-governa .gv-outros em { font-style: normal; font-size: 10px; font-weight: 600; color: #148A55; background: #DDF4E8; border-radius: 99px; padding: 1px 7px; }
.t-governa .gv-hist { grid-column: 3; grid-row: 3; }
.t-governa .gv-h { display: grid; grid-template-columns: 38px 20px 1fr; gap: 8px; align-items: start; padding: 6px 0; border-top: 1px solid #EEF2F6; font-size: 11.5px; line-height: 1.35; }
.t-governa .gv-h code { font: 500 10.5px 'JetBrains Mono', monospace; color: #6B7A90; padding-top: 2px; } .t-governa .gv-h span { color: #33445A; }
`,
  roteiro(f: Filme) {
    const tl = f.tl, D = (s: number) => `depois+=${s}`;
    const rad = (a: number) => a * Math.PI / 180;
    // câmera em perspectiva: com rx, o ponto alvo sobe ou desce (cos rx); aqui ele fica no centro mesmo inclinado
    const mira = (s: string, zoom: number, ang: { rx?: number; ry?: number; rz?: number } = {}, dx = 0, dy = 0) => {
      // o palco (16:9) mostra 1693×952 px da tela em zoom 1: o centro fica limitado para não aparecer o fundo
      const p = f.pos(s), mx = 846 / zoom, my = 476 / zoom;
      const cx = mx >= W / 2 ? W / 2 : Math.min(Math.max(p.x + p.w / 2 + dx, mx), W - mx), cy = my >= H / 2 ? H / 2 : Math.min(Math.max(p.y + p.h / 2 + dy, my), H - my);
      return { ...ang, x: -(cx - W / 2) / W * 100 * zoom, y: -(cy - H / 2) / H * 100 * zoom * Math.cos(rad(ang.rx ?? 0)), zoom };
    };
    const ponto = (c: string) => `.gv-dot.r${c.slice(2)}`;

    tl.set(f.$$('.gv-pcorpo, .gv-dica, .gv-pa, .gv-pst2, .gv-outros > div'), { autoAlpha: 0 }, 0);
    tl.set(f.$$('.gv-h'), { autoAlpha: 0 }, 0);
    tl.set(f.$$('.gv-it .gv-ev, .gv-it .gv-nc'), { autoAlpha: 0 }, 0);

    // 1 · Registre as políticas: a versão nova substitui a anterior, que continua no histórico
    f.passo(1, 'Cada política com versão, dono e data de revisão. Nada perdido em e-mail.', 'depois');
    f.camera(mira('.gv-pol', 1.75, {}, 30, 10), 2, 'depois', 'power2.inOut');
    f.entra('.gv-vers > span', D(.5), { x: -8, y: 0, stagger: .12 });
    f.cursor('.gv-btn.pub', D(1), true, .9);
    f.classe('.gv-p1', 'pronto', D(1.95)).texto('.gv-pst', 'Vigente', D(1.95)).texto('.gv-v4t', 'vigente', D(1.95)).texto('.gv-v3t', 'arquivada', D(1.95)).texto('.gv-btn.pub', 'Publicada', D(1.95));
    tl.fromTo(f.$('.gv-p1'), { boxShadow: '0 0 0 0 rgba(22,163,74,0)' }, { boxShadow: '0 0 0 4px rgba(22,163,74,.18)', duration: .3, yoyo: true, repeat: 1, immediateRender: false }, D(1.95));
    tl.to(f.$('.gv-h:nth-of-type(2)'), { autoAlpha: 1, duration: .01 }, D(2));
    f.camera(mira('.gv-pol', 1.6, {}, 30, 40), 1.8, D(2.4), 'power1.inOut');

    // 2 · Mapeie os riscos: sobrevoo inclinado da matriz, os pontos caem em cada quadrado
    f.passo(2, 'Os riscos por probabilidade e impacto. Três estão no vermelho, sem plano.', D(4.5));
    f.esconderCursor(D(4.3));
    f.camera(mira('.gv-grade', 1.45, { rx: 40, rz: -9 }, 0, 30), 2.4, D(4.3));
    tl.from(f.$$('.gv-dot:not(.mini)'), { y: -90, scale: 1.9, autoAlpha: 0, duration: .7, ease: 'back.out(1.7)', stagger: { each: .065, from: 'end' } }, D(5));
    f.contar('.gv-ncri', 3, D(6.2), { dur: 1 }).contar('.gv-nalt', 5, D(6.2), { dur: 1 }).contar('.gv-nmod', 6, D(6.2), { dur: 1 }).contar('.gv-nbai', 8, D(6.2), { dur: 1 });
    ['R-07', 'R-11', 'R-03'].forEach((c, k) => tl.fromTo(f.$(`${ponto(c)} i`), { scale: 1, autoAlpha: .9 }, { scale: 2.6, autoAlpha: 0, duration: 1.1, ease: 'power2.out', repeat: 2, immediateRender: false }, D(6.7 + k * .15)));
    f.camera(mira('.gv-dot.r03', 1.95, { rx: 32, rz: 5 }, 30, 10), 3, D(6.9), 'power1.inOut');
    f.cursor(ponto('R-07'), D(8.1), false, .8);
    tl.fromTo(f.$('.gv-dica'), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .35, immediateRender: false }, D(8.9));

    // 3 · Conduza auditorias: o checklist com evidência; o item que falha aponta para o risco
    f.passo(3, 'A auditoria interna registra cada item com a evidência anexada.', D(11));
    tl.to(f.$('.gv-dica'), { autoAlpha: 0, duration: .3 }, D(10.9));
    f.esconderCursor(D(10.9));
    f.camera(mira('.gv-audi', 1.75, { rx: 10 }, 20, 0), 1.9, D(10.8));
    itens.forEach(([, e], k) => {
      const at = 11.7 + k * .55;
      f.classe(`.gv-it.i${k + 1}`, e ? 'ok' : 'nc', D(at));
      tl.from(f.$(`.gv-it.i${k + 1} .gv-ck`), { scale: .4, duration: .35, ease: 'back.out(3)', immediateRender: false }, D(at));
      tl.to(f.$(`.gv-it.i${k + 1} ${e ? '.gv-ev' : '.gv-nc'}`), { autoAlpha: 1, duration: .3 }, D(at + .1));
    });
    // uma regra só para o contador (vários f.texto no mesmo elemento se anulam)
    const feitos = f.$('.gv-feitos'), marcas = itens.map((_, k) => f.quando(D(11.7 + k * .55)));
    f.regras.push(() => { const v = String(marcas.filter(m => tl.time() >= m).length); if (feitos.textContent !== v) feitos.textContent = v; });
    tl.to(f.$('.gv-h:nth-of-type(3)'), { autoAlpha: 1, duration: .01 }, D(14.5));
    f.camera(mira('.gv-audi', 1.6, { rx: 6 }, 20, 0), 1.4, D(14.6), 'power1.inOut');

    // 4 · Trate com planos de ação: cada risco vermelho ganha dono e prazo, e desliza para o verde
    f.passo(4, 'Cada risco vermelho ganha plano, dono e prazo. Tratado, ele sai do vermelho.', D(16.4));
    f.camera(mira('.gv-plano', 1.42, { rx: 26, ry: -8 }, -160, 110), 2.1, D(16.1));
    tl.to(f.$('.gv-vazio'), { autoAlpha: 0, duration: .3 }, D(16.7)).to(f.$$('.gv-pcorpo, .gv-pa, .gv-pst2'), { autoAlpha: 1, duration: .4 }, D(16.8));
    f.digitar('.gv-acao', 'Executar teste de restauração e anexar o relatório.', D(17.2), 42);
    f.entra('.gv-pdados > span', D(17.4), { stagger: .12 });
    tl.to(f.$('.gv-h:nth-of-type(4)'), { autoAlpha: 1, duration: .01 }, D(17.6));
    tl.from(f.$('.gv-prog i'), { scaleX: 0, duration: 1.2, ease: 'power2.inOut' }, D(18.3));
    f.classe('.gv-plano', 'ok', D(19.5)).texto('.gv-pst2', 'Concluído', D(19.5)).texto('.gv-res', 'Baixo 4', D(19.5)).classe('.gv-res', 'ok', D(19.5));
    tl.to(f.$('.gv-h:nth-of-type(5)'), { autoAlpha: 1, duration: .01 }, D(19.6));
    const mover = (c: string, at: number) => {
      const [p, i, dx, dy] = destino[c];
      tl.to(f.$(`.gv-rastro.r${c.slice(2)}`), { autoAlpha: .7, duration: .3 }, D(at));
      tl.to(f.$(ponto(c)), { ...px(p, i, dx, dy), duration: 1.5, ease: 'power3.inOut' }, D(at));
      f.classe(ponto(c), 'tratado', D(at + .8));
    };
    mover('R-07', 19.8);
    tl.fromTo(f.$$('.gv-outros > div'), { autoAlpha: 0, x: 10 }, { autoAlpha: 1, x: 0, duration: .5, stagger: .2, immediateRender: false }, D(20.6));
    mover('R-11', 21.1); mover('R-03', 21.3);
    f.contar('.gv-ncri', 0, D(21.9), { de: 3, dur: .8 }).contar('.gv-nbai', 11, D(21.9), { de: 8, dur: .8 }).contar('.gv-abertos', 0, D(21.9), { de: 3, dur: .8 });
    f.classe('.gv-aud', 'ok', D(22.6));
    tl.to(f.$('.gv-h:nth-of-type(6)'), { autoAlpha: 1, duration: .01 }, D(22.4));
    f.texto('.gv-pend', 'Nenhuma pendência', D(22.6));
    f.camera({ zoom: 1 }, 2.2, D(22.4));
    f.pausa(1.4);
  }
};
export default t;
