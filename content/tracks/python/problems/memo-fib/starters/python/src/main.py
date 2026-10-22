def memoize(fn):
    # TODO: 返回带缓存的 wrapper
    return fn

@memoize
def fib(n):
    if n < 2:
        return n
    return (fib(n - 1) + fib(n - 2)) % 1000000007

n = int(input())
print(fib(n))
