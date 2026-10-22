# Linux 与命令行

## 命令行不是黑框
命令行是一个可组合的工作台。每个命令做一件小事，通过管道把结果交给下一个命令。

```bash
ps aux | grep python | head
```

## 路径
- 绝对路径：`/home/me/project`
- 相对路径：`./src/main.cpp`、`../data.csv`
- `~` 是当前用户的家目录
- `.` 当前目录，`..` 上级目录

## 常用命令
| 目的 | 命令 |
|---|---|
| 看目录 | `ls -la` |
| 切目录 | `cd path` |
| 看文件 | `cat file` / `less file` |
| 查找 | `find . -name "*.py"` / `grep -rn "TODO" .` |
| 权限 | `chmod +x run.sh` |
| 进程 | `ps aux` / `kill PID` |
| 空间 | `df -h` / `du -sh *` |

## 权限的三个数字
`rwx` 分别对应读、写、执行。`chmod 755 file` 表示：

- 所有者：4+2+1 = 7
- 同组：4+1 = 5
- 其他人：4+1 = 5

## 自查
1. 如何查看一个目录下所有 `.log` 文件的大小？
2. `command > out.txt` 和 `command >> out.txt` 有什么区别？
3. 为什么不要直接 `chmod 777` 一个生产文件？

> 提示：`du -sh *.log`；`>` 覆盖，`>>` 追加；777 让所有人都能写，风险很高。
