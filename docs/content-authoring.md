# 题库编写指南

## 目录约定

```text
content/tracks/<trackId>/
├─ track.json
├─ modules/<moduleId>/lesson.md
└─ problems/<slug>/
   ├─ meta.json
   ├─ statement.md
   ├─ solution.md
   ├─ starters/<language>/<entry>
   └─ solutions/<language>/<entry>
```

`trackId`、`moduleId`、题目 `id` 和 `slug` 都使用小写字母、数字和短横线。

## track.json

```json
{
  "id": "cpp",
  "title": "C++ 从入门到工程实践",
  "subtitle": "从第一行代码到容器、类与 RAII",
  "description": "……",
  "kind": "coding",
  "language": "cpp",
  "accent": "#2f6bff",
  "icon": "cpp",
  "order": 1,
  "modules": [
    {
      "id": "cpp-start",
      "title": "起步：程序、输入输出",
      "summary": "……",
      "difficulty": "beginner",
      "order": 1,
      "knowledgePoints": ["cpp-io", "cpp-variables"],
      "prerequisites": []
    }
  ]
}
```

`kind` 可为：

- `coding`：代码题，进入工作台
- `knowledge`：知识卡 / 测验（为后续系统课程预留）
- `project`：多文件项目任务（为后续工程课预留）

### 知识路径

`systems` 是一个 `kind: "knowledge"` 的示例：

- 模块不需要 `problems/` 目录
- 每个模块只需要 `lesson.md`
- TrackPage 会隐藏题目列表和判题进度，显示知识卡和“开始阅读”
- 后续可以给知识模块增加 `checks` 字段，做可持久化的自测题

## meta.json

```json
{
  "id": "cpp-start-01",
  "slug": "milk-tea-receipt",
  "title": "奶茶店订单小票",
  "moduleId": "cpp-start",
  "order": 1,
  "difficulty": "beginner",
  "scenario": "retail",
  "scenarioLabel": "商业零售",
  "knowledgePoints": ["cpp-io", "cpp-variables", "cpp-arithmetic"],
  "prerequisites": [],
  "estimatedMinutes": 10,
  "summary": "……",
  "languages": ["cpp"],
  "entryFiles": { "cpp": "src/main.cpp" },
  "timeLimitMs": 2000,
  "checker": "token",
  "samples": [
    { "id": "sample-1", "input": "12 3 10\n", "output": "32.40\n", "explanation": "……" }
  ],
  "tests": [
    { "id": "hidden-1", "input": "99 2 25\n", "output": "148.50\n" }
  ],
  "hints": ["……"],
  "similar": ["cpp-start-02"]
}
```

规则：

- `languages` 至少一个，当前支持 `cpp`、`python`
- `entryFiles` 必须为每种语言提供入口
- `samples` 至少一条，会展示给学习者
- `tests` 是隐藏用例，只由服务端读取
- `checker`：`exact`、`token`、`float`
- `knowledgePoints` 必须在 `content/taxonomy.json` 中存在
- 同一 track 内 `order` 建议唯一且递增
- `similar` 可以留空，服务端会按知识点和情景自动推荐

## 起始代码与题解

- 起始代码放在 `starters/<language>/`，入口路径与 `entryFiles` 一致
- 官方题解放在 `solutions/<language>/`，用于 `content:verify` 自动验证
- 学生通过前，`solution.md` 与官方代码不会返回给浏览器
- 题目支持多文件，例如 `src/main.cpp` + `src/helper.hpp`

## 新增知识点

先编辑 `content/taxonomy.json`：

```json
{ "id": "cpp-concurrency", "title": "并发", "description": "线程、锁与原子操作。" }
```

再在 `track.json` 的模块或 `meta.json` 中引用。

## 校验与验证

```bash
pnpm content:validate
pnpm content:verify <problem-id>
pnpm content:verify
```

- `validate`：schema、ID 唯一性、知识点、模块、顺序
- `verify`：用真实 g++ / Python 运行每道题的官方题解，必须全部通过

## 出题建议

- 先给情景，再给任务；输入输出格式必须无歧义
- 每个模块 2–4 题，核心模块可以多一道综合题
- 一道题最多 5 个知识点，主知识点不要超过 2 个
- 样例至少覆盖正常路径和一个边界
- 隐藏用例覆盖：最小输入、最大输入、特殊值、重复值
- 题解写“为什么”，不要只贴代码
- 情景轮换：生活、商业、游戏、科学、文本、系统、物流、算法
