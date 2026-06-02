# 2026年度科技型中小企业申报自评系统

**广东知企企业管理服务有限公司** · 科技企业一站式政策申报服务

---

## 功能说明

- **在线自评**：企业在线填写信息，实时计算申报预估得分
- **条件核查**：自动校验基本条件、直通车条件
- **风险提示**：2026年度新增的实地核查风险项自动识别
- **数据收集**：企业提交后，数据自动存储，管理员可查看/导出
- **管理后台**：`/admin.html?key=zhiqi2026` 查看所有提交数据，支持 CSV 导出

## 快速部署

### 方式一：Vercel（推荐，免费）

1. 注册 [Vercel](https://vercel.com) 账号（用 GitHub 登录即可）
2. 安装 Vercel CLI：`npm i -g vercel`
3. 在本项目目录执行：
   ```bash
   vercel
   ```
4. 按提示完成部署，自动获得 `https://xxx.vercel.app` 域名

> ⚠️ Vercel 免费套餐使用 Serverless Function，文件系统为临时存储，重启后数据会丢失。生产环境建议使用方式二。

### 方式二：Railway / Render（免费，持久存储）

1. 将项目上传到 GitHub
2. 在 [Railway](https://railway.app) 或 [Render](https://render.com) 中导入该仓库
3. 启动命令：`npm start`
4. 自动部署并分配域名

### 方式三：自有服务器

```bash
# 1. 上传项目到服务器
# 2. 安装依赖
npm install

# 3. 启动（默认端口 3000）
npm start

# 4. 配置 Nginx 反向代理或直接使用 PM2 管理进程
# PM2: pm2 start server.js --name kjsme-assessment
```

环境变量：
- `PORT`：服务端口（默认 3000）

## 管理后台

访问 `http://你的域名/admin.html?key=zhiqi2026`

功能：
- 查看所有企业提交数据
- 搜索（企业名/联系人/电话）
- 展开查看详细信息
- 一键导出 CSV

## 修改管理密钥

在 `server.js` 和 `public/admin.html` 中搜索 `zhiqi2026`，替换为你的自定义密钥。

## 自定义公司信息

编辑 `public/index.html`：
- 顶部品牌条（公司名称、Logo）
- 底部联系方式（电话、邮箱、地址）

## 数据存储

提交数据存储在 `data/submissions.json`，JSON 数组格式，方便对接其他系统。

## 技术栈

- 后端：Node.js + Express
- 前端：原生 HTML/CSS/JS（无框架，加载快）
- 数据：JSON 文件存储
