# 数据处理入门

## 你会学到
- 用字典做分组聚合
- 多关键字排序
- 输出稳定的报表格式
- 数据清洗的基本步骤

## 核心概念
数据处理的核心是“分组键 + 聚合函数”。先明确每一行代表什么，再决定按什么分组。

```python
totals = {}
for product, amount in rows:
    totals[product] = totals.get(product, 0) + amount
for product, total in sorted(totals.items(), key=lambda x: (-x[1], x[0])):
    print(product, total)
```

## 常见坑
- 排序要明确升降序和并列规则。
- 金额不要用浮点数累加太多，必要时用整数分。
- 输出前统一格式。

## 练习建议
先做分组，再做排序，最后做格式化，分三步验证。
