# 1) Gera a apresentação oficial (v3) com o Vite
FROM node:22-alpine AS site
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/frontend/package.json apps/frontend/
COPY apps/backend/package.json apps/backend/
RUN npm ci --workspace @pomin360-comercial/frontend --include-workspace-root=false
COPY . .
RUN npm run build --workspace @pomin360-comercial/frontend

# 2) Servidor: login, IA e Mercado Pago (servir.py), servindo o site gerado depois do login
FROM python:3.12-alpine
WORKDIR /app
COPY . .
COPY --from=site /app/apps/frontend/dist apps/frontend/dist
# A pasta _files veio do Mac como 700; libera leitura para o usuário sem privilégios
RUN chmod -R a+rX /app
# SDK da Anthropic para a IA da página (/api/perguntar)
RUN pip install --no-cache-dir anthropic
ENV HOST=0.0.0.0 PORT=5360
EXPOSE 5360
USER nobody
CMD ["python3", "servir.py"]
