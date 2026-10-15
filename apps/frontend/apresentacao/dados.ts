// Conteúdo da apresentação comercial (v2). Catálogo, preços e guias vêm de ../src/data.ts.
// Regra de texto: frases de gente falando com gente. Nada de número que não tenha fonte.

export const img = (n: string) => `/images/${n}.webp`;

// 01 · Um dia comum: a mesma empresa, do café da manhã ao fim do expediente
export const dia: { hora: string; area: string; fala: string; conta: string; app: string; foto: string }[] = [
  { hora: '08:12', area: 'Diretoria', fala: 'Me manda a planilha atualizada?', conta: 'O gestor abre três arquivos, copia os números para um quarto e manda por e-mail. A diretoria recebe duas versões diferentes da mesma semana.', app: 'report', foto: 'ap-dia-planilha' },
  { hora: '09:30', area: 'Comercial', fala: 'O cliente me chamou no WhatsApp pessoal.', conta: 'A conversa existe só no celular do vendedor. Nas férias dele, ninguém responde. Se ele sai da empresa, o histórico vai junto.', app: 'chat', foto: 'ap-dia-whatsapp' },
  { hora: '11:05', area: 'Atendimento', fala: 'Abri um chamado por e-mail semana passada.', conta: 'O pedido caiu numa caixa compartilhada. Ninguém ficou responsável e o prazo não estava escrito em lugar nenhum.', app: 'sac', foto: 'ap-dia-email' },
  { hora: '14:00', area: 'TI e projetos', fala: 'Esse quadro está atualizado?', conta: 'Meia hora de reunião só para descobrir o status. O quadro conta uma história, a planilha do gerente conta outra.', app: 'sprint', foto: 'ap-dia-reuniao' },
  { hora: '16:40', area: 'Pós-venda', fala: 'Esse cliente cancelou e ninguém percebeu.', conta: 'Os sinais estavam lá: nota baixa na pesquisa, chamados repetidos, menos uso. Cada um num sistema diferente.', app: 'cs', foto: 'ap-dia-cliente' },
  { hora: '18:45', area: 'Financeiro', fala: 'Vou levantar esse dado e te aviso.', conta: 'O trimestre fechou abaixo do previsto. A causa está espalhada entre relatórios de áreas que não se falam.', app: 'cfo', foto: 'ap-dia-noite' }
];

// 02 · A série: cada dor vira um episódio, agrupado por área (como os trilhos de um streaming)
export interface Episodio { app: string; titulo: string; sinopse: string; poster: string }
export const temporadas: { nome: string; episodios: Episodio[] }[] = [
  { nome: 'Diretoria e finanças', episodios: [
    { app: 'report', titulo: 'A planilha de sexta', sinopse: 'Cada gestor reporta a semana de um jeito. A diretoria passa a segunda-feira juntando arquivos.', poster: 'ap-poster-diretoria' },
    { app: 'cfo', titulo: 'O desvio sem dono', sinopse: 'Todas as áreas bateram a meta. O resultado da empresa, não. E ninguém sabe explicar por quê.', poster: 'ap-poster-financeiro' },
    { app: 'bi', titulo: 'O painel de ontem', sinopse: 'Cada gráfico novo depende de alguém extrair dados à mão. Quando fica pronto, já está velho.', poster: 'ap-dia-planilha' },
    { app: 'governa', titulo: 'Política na pasta errada', sinopse: 'A auditoria pergunta o que foi feito com o risco do ano passado. A resposta está num e-mail.', poster: 'ap-poster-compliance' }
  ] },
  { nome: 'Clientes', episodios: [
    { app: 'chat', titulo: 'O WhatsApp de cada um', sinopse: 'Cada vendedor atende no próprio celular. Sem fila, sem prazo e sem histórico para a empresa.', poster: 'ap-poster-comercial' },
    { app: 'sac', titulo: 'O chamado que sumiu', sinopse: 'O pedido chegou por e-mail, por mensagem e no corredor. Três registros, nenhum responsável.', poster: 'ap-poster-atendimento' },
    { app: 'cs', titulo: 'O cancelamento silencioso', sinopse: 'O cliente deu sinais por meses. A empresa descobriu no dia em que chegou o aviso de cancelamento.', poster: 'ap-poster-clientes' }
  ] },
  { nome: 'Tecnologia e produto', episodios: [
    { app: 'sprint', titulo: 'O quadro desatualizado', sinopse: 'Tarefas espalhadas em três ferramentas. A reunião de status vira uma investigação.', poster: 'ap-poster-ti' },
    { app: 'dev', titulo: 'A fila de TI', sinopse: 'Uma mudança simples espera semanas no backlog. Quando sai, sai sem revisão.', poster: 'ap-billboard-antes' },
    { app: 'prd', titulo: 'O requisito pela metade', sinopse: 'A ideia mora em conversas soltas. O desenvolvimento recebe o pedido incompleto.', poster: 'ap-dia-reuniao' },
    { app: 'pomiro', titulo: 'Ideias no post-it', sinopse: 'O planejamento começa sempre do zero, em fotos de quadro branco que ninguém encontra depois.', poster: 'ap-capa' }
  ] },
  { nome: 'Marketing e criação', episodios: [
    { app: 'mkt', titulo: 'Aprovação por print', sinopse: 'A arte nasce numa ferramenta, é aprovada por print no WhatsApp e publicada em outra.', poster: 'ap-poster-marketing' },
    { app: 'ai', titulo: 'A IA que não conhece a empresa', sinopse: 'Cada pessoa cola informação interna numa IA genérica, sem controle de quem vê o quê.', poster: 'ap-dia-email' }
  ] }
];

// 04 · Por que citamos concorrentes pelo nome
export const razoes: { titulo: string; texto: string }[] = [
  { titulo: 'Um contrato, em real', texto: 'Cada aplicação tem preço mensal em reais, para a empresa. Sem uma fatura em dólar para cada ferramenta.' },
  { titulo: 'Um login para tudo', texto: 'As aplicações dividem login, visual e a mesma central de chamados. Quem aprende uma, usa as outras.' },
  { titulo: 'Implantação em semanas', texto: 'Cerca de uma semana por sistema avulso. O pacote completo fica pronto em até dois meses.' },
  { titulo: 'Sem integração para fazer', texto: 'Quando o atendimento precisa conversar com o financeiro, já é o mesmo ambiente e a mesma permissão.' },
  { titulo: 'Começa pela dor mais urgente', texto: 'Ninguém precisa trocar tudo de uma vez. Entra uma aplicação, as outras chegam quando fizer sentido.' }
];

// 03 · Mercado: preços de tabela públicos, lidos nos sites oficiais em 14/10/2026 (sem promoções).
// usd = por usuário (ou agente/assento) por mês, plano anual. texto = como mostrar quando o original é em real ou não é por usuário.
export interface Concorrente { nome: string; app: string; plano: string; usd: number | null; porUsuario: boolean; cobranca: string; fonte: string; texto?: string; obs?: string }
export const cotacao = { brl: 5.0441, fonte: 'PTAX do Banco Central', data: '14/10/2026' };
export const concorrentes: Concorrente[] = [
  { nome: 'Jira', app: 'sprint', plano: 'Standard', usd: 7.92, porUsuario: true, cobranca: 'por usuário, anual', fonte: 'https://www.atlassian.com/software/jira/pricing' },
  { nome: 'Trello', app: 'sprint', plano: 'Standard', usd: 5, porUsuario: true, cobranca: 'por usuário, anual', fonte: 'https://trello.com/pricing' },
  { nome: 'Asana', app: 'sprint', plano: 'Starter', usd: 10.99, porUsuario: true, cobranca: 'por usuário, anual', fonte: 'https://asana.com/pricing' },
  { nome: 'ClickUp', app: 'sprint', plano: 'Unlimited', usd: 7, porUsuario: true, cobranca: 'por usuário, anual', fonte: 'https://clickup.com/pricing' },
  { nome: 'Zendesk', app: 'sac', plano: 'Suite Team', usd: 71.17, porUsuario: true, cobranca: 'por agente, anual', fonte: 'https://www.zendesk.com.br/pricing/', texto: 'R$ 359 por agente/mês' },
  { nome: 'WhatsApp Business Platform', app: 'chat', plano: 'Meta', usd: null, porUsuario: false, cobranca: 'por mensagem: US$ 0,0625 por mensagem de marketing no Brasil', fonte: 'https://developers.facebook.com/docs/whatsapp/pricing' },
  { nome: 'Slack', app: 'chat', plano: 'Pro', usd: 7.25, porUsuario: true, cobranca: 'por usuário ativo, anual', fonte: 'https://slack.com/pricing/pro' },
  { nome: 'Microsoft Teams', app: 'chat', plano: 'Essentials', usd: 4.54, porUsuario: true, cobranca: 'por usuário, anual', fonte: 'https://www.microsoft.com/pt-br/microsoft-teams/essentials', texto: 'R$ 22,90 por usuário/mês' },
  { nome: 'Zoom', app: 'chat', plano: 'Workplace Pro', usd: 14.16, porUsuario: true, cobranca: 'por usuário, anual', fonte: 'https://zoom.us/pricing' },
  { nome: 'Miro', app: 'pomiro', plano: 'Starter', usd: 8, porUsuario: true, cobranca: 'por membro, anual', fonte: 'https://miro.com/pricing/' },
  { nome: 'Notion', app: 'prd', plano: 'Plus', usd: 10, porUsuario: true, cobranca: 'por membro, anual', fonte: 'https://www.notion.com/pricing' },
  { nome: 'Confluence', app: 'prd', plano: 'Standard', usd: 6, porUsuario: true, cobranca: 'por usuário, anual', fonte: 'https://www.atlassian.com/software/confluence/pricing' },
  { nome: 'Canva', app: 'mkt', plano: 'Business', usd: 20, porUsuario: true, cobranca: 'por pessoa', fonte: 'https://www.canva.com/newsroom/news/introducing-canva-business/', obs: 'valor do anúncio oficial; a página de preços pode mostrar reajuste' },
  { nome: 'Hootsuite', app: 'mkt', plano: 'Standard', usd: 99, porUsuario: true, cobranca: 'por usuário, anual', fonte: 'https://www.hootsuite.com/plans' },
  { nome: 'Power BI', app: 'bi', plano: 'Pro', usd: 15.9, porUsuario: true, cobranca: 'por usuário, anual', fonte: 'https://www.microsoft.com/pt-br/power-platform/products/power-bi/pricing', texto: 'R$ 80,20 por usuário/mês' },
  { nome: 'Metabase', app: 'bi', plano: 'Starter (cloud)', usd: null, porUsuario: false, cobranca: 'US$ 90/mês com 5 usuários, mais US$ 5,42 por usuário extra', fonte: 'https://www.metabase.com/pricing/' },
  { nome: 'HubSpot', app: 'cs', plano: 'Service Hub Starter', usd: 20, porUsuario: true, cobranca: 'por assento', fonte: 'https://legal.hubspot.com/hubspot-product-and-services-catalog' },
  { nome: 'Pipedrive', app: 'cs', plano: 'Lite', usd: 14, porUsuario: true, cobranca: 'por assento, anual', fonte: 'https://www.pipedrive.com/en/pricing' },
  { nome: 'SurveyMonkey', app: 'cs', plano: 'Team Advantage', usd: 11.47, porUsuario: true, cobranca: 'pacote anual, mínimo de 3 usuários', fonte: 'https://www.surveymonkey.com/pricing/teams/', texto: 'R$ 2.082 por ano para 3 usuários' },
  { nome: 'ChatGPT', app: 'ai', plano: 'Business', usd: 20, porUsuario: true, cobranca: 'por usuário, anual', fonte: 'https://openai.com/business/chatgpt-pricing/' }
];
