#!/usr/bin/env node
/**
 * 生成「导入 11 条中文模板」的 SQL（写入 PentAGI 的 flow_templates 表）
 *
 * 背景：PentAGI 的 API 令牌受角色权限限制，可能没有 templates.view/create；
 * 直接往数据库写更稳，且不碰前端包。
 *
 * 用法：
 *   node export-templates-sql.cjs [输出路径] [管理员邮箱]
 * 之后在宿主机执行：
 *   sudo docker exec -i pgvector psql -U postgres -d pentagidb < 输出路径
 */
const fs = require('fs');
const path = require('path');

const out = process.argv[2] || '/tmp/import-templates-zh.sql';
const mail = process.argv[3] || 'admin@pentagi.com';
const zh = JSON.parse(fs.readFileSync(path.join(__dirname, 'presets-zh.json'), 'utf8'));

const order = [
  'Web Application Security Assessment',
  'Network Infrastructure Discovery & Mapping',
  'Active Directory Penetration Test',
  'API Security Testing',
  'Cloud Infrastructure Security Audit (AWS)',
  'WordPress Security Assessment',
  'External Attack Surface Assessment',
  'Internal Network Penetration Test',
  'Mobile Application Security Testing (API Backend)',
  'DevOps & CI/CD Pipeline Security',
  'Database Security Assessment',
];

const lines = [
  '-- 导入 11 条中文模板（幂等：同标题已存在则跳过）',
  '-- 依赖：flow_templates(user_id, title, text)，users.mail 为账号邮箱',
  'BEGIN;',
  '',
];
for (const key of order) {
  const z = zh[key];
  if (!z) continue;
  const title = '中文｜' + z.title;
  lines.push(`INSERT INTO flow_templates (user_id, title, text)
SELECT u.id, '${title}', $tpl$${z.text}$tpl$
FROM users u
WHERE u.mail = '${mail}'
  AND NOT EXISTS (
    SELECT 1 FROM flow_templates t WHERE t.user_id = u.id AND t.title = '${title}'
  );`);
  lines.push('');
}
lines.push('COMMIT;', '');
lines.push("SELECT count(*) AS imported FROM flow_templates WHERE title LIKE '中文｜%';");

fs.writeFileSync(out, lines.join('\n'));
console.log('已生成', out, '模板', order.length, '条');
