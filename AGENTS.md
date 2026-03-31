# NotionNext 项目上下文指南

本文档为 AI 助手提供项目的完整上下文信息，帮助理解和操作 NotionNext 代码库。

## 项目概述

NotionNext 是一个使用 **Next.js + Notion API** 实现的静态博客系统，可部署在 Vercel、Netlify、Docker 等多种平台。项目将 Notion 作为 CMS（内容管理系统），支持多主题、多语言、评论系统等丰富功能。

**核心特点：**
- 以 Notion 作为数据源和后台管理
- 支持 21 种主题风格（hexo, next, medium, fukasawa 等）
- 支持多语言（zh-CN, en-US, zh-TW, zh-HK, fr-FR, ja-JP, tr-TR）
- 丰富的插件生态（评论、统计、AI 摘要、动画效果等）

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 14.x |
| 语言 | JavaScript / TypeScript |
| 样式 | Tailwind CSS |
| Notion渲染 | react-notion-x |
| 评论系统 | Twikoo, Giscus, Gitalk, Waline 等 |
| 部署 | Vercel / Netlify / Docker / 静态导出 |

## 项目结构

```
NotionNext/
├── blog.config.js        # 核心配置文件（入口）
├── conf/                 # 模块化配置目录
│   ├── comment.config.js # 评论系统配置
│   ├── analytics.config.js # 统计分析配置
│   ├── widget.config.js  # 挂件配置（客服、音乐等）
│   ├── animation.config.js # 动画效果配置
│   ├── post.config.js    # 文章列表配置
│   └── ...
├── themes/               # 主题目录（21个主题）
│   ├── hexo/            # Hexo 风格主题
│   ├── next/            # Next 风格主题
│   ├── medium/          # Medium 风格主题
│   └── theme.js         # 主题加载逻辑
├── components/           # React 组件库
│   ├── Comment.js       # 评论组件
│   ├── NotionPage.js    # Notion 页面渲染
│   ├── SEO.js           # SEO 组件
│   └── ui/              # UI 基础组件
├── pages/                # Next.js 页面路由
│   ├── _app.js          # 应用入口
│   ├── index.js         # 首页
│   ├── [prefix]/        # 动态文章路由
│   ├── api/             # API 路由
│   ├── tag/             # 标签页
│   ├── category/        # 分类页
│   └── search/          # 搜索页
├── lib/                  # 核心工具库
│   ├── notion/          # Notion API 封装
│   ├── cache/           # 缓存系统
│   ├── utils/           # 工具函数
│   ├── lang/            # 多语言支持
│   └── config.js        # 配置处理
├── public/               # 静态资源
├── styles/               # 全局样式
├── types/                # TypeScript 类型定义
└── scripts/              # 构建和开发脚本
```

## 构建与运行命令

```bash
# 开发模式
npm run dev              # 启动开发服务器 (localhost:3000)

# 生产构建
npm run build            # 构建生产版本
npm run start            # 运行生产服务器

# 静态导出（用于静态托管）
npm run export           # 导出静态文件到 out/ 目录

# 代码质量
npm run lint             # ESLint 检查
npm run lint:fix         # 自动修复 ESLint 问题
npm run format           # Prettier 格式化
npm run type-check       # TypeScript 类型检查
npm run quality          # 完整质量检查
npm run pre-commit       # 预提交检查（lint + format + type-check）

# 测试
npm run test             # 运行 Jest 测试
npm run test:watch       # 监听模式运行测试
npm run test:coverage    # 生成测试覆盖率报告

# 开发工具
npm run init-dev         # 初始化开发环境
npm run clean            # 清理项目文件
npm run bundle-report    # 分析包大小
npm run check-updates    # 检查依赖更新

# Git Hooks
npm run setup-hooks      # 安装 Git 钩子
npm run remove-hooks     # 移除 Git 钩子
```

## 配置系统

### 配置优先级（从高到低）

1. **Notion 配置表** - 在 Notion 数据库中直接配置
2. **环境变量** - `.env.local` 文件或平台环境变量
3. **blog.config.js** - 默认配置文件

### 核心配置项

```javascript
// blog.config.js 核心配置
const BLOG = {
  NOTION_PAGE_ID: '...',     // Notion 页面 ID（必需）
  THEME: 'hexo',             // 主题名称
  LANG: 'zh-CN',             // 默认语言
  AUTHOR: '作者名',           // 站点作者
  LINK: 'https://...',       // 站点链接
  
  // 更多配置在 conf/ 目录下
  ...require('./conf/comment.config'),
  ...require('./conf/analytics.config'),
  // ...
}
```

### 环境变量示例

```bash
# .env.local
NOTION_PAGE_ID=your-notion-page-id

# 可选配置
NEXT_PUBLIC_THEME=hexo
NEXT_PUBLIC_AUTHOR=YourName
NEXT_PUBLIC_LANG=zh-CN
```

## 主题系统

### 主题列表

| 主题名 | 风格描述 |
|--------|----------|
| hexo | 经典博客风格 |
| next | 简洁现代风格 |
| medium | Medium 风格 |
| fukasawa | 卡片式瀑布流 |
| matery | Material Design |
| gitbook | 文档风格 |
| heo | 现代动态风格 |
| nobelium | 极简风格 |
| simple | 极简纯净 |
| photo | 摄影作品集 |
| plog | 图片博客 |
| commerce | 电商风格 |
| landing | 着陆页 |
| magazine | 杂志风格 |
| movie | 影视风格 |
| nav | 导航站 |
| proxio | 商务风格 |
| starter | 启动器风格 |
| typography | 排版风格 |
| game | 游戏风格 |
| example | 开发模板 |

### 主题切换

- URL 参数切换：`?theme=next`
- 配置文件切换：修改 `blog.config.js` 中的 `THEME` 值

### 创建新主题

1. 复制 `themes/example` 目录为新主题名
2. 实现必需的布局组件：
   - `LayoutBase` - 基础布局
   - `LayoutIndex` - 首页布局
   - `LayoutSlug` - 文章页布局
   - `LayoutSearch` - 搜索页布局
   - `LayoutArchive` - 归档页布局
   - `Layout404` - 404 页面

## Notion 数据结构

NotionNext 使用特定的 Notion 数据库结构：

**必需字段：**
- `title` - 文章标题
- `slug` - URL 别名
- `status` - 发布状态（Published/Draft）
- `type` - 内容类型（Post/Page/Menu）

**可选字段：**
- `summary` - 文章摘要
- `date` - 发布日期
- `tags` - 标签
- `category` - 分类
- `icon` - 图标

## 组件开发

### 常用组件路径

| 组件 | 路径 | 用途 |
|------|------|------|
| NotionPage | `components/NotionPage.js` | Notion 内容渲染 |
| Comment | `components/Comment.js` | 评论系统集成 |
| SEO | `components/SEO.js` | SEO 元数据 |
| LazyImage | `components/LazyImage.js` | 懒加载图片 |
| ShareBar | `components/ShareBar.js` | 分享按钮 |
| NotionIcon | `components/NotionIcon.js` | Notion 图标 |

### 组件命名规范

- **组件文件**: PascalCase (如 `LazyImage.js`)
- **普通文件**: kebab-case (如 `blog.config.js`)
- **变量/函数**: camelCase (如 `getPostBlocks`)
- **常量**: UPPER_SNAKE_CASE (如 `API_BASE_URL`)

## 多语言支持

### 支持的语言

- `zh-CN` - 简体中文
- `zh-TW` - 繁体中文（台湾）
- `zh-HK` - 繁体中文（香港）
- `en-US` - 英语
- `fr-FR` - 法语
- `ja-JP` - 日语
- `tr-TR` - 土耳其语

### 语言文件位置

```
lib/lang/
├── zh-CN.js
├── en-US.js
├── zh-TW.js
└── ...
```

### 多语言站点配置

```javascript
// blog.config.js
NOTION_PAGE_ID: '主站点ID,zh:中文站点ID,en:英文站点ID'
```

## 部署方式

### Vercel（推荐）

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

### Docker

```bash
# 构建镜像
docker build -t notionnext .

# 运行容器
docker run -p 3000:3000 -e NOTION_PAGE_ID=your-id notionnext
```

### 静态导出

```bash
# 导出静态文件
npm run export

# 输出到 out/ 目录
```

## 提交规范

使用 Conventional Commits 规范：

```
<type>(<scope>): <description>

# 类型说明：
feat     - 新功能
fix      - Bug 修复
docs     - 文档更新
style    - 代码格式化
refactor - 代码重构
test     - 测试相关
chore    - 构建/工具变动
perf     - 性能优化
```

## 常见开发任务

### 添加新评论系统

1. 创建组件文件 `components/NewComment.js`
2. 在 `conf/comment.config.js` 添加配置项
3. 在 `components/Comment.js` 中集成

### 添加新统计服务

1. 创建组件文件 `components/NewAnalytics.js`
2. 在 `conf/analytics.config.js` 添加配置
3. 在 `components/AnalyticsBusuanzi.js` 或相关位置集成

### 添加新主题

1. 复制 `themes/example/` 为新主题目录
2. 实现布局组件
3. 在 `next.config.js` 中自动识别

### 添加新语言

1. 复制 `lib/lang/en-US.js` 为新语言文件
2. 翻译所有文本
3. 在 `lib/lang.js` 中导入并注册

## 关键 API 路由

| 路由 | 用途 |
|------|------|
| `/api/search` | 站内搜索 |
| `/api/rss` | RSS 订阅 |
| `/sitemap.xml` | 站点地图 |

## 注意事项

1. **Node.js 版本要求**: >= 20.0.0
2. **Notion 页面 ID 必须正确配置**
3. **修改配置后需重启开发服务器**
4. **静态导出时不支持服务端功能（如 API 路由）**
5. **图片域名需在 `next.config.js` 的 `images.domains` 中配置**

## 相关文档

- [开发指南](./DEVELOPMENT.md)
- [部署指南](./DEPLOYMENT.md)
- [贡献指南](./CONTRIBUTING.md)
- [帮助文档](https://docs.tangly1024.com/)
