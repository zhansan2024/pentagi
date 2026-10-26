#!/usr/bin/env node
/**
 * 汉化 PentAGI 前端内置的 11 个「预设模板」（标题 + 正文）。
 *
 * 背景：预设模板硬编码在前端打包产物里（assets/template-*.js），
 * 不是数据库数据，运行时翻译只能改显示、不能改填充内容，所以这里直接改包。
 *
 * 用法：
 *   FE_DIR=/vol3/1000/opencode生成文件/pentagi-zh/fe-zh \
 *   SRC_TSX=/tmp/pentagi/frontend/src/pages/templates/template.tsx \
 *   node patch-presets-zh.cjs
 *
 * 说明：
 *   - FE_DIR   前端静态目录（默认挂载到容器 /opt/pentagi/fe）
 *   - SRC_TSX  PentAGI 源码里的 template.tsx，用来提取英文原文
 *   - 翻译表与本脚本同目录的 presets-zh.json
 *   - 会生成新的 chunk 与主包文件名（template-zh1.js / index-zh1.js）并改写 index.html，绕过浏览器缓存
 */
const fs = require('fs');
const path = require('path');

const FE = process.env.FE_DIR || '/mnt/gen/pentagi-zh/fe-zh';
const SRC = process.env.SRC_TSX || '/tmp/pentagi/frontend/src/pages/templates/template.tsx';
const ZH = JSON.parse(fs.readFileSync(path.join(__dirname, 'presets-zh.json'), 'utf8'));

if (!fs.existsSync(SRC)) { console.error('找不到源码 template.tsx:', SRC); process.exit(1); }
if (!fs.existsSync(FE)) { console.error('找不到前端目录:', FE); process.exit(1); }

// 1. 从源码提取 11 个预设的英文原文
const src = fs.readFileSync(SRC, 'utf8');
const presets = [];
const re = /text:\s*`([\s\S]*?)`,\s*\n\s*title:\s*'([^']+)'/g;
let m;
while ((m = re.exec(src))) presets.push({ text: m[1], title: m[2] });
if (!presets.length) { console.error('未能解析到预设，检查 SRC_TSX'); process.exit(1); }

// 2. 找到包含预设的 chunk
const assetsDir = path.join(FE, 'assets');
const chunkName = fs.readdirSync(assetsDir).find((f) =>
  f.startsWith('template-') && fs.readFileSync(path.join(assetsDir, f), 'utf8').includes('Perform comprehensive security assessment')
);
if (!chunkName) { console.error('找不到包含预设的 chunk'); process.exit(1); }
console.log('chunk:', chunkName);

const esc = (s) => JSON.stringify(s).slice(1, -1);
let chunk = fs.readFileSync(path.join(assetsDir, chunkName), 'utf8');
let okText = 0, okTitle = 0;
for (const p of presets) {
  const zh = ZH[p.title];
  if (!zh) { console.log('缺翻译:', p.title); continue; }
  const from = esc(p.text), to = esc(zh.text);
  if (chunk.includes(from)) { chunk = chunk.split(from).join(to); okText++; }
  else console.log('正文未匹配:', p.title);
  const tf = '"' + p.title + '"', tt = '"' + zh.title + '"';
  if (chunk.includes(tf)) { chunk = chunk.split(tf).join(tt); okTitle++; }
  else console.log('标题未匹配:', p.title);
}
console.log(`正文替换 ${okText}/${presets.length}，标题替换 ${okTitle}/${presets.length}`);

const newChunk = 'template-zh1.js';
fs.writeFileSync(path.join(assetsDir, newChunk), chunk);

// 3. 主包改引用 + 改名；index.html 指向新主包
const idxPath = path.join(FE, 'index.html');
let idx = fs.readFileSync(idxPath, 'utf8');
const mainRef = (idx.match(/\/assets\/(index-[A-Za-z0-9_-]+\.js)/) || [])[1];
if (!mainRef) { console.error('index.html 里找不到主包引用'); process.exit(1); }
let main = fs.readFileSync(path.join(assetsDir, mainRef), 'utf8');
const refs = (main.match(new RegExp(chunkName.replace(/\./g, '\\.'), 'g')) || []).length;
main = main.split(chunkName).join(newChunk);
fs.writeFileSync(path.join(assetsDir, 'index-zh1.js'), main);
idx = idx.replace(mainRef, 'index-zh1.js');
fs.writeFileSync(idxPath, idx);

console.log('主包引用替换次数:', refs);
console.log('完成：index.html -> index-zh1.js -> template-zh1.js，强刷浏览器生效');
