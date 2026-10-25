#!/bin/sh
# 一键同步到 GitHub（zh-pack 分支）和 Gitea（main 分支）
# Gitea 令牌从持久盘读取，首次配置见 README「长期同步」
set -e
cd "$(dirname "$0")"
TOKEN_FILE="${GITEA_TOKEN_FILE:-/home/opencode/workspace/.secrets/gitea-token}"
MSG="${1:-同步更新 $(date '+%F %H:%M')}"

git add -A
if git diff --cached --quiet; then
  echo "没有变更，跳过提交"
else
  git -c user.name="${GIT_USER_NAME:-gitadmin}" -c user.email="${GIT_USER_EMAIL:-gitadmin@nas.local}" commit -m "$MSG"
fi

echo "== 推送 GitHub (zh-pack)"
GIT_SSH_COMMAND="ssh -i ${GITHUB_DEPLOY_KEY:-/root/.ssh/github_pentagi} -o IdentitiesOnly=yes" \
  git push github HEAD:refs/heads/zh-pack

echo "== 推送 Gitea (main)"
if [ -f "$TOKEN_FILE" ]; then
  git -c credential.helper="!f() { echo username=gitadmin; echo password=\$(cat $TOKEN_FILE); }; f" \
    push origin HEAD:refs/heads/main
else
  echo "跳过：缺少 $TOKEN_FILE（见 README「长期同步」）"
fi
