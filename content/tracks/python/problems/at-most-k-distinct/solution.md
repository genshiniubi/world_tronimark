# 最多 K 个不同字符 · 题解

## 思路

右指针扩张窗口并增加字符计数；当不同字符数超过 k 时，左指针收缩，直到不同字符数回到 k。字典的键数量就是窗口内的不同字符数。

## Python 3 参考代码

```python
s, k = input().split()
k = int(k)

left = 0
counts = {}
best = 0
for right, ch in enumerate(s):
    counts[ch] = counts.get(ch, 0) + 1
    while len(counts) > k:
        out = s[left]
        counts[out] -= 1
        if counts[out] == 0:
            del counts[out]
        left += 1
    best = max(best, right - left + 1)
print(best)
```

## 常见错误

- 计数减到 0 后没有删除键。
- k=0 时窗口长度应为 0。
