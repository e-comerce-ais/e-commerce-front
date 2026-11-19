#!/usr/bin/env bash
# Rode UMA VEZ dentro do EC2 (Amazon Linux 2023) para instalar o Docker.
set -euo pipefail

sudo dnf install -y docker
sudo systemctl enable --now docker

# Se o Nginx do deploy sem Docker estiver rodando, ele ocupa a porta 80: desliga.
if systemctl is-active --quiet nginx; then
  sudo systemctl disable --now nginx
fi

echo "Docker pronto."
