# 判题与安全说明

## 当前模式

本项目默认使用 **本机子进程判题**：

- C++：`g++ -std=c++17 ...` 编译，再运行生成的二进制
- Python：`python -B src/main.py`
- 每个提交写入系统临时目录
- 编译和运行分别设置超时
- stdout / stderr 限制大小
- 结束后删除工作目录

### 适用场景

- 个人本机学习
- 局域网课堂演示
- 受信任环境

### 不适用场景

- 公网多用户
- 接收陌生用户代码
- 竞赛级判题

本机子进程**不是安全沙箱**：用户代码仍然可以读取可访问的文件、启动子进程或消耗系统资源。

## 已做的限制

| 限制 | 位置 |
|---|---|
| 文件数量上限 | `runner.ts` |
| 单文件源码大小 | `runner.ts` |
| 全部源码大小 | `runner.ts` |
| 路径穿越检查 | `runner.ts` |
| 编译超时 | `compileTimeoutMs` |
| 运行超时 | 每题 `timeLimitMs` |
| 输出大小 | `maxOutputBytes` |
| 进程树终止 | Windows `taskkill /T /F` |
| 隐藏用例不公开 | `content/service.ts` |
| 请求参数校验 | Zod |
| 渲染 Markdown 清洗 | `rehype-sanitize` |

## Windows 性能说明

Windows Defender 可能在首次执行刚编译出的二进制时进行扫描，导致数秒延迟。运行器因此：

- 对 C++ 编译结果做缓存
- 在 Windows 上将墙钟上限设为至少 15 秒
- 仍保留每题的逻辑时间限制和输出限制

这不影响正确性，但在公网部署时应改用 Linux 容器环境。

## Windows 应用控制策略

如果运行新编译的 C++ 程序时出现：

```text
spawn UNKNOWN
系统应用控制策略阻止了程序执行
```

说明 Windows 的应用程序控制 / Smart App Control / WDAC 或安全软件拦截了刚生成的可执行文件。这不是 C++ 代码错误。

排查顺序：

1. 确认 Python 判题正常，只有 C++ 运行失败。
2. 查看 Windows 安全中心 → 应用和浏览器控制 → Smart App Control。
3. 查看 `C:\Windows\System32\CodeIntegrity\CiPolicies\Active` 是否有组织下发的 WDAC 策略。
4. 在受信任的开发环境中，将判题工作目录加入安全软件排除项，或把判题迁移到 Linux / Docker 容器。
5. 不要为了运行判题直接关闭系统安全策略；优先使用隔离容器。

本项目在 `docs/acceptance-checklist.md` 中记录了该环境限制。

## 公网部署建议

1. 将判题拆成独立服务，不与 Web/API 同容器
2. 每个提交启动一次性容器
3. 容器设置：
   - `--network none`
   - `--memory 256m`
   - `--cpus 0.5`
   - `--pids-limit 64`
   - 只读根文件系统 + 临时可写目录
4. 使用 nsjail / Firecracker / gVisor 等更强隔离
5. 队列化提交，限制并发与速率
6. 日志中不记录完整源码，除非明确告知用户

## AI 安全

- Key 仅服务端可见
- 不把隐藏用例发送给 AI
- AI 复盘只读取判题摘要、公开题面和用户代码
- AI 输出经过 schema 校验
- AI 不能改变判题通过状态
