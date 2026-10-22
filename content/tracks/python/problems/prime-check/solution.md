# 素数判断 · 题解

## 思路

先处理 1 和偶数，再从 3 开始只试奇数因子，循环到 i*i > n。这样比逐个试除快得多，能处理 10^12 范围。

## Python 3 参考代码

```python
def is_prime(n):
    if n < 2:
        return False
    if n % 2 == 0:
        return n == 2
    i = 3
    while i * i <= n:
        if n % i == 0:
            return False
        i += 2
    return True

n = int(input())
print("YES" if is_prime(n) else "NO")
```

## 常见错误

- 把 1 当成素数。
- 循环到 n，超时。
- 没有单独处理 2。
