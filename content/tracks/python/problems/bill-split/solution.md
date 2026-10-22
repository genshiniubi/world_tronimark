# 账单分摊 · 题解

## 思路

函数先计算含小费的总金额，再除以人数。把计算封装起来后，输出格式和业务逻辑分开，便于复用和测试。

## Python 3 参考代码

```python
def split_bill(total, people, tip_percent=0):
    return total * (1 + tip_percent / 100) / people

total, people, tip_percent = input().split()
total = float(total)
people = int(people)
tip_percent = float(tip_percent)
print(f"{split_bill(total, people, tip_percent):.2f}")
```

## 常见错误

- 小费百分比没有除以 100。
- 人数为 0 导致除零。
