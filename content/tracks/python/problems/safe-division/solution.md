# 安全除法 · 题解

## 思路

`float(a)` 可能抛出 ValueError，除以 0 会抛出 ZeroDivisionError。把这两类异常放在同一个 except 中处理，成功时用 else 输出结果。

## Python 3 参考代码

```python
a, b = input().split()

try:
    result = float(a) / float(b)
except (ValueError, ZeroDivisionError):
    print("ERROR")
else:
    print(f"{result:.2f}")
```

## 常见错误

- 只捕获一种异常。
- 用裸 except 吞掉所有错误。
- 除零后继续使用结果。
