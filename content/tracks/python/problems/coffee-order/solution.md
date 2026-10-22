# 咖啡店订单 · 题解

## 思路

先把输入拆成三个值并转换类型，再按“原价 × 折扣比例”计算。f-string 的 `:.2f` 负责固定两位小数。

## Python 3 参考代码

```python
price, count, discount = input().split()
price = float(price)
count = int(count)
discount = int(discount)

subtotal = price * count
total = subtotal * (100 - discount) / 100
print(f"{total:.2f}")
```

## 常见错误

- 忘记把 price 转成 float。
- 折扣百分比没有除以 100。
