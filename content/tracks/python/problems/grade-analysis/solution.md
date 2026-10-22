# 成绩分析 · 题解

## 思路

列表保存整批成绩后，可以直接使用内置的 sum、max、min。及格人数用生成器表达式统计，避免额外循环。

## Python 3 参考代码

```python
n = int(input())
scores = list(map(int, input().split()))

average = sum(scores) / n
maximum = max(scores)
minimum = min(scores)
pass_count = sum(1 for score in scores if score >= 60)
print(f"{average:.2f} {maximum} {minimum} {pass_count}")
```

## 常见错误

- 平均分用整除。
- 及格条件写成 >60。
