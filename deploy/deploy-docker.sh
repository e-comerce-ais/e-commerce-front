#!/usr/bin/env bash
# Builda a imagem Docker localmente, envia para o EC2 e (re)inicia o container.
# Não precisa de registry (ECR/Docker Hub) nem de git no EC2.
# Uso: ./deploy/deploy-docker.sh <ip-ou-dns-do-ec2> <caminho-da-chave.pem>
# Instância Graviton (t4g): PLATFORM=linux/arm64 ./deploy/deploy-docker.sh ...
set -euo pipefail

HOST="${1:?informe o IP/DNS do EC2}"
KEY="${2:?informe o caminho da chave .pem}"
PLATFORM="${PLATFORM:-linux/amd64}"
IMAGE="e-commerce-front"
SSH=(ssh -i "$KEY" "ec2-user@$HOST")

# Mesma fonte da URL que o deploy sem Docker: .env.production (ou a variável já exportada).
if [ -z "${VITE_API_URL:-}" ] && [ -f .env.production ]; then
  VITE_API_URL="$(grep -E '^VITE_API_URL=' .env.production | tail -n1 | cut -d= -f2- | tr -d "\r\"'")"
fi
: "${VITE_API_URL:?defina VITE_API_URL no .env.production}"

docker build --platform "$PLATFORM" --provenance=false --build-arg VITE_API_URL="$VITE_API_URL" -t "$IMAGE" .

TAR="$(mktemp -d)/$IMAGE.tar.gz"
docker save "$IMAGE" | gzip > "$TAR"
scp -i "$KEY" "$TAR" "ec2-user@$HOST:/tmp/$IMAGE.tar.gz"
rm -f "$TAR"

"${SSH[@]}" "set -e
  gunzip -c /tmp/$IMAGE.tar.gz | sudo docker load
  rm -f /tmp/$IMAGE.tar.gz
  sudo docker rm -f $IMAGE >/dev/null 2>&1 || true
  sudo docker run -d --name $IMAGE --restart unless-stopped -p 80:80 $IMAGE
  sudo docker image prune -f >/dev/null"

echo "Deploy concluído: http://$HOST"
