#!/usr/bin/env bash
# Rode UMA VEZ dentro do EC2 (Amazon Linux 2023) para instalar e configurar o Nginx.
set -euo pipefail

sudo dnf install -y nginx
sudo cp /tmp/e-commerce-front.conf /etc/nginx/conf.d/e-commerce-front.conf
# Nosso server usa "default_server", então ele atende todas as requisições na porta 80.
sudo nginx -t
sudo systemctl enable --now nginx
echo "Nginx pronto."
