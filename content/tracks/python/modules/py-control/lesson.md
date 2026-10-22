# 条件与循环

## 你会学到
- `if / elif / else`
- `for ... in range(...)`
- `while`、`break`、`continue`
- 计数器和累加器

## 核心概念
Python 用缩进表示代码块。条件判断可以直接使用真值：空列表、空字符串、0 都是假。

```python
total = 0
for _ in range(n):
    total += int(input())
print(total)
```

## 常见坑
- `range(n)` 不包含 n。
- 修改列表时遍历它可能跳过元素。
- 多层条件注意顺序。

## 练习建议
用几个边界值测试条件分支：最小、最大、刚好等于阈值。
