// Recursos levantados em 14/10/2026 nas telas reais de cada sistema (acesso de demonstração, só leitura), no manual do PominCS e no catálogo.
// PominReport e PominPRD só aceitam login Microsoft: vêm do catálogo (src/data.ts) e das páginas públicas de login.
export const recursos: Record<string, [string, string[]][]> = {
  ai: [
    ['Agentes de IA da empresa', ['Agentes com papel e instruções próprias', 'Modelos GPT, Gemini e Claude à escolha', 'Situação de rascunho ou treinado', 'Agentes compartilhados com o time', 'Teste do agente antes de publicar']],
    ['Base de conhecimento', ['Documentos da empresa como fonte do agente', 'Envio de PDF, DOCX e planilhas', 'Respostas a partir dos documentos enviados', 'Leitura de PDF e foto com dados estruturados']],
    ['Organização dos agentes', ['Categorias por área: RH, Atendimento, Operacional, Técnico', 'Projetos que agrupam agentes por sistema', 'Favoritos, recentes e meus agentes', 'Busca por nome, descrição ou área', 'Registro de quem editou por último']],
    ['Controle de acesso', ['Escolha de quem pode usar cada agente', 'Liberação por pessoa e por área', 'IA que respeita as permissões do usuário']],
    ['Analytics de uso', ['Conversas, mensagens, agentes ativos e usuários únicos', 'Conversas por dia', 'Agentes mais usados', 'Histórico das conversas recentes', 'Filtros por período, agente e usuário']],
    ['Integrações', ['Conexões com e-mail, ERP Omie e Zeev', 'Conexões com PominCHAT, Governa, Report, SAC e Security', 'Status de cada integração', 'Agentes usados dentro de outros sistemas Pomin', 'Worker agentes em segundo plano (em breve)']],
    ['Copilot e atalhos', ['Copilot que lê a tela e os dados', 'Busca de páginas, agentes e ações (Ctrl+Q)', 'Chamado de suporte com captura de tela', 'Tema claro e escuro']]
  ],
  pomiro: [
    ['Quadro colaborativo', ['Canvas infinito', 'Mapas mentais e fluxos', 'Desenho livre', 'Comentários no ponto do quadro', 'Time trabalhando no mesmo board']],
    ['Planejamento com IA', ['Objetivo descrito em texto livre', 'Primeiro rascunho do board feito pela IA', 'Rascunho ajustado com o time até a versão final']],
    ['Templates prontos', ['Board em branco', 'Fluxograma de processos e decisões', 'Retrospectiva ágil', 'Planejamento de sprints e roadmap', 'Brainstorm de ideias livres']],
    ['Organização dos boards', ['Meus boards', 'Boards recentes', 'Favoritos', 'Busca de boards, páginas e ações (Ctrl+K)']],
    ['Times e governança', ['Times de trabalho', 'Boards com auditoria e governança', 'Mesmo login dos sistemas Pomin', 'Chamado de suporte de dentro do sistema']],
    ['Visual do board', ['Papel quadriculado no fundo', 'Cor de fundo padrão para novos boards', 'Opções do branco ao navy', 'Tema claro e escuro']]
  ],
  mkt: [
    ['Chat de marketing com IA', ['Pedido em conversa, uma pergunta por vez', 'Legendas, headlines e roteiros no tom da marca', 'Conversa por voz e ditado', 'Sugestões de criação na tela inicial']],
    ['Criação de peças', ['Artes com a identidade visual da marca', 'Imagens geradas com ChatGPT', 'Oferta de produto com preço em destaque', 'Encartes e tabloides com vários produtos', 'Carrossel de produtos e promoções', 'Cardápio do dia, avisos e vagas da loja', 'Datas comemorativas e posts de engajamento', 'Resposta à oferta do concorrente pela foto']],
    ['Marca e biblioteca', ['Brand manager com as marcas da empresa', 'Biblioteca de posts e imagens', 'Filtro por empresa e por usuário', 'Busca por título']],
    ['Landing pages', ['Site de uma página gerado no chat', 'Edição da página pela conversa', 'Link público, sem login', 'Lista das páginas no ar']],
    ['Consulta de produtos', ['Busca por nome, marca ou código de barras', 'Foto da embalagem, GTIN, categoria e NCM', 'Peça montada com a embalagem certa']],
    ['Aprovação, publicação e resultado', ['Fluxo de aprovação antes de publicar', 'Agendamento no Instagram e Facebook', 'Publicação sem trocar de ferramenta', 'Decupagem de vídeo', 'Analytics de cada publicação']],
    ['Acesso e ambiente', ['Login com e-mail, Google ou Microsoft', 'Configuração guiada no primeiro acesso', 'Trabalho separado por empresa e por área', 'Barra lateral fixa ou recolhida']]
  ],
  prd: [
    ['Da ideia ao projeto', ['Projeto criado a partir da ideia do produto', 'Ideia registrada antes de virar requisito', 'Requisitos reunidos num só lugar']],
    ['PRD gerado pelo sistema', ['Documento de requisitos montado pelo sistema', 'Requisitos do produto organizados no PRD', 'Studio para trabalhar o documento']],
    ['Revisão com o time', ['Revisão do PRD pelo time', 'Ajuste dos requisitos antes de desenvolver', 'Documento final igual ao que será construído']],
    ['Continuidade no PominDev', ['PRD levado ao PominDev', 'Desenvolvimento segue a partir do documento', 'Sem copiar e colar entre ferramentas']],
    ['Acesso', ['Login com conta Microsoft', 'Entrada só para e-mails cadastrados', 'Para times de produto, projetos e desenvolvimento']]
  ],
  report: [
    ['Relatório semanal do gestor', ['Entrega semanal de cada gestor', 'Números, metas e comentários no relatório', 'Registro dos compromissos da semana']],
    ['Indicadores e metas', ['Indicadores definidos por área', 'Metas do período', 'Acompanhamento da evolução da área']],
    ['Visão da diretoria', ['Todos os relatórios em um só lugar', 'Leitura pronta para a diretoria', 'Comparação entre semanas e períodos']],
    ['Feedbacks e mural', ['Retornos da diretoria para cada gestor', 'Área de feedbacks da liderança', 'Mural da liderança']],
    ['Acesso e integração', ['Login com conta Microsoft ou e-mail', 'Entrada só para e-mails liberados', 'Integração com o PominAI']]
  ],
  bi: [
    ['Painel a partir de uma pergunta', ['Escreva o que quer acompanhar', 'Solte uma planilha e o painel é montado', 'A IA propõe e você ajusta', 'Uso de uma fonte já conectada']],
    ['Integrações de dados', ['Bancos de dados relacionais, como PostgreSQL', 'APIs REST', 'Contas conectadas via API, como Movidesk', 'Situação de cada integração']],
    ['Descoberta de dados', ['Leitura da estrutura dos dados', 'Classificação automática dos campos', 'Sugestão de gráficos pelos dados']],
    ['Dashboards', ['Dashboards do sistema prontos para uso', 'Criação de dashboard em branco', 'Filtros de período', 'Gráficos por status, categoria e responsável', 'Exportação para planilha', 'Painéis com dados editáveis na tela']],
    ['Templates por área', ['Tickets: chamados, SLA e produtividade', 'Financeiro (em breve)', 'Vendas (em breve)', 'RH (em breve)', 'Projetos (em breve)', 'Atendimento (em breve)']],
    ['Painel de chamados do PominSAC', ['Dados em tempo real do PominSAC', 'Total, abertos, resolvidos e pendentes', 'SLA cumprido e estourado', 'Tempo médio de atendimento', 'Filtro por analista e por sistema de origem', 'Tickets por mês, status e categoria']],
    ['Ecossistema Pomin', ['Busca de páginas e dashboards (Ctrl+K)', 'Chamado de suporte e chat interno', 'Atalhos para os sistemas do Grupo Pomin', 'Tema claro e escuro']]
  ],
  governa: [
    ['Central de Governança', ['Pendências que pedem a sua ação', 'Saúde do SGI em indicadores', 'Próximos eventos em 90 dias', 'Novidades do SGI nos últimos 30 dias', 'Atalho para os seus riscos']],
    ['Resumo semanal com IA', ['Pulso da semana dia a dia', 'Riscos e oportunidades novos e movimentados', 'Planos de ação criados, concluídos e atrasados', 'NCs abertas e encerradas', 'Documentos aprovados, revisados e mudanças', 'Síntese da IA citando os registros de origem', 'Navegação entre semanas']],
    ['Riscos e oportunidades', ['Avaliação e tratamento de riscos', 'Riscos de acessos e fornecedores', 'Acompanhamento de oportunidades']],
    ['Auditorias e ocorrências', ['Auditorias internas e externas', 'Ocorrências e não conformidades', 'Registro do que cada auditoria encontrou']],
    ['Planos de ação', ['Ações com responsáveis', 'Plano para cada ponto encontrado', 'Histórico de cada ação', 'Ações atrasadas em destaque']],
    ['Normas, processos e documentos', ['ISO 9001 e ISO/IEC 27001', 'Mapeamento e melhoria de processos', 'Indicadores de desempenho e metas', 'Políticas, normas e registros centralizados', 'Aprovação e revisão de documentos']],
    ['Recursos corporativos', ['Catálogo de recursos de governança', 'Pomin Security: disponibilidade e segurança', 'Consultoria em sistemas de gestão', 'Treinamentos em SGI e normas', 'Canais de suporte e de facilities']],
    ['Acesso', ['Login com e-mail corporativo ou Microsoft', 'Cada perfil vê os seus módulos', 'Busca de páginas, planos e ações (Ctrl+Q)', 'Chamado de suporte com captura de tela']]
  ],
  cfo: [
    ['Visão executiva', ['Indicadores executivos de todas as áreas', 'Pontos que exigem atenção do CFO', 'Situação de cada área num olhar', 'Execução do ciclo de relatórios', 'Filtros por período, área e gestor']],
    ['Doze áreas financeiras', ['Painel próprio para cada área', 'Da Controladoria ao Comercial e à Tesouraria', 'Receita, EBITDA e caixa em 12 meses', 'Inadimplência, aging e DSO', 'Calendário de obrigações fiscais', 'Áreas ativadas e renomeadas pelo CFO']],
    ['Relatório guiado do gestor', ['Conversa guiada: a IA pergunta, o gestor responde', 'Seis perguntas iguais para todas as áreas', 'Causa, ação, responsável e prazo de cada desvio', 'Nota e pontualidade de cada entrega', 'Janela de envio semanal ou mensal', 'Checklist do relatório por área']],
    ['Indicadores e budget', ['Indicadores com código e sentido de melhora', 'Histórico de 12 meses de cada indicador', 'Quem registrou cada valor e por quê', 'Budget anual por área, mês a mês', 'Budget consumido contra o planejado', 'Importação de CSV ou XLSX com prévia']],
    ['Fechamento e Big Brain', ['Fechamento do mês com pendências e desvios', 'O que mais piorou e melhorou', 'Big Brain aponta gargalos, riscos e avanços', 'Sugestões de tarefas a partir da análise', 'Cruzamento de desvios entre áreas', 'Exportação em xlsx e PDF']],
    ['Tarefas compromissadas e metas', ['Cada desvio vira ação com dono e prazo', 'Impacto esperado e impacto realizado', 'Quadro Kanban e lista', 'Atualizações com evidências', 'Metas por área ou pessoa, com peso', 'Metas dos gestores valem após aprovação do CFO', 'Metas calculadas por indicador ou checklist']],
    ['Assistente CFO', ['Perguntas em linguagem natural sobre os números', 'Resumo do mês em poucas linhas', 'Respostas só com dados que você pode ver', 'Ações pedem a sua confirmação', 'Anexo de planilha, PDF ou imagem', 'Ditado por voz']],
    ['Pessoas e feedback', ['Mural de feedback por pessoa e por tom', 'Relatórios de cada pessoa com nota média', 'Usuários com papéis e áreas', 'Delegação de acesso']],
    ['Governança e segurança', ['Auditoria de tudo, sem apagar nada', 'Chat Log das conversas com a IA', 'Papel validado no servidor a cada acesso', 'Esteira de melhorias do próprio sistema', 'Logo, cor, moeda e fuso da empresa', 'Servidor dedicado e modelo de IA privado']]
  ],
  sprint: [
    ['Projetos', ['Projetos com nome, chave e descrição', 'Subprojetos', 'Equipes e pessoas por projeto', 'Responsáveis do projeto']],
    ['Sprints e quadro', ['Quadro de sprints', 'Kanban com colunas configuráveis', 'Coluna de conclusão definida pelo time', 'Visão em lista', 'Kanban aberto por padrão no projeto']],
    ['Backlog', ['Tarefas aguardando planejamento', 'Filtros por responsável, relator, squad e épico', 'Filtros por tags, categoria, impacto e prioridade', 'Tarefas sinalizadas']],
    ['Tarefas', ['Minhas tarefas em todos os projetos', 'Prazo, prioridade, tags e responsável', 'Estimativa original e trabalho registrado', 'Histórico de tarefas com filtros', 'Importação em massa por Excel ou CSV', 'Modelos de cards para criação rápida']],
    ['Regras e automação', ['Quem pode concluir tarefas', 'Tags obrigatórias nas tarefas', 'Responsável e relator automáticos por coluna', 'Tags e categorias do projeto']],
    ['Acompanhamento', ['Cronograma', 'Métricas de execução', 'Colaboração em tempo real']],
    ['Ecossistema Pomin', ['Sprints usadas também pelo PominCS', 'Chamado de suporte de dentro do sistema', 'Chat interno', 'Tema claro e escuro']]
  ],
  dev: [
    ['Esteira do chamado ao deploy', ['Chamados do PominSAC entram na esteira', 'Etapas de análise, desenvolvimento, revisão e testes', 'Homologação e produção após o seu aceite', 'Validação do suporte antes de voltar ao cliente', 'Nova tarefa ou chamado direto na esteira']],
    ['Agentes de IA no código', ['Agente lê o código real do repositório', 'PR aberto pelo agente', 'Agente revisor e etapa de QA', 'Conversa com o agente que vira tarefa', 'Conversa por voz com o PominDev']],
    ['Fila e indicadores', ['Fila de demandas do backlog', 'Pegar uma demanda para análise', 'Demandas abertas, entregues e atrasadas', 'Lead time, taxa de sucesso e retrabalho', 'Comparação com o período anterior', 'Filtros por sistema, etapa, prioridade e SLA']],
    ['Studio de protótipos', ['Protótipo construído ao vivo pela IA', 'Pedido em texto: página, app ou dashboard', 'Projetos do Git e protótipos salvos', 'Criação de repositório']],
    ['Revisão e melhoria contínua', ['Revisor de PRs com regras por sistema', 'Loop de melhorias em segurança, performance e design', 'PRs de melhoria seguem até o deploy', 'Cada rodada parte do código já melhorado']],
    ['Sonhos da madrugada', ['IAs conversam de madrugada buscando melhorias', 'Diálogo e resumo prontos de manhã', 'Cada ideia vira tarefa ou é declinada', 'Brainstorm de micro-projetos']],
    ['Memória e engenharia', ['Aprendizados do time usados pelos agentes', 'Memórias por sistema e globais', 'Documentos de arquitetura, segurança e design system', 'Diretrizes da IA para todos os sistemas', 'Leitura online ou download em Markdown']],
    ['Repositórios e acesso', ['Navegação e edição de arquivos do repositório', 'Conexão com o GitHub por token', 'Responsável por sistema na validação', 'Sistemas liberados por usuário']]
  ],
  sac: [
    ['Canais por área', ['Um canal por área', 'E-mail de entrada próprio de cada canal', 'Pedidos por e-mail viram chamados', 'Cadastro de sistemas e departamentos']],
    ['Chamados com dono e prazo', ['Responsável por chamado', 'Prazo e SLA de cada pedido', 'Tipos: erro, melhoria, nova feature, tarefa, dúvida', 'Prioridade de baixa a urgente', 'Fluxo de status com histórico']],
    ['Abertura de dentro dos sistemas', ['Botão de chamado em todos os sistemas Pomin', 'Captura de tela anexada ao chamado', 'Meus chamados com comentários', 'Cancelamento enquanto o chamado está aberto']],
    ['Painel do dia', ['Abertos aguardando triagem', 'Chamados em andamento', 'Resolvidos nos últimos 30 dias', 'Urgentes e atrasados em destaque', 'Painel filtrado por responsável']],
    ['Minhas solicitações', ['Visão em tabela ou Kanban', 'Busca por título, sistema ou responsável', 'Filtros por status, tipo e prioridade', 'Filtros salvos para a próxima visita', 'Atalhos por status']],
    ['Integrações Pomin', ['Chamados seguem para a esteira do PominDev', 'Validação do suporte antes de voltar ao cliente', 'Chamados do cliente lidos pelo PominCS', 'Painel de chamados no PominBI']],
    ['Ajuda e acesso', ['Tour guiado de cada tela', 'Leitura do tour em voz alta', 'Mesma senha para os sistemas do grupo', 'Login com Microsoft', 'Busca de solicitações e telas (Ctrl+K)']]
  ],
  chat: [
    ['Atendimento no WhatsApp', ['Números conectados por QR Code', 'Várias instâncias de WhatsApp', 'Filas por equipe', 'Pegar o próximo cliente da fila', 'Meus chats, não atribuídos e não lidas', 'Conversas abertas e concluídas', 'Assumir conversa sem responsável']],
    ['Bots e automação', ['Fluxos visuais de conversa', 'Personas de IA por número', 'Respostas automáticas com IA', 'Passagem para atendente humano', 'Mensagem automática fora do horário', 'Bot ligado ou desligado pelo administrador']],
    ['Controle do atendimento', ['SLA com prazo de primeira resposta', 'Respostas rápidas digitando "/"', 'Motivo de pausa e de transferência', 'Histórico para quem assume a conversa', 'Campanhas para os contatos']],
    ['Contatos e leads', ['Contatos por instância', 'Filtros por sequência e classificação', 'Grupos de WhatsApp', 'Leads do primeiro contato ao fim do atendimento']],
    ['Comunicação interna', ['Chat interno entre pessoas da equipe', 'Grupos internos divididos por tópicos', 'Ordem dos grupos do seu jeito', 'Busca nas mensagens', 'Envio bloqueado fora da jornada, salvo urgente', 'Tarefas e lembretes com /tarefa']],
    ['Reuniões e agenda', ['Salas de reunião com link temporário', 'Convidado sem conta também entra', 'Agenda por dia, semana e mês', 'Eventos com convidados']],
    ['IA e treinamento', ['Assistente Geral que responde sobre as conversas', 'Resumo do que foi falado com o cliente', 'Treinamento guiado em 6 módulos', 'Avaliação final com nota mínima']],
    ['Gestão e ajuda', ['Painel gerencial por pessoa e período', 'Telefonia: aparelhos por unidade, IMEI e modelo', 'Início com atalhos conforme o acesso', 'Dúvidas comuns com passo a passo', 'Busca de telas e ações (Ctrl+K)']]
  ],
  cs: [
    ['Painel executivo', ['Health Score, NPS e média CSAT', 'ARR, MRR e LTV', 'MRR Churn, Churn Rate e Logo Churn', 'NRR e GRR (retenção de receita)', 'Adoção e DAU/MAU', 'Contratos novos e encerrando', 'Clientes em risco de churn, com exportação']],
    ['Indicadores e receita', ['Indicadores com metas por cor', 'Filtros por produto, segmento, CSM e status', 'TTV por coorte', 'Receita recorrente mês a mês por produto', 'Lançamentos de setup, reajuste e transacional', 'Exportação para Excel']],
    ['Clientes e contratos', ['Carteira com filtros e exportação CSV', 'Ficha do cliente com linha do tempo', 'Contatos com busca', 'Contratos com MRR e TCV por status', 'Aditivos de upsell, downsell e renovação', 'Cancelamento com motivo e opção de desfazer', 'Health Score calculado pelos chamados do PominSAC']],
    ['Pesquisas NPS e CSAT', ['Envio de NPS e CSAT por e-mail', 'Modelos de pesquisa por marca', 'Painéis de NPS e CSAT', 'NPS por organização', 'E-mail de retorno por nota, com envio de teste', 'Pesquisa global por produto', 'Envio por WhatsApp e SMS (em breve)']],
    ['Fechamento de loop', ['Histórico de votos com SLA de contato', 'Prazo de contato do detrator: 2 dias úteis', 'Checklist do contato até o loop fechado', 'Funil de tratamento dos votos', 'NPS interno entre áreas']],
    ['Jornada e tarefas', ['Jornada do cliente por etapas', 'Duração, TTV e lead time da jornada', 'Clientes por etapa em Kanban', 'Modelos de onboarding, ongoing e offboarding', 'Board Kanban de tarefas por sprint', 'Cobertura e carga por responsável']],
    ['Rotina do CSM', ['Agenda semanal com clientes', 'Templates de e-mail por categoria', 'Tickets por cliente e por situação', 'Títulos financeiros por status', 'Playbooks com gatilhos e etapas', 'Execução automática de playbooks (em breve)', 'Caixa de e-mail Gmail e Outlook (em breve)']],
    ['Sofia, a IA do PominCS', ['Perguntas sobre clientes, NPS e receita', 'Painel lateral sem sair da tela', 'Indica o caminho de cada tela', 'Busca de clientes e telas (Ctrl+K)']],
    ['Administração', ['Usuários com papel de usuário ou administrador', 'Equipes e departamentos', 'Importação de clientes e contatos por planilha', 'Motivos de cancelamento configuráveis', 'Logs de integração', 'Login com Microsoft', 'Tracking de uso do produto (em breve)']]
  ]
};
