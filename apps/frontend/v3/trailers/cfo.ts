// Reports CFO · "Tudo verde, resultado vermelho". Tela recriada da Visão Executiva real (tema escuro, Acme Finance Demo).
// Movimento de câmera próprio: mergulho vertical do número consolidado até a linha que causou o desvio.
import { ic, type Trailer } from '../filme';

const kpis: [string, string, string, string, 'ok' | 'erro' | ''][] = [
  ['Receita líquida', 'R$ 41,8M', 'Budget R$ 43,4M', '30 26 24 10 2', ''],
  ['EBITDA', 'R$ 5,1M', 'Mês anterior R$ 6,3M', '12 10 11 16 30', ''],
  ['Caixa atual', 'R$ 19,4M', 'Mês anterior R$ 20,1M', '22 16 26 24 14', ''],
  ['Inadimplência', '4,1%', 'Ideal 5,0%', '20 20 24 22 10', 'ok'],
  ['OPEX', 'R$ 7,0M', 'Budget R$ 7,2M', '26 30 30 22 12', 'ok'],
  ['Total a receber', 'R$ 33,9M', 'Mês anterior R$ 34,4M', '28 28 28 26 14', ''],
  ['Margem bruta', '31,2%', 'Ideal 35,0%', '14 12 10 18 28', ''],
  ['Margem EBITDA', '12,2%', 'Ideal 18,0%', '12 10 12 14 30', ''],
  ['Total a pagar', 'R$ 21,1M', 'Mês anterior R$ 21,5M', '22 20 28 20 16', ''],
  ['Lucro líquido', 'R$ 1,9M', 'Mês anterior R$ 2,7M', '10 10 10 16 34', '']
];
const areas: [string, string, string][] = [
  ['Comercial / Receita', 'Bruno Almeida', '104%'], ['Compras / Procurement', 'Rafael Nogueira', '101%'],
  ['Tesouraria', 'Marina Castro', '100%'], ['Crédito e Cobrança', 'Caio Ferreira', '102%']
];
const spark = (pts: string) => `<svg class="cfo-spark" viewBox="0 0 160 40" preserveAspectRatio="none"><polyline points="${pts.split(' ').map((y, i) => `${i * 40},${y}`).join(' ')}" /></svg>`;

const t: Trailer = {
  ui: `<div class="cfo">
    <aside class="cfo-lado"><img src="/images/logo-p360.webp" alt="" />${['grafico', 'doc', 'agenda', 'quadro', 'pasta', 'ok', 'alerta', 'conversa', 'pessoas', 'ajustes', 'escudo'].map((n, i) => `<span class="${i === 0 ? 'on' : ''}">${ic(n as 'grafico')}</span>`).join('')}<span class="cfo-eu">HL</span></aside>
    <header class="cfo-topo"><div><b>Visão Executiva</b><small>Acme Finance Demo</small></div><div class="cfo-busca">${ic('busca')}Buscar…<kbd>⌘K</kbd></div><div class="cfo-acoes">${ic('ia')}${ic('sino')}</div></header>
    <main class="cfo-painel">
      <div class="cfo-cab" data-r><div><small>OUT. DE 2026</small><h1>Como estamos, Helena?</h1><p>O que pede decisão, os indicadores executivos e a situação de cada área.</p></div>
        <div class="cfo-filtros"><span>Out. de 2026</span><span>Todas as áreas</span><span>Todos os gestores</span></div></div>
      <div class="cfo-decisao" data-r><b>${ic('alerta')} Precisa de decisão agora</b><span><em class="r">0</em> relatórios atrasados</span><span><em class="a">0</em> tarefas atrasadas</span><span><em class="a cfo-metas">0</em> metas em risco</span></div>
      <h2 data-r>Indicadores executivos <small>cada um contra a referência que valeu no mês</small></h2>
      <div class="cfo-kpis" data-r>${kpis.map(([n, v, ref, pts, st], i) => `<div class="cfo-kpi${i === 9 ? ' cfo-lucro' : ''}"><div class="cfo-kh"><span>${n}</span><i class="${st}">${st === 'ok' ? 'Dentro' : 'No ritmo'}</i></div><b data-v="${v}">—</b>${spark(pts)}<small>${ref}</small></div>`).join('')}</div>
      <div class="cfo-areas" data-r><div class="cfo-areas-cab"><b>Cada área num olhar</b><span class="cfo-tudo">${ic('ok')} 4 de 4 áreas bateram a meta</span></div>
        ${areas.map(([a, g, p]) => `<div class="cfo-area"><span class="dot"></span><b>${a}</b><span class="g">${g}</span><span class="m">${p} da meta</span><span class="cfo-ok">${ic('ok')} Meta batida</span></div>`).join('')}</div>
      <section class="cfo-drill">
        <small>LUCRO LÍQUIDO · OUT. DE 2026</small><h3>Por que o lucro caiu R$ 800 mil?</h3>
        <p class="cfo-dsub">O Big Brain cruzou os relatórios das áreas com os indicadores do mês.</p>
        <div class="cfo-causa c1"><div><b>Desconto médio subiu de 8% para 14%</b><span>Comercial / Receita · Bruno Almeida</span></div><em>− R$ 560 mil</em></div>
        <div class="cfo-causa c2"><div><b>Frete reajustado sem repasse no preço</b><span>Compras / Procurement · Rafael Nogueira</span></div><em>− R$ 240 mil</em></div>
        <div class="cfo-expl"><span class="cfo-av">BA</span><div><small>Explicação do gestor</small><p class="cfo-texto"></p></div></div>
        <div class="cfo-plano"><div class="cfo-ph"><b>Plano de ação · Rever a política de desconto</b><span class="cfo-st">Em andamento</span></div>
          <div class="cfo-pdados"><span>Dono <b>Bruno Almeida</b></span><span>Prazo <b>25/10</b></span><span>Impacto <b>R$ 560 mil</b></span></div>
          <div class="cfo-prog"><i></i></div><p class="cfo-cfo"><span class="cfo-av h">HL</span>Helena: acompanhar toda semana até o fechamento.</p></div>
      </section>
    </main></div>`,
  css: `
.t-cfo .cfo { width: 1280px; height: 800px; background: #08090A; color: #E8EAED; font: 400 13px/1.4 Oxanium, sans-serif; display: grid; grid-template-columns: 64px 1fr; grid-template-rows: 56px 1fr; }
.t-cfo .cfo svg { width: 17px; height: 17px; }
.t-cfo .cfo-lado { grid-row: 1 / 3; display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 18px 0; color: #7D838C; }
.t-cfo .cfo-lado img { width: 40px; margin-bottom: 26px; }
.t-cfo .cfo-lado .on { color: #fff; position: relative; } .t-cfo .cfo-lado .on::before { content: ''; position: absolute; left: -24px; top: 0; bottom: 0; width: 2px; background: #fff; }
.t-cfo .cfo-eu { margin-top: auto; width: 30px; height: 30px; border-radius: 50%; background: #3A3F47; color: #fff; display: grid; place-items: center; font-size: 10px; font-weight: 700; }
.t-cfo .cfo-topo { display: flex; align-items: center; gap: 20px; padding: 0 22px 0 14px; }
.t-cfo .cfo-topo div:first-child { display: flex; flex-direction: column; min-width: 200px; } .t-cfo .cfo-topo b { font-weight: 600; } .t-cfo .cfo-topo small { color: #7D838C; font-size: 11px; }
.t-cfo .cfo-busca { margin-left: auto; width: 360px; height: 34px; border-radius: 9px; background: #16181B; display: flex; align-items: center; gap: 8px; padding: 0 12px; color: #7D838C; font-size: 12px; }
.t-cfo .cfo-busca kbd { margin-left: auto; font: 10px 'JetBrains Mono', monospace; background: #24272B; border-radius: 4px; padding: 1px 5px; }
.t-cfo .cfo-acoes { display: flex; gap: 18px; color: #B4B9C0; }
.t-cfo .cfo-painel { position: relative; margin: 2px 12px 12px 6px; background: #121316; border-radius: 14px; padding: 22px 26px; overflow: hidden; }
.t-cfo .cfo-cab { display: flex; justify-content: space-between; align-items: flex-end; }
.t-cfo .cfo-cab small { color: #7D838C; font-size: 11px; letter-spacing: .04em; } .t-cfo h1 { margin: 2px 0; font-size: 24px; font-weight: 600; } .t-cfo .cfo-cab p { margin: 0; color: #A7ADB5; font-size: 12.5px; }
.t-cfo .cfo-filtros { display: flex; gap: 8px; } .t-cfo .cfo-filtros span { background: #1C1E22; border-radius: 9px; padding: 8px 14px; font-size: 12px; }
.t-cfo .cfo-decisao { display: grid; grid-template-columns: 1.3fr 1fr 1fr 1fr; align-items: center; gap: 10px; margin-top: 16px; background: #1A1C1F; border-radius: 10px; padding: 14px 18px; font-size: 12.5px; color: #A7ADB5; }
.t-cfo .cfo-decisao b { display: flex; gap: 8px; align-items: center; color: #fff; font-weight: 600; } .t-cfo .cfo-decisao b svg { color: #F87171; }
.t-cfo .cfo-decisao em { font-style: normal; font-size: 18px; font-weight: 600; margin-right: 6px; } .t-cfo em.r { color: #F87171; } .t-cfo em.a { color: #FBBF24; }
.t-cfo h2 { margin: 18px 0 10px; font-size: 13.5px; font-weight: 600; } .t-cfo h2 small { color: #7D838C; font-weight: 400; margin-left: 6px; }
.t-cfo .cfo-kpis { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
.t-cfo .cfo-kpi { position: relative; background: #1A1C1F; border: 1px solid transparent; border-radius: 10px; padding: 12px 14px 10px; }
.t-cfo .cfo-kh { display: flex; justify-content: space-between; align-items: center; color: #C5CAD1; font-size: 12px; }
.t-cfo .cfo-kh i { font-style: normal; font-size: 10px; color: #7D838C; border: 1px solid #2A2D32; border-radius: 99px; padding: 1px 7px; }
.t-cfo .cfo-kh i.ok { color: #4ADE80; border-color: #1F4D33; }
.t-cfo .cfo-kpi b { display: block; font-size: 21px; font-weight: 600; margin: 6px 0 2px; }
.t-cfo .cfo-spark { width: 100%; height: 30px; display: block; } .t-cfo .cfo-spark polyline { fill: none; stroke: #6B7178; stroke-width: 1.4; vector-effect: non-scaling-stroke; }
.t-cfo .cfo-kpi small { color: #7D838C; font-size: 11px; }
.t-cfo .cfo-lucro.alerta { border-color: #7F1D1D; background: #1F1416; } .t-cfo .cfo-lucro.alerta b { color: #F87171; } .t-cfo .cfo-lucro.alerta polyline { stroke: #F87171; }
.t-cfo .cfo-areas { margin-top: 14px; background: #1A1C1F; border-radius: 10px; padding: 10px 16px; }
.t-cfo .cfo-areas-cab { display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 12.5px; } .t-cfo .cfo-tudo { display: flex; gap: 6px; align-items: center; color: #4ADE80; font-size: 12px; }
.t-cfo .cfo-area { display: grid; grid-template-columns: 14px 1.4fr 1fr .7fr .8fr; align-items: center; gap: 8px; padding: 5px 0; border-top: 1px solid #23262A; font-size: 12px; }
.t-cfo .cfo-area .dot { width: 7px; height: 7px; border-radius: 50%; background: #4ADE80; } .t-cfo .cfo-area .g, .t-cfo .cfo-area .m { color: #A7ADB5; }
.t-cfo .cfo-ok { display: flex; gap: 5px; align-items: center; color: #4ADE80; font-size: 11.5px; } .t-cfo .cfo-ok svg { width: 14px; height: 14px; }
.t-cfo .cfo-drill { position: absolute; top: 0; right: 0; bottom: 0; width: 470px; background: #16181B; border-left: 1px solid #26292E; padding: 26px 24px; box-shadow: -30px 0 60px rgba(0,0,0,.45); }
.t-cfo .cfo-drill small { color: #F87171; font-size: 10.5px; letter-spacing: .08em; } .t-cfo .cfo-drill h3 { margin: 6px 0 4px; font-size: 20px; font-weight: 600; } .t-cfo .cfo-dsub { margin: 0 0 16px; color: #A7ADB5; font-size: 12px; }
.t-cfo .cfo-causa { display: flex; justify-content: space-between; align-items: center; gap: 10px; background: #1F2125; border-left: 3px solid #F87171; border-radius: 8px; padding: 11px 14px; margin-bottom: 8px; }
.t-cfo .cfo-causa b { display: block; font-weight: 600; font-size: 13px; } .t-cfo .cfo-causa span { color: #A7ADB5; font-size: 11.5px; } .t-cfo .cfo-causa em { font-style: normal; color: #F87171; font-weight: 600; white-space: nowrap; }
.t-cfo .cfo-expl { display: flex; gap: 10px; margin: 14px 0; } .t-cfo .cfo-expl small { color: #7D838C; font-size: 11px; } .t-cfo .cfo-texto { margin: 2px 0 0; min-height: 38px; font-size: 13px; line-height: 1.45; }
.t-cfo .cfo-av { width: 30px; height: 30px; flex: none; border-radius: 50%; background: #2563EB; color: #fff; display: grid; place-items: center; font-size: 10.5px; font-weight: 700; } .t-cfo .cfo-av.h { background: #3A3F47; width: 24px; height: 24px; font-size: 9px; }
.t-cfo .cfo-plano { background: #1F2125; border-radius: 10px; padding: 14px; }
.t-cfo .cfo-ph { display: flex; justify-content: space-between; gap: 8px; align-items: center; font-size: 13px; } .t-cfo .cfo-st { font-size: 10.5px; color: #FBBF24; background: #3A2E10; border-radius: 99px; padding: 2px 8px; white-space: nowrap; }
.t-cfo .cfo-pdados { display: flex; gap: 18px; margin: 10px 0; color: #7D838C; font-size: 11.5px; } .t-cfo .cfo-pdados b { display: block; color: #E8EAED; font-weight: 600; font-size: 12.5px; }
.t-cfo .cfo-prog { height: 6px; background: #2A2D32; border-radius: 99px; overflow: hidden; } .t-cfo .cfo-prog i { display: block; height: 100%; width: 0; background: #3FB68B; }
.t-cfo .cfo-cfo { display: flex; gap: 8px; align-items: center; margin: 12px 0 0; color: #A7ADB5; font-size: 12px; }
`,
  roteiro(f) {
    const tl = f.tl;
    tl.set(f.$('.cfo-drill'), { xPercent: 105 }, 0);
    // 1 · Os números chegam (a câmera desliza de cima, levemente inclinada)
    f.passo(1, 'Os números da empresa chegam sozinhos, cada um contra a sua referência.', 'depois');
    f.camera({ zoom: 1.06, y: 3, rx: 4 }, 2.6, 'depois+=1.4', 'power2.inOut'); // depois que a tela termina de entrar (o motor anima até ~5,9 s)
    f.entra('.cfo-kpi', 'depois+=.6', { stagger: .06 });
    f.desenhar('.cfo-spark polyline', 'depois+=.9', 1.4);
    f.$$('.cfo-kpi b').forEach((b, i) => f.texto(`.cfo-kpi:nth-child(${i + 1}) b`, b.dataset.v!, `depois+=${1 + i * .07}`));
    f.contar('.cfo-decisao em.r', 3, 'depois+=1.2', { dur: .8 }).contar('.cfo-decisao em.a', 2, 'depois+=1.3', { dur: .8 });
    // 2 · Todas as áreas no verde… e o lucro no vermelho
    f.passo(2, 'Todas as áreas bateram a meta. O resultado da empresa, não.', '+=.6');
    f.entra('.cfo-area', '<', { x: -10, y: 0 });
    f.olhar('.cfo-areas', 1.35, 1.6, '<+.2', { rx: 4 });
    f.olhar('.cfo-lucro', 2.1, 1.8, '+=1.2', { rx: -3, ry: 4 });
    f.classe('.cfo-lucro', 'alerta', '<+.9');
    tl.fromTo(f.$('.cfo-lucro'), { scale: 1 }, { scale: 1.04, duration: .25, yoyo: true, repeat: 1, immediateRender: false }, '<');
    f.contar('.cfo-metas', 1, '<', { dur: .4 });
    // 3 · O mergulho: do número consolidado até quem causou o desvio
    f.passo(3, 'Um clique e o desvio aparece com causa, área e o nome de quem responde por ele.', '+=.8');
    f.cursor('.cfo-lucro', '<');
    f.camera({ zoom: 1, x: -8 }, 1.3, '>+.1');
    tl.to(f.$('.cfo-drill'), { xPercent: 0, duration: .9, ease: 'power3.out' }, '<');
    f.foco('.cfo-drill', '<+.3');
    f.entra('.cfo-causa', '>-.2', { x: 24, y: 0, stagger: .25 });
    f.olhar('.cfo-causa.c1', 1.9, 1.6, '+=.3', { rx: 8 });
    f.digitar('.cfo-texto', 'Campanha de fim de trimestre com desconto acima da política. Já combinei a revisão com o time.', '+=.2', 40);
    // 4 · O CFO acompanha o plano até o fim
    f.passo(4, 'A explicação vira plano de ação, com dono, prazo e impacto. O CFO acompanha até fechar.', '+=.4');
    f.olhar('.cfo-plano', 1.75, 1.6, '<');
    f.entra('.cfo-pdados span', '<+.4');
    tl.to(f.$('.cfo-prog i'), { width: '45%', duration: 1.6, ease: 'power2.out' }, '<+.6');
    f.entra('.cfo-cfo', '<+.8');
    f.foco(null, '+=1.2').camera({ zoom: .98, x: -3 }, 1.4, '<');
    f.pausa(1.2);
  }
};
export default t;
