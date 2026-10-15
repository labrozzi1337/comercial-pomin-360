// PominCHAT · "O celular que não para". Tela recriada do Atendimento real (tema claro, trilha pomin / atendimento / mensagens).
// Linguagem de câmera: cada passo começa num detalhe, bem de perto, e recua até revelar o contexto (zoom-out).
import { ic, W, H, type Trailer, type Filme, type Cam } from '../filme';
import { app } from '../dados';
import { svg, tools } from '../../src/data';

const X = {
  painel: svg('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/>'),
  sol: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  grade: svg('<path d="M5 5h.01M12 5h.01M19 5h.01M5 12h.01M12 12h.01M19 12h.01M5 19h.01M12 19h.01M19 19h.01" stroke-width="3"/>'),
  ajuda: svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="m5.6 5.6 3.6 3.6M14.8 14.8l3.6 3.6M14.8 9.2l3.6-3.6M5.6 18.4l3.6-3.6"/>'),
  equipe: svg('<path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/>'),
  lista: svg('<path d="M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>'),
  megafone: svg('<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>'),
  robo: svg('<rect x="4" y="8" width="16" height="12" rx="2"/><path d="M12 8V4M9 4h6"/><path d="M9 13v1M15 13v1"/>'),
  atualizar: svg('<path d="M21 12a9 9 0 0 1-15.5 6.2L3 16M3 12a9 9 0 0 1 15.5-6.2L21 8"/><path d="M21 3v5h-5M3 21v-5h5"/>'),
  clipe: svg('<path d="m21.4 11-9.2 9.2a6 6 0 0 1-8.5-8.5l8.6-8.6A4 4 0 1 1 18 8.8l-8.6 8.6a2 2 0 0 1-2.8-2.8l8.5-8.5"/>'),
  mic: svg('<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4"/>'),
  checks: svg('<path d="M17 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/>'),
  tela: svg('<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>'),
  fechar: svg('<path d="M18 6 6 18M6 6l12 12"/>'),
  baixo: svg('<path d="m6 9 6 6 6-6"/>')
};
const zap = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${tools.find(t => t.name === 'WhatsApp Business')?.svg ?? ''}</svg>`;

// A fila: quem espera há mais tempo aparece primeiro
const fila: { i: string; c: string; nome: string; emp: string; msg: string; h: string; n?: number; dono?: [string, string, string]; sla?: string; bot?: boolean; tipo?: 'clipe' | 'mic' }[] = [
  { i: 'MC', c: '#2E9E8F', nome: 'Marina Castro', emp: 'Construtora Aurora', msg: 'Preciso fechar ainda hoje.', h: '17:52', n: 2, sla: '05:00' },
  { i: 'ST', c: '#5B7CF0', nome: 'Sérgio Tavares', emp: 'Rede Bom Preço', msg: 'pedido_loja3.pdf', h: '17:52', n: 1, dono: ['JM', '#C2410C', 'Júlia'], tipo: 'clipe' },
  { i: 'FL', c: '#D9822B', nome: 'Fernanda Lima', emp: 'Clínica Vida Plena', msg: 'Qual a data do boleto de outubro?', h: '17:53', n: 1, bot: true },
  { i: 'PH', c: '#8B5CF6', nome: 'Paulo Henrique', emp: 'Transportes Serra Azul', msg: 'Áudio · 0:42', h: '17:53', n: 2, sla: '04:31', tipo: 'mic' },
  { i: 'AR', c: '#E0567A', nome: 'Aline Rocha', emp: 'Padaria Trigo Bom', msg: 'Ainda vale a condição de ontem?', h: '17:54', n: 1, sla: '04:47' },
  { i: 'DM', c: '#3A9BD9', nome: 'Diego Martins', emp: 'Auto Peças Rota 10', msg: 'Pode me ligar depois das 18h?', h: '17:54', n: 1, sla: '04:58' },
  { i: 'PS', c: '#64748B', nome: 'Patrícia Souza', emp: 'Hotel Mirante do Vale', msg: 'Obrigada, recebi a nota.', h: '17:55', dono: ['CF', '#0F766E', 'Caio'] }
];
const av = (i: string, c: string, cls = '') => `<span class="av ${cls}" style="--a:${c}">${i}</span>`;
const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

// olhar() sem mostrar o fundo do palco: o centro fica preso dentro da tela (palco 16:9, tela a 84% da altura)
function mira(f: Filme, s: string, zoom: number, dur: number, at: number, ang: Cam = {}) {
  const p = f.pos(s), hx = Math.min(W / 2, 880 / zoom), hy = Math.min(H / 2, 495 / zoom);
  const cx = Math.max(hx, Math.min(W - hx, p.x + p.w / 2)), cy = Math.max(hy, Math.min(H - hy, p.y + p.h / 2));
  return f.camera({ ...ang, x: -(cx - W / 2) / W * 100 * zoom, y: -(cy - H / 2) / H * 100 * zoom, zoom }, dur, at);
}

const t: Trailer = {
  ui: `<div class="ch">
    <aside class="ch-lado"><span class="ch-logo">${app('chat').icon}</span>
      <span class="ch-nav">${ic('inicio')}</span><i class="ch-sep"></i>
      <span class="ch-nav on">${ic('conversa')}</span><span class="ch-nav">${X.equipe}</span><span class="ch-nav dot">${ic('pessoas')}</span>
      <span class="ch-nav">${ic('video')}</span><span class="ch-nav">${ic('agenda')}</span><span class="ch-nav">${X.lista}</span><span class="ch-nav">${X.megafone}</span>
      <i class="ch-sep"></i><span class="ch-nav">${ic('ia')}</span><span class="ch-eu">R</span></aside>
    <header class="ch-topo"><span class="ch-tg">${X.painel}</span><span class="ch-trilha">pomin<i>/</i>atendimento<i>/</i><b>mensagens</b></span>
      <div class="ch-dir"><span class="ch-busca">${ic('busca')}Buscar…<kbd>Ctrl K</kbd></span><span class="ch-ib">${ic('sino')}<em>3</em></span><span class="ch-ib">${X.ajuda}</span><span class="ch-ib">${X.sol}</span><span class="ch-ib">${X.grade}</span></div></header>
    <main class="ch-corpo">
      <div class="ch-barra">
        <span class="ch-inst"><span class="ch-zap">${zap}</span><b>WhatsApp Comercial</b><i></i>conectado</span>
        <span class="ch-filas"><span class="on">Fila Comercial <em class="ch-nfila">0</em></span><span>Financeiro <em>2</em></span><span>Pós-venda <em>1</em></span></span>
        <span class="ch-bt">${X.robo}Bot: ligado</span><span class="ch-bt">${X.atualizar}Atualizar</span>
      </div>
      <div class="ch-lista" data-r>
        <div class="ch-procura">${ic('busca')}Buscar conversas, empresas e mensagens…</div>
        <div class="ch-pills"><span>Ambos</span><span class="on">Abertos</span><span>Concluído</span></div>
        <div class="ch-pills"><span class="on">Todos</span><span>Meus chats</span><span>Não atribuídos <em class="ch-nao">0</em></span></div>
        <div class="ch-sel"><i></i>Selecionar todos<span>Mais antigos primeiro</span></div>
        <div class="ch-itens">${fila.map((c, k) => `<div class="ch-item i${k}${k === 0 ? ' on' : ''}">${av(c.i, c.c)}
          <div class="ch-it"><b>${c.nome}</b><small>${c.emp}</small></div><time>${c.h}</time>
          <p class="ch-prev">${c.tipo ? X[c.tipo] : ''}${c.msg}</p>${c.n ? `<em class="ch-nl">${c.n}</em>` : '<span></span>'}
          <div class="ch-pe"><span class="ch-tag">Comercial</span>${c.dono ? `<span class="ch-resp">${av(c.dono[0], c.dono[1], 'mini')}${c.dono[2]}</span>` : c.bot ? `<span class="ch-auto">${X.robo}Automação respondendo</span>` : `<span class="ch-chip">${ic('relogio')}${c.sla}</span>`}${k === 0 ? `<span class="ch-resp rn">${av('RN', '#1F5FAE', 'mini')}Rafael</span>` : ''}</div></div>`).join('')}</div>
      </div>
      <div class="ch-conv" data-r>
        <header class="ch-ccab">${av('MC', '#2E9E8F')}<div class="ch-quem"><b>Marina Castro</b><small>Construtora Aurora<i>·</i>${zap}WhatsApp</small></div>
          <span class="ch-sla">${ic('relogio')}<span class="a">1ª resposta em <b class="ch-slat">05:00</b></span><span class="b">Respondida em 1min48s</span></span>
          <div class="ch-dono"><span class="sem">Sem responsável</span><span class="ch-assumir">Assumir</span><span class="rn">${av('RN', '#1F5FAE')}<span class="tx"><b>Rafael Nogueira</b><small>Comercial</small></span></span></div></header>
        <div class="ch-msgs">
          <span class="ch-dia">Ontem</span>
          <div class="ch-b out">Marina, segue o catálogo de cadeiras de escritório.<span class="ch-arq">${ic('doc')}<span><b>Catalogo_Cadeiras_2026.pdf</b><small>2,4 MB · PDF</small></span></span><small>16:20 ${X.checks}</small></div>
          <div class="ch-b in">Obrigada! Vou ver com a diretoria e te falo.<small>16:41</small></div>
          <span class="ch-dia">Hoje</span>
          <div class="ch-b in ch-in1">Boa tarde! Vocês conseguem entregar 200 cadeiras até sexta?<small>17:52</small></div>
          <div class="ch-b in ch-in2">Preciso fechar ainda hoje.<small>17:52</small></div>
          <span class="ch-sys">${X.robo}Automação: saudação enviada e conversa na fila Comercial</span>
          <div class="ch-b out ch-out1">Oi, Marina! Consigo sim: 200 cadeiras na sexta, com frete incluso. Te mando a proposta agora.<small>17:54 ${X.checks}</small></div>
          <div class="ch-b in ch-in3">Perfeito, obrigada pela rapidez!<small>17:55</small></div>
        </div>
        <footer class="ch-comp"><span class="ch-ico">${X.clipe}</span><span class="ch-campo"><span class="ch-ph">Escreva uma mensagem ou digite / para respostas rápidas</span><span class="ch-dig"></span></span><span class="ch-ico">${X.mic}</span><span class="ch-enviar">${ic('enviar')}</span></footer>
      </div>
      <aside class="ch-info" data-r>
        <div class="ch-ficha">${av('MC', '#2E9E8F', 'g')}<b>Marina Castro</b><small>Compras · Construtora Aurora</small><span class="ch-tags"><i>Cliente desde 2023</i><i>Comercial</i></span></div>
        <dl class="ch-dados"><dt>Responsável</dt><dd><span class="sem">Ninguém ainda</span><span class="rn">Rafael Nogueira</span></dd><dt>Fila</dt><dd>Comercial</dd><dt>Canal</dt><dd>WhatsApp</dd><dt>Prazo de 1ª resposta</dt><dd>5 minutos</dd></dl>
        <h4>Histórico com a empresa</h4>
        <ul class="ch-hist"><li><b>13/10</b>Catálogo enviado por Rafael</li><li><b>02/10</b>Pedido 4.518 entregue</li><li><b>21/09</b>Primeiro contato pelo site</li></ul>
        <h4>Automações ativas</h4>
        <ul class="ch-autos"><li>Saudação e escolha de fila<i></i></li><li>Mensagem fora do horário<i></i></li><li>Pesquisa ao concluir<i></i></li></ul>
      </aside>
      <div class="ch-camp">
        <header><span class="ch-mg">${X.megafone}</span><div><b>Nova campanha</b><small>WhatsApp Comercial · modelo aprovado</small></div><span class="ch-x">${X.fechar}</span></header>
        <label>Nome da campanha</label><div class="ch-in">Feirão de outubro · cadeiras e mesas</div>
        <label>Público</label><div class="ch-in pub"><i>Clientes ativos</i><i>Comprou nos últimos 12 meses</i><b>1.284 contatos</b></div>
        <label>Mensagem</label>
        <div class="ch-cmsg"><div class="ch-b out">Oi, {{nome}}! Até sexta, 15% de desconto nas linhas de cadeiras e mesas de escritório. Responda QUERO e um consultor te chama.<small>agora ${X.checks}</small></div><span class="ch-rb">QUERO</span><span class="ch-rb">Agora não</span></div>
        <label>Envio</label><div class="ch-envio"><span class="on"><i></i>Agora</span><span><i></i>Agendar</span><span class="ch-ritmo">Ritmo seguro: 40 por minuto</span></div>
        <div class="ch-cpe"><span class="ch-bt">Cancelar</span><span class="ch-disparar">${ic('enviar')}Disparar para 1.284 contatos</span></div>
        <div class="ch-prog"><div class="ch-pbar"><i></i></div><div class="ch-pnum"><span><b class="n1">0</b>Enviadas</span><span><b class="n2">0</b>Entregues</span><span><b class="n3">0</b>Lidas</span><span><b class="n4">0</b>Respostas</span></div></div>
      </div>
      <div class="ch-equipe">
        <header>${av('JM', '#C2410C')}<div><b>Júlia Mendes</b><small><i></i>Logística · online</small></div><span class="ch-vid">${ic('video')}Iniciar vídeo</span></header>
        <div class="ch-eq">
          <div class="ch-b in ch-jm">Rafael, a Aurora fechou as 200? Preciso reservar o caminhão de sexta.<small>17:57</small></div>
          <div class="ch-b out ch-rr"><span class="ch-rdig"></span><small>17:58 ${X.checks}</small></div>
        </div>
      </div>
      <div class="ch-call">
        <header><span class="ch-rec"></span><b>Entrega Construtora Aurora</b><small>Sala do time · <span class="ch-ct">00:00</span></small><span class="ch-part">${ic('pessoas')}4 na sala</span></header>
        <div class="ch-tiles">${[['RN', '#1F5FAE', 'Rafael Nogueira', 1], ['JM', '#C2410C', 'Júlia Mendes', 0], ['BA', '#7C3AED', 'Bruno Almeida', 0], ['CF', '#0F766E', 'Caio Ferreira', 2]].map(([i, c, n, s]) => `<div class="ch-tile${s === 1 ? ' fala' : ''}" style="--a:${c}">${av(String(i), String(c), 'g')}<span class="nm">${s === 2 ? `${n} · entrando…` : n}</span><em>${X.mic}</em></div>`).join('')}</div>
        <footer><span>${X.mic}</span><span>${ic('video')}</span><span>${X.tela}</span><span>${ic('conversa')}</span><span class="sair">Sair</span></footer>
      </div>
    </main></div>`,
  css: `
.t-chat .ch { --borda: #E3E8EF; --texto: #152033; --suave: #6A7789; --pri: #1F5FAE; position: relative; width: 1280px; height: 800px; display: grid; grid-template-columns: 60px 1fr; grid-template-rows: 52px 1fr; background: #F6F8FB; color: var(--texto); font: 400 13px/1.4 Oxanium, system-ui, sans-serif; }
.t-chat .ch * { box-sizing: border-box; }
.t-chat svg { width: 17px; height: 17px; flex: none; }
.t-chat .av { width: 34px; height: 34px; border-radius: 50%; background: var(--a); color: #fff; display: inline-grid; place-items: center; font-size: 11px; font-weight: 700; flex: none; letter-spacing: .02em; }
.t-chat .av.mini { width: 18px; height: 18px; font-size: 7.5px; } .t-chat .av.g { width: 46px; height: 46px; font-size: 15px; }
.t-chat .ch-lado { grid-row: 1 / 3; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 9px 0 12px; background: #fff; border-right: 1px solid var(--borda); }
.t-chat .ch-logo { width: 36px; height: 36px; border-radius: 9px; background: linear-gradient(160deg, #62D4DC, #2A9DB0); color: #fff; display: grid; place-items: center; margin-bottom: 12px; }
.t-chat .ch-logo svg { width: 20px; height: 20px; }
.t-chat .ch-nav { position: relative; width: 40px; height: 34px; border-radius: 8px; display: grid; place-items: center; color: #4A5668; }
.t-chat .ch-nav.on { background: #EAF2FA; color: var(--pri); box-shadow: inset 0 0 0 1px #C9DCF0; }
.t-chat .ch-nav.dot::after { content: ''; position: absolute; top: 6px; right: 8px; width: 6px; height: 6px; border-radius: 50%; background: var(--pri); }
.t-chat .ch-sep { width: 28px; height: 1px; background: var(--borda); margin: 5px 0; }
.t-chat .ch-eu { margin-top: auto; width: 32px; height: 32px; border: 1.5px solid #1F3B5C; border-radius: 7px; display: grid; place-items: center; font-weight: 700; font-size: 12px; }
.t-chat .ch-topo { display: flex; align-items: center; gap: 16px; padding: 0 16px 0 18px; background: #fff; border-bottom: 1px solid var(--borda); color: #4A5668; }
.t-chat .ch-trilha { font: 500 11.5px 'JetBrains Mono', monospace; color: var(--suave); } .t-chat .ch-trilha i { font-style: normal; color: #B5BFCC; margin: 0 7px; } .t-chat .ch-trilha b { color: var(--texto); font-weight: 600; }
.t-chat .ch-dir { margin-left: auto; display: flex; gap: 8px; align-items: center; }
.t-chat .ch-busca { height: 32px; display: flex; align-items: center; gap: 8px; padding: 0 7px 0 10px; border: 1px solid var(--borda); border-radius: 8px; color: var(--suave); font-size: 12px; }
.t-chat .ch-busca svg { width: 14px; height: 14px; } .t-chat kbd { font: 500 9.5px 'JetBrains Mono', monospace; border: 1px solid var(--borda); background: #F6F8FB; border-radius: 4px; padding: 2px 5px; margin-left: 4px; }
.t-chat .ch-ib { position: relative; width: 32px; height: 32px; border: 1px solid var(--borda); border-radius: 8px; display: grid; place-items: center; }
.t-chat .ch-ib svg { width: 16px; height: 16px; } .t-chat .ch-ib em { position: absolute; top: -6px; right: -5px; min-width: 16px; height: 16px; border-radius: 99px; background: var(--pri); color: #fff; font: 700 9.5px/16px Oxanium; text-align: center; font-style: normal; border: 2px solid #fff; box-sizing: content-box; }

.t-chat .ch-corpo { position: relative; display: grid; grid-template-columns: 330px 1fr 236px; grid-template-rows: 36px minmax(0, 1fr); gap: 12px 14px; padding: 14px 18px 18px; overflow: hidden; }
.t-chat .ch-barra { grid-column: 1 / -1; display: flex; align-items: center; gap: 10px; }
.t-chat .ch-inst { display: flex; align-items: center; gap: 8px; height: 34px; padding: 0 12px 0 6px; background: #fff; border: 1px solid var(--borda); border-radius: 9px; font-size: 12px; color: var(--suave); }
.t-chat .ch-inst b { color: var(--texto); font-weight: 600; } .t-chat .ch-inst i { width: 7px; height: 7px; border-radius: 50%; background: #16A34A; box-shadow: 0 0 0 3px #DCFCE7; }
.t-chat .ch-zap { width: 24px; height: 24px; border-radius: 6px; background: #E7F8EE; color: #1DA851; display: grid; place-items: center; } .t-chat .ch-zap svg { width: 14px; height: 14px; }
.t-chat .ch-filas { display: flex; gap: 4px; margin-right: auto; padding: 3px; background: #EEF2F6; border-radius: 9px; font-size: 12px; color: var(--suave); }
.t-chat .ch-filas > span { padding: 5px 10px; border-radius: 7px; } .t-chat .ch-filas .on { background: #fff; color: var(--texto); font-weight: 600; box-shadow: 0 1px 2px rgba(15, 30, 50, .08); }
.t-chat .ch-filas em { font-style: normal; margin-left: 4px; font-size: 10.5px; padding: 0 6px; border-radius: 99px; background: #DCE6F0; color: #3B4B5F; } .t-chat .ch-filas .on em { background: var(--pri); color: #fff; }
.t-chat .ch-bt { display: inline-flex; align-items: center; gap: 7px; height: 34px; padding: 0 13px; background: #fff; border: 1px solid var(--borda); border-radius: 9px; font-size: 12px; color: #3B4B5F; }
.t-chat .ch-bt svg { width: 15px; height: 15px; }

.t-chat .ch-lista, .t-chat .ch-conv, .t-chat .ch-info { min-height: 0; background: #fff; border: 1px solid var(--borda); border-radius: 12px; overflow: hidden; }
.t-chat .ch-lista { background: #FBFCFD; display: flex; flex-direction: column; }
.t-chat .ch-procura { margin: 12px 12px 8px; height: 36px; display: flex; align-items: center; gap: 8px; padding: 0 11px; background: #fff; border: 1px solid var(--borda); border-radius: 8px; color: #97A3B3; font-size: 12px; }
.t-chat .ch-procura svg { width: 15px; height: 15px; }
.t-chat .ch-pills { display: flex; gap: 2px; margin: 0 12px 6px; padding: 2px; border: 1px solid var(--borda); border-radius: 99px; width: max-content; background: #fff; font-size: 11.5px; color: var(--suave); }
.t-chat .ch-pills span { padding: 3px 10px; border-radius: 99px; } .t-chat .ch-pills .on { background: #E6EFF8; color: #2F6FB8; font-weight: 600; }
.t-chat .ch-pills em { font-style: normal; font-weight: 700; color: #B45309; margin-left: 2px; } .t-chat .ch-pills .d::before { content: ''; display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #9FB3C8; margin-right: 5px; vertical-align: 1px; }
.t-chat .ch-sel { white-space: nowrap; display: flex; align-items: center; gap: 8px; padding: 8px 14px; margin-top: 4px; border-top: 1px solid var(--borda); border-bottom: 1px solid var(--borda); font-size: 12px; color: #3B4B5F; }
.t-chat .ch-sel i { width: 13px; height: 13px; border: 1.5px solid #B5BFCC; border-radius: 3px; } .t-chat .ch-sel span { margin-left: auto; font-size: 10px; color: #97A3B3; }
.t-chat .ch-itens { flex: 1; min-height: 0; }
.t-chat .ch-item { position: relative; display: grid; grid-template-columns: 34px 1fr auto; grid-template-areas: 'a n h' 'a p l' 'a f f'; gap: 1px 10px; padding: 9px 14px 9px 12px; border-bottom: 1px solid #EEF2F6; background: #FBFCFD; }
.t-chat .ch-item > .av { grid-area: a; margin-top: 2px; }
.t-chat .ch-item.on { background: #EEF6FB; } .t-chat .ch-item.on::before { content: ''; position: absolute; left: 0; top: 8px; bottom: 8px; width: 3px; border-radius: 0 3px 3px 0; background: #2A9DB0; }
.t-chat .ch-it { grid-area: n; display: flex; align-items: baseline; gap: 6px; min-width: 0; white-space: nowrap; } .t-chat .ch-it b { font-weight: 600; font-size: 12.5px; } .t-chat .ch-it small { font-size: 10.5px; color: var(--suave); overflow: hidden; text-overflow: ellipsis; }
.t-chat .ch-item time { grid-area: h; font-size: 10.5px; color: #1DA851; font-weight: 600; }
.t-chat .ch-prev { grid-area: p; margin: 0; display: flex; align-items: center; gap: 4px; font-size: 12px; color: #4A5668; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } .t-chat .ch-prev svg { width: 13px; height: 13px; color: var(--suave); }
.t-chat .ch-nl { grid-area: l; justify-self: end; font-style: normal; min-width: 18px; height: 18px; border-radius: 99px; background: #1DA851; color: #fff; font-size: 10px; font-weight: 700; display: grid; place-items: center; padding: 0 5px; }
.t-chat .ch-pe { grid-area: f; display: flex; gap: 6px; align-items: center; margin-top: 4px; }
.t-chat .ch-tag { font-size: 10px; padding: 1px 7px; border-radius: 4px; background: #EEF2F6; color: #3B4B5F; }
.t-chat .ch-chip, .t-chat .ch-auto, .t-chat .ch-resp { display: inline-flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 600; padding: 1px 7px 1px 5px; border-radius: 99px; }
.t-chat .ch-chip { color: #B45309; background: #FEF3C7; } .t-chat .ch-chip svg, .t-chat .ch-auto svg { width: 11px; height: 11px; }
.t-chat .ch-auto { color: #6D28D9; background: #EDE9FE; } .t-chat .ch-resp { color: #3B4B5F; background: #EEF2F6; padding-left: 2px; }
.t-chat .ch-resp.rn, .t-chat .ch.assumido .i0 .ch-chip { display: none; } .t-chat .ch.assumido .i0 .ch-resp.rn { display: inline-flex; }

.t-chat .ch-conv { display: flex; flex-direction: column; }
.t-chat .ch-ccab { display: flex; align-items: center; gap: 10px; height: 62px; padding: 0 14px 0 16px; border-bottom: 1px solid var(--borda); }
.t-chat .ch-quem { display: flex; flex-direction: column; white-space: nowrap; } .t-chat .ch-quem i { font-style: normal; margin: 0 2px; } .t-chat .ch-quem b { font-weight: 600; font-size: 14px; } .t-chat .ch-quem small { display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--suave); } .t-chat .ch-quem small svg { width: 11px; height: 11px; color: #1DA851; }
.t-chat .ch-sla { white-space: nowrap; margin-left: auto; display: inline-flex; align-items: center; gap: 6px; height: 30px; padding: 0 11px; border-radius: 8px; background: #FEF3C7; color: #92400E; font-size: 11.5px; }
.t-chat .ch-sla b { font: 600 12.5px 'JetBrains Mono', monospace; } .t-chat .ch-sla svg { width: 15px; height: 15px; } .t-chat .ch-sla .b { display: none; }
.t-chat .ch-sla.ok { background: #DCFCE7; color: #166534; } .t-chat .ch-sla.ok .a { display: none; } .t-chat .ch-sla.ok .b { display: inline; font-weight: 600; }
.t-chat .ch-dono { white-space: nowrap; width: 172px; display: flex; align-items: center; justify-content: flex-end; gap: 8px; font-size: 11.5px; color: var(--suave); }
.t-chat .ch-assumir { height: 30px; padding: 0 14px; display: inline-flex; align-items: center; border-radius: 8px; background: linear-gradient(180deg, #3E86D6, #1F5FAE); color: #fff; font-weight: 600; font-size: 12px; }
.t-chat .ch-dono .rn, .t-chat .ch-dados .rn, .t-chat .ch.assumido .ch-dono .sem, .t-chat .ch.assumido .ch-assumir, .t-chat .ch.assumido .ch-dados .sem { display: none; }
.t-chat .ch.assumido .ch-dono .rn { display: flex; align-items: center; gap: 8px; } .t-chat .ch.assumido .ch-dados .rn { display: inline; }
.t-chat .ch-dono .rn .av { width: 28px; height: 28px; font-size: 10px; } .t-chat .ch-dono .rn .tx { display: flex; flex-direction: column; line-height: 1.25; } .t-chat .ch-dono .rn b { color: var(--texto); font-weight: 600; font-size: 12px; } .t-chat .ch-dono .rn small { font-size: 10.5px; }

.t-chat .ch-msgs { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 8px; padding: 14px 22px; background: #F4F7F9; }
.t-chat .ch-dia { align-self: center; font-size: 10.5px; color: var(--suave); background: #E6ECF2; padding: 2px 11px; border-radius: 99px; }
.t-chat .ch-b { position: relative; max-width: 74%; padding: 7px 11px 5px; border-radius: 10px; font-size: 13px; line-height: 1.42; box-shadow: 0 1px 1px rgba(15, 30, 50, .05); }
.t-chat .ch-b.in { align-self: flex-start; background: #fff; border: 1px solid #E3E8EF; border-top-left-radius: 3px; }
.t-chat .ch-b.out { align-self: flex-end; background: #D9F1F3; border: 1px solid #BFE5E9; border-top-right-radius: 3px; }
.t-chat .ch-b > small { display: flex; justify-content: flex-end; align-items: center; gap: 3px; font-size: 10px; color: #7A8796; margin-top: 1px; } .t-chat .ch-b > small svg { width: 14px; height: 14px; color: #2A9DB0; }
.t-chat .ch-arq { display: flex; align-items: center; gap: 8px; margin-top: 6px; padding: 7px 9px; border-radius: 7px; background: rgba(255, 255, 255, .7); border: 1px solid #BFE5E9; }
.t-chat .ch-arq svg { width: 20px; height: 20px; color: #DC2626; } .t-chat .ch-arq span { display: flex; flex-direction: column; } .t-chat .ch-arq b { font-weight: 600; font-size: 12px; } .t-chat .ch-arq small { font-size: 10px; color: var(--suave); }
.t-chat .ch-sys { align-self: center; display: inline-flex; gap: 6px; align-items: center; font-size: 11px; color: #5B21B6; background: #F3F0FF; border: 1px solid #DDD6FE; padding: 3px 11px; border-radius: 99px; } .t-chat .ch-sys svg { width: 13px; height: 13px; }
.t-chat .ch-comp { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-top: 1px solid var(--borda); background: #fff; color: var(--suave); }
.t-chat .ch-campo { position: relative; flex: 1; height: 54px; padding: 8px 12px; border: 1px solid var(--borda); border-radius: 9px; font-size: 13px; line-height: 1.4; color: var(--texto); overflow: hidden; }
.t-chat .ch-ph { position: absolute; left: 12px; top: 17px; color: #97A3B3; white-space: nowrap; }
.t-chat .ch-enviar { width: 40px; height: 40px; border-radius: 9px; background: linear-gradient(180deg, #3E86D6, #1F5FAE); color: #fff; display: grid; place-items: center; }

.t-chat .ch-info { padding: 16px 14px; font-size: 12px; }
.t-chat .ch-ficha { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 2px; padding-bottom: 14px; border-bottom: 1px solid var(--borda); }
.t-chat .ch-ficha .av { margin-bottom: 6px; } .t-chat .ch-ficha b { font-weight: 600; font-size: 14px; } .t-chat .ch-ficha small { color: var(--suave); font-size: 11px; }
.t-chat .ch-tags { display: flex; gap: 4px; margin-top: 8px; } .t-chat .ch-tags i { font-style: normal; font-size: 10px; padding: 1px 7px; border-radius: 4px; background: #E6F6F7; color: #1C7C8A; }
.t-chat .ch-dados { display: grid; grid-template-columns: auto 1fr; gap: 7px 10px; margin: 14px 0; } .t-chat .ch-dados dt { color: var(--suave); font-size: 11px; } .t-chat .ch-dados dd { margin: 0; text-align: right; font-weight: 600; font-size: 11.5px; }
.t-chat .ch-dados .sem { color: #B45309; }
.t-chat .ch-info h4 { margin: 12px 0 7px; padding-top: 12px; border-top: 1px solid var(--borda); font-size: 10.5px; font-weight: 600; letter-spacing: .07em; text-transform: uppercase; color: var(--suave); }
.t-chat .ch-hist, .t-chat .ch-autos { list-style: none; margin: 0; padding: 0; display: grid; gap: 7px; font-size: 11.5px; }
.t-chat .ch-hist b { display: inline-block; width: 40px; font: 600 10.5px 'JetBrains Mono', monospace; color: var(--suave); }
.t-chat .ch-autos li { display: flex; justify-content: space-between; align-items: center; } .t-chat .ch-autos i { width: 26px; height: 15px; border-radius: 99px; background: #2A9DB0; position: relative; } .t-chat .ch-autos i::after { content: ''; position: absolute; right: 2px; top: 2px; width: 11px; height: 11px; border-radius: 50%; background: #fff; }

.t-chat .ch-camp { position: absolute; top: 62px; right: 18px; bottom: 18px; width: 436px; z-index: 5; padding: 16px 20px; background: #fff; border: 1px solid var(--borda); border-radius: 12px; box-shadow: -30px 0 70px rgba(15, 30, 50, .2); font-size: 12px; }
.t-chat .ch-camp header { display: flex; align-items: center; gap: 10px; padding-bottom: 12px; margin-bottom: 4px; border-bottom: 1px solid var(--borda); }
.t-chat .ch-camp header div { display: flex; flex-direction: column; } .t-chat .ch-camp header b { font-size: 15px; font-weight: 600; } .t-chat .ch-camp header small { color: var(--suave); font-size: 11px; }
.t-chat .ch-mg { width: 34px; height: 34px; border-radius: 9px; background: #E6F6F7; color: #1C7C8A; display: grid; place-items: center; } .t-chat .ch-x { margin-left: auto; color: var(--suave); }
.t-chat .ch-camp label { display: block; margin: 11px 0 5px; font-size: 10.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--suave); }
.t-chat .ch-in { min-height: 34px; display: flex; align-items: center; gap: 6px; padding: 0 11px; border: 1px solid var(--borda); border-radius: 8px; font-size: 12.5px; }
.t-chat .ch-in.pub i { font-style: normal; font-size: 11px; padding: 2px 8px; border-radius: 6px; background: #EEF2F6; } .t-chat .ch-in.pub b { margin-left: auto; color: #1C7C8A; font-weight: 600; font-size: 12px; }
.t-chat .ch-cmsg { padding: 12px; border-radius: 9px; background: #F4F7F9; border: 1px solid var(--borda); display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 6px; }
.t-chat .ch-cmsg .ch-b { max-width: 88%; flex-basis: 100%; margin-left: auto; font-size: 12.5px; }
.t-chat .ch-rb { font-size: 11.5px; font-weight: 600; color: #1C7C8A; background: #fff; border: 1px solid #BFE5E9; border-radius: 7px; padding: 4px 12px; }
.t-chat .ch-envio { display: flex; gap: 14px; align-items: center; font-size: 12.5px; } .t-chat .ch-envio span { display: flex; align-items: center; gap: 6px; }
.t-chat .ch-envio i { width: 14px; height: 14px; border-radius: 50%; border: 1.5px solid #B5BFCC; } .t-chat .ch-envio .on i { border: 4px solid #1F5FAE; } .t-chat .ch-ritmo { margin-left: auto; font-size: 11px; color: var(--suave); }
.t-chat .ch-cpe { display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; }
.t-chat .ch-disparar { display: inline-flex; align-items: center; gap: 7px; height: 34px; padding: 0 14px; border-radius: 9px; background: linear-gradient(180deg, #3E86D6, #1F5FAE); color: #fff; font-weight: 600; } .t-chat .ch-disparar svg { width: 15px; height: 15px; }
.t-chat .ch-prog { margin-top: 14px; padding: 12px 14px; border-radius: 10px; background: #F6FAFB; border: 1px solid #D5ECEF; }
.t-chat .ch-pbar { height: 6px; border-radius: 99px; background: #DCE8EC; overflow: hidden; } .t-chat .ch-pbar i { display: block; height: 100%; width: 100%; background: #2A9DB0; border-radius: inherit; transform-origin: 0 50%; }
.t-chat .ch-pnum { display: grid; grid-template-columns: repeat(4, 1fr); margin-top: 10px; font-size: 10.5px; color: var(--suave); } .t-chat .ch-pnum b { display: block; font-size: 17px; font-weight: 600; color: var(--texto); }

.t-chat .ch-equipe { position: absolute; right: 18px; bottom: 18px; width: 340px; z-index: 6; background: #fff; border: 1px solid var(--borda); border-radius: 12px; box-shadow: 0 24px 60px rgba(15, 30, 50, .22); overflow: hidden; }
.t-chat .ch-equipe header { display: flex; align-items: center; gap: 10px; padding: 11px 12px; border-bottom: 1px solid var(--borda); }
.t-chat .ch-equipe header div { display: flex; flex-direction: column; } .t-chat .ch-equipe header b { font-weight: 600; font-size: 13px; } .t-chat .ch-equipe header small { font-size: 10.5px; color: var(--suave); display: flex; align-items: center; gap: 5px; }
.t-chat .ch-equipe header small i { width: 7px; height: 7px; border-radius: 50%; background: #16A34A; }
.t-chat .ch-vid { margin-left: auto; display: inline-flex; align-items: center; gap: 6px; height: 30px; padding: 0 11px; border-radius: 8px; background: linear-gradient(180deg, #3E86D6, #1F5FAE); color: #fff; font-size: 11.5px; font-weight: 600; } .t-chat .ch-vid svg { width: 15px; height: 15px; }
.t-chat .ch-eq { display: flex; flex-direction: column; gap: 7px; padding: 12px; background: #F4F7F9; min-height: 168px; }
.t-chat .ch-eq .ch-b { font-size: 12.5px; max-width: 86%; } .t-chat .ch-rr { min-width: 60%; min-height: 54px; } .t-chat .ch-rdig { display: block; min-height: 18px; }

.t-chat .ch-call { position: absolute; left: 196px; top: 118px; width: 828px; height: 500px; z-index: 8; display: flex; flex-direction: column; background: #0E1620; border-radius: 14px; box-shadow: 0 40px 100px rgba(10, 20, 35, .45); color: #E6EDF5; overflow: hidden; }
.t-chat .ch-call header { display: flex; align-items: center; gap: 10px; padding: 14px 18px; font-size: 13px; } .t-chat .ch-call header b { font-weight: 600; } .t-chat .ch-call header small { color: #8796A8; }
.t-chat .ch-rec { width: 8px; height: 8px; border-radius: 50%; background: #EF4444; } .t-chat .ch-ct { font-family: 'JetBrains Mono', monospace; }
.t-chat .ch-part { margin-left: auto; display: flex; gap: 6px; align-items: center; font-size: 12px; color: #B4C0CE; }
.t-chat .ch-tiles { flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 0 18px; }
.t-chat .ch-tile { position: relative; display: grid; place-items: center; border-radius: 10px; background: color-mix(in srgb, var(--a) 16%, #141E29); border: 2px solid transparent; }
.t-chat .ch-tile.fala { border-color: #4BB9C5; } .t-chat .ch-tile .av.g { width: 76px; height: 76px; font-size: 23px; box-shadow: 0 0 0 8px rgba(255, 255, 255, .04); } .t-chat .ch-tile.fala .av.g { box-shadow: 0 0 0 4px #141E29, 0 0 0 6px #4BB9C5; }
.t-chat .ch-tile .nm { position: absolute; left: 12px; bottom: 10px; font-size: 12px; background: rgba(8, 14, 22, .7); padding: 2px 8px; border-radius: 5px; }
.t-chat .ch-tile em { position: absolute; right: 10px; bottom: 9px; width: 24px; height: 24px; border-radius: 50%; background: rgba(8, 14, 22, .7); display: grid; place-items: center; } .t-chat .ch-tile em svg { width: 13px; height: 13px; }
.t-chat .ch-call footer { display: flex; justify-content: center; gap: 10px; padding: 14px; }
.t-chat .ch-call footer span { width: 42px; height: 42px; border-radius: 50%; background: #1E2B39; display: grid; place-items: center; } .t-chat .ch-call footer .sair { width: auto; padding: 0 20px; border-radius: 99px; background: #DC2626; font-weight: 600; font-size: 12.5px; }
`,
  roteiro(f) {
    const tl = f.tl, cam = f.cam;
    const bolha = (s: string, at: number) => tl.from(f.$(s), { autoAlpha: 0, y: 12, scale: .94, transformOrigin: s.includes('out') || s === '.ch-rr' ? '100% 100%' : '0 100%', duration: .45, ease: 'back.out(1.6)' }, at);
    const relogio = (s: string, de: number, ate: number, at: number, dur: number, fmt = mmss) => {
      const el = f.$(s), o = { n: de };
      tl.fromTo(o, { n: de }, { n: ate, duration: dur, ease: 'none', immediateRender: false, onUpdate: () => { el.textContent = fmt(o.n); } }, at);
    };
    // Estados iniciais: painéis que entram depois ficam fora de cena
    tl.set(f.$('.ch-camp'), { x: 480, autoAlpha: 0 }, 0).set(f.$('.ch-equipe'), { y: 40, autoAlpha: 0 }, 0).set(f.$('.ch-call'), { autoAlpha: 0, scale: .9 }, 0);
    tl.set(f.$('.ch-prog'), { autoAlpha: 0 }, 0);

    // 1 · Uma mensagem, bem de perto… e a câmera recua até a fila inteira
    const p = f.pos('.ch-in1'), z0 = 3.3, cx = p.x + p.w / 2, cy = p.y + p.h / 2;
    tl.fromTo(cam, { scale: z0 + .3, xPercent: -(cx - W / 2) / W * 100 * (z0 + .3), yPercent: -(cy - H / 2) / H * 100 * (z0 + .3), rotationX: 0, rotationY: 0, rotationZ: -1.5 },
      { scale: z0, xPercent: -(cx - W / 2) / W * 100 * z0, yPercent: -(cy - H / 2) / H * 100 * z0, rotationZ: 0, duration: 2.1, ease: 'power2.out', immediateRender: false }, 3.9);
    f.passo(1, 'Os WhatsApps da empresa caem numa fila só, em ordem de chegada.', 'depois');
    bolha('.ch-in1', 4.6); bolha('.ch-in2', 5.35);
    mira(f, '.ch-lista', 1.55, 2.6, 6.1, { ry: 3 });
    tl.from(f.$$('.ch-item'), { autoAlpha: 0, x: -26, duration: .45, stagger: .3, ease: 'power3.out' }, 6.5);
    f.contar('.ch-nfila', 7, 6.5, { dur: 2.1 }).contar('.ch-nao', 5, 6.5, { dur: 2.1 });
    f.camera({}, 1.7, 9.1);
    tl.from(f.$('.ch-sys'), { autoAlpha: 0, scale: .9, duration: .4 }, 9.4);

    // 2 · Dono, prazo e resposta
    f.passo(2, 'Cada conversa ganha dono e prazo. O relógio do SLA já está correndo.', 11);
    relogio('.ch-slat', 300, 192, 4.6, 11.5);
    f.foco('.ch-conv', 11.1);
    mira(f, '.ch-dono', 1.9, 1.4, 11, { ry: -3 });
    f.cursor('.ch-assumir', 11.7);
    f.classe('.ch', 'assumido', 12.62).contar('.ch-nao', 4, 12.62, { de: 5, dur: .3 });
    tl.fromTo(f.$('.ch-dono'), { scale: 1 }, { scale: 1.06, duration: .18, yoyo: true, repeat: 1, immediateRender: false }, 12.62);
    mira(f, '.ch-comp', 1.75, 1.3, 13.1);
    tl.to(f.$('.ch-ph'), { autoAlpha: 0, duration: .15 }, 13.6);
    f.digitar('.ch-dig', 'Oi, Marina! Consigo sim: 200 cadeiras na sexta, com frete incluso. Te mando a proposta agora.', 13.6, 42);
    f.cursor('.ch-enviar', 15.4, true, .6);
    tl.to(f.$('.ch-dig'), { autoAlpha: 0, duration: .15 }, 16.05).to(f.$('.ch-ph'), { autoAlpha: 1, duration: .3 }, 16.2);
    bolha('.ch-out1', 16.05);
    f.classe('.ch-sla', 'ok', 16.1);
    mira(f, '.ch-msgs', 1.3, 1.4, 16.3);
    f.esconderCursor(16.6);
    bolha('.ch-in3', 17);

    // 3 · Campanha: de perto na mensagem, depois o painel inteiro
    f.passo(3, 'A campanha para 1.284 clientes sai do mesmo lugar, com modelo aprovado.', 18.2);
    tl.to(f.$('.ch-camp'), { x: 0, autoAlpha: 1, duration: .8, ease: 'power3.out' }, 18.1);
    f.foco('.ch-camp', 18.1);
    mira(f, '.ch-cmsg', 2.35, 1.2, 18.3, { rz: -1 });
    mira(f, '.ch-camp', 1.45, 1.6, 19.9);
    f.cursor('.ch-disparar', 20.4);
    tl.to(f.$('.ch-prog'), { autoAlpha: 1, duration: .3 }, 21.35).fromTo(f.$('.ch-pbar i'), { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: 'power2.inOut', immediateRender: false }, 21.35);
    f.contar('.ch-pnum .n1', 1284, 21.35, { dur: 1.6 }).contar('.ch-pnum .n2', 1251, 21.5, { dur: 1.6 }).contar('.ch-pnum .n3', 862, 21.7, { dur: 1.6 }).contar('.ch-pnum .n4', 97, 21.9, { dur: 1.5 });
    f.esconderCursor(21.6);

    // 4 · O time: de perto na mensagem da colega, recuo até a sala de vídeo
    f.passo(4, 'E o time combina a entrega ali do lado: chat, grupo ou vídeo.', 23.6);
    tl.to(f.$('.ch-camp'), { x: 480, autoAlpha: 0, duration: .6, ease: 'power2.in' }, 23.4);
    tl.to(f.$('.ch-equipe'), { y: 0, autoAlpha: 1, duration: .6, ease: 'power3.out' }, 23.7);
    f.foco('.ch-equipe', 23.6);
    mira(f, '.ch-jm', 2.5, 1.3, 23.6);
    bolha('.ch-rr', 24.6);
    f.digitar('.ch-rdig', 'Fechou! Abro uma sala com o Bruno e a gente alinha agora.', 24.7, 40);
    f.cursor('.ch-vid', 25.9, true, .8);
    tl.to(f.$('.ch-call'), { autoAlpha: 1, scale: 1, duration: .7, ease: 'power3.out' }, 26.75);
    f.camera({ zoom: 1.02 }, 1.8, 26.75);
    f.esconderCursor(27);
    tl.from(f.$$('.ch-tile'), { autoAlpha: 0, scale: .9, duration: .5, stagger: .14, ease: 'power2.out' }, 26.95);
    relogio('.ch-ct', 0, 6, 27, 2.6);
    f.pausa(.6);
  }
};
export default t;
