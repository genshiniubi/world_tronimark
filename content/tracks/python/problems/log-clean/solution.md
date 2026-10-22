# 日志清洗 · 题解

## 思路

读取整行后用 strip 去掉行首尾空白，再判断是否以 ERROR 开头。只统计级别，不需要切分整条消息。

## Python 3 参考代码

```python
import sys

n = int(sys.stdin.readline())
errors = 0
for _ in range(n):
    line = sys.stdin.readline().strip()
    if line.startswith("ERROR"):
        errors += 1
print(errors)
```

## 常见错误

- 用 input().split() 只拿到第一个词，但这里其实够用；不过消息中包含空格时容易误判。
- 忘记忽略前导空格。
