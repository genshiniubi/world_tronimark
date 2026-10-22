# 架构说明

## 总览

```text
浏览器（React SPA）
  │  REST / JSON
  ▼
Fastify API（apps/server）
  ├─ content loader：读取并校验 content/
  ├─ judge：CodeMirror 提交 → 本地编译器 / Python
  ├─ AI adapter：OpenAI 兼容接口 / 本地降级
  └─ SQLite：学习者、进度、提交、笔记、留言（预留）、AI 缓存
```

开发模式下，Vite 在 5173 端口运行，并将 `/api` 代理到 3001。生产模式下，Fastify 同时提供 API、`/assets/*` 静态资源和 SPA fallback。

## 前端

- `app/App.tsx`：路由表
- `components/AppShell.tsx`：顶部导航、站点上下文、页脚、加载/错误壳层
- `features/home`：主界面
- `features/tracks`：学习路径与模块知识卡
- `features/problems`：题库筛选
- `features/workspace`：题目工作台
- `editor/EditorPane.tsx`：CodeMirror 实例、AI 补全、选区事件、快捷键
- `features/workspace/SelectionCard.tsx`：四段式代码解释 + AI 追问
- `features/workspace/ConsolePane.tsx`：运行 / 用例 / 调试 / AI 复盘 / 提交记录

### 工作台状态

- 当前语言、当前文件、文件内容保存在 React state
- 草稿按 `codelab:draft:<problemId>:<language>` 写入 `localStorage`
- 切换语言前保存当前草稿，再加载目标语言草稿
- 提交后刷新题目、题库、学习路径和 dashboard 查询

## 后端

### 内容

- `content/registry.json` 指定加载哪些路径
- `content/taxonomy.json` 是知识点唯一来源
- `content/tracks/<id>/track.json` 定义模块和顺序
- `content/tracks/<id>/modules/<moduleId>/lesson.md` 是知识卡
- `content/tracks/<id>/problems/<slug>/` 是一道题
- 隐藏用例只存在服务端；`toProblemDetail` 只返回 `samples`

### 判题

1. 校验请求（Zod）
2. 加载题目和入口文件
3. 写入临时目录
4. C++ 编译一次，结果进入内存 + 临时磁盘缓存
5. 逐用例运行，限制时间、输出大小
6. 使用 exact / token / float 比对
7. 记录 submission 与 progress
8. 返回公开用例详情；隐藏用例只返回结果和耗时

### 数据库

| 表 | 用途 |
|---|---|
| `learners` | 匿名学习者档案 |
| `progress` | 每道题的状态、尝试次数、首次通过时间 |
| `submissions` | 提交快照、判题结果、编译输出 |
| `notes` | 题目笔记与通用笔记 |
| `contact_messages` | 联系服务留言（预留） |
| `ai_cache` | AI 解释 / 补全 / 复盘缓存 |

数据库文件默认位于 `data/app.db`，首次启动自动建表。

### API

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/health` | 工具链、数据库、AI 状态 |
| GET | `/api/bootstrap` | 站点、路径、AI、健康信息 |
| GET | `/api/dashboard` | 首页统计、最近活动、继续学习 |
| GET | `/api/tracks` | 路径列表 |
| GET | `/api/tracks/:id` | 路径详情与模块 |
| GET | `/api/problems` | 题库列表与筛选 |
| GET | `/api/problems/:id` | 题目公开详情 |
| POST | `/api/run` | 自定义输入运行 |
| POST | `/api/submit` | 样例 + 隐藏用例判题 |
| POST | `/api/debug` | C++（GDB）/ Python 逐行轨迹 |
| POST | `/api/ai/complete` | 补全候选 |
| POST | `/api/ai/explain` | 四段式解释与追问 |
| POST | `/api/ai/review` | 提交复盘 |
| GET/POST | `/api/notes` | 笔记列表 / 创建 |
| PUT/DELETE | `/api/notes/:id` | 更新 / 删除 |
| GET | `/api/progress` | 进度列表 |
| GET | `/api/progress/export` | 导出 JSON |
| GET | `/api/site/:slug` | 关于 / 联系 / 赞助内容 |
| POST | `/api/contact` | 留言落库（预留，当前联系页不展示表单） |

## 安全边界

- Cookie 仅保存随机学习者 ID，不包含个人信息
- AI Key 只在服务端
- 前端通过 CSP 限制外部资源
- 隐藏用例不进入公开详情
- 本地判题不是多租户沙箱，公网部署前必须增加隔离执行器
