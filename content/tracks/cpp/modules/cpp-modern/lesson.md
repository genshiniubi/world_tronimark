# 现代 C++ 工具箱

## 你会学到
- `auto` 与类型推导
- 范围 for 与 `const auto&`
- lambda 表达式与捕获
- `constexpr` 与编译期常量

## 核心概念
现代 C++ 的目标不是炫技，而是让意图更明显、资源更安全。优先使用标准库算法和范围 for，减少手写下标。

```cpp
vector<int> passed;
copy_if(scores.begin(), scores.end(), back_inserter(passed),
        [](int score) { return score >= 60; });
```

## 常见坑
- `auto` 会丢掉引用和 const，需要时写 `const auto&`。
- lambda 捕获引用时，注意被捕获对象的生命周期。
- 不要把复杂逻辑塞进一个巨型表达式。

## 练习建议
把一段传统循环改写成算法 + lambda，比较可读性。
