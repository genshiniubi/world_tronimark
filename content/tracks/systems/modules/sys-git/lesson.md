# Git 与版本控制

## 三个区域
- 工作区：你正在编辑的文件
- 暂存区：准备提交的改动
- 仓库：已经提交的历史

```bash
git status
git add src/main.cpp
git commit -m "feat: add sliding window solution"
```

## 分支
分支是一条独立的提交线。开发新功能时开分支，完成后再合并：

```bash
git switch -c feature/window
# ...修改...
git add .
git commit -m "feat: implement window"
git switch main
git merge feature/window
```

## 回滚
- 撤销工作区改动：`git restore file`
- 撤销暂存：`git restore --staged file`
- 生成一个反向提交：`git revert <commit>`
- 不要对已经推送的公共历史使用 `reset --hard`

## 提交信息
推荐格式：

```text
type(scope): summary

why this change is needed
```

常见 type：`feat`、`fix`、`docs`、`refactor`、`test`。

## 自查
1. `git add` 和 `git commit` 分别在做什么？
2. 为什么 `revert` 比 `reset --hard` 更适合公共分支？
3. 合并冲突时，你实际需要决定什么？
