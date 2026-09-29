#!/usr/bin/env python3
"""Serve a página comercial do Pomin360 atrás de uma tela de login (login.html + cookie de sessão assinado).

Local:  python3 servir.py              -> http://localhost:5360
Docker: docker compose up -d --build   -> http://localhost:5360
Produção: todo push na main publica em https://comercial.pomin360.com.br (.github/workflows/deploy.yml).
Ambiente: APP_USER, APP_PASSWORD, HOST, PORT, SESSION_SECRET, ANTHROPIC_API_KEY (IA da página).
Sem SESSION_SECRET fixo, reiniciar desloga todo mundo e invalida os links de convite já enviados.

IA da página: POST /api/perguntar responde dúvidas com o Claude, lendo ia/base.md (catálogo + READMEs limpos,
gerado por ia/atualizar_base.py). Só para quem tem sessão (comercial ou cliente do convite).

Link do questionário: quem está logado recebe na página um convite assinado (window.POMIN360_CONVITE,
válido por 30 dias) que o app.js põe no link como ?c=. Quem abre esse link entra sem senha, numa
sessão de cliente, que não recebe convite e por isso não gera links novos.
"""
import hashlib
import hmac
import http.server
import json
import os
import re
import secrets
import time
import unicodedata
from urllib.parse import parse_qs, quote, unquote, urlsplit

USER = os.environ.get('APP_USER', 'comercial')
PASSWORD = os.environ.get('APP_PASSWORD', 'comercial')
HOST, PORT = os.environ.get('HOST', '127.0.0.1'), int(os.environ.get('PORT', '5360'))
SECRET = os.environ.get('SESSION_SECRET', '').encode() or secrets.token_bytes(32)
ROOT = os.path.dirname(os.path.abspath(__file__))
PAGE = 'Pomin360 · Universo de soluções.html'
# Só a página e os arquivos dela são servidos; servir.py, backup/ e o resto da pasta ficam de fora
ALLOWED = ('/Pomin360 · Universo de soluções_files/', '/logos/')
COOKIE, TTL, INVITE_TTL = 'pomin360', 12 * 3600, 30 * 24 * 3600
VERSAO = str(int(time.time()))  # muda a cada deploy/reinício: vai no ?v= dos CSS/JS para o navegador não usar cópia velha
LOGIN = open(os.path.join(ROOT, 'login.html'), encoding='utf-8').read()
BASE_IA = os.path.join(ROOT, 'ia', 'base.md')
BASE = open(BASE_IA, encoding='utf-8').read() if os.path.exists(BASE_IA) else ''
LIMITE_IA = 30  # perguntas por hora de cada sessão do comercial
LIMITE_CLIENTES = 100  # por hora, somando todos os clientes: reabrir o convite gera cookie novo, então o teto de custo é conjunto
USO = {}  # ponytail: contagem em memória, zera ao reiniciar; mover para Redis se houver mais de um processo
INSTRUCOES = """Você é o assistente comercial do Pomin360, o ecossistema de sistemas do Grupo Pomin. Responde, em português do Brasil, dúvidas de vendedores e de clientes sobre o que cada sistema faz.

Use só as informações abaixo. O <catalogo> é a oferta comercial oficial: os sistemas que aparecem na página e podem ser contratados. Os <documento> são a documentação dos repositórios e servem para detalhar funcionalidades; alguns descrevem produtos internos, pilotos ou em construção que não estão no catálogo. Fale desses só se perguntarem, dizendo que a disponibilidade comercial precisa ser confirmada com o comercial.

Se a resposta não estiver nessas informações, diga que não encontrou na documentação e sugira falar com o comercial. Não invente funcionalidades, integrações, preços ou prazos. Os únicos prazos que você pode citar: pacote completo em até 2 meses; sistema avulso em cerca de 1 semana por sistema. Não fale de preço.

Não fale de detalhes técnicos internos (servidores, bancos, variáveis, credenciais, código, arquitetura); se perguntarem, diga que o time técnico cuida disso na implantação.

Responda direto e curto (até umas 120 palavras, a menos que peçam detalhes), em texto simples. Pode usar listas curtas com "- " e **negrito** nos nomes dos sistemas."""
cliente_ia = None
# Botão do topo, só para o comercial logado (o cliente do convite não tem senha para voltar)
SAIR = ('<a class="logout" href="/sair"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" '
        'stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></svg>Sair</a>')


def sign(kind, exp):
    # kind separa os tokens: 's' sessão do comercial, 'c' sessão de cliente, 'convite' link do questionário
    return hmac.new(SECRET, f'{kind}:{exp}'.encode(), hashlib.sha256).hexdigest()


def valid(kind, token):
    m = re.fullmatch(r'(\d+)\.([0-9a-f]{64})', token or '')
    return bool(m) and int(m[1]) > time.time() and hmac.compare_digest(m[2], sign(kind, m[1]))


def token(kind, ttl):
    exp = int(time.time()) + ttl
    return f'{exp}.{sign(kind, exp)}'


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def translate_path(self, path):
        # No Linux (Docker) o nome precisa bater byte a byte: tenta o acento composto (NFC) e o decomposto (NFD)
        p = super().translate_path(path)
        for form in ('NFD', 'NFC'):
            if not os.path.exists(p) and os.path.exists(unicodedata.normalize(form, p)):
                p = unicodedata.normalize(form, p)
        return p

    def session(self):
        m = re.search(rf'(?:^|;\s*){COOKIE}=([sc])\.(\S+?)(?:;|$)', self.headers.get('Cookie', ''))
        return m[1] if m and valid(m[1], m[2]) else None

    def cookie(self, kind):
        secure = '; Secure' if self.headers.get('X-Forwarded-Proto') == 'https' else ''
        return f'{COOKIE}={kind}.{token(kind, TTL)}; Max-Age={TTL}; Path=/; HttpOnly; SameSite=Lax{secure}'

    def do_GET(self):
        url = urlsplit(self.path)
        # Os links da página vêm com acentos decompostos (NFD); normaliza antes de comparar
        path = unicodedata.normalize('NFC', unquote(url.path))
        if path == '/sair':
            return self.redirect('/', f'{COOKIE}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax')
        if path == '/favicon.svg':  # público: a aba da tela de login também mostra o ícone
            return super().do_GET()
        kind = self.session()
        if not kind and path == '/' + PAGE and valid('convite', parse_qs(url.query).get('c', [''])[0]):
            return self.page('c', self.cookie('c'))
        if not kind:
            return self.login(200 if path in ('/', '/' + PAGE) else 401)
        if path == '/':
            return self.redirect('/' + quote(PAGE))
        if path == '/' + PAGE:
            return self.page(kind)
        if not path.startswith(ALLOWED):
            return self.send_error(404)
        super().do_GET()

    def do_HEAD(self):
        self.send_error(405)

    def do_POST(self):
        if urlsplit(self.path).path == '/api/perguntar':
            return self.perguntar()
        size = int(self.headers.get('Content-Length') or 0)
        form = parse_qs(self.rfile.read(min(size, 4096)).decode('utf-8', 'replace'))
        field = lambda k: form.get(k, [''])[0]
        ok = hmac.compare_digest(field('usuario').encode(), USER.encode()) & hmac.compare_digest(field('senha').encode(), PASSWORD.encode())
        if not ok:
            time.sleep(1)  # ponytail: freio simples contra tentativa em massa; limite por IP se for exposto na internet
            return self.login(401, erro=True)
        dest = self.path if self.path.startswith('/') and not self.path.startswith('//') else '/'
        if re.fullmatch(r'#[A-Za-z0-9_-]{1,64}', field('h')):
            dest += field('h')
        self.redirect(dest, self.cookie('s'))

    def perguntar(self):
        global cliente_ia
        kind = self.session()
        if not kind:
            return self.send_json(401, {'erro': 'Entre de novo para usar a IA.'})
        try:
            dados = json.loads(self.rfile.read(min(int(self.headers.get('Content-Length') or 0), 60000)))
            msgs = [{'role': m['role'], 'content': m['content']} for m in dados['historico']]
            # Histórico vindo da página: alterna usuário/IA, começa e termina com o usuário
            if not (0 < len(msgs) <= 21 and len(msgs) % 2) or any(
                    m['role'] != ('assistant' if i % 2 else 'user') or not isinstance(m['content'], str)
                    or not 0 < len(m['content']) <= (8000 if i % 2 else 2000) for i, m in enumerate(msgs)):
                raise ValueError
        except (ValueError, KeyError, TypeError):
            return self.send_json(400, {'erro': 'Pergunta inválida.'})
        sid, agora = ('clientes' if kind == 'c' else self.headers.get('Cookie', '')), time.time()
        uso = [t for t in USO.get(sid, []) if agora - t < 3600]
        if len(uso) >= (LIMITE_CLIENTES if kind == 'c' else LIMITE_IA):
            return self.send_json(429, {'erro': 'Limite de perguntas por hora atingido. Tente mais tarde.'})
        if not (BASE and os.environ.get('ANTHROPIC_API_KEY')):
            return self.send_json(503, {'erro': 'A IA ainda não foi configurada neste servidor.'})
        try:
            import anthropic
        except ImportError:
            return self.send_json(503, {'erro': 'Falta instalar o pacote anthropic no servidor.'})
        USO[sid] = uso + [agora]
        cliente_ia = cliente_ia or anthropic.Anthropic(timeout=90)
        try:
            r = cliente_ia.beta.messages.create(
                model='claude-opus-5-5', max_tokens=16000,
                betas=['server-side-fallback-2026-07-01'], fallbacks='default',  # recusa: tenta o modelo recomendado
                output_config={'effort': 'low'},
                # Instruções + base não mudam entre perguntas: ficam em cache (1 h) e só a conversa é cobrada inteira
                system=[{'type': 'text', 'text': INSTRUCOES + '\n\n' + BASE, 'cache_control': {'type': 'ephemeral', 'ttl': '1h'}}],
                messages=msgs)
        except anthropic.RateLimitError:
            return self.send_json(429, {'erro': 'A IA está recebendo muitas perguntas agora. Tente de novo em instantes.'})
        except anthropic.AuthenticationError:
            return self.send_json(503, {'erro': 'A chave da IA não foi aceita. Avise o time técnico.'})
        except anthropic.APIStatusError as e:
            return self.send_json(502 if e.status_code >= 500 else 400, {'erro': 'A IA não conseguiu responder agora. Tente de novo.'})
        except anthropic.APIConnectionError:
            return self.send_json(503, {'erro': 'Sem conexão com a IA. Tente de novo.'})
        if r.stop_reason == 'refusal':
            texto = 'Não consigo responder isso por aqui. O comercial pode te ajudar.'
        else:
            texto = ''.join(b.text for b in r.content if b.type == 'text').strip() or 'Não encontrei uma resposta. Tente perguntar de outro jeito.'
        self.send_json(200, {'resposta': texto})

    def send_json(self, status, obj):
        body = json.dumps(obj, ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        self.wfile.write(body)

    def page(self, kind, cookie=None):
        html = open(self.translate_path('/' + quote(PAGE)), encoding='utf-8').read()
        html = re.sub(r'(_files/[^"?]+\.(?:css|js))"', rf'\1?v={VERSAO}"', html)
        if kind == 's':
            html = html.replace('<!--SAIR-->', SAIR, 1)
            html = html.replace('</head>', f'<script>window.POMIN360_CONVITE="{token("convite", INVITE_TTL)}"</script></head>', 1)
        self.send_html(200, html, cookie)

    def login(self, status, erro=False):
        self.send_html(status, LOGIN.replace('<!--ERRO-->', '<p class="erro" role="alert">Usuário ou senha incorretos.</p>' if erro else ''))

    def send_html(self, status, html, cookie=None):
        body = html.encode()
        self.send_response(status)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Cache-Control', 'no-store')
        if cookie:
            self.send_header('Set-Cookie', cookie)
        self.end_headers()
        self.wfile.write(body)

    def redirect(self, to, cookie=None):
        self.send_response(303)
        self.send_header('Location', to)
        if cookie:
            self.send_header('Set-Cookie', cookie)
        self.send_header('Content-Length', '0')
        self.end_headers()


if __name__ == '__main__':
    print(f'Pomin360 em http://localhost:{PORT} (usuário {USER})', flush=True)
    http.server.ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()
