# 面向对象

## 你会学到
- `class`、`__init__`、`self`
- 实例属性与方法
- 封装与对象协作

## 核心概念
类描述“有一类东西”，实例是具体的对象。方法是对象能做的操作。

```python
class Account:
    def __init__(self, balance=0):
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount
```

## 常见坑
- 忘记写 `self`。
- 类属性与实例属性混淆。
- 不要让外部代码随意改坏内部状态。

## 练习建议
先画出对象的状态，再写改变状态的方法。
