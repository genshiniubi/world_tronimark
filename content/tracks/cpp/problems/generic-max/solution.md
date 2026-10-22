# 通用最大值 · 题解

## 思路

函数模板把类型写成 T，编译器在调用时根据实参推导。最大值初始化为第一个元素，遍历时用 const T& 避免复制。

## C++17 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;

template <typename T>
T maximum(const vector<T>& values) {
    T best = values[0];
    for (const T& value : values) {
        if (value > best) best = value;
    }
    return best;
}

int main() {
    int n;
    cin >> n;
    vector<long long> values(n);
    for (long long& value : values) cin >> value;
    cout << maximum(values) << '\n';
    return 0;
}
```

## 常见错误

- 空数组访问 values[0]。
- 模板定义放在 .cpp 中导致链接错误。
- 按值传递造成不必要复制。
