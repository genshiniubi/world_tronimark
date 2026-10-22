# 验收清单

> 本次交付已自动验证：`content:validate` 通过、`content:verify` 56/56、`pnpm test` 13/13、Playwright UI 冒烟 `errors: none`；C++17 `<optional>` 与 GDB 逐行轨迹实测通过。
>
> 验收环境：Windows 10 22H2、Node 24.21、pnpm 11.28、Python 3.12、MinGW-w64 GCC 16.2.0 / GDB 18.1。
> 每次修改后建议执行 `pnpm check`、`pnpm content:verify`、`pnpm test:e2e`。

## 内容验证说明

- 48 道编程题、56 个语言题解检查全部通过真实运行。
- C++ 编译结果带缓存；Windows 下若出现应用控制策略拦截（`spawn UNKNOWN`），重试或按 [judge-security.md](judge-security.md) 处理。
- 系统基础路径有 5 个知识模块、0 道判题，属于有意设计的知识路径。

## 1. 启动与构建

- [ ] `pnpm install` 无错误
- [ ] `pnpm dev` 同时启动 API 3001 与 Web 5173
- [ ] `pnpm build` 成功生成 `apps/web/dist`
- [ ] `pnpm start` 在 3001 提供 API 与前端页面
- [ ] `/api/health` 返回 Node、Python、C++、SQLite、AI 状态
- [ ] 直接访问 `/problems/cpp-start-01` 刷新不会 404（SPA fallback）

## 2. 主界面与学习路径

- [ ] 首页展示 4 条学习路径、学习统计、继续学习、最近活动
- [ ] 路径卡片可进入 `/tracks/:id`
- [ ] C++ 路径展示 13 个模块、22 道题
- [ ] Python 路径展示 11 个模块、18 道题
- [ ] 算法专题展示 4 个模块、8 道题
- [ ] 系统基础展示 5 个知识卡模块
- [ ] 模块可展开知识卡与题目列表
- [ ] 模块知识点显示中文标题，而不是内部 ID
- [ ] 题库可按路径、难度、状态、语言、关键词筛选
- [ ] 题库显示 48 道题

## 3. 题目工作台

- [ ] 桌面端左侧题面、右侧代码，容器不超过 1280px
- [ ] 分栏可拖动，刷新后布局仍可正常使用
- [ ] 题目 Tab：题目 / 提示 / 提交 / 题解（通过后解锁）
- [ ] 文件树支持目录、文件、入口标记、新建、删除
- [ ] 多文件标签可切换
- [ ] 编辑器有 C++ / Python 语法高亮、行号、括号匹配
- [ ] Tab 插入缩进；有候选时 Tab 接受候选
- [ ] 输入代码后弹出补全小窗，展示本地建议与 AI 建议
- [ ] 运行按钮可用，Ctrl+Enter 可用
- [ ] 提交按钮可用，Ctrl+Shift+Enter 可用
- [ ] 调试按钮可用，C++ / Python 均显示逐行轨迹与局部变量
- [ ] 笔记按钮打开侧边笔记抽屉

## 4. 判题

- [ ] C++ 样例提交可通过（需系统允许执行新编译程序）
- [ ] Python 样例提交可通过
- [ ] 错误答案显示 WA 与失败用例
- [ ] 编译错误显示 CE 与编译信息
- [ ] 运行错误显示 RE
- [ ] 超时显示 TLE
- [ ] 隐藏用例只显示状态与耗时，不泄漏输入/输出
- [ ] 提交后题目状态、题库、路径进度同步更新
- [ ] 官方题解验证：`pnpm content:verify` 全部通过

## 5. AI

- [ ] 未配置 Key 时，AI 补全回退到本地词条
- [ ] 未配置 Key 时，选中解释显示本地四段式解释
- [ ] 未配置 Key 时，提交后显示本地规则复盘
- [ ] 选中代码后出现解释浮层
- [ ] 浮层包含：含义、为什么、还能怎么写、怎样写方便
- [ ] 浮层输入框可向 AI 追问
- [ ] 浮层可固定、可关闭、Esc 可关闭
- [ ] 提交后“AI 复盘”Tab 显示优点、问题、下一步建议、复杂度
- [ ] AI 复盘推荐类似题
- [ ] AI 不改变真实判题结论

## 6. 笔记与进度

- [ ] 工作台笔记可创建、自动保存、预览、删除
- [ ] `/notes` 可查看、编辑、新建、删除笔记
- [ ] `/progress` 显示通过数、尝试数、连续天数、投入时间
- [ ] 刷新页面后进度与笔记不丢失
- [ ] `/api/progress/export` 可下载 JSON

## 7. 站点页

- [ ] `/about` 显示关于我们
- [ ] `/contact` 只显示一个邮箱入口，不出现表单或额外说明
- [ ] 点击邮箱可打开邮件客户端
- [ ] `/sponsor` 只显示赞助说明与二维码，不显示价格档位
- [ ] 二维码图片可通过 `apps/web/public/assets/sponsor-qr.svg` 替换
- [ ] 页脚包含关于、联系、赞助入口
- [ ] 站点信息可通过 `content/site/site.json` 修改

## 8. 响应式与体验

- [ ] 390×844 移动端首页无横向滚动
- [ ] 移动端顶部菜单可打开
- [ ] 工作台移动端有“题目 / 代码 / 运行”三视图
- [ ] 移动端代码视图可编辑
- [ ] 移动端运行视图可查看输出
- [ ] 移动端选中解释显示为底部抽屉
- [ ] 桌面端和移动端均无页面 JS 报错

## 9. 不依赖外部 CDN

- [ ] 页面不请求 Google Fonts
- [ ] 页面不请求国外 CDN
- [ ] 字体使用系统字体栈
- [ ] 图标为内联 SVG
- [ ] AI 请求由服务端发起
- [ ] CSP 头包含 `default-src 'self'`

## 10. 工程与文档

- [ ] `pnpm typecheck` 通过
- [ ] `pnpm test` 通过
- [ ] `pnpm content:validate` 通过
- [ ] `pnpm content:verify` 全部通过
- [ ] `pnpm test:e2e` 可生成 UI 截图并输出 `errors: none`
- [ ] README 包含目录结构、运行命令、环境要求
- [ ] `docs/content-authoring.md` 可指导新增题目
- [ ] `docs/judge-security.md` 说明本机判题的边界

## 手工验收命令

```bash
pnpm install
pnpm typecheck
pnpm content:validate
pnpm content:verify
pnpm test
pnpm build
pnpm start
```

另开终端：

```bash
curl http://127.0.0.1:3001/api/health
curl http://127.0.0.1:3001/api/bootstrap
```

浏览器打开：

- http://127.0.0.1:3001/
- http://127.0.0.1:3001/tracks/cpp
- http://127.0.0.1:3001/problems
- http://127.0.0.1:3001/problems/cpp-start-01
- http://127.0.0.1:3001/about
- http://127.0.0.1:3001/contact
- http://127.0.0.1:3001/sponsor
