# 汇率换算 · 题解

## 思路

汇率是“1 美元兑多少人民币”，所以人民币除以汇率得到美元。输入需要转成浮点数，输出保留两位小数。

## Python 3 参考代码

```python
cny, rate = input().split()
cny = float(cny)
rate = float(rate)
usd = cny / rate
print(f"{usd:.2f}")
```

## 常见错误

- 把除法写反。
- 整数相除导致小数丢失。
