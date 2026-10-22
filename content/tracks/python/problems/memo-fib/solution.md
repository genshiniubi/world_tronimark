# 带缓存的斐波那契 · 题解

## 思路

memoize 用闭包保存 cache，wrapper 在调用原函数前先查缓存。fib 每次结果取模，递归树被剪成线性。

## Python 3 参考代码

```python
def memoize(fn):
    cache = {}

    def wrapper(n):
        if n not in cache:
            cache[n] = fn(n)
        return cache[n]

    return wrapper

@memoize
def fib(n):
    if n < 2:
        return n
    return (fib(n - 1) + fib(n - 2)) % 1000000007

n = int(input())
print(fib(n))
```

## 常见错误

- 没有保存缓存，装饰器无效。
- 取模位置错误。
- 递归深度超过限制（n 很大时改用迭代）。
