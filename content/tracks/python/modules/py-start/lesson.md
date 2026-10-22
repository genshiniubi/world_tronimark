# 起步：输入、输出与类型

## 你会学到
- `input()` 读入字符串
- `int()`、`float()` 类型转换
- f-string 格式化
- `print()` 的换行行为

## 核心概念
`input()` 永远返回字符串。要做算术，先转换类型。

```python
price = int(input())
count = int(input())
total = price * count
print(f"{total:.2f}")
```

## 常见坑
- 用 `split()` 一次读多个数。
- 金额计算注意浮点误差，输出时格式化。
- 行末空格可能影响判题，尽量按格式输出。

## 练习建议
每次读入后先打印类型和值，确认转换正确。
