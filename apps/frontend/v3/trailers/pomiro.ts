// Pomiro · "O quadro branco apagado". Board recriado no estilo do Pomiro real (tema claro, roxo da marca).
// Linguagem de câmera: "potências de dez". Começa colado no texto do pedido à IA e vai se afastando
// (zoom do próprio canvas, com o indicador de % descendo) até revelar o canvas infinito inteiro.
import { ic, type Trailer } from '../filme';
import { svg } from '../../src/data';
import { app } from '../dados';

const i = {
  seta: svg('<path d="M5 3l14 8-6 2-3 6z"/>'),
  mao: svg('<path d="M18 11V6a2 2 0 0 0-4 0v5M14 10V4a2 2 0 0 0-4 0v6M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>'),
  nota: svg('<path d="M15 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9l7-7V5a2 2 0 0 0-2-2z"/><path d="M14 21v-5a2 2 0 0 1 2-2h5"/>'),
  forma: svg('<rect x="3" y="3" width="18" height="18" rx="2"/>'),
  linha: svg('<path d="M5 19 19 5"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="5" r="2"/>'),
  caneta: svg('<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>'),
  texto: svg('<path d="M4 7V4h16v3M9 20h6M12 4v16"/>'),
  coment: svg('<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.8-.9L3 21l1.9-5.7A8.4 8.4 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5z"/>'),
  grade: svg('<circle cx="5" cy="5" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="19" cy="5" r="1"/><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="19" r="1"/><circle cx="12" cy="19" r="1"/><circle cx="19" cy="19" r="1"/>'),
  baixo: svg('<path d="m6 9 6 6 6-6"/>'),
  ajustar: svg('<path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3"/>'),
  play: svg('<path d="m7 4 13 8-13 8z"/>')
};

// Mapa mental (coordenadas do mundo, origem no centro do objetivo)
type Ramo = { id: string; nome: string; cor: string; nota: string; x: number; y: number; notas: string[]; col: number };
const ramos: Ramo[] = [
  { id: 'p', nome: 'Produto', cor: '#8B5CF6', nota: '#FFE68C', x: -520, y: -300, col: 0, notas: ['Blend 100% arábica, torra média', 'Embalagens de 250 g e 1 kg', 'Preço sugerido: R$ 49,90'] },
  { id: 'c', nome: 'Canais', cor: '#2F7DF6', nota: '#CFE5FF', x: 520, y: -300, col: 3, notas: ['Loja online no ar até 25/11', '3 cafeterias parceiras em BH', 'Kit presente para empresas'] },
  { id: 'm', nome: 'Comunicação', cor: '#E0569B', nota: '#FFD3E6', x: -520, y: 300, col: 2, notas: ['Posts e reels no Instagram', 'Degustação nas cafeterias', 'E-mail para a base de clientes'] },
  { id: 'o', nome: 'Operação', cor: '#16A34A', nota: '#D3F2CF', x: 520, y: 300, col: 1, notas: ['Torra em lotes semanais', 'Estoque inicial de 800 kg', 'Frete grátis acima de R$ 150'] }
];
const NW = 150, NH = 116;                                             // post-it
const notaX = (r: Ramo, k: number) => (r.x < 0 ? [-770, -610, -450] : [450, 610, 770])[k];
const notaY = (r: Ramo) => (r.y < 0 ? -505 : 505);
const giro = [-3, 2, -1.5, 2.5, -2, 1.5];
// Quadro do plano final: 4 colunas
const FX = 980, FY = -290, FW = 800, FH = 520, colX = (c: number) => FX + 20 + c * 195 + 92, slotY = (k: number) => FY + 128 + k * 126;
const colunas: [string, string, string, string][] = [['Outubro', 'Preparar', 'MC', '#7C5CF0'], ['Novembro', 'Produzir', 'CF', '#16A34A'], ['Até 28/11', 'Divulgar', 'JM', '#E0569B'], ['Dezembro', 'Vender', 'RN', '#2F7DF6']];

const sx = (n: number) => Math.sign(n);
const ligacoes = ramos.map(r => `<path class="pm-l1" stroke="${r.cor}" d="M ${sx(r.x) * 130} ${sx(r.y) * 64} C ${sx(r.x) * 130} ${r.y}, ${(sx(r.x) * 130 + r.x - sx(r.x) * 88) / 2} ${r.y}, ${r.x - sx(r.x) * 88} ${r.y}"/>`).join('')
  + ramos.map(r => r.notas.map((_, k) => { const y0 = r.y + sx(r.y) * 22, x1 = notaX(r, k), y1 = notaY(r) - sx(r.y) * NH / 2; return `<path class="pm-l2 l2-${r.id}" stroke="${r.cor}" d="M ${r.x} ${y0} C ${r.x} ${(y0 + y1) / 2}, ${x1} ${(y0 + y1) / 2}, ${x1} ${y1}"/>`; }).join('')).join('');
const cursor = (id: string, nome: string, cor: string) => `<div class="pm-cur ${id}" style="--k:${cor}"><svg viewBox="0 0 24 24"><path d="M3 2l17 9.5-7.2 1.7L9.2 20z" fill="${cor}" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg><span>${nome}</span></div>`;
const longe = `
  <div class="pm-longe" style="left:-1420px;top:-1300px;width:640px;height:430px"><b>Retrospectiva Q3</b>${['#FFE68C', '#FFE68C', '#CFE5FF', '#FFD3E6', '#D3F2CF', '#FFE68C', '#CFE5FF', '#FFD3E6'].map(c => `<i style="background:${c}"></i>`).join('')}</div>
  <div class="pm-longe fx" style="left:1364px;top:-1273px;width:720px;height:420px"><b>Fluxo de pedidos</b><em></em><em></em><em class="los"></em><em></em></div>
  <div class="pm-longe" style="left:-1380px;top:1000px;width:560px;height:380px"><b>Brainstorm · nomes do blend</b>${['#FFD3E6', '#FFE68C', '#FFE68C', '#D3F2CF', '#CFE5FF', '#FFE68C'].map(c => `<i style="background:${c}"></i>`).join('')}</div>
  <div class="pm-longe rm" style="left:1409px;top:1000px;width:700px;height:400px"><b>Roadmap 2027</b><s style="width:60%"></s><s style="width:38%;margin-left:30%"></s><s style="width:52%;margin-left:12%"></s><s style="width:30%;margin-left:55%"></s></div>`;

const t: Trailer = {
  ui: `<div class="pm">
    <div class="pm-canvas">
      <div class="pm-mundo">
        <div class="pm-pontos"></div>${longe}
        <svg class="pm-svg" viewBox="-1000 -700 3000 1400" style="left:-1000px;top:-700px;width:3000px;height:1400px">${ligacoes}
          <path class="pm-risco" d="M -372 -600 C -318 -540, -330 -446, -432 -428 C -540 -410, -566 -500, -536 -566 C -506 -622, -420 -628, -352 -588 L -330 -575"/></svg>
        <div class="pm-quadro" style="left:${FX}px;top:${FY}px;width:${FW}px;height:${FH}px"><p class="pm-qt">Plano final · Lançamento Serra Azul <span>Versão final · 14/10, 18:40</span></p>
          ${colunas.map(([q, o, av, c], k) => `<div class="pm-col" style="left:${20 + k * 195}px"><small>${q}</small><b>${o}</b><span class="pm-av" style="--a:${c}">${av}</span></div>`).join('')}</div>
        ${ramos.map(r => `<div class="pm-ramo r-${r.id}" style="left:${r.x - 88}px;top:${r.y - 22}px;--k:${r.cor}"><i></i>${r.nome}</div>`).join('')}
        ${ramos.map((r, a) => r.notas.map((n, k) => `<div class="pm-nota n-${r.id} n-${r.id}${k}" style="left:${notaX(r, k) - NW / 2}px;top:${notaY(r) - NH / 2}px;background:${r.nota};--g:${giro[(a * 3 + k) % 6]}deg"><p>${n}</p><span>IA</span></div>`).join('')).join('')}
        <div class="pm-obj"><small>${ic('ia')} OBJETIVO</small><b>Lançar o café especial Serra Azul em dezembro</b><span>Loja online + 3 cafeterias parceiras</span></div>
        <div class="pm-ia">
          <div class="pm-ia-cab">${ic('ia')}<b>Pomiro IA</b><span>Rascunho do board</span></div>
          <p class="pm-ia-txt"><em class="pm-pedido"></em></p>
          <div class="pm-ia-pe"><span class="pm-chip on">Mapa mental</span><span class="pm-chip on">Post-its</span><span class="pm-chip">Prazo: dezembro</span><span class="pm-gerar">${ic('ia')}<em>Gerar rascunho</em></span></div>
        </div>
        <span class="pm-pin p1" style="--k:#E0569B">JM</span><span class="pm-pin p2" style="--k:#2F7DF6">RN</span>
        <div class="pm-thread"><div><span class="pm-av" style="--a:#E0569B">JM</span><p><b>Júlia Mendes <small>agora</small></b>Dá para antecipar a degustação para 28/11?</p></div>
          <div class="pm-resp"><span class="pm-av" style="--a:#16A34A">CF</span><p><b>Caio Ferreira <small>agora</small></b><em class="pm-resp-txt"></em></p></div></div>
        ${cursor('cr', 'Rafael Nogueira', '#2F7DF6')}${cursor('cj', 'Júlia Mendes', '#E0569B')}${cursor('cc', 'Caio Ferreira', '#16A34A')}
      </div>
    </div>
    <header class="pm-topo">
      <span class="pm-logo">${app('pomiro').icon}</span><span class="pm-g">${i.grade}</span>
      <div class="pm-nome"><small>Meus Boards /</small><b>Lançamento Café Serra Azul</b>${i.baixo}<em class="pm-salvo">Salvo agora</em></div>
      <div class="pm-dir"><div class="pm-gente"><span class="pm-av eu" style="--a:#7C5CF0">MC</span><span class="pm-av g1" style="--a:#2F7DF6">RN</span><span class="pm-av g2" style="--a:#E0569B">JM</span><span class="pm-av g3" style="--a:#16A34A">CF</span></div>
        <span class="pm-bt sec">${i.play} Apresentar</span><span class="pm-bt">Compartilhar</span></div>
    </header>
    <nav class="pm-ferr">${[i.seta, i.mao, i.nota, i.forma, i.linha, i.caneta, i.texto, i.coment].map((s, k) => `<span class="f${k}${k === 0 ? ' on' : ''}">${s}</span>`).join('')}<hr /><span class="f8 ia">${ic('ia')}</span></nav>
    <div class="pm-mini"><i class="m1"></i><i class="m2"></i><i class="m3"></i><i class="m4"></i><i class="m5"></i><b class="pm-vp"></b></div>
    <div class="pm-zoomc"><span>−</span><b class="pm-zoom">220%</b><span>+</span><span class="pm-fit">${i.ajustar}</span></div>
  </div>`,
  css: `
.t-pomiro .pm { position: relative; width: 1280px; height: 800px; overflow: hidden; background: #F7F7FB; color: #14142B; font: 400 13px/1.4 Oxanium, sans-serif; }
.t-pomiro .pm svg { width: 17px; height: 17px; flex: none; }
.t-pomiro .pm-canvas { position: absolute; inset: 0; overflow: hidden; }
.t-pomiro .pm-mundo { position: absolute; left: 640px; top: 430px; width: 0; height: 0; transform-origin: 0 0; }
.t-pomiro .pm-mundo > * { position: absolute; }
.t-pomiro .pm-pontos { left: -4200px; top: -3000px; width: 8400px; height: 6000px; background: radial-gradient(circle, #C9CBD8 1.3px, transparent 1.6px) 0 0 / 26px 26px; }
.t-pomiro .pm-svg { overflow: visible; width: auto; height: auto; }
.t-pomiro .pm-svg path { fill: none; stroke-width: 2.5; stroke-linecap: round; }
.t-pomiro .pm-svg .pm-l2 { stroke-width: 1.8; opacity: .75; }
.t-pomiro .pm-svg .pm-risco { stroke: #E5484D; stroke-width: 5; stroke-linejoin: round; }
.t-pomiro .pm-ia { left: -235px; top: -78px; width: 470px; height: 156px; background: #fff; border-radius: 14px; box-shadow: 0 0 0 2px #7C5CF0, 0 18px 40px -16px rgba(76,52,170,.35); padding: 14px 16px; display: flex; flex-direction: column; }
.t-pomiro .pm-ia-cab { display: flex; align-items: center; gap: 7px; font-size: 12px; color: #7C5CF0; } .t-pomiro .pm-ia-cab span { color: #8A8AA3; }
.t-pomiro .pm-ia-cab svg { width: 15px; height: 15px; }
.t-pomiro .pm-ia-txt { flex: 1; margin: 8px 0; font-size: 15px; line-height: 1.45; color: #14142B; }
.t-pomiro .pm-ia-txt em { font-style: normal; }
.t-pomiro .pm-ia-txt em::after { content: ''; display: inline-block; width: 2px; height: 1.05em; margin-left: 1px; vertical-align: -2px; background: #7C5CF0; }
.t-pomiro .pm-ia.foi .pm-ia-txt em::after { display: none; }
.t-pomiro .pm-ia-pe { display: flex; align-items: center; gap: 6px; }
.t-pomiro .pm-chip { font-size: 10.5px; border: 1px solid #E2E2EE; border-radius: 99px; padding: 2px 9px; color: #5C5C78; } .t-pomiro .pm-chip.on { border-color: #D6CCFB; background: #F3EFFE; color: #6B4FE0; }
.t-pomiro .pm-gerar { margin-left: auto; display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 0 14px; border-radius: 8px; background: #7C5CF0; color: #fff; font-weight: 600; font-size: 12px; }
.t-pomiro .pm-gerar svg { width: 14px; height: 14px; } .t-pomiro .pm-gerar em { font-style: normal; }
.t-pomiro .pm-obj { left: -200px; top: -64px; width: 400px; height: 128px; background: #fff; border-radius: 14px; box-shadow: 0 0 0 2.5px #7C5CF0, 0 14px 30px -14px rgba(76,52,170,.35); padding: 16px 20px; text-align: center; display: flex; flex-direction: column; justify-content: center; }
.t-pomiro .pm-obj small { display: inline-flex; align-self: center; align-items: center; gap: 5px; font-size: 10px; letter-spacing: .14em; color: #7C5CF0; } .t-pomiro .pm-obj small svg { width: 12px; height: 12px; }
.t-pomiro .pm-obj b { display: block; margin: 6px 0 4px; font-size: 18px; line-height: 1.25; font-weight: 600; }
.t-pomiro .pm-obj span { color: #6B6B85; font-size: 13px; }
.t-pomiro .pm-ramo { width: 176px; height: 44px; display: flex; align-items: center; justify-content: center; gap: 8px; background: #fff; border: 2.5px solid var(--k); border-radius: 99px; font-size: 16px; font-weight: 600; box-shadow: 0 6px 16px -10px rgba(20,20,43,.4); }
.t-pomiro .pm-ramo i { width: 9px; height: 9px; border-radius: 50%; background: var(--k); }
.t-pomiro .pm-nota { width: ${NW}px; height: ${NH}px; padding: 12px 13px; border-radius: 3px; box-shadow: 0 10px 16px -10px rgba(20,20,43,.35), 0 1px 1px rgba(20,20,43,.08); rotate: var(--g); }
.t-pomiro .pm-nota p { margin: 0; font-size: 14.5px; line-height: 1.32; font-weight: 500; color: #23233A; }
.t-pomiro .pm-nota span { position: absolute; right: 9px; bottom: 8px; font-size: 9px; font-weight: 700; letter-spacing: .06em; color: #7C5CF0; background: rgba(255,255,255,.6); border-radius: 4px; padding: 0 4px; }
.t-pomiro .pm-quadro { background: #fff; border: 1.5px solid #DADAE6; border-radius: 6px; }
.t-pomiro .pm-qt { position: absolute; left: 0; top: -42px; margin: 0; display: flex; align-items: center; gap: 12px; font-size: 20px; font-weight: 600; white-space: nowrap; }
.t-pomiro .pm-qt span { font-size: 13px; font-weight: 500; color: #15803D; background: #E7F7EC; border-radius: 99px; padding: 2px 12px; opacity: 0; }
.t-pomiro .pm-quadro.final .pm-qt span { opacity: 1; }
.t-pomiro .pm-col { position: absolute; top: 18px; width: 185px; height: ${FH - 36}px; border-radius: 6px; background: #F6F6FA; padding: 12px 14px; }
.t-pomiro .pm-col small { display: block; font-size: 11px; color: #8A8AA3; letter-spacing: .04em; } .t-pomiro .pm-col b { font-size: 16px; font-weight: 600; }
.t-pomiro .pm-col .pm-av { position: absolute; right: 12px; top: 14px; }
.t-pomiro .pm-av { width: 26px; height: 26px; border-radius: 50%; background: var(--a); color: #fff; display: inline-grid; place-items: center; font-size: 9.5px; font-weight: 700; box-shadow: 0 0 0 2px #fff; flex: none; }
.t-pomiro .pm-pin { width: 34px; height: 34px; display: grid; place-items: center; border-radius: 50% 50% 50% 4px; background: var(--k); color: #fff; font-size: 11px; font-weight: 700; box-shadow: 0 0 0 3px #fff, 0 8px 14px -6px rgba(20,20,43,.5); scale: 1.6; transform-origin: 0 100%; }
.t-pomiro .pm-pin.p1 { left: -548px; top: 410px; } .t-pomiro .pm-pin.p2 { left: -398px; top: -606px; }
.t-pomiro .pm-thread { left: -360px; top: 110px; width: 300px; padding: 12px; background: #fff; border-radius: 12px; box-shadow: 0 20px 40px -16px rgba(20,20,43,.4), 0 0 0 1px #E6E6F0; scale: 1.6; transform-origin: 0 0; }
.t-pomiro .pm-thread > div { display: flex; gap: 9px; } .t-pomiro .pm-thread p { margin: 0; font-size: 12.5px; line-height: 1.4; color: #2B2B45; }
.t-pomiro .pm-thread b { display: block; font-size: 12px; font-weight: 600; color: #14142B; } .t-pomiro .pm-thread b small { font-weight: 400; color: #8A8AA3; margin-left: 4px; }
.t-pomiro .pm-resp { margin-top: 10px; padding-top: 10px; border-top: 1px solid #EEEEF4; } .t-pomiro .pm-resp em { font-style: normal; }
.t-pomiro .pm-cur { left: 0; top: 0; scale: 1.6; transform-origin: 0 0; display: flex; align-items: flex-start; }
.t-pomiro .pm-cur svg { width: 20px; height: 20px; filter: drop-shadow(0 2px 2px rgba(0,0,0,.2)); }
.t-pomiro .pm-cur span { margin: 15px 0 0 -4px; background: var(--k); color: #fff; font-size: 11px; font-weight: 600; border-radius: 4px 10px 10px 10px; padding: 2px 8px; white-space: nowrap; }
.t-pomiro .pm-longe { background: #fff; border: 1.5px solid #DADAE6; border-radius: 6px; padding: 50px 30px 30px; display: flex; flex-wrap: wrap; gap: 22px; align-content: flex-start; }
.t-pomiro .pm-longe b { position: absolute; left: 0; top: -44px; font-size: 26px; font-weight: 600; color: #3A3A55; white-space: nowrap; }
.t-pomiro .pm-longe i { width: 120px; height: 100px; border-radius: 3px; box-shadow: 0 6px 10px -8px rgba(0,0,0,.4); }
.t-pomiro .pm-longe.fx { align-items: center; gap: 50px; padding-top: 140px; } .t-pomiro .pm-longe.fx em { width: 120px; height: 70px; border: 3px solid #7C8BA1; border-radius: 10px; }
.t-pomiro .pm-longe.fx em.los { width: 80px; height: 80px; border-radius: 6px; rotate: 45deg; border-color: #E0569B; }
.t-pomiro .pm-longe.rm { flex-direction: column; flex-wrap: nowrap; gap: 30px; padding-top: 70px; } .t-pomiro .pm-longe.rm s { display: block; height: 40px; border-radius: 8px; background: #CFE5FF; }
.t-pomiro .pm-longe.rm s:nth-child(odd) { background: #D3F2CF; }
.t-pomiro .pm-topo { position: absolute; left: 0; right: 0; top: 0; height: 54px; z-index: 5; display: flex; align-items: center; gap: 12px; padding: 0 16px; background: #fff; border-bottom: 1px solid #E8E8F0; }
.t-pomiro .pm-logo { width: 32px; height: 32px; border-radius: 9px; background: linear-gradient(160deg, #A27BF5, #6B45DC); color: #fff; display: grid; place-items: center; }
.t-pomiro .pm-logo svg { width: 19px; height: 19px; } .t-pomiro .pm-g { color: #6B6B85; display: grid; padding-right: 12px; border-right: 1px solid #E8E8F0; }
.t-pomiro .pm-nome { display: flex; align-items: center; gap: 6px; font-size: 13.5px; } .t-pomiro .pm-nome small { color: #8A8AA3; font-size: 13px; } .t-pomiro .pm-nome b { font-weight: 600; }
.t-pomiro .pm-nome svg { width: 14px; height: 14px; color: #8A8AA3; } .t-pomiro .pm-salvo { font-style: normal; font-size: 11px; color: #8A8AA3; margin-left: 8px; }
.t-pomiro .pm-dir { margin-left: auto; display: flex; align-items: center; gap: 10px; }
.t-pomiro .pm-gente { display: flex; margin-right: 6px; } .t-pomiro .pm-gente .pm-av { margin-left: -6px; width: 30px; height: 30px; font-size: 10.5px; }
.t-pomiro .pm-bt { display: inline-flex; align-items: center; gap: 6px; height: 34px; padding: 0 14px; border-radius: 8px; background: #7C5CF0; color: #fff; font-weight: 600; font-size: 12.5px; }
.t-pomiro .pm-bt.sec { background: #fff; color: #14142B; border: 1px solid #E2E2EE; } .t-pomiro .pm-bt svg { width: 13px; height: 13px; }
.t-pomiro .pm-ferr { position: absolute; left: 16px; top: 150px; z-index: 5; display: flex; flex-direction: column; gap: 3px; padding: 6px; background: #fff; border-radius: 12px; box-shadow: 0 10px 30px -12px rgba(20,20,43,.3), 0 0 0 1px #ECECF3; }
.t-pomiro .pm-ferr span { width: 36px; height: 36px; border-radius: 8px; display: grid; place-items: center; color: #4A4A66; }
.t-pomiro .pm-ferr span.on { background: #EFEAFE; color: #6B4FE0; } .t-pomiro .pm-ferr .ia { color: #7C5CF0; }
.t-pomiro .pm-ferr hr { width: 24px; border: 0; border-top: 1px solid #ECECF3; margin: 3px auto; }
.t-pomiro .pm-ferr.caneta .f0 { background: none; color: #4A4A66; } .t-pomiro .pm-ferr.caneta .f5 { background: #EFEAFE; color: #6B4FE0; }
.t-pomiro .pm-ferr.coment .f0 { background: none; color: #4A4A66; } .t-pomiro .pm-ferr.coment .f7 { background: #EFEAFE; color: #6B4FE0; }
.t-pomiro .pm-ferr.coment .f5 { background: none; color: #4A4A66; } .t-pomiro .pm-ferr.fim .f0 { background: #EFEAFE; color: #6B4FE0; } .t-pomiro .pm-ferr.fim .f7 { background: none; color: #4A4A66; }
.t-pomiro .pm-mini { position: absolute; right: 16px; bottom: 64px; z-index: 5; width: 180px; height: 110px; scale: .84; transform-origin: 100% 100%; border-radius: 10px; background: #fff; box-shadow: 0 10px 30px -12px rgba(20,20,43,.3), 0 0 0 1px #ECECF3; overflow: hidden; }
.t-pomiro .pm-mini i { position: absolute; border-radius: 2px; background: #E4E4EE; }
.t-pomiro .pm-mini .m1 { left: 64px; top: 42px; width: 26px; height: 18px; background: #D6CCFB; } .t-pomiro .pm-mini .m2 { left: 40px; top: 26px; width: 74px; height: 50px; background: none; border: 1.5px dashed #D9D9E5; }
.t-pomiro .pm-mini .m3 { left: 122px; top: 34px; width: 38px; height: 28px; } .t-pomiro .pm-mini .m4 { left: 10px; top: 8px; width: 24px; height: 16px; } .t-pomiro .pm-mini .m5 { left: 140px; top: 84px; width: 28px; height: 16px; }
.t-pomiro .pm-vp { position: absolute; left: 77px; top: 51px; width: 66px; height: 42px; margin: -21px 0 0 -33px; border: 2px solid #7C5CF0; border-radius: 3px; }
.t-pomiro .pm-zoomc { position: absolute; right: 16px; bottom: 16px; z-index: 5; display: flex; align-items: center; gap: 4px; height: 38px; padding: 0 6px; background: #fff; border-radius: 10px; box-shadow: 0 10px 30px -12px rgba(20,20,43,.3), 0 0 0 1px #ECECF3; }
.t-pomiro .pm-zoomc span { width: 28px; text-align: center; color: #4A4A66; font-size: 16px; } .t-pomiro .pm-zoomc b { width: 52px; text-align: center; font-weight: 600; font-size: 12.5px; font-variant-numeric: tabular-nums; }
.t-pomiro .pm-fit { display: grid; place-items: center; border-left: 1px solid #ECECF3; } .t-pomiro .pm-fit svg { width: 15px; height: 15px; }
`,
  roteiro(f) {
    const tl = f.tl, W = 1280, H = 800, O = { x: 640, y: 430 };
    const mundo = f.$('.pm-mundo');
    const mira = (x: number, y: number, zoom: number, ang: { rx?: number; ry?: number; rz?: number } = {}) => {
      const hw = 846 / zoom, hh = 476 / zoom;
      const cx = hw * 2 >= W ? W / 2 : Math.min(Math.max(x, hw), W - hw), cy = hh * 2 >= H ? H / 2 : Math.min(Math.max(y, hh), H - hh);
      return { ...ang, x: -(cx - W / 2) / W * 100 * zoom, y: -(cy - H / 2) / H * 100 * zoom, zoom };
    };
    const d = (s: number) => `depois+=${s}`;
    // ponto do mundo -> ponto da tela, dado o estado do canvas (escala s, deslocamento tx/ty)
    const tela = (wx: number, wy: number, s: number, tx = 0, ty = 0) => ({ x: O.x + tx + wx * s, y: O.y + ty + wy * s });
    // zoom do canvas: escala do mundo + indicador de % + retângulo do minimapa, sempre juntos
    let zAtual = 220;
    const zoom = (s: number, tx: number, ty: number, at: number, dur: number, ease = 'power2.inOut') => {
      tl.to(mundo, { scale: s, x: tx, y: ty, duration: dur, ease }, d(at));
      tl.to(f.$('.pm-vp'), { scale: Math.min(.55 / s, 1.9), duration: dur, ease }, d(at));
      f.contar('.pm-zoom', Math.round(s * 100), d(at), { de: zAtual, dur, fmt: n => `${Math.round(n)}%` });
      zAtual = Math.round(s * 100);
    };
    const clicar = (x: number, y: number, at: number, dur = .8) => {
      tl.to(f.ponteiro, { x, y, autoAlpha: 1, duration: dur, ease: 'power2.inOut' }, d(at));
      tl.fromTo(f.ponteiro.querySelector('i'), { scale: .2, autoAlpha: .9 }, { scale: 2.6, autoAlpha: 0, duration: .5, ease: 'power2.out', immediateRender: false }, d(at + dur))
        .to(f.ponteiro.querySelector('svg'), { scale: .82, duration: .08, yoyo: true, repeat: 1, transformOrigin: '0 0' }, d(at + dur));
    };

    // estados iniciais
    tl.set(mundo, { scale: 2.2, x: 0, y: 0 }, 0).set(f.$('.pm-vp'), { scale: .25 }, 0);
    tl.set(f.$$('.pm-obj, .pm-ramo, .pm-nota, .pm-quadro, .pm-pin, .pm-thread, .pm-cur, .pm-gente .g1, .pm-gente .g2, .pm-gente .g3'), { autoAlpha: 0 }, 0);
    tl.set(f.$$('.pm-svg path'), { autoAlpha: 0 }, 0);

    // 1 · Descreva o objetivo: colado no texto, a frase é digitada para a IA
    f.passo(1, 'Tudo começa com uma frase: o que o time precisa planejar.', 'depois');
    // já entra colado no detalhe (enquanto a foto de abertura se desfaz) e começa a recuar devagar
    f.camera(mira(640, 430, 1.5), .01, 'depois-=.5').camera(mira(620, 440, 1.32), 4.6, 'depois', 'power1.inOut');
    f.digitar('.pm-pedido', 'Plano para lançar o café especial Serra Azul em dezembro, na loja online e em 3 cafeterias parceiras.', d(.5), 36);
    f.classe('.pm-ia', 'foi', d(3.4));
    const bt = tela(150, 48, 2.2);
    clicar(bt.x, bt.y, 3.1, .7);
    f.texto('.pm-gerar em', 'Gerando rascunho…', d(3.85));
    tl.to(f.$('.pm-gerar'), { opacity: .75, duration: .3, yoyo: true, repeat: 1 }, d(3.9));
    f.esconderCursor(d(4.3));

    // 2 · Organize as ideias: o pedido vira objetivo e o mapa mental cresce enquanto a câmera se afasta
    f.passo(2, 'Em segundos, o pedido vira mapa mental, com post-its e ligações.', d(4.7));
    tl.to(f.$('.pm-ia'), { autoAlpha: 0, scale: .9, duration: .4 }, d(4.7));
    tl.fromTo(f.$('.pm-obj'), { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: .5, ease: 'power2.out', immediateRender: false }, d(4.8));
    zoom(.95, 0, -5, 4.8, 3, 'power2.inOut');
    f.camera(mira(640, 430, 1.12), 3, d(4.8));
    tl.set(f.$$('.pm-l1'), { autoAlpha: 1 }, d(5.3));
    f.desenhar('.pm-l1', d(5.3), .8);
    tl.fromTo(f.$$('.pm-ramo'), { autoAlpha: 0, scale: .4 }, { autoAlpha: 1, scale: 1, duration: .5, stagger: .12, ease: 'back.out(1.8)', immediateRender: false }, d(5.9));
    tl.set(f.$$('.pm-l2'), { autoAlpha: .75 }, d(6.4));
    f.desenhar('.pm-l2', d(6.4), .6);
    tl.fromTo(f.$$('.pm-nota'), { autoAlpha: 0, scale: .5 }, { autoAlpha: 1, scale: 1, duration: .45, stagger: .06, ease: 'back.out(1.6)', immediateRender: false }, d(6.7));
    zoom(.55, -20, -10, 7.9, 2.6, 'power1.inOut');
    f.camera(mira(640, 420, 1), 2.6, d(7.9));
    // desenho livre: alguém circula o preço
    f.classe('.pm-ferr', 'caneta', d(8.6));
    tl.set(f.$$('.pm-risco'), { autoAlpha: 1 }, d(9));
    f.desenhar('.pm-risco', d(9), .9);

    // 3 · Colabore com o time: cursores com nome, pins de comentário e uma conversa no ponto certo
    f.passo(3, 'O time entra no mesmo quadro e comenta onde precisa.', d(10.8));
    f.classe('.pm-ferr', 'coment', d(10.8));
    tl.fromTo(f.$$('.pm-gente .g1, .pm-gente .g2, .pm-gente .g3'), { autoAlpha: 0, x: 12 }, { autoAlpha: 1, x: 0, duration: .4, stagger: .15, immediateRender: false }, d(10.9));
    const cr = f.$('.cr'), cj = f.$('.cj'), cc = f.$('.cc');
    tl.fromTo(cr, { autoAlpha: 0, x: 980, y: -160 }, { autoAlpha: 1, x: 640, y: -470, duration: 1.6, ease: 'power2.inOut', immediateRender: false }, d(11))
      .to(cr, { x: -420, y: -600, duration: 1.8, ease: 'power2.inOut' }, d(12.8));
    tl.fromTo(cj, { autoAlpha: 0, x: -180, y: 760 }, { autoAlpha: 1, x: -600, y: 470, duration: 1.5, ease: 'power2.inOut', immediateRender: false }, d(11.2))
      .to(cj, { x: -540, y: 440, duration: .4 }, d(12.8));
    tl.fromTo(cc, { autoAlpha: 0, x: 980, y: 380 }, { autoAlpha: 1, x: 560, y: 470, duration: 1.4, ease: 'power2.inOut', immediateRender: false }, d(11.4))
      .to(cc, { x: -90, y: 330, duration: 1.6, ease: 'power2.inOut' }, d(13.6));
    tl.fromTo(f.$('.pm-pin.p1'), { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: .4, ease: 'back.out(2.4)', immediateRender: false }, d(13.1));
    tl.fromTo(f.$('.pm-pin.p2'), { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: .4, ease: 'back.out(2.4)', immediateRender: false }, d(14.4));
    tl.fromTo(f.$('.pm-thread'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: .45, ease: 'power2.out', immediateRender: false }, d(13.4));
    const th = tela(-120, 230, .55, -20, -10);
    f.camera(mira(th.x, th.y, 1.65), 1.6, d(13.3));
    f.digitar('.pm-resp-txt', 'Dá. Já confirmei com as 3 cafeterias.', d(15.2), 30);
    tl.to(cc, { x: 150, y: 420, duration: 1.2, ease: 'power2.inOut' }, d(15.4));

    // 4 · Refine o plano: os post-its saem do mapa e se organizam no quadro final
    f.passo(4, 'No fim, o rascunho vira o plano. No mesmo quadro.', d(17.8));
    f.classe('.pm-ferr', 'fim', d(17.8));
    tl.to(f.$$('.pm-cur, .pm-pin, .pm-thread, .pm-risco'), { autoAlpha: 0, duration: .4 }, d(17.8));
    zoom(.42, -300, -20, 17.8, 1.6);
    f.camera(mira(640, 400, 1), 1.4, d(17.8));
    tl.fromTo(f.$('.pm-quadro'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: .6, ease: 'power2.out', immediateRender: false }, d(18.5));
    tl.to(f.$$('.pm-l2'), { autoAlpha: 0, duration: .5 }, d(19));
    ramos.forEach((r, a) => r.notas.forEach((_, k) => {
      tl.to(f.$(`.n-${r.id}${k}`), { x: colX(r.col) - notaX(r, k), y: slotY(k) - notaY(r), rotation: -giro[(a * 3 + k) % 6], duration: 1, ease: 'power3.inOut' }, d(19.1 + a * .14 + k * .07));
    }));
    const qc = tela(FX + FW / 2, FY + FH / 2 - 30, .42, -300, -20);
    f.camera(mira(qc.x, qc.y, 2.1), 1.7, d(19.9));
    f.classe('.pm-quadro', 'final', d(21.6));
    tl.fromTo(f.$('.pm-qt span'), { scale: .6 }, { scale: 1, duration: .4, ease: 'back.out(2)', immediateRender: false }, d(21.6));
    // a câmera recua até o canvas infinito aparecer inteiro
    f.camera(mira(640, 400, 1), 1.6, d(22.8));
    zoom(.22, -100, -20, 23, 2.4, 'power2.inOut');
    f.pausa(1.2);
  }
};
export default t;
