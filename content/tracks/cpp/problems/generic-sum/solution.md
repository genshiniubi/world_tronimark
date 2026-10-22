# 泛型求和 · 题解

## 思路

模板函数用 T 表示元素类型，累加器也用 T 初始化。这样同一份逻辑可以服务 int、long long 等类型。

## C++17 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;

template <typename T>
T sum(const vector<T>& values) {
    T total{};
    for (const T& value : values) total += value;
    return total;
}

int main() {
    int n;
    cin >> n;
    vector<long long> values(n);
    for (long long& value : values) cin >> value;
    cout << sum(values) << '\n';
    return 0;
}
```

## 常见错误

- 累加器写成 int，导致大数溢出。
- 返回类型写死为 int。
