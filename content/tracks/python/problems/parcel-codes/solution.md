# 快递柜取件码 · 题解

## 思路

取件码可能以 0 开头，因此必须按字符串处理。合法条件是长度为 6 且全部为数字，用 `isdigit()` 判断最直接。

## Python 3 参考代码

```python
n = int(input())
codes = input().split()

valid = 0
for code in codes:
    if len(code) == 6 and code.isdigit():
        valid += 1
print(valid)
```

## 常见错误

- 先转 int，丢失前导 0 和长度信息。
- 忘记判断长度。
