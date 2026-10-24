#!/bin/sh
# PentAGI 简体中文语言包 —— 一键安装
# 原理：不改镜像、不改数据库，只把前端的 index.html + 翻译脚本挂载进容器。
#
# 用法：
#   sudo sh apply-zh.sh                 # 自动找 /opt/pentagi
#   sudo PENTAGI_DIR=/path/to/pentagi sh apply-zh.sh
set -e

SRC="$(cd "$(dirname "$0")" && pwd)"
DIR="${PENTAGI_DIR:-/opt/pentagi}"
CONTAINER="${PENTAGI_CONTAINER:-pentagi}"
FE="$DIR/fe-zh"

echo "== [1/4] 检查"
command -v docker >/dev/null 2>&1 || { echo "需要 docker"; exit 1; }
docker inspect "$CONTAINER" >/dev/null 2>&1 || { echo "找不到容器 $CONTAINER（用 PENTAGI_CONTAINER=名字 指定）"; exit 1; }
[ -d "$DIR" ] || { echo "找不到 compose 目录 $DIR（用 PENTAGI_DIR=路径 指定）"; exit 1; }
I18N="$SRC/i18n-zh.js"
[ -f "$I18N" ] || I18N="$SRC/../i18n/i18n-zh.js"
[ -f "$I18N" ] || { echo "缺 i18n-zh.js"; exit 1; }

echo "== [2/4] 导出前端并注入脚本 → $FE"
rm -rf "$FE"
docker cp "$CONTAINER:/opt/pentagi/fe" "$FE"
cp "$I18N" "$FE/i18n-zh.js"
if ! grep -q 'i18n-zh.js' "$FE/index.html"; then
  sed -i 's#</body>#  <script src="/i18n-zh.js"></script>\n</body>#' "$FE/index.html"
fi
chmod -R a+rX "$FE"

echo "== [3/4] 写 compose 覆盖"
cat > "$DIR/docker-compose.override.yml" <<EOF
services:
  pentagi:
    volumes:
      - ./fe-zh:/opt/pentagi/fe:ro
EOF

echo "== [4/4] 重启"
cd "$DIR"
docker compose up -d
sleep 3
docker compose ps

echo
echo "完成：浏览器 Ctrl+Shift+R 打开 https://<服务器>:8443"
echo "右下角有 EN/中文 切换按钮，选择记在浏览器 localStorage。"
echo
echo "热更新：改 ./fe-zh/i18n-zh.js 后强刷浏览器即可，无需重启。"
echo "卸载：rm $DIR/docker-compose.override.yml && cd $DIR && docker compose up -d"
