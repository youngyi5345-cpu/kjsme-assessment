const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// ── 中间件 ──
app.use(express.json({ limit: '50kb' }));
app.use(express.static(path.join(__dirname, 'docs')));

// ── 数据目录 ──
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
const DB_PATH = path.join(DATA_DIR, 'submissions.json');

// ── 读取/写入 JSON 数据库 ──
function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) return [];
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}
function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// ── API: 提交表单 ──
app.post('/api/submit', (req, res) => {
  try {
    const submission = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      submittedAt: new Date().toISOString(),
      ip: req.ip,
      ...req.body
    };

    const db = readDB();
    db.push(submission);
    writeDB(db);

    console.log(`✅ 新提交: ${submission.companyName || '未知企业'} (ID: ${submission.id})`);
    res.json({ success: true, id: submission.id, message: '提交成功！我们的顾问将尽快与您联系。' });
  } catch (e) {
    console.error('提交失败:', e.message);
    res.status(500).json({ success: false, message: '服务器错误，请稍后重试' });
  }
});

// ── API: 获取所有提交（管理员） ──
app.get('/api/submissions', (req, res) => {
  const { key } = req.query;
  if (key !== 'zhiqi2026') {
    return res.status(401).json({ error: '未授权访问' });
  }
  const db = readDB();
  res.json({ count: db.length, submissions: db.reverse() });
});

// ── API: 导出 CSV ──
app.get('/api/export', (req, res) => {
  const { key } = req.query;
  if (key !== 'zhiqi2026') {
    return res.status(401).json({ error: '未授权访问' });
  }
  const db = readDB();
  if (db.length === 0) return res.send('暂无数据');

  const headers = ['提交时间', '企业名称', '联系人', '联系电话', '邮箱',
    '注册地', '成立日期', '所属行业', '注册类型',
    '职工总数', '年销售收入(万元)', '资产总额(万元)',
    '科技人员数', '科技人员占比', '科技人员得分',
    '研发费用(万元)', '成本费用(万元)', '研发占收入比', '研发占成本比', '研发得分',
    'Ⅰ类IP数', 'Ⅱ类IP数', 'IP得分',
    '总分', '是否满足直通车', '风险评估', '备注'];

  const escapeCSV = (v) => {
    if (v == null) return '';
    const s = String(v).replace(/"/g, '""');
    return /[,"\n\r]/.test(s) ? `"${s}"` : s;
  };

  const rows = db.map(s => [
    s.submittedAt || '', s.companyName || '', s.contactName || '', s.contactPhone || '', s.contactEmail || '',
    s.regLocation || '', s.establishDate || '', s.industry || '', s.regType || '',
    s.empCount || '', s.revenue || '', s.assets || '',
    s.techStaff || '', s.techRatio || '', s.techScore || '',
    s.rdCost || '', s.costTotal || '', s.rdRevRatio || '', s.rdCostRatio || '', s.rdScore || '',
    s.ipClass1 || '', s.ipClass2 || '', s.ipScore || '',
    s.totalScore || '', s.hasDirect || '', s.riskWarnings || '', s.remark || ''
  ].map(escapeCSV).join(','));

  const csv = '﻿' + headers.join(',') + '\n' + rows.join('\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="申报数据_${new Date().toISOString().slice(0,10)}.csv"`);
  res.send(csv);
});

// ── SPA fallback ──
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 科技型中小企业申报自评系统已启动`);
  console.log(`   访问: http://localhost:${PORT}`);
  console.log(`   管理: http://localhost:${PORT}/admin.html?key=zhiqi2026`);
});
