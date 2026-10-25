/*!
 * PentAGI 简体中文语言包 v2（DOM 覆盖层）
 * 三层策略：整句精确表 → 句式规则 → 词级兜底
 * 不改镜像、不改数据库；撤销：删掉 docker-compose.override.yml 重启即可。
 */
(function () {
  'use strict';
  if (window.__pentagiZhLoaded) return;
  // URL 参数：?lang=zh / ?lang=en 设定语言后重载；?nolang=1 停用
  try {
    const m = location.search.match(/[?&]lang=(zh|en)(?:&|$)/);
    if (m) {
      localStorage.setItem('pentagi-lang', m[1]);
      location.replace(location.pathname + location.hash);
      return;
    }
  } catch (e) { /* 忽略 */ }

  // 紧急开关：URL 带 ?nolang=1 时完全停用翻译（并记住），便于排查
  try {
    if (/(?:^|[?&])nolang=1(?:&|$)/.test(location.search)) {
      localStorage.setItem("pentagi-lang", "off");
      return;
    }
  } catch (e) { /* 忽略 */ }
  window.__pentagiZhLoaded = true;

  /* ========== 1. 整句精确表 ========== */
  const PHRASES = {
    // 侧边栏 / 导航
    'Dashboard': '仪表盘', 'Flows': '任务流', 'Templates': '模板', 'Knowledges': '知识库',
    'Resources': '资源库', 'Settings': '设置', 'Assistant': '助手', 'Assistants': '助手',
    'Account': '账户', 'Providers': '模型服务商', 'Provider': '模型服务商',
    'Prompts': '提示词', 'API Tokens': 'API 令牌', 'Tokens': '令牌',
    'Log out': '退出登录', 'Logout': '退出登录', 'Sign in': '登录', 'Back to App': '返回应用',
    'Toggle Sidebar': '收起/展开侧栏', 'Open menu': '打开菜单', 'Open details': '查看详情',
    'Hide details': '收起详情', 'Show details': '展开详情', 'Menu': '菜单',
    'Account menu': '账户菜单', 'Toggle favorite': '收藏/取消收藏',
    'System theme': '跟随系统', 'Light theme': '浅色主题', 'Dark theme': '深色主题',

    // 通用动作
    'Create': '创建', 'Save': '保存', 'Cancel': '取消', 'Delete': '删除', 'Edit': '编辑',
    'Update': '更新', 'Reset': '重置', 'Reset All': '全部重置', 'Apply': '应用',
    'Close': '关闭', 'Copy': '复制', 'Copy Token': '复制令牌', 'Copy Token ID': '复制令牌 ID',
    'Copy token ID': '复制令牌 ID', 'Copy to clipboard': '复制到剪贴板',
    'Download MD': '下载 Markdown', 'Download PDF': '下载 PDF',
    'Retry': '重试', 'Try again': '重试', 'Refresh': '刷新', 'Refresh listing': '刷新列表',
    'Rename': '重命名', 'Default': '默认', 'Custom': '自定义', 'Unknown': '未知',
    'Test': '测试', 'Discard': '放弃', 'Deleting...': '删除中…', 'Resetting...': '重置中…',
    'Saving...': '保存中…', 'Loading...': '加载中…', 'Saving': '保存中',
    'Create Token': '创建令牌', 'Create directory': '新建目录', 'New folder': '新建文件夹',
    'New flow': '新建任务流', 'New Flow': '新建任务流', 'New knowledge': '新建知识',
    'New Knowledge': '新建知识', 'New template': '新建模板', 'New Template': '新建模板',
    'New assistant': '新建助手', 'Create new assistant': '新建助手',
    'Upload file': '上传文件', 'Upload files': '上传文件', 'Upload here': '上传到此处',
    'Clear search': '清除搜索', 'Clear filter': '清除筛选', 'Reset filters': '重置筛选',
    'Search…': '搜索…', 'Search...': '搜索…', 'Search': '搜索',
    'Close': '关闭', 'Dismiss dialog': '关闭对话框', 'Dismiss sheet': '关闭面板',
    'Start': '开始', 'Stop': '停止', 'Finish': '结束', 'Delete flow': '删除任务流',

    // 状态
    'Created': '已创建', 'Running': '运行中', 'Waiting': '等待中', 'Pending': '等待中',
    'Completed': '已完成', 'Failed': '失败', 'Stopped': '已停止', 'Finished': '已结束',
    'Active': '进行中', 'Inactive': '未启用', 'Enabled': '已启用', 'Disabled': '已停用',
    'Valid': '有效', 'Invalid': '无效', 'Expired': '已过期',

    // 登录 / 账户
    'Enter your email': '输入邮箱', 'Enter your password': '输入密码',
    'Email address': '邮箱地址', 'Password': '密码', 'Current Password': '当前密码',
    'New Password': '新密码', 'Confirm New Password': '确认新密码',
    'Enter your current password': '输入当前密码', 'Enter your new password': '输入新密码',
    'Confirm your new password': '再次输入新密码', 'Update Password': '更新密码',
    'Update Email': '更新邮箱', 'Update Name': '更新名称', 'New Email': '新邮箱',
    'Enter your new email address': '输入新邮箱地址', 'Display name': '显示名称',
    'Enter your display name': '输入显示名称', 'Skip for now': '暂时跳过',
    'Change your account password.': '修改账户密码。',
    'The name shown across the app.': '在应用中显示的名称。',
    'You need to change your password before continuing.': '继续前需要先修改密码。',
    'Nothing readable here': '这里没有可读内容',

    // 对话框
    'Unsaved changes': '未保存的更改',
    'You have unsaved changes on this page. Would you like to save them before leaving?': '本页有未保存的更改，离开前要保存吗？',
    'This cannot be undone.': '此操作不可撤销。',
    'Are you sure?': '确定吗？',
    'Something went wrong': '出错了',
    'Couldn\'t load': '加载失败',

    // 任务流
    'Flow': '任务流', 'Flow title': '任务流标题', 'Flow actions': '任务流操作',
    'Flow Execution Details': '任务流执行详情', 'Recent Flows': '最近任务流',
    'Favorite Flows': '收藏的任务流', 'No flows found': '没有任务流',
    'Create a new flow': '新建任务流',
    'Describe what you would like PentAGI to test': '描述你想让 PentAGI 测试什么',
    'Get started by creating your first conversation flow': '从创建第一个任务流开始',
    'Please wait while we fetch your conversation flows': '正在加载任务流…',
    'Loading flows...': '正在加载任务流…',
    'Error loading flows': '加载任务流失败', 'Error loading flow': '加载任务流失败',
    'Flow not found': '任务流不存在',

    // 任务 / Agent
    'Tasks': '任务', 'Subtasks': '子任务', 'Tasks not found': '没有任务',
    'No available tasks': '没有可执行任务',
    'No tasks found for this flow': '该任务流暂无任务',
    'Tasks will appear here once the agent starts working': 'Agent 开始工作后，任务会显示在这里',
    'Filter tasks': '筛选任务', 'Agent Type': 'Agent 类型', 'Agent logs': 'Agent 日志',
    'No agent logs found': '没有 Agent 日志', 'No agent logs available': '暂无 Agent 日志',
    'Agent logs will appear here when agents are working': 'Agent 工作时日志会显示在这里',
    'Adviser': '顾问 Agent', 'Assistant': '助手 Agent', 'Coder': '编码 Agent',
    'Enricher': '信息补全 Agent', 'Generator': '生成 Agent', 'Installer': '安装 Agent',
    'Pentester': '渗透 Agent', 'Searcher': '检索 Agent', 'Memorist': '记忆 Agent',
    'Refiner': '优化 Agent', 'Primary': '主 Agent', 'Subordinate': '从属 Agent',
    'Reporter': '报告 Agent', 'Planner': '规划 Agent', 'Reflector': '纠偏 Agent',
    'Summarizer': '摘要 Agent', 'Tool Call': '工具调用', 'Tool Calls': '工具调用',

    // 报告 / 指标
    'Report': '报告', 'Screenshots': '截图', 'Terminal': '终端',
    'No screenshots available': '暂无截图',
    'Screenshots will appear here once the agent captures them': 'Agent 截图后会显示在这里',
    'No terminal logs found': '没有终端日志', 'Tool name': '工具名称',
    'Tool Calls by Function': '按工具函数统计调用', 'Total Cost': '总成本',
    'Total Flows': '任务流总数', 'Total Tokens': 'Token 总量', 'Total Duration': '总时长',
    'Avg Duration': '平均时长', 'Tokens In': '输入 Token', 'Tokens Out': '输出 Token',
    'Cache In': '缓存读 Token', 'Cache Out': '缓存写 Token', 'Cost In': '输入成本',
    'Cost Out': '输出成本', 'Input + Output tokens': '输入 + 输出 Token',
    'Input + Output tokens processed': '已处理输入 + 输出 Token',
    'Total LLM spending across all providers': '所有服务商的 LLM 总花费',
    'Usage by Provider': '按服务商用量', 'Usage by Model': '按模型用量',
    'Usage by Agent Type': '按 Agent 类型用量', 'Usage by Model & Provider': '按模型与服务商用量',
    'Flows, tasks, and subtasks created per day': '每日创建的任务流、任务与子任务',
    'Flows Activity Over Time': '任务流活跃度趋势', 'Tool Calls Over Time': '工具调用趋势',
    'Token Usage Over Time': 'Token 用量趋势', 'Cost Over Time': '成本趋势',
    'Select a flow to view the dashboard': '选择一个任务流查看仪表盘',
    'No data for this period': '该时间段没有数据',
    'Error Loading Report': '报告加载失败', 'Error loading report': '报告加载失败',
    'Open web view': '打开网页视图', 'Row actions': '行操作', 'Rows per page': '每页行数',
    'No matches': '无匹配结果', 'No results.': '无结果。', 'No data': '暂无数据',
    'First page': '第一页', 'Previous page': '上一页', 'Next page': '下一页', 'Last page': '最后一页',

    // 知识库 / 资源库
    'Knowledge': '知识库', 'Knowledge Documents': '知识文档',
    'No knowledge documents yet': '暂无知识文档',
    'Error loading knowledge documents': '加载知识文档失败',
    'Knowledge question': '知识问题',
    'Knowledge content (will be embedded into the vector store)': '知识内容（会写入向量库）',
    'Short title or question this document answers': '简短标题或本文回答的问题',
    'Optional short description': '可选简短描述', 'Description (optional)': '描述（可选）',
    'Document type': '文档类型', 'Guide type': '指南类型', 'Answer type': '答案类型',
    'Code language': '代码语言', 'Select type': '选择类型',
    'Select guide type': '选择指南类型', 'Select answer type': '选择答案类型',
    'Resource library is empty': '资源库为空', 'No resources yet': '暂无资源',
    'Error loading resources': '加载资源失败',
    'Upload resources first to attach them to a flow.': '先上传资源，才能挂到任务流上。',
    'Attach resources': '挂载资源', 'Delete resource': '删除资源',
    'No resources match': '没有匹配的资源',

    // 设置：服务商
    'Create Provider': '新建服务商', 'Create a new provider': '新建服务商',
    'Configure a new language model provider': '配置一个新的语言模型服务商',
    'Type': '类型', 'Name': '名称', 'Reasoning Configuration': '推理配置',
    'Reasoning Mode': '推理模式', 'Reasoning Effort': '推理强度',
    'Reasoning Max Tokens': '推理最大 Token', 'Off (no thinking)': '关闭（不思考）',
    'Select reasoning mode': '选择推理模式', 'Select effort level (optional)': '选择强度（可选）',
    'Provider Test Results': '服务商测试结果', 'No tests available for this agent': '该 Agent 暂无测试结果',
    'Price Configuration': '价格配置', 'Extra Body': '附加请求参数', 'Max Tokens': '最大 Token',
    'Min Length': '最小长度', 'Max Length': '最大长度', 'Repetition Penalty': '重复惩罚',
    'Frequency Penalty': '频率惩罚', 'The type of language model provider': '模型服务商类型',
    'Select provider': '选择服务商',
    'A unique name for your provider configuration': '给该服务商配置起一个唯一名称',
    'Enter provider name': '输入服务商名称', 'Select or enter model name': '选择或输入模型名称',
    'Loading provider data...': '正在加载服务商配置…',
    'Error loading provider data': '加载服务商配置失败',
    'API Token Created': 'API 令牌已创建', 'No API tokens configured': '尚未配置 API 令牌',
    'Token name (optional)': '令牌名称（可选）', 'Token ID': '令牌 ID', 'Token status': '令牌状态',
    'Developer tools': '开发者工具', 'GraphQL Playground': 'GraphQL 调试台',
    'Swagger UI': '接口文档 (Swagger)',

    // 提示词
    'System Prompt': '系统提示词', 'Human Prompt': '用户提示词',
    'System prompt template': '系统提示词模板', 'Human prompt template': '用户提示词模板',
    'Enter the human prompt template...': '输入用户提示词模板…', 'Edit Prompt': '编辑提示词',
    'Edit prompt': '编辑提示词', 'Prompt actions': '提示词操作', 'Prompt Templates': '提示词模板',
    'Prompt templates could not be loaded': '提示词模板加载失败',
    'System and human prompts for AI agents': 'Agent 的系统与用户提示词',
    'Prompt templates for system tools and utilities': '系统工具与组件的提示词模板',
    'Manage system and custom prompt templates': '管理内置与自定义提示词模板',
    'Reset Prompt': '重置提示词', 'Reset System': '重置系统提示词',
    'Reset Human': '重置用户提示词', 'Validation Results': '校验结果',
    'Changes between current value and default template.': '当前值与默认模板的差异。',

    // 文件 / 容器
    'Container path': '容器路径', 'Pull from container': '从容器拉取',
    'Pull file or directory from container': '从容器拉取文件或目录',
    'Container is not running': '容器未运行', 'Failed to list container': '读取容器目录失败',
    'Directory is empty': '目录为空', 'No matching paths': '没有匹配路径',
    'Nothing to pull from': '没有可拉取的内容', 'No files in cache': '缓存中没有文件',
    'No files match': '没有匹配的文件', 'Drop files to upload': '拖拽文件到此处上传',
    'Parent directory': '上级目录', 'File tree': '文件树', 'Image URL': '图片地址',
    'Alt text (optional)': '替代文字（可选）', 'Link URL': '链接地址',

    // 空状态 / 提示
    'Try adjusting your search or filter parameters': '试试调整搜索或筛选条件',
    'Nothing here yet': '还没有内容', 'No messages': '暂无消息', 'No messages found': '没有消息',
    'No messages found for this assistant': '该助手暂无消息',
    'Type a message below to create a new assistant...': '在下方输入消息以创建新助手…',
    'Select assistant': '选择助手', 'No active tasks': '没有进行中的任务',
    'No assistants found.': '没有助手', 'Templates and resources': '模板与资源',
    'Vector Store': '向量库', 'Use Agents': '启用多 Agent',
    'Enable multi-agent collaboration for complex tasks': '复杂任务启用多 Agent 协作',
    'Creating assistant...': '正在创建助手…',
    'Please wait while we set up your new assistant': '正在准备新助手，请稍候',
    'Upload failed': '上传失败', 'Source URL': '来源地址',
    'Folders first': '文件夹优先', 'Relative dates': '相对时间',
    'Column settings': '列设置', 'Delete Assistant': '删除助手',
    'Previous match': '上一个匹配', 'Next match': '下一个匹配',
    'Primary Agent': '主 Agent', 'Simple': '简单任务', 'Simple Json': '简单 JSON',
    'Searches': '搜索', 'Duration': '时长', 'Subtasks': '子任务',
    "Starting a new task may take some time as the PentAGI agent downloads the required Docker image": "新任务启动可能需要一点时间，PentAGI 的 Agent 正在下载所需的 Docker 镜像。",
    "The flow is starting...": "任务流正在启动…",
    "The flow is starting": "任务流正在启动",

    'Upload files to make them available at /work/uploads, or use Pull to sync files from the running container. You can also drag & drop files here.': '上传文件后会出现在 /work/uploads，也可以用「拉取」从运行中的容器同步文件，还支持直接拖拽到此处。',
    'This flow has ended. Create a new one to continue.': '该任务流已结束，新建一个继续。',
    'No vector store logs available': '暂无向量库日志',
    'No vector store logs found': '没有向量库日志',
    'No search logs available': '暂无搜索日志',
    'No search logs found': '没有搜索日志',

    'Base URL': '接口地址', 'API Key': 'API 密钥', 'API Keys': 'API 密钥',
    'Model': '模型', 'Models': '模型', 'Advanced': '高级', 'Default': '默认', 'Clone': '克隆',
    'Test connection': '测试连接', 'Add': '添加', 'Enabled': '已启用', 'Disabled': '已停用',


    'Local': '本地账号', 'Theme': '主题', 'Profile': '个人资料',
    'Local account': '本地账号', 'Local Account': '本地账号',


    // 版本面板 / 排序 / 编辑器
    'Size': '大小', 'Modified': '修改时间', 'All releases': '全部版本',
    'Preview': '预览版', 'Installed': '已安装', 'build': '构建',
    'Update status unknown': '更新状态未知',
    'The update service could not be reached, so it is unknown whether a newer version exists.': '无法连接更新服务，因此无法确认是否有新版本。',
    'Last check failed': '上次检查失败',
    'Upload documents so PentAGI agents can reference them during your flows. You can also drag & drop files anywhere in this panel.': '上传文档，PentAGI 的 Agent 在任务流中可以引用；也可以把文件拖拽到这个面板任意位置。',
    'You can also drag & drop files anywhere in this panel.': '也可以把文件拖拽到这个面板任意位置。',
    'Question': '问题',
    'What would you like me to help you with?': '你想让我帮你做什么？',
    'Add a title and content, or start from a preset.': '添加标题和内容，或从预设开始。',
    'A short name for this template': '该模板的简短名称',
    'Preset templates': '预设模板',
    'Create your first API token to access PentAGI programmatically': '创建第一个 API 令牌，以便通过接口程序化访问 PentAGI',
    'Describe the task, or start from a preset': '描述任务，或从预设开始',
    'Execution time and tool calls breakdown per flow': '每个任务流的执行时长与工具调用明细',
    'No flow executions in this period': '该时间段没有任务流执行记录',
    'LLM spending per day. May stay near zero when using local engines — this is expected.': '每日 LLM 花费。使用本地模型时可能接近 0，属正常现象。',

    // 图表副标题 / 空状态 / 上传提示
    'Analytics': '分析', 'Automation': '自动化', 'Anonymize': '匿名化',
    'Week': '周', 'Month': '月', 'Quarter': '季度',
    'Function': '函数', 'Count': '次数', 'Question': '问题',
    'LLM token usage and costs grouped by provider': '按服务商统计的 LLM Token 用量与成本',
    'LLM token usage and costs grouped by model': '按模型统计的 LLM Token 用量与成本',
    'LLM token usage and costs grouped by agent type': '按 Agent 类型统计的 LLM Token 用量与成本',
    'Execution statistics for each tool function': '各工具函数的执行统计',
    'Number of tool executions per day': '每日工具执行次数',
    'Input and output tokens processed daily': '每日处理的输入与输出 Token',
    'LLM spending for this flow': '该任务流的 LLM 花费',
    'Execution statistics per tool function in this flow': '该任务流中各工具函数的执行统计',
    'LLM token usage and costs per agent type in this flow': '该任务流中按 Agent 类型的 Token 用量与成本',
    'No templates yet': '暂无模板',
    'No providers configured': '尚未配置服务商',
    'Get started by adding your first language model provider': '添加第一个语言模型服务商开始使用',
    'Create your first template to get started': '创建第一个模板开始使用',
    'Create your first knowledge document to enrich the vector store': '创建第一个知识文档，充实向量库',
    'Add an entry to the vector knowledge base': '向向量知识库添加一条记录',
    'Upload documents so PentAGI agents can reference them during your flows.': '上传文档，PentAGI 的 Agent 在任务流中可以引用。',
    'You can also drag & drop files anywhere in this panel.': '也可以把文件拖拽到这个面板任意位置。',
    'Up to 300 MB per file · 2 GB per upload': '单文件最大 300 MB · 单次上传最大 2 GB',
    'Optional short description': '可选简短描述',
    'Knowledge content (will be embedded into the vector store)': '知识内容（会写入向量库）',
    'Describe what you would like PentAGI to test...': '描述你想让 PentAGI 测试的内容…',
    'Describe what you would like PentAGI to test': '描述你想让 PentAGI 测试的内容',
    'Search resources...': '搜索资源…',
    'Search files...': '搜索文件…',
    'Search tasks...': '搜索任务…',
    'Search assistants...': '搜索助手…',
  };

  /* ========== 2. 句式规则 ========== */
  const RULES = [
    [/^Create a new (.+)$/i, (m, a) => `新建${tr(a)}`],
    [/^(.+) is required$/i, (m, a) => `${tr(a)}为必填项`],
    [/^(.+) is invalid$/i, (m, a) => `${tr(a)}无效`],
    [/^(.+) must be at least (\d+) characters?$/i, (m, a, n) => `${tr(a)}至少 ${n} 个字符`],
    [/^(.+) must be at most (\d+) characters?$/i, (m, a, n) => `${tr(a)}最多 ${n} 个字符`],
    [/^Failed to (.+)$/i, (m, a) => `${tr(a)}失败`],
    [/^Error (.+)$/i, (m, a) => `${tr(a)}出错`],
    [/^Enter your (.+)$/i, (m, a) => `输入${tr(a)}`],
    [/^Enter (.+)$/i, (m, a) => `输入${tr(a)}`],
    [/^Select (.+)$/i, (m, a) => `选择${tr(a)}`],
    [/^No (.+) found$/i, (m, a) => `没有${tr(a)}`],
    [/^No (.+) available$/i, (m, a) => `暂无${tr(a)}`],
    [/^Search (.+)\.\.\.$/i, (m, a) => `搜索${tr(a)}…`],
    [/^Clear (.+) search$/i, (m, a) => `清除${tr(a)}搜索`],
    [/^Scroll to latest (.+)$/i, (m, a) => `滚动到最新${tr(a)}`],
    [/^(.+) will appear here.*$/i, (m, a) => `${tr(a)}会显示在这里`],
    [/^Delete (.+)$/i, (m, a) => `删除${tr(a)}`],
    [/^Copy (.+)$/i, (m, a) => `复制${tr(a)}`],
    [/^Download (.+)$/i, (m, a) => `下载${tr(a)}`],
    [/^Insert (.+)$/i, (m, a) => `插入${tr(a)}`],
    [/^Toggle (.+)$/i, (m, a) => `切换${tr(a)}`],
    [/^Show (.+)$/i, (m, a) => `显示${tr(a)}`],
    [/^Hide (.+)$/i, (m, a) => `隐藏${tr(a)}`],
    [/^(\d+) results?$/, '$1 条结果'],
    [/^(\d+) flows?$/, '$1 个任务流'],
    [/^(\d+) tasks?$/, '$1 个任务'],
    [/^(\d+) findings?$/, '$1 个发现'],
    [/^Flow #?(\d+)$/, '任务流 #$1'],
    [/^(\d+) of (\d+)$/, '$1 / $2'],
    [/^Showing (\d+)-(\d+) of (\d+)$/, '显示第 $1-$2 条，共 $3 条'],
    [/^Last (\d+) days?$/, '最近 $1 天'],
    [/^Last (\d+) hours?$/, '最近 $1 小时'],
    [/^Last (\d+) minutes?$/, '最近 $1 分钟'],
    [/^(\d+) minutes? ago$/, '$1 分钟前'],
    [/^(\d+) hours? ago$/, '$1 小时前'],
    [/^(\d+) days? ago$/, '$1 天前'],
    [/^(\d+) seconds? ago$/, '$1 秒前'],
    [/^No (.+) yet$/i, (m, a) => `暂无${tr(a)}`],
    [/^No (.+) configured$/i, (m, a) => `尚未配置${tr(a)}`],
    [/^Get started by (.+)$/i, (m, a) => `${tr(a)}，开始使用`],
    [/^Create your first (.+) to get started$/i, (m, a) => `创建第一个${tr(a)}开始使用`],
    [/^Add an entry to (.+)$/i, (m, a) => `向${tr(a)}添加一条记录`],
    [/^Up to (\d+) MB per file (?:·|-) (\d+) GB per upload$/i, (m, a, b) => `单文件最大 ${a} MB · 单次上传最大 ${b} GB`],
    [/^Tasks: (.+) (?:·|-) Subtasks: (.+) (?:·|-) Assistants: (.+)$/i, (m, a, b, c) => `任务：${a} · 子任务：${b} · 助手：${c}`],
    [/^LLM token usage and costs grouped by (.+)$/i, (m, a) => `按${tr(a)}统计的 LLM Token 用量与成本`],
    [/^(.+) per day$/i, (m, a) => `每日${tr(a)}`],
    [/^(\d+) MB per file$/i, '$1 MB / 文件'],
    [/^Subtasks: (.+) · Assistants: (.+)$/i, (m, a, b) => `子任务：${a} · 助手：${b}`],
    [/^Duration: (.+)$/i, (m, a) => `时长：${a}`],
    [/^Searches: (.+)$/i, (m, a) => `搜索：${a}`],

    [/^Upload files to make them available.*$/i, () => '上传文件后会出现在 /work/uploads，也可以用「拉取」从运行中的容器同步文件，还支持直接拖拽到此处。'],
    [/^Provider type ["“'](.+)["”'] is not available$/i, (m, a) => `服务商类型「${a}」未启用（需在 .env 配置对应 API Key 后重启）`],
  ];

  /* ========== 3. 词级兜底 ========== */
  const WORDS = {
    // 名词
    provider: '服务商', providers: '服务商', model: '模型', models: '模型', type: '类型',
    name: '名称', value: '值', values: '值', field: '字段', fields: '字段',
    flow: '任务流', flows: '任务流', task: '任务', tasks: '任务', subtask: '子任务',
    subtasks: '子任务', agent: 'Agent', agents: 'Agent', assistant: '助手', assistants: '助手',
    report: '报告', reports: '报告', screenshot: '截图', screenshots: '截图',
    terminal: '终端', terminals: '终端', tool: '工具', tools: '工具',
    knowledge: '知识库', knowledges: '知识库', document: '文档', documents: '文档',
    resource: '资源', resources: '资源', file: '文件', files: '文件', folder: '文件夹',
    folders: '文件夹', directory: '目录', directories: '目录', path: '路径',
    container: '容器', template: '模板', templates: '模板', prompt: '提示词', prompts: '提示词',
    token: '令牌', tokens: 'Token', cost: '成本', costs: '成本', duration: '时长',
    usage: '用量', setting: '设置', settings: '设置', account: '账户', user: '用户',
    users: '用户', message: '消息', messages: '消息', log: '日志', logs: '日志',
    content: '内容', title: '标题', description: '描述', status: '状态', date: '日期',
    time: '时间', error: '错误', errors: '错误', result: '结果', results: '结果',
    test: '测试', tests: '测试', query: '查询', answer: '答案', guide: '指南',
    language: '语言', code: '代码', image: '图片', link: '链接', source: '来源',
    api: 'API', token_id: '令牌 ID', price: '价格', pricing: '价格', reasoning: '推理',
    effort: '强度', mode: '模式', config: '配置', configuration: '配置',
    validation: '校验', changes: '更改', change: '更改', details: '详情', detail: '详情',
    activity: '活跃度', dashboard: '仪表盘', overview: '概览', summary: '摘要',
    // 动词
    create: '创建', creates: '创建', new: '新建', add: '添加', update: '更新',
    delete: '删除', remove: '移除', edit: '编辑', save: '保存', cancel: '取消',
    close: '关闭', open: '打开', show: '显示', hide: '隐藏', search: '搜索',
    filter: '筛选', reset: '重置', refresh: '刷新', upload: '上传', download: '下载',
    copy: '复制', paste: '粘贴', select: '选择', enter: '输入', submit: '提交',
    send: '发送', start: '开始', stop: '停止', finish: '结束', retry: '重试',
    load: '加载', generate: '生成', import: '导入', export: '导出', clear: '清除',
    rename: '重命名', move: '移动', insert: '插入', apply: '应用', discard: '放弃',
    test: '测试', validate: '校验', requires: '需要', required: '必填',
    // 形容词 / 副词
    total: '总', average: '平均', avg: '平均', recent: '最近', latest: '最新',
    previous: '上一个', next: '下一个', first: '第一', last: '最后',
    all: '全部', any: '任意', none: '无', empty: '空', loading: '加载中',
    failed: '失败', success: '成功', successful: '成功', invalid: '无效', valid: '有效',
    enabled: '已启用', disabled: '已停用', active: '进行中', inactive: '未启用',
    optional: '可选', unsaved: '未保存', saved: '已保存', created: '已创建',
    updated: '已更新', deleted: '已删除', running: '运行中', waiting: '等待中',
    completed: '已完成', stopped: '已停止', pending: '等待中',
    size: '大小', modified: '修改时间', installed: '已安装', release: '版本',
    vector: '向量', store: '库', logs: '日志', searches: '搜索', duration: '时长',
    upload: '上传', files: '文件', available: '可用', use: '使用', pull: '拉取',
    sync: '同步', running: '运行中', container: '容器', drag: '拖拽', drop: '放下',
    here: '此处', or: '或', at: '在', running_container: '运行中的容器',

    ended: '已结束', continue: '继续', pull: '拉取', sync: '同步', drag: '拖拽',

    unknown: '未知', preset: '预设', presets: '预设', preview: '预览版',
    execution: '执行', executions: '执行', breakdown: '明细', period: '时间段',
    spending: '花费', status: '状态', update: '更新', check: '检查', failed: '失败',
  };

  /* 反向表：中文 -> 英文（用于切回英文时，修复 React 重渲染后丢失原文的节点） */
  const REVERSE = (() => {
    const r = {};
    for (const [en, zh] of Object.entries(PHRASES)) {
      if (!(zh in r)) r[zh] = en;
    }
    return r;
  })();

  /* ========== 实现 ========== */
  const ATTRS = ['placeholder', 'title', 'aria-label', 'alt', 'data-placeholder', 'aria-placeholder'];
  const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'CODE', 'PRE', 'TEXTAREA', 'INPUT', 'KBD', 'SAMP']);
  const SKIP_ATTR = 'data-zh-skip';
  const LS_KEY = 'pentagi-lang';

  let enabled = true;
  let observer = null;
  const textOrig = new WeakMap();   // Text node -> 原文
  const attrOrig = new WeakMap();   // Element -> { attr: 原文 }
  const hasCJK = (s) => /[\u4e00-\u9fff]/.test(s);
  const norm = (s) => s.replace(/\s+/g, ' ').trim();

  function lookup(s) {
    if (PHRASES[s]) return PHRASES[s];
    const low = s.toLowerCase();
    if (PHRASES[low]) return PHRASES[low];
    // 去掉结尾标点后再试
    const m = s.match(/^(.*?)([.:!?]+)$/);
    if (m && PHRASES[m[1]]) return PHRASES[m[1]] + m[2];
    // 句式规则
    for (const [re, rep] of RULES) {
      if (re.test(s)) {
        const out = s.replace(re, rep);
        if (out !== s) return out;
      }
    }
    // 词级兜底
    const tokens = s.split(/\s+/);
    const mapped = tokens.map((t) => {
      const bare = t.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g, '');
      if (!bare) return { t, zh: null };
      const k = bare.toLowerCase().replace(/s$/, '');
      const zh = WORDS[bare.toLowerCase()] || WORDS[k];
      return zh ? { t, zh } : { t, zh: null };
    });
    const hit = mapped.filter((x) => x.zh).length;
    if (hit === 0 || hit / tokens.length < 0.6) return null;
    let out = '';
    for (const x of mapped) {
      if (x.zh) out += x.zh;
      else {
        const prefix = out && !/[\u4e00-\u9fff]$/.test(out) ? ' ' : '';
        out += prefix + x.t;
      }
    }
    return out;
  }

  function tr(raw) {
    const s = norm(raw);
    if (!s || hasCJK(s)) return s;
    const trailing = /(\.\.\.|…)+$/.test(s);
    const core = s.replace(/(\.\.\.|…)+$/, '');
    const tries = trailing ? [s, core + '…', core] : [s];
    for (const c of tries) {
      const hit = lookup(c);
      if (hit) return hit;
    }
    return s;
  }

  function translateNodeText(raw) {
    const key = norm(raw);
    if (!key || hasCJK(key)) return null;
    const zh = tr(key);
    if (!zh || zh === key) return null;
    return zh;
  }

  function walk(root) {
    if (!enabled || !root || root.nodeType !== 1) return;
    if (root.tagName === 'SCRIPT' || root.tagName === 'STYLE') return;
    if (root.hasAttribute?.(SKIP_ATTR)) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const p = node.parentElement;
        if (!p) return NodeFilter.FILTER_REJECT;
        if (SKIP_TAGS.has(p.tagName)) return NodeFilter.FILTER_REJECT;
        if (p.closest('[' + SKIP_ATTR + ']')) return NodeFilter.FILTER_REJECT;
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);
    for (const node of nodes) {
      const zh = translateNodeText(node.nodeValue);
      if (!zh) continue;
      if (!textOrig.has(node)) textOrig.set(node, node.nodeValue);
      const lead = node.nodeValue.match(/^\s*/)[0];
      const tail = node.nodeValue.match(/\s*$/)[0];
      node.nodeValue = lead + zh + tail;
    }

    for (const el of root.querySelectorAll('*')) {
      if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') continue;
      for (const a of ATTRS) {
        const v = el.getAttribute(a);
        if (!v) continue;
        const zh = translateNodeText(v);
        if (!zh) continue;
        const bag = attrOrig.get(el) || {};
        if (!(a in bag)) bag[a] = v;
        attrOrig.set(el, bag);
        el.setAttribute(a, zh);
      }
    }
  }

  /* ===== 还原 + 语言开关 ===== */
  function collectNodes() {
    const out = [];
    (function walkAll(node) {
      if (node.nodeType === 1) {
        out.push(node);
        for (const c of node.children) walkAll(c);
      }
    })(document.body);
    return out;
  }

  function reverseWalk(root) {
    if (!root || root.nodeType !== 1) return;
    if (root.tagName === 'SCRIPT' || root.tagName === 'STYLE') return;
    if (root.hasAttribute?.('data-zh-skip')) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);
    for (const node of nodes) {
      const p = node.parentElement;
      if (!p || SKIP_TAGS.has(p.tagName) || p.closest('[data-zh-skip]')) continue;
      const cur = (node.nodeValue || '').trim();
      if (!cur) continue;
      const en = REVERSE[cur];
      if (!en) continue;
      const lead = node.nodeValue.match(/^\s*/)[0];
      const tail = node.nodeValue.match(/\s*$/)[0];
      node.nodeValue = lead + en + tail;
    }
    for (const el of root.querySelectorAll('*')) {
      if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') continue;
      for (const a of ATTRS) {
        const v = el.getAttribute(a);
        if (!v) continue;
        const en = REVERSE[v.trim()];
        if (en) el.setAttribute(a, en);
      }
    }
  }

  function restoreAll() {
    for (const el of collectNodes()) {
      const bag = attrOrig.get(el);
      if (bag) {
        for (const a of Object.keys(bag)) {
          if (ATTRS.includes(a)) el.setAttribute(a, bag[a]);
        }
      }
      for (const node of el.childNodes) {
        if (node.nodeType !== 3) continue;
        const orig = textOrig.get(node);
        if (!orig) continue;
        const zh = translateNodeText(orig);
        const cur = node.nodeValue || '';
        if (zh && cur.replace(/\s/g, '') === zh.replace(/\s/g, '')) node.nodeValue = orig;
      }
    }
  }

  function toast(msg) {
    const t = document.createElement('div');
    t.setAttribute('data-zh-skip', '1');
    Object.assign(t.style, {
      position: 'fixed', left: '50%', bottom: '96px', transform: 'translateX(-50%)',
      zIndex: '2147483647', padding: '8px 16px', borderRadius: '8px',
      background: 'rgba(20,24,30,.95)', color: '#e8edf4',
      font: '500 13px/1.4 -apple-system,"PingFang SC",sans-serif',
      border: '1px solid rgba(255,255,255,.15)', pointerEvents: 'none',
    });
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 1600);
  }

  function langEntryEl() { return document.getElementById('pentagi-lang-entry'); }

  function ensureLangEntry() {
    // 旧版悬浮按钮：清掉
    const old = document.getElementById('pentagi-lang-toggle');
    if (old) old.remove();

    if (!location.pathname.startsWith('/settings')) return;
    const anchors = [...document.querySelectorAll('a,button')].filter((el) => {
      const t = (el.textContent || '').trim();
      return t === 'API 令牌' || t === 'API Tokens';
    });
    const anchor = anchors[anchors.length - 1];
    if (!anchor) return;
    const parent = anchor.parentElement;
    if (!parent) return;
    const existing = langEntryEl();
    if (existing && parent.contains(existing)) { updateLangEntry(); return; }

    const entry = document.createElement('a');
    entry.id = 'pentagi-lang-entry';
    entry.href = 'javascript:void(0)';
    entry.setAttribute('data-zh-skip', '1');
    if (anchor.className) entry.className = anchor.className;
    Object.assign(entry.style, {
      display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
      padding: '8px 12px', borderRadius: '8px', color: 'inherit',
      textDecoration: 'none', fontSize: '14px', marginTop: '2px',
    });
    entry.addEventListener('click', (e) => {
      e.preventDefault();
      const next = enabled ? 'en' : 'zh';
      setLang(next);
      toast(next === 'zh' ? '已切换为中文' : 'Switched to English');
    });
    anchor.insertAdjacentElement('afterend', entry);
    updateLangEntry();
  }

  function updateLangEntry() {
    const entry = langEntryEl();
    if (!entry) return;
    const label = enabled ? '🌐 语言：中文' : '🌐 Language: English';
    if (entry.textContent !== label) entry.textContent = label;
    const tip = enabled ? '点击切换到英文（快捷键 Alt+L）' : 'Click to switch to Chinese (Alt+L)';
    if (entry.title !== tip) entry.title = tip;
  }

  function setLang(lang) {
    enabled = lang !== 'en';
    try { localStorage.setItem(LS_KEY, enabled ? 'zh' : 'en'); } catch (e) { /* 忽略 */ }
    if (enabled) {
      document.documentElement.lang = 'zh-CN';
      walk(document.body);
    } else {
      document.documentElement.lang = 'en';
      restoreAll();
      reverseWalk(document.body);
    }
    ensureLangEntry();
    updateLangEntry();
  }

  function savedLang() {
    try {
      const v = localStorage.getItem(LS_KEY);
      if (v === 'off') return 'off';
      if (v === 'en' || v === 'zh') return v;
      const al = (navigator.language || '').toLowerCase();
      return al.indexOf('zh') === 0 ? 'zh' : 'en';
    } catch (e) { return 'zh'; }
  }

  function boot() {
    const sl = savedLang();
    if (sl === 'off') { enabled = false; document.documentElement.lang = 'en'; return; }
    enabled = sl !== 'en';
    document.documentElement.lang = enabled ? 'zh-CN' : 'en';
    if (enabled) walk(document.body);
    ensureLangEntry();

    document.addEventListener('keydown', (e) => {
      if (e.altKey && (e.key === 'l' || e.key === 'L')) {
        e.preventDefault();
        const next = enabled ? 'en' : 'zh';
        setLang(next);
        toast(next === 'zh' ? '已切换为中文' : 'Switched to English');
      }
    });

    observer = new MutationObserver((muts) => {
      if (!enabled) return;
      for (const m of muts) {
        if (m.target && m.target.nodeType === 1 && m.target.closest && m.target.closest('[data-zh-skip]')) continue;
        if (m.type === 'childList') {
          for (const node of m.addedNodes) {
            if (node.nodeType === 1) walk(node);
            else if (node.nodeType === 3) {
              const zh = translateNodeText(node.nodeValue || '');
              if (zh) {
                if (!textOrig.has(node)) textOrig.set(node, node.nodeValue);
                node.nodeValue = zh;
              }
            }
          }
        } else if (m.type === 'characterData') {
          const zh = translateNodeText(m.target.nodeValue || '');
          if (zh) {
            if (!textOrig.has(m.target)) textOrig.set(m.target, m.target.nodeValue);
            m.target.nodeValue = zh;
          }
        } else if (m.type === 'attributes' && m.target.nodeType === 1) {
          const a = m.attributeName;
          if (!ATTRS.includes(a)) continue;
          const v = m.target.getAttribute(a);
          if (!v) continue;
          const zh = translateNodeText(v);
          if (!zh) continue;
          const bag = attrOrig.get(m.target) || {};
          if (!(a in bag)) bag[a] = v;
          attrOrig.set(m.target, bag);
          m.target.setAttribute(a, zh);
        }
      }
    });
    setInterval(() => {
      try { if (location.pathname.startsWith('/settings')) ensureLangEntry(); } catch (e) { /* 忽略 */ }
    }, 2000);

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ATTRS,
    });
  }

  window.__pentagiZh = { tr, PHRASES, WORDS, RULES };

  function safeBoot() {
    try { boot(); } catch (e) { console.error('[i18n] boot failed', e); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', safeBoot);
  else safeBoot();
})();
