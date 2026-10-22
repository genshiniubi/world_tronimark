# 销售报表 · 题解

## 思路

用字典按商品累计金额。排序时用 `(-total, product)` 一次表达“金额降序、名称升序”。

## Python 3 参考代码

```python
n = int(input())
totals = {}
for _ in range(n):
    product, amount = input().split()
    totals[product] = totals.get(product, 0) + int(amount)
for product, total in sorted(totals.items(), key=lambda item: (-item[1], item[0])):
    print(product, total)
```

## 常见错误

- 只按金额排序，金额相同时顺序不稳定。
- 忘记把 amount 转成 int。
