// Conteúdo da apresentação v3 ("o molho de chaves"). Catálogo, guias e preços vêm de ../src/data.ts
// e os preços dos concorrentes de ../apresentacao/dados.ts (com fonte e data).
import { apps, tools } from '../src/data';
import { concorrentes, cotacao } from '../apresentacao/dados';

export const img = (n: string) => `/images/${n}.webp`;
export const app = (id: string) => apps.find(a => a.id === id)!;
export const brl = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
export const brlc = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// ---------- As chaves (cena 4): cada ferramenta do mercado é uma chave com etiqueta ----------
// cada ferramenta tem a sua chave, feita no Codex com o logo moldado, gravado ou impresso na própria chave
const slug = (n: string) => n.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const nomeConcorrente: Record<string, string> = { 'WhatsApp Business': 'WhatsApp Business Platform' };
// 21 chaves (3 fileiras de 7): Google Meet sai (repete Zoom e Teams) e Google Sheets vira a chave das planilhas
const nomeChave: Record<string, string> = { 'Google Sheets': 'Planilhas' };
export interface Chave { nome: string; app: string; imagem: string; giro: number; porPessoa: number | null; preco: string; cobranca: string; fonte?: string }
export const chaves: Chave[] = tools.filter(t => t.name !== 'Google Meet').map((t, i) => {
  const c = concorrentes.find(c => c.nome === (nomeConcorrente[t.name] ?? t.name));
  const porPessoa = c?.usd != null && c.porUsuario ? c.usd * cotacao.brl : null;
  return {
    nome: nomeChave[t.name] ?? t.name, app: t.app, imagem: 'v3-kl-' + slug(t.name), giro: ((i * 37) % 30) - 15, porPessoa,
    preco: porPessoa != null ? `${brl(porPessoa)} por pessoa/mês` : c ? 'preço por uso ou pacote' : 'sem preço avulso',
    cobranca: c ? c.cobranca.charAt(0).toUpperCase() + c.cobranca.slice(1) : 'Vem dentro de um pacote maior, sem preço avulso',
    fonte: c?.fonte
  };
});

// Ferramentas do exemplo quando o cliente ainda não escolheu as suas (empresa com várias áreas)
export const exemplo = ['Jira', 'Zendesk', 'Slack', 'Power BI', 'HubSpot'];

// ---------- Cada chave, um armário (cena 1): o armário onde cada pergunta fica trancada ----------
export const armarioDe: Record<string, string> = { report: 'Planilhas', chat: 'WhatsApp do vendedor', sac: 'Caixa de e-mail', cs: 'Pesquisa antiga', sprint: 'Quadro desatualizado', cfo: 'Relatórios das áreas' };

// Logo da ferramenta (Simple Icons, já no catálogo) com a cor da marca
// (o catálogo não tem o desenho do Pipedrive: no lugar, o "p" da marca num círculo verde)
export const logo = (nome: string) => { const t = tools.find(t => t.name === nome || (nome === 'Planilhas' && t.name === 'Google Sheets')); if (!t) return '';
  const desenho = t.svg || `<circle cx="12" cy="12" r="12"/><text x="12" y="16.6" text-anchor="middle" font-family="Montserrat, Arial, sans-serif" font-weight="800" font-size="15" fill="#fff">p</text>`;
  return `<svg viewBox="0 0 24 24" fill="#${t.hex}" aria-hidden="true">${desenho}</svg>`; };

// ---------- A pergunta simples (cena 2): um dia inteiro abrindo armários ----------
export const pergunta: { hora: string; quem: string; foto: string; armario?: string; texto: string }[] = [
  { hora: '09:12', quem: 'Diretoria', foto: 'ap-dia-reuniao', texto: 'A diretora pergunta: “Por que perdemos aquele cliente grande?”' },
  { hora: '09:40', quem: 'Comercial', foto: 'ap-dia-whatsapp', armario: 'Chat', texto: 'O comercial procura as conversas. Metade está no WhatsApp pessoal do vendedor.' },
  { hora: '11:05', quem: 'Atendimento', foto: 'ap-dia-email', armario: 'Atendimento', texto: 'O atendimento manda o print de três chamados abertos por e-mail.' },
  { hora: '13:20', quem: 'Pós-venda', foto: 'ap-dia-cliente', armario: 'Pesquisas', texto: 'O pós-venda acha uma nota 3 numa pesquisa de satisfação de agosto.' },
  { hora: '15:30', quem: 'Financeiro', foto: 'ap-dia-planilha', armario: 'Planilha', texto: 'O financeiro manda a planilha do contrato. O reajuste entrou sem conversa.' },
  { hora: '17:48', quem: 'Diretoria', foto: 'ap-dia-noite', texto: 'A resposta chega no fim do dia: o cliente tinha avisado três vezes.' }
];

// ---------- O lugar (cena 7): as portas internas entre as aplicações ----------
export const fluxo: { de: string; para: string; texto: string }[] = [
  { de: 'chat', para: 'sac', texto: 'A conversa do WhatsApp vira chamado.' },
  { de: 'sac', para: 'cs', texto: 'O chamado aparece na saúde do cliente.' },
  { de: 'cs', para: 'cfo', texto: 'A saúde do cliente chega ao financeiro.' },
  { de: 'cfo', para: 'report', texto: 'O financeiro chega à diretoria.' }
];

// ---------- Os trailers: a abertura (problema) e o fim (resultado) de cada aplicação ----------
export interface Meta { titulo: string; hora: string; area: string; problema: string; frase: string; numero?: [string, string] }
export const trailers: Record<string, Meta> = {
  chat: { titulo: 'O celular que não para', hora: '17h52', area: 'Comercial', problema: 'Três celulares. Três vendedores. Nenhuma fila.', frase: 'O WhatsApp da empresa, e não o do vendedor.', numero: ['88.851', 'mensagens trocadas no PominCHAT'] },
  sac: { titulo: 'O e-mail que ninguém viu', hora: '10h03', area: 'Operação', problema: '214 e-mails na caixa compartilhada. Nenhum tem dono.', frase: 'Cada pedido com dono, prazo e histórico.', numero: ['7.090', 'chamados registrados no PominSAC'] },
  cs: { titulo: 'O cancelamento que avisou antes', hora: '16h40', area: 'Pós-venda', problema: 'O cliente deu sinais por meses. Ninguém juntou os sinais.', frase: 'Aja antes do risco.', numero: ['6.409', 'clientes acompanhados no PominCS'] },
  report: { titulo: 'Segunda, 8h', hora: '08h00', area: 'Diretoria', problema: 'Nove gestores. Nove formatos. Uma manhã inteira juntando arquivos.', frase: 'A semana de cada gestor, na mesa da diretoria.', numero: ['1.459', 'relatórios de liderança no PominReport'] },
  cfo: { titulo: 'Tudo verde, resultado vermelho', hora: '18h20', area: 'Financeiro', problema: 'Todas as áreas bateram a meta. O resultado da empresa, não.', frase: 'Cada desvio com dono, explicação e plano.', numero: ['19 dias', 'para achar a causa de um desvio no manual, num caso real do Grupo Pomin'] },
  bi: { titulo: 'A planilha de sexta', hora: '17h30', area: 'Análise', problema: 'Exportar, colar, ajustar. Quando o gráfico fica pronto, o dado já envelheceu.', frase: 'Conecte a fonte. Os gráficos vêm sugeridos.' },
  governa: { titulo: 'A auditoria chega amanhã', hora: '21h10', area: 'Compliance', problema: 'O plano de ação do risco do ano passado está num e-mail. Qual?', frase: 'Políticas, riscos, auditorias e planos de ação, com histórico.' },
  sprint: { titulo: 'O quadro que mente', hora: '09h30', area: 'TI', problema: 'O quadro diz uma coisa. A planilha do gerente diz outra.', frase: 'O trabalho do time visível até a entrega.' },
  prd: { titulo: 'A ideia no corredor', hora: '15h15', area: 'Produto', problema: 'A melhor ideia da semana nasceu no café. E morreu no café.', frase: 'Da ideia ao documento pronto para desenvolver.' },
  dev: { titulo: 'A fila da TI', hora: '11h00', area: 'Tecnologia', problema: 'Quarenta pedidos na fila. Prazo estimado: quando der.', frase: 'Do chamado à produção, com IA e o seu aceite.' },
  ai: { titulo: 'A IA que não conhece a empresa', hora: '14h00', area: 'RH', problema: 'A IA respondeu rápido. Só não conhecia a política da empresa.', frase: 'IA que conhece a sua empresa.' },
  pomiro: { titulo: 'O quadro branco apagado', hora: '18h00', area: 'Planejamento', problema: 'Duas horas de planejamento. Uma foto torta no celular de alguém.', frase: 'Da ideia ao plano, no mesmo quadro.' },
  mkt: { titulo: 'O post que passou por quatro aplicativos', hora: '13h45', area: 'Marketing', problema: 'Criar num lugar, aprovar no WhatsApp, agendar em outro, medir em outro.', frase: 'Do briefing ao resultado, num fluxo só.', numero: ['2.571', 'criativos feitos no PominMKT'] }
};

// Quem cobra hoje pelo que a aplicação resolve (preço de tabela, com fonte)
export const mercadoDe = (id: string) => concorrentes.filter(c => c.app === id).map(c => ({
  nome: c.nome, fonte: c.fonte,
  preco: c.texto ?? (c.usd != null ? `${brl(c.usd * cotacao.brl)} por ${c.cobranca.startsWith('por agente') ? 'agente' : c.cobranca.startsWith('por assento') ? 'assento' : 'pessoa'}/mês` : c.cobranca)
}));

// ---------- Os confrontos (cena 8): Pomin360 contra 1, 2 e 3 concorrentes por área ----------
export const confrontos: { area: string; apps: string[]; contra: string[] }[] = [
  { area: 'Projetos e tarefas', apps: ['sprint', 'prd', 'dev'], contra: ['Jira', 'Asana', 'ClickUp'] },
  { area: 'Atendimento', apps: ['sac', 'chat'], contra: ['Zendesk', 'WhatsApp Business Platform', 'Slack'] },
  { area: 'Comunicação interna', apps: ['chat'], contra: ['Slack', 'Microsoft Teams', 'Zoom'] },
  { area: 'Dados e decisão', apps: ['bi', 'report', 'cfo'], contra: ['Power BI', 'Metabase'] },
  { area: 'Clientes', apps: ['cs'], contra: ['HubSpot', 'Pipedrive', 'SurveyMonkey'] },
  { area: 'Criação e conhecimento', apps: ['ai', 'pomiro', 'mkt'], contra: ['ChatGPT', 'Miro', 'Notion', 'Canva'] }
];

// ---------- O guia do apresentador, cena por cena ----------
export interface Nota { nome: string; objetivo: string; fala: string; pergunta?: string; objecoes?: [string, string][]; minutos: number }
export const notas: Nota[] = [
  { nome: 'O molho', objetivo: 'Abrir com a analogia, antes de falar de sistema.', fala: 'Antes de falar de sistema, olha isso: toda empresa vai juntando chaves, uma ferramenta para cada coisa. Cada uma resolve um pedaço.', pergunta: 'Quantas ferramentas vocês assinam hoje? Chuta um número.', minutos: 2 },
  { nome: 'Cada chave, um armário', objetivo: 'Mostrar as perguntas que ficam trancadas e cada uma encontrando a resposta.', fala: 'Cada armário guarda uma pergunta que ninguém responde rápido. Continua rolando: com uma chave só, cada pergunta encontra a sua resposta.', pergunta: 'Qual dessas frases você mais escuta aí?', minutos: 2 },
  { nome: 'A pergunta simples', objetivo: 'Fazer o cliente se reconhecer na história.', fala: 'Uma pergunta simples levou o dia inteiro, porque a resposta estava em cinco lugares.', pergunta: 'Qual foi a última pergunta simples que levou o dia inteiro para responder aí?', objecoes: [['A gente já integrou tudo.', 'Ótimo. Quanto custa manter essas integrações, e quem cuida quando uma quebra?']], minutos: 3 },
  { nome: 'As suas chaves', objetivo: 'Personalizar: o cliente escolhe o que paga hoje.', fala: 'Toca nas que vocês pagam hoje. A conta a gente faz junto, com o preço de tabela de cada uma.', minutos: 3 },
  { nome: 'O peso do molho', objetivo: 'Dar número à dor.', fala: 'Esse é o preço de tabela, por pessoa, todo mês. E boa parte em dólar.', pergunta: 'Esse número bate com o que vocês pagam? Tem coisa que eu não coloquei?', objecoes: [['A gente tem desconto.', 'Pode ser. Coloca o valor real que eu refaço a conta com você.']], minutos: 3 },
  { nome: 'Uma chave só', objetivo: 'A virada: apresentar o Pomin360.', fala: 'É tudo em um: uma chave só, com o mesmo acesso para atendimento, projetos, finanças, clientes e IA. Um login, um contrato, uma fatura em reais.', minutos: 1 },
  { nome: 'O lugar', objetivo: 'Mostrar que as áreas já nascem ligadas.', fala: 'Aqui dentro as portas são internas: a conversa vira chamado, o chamado aparece na saúde do cliente, e isso chega ao financeiro.', pergunta: 'Qual dessas salas faz mais falta hoje?', minutos: 3 },
  { nome: 'Os confrontos', objetivo: 'Comparar com nomes, sem medo.', fala: 'Toca no Pomin360 e veja tudo o que ele substitui. Depois escolhe uma aplicação: eu mostro, uma a uma, quais ferramentas saem. Não temos medo de nome porque a conta é pública.', objecoes: [['O Jira é padrão de mercado.', 'É. E cobra por pessoa, em dólar, e não conversa com o atendimento nem com o financeiro sem integração.']], minutos: 4 },
  { nome: 'As aplicações', objetivo: 'Levar para a aplicação que mais dói e abrir o sistema de verdade.', fala: 'Escolhe a que mais dói. Eu mostro o vídeo e, se quiser, a gente entra na aplicação de verdade.', minutos: 12 },
  { nome: 'Já roda aqui dentro', objetivo: 'Prova: uso real.', fala: 'Não é promessa. É o que já rodou dentro do Grupo Pomin.', minutos: 1 },
  { nome: 'Devolva o molho', objetivo: 'Fechar com o próximo passo.', fala: 'Por qual armário você quer começar a esvaziar?', minutos: 2 }
];

// Rotas prontas: a ordem dos trailers em destaque para cada tipo de reunião
export const rotas: Record<string, { nome: string; apps: string[] }> = {
  completa: { nome: 'Completa', apps: ['chat', 'sac', 'cs', 'cfo', 'report', 'mkt', 'bi', 'dev', 'sprint', 'prd', 'ai', 'pomiro', 'governa'] },
  diretoria: { nome: 'Diretoria', apps: ['report', 'cfo', 'bi', 'governa'] },
  atendimento: { nome: 'Atendimento e vendas', apps: ['chat', 'sac', 'cs'] },
  tecnologia: { nome: 'Tecnologia', apps: ['prd', 'dev', 'sprint', 'ai'] },
  marketing: { nome: 'Marketing', apps: ['mkt', 'pomiro', 'ai'] }
};
