FROM python:3.12-alpine
WORKDIR /app
COPY . .
# A pasta _files veio do Mac como 700; libera leitura para o usuário sem privilégios
RUN chmod -R a+rX /app
# SDK da Anthropic para a IA da página (/api/perguntar)
RUN pip install --no-cache-dir anthropic
ENV HOST=0.0.0.0 PORT=5360
EXPOSE 5360
USER nobody
CMD ["python3", "servir.py"]
