"""Monta ia/base.md (o que a IA da página lê) a partir dos README.md das pastas pomin* de ../grupopomin.

    python3 ia/atualizar_base.py            # reconstrói a base a partir de readmes/
    python3 ia/atualizar_base.py --copiar   # antes, copia de novo os READMEs de ../grupopomin
    python3 ia/atualizar_base.py --teste    # confere as regras de limpeza

Os READMEs são documentação técnica. A base guarda só a parte de produto (o que o sistema faz):
tira blocos de código, seções técnicas (stack, deploy, variáveis, banco...) e apaga IPs, e-mails,
endereços locais e linhas com senha/chave. Os originais ficam em readmes/.
"""
import pathlib, re, sys

RAIZ = pathlib.Path(__file__).resolve().parent.parent
READMES, BASE = RAIZ / 'readmes', RAIZ / 'ia' / 'base.md'
APP_JS = RAIZ / 'Pomin360 · Universo de soluções_files' / 'app.js'
GRUPO = RAIZ.parent / 'grupopomin'
IGNORAR = {'pomin-ui', 'pominstart'}  # modelos para desenvolvedores, não são produtos

# Seção principal (##) só entra se o título for de produto; subseções técnicas saem mesmo dentro delas
PRODUTO = re.compile(r'vis[aã]o geral|features|funcionalidades|m[oó]dulos|telas|o que|resolve|recursos|como funciona|'
                     r'integra[cç][oõ]es|pap[eé]is|permiss[oõ]es|biblioteca|extra[cç][aã]o|leitura de pdv|\bia\b|'
                     r'autentica[cç][aã]o e gest[aã]o|suporte|contratos|pagamento|sites|dashboard|relat[oó]rios|campanhas', re.I)
TECNICO = re.compile(r'stack|estrutura|pr[eé]-?requisit|requisitos|deploy|\bci\b|\bcd\b|vari[aá]ve|\benv\b|arquitetura|rotas|'
                     r'\blogin\b|scripts?|rodar|rodando|como testar|testes?\b|development|desenvolv|setup|instala|configura|build|'
                     r'lovable|licen|contribu|troubleshoot|banco|supabase|edge function|nginx|docker|branch|commit|customiza|'
                     r'trocar|adicionar uma|pr[oó]ximos passos|sum[aá]rio|seguran[cç]a|\bsso\b|azure|roadmap|vocabul|cuidados|'
                     r'atalhos|componentes e exemplos|fluxo de|primeiro admin|migra|webhook|cron|\bapi\b|endpoint|secrets?|'
                     r'comandos|tecnologia|infra|servidor|porta\b|cli\b|ambiente|npm|install|trava|falha|erro|problema|cache|lint|pdf-converter|curl|portas|boot|triggers?|helpers?|modelo de dados', re.I)
SENSIVEL = re.compile(r'senha|password|secret|token|api[_ -]?key|chave|credencia|service[_ ]role|\.env|localhost|127\.0\.0\.1|'
                      r'schema|src/|docker|lovable|\bsql\b|\bnpm\b|next dev|\b\w+=\w+', re.I)
REF = re.compile(r'\b[a-z0-9]{20}\b')  # id de projeto Supabase
LINK_LOCAL = re.compile(r'\[([^\]]*)\]\((?!https?://)[^)]*\)')  # link para arquivo do repositório: fica só o texto
IP = re.compile(r'\b\d{1,3}(?:\.\d{1,3}){3}\b')
EMAIL = re.compile(r'[\w.+-]+@[\w-]+\.[\w.]+')
VAR = re.compile(r'`[^`]*[A-Z]{2,}_[A-Z_]+[^`]*`')  # `NOME_DE_VARIAVEL`


def limpar(md):
    md = re.sub(r'```.*?```|~~~.*?~~~', '', md, flags=re.S)  # blocos de código
    partes, secao_ok, manter = [], True, True
    for linha in md.splitlines():
        cab = re.match(r'(#{1,4})\s+(.*)', linha)
        if cab:
            nivel, titulo = len(cab[1]), cab[2]
            if nivel == 1:
                secao_ok = manter = True
            elif nivel == 2:
                secao_ok = manter = bool(PRODUTO.search(titulo)) and not TECNICO.search(titulo)
            else:
                manter = secao_ok and not TECNICO.search(titulo)
        if not manter or SENSIVEL.search(linha) or VAR.search(linha) or '<!--' in linha:
            continue
        partes.append(LINK_LOCAL.sub(r'\1', REF.sub('', EMAIL.sub('', IP.sub('', linha)))).rstrip())
    return re.sub(r'\n{3,}', '\n\n', '\n'.join(partes)).strip()


def copiar():
    # README.md de cada pasta pomin* (e pomiro) em ../grupopomin -> readmes/<pasta>.md
    READMES.mkdir(exist_ok=True)
    for antigo in READMES.glob('*.md'):
        antigo.unlink()
    for pasta in sorted(p for p in GRUPO.iterdir() if p.is_dir() and re.match(r'pomi(n|ro)', p.name)):
        readme = next((f for f in pasta.iterdir() if f.name.lower() == 'readme.md'), None)
        if readme:
            (READMES / f'{pasta.name}.md').write_text(readme.read_text(encoding='utf-8'), encoding='utf-8')
        print(('ok ' if readme else '-- sem README ') + pasta.name)


def catalogo():
    # Linhas do array apps do app.js: ['id','Nome','Categoria','<svg>','#cor','url','resumo','descrição','público',...
    linhas = []
    for m in re.finditer(r"^\['(\w+)','([^']+)','([^']+)','[^']*','#\w+','([^']+)','([^']+)','([^']+)','([^']+)'", APP_JS.read_text(encoding='utf-8'), re.M):
        _, nome, cat, url, resumo, desc, publico = m.groups()
        linhas.append(f'- {nome} ({cat}) · {url}\n  {resumo} {desc} Para quem: {publico}')
    return '<catalogo>\n' + '\n'.join(linhas) + '\n</catalogo>'


def montar():
    blocos = [catalogo()]
    for arq in sorted(READMES.glob('*.md'), key=lambda p: p.stem.lower()):
        if arq.stem in IGNORAR:
            continue
        texto = limpar(arq.read_text(encoding='utf-8'))
        if len(texto) > 300:  # sobra quase nada (ex.: README padrão do Lovable): não vale como documento
            blocos.append(f'<documento repositorio="{arq.stem}">\n{texto}\n</documento>')
    BASE.write_text('\n\n'.join(blocos) + '\n', encoding='utf-8')
    sistemas = blocos[0].count('\n- ')
    print(f'{BASE.relative_to(RAIZ)}: catálogo com {sistemas} sistemas + {len(blocos) - 1} documentos, {BASE.stat().st_size // 1024} KB')


def teste():
    md = ('# PominX\nFaz relatórios.\n## Funcionalidades\n- Painel de metas\n- Admin: fulano@empresa.com.br\n'
          '## Deploy\nServidor 35.174.181.218\n## Inventário de portas\n- 7443 chat\n## Telas\n### Triggers\n- trg_x\n### Painel\n- Gráficos\n- Senha do admin: 123\n- Home\n```bash\nnpm run dev\n```\n'
          '- Usa `MOVIDESK_API_KEY` no backend\n- Projeto thxmihjinfljekyfpywm\n- Veja [o guia](docs/guia.md)\n')
    out = limpar(md)
    assert 'Painel de metas' in out and 'Home' in out and 'Faz relatórios.' in out
    assert 'Veja o guia' in out and 'Gráficos' in out
    for vazou in ('35.174', 'fulano@', 'Senha', 'npm run', 'MOVIDESK', 'Deploy', 'thxmih', 'docs/guia', '7443', 'trg_x'):
        assert vazou not in out, vazou
    print('ok')


if __name__ == '__main__':
    if '--teste' in sys.argv:
        teste()
    else:
        if '--copiar' in sys.argv:
            copiar()
        montar()
