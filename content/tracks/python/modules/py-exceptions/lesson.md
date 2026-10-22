# 异常处理

## 你会学到
- `try / except / else / finally`
- 捕获具体异常而不是所有异常
- 用异常表达“无法完成”

## 核心概念
异常不是错误掩盖，而是把“正常流程”和“失败处理”分开。

```python
try:
    value = int(text)
except ValueError:
    print("ERROR")
```

## 常见坑
- 不要写裸 `except:` 吞掉所有错误。
- `finally` 总会执行，适合清理资源。
- 除零是 `ZeroDivisionError`。

## 练习建议
为每个 `except` 写清楚“我在处理什么失败”。
