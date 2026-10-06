"""Teste do login e do convite do questionário do servir.py. Rodar: python3 teste_servir.py"""
import http.client
import http.server
import json
import os
import re
import threading
import time
import unicodedata
from urllib.parse import quote

import servir

srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), servir.Handler)
threading.Thread(target=srv.serve_forever, daemon=True).start()


def req(method, path, body=None, cookie=None):
    c = http.client.HTTPConnection('127.0.0.1', srv.server_port)
    headers = {'Content-Type': 'application/x-www-form-urlencoded'} if body else {}
    if cookie:
        headers['Cookie'] = cookie
    c.request(method, path, body, headers)
    r = c.getresponse()
    return r.status, dict(r.getheaders()), r.read().decode('utf-8', 'replace')


LOGIN_PAGE = 'Acesso comercial'
page = '/' + quote(servir.PAGE)
css = '/' + quote(unicodedata.normalize('NFD', 'Pomin360 · Universo de soluções_files/style.css'))  # como o HTML pede

# Login do comercial
s, _, b = req('GET', '/')
assert s == 200 and LOGIN_PAGE in b, 'sem login mostra a tela'
assert req('GET', css)[0] == 401, 'arquivo da página sem login é bloqueado'
s, _, b = req('POST', '/', 'usuario=comercial&senha=errada')
assert s == 401 and 'incorretos' in b, 'senha errada recusada'
s, h, _ = req('POST', '/?v=a%40b.com', 'usuario=comercial&senha=comercial&h=%23questionario')
assert s == 303 and h['Location'] == '/?v=a%40b.com#questionario', 'volta para o link de origem com o #'
assert 'HttpOnly' in h['Set-Cookie']
seller = h['Set-Cookie'].split(';')[0]

s, _, b = req('GET', page, cookie=seller)
assert s == 200 and 'Universo de soluções</title>' in b, 'com login a página abre'
invite = re.search(r'POMIN360_CONVITE="([^"]+)"', b)[1]
assert 'href="/sair"' in b and '<!--SAIR-->' not in b, 'comercial vê o botão Sair'
assert re.search(r'style\.css\?v=\d+"', b) and re.search(r'app\.js\?v=\d+"', b), 'CSS/JS com versão do deploy'
assert req('GET', css + '?v=1', cookie=seller)[0] == 200, 'CSS com ?v= abre'
assert req('GET', css, cookie=seller)[0] == 200, 'CSS com caminho NFD abre'
assert req('GET', '/', cookie=seller)[1]['Location'] == page, 'raiz vai para a página'
for path in ('/servir.py', '/login.html', '/backup/', '/.env'):
    assert req('GET', path, cookie=seller)[0] == 404, f'{path} não é servido'

# Cookies inválidos
assert LOGIN_PAGE in req('GET', page, cookie=seller[:-4] + '0000')[2], 'cookie falsificado não entra'
old = int(time.time()) - 1
assert LOGIN_PAGE in req('GET', page, cookie=f'pomin360=s.{old}.{servir.sign("s", old)}')[2], 'cookie vencido não entra'

# Convite do questionário
s, h, b = req('GET', f'{page}?v=a%40b.com&cs=0&c={invite}')
assert s == 200 and LOGIN_PAGE not in b and 'POMIN360_CONVITE' not in b, 'convite abre a página, sem gerar convite novo'
client = h['Set-Cookie'].split(';')[0]
assert client.startswith('pomin360=c.'), 'sessão de cliente'
assert req('GET', css, cookie=client)[0] == 200, 'cliente carrega o CSS'
b_cli = req('GET', page, cookie=client)[2]
assert req('GET', '/calculadora.html', cookie=seller)[0] == 200, 'comercial abre a calculadora'
assert 'id="calc-frame"' in req('GET', page, cookie=seller)[2] and 'calc-frame' not in b_cli, 'calculadora embutida só para o comercial'
assert req('GET', '/calculadora.html', cookie=client)[0] == 404, 'cliente não vê preços nem margem'
assert req('GET', '/calculadora.html')[0] == 401, 'sem login, nada de calculadora'
assert 'POMIN360_CONVITE' not in b_cli and 'href="/sair"' not in b_cli, 'cliente não recebe convite nem Sair'
for bad in (invite[:-4] + '0000', f'{old}.{servir.sign("convite", old)}', seller.split('=s.')[1]):
    assert LOGIN_PAGE in req('GET', f'{page}?c={bad}')[2], 'convite falso, vencido ou token de sessão não entra'

# Contratar (assinatura no Mercado Pago)
assert servir.doc_valido('52998224725') and servir.doc_valido('11222333000181'), 'CPF e CNPJ válidos'
for ruim in ('52998224724', '11222333000182', '11111111111', '123'):
    assert not servir.doc_valido(ruim), f'{ruim} é inválido'
def contrata(dados, cookie=None):
    c = http.client.HTTPConnection('127.0.0.1', srv.server_port)
    c.request('POST', '/api/contratar', json.dumps(dados), {'Content-Type': 'application/json', **({'Cookie': cookie} if cookie else {})})
    return c.getresponse().status
pedido = {'nome': 'Fulano de Tal', 'email': 'f@empresa.com.br', 'fone': '(11) 99999-9999', 'doc': '529.982.247-25', 'valor': 4815, 'sistemas': ['PominAI']}
assert contrata(pedido) == 401 and contrata(pedido, client) == 401, 'só o comercial gera link'
assert contrata({**pedido, 'doc': '52998224724'}, seller) == 400, 'CPF errado recusado'
assert contrata({**pedido, 'valor': 0}, seller) == 400, 'mensalidade zerada recusada'
assert contrata({**pedido, 'fone': '9999'}, seller) == 400, 'telefone sem DDD recusado'
token_mp = os.environ.pop('MP_ACCESS_TOKEN', None)
assert contrata(pedido, seller) == 503, 'sem token, avisa que não está configurado'
if token_mp:
    os.environ['MP_ACCESS_TOKEN'] = token_mp

# IA da página
def pergunta(historico, cookie=None):
    c = http.client.HTTPConnection('127.0.0.1', srv.server_port)
    c.request('POST', '/api/perguntar', json.dumps({'historico': historico}), {'Content-Type': 'application/json', **({'Cookie': cookie} if cookie else {})})
    return c.getresponse().status
ok = [{'role': 'user', 'content': 'O que o PominCHAT faz?'}]
assert pergunta(ok) == 401, 'IA sem sessão é bloqueada'
for ruim in ([], [{'role': 'assistant', 'content': 'x'}], ok + [{'role': 'assistant', 'content': 'y'}], [{'role': 'user', 'content': 'x' * 2001}]):
    assert pergunta(ruim, seller) == 400, 'histórico fora do formato é recusado'
servir.USO[seller] = [time.time()] * servir.LIMITE_IA
assert pergunta(ok, seller) == 429, 'limite por hora do comercial'
servir.USO['clientes'] = [time.time()] * servir.LIMITE_CLIENTES
assert pergunta(ok, client) == 429, 'clientes dividem um teto: cookie novo do convite não zera o limite'

for evil in ('//evil.com', '///evil.com/x'):
    assert not req('POST', evil, 'usuario=comercial&senha=comercial')[1]['Location'].startswith('//'), 'sem redirecionar para outro site'
assert 'Max-Age=0' in req('GET', '/sair', cookie=seller)[1]['Set-Cookie'], 'sair apaga o cookie'
s, h, b = req('GET', '/favicon.svg')
assert s == 200 and h['Content-type'] == 'image/svg+xml' and '<svg' in b, 'ícone abre sem login'
assert 'rel="icon" href="/favicon.svg"' in req('GET', '/')[2], 'tela de login usa o ícone'
print('ok: login e convite do servir.py')
