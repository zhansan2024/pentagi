#!/bin/sh
# PentAGI 安装脚本（docker compose 方式，国内网络更稳）
# 官方安装器从 pentagi.com 下载，国内常见 1-2 KB/s；compose 只依赖 Docker Hub。
#
# 用法：sudo sh install-pentagi.sh
set -e

DIR="${PENTAGI_DIR:-/opt/pentagi}"
PORT="${PENTAGI_PORT:-8443}"
IP=$(hostname -I 2>/dev/null | awk '{print $1}')

echo "== [1/5] 检查"
command -v docker >/dev/null 2>&1 || { echo "需要 docker"; exit 1; }
docker info >/dev/null 2>&1 || { echo "docker 不可用，用 sudo 运行"; exit 1; }
docker compose version >/dev/null 2>&1 || { echo "需要 docker compose 插件"; exit 1; }

echo "== [2/5] 准备目录 $DIR"
mkdir -p "$DIR" && cd "$DIR"
[ -f docker-compose.yml ] || curl -fL -o docker-compose.yml https://raw.githubusercontent.com/vxcontrol/pentagi/main/docker-compose.yml
for f in custom-openai ollama-llama318b bedrock; do
  case $f in
    custom-openai) out=example.custom.provider.yml ;;
    ollama-llama318b) out=example.ollama.provider.yml ;;
    bedrock) out=example.bedrock.provider.yml ;;
  esac
  [ -f "$out" ] || curl -fL -o "$out" "https://raw.githubusercontent.com/vxcontrol/pentagi/main/examples/configs/$f.provider.yml"
done
[ -f .env ] || curl -fL -o .env https://raw.githubusercontent.com/vxcontrol/pentagi/main/.env.example

SALT=$(head -c 32 /dev/urandom | od -An -tx1 | tr -d ' \n')
PGPASS=$(head -c 16 /dev/urandom | od -An -tx1 | tr -d ' \n')

echo "== [3/5] API Key"
printf "粘贴大模型 API Key（可回车跳过，之后在界面里配）："
stty -echo 2>/dev/null || true
read -r KEY
stty echo 2>/dev/null || true
echo

echo "== [4/5] 生成 .env"
set_kv() {
  if grep -q "^$1=" .env; then sed -i "s|^$1=.*|$1=$2|" .env; else printf '\n%s=%s\n' "$1" "$2" >> .env; fi
}
set_kv PENTAGI_LISTEN_IP "0.0.0.0"
set_kv PENTAGI_LISTEN_PORT "$PORT"
set_kv PUBLIC_URL "https://$IP:$PORT"
set_kv CORS_ORIGINS "https://$IP:$PORT,https://localhost:$PORT"
set_kv COOKIE_SIGNING_SALT "$SALT"
set_kv PENTAGI_POSTGRES_PASSWORD "$PGPASS"
set_kv DUCKDUCKGO_ENABLED "true"
set_kv DOCKER_PUBLIC_IP "$IP"
# 避开宿主机已占用的 5432 / 9187 / 9443
set_kv PGVECTOR_LISTEN_PORT "15432"
set_kv POSTGRES_EXPORTER_LISTEN_PORT "19187"
set_kv SCRAPER_LISTEN_PORT "19443"
[ -n "$KEY" ] && set_kv DEEPSEEK_API_KEY "$KEY"

echo "== [5/5] 拉镜像并启动（首次 2-3 GB）"
docker compose pull
docker compose up -d
docker compose ps

echo
echo "打开：https://$IP:$PORT （自签证书，继续访问）"
echo "默认账号：admin@pentagi.com / admin —— 登录后立刻改密码"
echo "停：cd $DIR && docker compose down    删除：docker compose down -v && rm -rf $DIR"
