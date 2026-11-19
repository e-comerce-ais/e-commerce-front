# ---- build: gera o dist/ com o Vite ----
FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# O Vite embute a URL da API no bundle em tempo de build,
# então ela entra como build arg (e não como variável do container).
ARG VITE_API_URL
RUN test -n "$VITE_API_URL" || (echo "ERRO: passe --build-arg VITE_API_URL=https://..." >&2 && exit 1)
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ---- runtime: só o Nginx servindo os arquivos estáticos ----
FROM nginx:stable-alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
