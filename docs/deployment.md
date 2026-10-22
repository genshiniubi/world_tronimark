# 部署说明

## 本机 / 局域网

```bash
pnpm install
pnpm build
pnpm start
```

默认监听 `127.0.0.1:3001`。如需局域网访问，在 `.env` 中修改：

```env
HOST=0.0.0.0
PORT=3001
```

然后确保防火墙放行端口，并让判题工具链在服务账户的 PATH 中可用。

## 环境变量

| 变量 | 默认 | 说明 |
|---|---|---|
| `PORT` | `3001` | 服务端口 |
| `HOST` | `127.0.0.1` | 监听地址 |
| `NODE_ENV` | `development` | `production` 时隐藏错误细节 |
| `SESSION_SECRET` | dev 值 | 用于 cookie 签名配置，生产必须修改 |
| `DATA_DIR` | `./data` | SQLite 数据目录 |
| `CXX` | 自动探测 | g++ / clang++ 路径；开发环境为 `tools/msys64/mingw64/bin/g++.exe`（GCC 16.2） |
| `CXX_STANDARD` | `c++17` | 编译标准 |
| `CXX_FLAGS` | `-O2 ...` | 编译参数 |
| `PYTHON` | 自动探测 | Python 解释器 |
| `GDB` | 自动探测 | C++ 调试用 GDB 路径；开发环境为 MSYS2 GDB 18.1 |
| `COMPILE_TIMEOUT_MS` | `15000` | 编译超时 |
| `RUN_TIMEOUT_MS` | `3000` | 默认运行超时 |
| `MAX_OUTPUT_BYTES` | `65536` | 输出上限 |
| `AI_ENABLED` | `true` | 是否启用 AI 适配 |
| `AI_BASE_URL` | 空 | OpenAI 兼容 API 根地址 |
| `AI_API_KEY` | 空 | 服务端 Key |
| `AI_MODEL` | 空 | 模型名 |

## 反向代理

推荐 Nginx：

```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

站点自身会发送 CSP、X-Frame-Options、nosniff 等安全头。

## 数据备份

SQLite 文件默认是：

```text
data/app.db
```

备份时同时保留 `app.db-wal` / `app.db-shm`（如果存在），或先停止服务再复制。也可以用 `GET /api/progress/export` 导出单个学习者的进度 JSON。

## 公网多用户

不要直接暴露本机判题。请先阅读 [judge-security.md](judge-security.md)，将判题拆成隔离容器/服务，并把并发、限流、日志与资源配额纳入部署。

## 内容更新

- 只改题目：编辑 `content/` 后重启服务即可
- 新增语言：需要增加执行器分支和前端语言扩展
- 新增系统知识：使用 `kind: "knowledge"` 的 track 与知识卡
