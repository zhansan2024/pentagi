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
- 右下角 **EN / 中文** 按钮随时切换，选择记在浏览器 `localStorage`
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

## 兼容性

- 针对 PentAGI **2.2.x（CE）** 的前端结构编写，2.1.x 大体可用，更早版本未验证
- 升级镜像后前端文件会被替换，需要重跑一次 `apply-zh.sh`
- 与上游项目无隶属关系，仅为社区汉化

## 免责声明

PentAGI 会在沙箱中执行真实攻击命令。**仅可用于你拥有书面授权的目标**。未经授权使用可能违法，后果由使用者承担。

## License

- 代码与脚本（`i18n/`、`scripts/`）：MIT
- 手册（`docs/`）：CC BY 4.0，转载保留出处
