# PentAGI 简体中文包 & 中文使用手册

给自托管的 [PentAGI](https://github.com/vxcontrol/pentagi) 加简体中文界面，并附一份从部署到出报告的完整中文手册。

PentAGI 官方目前**没有**中文界面，也没有中文文档（2026-10 时为 2.2.x）。这个仓库用「前端覆盖层」的方式补上界面中文：不改镜像、不改数据库、可随时关闭。

## 包含内容

```
docs/
  PentAGI中文使用手册-v2.2.docx    # 手册源文件（可编辑）
  PentAGI中文使用手册-v2.2.pdf     # 手册 PDF（9 页）
i18n/
  i18n-zh.js                       # 翻译脚本（三层策略）
scripts/
  apply-zh.sh                      # 一键安装/更新语言包
  install-pentagi.sh               # compose 方式安装 PentAGI（国内网络更稳）
```

## 语言包能做什么

- 侧边栏、仪表盘、任务流、模板、资源库、知识库、设置全量中文
- 表单标签、输入框占位符（含 TipTap 编辑器的 `data-placeholder`）、校验报错、确认对话框
- Agent 角色名（Adviser / Coder / Enricher / Pentester / Searcher …）
- 动态文案：`6 results` → `6 条结果`、`2 hours ago` → `2 小时前`
- 语言切换：**设置页左侧「🌐 语言：中文」**，或快捷键 **Alt+L**；选择记在浏览器 `localStorage`
- 脚本文件名带版本号（如 `i18n-zh-v4.js`），升级后会自动绕开浏览器缓存
- 三层翻译：整句精确表 → 句式规则 → 词级兜底，新文案也能拼出大意

**不会翻译**（也不该翻译）：模型名、服务商 ID、Agent 生成的分析正文。

## 安装语言包

前提：PentAGI 已用 Docker / Compose 跑起来。

```sh
sudo sh scripts/apply-zh.sh
# 或指定目录/容器名
sudo PENTAGI_DIR=/opt/pentagi PENTAGI_CONTAINER=pentagi sh scripts/apply-zh.sh
```

脚本会：

1. 从容器导出前端静态文件到 `$PENTAGI_DIR/fe-zh`
2. 在 `index.html` 注入 `<script src="/i18n-zh.js">`
3. 写入 `docker-compose.override.yml`，把 `fe-zh` 挂载到 `/opt/pentagi/fe`
4. 重启容器

打开 `https://<服务器>:8443`，强制刷新（Ctrl+Shift+R）。

### 更新词表（热更新）

直接改 `$PENTAGI_DIR/fe-zh/i18n-zh.js`，浏览器强刷即可，**不用重启容器**。
如果改动没生效，复制成新文件名（如 `i18n-zh-v5.js`）并把 `index.html` 的 `<script src>` 指过去，可绕过浏览器缓存。

### 卸载

```sh
rm $PENTAGI_DIR/docker-compose.override.yml
cd $PENTAGI_DIR && docker compose up -d
```

## 安装 PentAGI（可选）

官方安装器从 `pentagi.com` 下载，国内常见 1–2 KB/s；用 compose 只需 Docker Hub，通常快得多。

```sh
sudo sh scripts/install-pentagi.sh
```

脚本会下载 compose 文件、生成随机密码、把监听地址设为 `0.0.0.0:8443`，并把容易和宿主机冲突的端口改掉：

| 服务 | 默认 | 脚本使用 |
|---|---|---|
| PostgreSQL (pgvector) | 5432 | 15432 |
| pgexporter | 9187 | 19187 |
| scraper | 9443 | 19443 |

> 容器之间走 docker 网络（`pgvector:5432`），改宿主机映射不影响功能。

## 中文手册

`docs/PentAGI中文使用手册-v2.2.pdf`（9 页），覆盖：

1. 能力边界
2. 部署架构与资源要求
3. 安装（安装器 / compose）
4. 登录与界面导览
5. 配置模型服务商（内置 13 家 + 自定义 OpenAI 兼容端点）
6. 跑第一个任务流
7. 模板 / 资源库 / 知识库
8. 报告与导出
9. 日常运维（启停、升级、备份、日志）
10. 安全与合规
11. 常见问题
附录：环境变量、默认端口、参考链接

## 预设模板汉化

PentAGI 内置的 11 个「预设模板」硬编码在前端打包产物里，不是数据库数据，运行时翻译只能改显示、不能改填充内容。仓库提供 `scripts/patch-presets-zh.cjs` 直接改包：

```sh
FE_DIR=/vol3/1000/opencode生成文件/pentagi-zh/fe-zh \
SRC_TSX=/tmp/pentagi/frontend/src/pages/templates/template.tsx \
node scripts/patch-presets-zh.cjs
```

翻译表在同目录 `presets-zh.json`。脚本会生成 `template-zh1.js` / `index-zh1.js` 并改写 `index.html`，浏览器强刷即可。

## 模型接入提示（OpenCode Go）

用 OpenCode 的推理接口接 PentAGI 时注意两点：

- Base URL 用 `https://opencode.ai/inference/v1`（带 `/openai` 会导致 `/models` 404，界面显示 No model found）
- Go 订阅只覆盖 OpenCode 自家客户端；外部调 `/inference` 仍按量计费，余额为 0 会返回 `402 Insufficient account funds`，需在 Console → Extra usage 充值
- 带 `-free` 后缀的模型外部调用返回 403

## 长期同步（两个仓库）

本仓库同时推 GitHub 和 Gitea。Gitea 用令牌存文件的方式，配一次以后不用再输入：

```sh
# 1. 在 Gitea → 设置 → 应用 → 生成令牌，权限选 repository 读写
# 2. 存到持久盘（权限 600）
mkdir -p /home/opencode/workspace/.secrets
read -rsp "Gitea Token: " T; echo
printf '%s' "$T" > /home/opencode/workspace/.secrets/gitea-token
chmod 600 /home/opencode/workspace/.secrets/gitea-token; unset T

# 3. 让本仓库自动读取（只需一次）
git config --local credential.helper '!f() { echo username=gitadmin; echo "password=$(cat /home/opencode/workspace/.secrets/gitea-token)"; }; f'

# 4. 以后一条命令同步两边
./sync.sh "更新说明"
```

GitHub 用 Deploy key（私钥默认 `/root/.ssh/github_pentagi`）。令牌与私钥都不进仓库（`.secrets/` 已在 .gitignore）。

## 兼容性

- 针对 PentAGI **2.2.x（CE）** 的前端结构编写，2.1.x 大体可用，更早版本未验证
- 升级镜像后前端文件会被替换，需要重跑一次 `apply-zh.sh`
- 与上游项目无隶属关系，仅为社区汉化

## 免责声明

PentAGI 会在沙箱中执行真实攻击命令。**仅可用于你拥有书面授权的目标**。未经授权使用可能违法，后果由使用者承担。

## License

- 代码与脚本（`i18n/`、`scripts/`）：MIT
- 手册（`docs/`）：CC BY 4.0，转载保留出处
