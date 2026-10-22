# 生成器与装饰器

## 你会学到
- `yield` 与生成器
- 迭代器协议
- 闭包与装饰器
- `functools.wraps`

## 核心概念
生成器一次产出一个值，适合大数据流。装饰器接收函数并返回新函数，用来加日志、缓存、计时等横切逻辑。

```python
def memoize(fn):
    cache = {}
    def wrapper(n):
        if n not in cache:
            cache[n] = fn(n)
        return cache[n]
    return wrapper
```

## 常见坑
- 生成器只能遍历一次。
- 装饰器返回的新函数要保留原函数的元信息。
- 缓存要注意参数是否可哈希。

## 练习建议
先写普通函数，再套一层 wrapper，最后加 `@decorator`。
