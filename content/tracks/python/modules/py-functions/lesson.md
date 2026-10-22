# 函数与模块

## 你会学到
- `def`、参数、`return`
- 默认参数与关键字参数
- `import` 与模块化

## 核心概念
函数把输入映射到输出。好的函数只做一件事，名字能说明意图。

```python
def split_bill(total: float, people: int, tip: float = 0.1) -> float:
    return total * (1 + tip) / people
```

## 常见坑
- 不要用可变对象做默认参数。
- 函数没有 `return` 时返回 `None`。
- 注意局部变量和全局变量的区别。

## 练习建议
给函数写 3 个测试用例，再接入主流程。
