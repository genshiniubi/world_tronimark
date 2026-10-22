# 模板与泛型

## 你会学到
- 函数模板 `template <typename T>`
- 类型推导与显式类型参数
- 把“算法”与“类型”分离

## 核心概念
模板让编译器在调用点根据实参类型生成具体代码。它适合“逻辑相同、类型不同”的场景。

```cpp
template <typename T>
T maximum(const vector<T>& values) {
    T best = values[0];
    for (const T& value : values) best = max(best, value);
    return best;
}
```

## 常见坑
- 模板定义通常放在头文件里。
- 空容器要单独处理。
- 不同类型比较时注意隐式转换。

## 练习建议
先把普通函数写对，再把类型替换成模板参数。
