# 类与对象

## 你会学到
- `class`、构造函数、成员函数
- `public` / `private` 与封装
- 用对象维护状态

## 核心概念
类把“数据”和“能对这些数据做的操作”放在一起。对外暴露稳定的方法，对内保护字段。

```cpp
class Counter {
public:
    void add(int value) { total_ += value; }
    int total() const { return total_; }
private:
    int total_ = 0;
};
```

## 常见坑
- 成员函数不修改对象时加 `const`。
- 构造函数要保证对象一创建就是合法状态。
- 不要把本应私有的字段暴露成 public。

## 练习建议
先列出对象需要维护哪些不变量，再设计方法。
