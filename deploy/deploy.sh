#!/usr/bin/env bash
# Faz o build local e envia para o EC2.
# Uso: ./deploy/deploy.sh <ip-ou-dns-do-ec2> <caminho-da-chave.pem>
set -euo pipefail

HOST="${1:?informe o IP/DNS do EC2}"
KEY="${2:?informe o caminho da chave .pem}"
SSH="ssh -i $KEY ec2-user@$HOST"

npm run build

$SSH "rm -rf /tmp/site && mkdir -p /tmp/site"
scp -i "$KEY" -r dist/* "ec2-user@$HOST:/tmp/site/"
$SSH "sudo rm -rf /usr/share/nginx/html/* && sudo cp -r /tmp/site/* /usr/share/nginx/html/ && sudo systemctl reload nginx"

echo "Deploy concluído: http://$HOST"
