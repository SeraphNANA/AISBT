# AISBT - AI 认知段位趣味测试

## 🦞 项目介绍

AISBT 是一个纯前端的趣味测试网页，测试你对 AI 工具的认知水平！

- ✅ 纯前端，无后端
- ✅ GitHub Pages 免费部署
- ✅ 无需登录，无需数据库
- ✅ 25道题，轻松有趣

## 🚀 快速开始

### 本地开发

```bash
npm install
npm run dev
```

### 构建项目

```bash
npm run build
```

## 📦 部署到 GitHub Pages

### 1. 创建 GitHub 仓库

1. 在 GitHub 上创建一个新仓库，名称可以叫 `aisbt`
2. 本地项目初始化为 git 仓库：

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/你的用户名/aisbt.git
git push -u origin main
```

### 2. 更新分享链接

修改 `src/views/Result.vue` 第11行：

```javascript
const SHARE_URL = 'https://你的用户名.github.io/aisbt/'  // 替换成你的URL
```

### 3. 开启 GitHub Pages

1. 进入仓库的 Settings
2. 找到 Pages 设置
3. Source 选择 `Deploy from a branch`
4. Branch 选择 `gh-pages`（如果没有就用 main）
5. 点击 Save

### 4. 部署（推荐方案）

使用 `gh-pages` 工具一键部署：

```bash
npm install -D gh-pages
```

在 `package.json` 中添加：

```json
{
  "scripts": {
    "deploy": "gh-pages -d dist"
  }
}
```

部署：

```bash
npm run build
npm run deploy
```

## 📁 项目结构

```
AISBT/
├── src/
│   ├── config/
│   │   ├── characters.json   # 角色配置（18个小龙虾）
│   │   ├── questions.json    # 题目配置
│   │   └── levels.json       # 等级配置
│   ├── stores/
│   │   └── quiz.ts           # Pinia状态管理
│   ├── views/
│   │   ├── Home.vue          # 首页
│   │   ├── Quiz.vue          # 答题页
│   │   └── Result.vue        # 结果页
│   └── ...
├── public/
│   └── images/characters/    # 18张小龙虾图片
└── ...
```

## 🎨 定制化

### 修改题目

编辑 `src/config/questions.json`

### 修改角色

编辑 `src/config/characters.json`，替换图片在 `public/images/characters/`

### 修改等级文案

编辑 `src/config/levels.json`

## 📋 注意事项

- 项目完全是纯前端静态页面
- 不收集任何用户数据
- 不需要服务器和数据库
- 完全适合 GitHub Pages 部署

## 📝 功能列表

- ✅ MBTI 选择
- ✅ 25道题测试
- ✅ 评分系统
- ✅ 小龙虾等级结果页
- ✅ 复制分享功能
- ✅ Web Share API 分享
- ✅ 响应式设计（手机/电脑）

## 🤔 常见问题

**Q: 为什么没有后端？**

A: 这是一个"玩具"项目，不需要保存数据，一次测试生成一张结果分享就够了～

**Q: 分享链接会保留我的结果吗？**

A: 不会，因为不需要数据库，分享只是文案+网页链接，其他人需要自己重新测试。

**Q: 可以加入永久分享功能吗？**

A: 可以，但需要加后端和数据库，成本就高了。当前方案是最适合"玩具"产品的。

---

祝你玩得开心！🦞🎉
