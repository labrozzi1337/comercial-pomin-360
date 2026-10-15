// PominDev · "A fila da TI". Tela recriada da Esteira de desenvolvimento real (tema claro, chip do modelo, "Adicionar chamado").
// Câmera própria: a esteira é horizontal; cada estação acende por vez e a câmera viaja de estação em estação.
import { ic, W, H, type Trailer, type Filme } from '../filme';
import { svg } from '../../src/data';

const ico = {
  painel: svg('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>'),
  boia: svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="m5.6 5.6 3.6 3.6M14.8 14.8l3.6 3.6M18.4 5.6l-3.6 3.6M9.2 14.8l-3.6 3.6"/>'),
  lua: svg('<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>'),
  mic: svg('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>'),
  pontos: svg('<path d="M5 5h.01M12 5h.01M19 5h.01M5 12h.01M12 12h.01M19 12h.01M5 19h.01M12 19h.01M19 19h.01" stroke-width="3"/>'),
  chip: svg('<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>'),
  grade: svg('<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'),
  ramo: svg('<circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="8" r="2"/><path d="M6 7v10M18 10c0 4-6 3-11 7"/>'),
  robo: svg('<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 8V4M9 13h.01M15 13h.01M9 17h6"/>'),
  ciclo: svg('<path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/>'),
  arquivo: svg('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>'),
  pasta: svg('<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'),
  foguete: svg('<path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2M14 4c3-1.5 6-1 6-1s.5 3-1 6l-7 7-5-5z"/><circle cx="15" cy="9" r="1.5"/>'),
  globo: svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>')
};

const etapas: [string, string][] = [['Chamado', 'Análise'], ['Desenvolvimento', 'Agente de IA'], ['Revisão e testes', 'Agente revisor e QA'], ['Seu aceite', 'Homologação'], ['Produção', 'Deploy']];
const fila: [string, string, string][] = [['SAC-4119', 'Ajuste no cadastro de motoristas', 'Média'], ['PRD-88', 'Painel de ocupação da frota', 'Baixa'], ['SAC-4102', 'Erro ao anexar nota fiscal', 'Média'], ['SAC-4098', 'Novo campo no contrato', 'Baixa']];
const arvore: [number, string, boolean][] = [
  [0, 'portal-logistica', true], [1, 'src', true], [2, 'fretes', true], [3, 'relatorio.service.ts', false], [3, 'exportar.ts', false], [3, 'tipos.ts', false],
  [2, 'shared/csv.ts', false], [1, 'tests/fretes.spec.ts', false]
];
const diff: [string, string][] = [
  [' ', "import { Frete } from './tipos';"], [' ', "import { paraPdf } from '../shared/pdf';"],
  ['-', 'export function exportar(f: Frete[]) {'], ['+', "export function exportar(f: Frete[], tipo = 'pdf') {"],
  ['+', "  if (tipo === 'csv') return paraCsv(f);"], [' ', '  return paraPdf(f);'], [' ', '}'],
  ['+', 'function paraCsv(f: Frete[]) {'], ['+', "  const cab = 'data;placa;valor';"], ['+', '  const linhas = f.map(linhaCsv);'], ['+', "  return [cab, ...linhas].join('\\n');"], ['+', '}']
];
const checks: [string, string, string][] = [
  ['Revisão de código', 'agente revisor · 2 sugestões aplicadas', '38s'], ['Testes unitários', '48 de 48 passaram · cobertura 87%', '52s'],
  ['Build', 'portal-logistica@2.14.0', '1m 12s'], ['Deploy em homologação', 'homolog.serraazul.local', '41s']
];
const ST = 380, GAP = 40, FILA = 260, X0 = FILA + GAP; // larguras da esteira (px)
const trilhoX = (i: number) => 90 - i * (ST + GAP); // posição da esteira que centraliza a estação i

const t: Trailer = {
  ui: `<div class="dv">
    <aside class="dv-lado"><span class="dv-logo">${ic('codigo')}</span><span>${ic('mais')}</span>
      ${[ico.grade, ic('quadro'), ic('caixa'), ic('ia'), ico.ramo, ico.robo, ic('doc'), ico.ciclo, ico.lua].map((s, i) => `<span class="${i === 1 ? 'on' : ''}">${s}</span>`).join('')}
      <span class="dv-cfg">${ic('ajustes')}</span><span class="dv-eu">CF</span></aside>
    <header class="dv-topo"><span>${ico.painel}</span><b>Esteira de desenvolvimento</b><div class="dv-busca">${ic('busca')}<span>Buscar páginas ou ações…</span><kbd>⌘K</kbd></div>
      <div class="dv-acoes">${[ic('sino'), ico.mic, ic('conversa'), ico.lua, ico.boia, ico.pontos].map(s => `<span>${s}</span>`).join('')}</div></header>
    <main class="dv-folha">
      <div class="dv-barra"><span class="dv-modelo">${ico.chip}<b>Opus 4.8</b>·<small>5h</small><i style="--w:31%"></i><small>31%</small><small>Sem</small><i style="--w:49%"></i><small>49%</small><small class="dv-ha">há 4min</small></span>
        <span class="dv-btn sec">${ic('mais')} Nova tarefa</span><span class="dv-btn">${ic('mais')} Adicionar chamado</span></div>
      <div class="dv-passos"><i class="dv-linha"><b></b></i>${etapas.map(([n, s], k) => `<div class="dv-no n${k}" style="left:${10 + k * 20}%"><span>${k + 1}</span><b>${n}</b><small>${s}</small></div>`).join('')}</div>
      <div class="dv-janela"><div class="dv-trilho">
        <section class="dv-fila" data-r><div class="dv-fh"><b>Fila de demandas</b><span>40</span></div>
          <div class="dv-fi novo"><code>SAC-4127</code><b>Relatório de fretes não exporta CSV</b><div><em class="alta">Alta</em><span class="dv-pegar">Analisar</span></div></div>
          ${fila.map(([c, n, p]) => `<div class="dv-fi"><code>${c}</code><b>${n}</b><div><em>${p}</em></div></div>`).join('')}
          <p class="dv-mais">+ 35 na fila</p></section>

        <section class="dv-st s0" data-r style="left:${X0}px"><div class="dv-sh"><span>1</span><div><b>Chamado</b><small>Análise</small></div><em class="dv-est">Aguardando</em></div>
          <p class="dv-vazio">Nenhuma demanda em análise</p>
          <div class="dv-sc">
            <div class="dv-tk"><div class="dv-tkh"><code>SAC-4127</code><span class="dv-orig">PominSAC</span><em class="alta">Alta</em><small>aberto às 10h36</small></div>
              <b>Relatório de fretes não exporta para CSV</b>
              <p>“Preciso do relatório de fretes em CSV para fechar o mês com a transportadora.”</p>
              <div class="dv-quem"><i class="dv-av" style="--a:#7C5CE0">RN</i>Rafael Nogueira · Logística</div></div>
            <div class="dv-rasc"><div class="dv-rh">${ic('ia')}<b>Rascunho do agente</b><code>DEV-218</code></div>
              <b class="dv-tit"></b>
              <small>Critérios de aceite</small>
              <ul>${['Botão Exportar CSV no relatório de fretes', 'Colunas: data, placa e valor', 'Respeita os filtros aplicados'].map(c => `<li>${ic('ok')}${c}</li>`).join('')}</ul>
              <div class="dv-meta"><span>Sistema <b>Portal Logística</b></span><span>Estimativa <b>2 pts</b></span></div></div>
          </div></section>

        <section class="dv-st s1" data-r style="left:${X0 + (ST + GAP)}px"><div class="dv-sh"><span>2</span><div><b>Desenvolvimento</b><small>Agente de IA · Opus 4.8</small></div><em class="dv-est">Aguardando</em></div>
          <p class="dv-vazio">Aguardando a etapa anterior</p>
          <div class="dv-sc">
            <div class="dv-ag"><i class="dv-gira"></i><span class="dv-agt">Lendo o repositório portal-logistica</span></div>
            <div class="dv-arv">${arvore.map(([n, a, p], k) => `<div class="dv-ar a${k}" style="padding-left:${8 + n * 14}px">${p ? ico.pasta : ico.arquivo}<span>${a}</span><i>${ic('ok')}</i></div>`).join('')}</div>
            <div class="dv-apr">${ic('ia')} Usou 3 aprendizados do time · <b>CSV com ponto e vírgula</b></div>
            <div class="dv-diff"><div class="dv-dh"><code>src/fretes/exportar.ts</code><span><b class="mais">+7</b> <b class="menos">−1</b></span></div>
              ${diff.map(([s, l]) => `<div class="dv-dl ${s === '+' ? 'mais' : s === '-' ? 'menos' : ''}"><i>${s}</i><code>${l.replace(/</g, '&lt;')}</code></div>`).join('')}</div>
            <div class="dv-pr">${ico.ramo}<b>Pull request #482 aberto</b><span>3 arquivos · +46 −7</span></div>
          </div></section>

        <section class="dv-st s2" data-r style="left:${X0 + 2 * (ST + GAP)}px"><div class="dv-sh"><span>3</span><div><b>Revisão e testes</b><small>Agente revisor e QA</small></div><em class="dv-est">Aguardando</em></div>
          <p class="dv-vazio">Aguardando a etapa anterior</p>
          <div class="dv-sc">
            <div class="dv-rev"><i class="dv-av" style="--a:#0E8A7E">${ico.robo}</i><div><b>Agente revisor</b><p>Sugeri tratar lista vazia e escapar “;” nos valores. Aplicado em 2 commits.</p></div></div>
            ${checks.map(([n, d, tm], k) => `<div class="dv-ck c${k}"><span class="dv-ckc"><i class="dv-gira"></i>${ic('ok')}</span><div><b>${n}</b><small>${d}</small></div><em>${tm}</em></div>`).join('')}
            <div class="dv-cont"><b class="dv-nck">0</b> de 4 verificações concluídas</div>
          </div></section>

        <section class="dv-st s3" data-r style="left:${X0 + 3 * (ST + GAP)}px"><div class="dv-sh"><span>4</span><div><b>Seu aceite</b><small>Homologação</small></div><em class="dv-est">Aguardando</em></div>
          <p class="dv-vazio">Aguardando a etapa anterior</p>
          <div class="dv-sc">
            <div class="dv-nav"><div class="dv-url"><i></i><i></i><i></i><span>${ico.globo} homolog.serraazul.local/fretes</span></div>
              <div class="dv-pag"><div class="dv-ph"><b>Relatório de fretes</b><span class="dv-btn mini">Exportar CSV</span></div>
                ${[['01/10', 'RTA-4F21', 'R$ 1.840,00'], ['01/10', 'QPL-9D03', 'R$ 2.115,50'], ['02/10', 'MBX-1A77', 'R$ 976,30']].map(r => `<div class="dv-tr">${r.map(c => `<span>${c}</span>`).join('')}</div>`).join('')}
                <span class="dv-baixou">${ico.arquivo} fretes_outubro.csv · 214 linhas</span></div></div>
            <ul class="dv-crit">${['Botão Exportar CSV no relatório', 'Colunas: data, placa e valor', 'Respeita os filtros aplicados'].map(c => `<li>${ic('ok')}${c}</li>`).join('')}</ul>
            <p class="dv-nota">Nada vai para produção sem o seu aceite.</p>
            <div class="dv-dec"><span class="dv-btn sec">Pedir ajuste</span><span class="dv-btn dv-aprovar"><i class="dv-anel"></i><span class="dv-apt">Aprovar e publicar</span></span></div>
          </div></section>

        <section class="dv-st s4" data-r style="left:${X0 + 4 * (ST + GAP)}px"><div class="dv-sh"><span>5</span><div><b>Produção</b><small>Deploy</small></div><em class="dv-est">Aguardando</em></div>
          <p class="dv-vazio">Aguardando o seu aceite</p>
          <div class="dv-sc">
            ${[['Imagem gerada', 'portal-logistica:2.14.0'], ['Publicando em produção', 'app.serraazul.local'], ['Verificação de saúde', '200 OK em 3 regiões']].map(([n, d], k) => `<div class="dv-ck p${k}"><span class="dv-ckc"><i class="dv-gira"></i>${ic('ok')}</span><div><b>${n}</b><small>${d}</small></div></div>`).join('')}
            <div class="dv-dep"><i></i></div>
            <div class="dv-noar">${ico.foguete}<div><b>No ar às 11h42</b><small>Do chamado à produção: 1h 06min</small></div></div>
          </div></section>

        <section class="dv-ret" data-r style="left:${X0 + 5 * (ST + GAP)}px"><div class="dv-fh"><b>Retorno ao solicitante</b></div>
          <div class="dv-rc"><div class="dv-tkh"><code>SAC-4127</code><span class="dv-orig">PominSAC</span><em class="ok">Respondido</em></div>
            <p>Rafael, o relatório de fretes já exporta em CSV. Está no ar desde 11h42.</p><div class="dv-quem"><i class="dv-av" style="--a:#7C5CE0">RN</i>Rafael Nogueira foi avisado</div></div></section>
      </div></div>
    </main></div>`,
  css: `
.t-dev .dv { width: 1280px; height: 800px; display: grid; grid-template-columns: 58px 1fr; grid-template-rows: 56px 1fr; background: #F4F6F9; color: #0F1B2D; font: 400 13px/1.4 Oxanium, sans-serif; }
.t-dev svg { width: 16px; height: 16px; flex: none; }
.t-dev .dv-lado { grid-row: 1 / 3; display: flex; flex-direction: column; align-items: center; gap: 7px; padding: 10px 0 12px; background: #fff; border-right: 1px solid #E6EBF1; color: #66768B; }
.t-dev .dv-lado > span { width: 32px; height: 32px; display: grid; place-items: center; border-radius: 8px; }
.t-dev .dv-lado .on { background: #E1EDF9; color: #1D5FA6; box-shadow: inset 0 0 0 1px #C6DAF0; }
.t-dev .dv-lado .dv-logo { width: 36px; height: 36px; background: #2F5FD0; color: #fff; border-radius: 9px; margin-bottom: 4px; box-shadow: inset 0 0 0 2px #2249A8; } .t-dev .dv-logo svg { width: 20px; height: 20px; stroke-width: 2; }
.t-dev .dv-lado .dv-cfg { margin-top: 10px; } .t-dev .dv-lado .dv-eu { margin-top: auto; width: 30px; height: 30px; border: 1.5px solid #1D5FA6; color: #1D5FA6; font-weight: 700; font-size: 10px; border-radius: 6px; }
.t-dev .dv-topo { display: flex; align-items: center; gap: 16px; padding: 0 16px 0 22px; color: #55657A; } .t-dev .dv-topo > b { color: #0F1B2D; font-weight: 600; font-size: 13.5px; }
.t-dev .dv-busca { margin: 0 auto 0 160px; width: 420px; height: 34px; border: 1px solid #E1E7EE; border-radius: 9px; background: #fff; display: flex; align-items: center; gap: 9px; padding: 0 12px; font-size: 12.5px; color: #7B8899; }
.t-dev .dv-busca svg { width: 15px; height: 15px; } .t-dev .dv-busca span { flex: 1; } .t-dev .dv-busca kbd { font: 500 10px 'JetBrains Mono', monospace; border: 1px solid #E1E7EE; border-radius: 4px; padding: 1px 5px; }
.t-dev .dv-acoes { display: flex; gap: 7px; } .t-dev .dv-acoes span { width: 32px; height: 32px; display: grid; place-items: center; border: 1px solid #E6EBF1; border-radius: 8px; background: #fff; }
.t-dev .dv-folha { position: relative; margin: 4px 10px 10px 4px; background: #fff; border: 1px solid #E6EBF1; border-radius: 12px; padding: 18px 24px; overflow: hidden; }
.t-dev .dv-barra { display: flex; align-items: center; gap: 8px; height: 36px; }
.t-dev .dv-modelo { display: flex; align-items: center; gap: 7px; height: 32px; padding: 0 12px; border: 1px solid #E3E9F0; border-radius: 8px; font-size: 11px; color: #4C5B6E; margin-right: auto; }
.t-dev .dv-modelo svg { width: 14px; height: 14px; color: #1D5FA6; } .t-dev .dv-modelo b { color: #0F1B2D; font-weight: 600; }
.t-dev .dv-modelo i { width: 36px; height: 5px; border-radius: 99px; background: linear-gradient(90deg, #16A34A var(--w), #E6EBF1 var(--w)); } .t-dev .dv-ha { color: #8794A6; }
.t-dev .dv-btn { display: inline-flex; align-items: center; gap: 7px; height: 34px; padding: 0 15px; border-radius: 7px; background: #1558A6; color: #fff; font-weight: 600; font-size: 12.5px; white-space: nowrap; position: relative; }
.t-dev .dv-btn svg { width: 15px; height: 15px; } .t-dev .dv-btn.sec { background: #fff; color: #0F1B2D; box-shadow: inset 0 0 0 1px #DCE4ED; } .t-dev .dv-btn.mini { height: 24px; font-size: 10.5px; padding: 0 10px; border-radius: 6px; }
.t-dev .dv-passos { position: relative; height: 66px; margin: 14px 0 12px; }
.t-dev .dv-linha { position: absolute; left: 10%; right: 10%; top: 13px; height: 3px; background: #E6EBF1; border-radius: 99px; } .t-dev .dv-linha b { display: block; height: 100%; width: 0; background: #16A34A; border-radius: inherit; }
.t-dev .dv-no { position: absolute; top: 0; width: 160px; margin-left: -80px; text-align: center; }
.t-dev .dv-no span { display: inline-grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; background: #fff; border: 2px solid #D5DEE8; font: 600 11.5px 'JetBrains Mono', monospace; color: #8794A6; transition: background-color .3s, border-color .3s, color .3s; }
.t-dev .dv-no b { display: block; margin-top: 4px; font-size: 12.5px; font-weight: 600; color: #6B7A90; } .t-dev .dv-no small { font-size: 10.5px; color: #8794A6; }
.t-dev .dv-no.on span { background: #1D5FA6; border-color: #1D5FA6; color: #fff; box-shadow: 0 0 0 5px #DCE9F7; } .t-dev .dv-no.on b { color: #0F1B2D; }
.t-dev .dv-no.espera span { background: #D97706; border-color: #D97706; color: #fff; box-shadow: 0 0 0 5px #FCEBD0; } .t-dev .dv-no.espera b { color: #B45309; }
.t-dev .dv-no.ok span { background: #16A34A; border-color: #16A34A; color: #fff; box-shadow: none; } .t-dev .dv-no.ok b { color: #0F1B2D; }
.t-dev .dv-janela { position: relative; height: 558px; overflow: hidden; }
.t-dev .dv-trilho { position: absolute; left: 0; top: 0; width: ${X0 + 5 * (ST + GAP) + FILA}px; height: 100%; }
.t-dev .dv-fila, .t-dev .dv-ret { position: absolute; top: 0; width: ${FILA}px; height: 540px; background: #F6F8FB; border: 1px solid #E8EDF3; border-radius: 12px; padding: 12px; }
.t-dev .dv-fh { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; } .t-dev .dv-fh b { font-weight: 600; } .t-dev .dv-fh span { font: 600 10.5px 'JetBrains Mono', monospace; background: #E4E9F0; border-radius: 99px; padding: 1px 7px; }
.t-dev .dv-fi { background: #fff; border: 1px solid #E3E9F0; border-radius: 9px; padding: 9px 11px; margin-bottom: 8px; }
.t-dev .dv-fi code, .t-dev .dv-tkh code { font: 600 10px 'JetBrains Mono', monospace; color: #6B7A90; } .t-dev .dv-fi b { display: block; font-weight: 500; font-size: 12px; margin: 2px 0 6px; }
.t-dev .dv-fi > div { display: flex; justify-content: space-between; align-items: center; }
.t-dev em { font-style: normal; } .t-dev .dv-fi em, .t-dev .dv-tkh em { font-size: 10px; font-weight: 600; color: #4C5B6E; background: #EEF2F6; border-radius: 99px; padding: 1px 8px; }
.t-dev em.alta { color: #B42318; background: #FDE7E5; } .t-dev em.ok { color: #148A55; background: #DDF4E8; }
.t-dev .dv-fi.novo { border-color: #8DB4E8; box-shadow: 0 0 0 3px #E4EEFA; }
.t-dev .dv-pegar { font-size: 11px; font-weight: 600; color: #1D5FA6; border: 1px solid #B9D1EE; border-radius: 6px; padding: 2px 10px; }
.t-dev .dv-mais { margin: 4px 0 0; text-align: center; font-size: 11.5px; color: #6B7A90; }
.t-dev .dv-st { position: absolute; top: 0; width: ${ST}px; height: 540px; background: #fff; border: 1px solid #E3E9F0; border-radius: 12px; padding: 0 14px 14px; transition: border-color .3s, box-shadow .3s; }
.t-dev .dv-st.on { border-color: #1D5FA6; box-shadow: 0 0 0 3px #E4EEFA, 0 18px 40px rgba(15,40,70,.1); } .t-dev .dv-st.espera { border-color: #D97706; box-shadow: 0 0 0 3px #FCEBD0, 0 18px 40px rgba(15,40,70,.1); } .t-dev .dv-st.ok { border-color: #A7DDBE; box-shadow: none; }
.t-dev .dv-sh { display: flex; align-items: center; gap: 10px; height: 54px; border-bottom: 1px solid #EEF2F6; margin: 0 -14px 12px; padding: 0 14px; }
.t-dev .dv-sh > span { width: 26px; height: 26px; border-radius: 7px; display: grid; place-items: center; background: #EEF2F6; color: #6B7A90; font: 600 11.5px 'JetBrains Mono', monospace; }
.t-dev .dv-st.on .dv-sh > span { background: #1D5FA6; color: #fff; } .t-dev .dv-st.espera .dv-sh > span { background: #D97706; color: #fff; } .t-dev .dv-st.ok .dv-sh > span { background: #16A34A; color: #fff; }
.t-dev .dv-sh b { display: block; font-weight: 600; font-size: 13.5px; } .t-dev .dv-sh small { font-size: 10.5px; color: #6B7A90; }
.t-dev .dv-est { margin-left: auto; font-size: 10.5px; font-weight: 600; color: #6B7A90; background: #EEF2F6; border-radius: 99px; padding: 2px 9px; }
.t-dev .dv-st.on .dv-est { color: #1D5FA6; background: #E1EDF9; } .t-dev .dv-st.espera .dv-est { color: #B45309; background: #FCEBD0; } .t-dev .dv-st.ok .dv-est { color: #148A55; background: #DDF4E8; }
.t-dev .dv-vazio { position: absolute; left: 14px; right: 14px; top: 66px; bottom: 14px; margin: 0; display: grid; place-items: center; border: 1.5px dashed #DCE4ED; border-radius: 10px; color: #8794A6; font-size: 12px; }
.t-dev .dv-tk, .t-dev .dv-rc { border: 1px solid #E3E9F0; border-radius: 10px; padding: 11px 12px; }
.t-dev .dv-tkh { display: flex; align-items: center; gap: 6px; } .t-dev .dv-tkh small { margin-left: auto; font-size: 10px; color: #8794A6; }
.t-dev .dv-orig { font-size: 10px; font-weight: 600; color: #7C3AED; background: #F1EAFE; border-radius: 4px; padding: 1px 6px; }
.t-dev .dv-tk > b { display: block; margin: 6px 0 4px; font-size: 13.5px; font-weight: 600; } .t-dev .dv-tk p, .t-dev .dv-rc p { margin: 0 0 8px; font-size: 12px; color: #4C5B6E; line-height: 1.45; }
.t-dev .dv-quem { display: flex; align-items: center; gap: 7px; font-size: 11.5px; color: #4C5B6E; }
.t-dev .dv-av { width: 22px; height: 22px; border-radius: 50%; background: var(--a); color: #fff; display: inline-grid; place-items: center; font: 700 8.5px Oxanium, sans-serif; font-style: normal; flex: none; } .t-dev .dv-av svg { width: 14px; height: 14px; }
.t-dev .dv-rasc { margin-top: 12px; border: 1px solid #C9DAF0; background: #F6F9FE; border-radius: 10px; padding: 11px 12px; }
.t-dev .dv-rh { display: flex; align-items: center; gap: 6px; font-size: 12px; } .t-dev .dv-rh svg { color: #1D5FA6; } .t-dev .dv-rh b { font-weight: 600; } .t-dev .dv-rh code { margin-left: auto; font: 600 10px 'JetBrains Mono', monospace; color: #1D5FA6; }
.t-dev .dv-tit { display: block; min-height: 19px; margin: 7px 0 8px; font-size: 13.5px; font-weight: 600; }
.t-dev .dv-rasc > small { font-size: 10px; letter-spacing: .07em; text-transform: uppercase; color: #6B7A90; }
.t-dev ul { list-style: none; margin: 4px 0 0; padding: 0; } .t-dev li { display: flex; gap: 7px; align-items: center; font-size: 12px; padding: 3px 0; } .t-dev li svg { width: 13px; height: 13px; color: #16A34A; stroke-width: 2.4; }
.t-dev .dv-meta { display: flex; gap: 18px; margin-top: 10px; padding-top: 9px; border-top: 1px solid #DCE6F3; font-size: 11px; color: #6B7A90; } .t-dev .dv-meta b { display: block; color: #0F1B2D; font-size: 12px; font-weight: 600; }
.t-dev .dv-ag { display: flex; align-items: center; gap: 8px; font-size: 11.5px; color: #1D5FA6; margin-bottom: 8px; }
.t-dev .dv-gira { width: 13px; height: 13px; border: 2px solid #C9DAF0; border-top-color: #1D5FA6; border-radius: 50%; animation: dv-gira .7s linear infinite; flex: none; }
@keyframes dv-gira { to { transform: rotate(360deg); } }
.t-dev .dv-ag.ok .dv-gira { animation: none; border-color: #16A34A; background: #16A34A; } .t-dev .dv-ag.ok { color: #148A55; }
.t-dev .dv-arv { border: 1px solid #E3E9F0; border-radius: 9px; padding: 5px 0; font: 500 11px 'JetBrains Mono', monospace; }
.t-dev .dv-ar { display: flex; align-items: center; gap: 6px; height: 19px; color: #8794A6; } .t-dev .dv-ar svg { width: 13px; height: 13px; }
.t-dev .dv-ar i { margin-left: auto; margin-right: 8px; color: #16A34A; opacity: 0; } .t-dev .dv-ar i svg { width: 12px; height: 12px; stroke-width: 2.6; }
.t-dev .dv-ar.lido { color: #33445A; } .t-dev .dv-ar.lido i { opacity: 1; } .t-dev .dv-ar.lendo { background: #E4EEFA; color: #1D5FA6; }
.t-dev .dv-apr { display: flex; align-items: center; gap: 6px; margin: 8px 0; font-size: 11px; color: #4C5B6E; } .t-dev .dv-apr svg { width: 13px; height: 13px; color: #1D5FA6; } .t-dev .dv-apr b { font-weight: 600; color: #0F1B2D; }
.t-dev .dv-diff { border: 1px solid #E3E9F0; border-radius: 9px; overflow: hidden; font: 500 10.5px/1.55 'JetBrains Mono', monospace; }
.t-dev .dv-dh { display: flex; justify-content: space-between; align-items: center; padding: 5px 9px; background: #F6F8FB; border-bottom: 1px solid #E3E9F0; } .t-dev .dv-dh code { font-weight: 600; }
.t-dev .dv-dh .mais { color: #15803D; } .t-dev .dv-dh .menos { color: #B42318; }
.t-dev .dv-dl { display: flex; white-space: pre; color: #33445A; } .t-dev .dv-dl i { width: 18px; text-align: center; font-style: normal; color: #8794A6; flex: none; }
.t-dev .dv-dl.mais { background: #E7F6EC; color: #14532D; } .t-dev .dv-dl.mais i { color: #15803D; } .t-dev .dv-dl.menos { background: #FDECEA; color: #7F1D1D; } .t-dev .dv-dl.menos i { color: #B42318; }
.t-dev .dv-pr { display: flex; align-items: center; gap: 7px; margin-top: 9px; padding: 8px 10px; border-radius: 9px; background: #EEF5FF; font-size: 12px; } .t-dev .dv-pr svg { color: #1D5FA6; } .t-dev .dv-pr b { font-weight: 600; } .t-dev .dv-pr span { margin-left: auto; font-size: 10.5px; color: #4C5B6E; }
.t-dev .dv-rev { display: flex; gap: 10px; padding: 10px 12px; border: 1px solid #E3E9F0; border-radius: 10px; margin-bottom: 10px; } .t-dev .dv-rev .dv-av { width: 28px; height: 28px; }
.t-dev .dv-rev b { font-weight: 600; font-size: 12.5px; } .t-dev .dv-rev p { margin: 2px 0 0; font-size: 12px; color: #4C5B6E; line-height: 1.45; }
.t-dev .dv-ck { display: flex; align-items: center; gap: 11px; padding: 11px 4px; border-bottom: 1px solid #EEF2F6; }
.t-dev .dv-ck b { display: block; font-weight: 600; font-size: 13px; } .t-dev .dv-ck small { font: 500 10.5px 'JetBrains Mono', monospace; color: #6B7A90; } .t-dev .dv-ck em { margin-left: auto; font: 500 10.5px 'JetBrains Mono', monospace; color: #8794A6; opacity: 0; }
.t-dev .dv-ckc { width: 24px; height: 24px; border-radius: 50%; border: 2px solid #D5DEE8; display: grid; place-items: center; color: #fff; flex: none; }
.t-dev .dv-ckc .dv-gira, .t-dev .dv-ckc svg { display: none; } .t-dev .dv-ckc svg { width: 13px; height: 13px; stroke-width: 2.8; }
.t-dev .dv-ck.rodando .dv-ckc { border-color: transparent; } .t-dev .dv-ck.rodando .dv-gira { display: block; width: 20px; height: 20px; }
.t-dev .dv-ck.ok .dv-ckc { background: #16A34A; border-color: #16A34A; } .t-dev .dv-ck.ok .dv-ckc svg { display: block; } .t-dev .dv-ck.ok .dv-gira { display: none; } .t-dev .dv-ck.ok em { opacity: 1; }
.t-dev .dv-cont { margin-top: 12px; font-size: 12px; color: #4C5B6E; } .t-dev .dv-cont b { color: #0F1B2D; }
.t-dev .dv-nav { border: 1px solid #DCE4ED; border-radius: 10px; overflow: hidden; }
.t-dev .dv-url { display: flex; align-items: center; gap: 5px; padding: 6px 9px; background: #F3F5F8; border-bottom: 1px solid #E3E9F0; } .t-dev .dv-url > i { width: 7px; height: 7px; border-radius: 50%; background: #D5DEE8; }
.t-dev .dv-url span { margin-left: 8px; display: flex; align-items: center; gap: 5px; font: 500 10.5px 'JetBrains Mono', monospace; color: #4C5B6E; background: #fff; border-radius: 5px; padding: 2px 8px; flex: 1; } .t-dev .dv-url svg { width: 11px; height: 11px; }
.t-dev .dv-pag { padding: 10px 12px; } .t-dev .dv-ph { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; } .t-dev .dv-ph b { font-weight: 600; font-size: 12.5px; }
.t-dev .dv-tr { display: grid; grid-template-columns: 50px 1fr 90px; font-size: 11px; padding: 4px 0; border-top: 1px solid #EEF2F6; } .t-dev .dv-tr span:last-child { text-align: right; }
.t-dev .dv-baixou { display: inline-flex; align-items: center; gap: 5px; margin-top: 7px; font: 500 10.5px 'JetBrains Mono', monospace; color: #148A55; background: #DDF4E8; border-radius: 5px; padding: 2px 8px; } .t-dev .dv-baixou svg { width: 12px; height: 12px; }
.t-dev .dv-crit { margin-top: 10px; } .t-dev .dv-nota { margin: 8px 0 12px; font-size: 11.5px; color: #B45309; }
.t-dev .dv-dec { display: flex; gap: 8px; } .t-dev .dv-dec .dv-btn { height: 40px; } .t-dev .dv-aprovar { flex: 1; justify-content: center; font-size: 13px; }
.t-dev .dv-anel { position: absolute; inset: -4px; border-radius: 10px; border: 2px solid #1D5FA6; opacity: 0; }
.t-dev .dv-aprovar.feito { background: #16A34A; }
.t-dev .dv-dep { height: 6px; border-radius: 99px; background: #EEF2F6; overflow: hidden; margin: 14px 4px; } .t-dev .dv-dep i { display: block; height: 100%; width: 100%; background: #16A34A; border-radius: inherit; transform-origin: 0 50%; }
.t-dev .dv-noar { display: flex; align-items: center; gap: 12px; padding: 14px; border-radius: 10px; background: #E9F7EF; border: 1px solid #BFE6CF; } .t-dev .dv-noar svg { width: 24px; height: 24px; color: #148A55; }
.t-dev .dv-noar b { display: block; font-size: 15px; font-weight: 700; color: #14532D; } .t-dev .dv-noar small { font-size: 11.5px; color: #3F6B52; }
.t-dev .dv-ret .dv-rc { background: #fff; } .t-dev .dv-ret p { margin-top: 8px; }
`,
  roteiro(f: Filme) {
    const tl = f.tl, D = (s: number) => `depois+=${s}`;
    // centro da câmera limitado para não mostrar o fundo do palco (16:9 mostra 1693×952 px em zoom 1)
    const cam = (cx: number, cy: number, zoom: number, ang: { rx?: number; ry?: number; rz?: number } = {}) => {
      const mx = 846 / zoom, my = 476 / zoom;
      const x = mx >= W / 2 ? W / 2 : Math.min(Math.max(cx, mx), W - mx), y = my >= H / 2 ? H / 2 : Math.min(Math.max(cy, my), H - my);
      return { ...ang, x: -(x - W / 2) / W * 100 * zoom, y: -(y - H / 2) / H * 100 * zoom, zoom };
    };
    // a esteira anda por transform: a posição medida (f.pos) não inclui o deslocamento, então ele é somado aqui
    const trilho = f.$('.dv-trilho'), jan = f.pos('.dv-janela');
    const meio = jan.x + jan.w / 2;
    const cursorEm = (sel: string, tx: number, at: number, dur = .9) => {
      const p = f.pos(sel);
      tl.to(f.ponteiro, { x: p.x + tx + p.w * .5, y: p.y + p.h * .55, autoAlpha: 1, duration: dur, ease: 'power2.inOut' }, D(at));
      tl.fromTo(f.ponteiro.querySelector('i'), { scale: .2, autoAlpha: .9 }, { scale: 2.6, autoAlpha: 0, duration: .5, ease: 'power2.out', immediateRender: false }, D(at + dur));
    };
    // viagem de uma estação a outra: a esteira desliza e a câmera recua, inclina e volta a se aproximar
    const viagem = (i: number, at: number, y = 500) => {
      tl.to(trilho, { x: trilhoX(i), duration: 1.5, ease: 'power3.inOut' }, D(at));
      f.camera(cam(meio, y + 10, 1.42, { ry: -7 }), .75, D(at), 'power2.in').camera(cam(meio, y, 1.78), .9, D(at + .75), 'power2.out');
      f.foco(`.dv-st.s${i}`, D(at + 1));
    };
    const ativa = (i: number, at: number, fim: number, estado = 'on') => {
      f.classe(`.dv-no.n${i}`, estado, D(at)).classe(`.dv-st.s${i}`, estado, D(at));
      tl.to(f.$(`.dv-st.s${i} .dv-vazio`), { autoAlpha: 0, duration: .3 }, D(at)).to(f.$(`.dv-st.s${i} .dv-sc`), { autoAlpha: 1, duration: .4 }, D(at + .1));
      tl.to(f.$('.dv-linha b'), { width: `${i * 25}%`, duration: .6, ease: 'power2.inOut' }, D(at - .3));
      if (fim) f.classe(`.dv-no.n${i}`, 'ok', D(fim)).classe(`.dv-st.s${i}`, 'ok', D(fim));
    };
    // rótulos de estado: uma regra por elemento (vários f.texto no mesmo elemento se anulam)
    const serie = (sel: string, ps: [number, string][]) => {
      const el = f.$(sel), ini = el.textContent ?? '', ts = ps.map(([a, v]) => [f.quando(D(a)), v] as [number, string]);
      f.regras.push(() => { const t = tl.time(); let v = ini; for (const [a, x] of ts) if (t >= a) v = x; if (el.textContent !== v) el.textContent = v; });
    };

    tl.set(trilho, { x: trilhoX(0) }, 0);
    tl.set(f.$$('.dv-sc'), { autoAlpha: 0 }, 0);

    // 1 · Receba o chamado: chega pelo PominSAC e o agente rascunha a tarefa
    f.passo(1, 'O pedido chega pelo PominSAC. O agente já rascunha a tarefa.', 'depois');
    f.camera(cam(640, 430, 1.12), 2, 'depois', 'power2.inOut');
    tl.from(f.$('.dv-fi.novo'), { y: -40, autoAlpha: 0, duration: .6, ease: 'back.out(1.6)' }, D(.5));
    tl.from(f.$$('.dv-fi:not(.novo), .dv-mais'), { y: -93, duration: .6, ease: 'power3.out' }, D(.5));
    cursorEm('.dv-pegar', trilhoX(0), 1, .9);
    tl.to(f.$('.dv-fi.novo'), { autoAlpha: 0, x: 60, duration: .4, ease: 'power2.in' }, D(2));
    tl.to(f.$$('.dv-fi:not(.novo), .dv-mais'), { y: -93, duration: .5, ease: 'power2.inOut' }, D(2.3));
    ativa(0, 2.2, 5);
    tl.from(f.$('.s0 .dv-tk'), { x: -50, autoAlpha: 0, duration: .6, ease: 'power3.out' }, D(2.3));
    f.camera(cam(meio, 478, 1.78), 1.5, D(2.2));
    f.foco('.dv-st.s0', D(2.6));
    f.esconderCursor(D(2.4));
    tl.from(f.$('.s0 .dv-rasc'), { y: 14, autoAlpha: 0, duration: .5 }, D(3));
    f.digitar('.s0 .dv-tit', 'Exportar o relatório de fretes em CSV', D(3.3), 40);
    f.entra('.s0 .dv-rasc li', D(4.1), { stagger: .2, x: -8, y: 0 });
    serie('.s0 .dv-est', [[2.2, 'Em análise'], [5, 'Pronto para desenvolver']]);

    // 2 · A IA desenvolve: lê o repositório, arquivo por arquivo, e escreve o código
    f.passo(2, 'A IA lê o código real do repositório e escreve a mudança.', D(5.4));
    viagem(1, 5.2, 478);
    ativa(1, 6, 11.6);
    serie('.s1 .dv-est', [[6, 'Desenvolvendo'], [11.6, 'PR aberto']]);
    arvore.forEach((_, k) => {
      const at = 6.5 + k * .22;
      const el = f.$(`.dv-ar.a${k}`), a = f.quando(D(at)), b = f.quando(D(at + .22));
      f.regras.push(() => { const t = tl.time(); el.classList.toggle('lendo', t >= a && t < b); el.classList.toggle('lido', t >= b); });
    });
    serie('.dv-agt', [[7.2, 'Lendo src/fretes/relatorio.service.ts'], [8, 'Lendo tests/fretes.spec.ts'], [8.5, 'Escrevendo src/fretes/exportar.ts'], [11.4, 'Pronto: pull request aberto']]);
    f.classe('.dv-ag', 'ok', D(11.4));
    f.camera(cam(meio, 330, 2.15), 1.4, D(6.6), 'power2.inOut');
    tl.from(f.$('.dv-apr'), { autoAlpha: 0, x: -10, duration: .4 }, D(8.4));
    f.camera(cam(meio, 560, 2.15), 1.6, D(8.5), 'power2.inOut');
    tl.fromTo(f.$$('.dv-dl'), { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: .3, stagger: .17, ease: 'none', immediateRender: true }, D(8.8));
    tl.from(f.$('.dv-pr'), { autoAlpha: 0, y: 10, duration: .45 }, D(11.2));

    // 3 · Revisão e testes: as verificações ficam verdes uma a uma
    f.passo(3, 'Um agente revisor confere o código. Os testes rodam antes de seguir.', D(12.3));
    viagem(2, 12.1, 478);
    ativa(2, 12.9, 16.6);
    serie('.s2 .dv-est', [[12.9, 'Verificando'], [16.6, 'Aprovado']]);
    tl.from(f.$('.dv-rev'), { autoAlpha: 0, y: 10, duration: .45 }, D(13.1));
    checks.forEach((_, k) => {
      const at = 13.5 + k * .75;
      const el = f.$(`.dv-ck.c${k}`), a = f.quando(D(at)), b = f.quando(D(at + .6));
      f.regras.push(() => { const t = tl.time(); el.classList.toggle('rodando', t >= a && t < b); el.classList.toggle('ok', t >= b); });
      tl.fromTo(f.$(`.dv-ck.c${k} .dv-ckc`), { scale: .6 }, { scale: 1, duration: .35, ease: 'back.out(3)', immediateRender: false }, D(at + .6));
    });
    serie('.dv-nck', checks.map((_, k) => [13.5 + k * .75 + .6, String(k + 1)] as [number, string]));
    f.camera(cam(meio, 540, 1.95), 3, D(13.4), 'power1.inOut');

    // 4 · Aceite e produção: a esteira para e espera o seu aceite
    f.passo(4, 'A esteira para e espera por você. Só com o seu aceite vai para produção.', D(17));
    viagem(3, 16.8, 478);
    ativa(3, 17.6, 20.6, 'espera');
    serie('.s3 .dv-est', [[17.6, 'Aguardando você'], [20.6, 'Aceito']]);
    tl.from(f.$('.dv-baixou'), { autoAlpha: 0, x: -8, duration: .4 }, D(18.2));
    f.entra('.dv-crit li', D(18.3), { stagger: .15, x: -8, y: 0 });
    tl.fromTo(f.$('.dv-anel'), { scale: 1, autoAlpha: .9 }, { scale: 1.12, autoAlpha: 0, duration: .9, repeat: 2, ease: 'power2.out', immediateRender: false }, D(18.6));
    f.camera(cam(meio, 620, 2.2), 2.2, D(18.4), 'power1.inOut');
    cursorEm('.dv-aprovar', trilhoX(3), 19.3, 1);
    f.classe('.dv-aprovar', 'feito', D(20.4));
    serie('.dv-apt', [[20.4, 'Aprovado por você · 11h41']]);
    viagem(4, 20.9, 478);
    f.esconderCursor(D(21));
    ativa(4, 21.6, 24.2);
    serie('.s4 .dv-est', [[21.6, 'Publicando'], [24.2, 'No ar']]);
    [0, 1, 2].forEach(k => {
      const at = 21.9 + k * .7, el = f.$(`.dv-ck.p${k}`), a = f.quando(D(at)), b = f.quando(D(at + .55));
      f.regras.push(() => { const t = tl.time(); el.classList.toggle('rodando', t >= a && t < b); el.classList.toggle('ok', t >= b); });
    });
    tl.from(f.$('.dv-dep i'), { scaleX: 0, duration: 1.9, ease: 'power1.inOut' }, D(21.9));
    tl.from(f.$('.dv-noar'), { autoAlpha: 0, y: 12, duration: .5 }, D(24));
    f.foco(null, D(24.6));
    tl.from(f.$('.dv-ret .dv-rc'), { autoAlpha: 0, x: -20, duration: .5 }, D(24.6));
    tl.to(f.$('.dv-linha b'), { width: '100%', duration: .5 }, D(24));
    f.camera(cam(meio + 120, 470, 1.25), 2.2, D(24.4), 'power2.inOut');
    f.pausa(1.2);
  }
};
export default t;
