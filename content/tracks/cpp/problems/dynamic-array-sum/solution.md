# 动态数组求和 · 题解

## 思路

unique_ptr<int[]> 在离开作用域时自动释放数组，不需要手写 delete[]。它独占所有权，不能复制，适合这种一次性分配的场景。

## C++17 参考代码

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    auto data = make_unique<int[]>(n);
    long long total = 0;
    for (int i = 0; i < n; ++i) {
        cin >> data[i];
        total += data[i];
    }
    cout << total << '\n';
    return 0;
}
```

## 常见错误

- 用 unique_ptr 后又手动 delete[]，造成重复释放。
- 试图复制 unique_ptr。
