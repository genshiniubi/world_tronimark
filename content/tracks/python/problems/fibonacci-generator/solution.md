# 斐波那契生成器 · 题解

## 思路

生成器每次 `yield a` 后暂停，调用方取下一个值时才继续。用 `a, b = b, a + b` 同时推进两个状态，不需要保存整个序列。

## Python 3 参考代码

```python
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

n = int(input())
print(" ".join(str(x) for x in fibonacci(n)))
```

## 常见错误

- 用 return 返回列表，失去惰性。
- n=0 时输出空行。
- 循环次数差一。
