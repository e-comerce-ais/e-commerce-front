# e-commerce-front

Dashboard em React + Vite + TypeScript que consome a API `api-geohash` (Lambda + API Gateway) e mostra os clusters de pedidos agrupados por geohash.

- **Resumo**: total de clusters, de pedidos, média por cluster, maior cluster e última atualização
- **Mapa** (Leaflet + OpenStreetMap): um círculo no centroide de cada geohash (`sum_lat/count`, `sum_lng/count`), com tamanho e cor pela quantidade de pedidos
- **Top N** (Recharts): ranking de clusters por quantidade de pedidos
- **Tabela** ordenável. Clicar em um cluster destaca ele em todos os gráficos.

## Rodando localmente

```bash
npm install
cp .env.example .env.local     # coloque a URL do API Gateway em VITE_API_URL
npm run dev                    # http://localhost:5173
```

> Para o navegador aceitar as chamadas, o `ALLOWED_ORIGIN` da Lambda e o CORS do API Gateway precisam incluir `http://localhost:5173` (em dev) ou a URL do EC2 (em produção).

## Estrutura

```
src/
├── api/client.ts          # fetch tipado para a API
├── hooks/                 # useClusters / useSummary (React Query), useTheme
├── components/            # SummaryCards, ClusterMap, ClusterBarChart, ClusterTable
├── pages/Dashboard.tsx    # filtros + layout
├── utils/                 # formatação pt-BR, tokens de cor (claro/escuro)
└── types/cluster.ts       # mesmo formato da API
deploy/                    # nginx.conf, setup-ec2.sh, deploy.sh
```

## Deploy no EC2

### 1. Criar a instância (console AWS)
- AMI **Amazon Linux 2023**, tipo `t3.micro`, com um key pair (`.pem`).
- Security Group: **HTTP 80** de `0.0.0.0/0` e **SSH 22** só do seu IP.
- (Recomendado) associar um **Elastic IP**, para o endereço não mudar quando a instância reiniciar.

### 2. Configurar o Nginx (uma vez)
```bash
scp -i chave.pem deploy/nginx.conf ec2-user@<IP>:/tmp/e-commerce-front.conf
scp -i chave.pem deploy/setup-ec2.sh ec2-user@<IP>:/tmp/
ssh -i chave.pem ec2-user@<IP> "bash /tmp/setup-ec2.sh"
```

### 3. Build + envio (sempre que atualizar)
```bash
echo "VITE_API_URL=https://<api-id>.execute-api.<regiao>.amazonaws.com" > .env.production
./deploy/deploy.sh <IP> chave.pem
```
No Windows, rode o script pelo Git Bash.

### 4. Liberar CORS na API
Na Lambda, ajuste `ALLOWED_ORIGIN=http://<IP>`. No API Gateway, adicione `http://<IP>` em CORS → Allow origin.

Depois é só abrir `http://<IP>` no navegador.
