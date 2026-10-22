# 单词统计 · 题解

## 思路

用字典累计词频，排序时把键设计成 `(次数降序, 单词升序)`。Python 的排序是稳定的，但这里直接用二元 key 更清楚。

## Python 3 参考代码

```python
n = int(input())
words = input().split()

counts = {}
for word in words:
    counts[word] = counts.get(word, 0) + 1
top_word = sorted(counts.items(), key=lambda item: (-item[1], item[0]))[0][0]
print(len(counts), top_word)
```

## 常见错误

- 并列时没有按字典序处理。
- 把去重数量写成 n。
