# 回文句子 · 题解

## 思路

用生成器表达式保留字母和数字，同时转成小写。Python 的切片 `[::-1]` 可以快速反转字符串，再与原串比较。

## Python 3 参考代码

```python
line = input()

cleaned = "".join(ch.lower() for ch in line if ch.isalnum())
print("YES" if cleaned == cleaned[::-1] else "NO")
```

## 常见错误

- 只去掉空格，没有去掉标点。
- 忘记统一大小写。
